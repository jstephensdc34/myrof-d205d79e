#!/usr/bin/env node
/**
 * Exports the seller's live library_items table to public/library-seed.csv
 * so the next deploy ships the latest curated starter content.
 *
 * Reads connection info from .env.local (or current shell env):
 *   VITE_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY   (preferred — bypasses RLS so per-user rows are included as starter)
 *   ...or VITE_SUPABASE_ANON_KEY (only your own rows + already-shared rows will be exported)
 *
 * Usage:  npm run library:export
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import Papa from "papaparse";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

// Lightweight .env.local loader (no extra dep).
const envPath = resolve(repoRoot, ".env.local");
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, "");
    }
  }
}

const url = process.env.VITE_SUPABASE_URL;
const key =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error(
    "❌ Missing VITE_SUPABASE_URL and/or a key. Put SUPABASE_SERVICE_ROLE_KEY " +
      "(preferred) or VITE_SUPABASE_ANON_KEY in .env.local."
  );
  process.exit(1);
}

const supabase = createClient(url, key);

const { data, error } = await supabase
  .from("library_items")
  .select("name, definition, description, info_link, category_id, subcategory_id")
  .order("category_id")
  .order("subcategory_id")
  .order("name");

if (error) {
  console.error("❌ Failed to read library_items:", error.message);
  process.exit(1);
}

const csv = Papa.unparse(
  data.map((r) => ({
    name: r.name ?? "",
    definition: r.definition ?? "",
    description: r.description ?? "",
    info_link: r.info_link ?? "",
    category_id: r.category_id ?? "",
    subcategory_id: r.subcategory_id ?? "",
  })),
  { columns: ["name", "definition", "description", "info_link", "category_id", "subcategory_id"] }
);

const outPath = resolve(repoRoot, "public/library-seed.csv");
writeFileSync(outPath, csv + "\n");
console.log(`✅ Wrote ${data.length} rows to ${outPath}`);
console.log("   Next: run `npm run library:check` to validate, then commit.");