#!/usr/bin/env node
/**
 * Validates public/library-seed.csv against the subcategory IDs declared
 * in setup.sql. Fails loudly if any row points at a subcategory or category
 * that the buyer's fresh database won't have — preventing the "subcategories
 * didn't copy over" class of bug from recurring silently.
 *
 * Usage:  npm run library:check
 */
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import Papa from "papaparse";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

const csvPath = resolve(repoRoot, "public/library-seed.csv");
const sqlPath = resolve(repoRoot, "setup.sql");

const sql = readFileSync(sqlPath, "utf8");
const csv = readFileSync(csvPath, "utf8");

function extractIds(tableHint) {
  // Pulls bare-quoted ids out of seed INSERT blocks for the given table.
  const re = new RegExp(
    `INSERT INTO public\\.${tableHint}[\\s\\S]*?VALUES([\\s\\S]*?)ON CONFLICT`,
    "g"
  );
  const ids = new Set();
  let m;
  while ((m = re.exec(sql))) {
    const body = m[1];
    for (const idMatch of body.matchAll(/\(\s*'([a-z0-9_]+)'/g)) {
      ids.add(idMatch[1]);
    }
  }
  return ids;
}

const validCats = extractIds("library_categories");
const validSubs = extractIds("library_subcategories");

if (validCats.size === 0 || validSubs.size === 0) {
  console.error(
    "❌ Could not extract category/subcategory IDs from setup.sql. " +
      "Did the seed INSERT format change?"
  );
  process.exit(2);
}

const parsed = Papa.parse(csv, { header: true, skipEmptyLines: true });
if (parsed.errors.length) {
  console.error("❌ CSV parse errors:");
  for (const e of parsed.errors) console.error(`   row ${e.row}: ${e.message}`);
  process.exit(1);
}

const rows = parsed.data;
const required = ["name", "definition", "description", "info_link", "category_id", "subcategory_id"];
const headers = parsed.meta.fields ?? [];
for (const h of required) {
  if (!headers.includes(h)) {
    console.error(`❌ Missing required column: "${h}"`);
    process.exit(1);
  }
}

const errors = [];
rows.forEach((row, i) => {
  const n = i + 2;
  if (!row.name?.trim()) errors.push(`row ${n}: empty "name"`);
  if (!row.description?.trim()) errors.push(`row ${n}: empty "description"`);
  const cat = row.category_id?.trim();
  const sub = row.subcategory_id?.trim();
  if (!cat) errors.push(`row ${n}: empty "category_id"`);
  else if (!validCats.has(cat)) errors.push(`row ${n}: unknown category_id "${cat}"`);
  if (sub && !validSubs.has(sub)) errors.push(`row ${n}: unknown subcategory_id "${sub}"`);
});

if (errors.length) {
  console.error(`❌ library-seed.csv has ${errors.length} validation error(s):`);
  for (const e of errors.slice(0, 25)) console.error("   - " + e);
  if (errors.length > 25) console.error(`   …and ${errors.length - 25} more`);
  process.exit(1);
}

console.log(`✅ library-seed.csv OK — ${rows.length} rows, all category/subcategory IDs valid.`);