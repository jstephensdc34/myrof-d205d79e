#!/usr/bin/env node
/**
 * Chiropractic Patient Report Generator — Source code bundler
 *
 * Creates a deployable source ZIP in public/ that the seller can download
 * and push to the public GitHub repository used by the Vercel clone link.
 *
 * Usage:
 *   npm run source:zip
 */
import { existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import AdmZip from "adm-zip";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

// These are excluded from the source bundle.
const EXCLUDED_NAMES = new Set([
  ".git",
  ".lovable",
  ".vscode",
  ".idea",
  ".DS_Store",
  "node_modules",
  "dist",
  "dist-ssr",
  "dist-handoff",
  "logs",
  ".env",
  ".env.local",
  ".env.development.local",
  ".env.production.local",
  ".env.test.local",
]);

const EXCLUDED_PATTERNS = [
  /^\./, // hidden files/directories at root level
  /\.log$/,
  /\.tmp$/,
  /\.swp$/,
  /\.swo$/,
  /\.suo$/,
  /\.ntvs/,
  /\.njsproj$/,
  /\.sln$/,
];

const OUT_DIR = join(repoRoot, "public");
const OUT_FILE = join(OUT_DIR, "chiropractic-patient-report-generator-source.zip");

function shouldInclude(entryPath, entryName) {
  if (EXCLUDED_NAMES.has(entryName)) return false;
  for (const pattern of EXCLUDED_PATTERNS) {
    if (pattern.test(entryName)) return false;
  }
  return true;
}

function addDirectory(zip, dirPath, basePath) {
  const entries = readdirSync(dirPath);
  for (const entry of entries) {
    const fullPath = join(dirPath, entry);
    const relPath = relative(basePath, fullPath);

    if (!shouldInclude(fullPath, entry)) {
      console.log("  skipping: " + relPath);
      continue;
    }

    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      addDirectory(zip, fullPath, basePath);
    } else {
      zip.addLocalFile(fullPath, relative(repoRoot, dirPath));
    }
  }
}

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

const zip = new AdmZip();
const rootEntries = readdirSync(repoRoot).filter((name) => shouldInclude(join(repoRoot, name), name));

for (const entry of rootEntries) {
  const fullPath = join(repoRoot, entry);
  const stats = statSync(fullPath);
  if (stats.isDirectory()) {
    addDirectory(zip, fullPath, repoRoot);
  } else {
    zip.addLocalFile(fullPath, "");
  }
}

zip.writeZip(OUT_FILE);

const sizeKb = (statSync(OUT_FILE).size / 1024).toFixed(1);
console.log("✅ Source bundle created");
console.log("   Path:  " + OUT_FILE);
console.log("   Size:  " + sizeKb + " KB");
console.log("\nDownload URL:");
console.log("   /chiropractic-patient-report-generator-source.zip");
