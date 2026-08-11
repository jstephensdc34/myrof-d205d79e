# Plan: Keep the public Welcome Kit ZIP in sync with the generated handoff

## Problem
The `/source-download` page serves `/chiropractic-patient-report-generator-welcome-kit.zip` from the `public/` directory. The `npm run handoff` script currently writes the regenerated ZIP only to `dist-handoff/`, so the downloadable file on the page can become stale.

## Goal
Make the Welcome Kit button on `/source-download` always serve the exact ZIP produced by the latest `npm run handoff` run.

## Changes

### 1. Update `scripts/build-handoff-zip.mjs`
After writing the ZIP to `dist-handoff/`, also copy it to `public/chiropractic-patient-report-generator-welcome-kit.zip` so the served file matches the generated file.

### 2. Verify `/source-download` still works
Confirm the page links to the correct filename and that the copied file is served at the expected URL.

### 3. Regenerate the Welcome Kit
Run `npm run handoff` once more so `public/` receives the updated ZIP containing the new "Updating your app" section.

## Out of scope
- No UI changes to the `/source-download` page itself.
- No changes to the source-code bundle.
