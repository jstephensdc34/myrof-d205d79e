## Goal
Provide a one-click way to download the six buyer-handoff files (`LICENSE`, `setup.sql`, `.env.example`, `BUYER_SETUP.md`, `SELLER_CHECKLIST.md`, `README.md`) as a single ZIP.

## Approach
Add a small Node script that runs locally (or in any CI) and produces `myrof-report-handoff.zip` containing exactly those six files. No app UI changes, no backend, no new dependencies at runtime — the script uses Node's built-in zlib via a tiny zero-dep helper.

## Files to add

1. **`scripts/build-handoff-zip.mjs`** — Node ESM script:
   - Reads the six files from the repo root.
   - Writes `dist-handoff/myrof-report-handoff.zip`.
   - Uses the `adm-zip` package (small, zero native deps) added as a `devDependency`.
   - Prints the output path and file list on success.
   - Exits non-zero with a clear message if any source file is missing.

2. **`package.json`** — add:
   - `devDependency`: `adm-zip`
   - `script`: `"handoff": "node scripts/build-handoff-zip.mjs"`
   - Usage becomes a single command: `npm run handoff`

3. **`SELLER_CHECKLIST.md`** — add a short "Build the buyer ZIP" section pointing to `npm run handoff` and the output path, so it's discoverable next to the other seller steps.

## What the seller does
```
npm install        # one time
npm run handoff    # produces dist-handoff/myrof-report-handoff.zip
```
Then attach that single ZIP to the buyer handoff email.

## Out of scope
- No in-app download button (this is a seller tool, not a buyer-facing feature).
- No changes to the six bundled files themselves.
- No GitHub Action — can be added later if you want it auto-built on every tag.

Approve and I'll implement it.