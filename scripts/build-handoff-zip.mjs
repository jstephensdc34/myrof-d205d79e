#!/usr/bin/env node
/**
 * Chiropractic Patient Report Generator — Buyer handoff bundler
 *
 * Bundles the buyer Welcome Kit (setup assets only) into a single ZIP at
 *   dist-handoff/chiropractic-patient-report-generator-welcome-kit.zip
 *
 * Buyers deploy via a Vercel "Deploy" link that clones the public source
 * repo for them — they never download the application code locally. The
 * Welcome Kit only contains what they need to paste/read during setup.
 *
 * Usage:
 *   npm run handoff
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
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
const OUT_FILE = join(OUT_DIR, "chiropractic-patient-report-generator-welcome-kit.zip");

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

// Also copy to public/ so the /source-download page serves the latest file.
const PUBLIC_DIR = join(repoRoot, "public");
const PUBLIC_FILE = join(PUBLIC_DIR, "chiropractic-patient-report-generator-welcome-kit.zip");
if (!existsSync(PUBLIC_DIR)) mkdirSync(PUBLIC_DIR, { recursive: true });
copyFileSync(OUT_FILE, PUBLIC_FILE);

const sizeKb = (statSync(OUT_FILE).size / 1024).toFixed(1);
console.log("✅ Welcome Kit created");
console.log("   Path:  " + OUT_FILE);
console.log("   Public copy: " + PUBLIC_FILE);
console.log("   Size:  " + sizeKb + " KB");
console.log("   Files:");
for (const f of FILES) console.log("     - " + f);