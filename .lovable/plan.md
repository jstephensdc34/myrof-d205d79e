# Document the "Failed to fetch / ERR_NAME_NOT_RESOLVED" failure mode

## Background

During the update-process walkthrough, the freshly redeployed dummy app failed login with `ERR_NAME_NOT_RESOLVED` on the Supabase auth URL. Verified via DNS lookup: the project ref in `VITE_SUPABASE_URL` does not exist (NXDOMAIN) — the value was mistyped or the project was deleted. The existing troubleshooting docs cover malformed URLs (trailing slash, `/rest/v1`) but not a *wrong or deleted* project URL, which surfaces as a generic "Failed to fetch" at login.

## Changes

1. **BUYER_SETUP.md → Troubleshooting** — add an entry:
   - Symptom: login fails with "Failed to fetch"; browser console shows `ERR_NAME_NOT_RESOLVED` on `*.supabase.co`.
   - Cause: `VITE_SUPABASE_URL` points at a project that doesn't exist (typo in the ref, or the Supabase project was deleted/paused).
   - Fix: copy the Project URL again from Supabase → Project Settings → API, correct the variable in Vercel → Settings → Environment Variables, and redeploy. If the project was deleted, create a new one and re-run `setup.sql`.

2. **SELLER_CHECKLIST.md → "Releasing updates to existing buyers"** — add one bullet to the redeploy-fresh method: after redeploy, if login fails with "Failed to fetch", the connection values were entered incorrectly — re-check both against the saved setup guide and redeploy.

3. **Regenerate the Welcome Kit ZIP** (`scripts/build-handoff-zip.mjs`) since BUYER_SETUP.md changes, and confirm the refreshed ZIP lands in `public/`.

## Verification

- `npx tsgo --noEmit -p tsconfig.app.json` passes (no code changes expected; docs only).
- Rebuilt ZIP contains the updated BUYER_SETUP.md.
