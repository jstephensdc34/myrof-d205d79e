# Plan: Document the update process for existing buyers

## Goal
Add a clear "Updating your app to the latest version" section to the buyer-facing documentation and a matching seller note, because the Vercel one-click deploy creates a fork/clone in the buyer's account that does **not** auto-sync with upstream repo changes.

## Changes

### 1. BUYER_SETUP.md — new "Updating your app" section
Insert a new section before "Troubleshooting" that explains:
- The Vercel deploy link cloned the app into the buyer's own GitHub/Vercel account at the moment of first deploy.
- Pushing new code to the seller's repo does **not** automatically update the buyer's deployed copy.
- To get code updates, the buyer must sync their fork with the seller's upstream repository (GitHub UI: "Sync fork" → "Update branch"), which triggers Vercel to redeploy automatically.
- Database/schema changes (new tables, columns, RLS policies, edge functions) are **not** applied by syncing the fork. The buyer must re-run the latest `setup.sql` in their Supabase SQL Editor.
- Provide a concise numbered checklist:
  1. Download the latest Welcome Kit ZIP from the seller.
  2. Run the new `setup.sql` in Supabase SQL Editor (if the seller says the schema changed).
  3. In GitHub, open their fork, click **Sync fork → Update branch**.
  4. Wait for Vercel to auto-redeploy (usually 1–3 minutes).
  5. Open the live URL and verify the app still works.

### 2. SELLER_CHECKLIST.md — add "Releasing updates to existing buyers" subsection
Under "Before each release: refresh the starter library", add a brief note:
- When code changes are pushed to the public repo, new buyers get them automatically, but existing buyers do not unless they sync their fork.
- For schema/edge-function changes, the seller must re-send the Welcome Kit ZIP with the updated `setup.sql` and notify buyers to re-run it.
- Optionally include template buyer-update email copy (subject + body) explaining the sync-fork + re-run-SQL steps.

### 3. Regenerate handoff assets
After the docs are updated, run `npm run handoff` so the Welcome Kit ZIP reflects the new `BUYER_SETUP.md`.

## Out of scope
- No code changes to the app itself.
- No new scripts or automation for the sync process (documented as a manual GitHub/Vercel step).
