#!/usr/bin/env node
/**
 * Interactive pre-release dry-run checklist for sellers.
 * Walks through each step, asks pass/fail, and writes a timestamped log to
 *   dist-handoff/dry-run-<ISO date>.log
 *
 * Usage:
 *   npm run dry-run
 */
import { createInterface } from "node:readline/promises";
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
const OUT_DIR = join(repoRoot, "dist-handoff");

const STEPS = [
  "Fresh Supabase project created (throwaway)",
  "setup.sql ran clean (saw 'Setup complete')",
  "Email confirmation toggled OFF in Supabase → Authentication → Providers → Email",
  "Env vars set in Vercel (VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY); build succeeded",
  "Signup → immediate login works (no email round-trip)",
  "'Load Starter Library' imported N items without error",
  "Library item create / edit / delete works",
  "Report generation works; PDF downloads",
  "Shared report link opens in an incognito window",
  "/reset-password flow works end-to-end (OR admin-reset documented works)",
  "`npm run handoff:check` exits clean",
];

const rl = createInterface({ input: process.stdin, output: process.stdout });
const results = [];
console.log("\n=== MyROF Report — Pre-release dry-run ===\n");

for (let i = 0; i < STEPS.length; i++) {
  const step = STEPS[i];
  // eslint-disable-next-line no-await-in-loop
  const ans = (await rl.question(`${i + 1}. ${step}\n   pass / fail / skip: `))
    .trim()
    .toLowerCase();
  const status =
    ans.startsWith("p") ? "PASS" : ans.startsWith("f") ? "FAIL" : "SKIP";
  results.push({ step, status });
}
rl.close();

const ts = new Date().toISOString().replace(/[:.]/g, "-");
if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });
const out = join(OUT_DIR, `dry-run-${ts}.log`);

const summary = results
  .map((r, i) => `${(i + 1).toString().padStart(2)}. [${r.status}] ${r.step}`)
  .join("\n");
const fails = results.filter((r) => r.status === "FAIL").length;
const skips = results.filter((r) => r.status === "SKIP").length;
const passes = results.filter((r) => r.status === "PASS").length;

const log =
  `MyROF Report dry-run — ${new Date().toISOString()}\n` +
  `Pass: ${passes}  Fail: ${fails}  Skip: ${skips}\n\n${summary}\n`;
writeFileSync(out, log);

console.log(`\nLog written: ${out}`);
if (fails > 0) {
  console.error(`❌ ${fails} step(s) failed. Do not ship.`);
  process.exit(1);
}
console.log("✅ All checked steps passed.");