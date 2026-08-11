# Rebrand handoff assets to Chiropractic Patient Report Generator

## Goal
Replace remaining `MyROF Report` / `myrof` branding in seller/buyer-facing files with `Chiropractic Patient Report Generator`, then regenerate the downloadable bundles.

## Files to update
- `LICENSE` — title and software definition
- `README.md` — title
- `setup.sql` — header comment
- `BUYER_SETUP.md` — title, intro, suggested Supabase project name
- `SELLER_CHECKLIST.md` — Welcome Kit ZIP filename references
- `scripts/build-handoff-zip.mjs` — output ZIP filename constant

## Regenerate bundles
- Run `npm run handoff` to create the updated Welcome Kit ZIP.
- Run `npm run source:zip` to create the updated source-code ZIP.
- Verify both ZIPs exist in `public/` and report download URLs.

## Verification
- Search for any remaining `MyROF` / `myrof` references in the updated files.
- Confirm build passes after the filename change.
