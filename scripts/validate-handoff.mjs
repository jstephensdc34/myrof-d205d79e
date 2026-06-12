#!/usr/bin/env node
/**
 * Pre-release guardrail: fail loudly if any OAuth or magic-link auth code
 * sneaks into src/. BYOK buyers must have a zero-OAuth experience.
 *
 * Also verifies the required handoff docs exist.
 */
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

const FORBIDDEN_PATTERNS = [
  "signInWithOAuth",
  "signInWithOtp",
];

let failed = false;

for (const pattern of FORBIDDEN_PATTERNS) {
  try {
    const out = execSync(
      `grep -rn --include='*.ts' --include='*.tsx' "${pattern}" src`,
      { cwd: repoRoot, stdio: ["ignore", "pipe", "ignore"] }
    )
      .toString()
      .trim();
    if (out) {
      console.error(`❌ Forbidden auth pattern '${pattern}' found in src/:`);
      console.error(out);
      failed = true;
    }
  } catch {
    // grep exit 1 = no matches. Good.
  }
}

const REQUIRED_FILES = [
  "LICENSE",
  "setup.sql",
  ".env.example",
  "BUYER_SETUP.md",
  "README.md",
  "vercel.json",
  "public/library-seed.csv",
];
for (const f of REQUIRED_FILES) {
  if (!existsSync(join(repoRoot, f))) {
    console.error(`❌ Missing required handoff file: ${f}`);
    failed = true;
  }
}

if (failed) {
  console.error("\nHandoff validation failed. Fix the above before shipping.");
  process.exit(1);
}
console.log("✅ Handoff validation passed: no OAuth code, all required files present.");