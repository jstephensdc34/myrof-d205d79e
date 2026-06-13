#!/usr/bin/env node
/**
 * MyROF Report — Buyer handoff bundler
 *
 * Bundles the buyer Welcome Kit (setup assets only) into a single ZIP at
 *   dist-handoff/myrof-welcome-kit.zip
 *
 * Buyers deploy via a Vercel "Deploy" link that clones the public source
 * repo for them — they never download the application code locally. The
 * Welcome Kit only contains what they need to paste/read during setup.
 *
 * Usage:
 *   npm run handoff
 */
import { existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import AdmZip from "adm-zip";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

const FILES = [
  "BUYER_SETUP.md",
  "setup.sql",
  "LICENSE",
];

const OUT_DIR = join(repoRoot, "dist-handoff");
const OUT_FILE = join(OUT_DIR, "myrof-welcome-kit.zip");

const missing = FILES.filter((f) => !existsSync(join(repoRoot, f)));
if (missing.length) {
  console.error("❌ Missing required file(s):");
  for (const f of missing) console.error("   - " + f);
  process.exit(1);
}

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

const zip = new AdmZip();
for (const f of FILES) {
  zip.addFile(f, readFileSync(join(repoRoot, f)));
}
zip.writeZip(OUT_FILE);

const sizeKb = (statSync(OUT_FILE).size / 1024).toFixed(1);
console.log("✅ Welcome Kit created");
console.log("   Path:  " + OUT_FILE);
console.log("   Size:  " + sizeKb + " KB");
console.log("   Files:");
for (const f of FILES) console.log("     - " + f);