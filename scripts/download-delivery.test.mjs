import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import AdmZip from "adm-zip";
import { tmpdir } from "node:os";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

test("seller packaging never exposes ZIP downloads in the app", () => {
  for (const script of ["build-handoff-zip.mjs", "build-source-zip.mjs"]) {
    execFileSync(process.execPath, [resolve(root, "scripts", script)], { cwd: root });
  }
  assert.deepEqual(readdirSync(resolve(root, "public")).filter(name => name.endsWith(".zip")), []);
});

test("buyer Welcome Kit still includes all three delivery files", () => {
  const zip = new AdmZip(resolve(tmpdir(), "myrof-handoff", "chiropractic-patient-report-generator-welcome-kit.zip"));
  assert.deepEqual(zip.getEntries().map(entry => entry.entryName).sort(), ["BUYER_SETUP.md", "LICENSE", "setup.sql"]);
  assert.equal(existsSync(resolve(root, "setup.sql")), true);
});