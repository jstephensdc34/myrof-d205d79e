## Phase 3 — Library handoff & in-app starter loader (revised)

Great catch on the Vercel-clone flow. Updated plan below.

## Root cause recap

The last attempt failed because `setup.sql` doesn't actually create `library_categories`, `library_subcategories`, `library_items`, `report_settings`, or the `clinic-assets` bucket — those came from Lovable Cloud's auto-migrations. Only later migrations (which `INSERT` extra subcategory rows) are in the file, so a fresh project ends up missing tables and subcategories. We fix this once and for all by rewriting `setup.sql` from scratch.

## Changes

### 1. Rewrite `setup.sql` as a true from-scratch script

Idempotent, single-file, runs cleanly on a brand-new Supabase project:

- `library_categories` table + 5 seed rows (diagnosis, extremity, treatment, homecare, exercises)
- `library_subcategories` table + **every** subcategory row currently in your DB (all diagnosis regions, extremity regions, `care_plan_type`, `phase_of_care`, `treatment_modalities`, `treatment_goals`, `home_therapy`, `adls`, `activity_modification`, `condition_specific`, `wellness`→Miscellaneous, all `*_exercises`, etc.)
- `library_items` table (empty — populated by Load Starter Library button)
- `report_settings` table + default blank rows (clinic_name, address, phone, email, website, logo_url)
- `care_plans` table
- `clinic-assets` storage bucket + policies (currently missing — logo upload silently fails on fresh installs)
- `shared-reports` bucket + policies (keep)
- `claim_and_update_library_item` RPC + `update_modified_column` trigger
- All GRANTs and RLS in the correct order
- `ON CONFLICT DO NOTHING` on every seed insert (safe to re-run)
- **Removes** `patients`, `posture_assessments`, `posture_photos`, `posture_measurements` (posture feature was removed)

### 2. RLS adjustment for starter library items

Current `UPDATE` and `DELETE` policies on `library_items` are `user_id = auth.uid()`, which would lock buyers out of editing or deleting starter rows (which have `user_id IS NULL`). Adjust to:

```sql
-- UPDATE: own rows OR shared starter rows
USING      (user_id = auth.uid() OR user_id IS NULL)
WITH CHECK (user_id = auth.uid() OR user_id IS NULL)

-- DELETE: own rows OR shared starter rows
USING      (user_id = auth.uid() OR user_id IS NULL)
```

This is correct for a single-clinic app: any signed-in clinic user can edit or remove starter items. The existing `claim_and_update_library_item` RPC still works (and is now strictly redundant for the NULL case, but it stays in place for the cross-user case and to avoid touching working code).

### 3. Ship `library-seed.csv` from the React app's `public/` folder

- New file: **`public/library-seed.csv`** — your exported library, columns: `name, definition, description, info_link, category_id, subcategory_id`.
- Because it's in `public/`, Vercel serves it at `/library-seed.csv` automatically — no buyer downloads, no file picker, works on day one of any clone.
- A small validator script `scripts/validate-library-csv.mjs` (runs via `npm run library:check`) parses the CSV and verifies every `subcategory_id` exists in the `INSERT` list in `setup.sql`. Run by the seller before shipping; fails loudly if a row points at a missing subcategory — prevents the "subcategories didn't copy over" class of bug from recurring.

### 4. In-app "Load Starter Library" button (no file picker)

- New component `src/components/library/LoadStarterLibraryButton.tsx`.
- Appears in `LibraryHeader` only when `library_items` is empty (cheap `count: 'exact', head: true` query via a new `useLibraryItemCount` hook). Disappears after first use — no risk of buyers accidentally wiping their library.
- onClick:
  1. `fetch('/library-seed.csv')`
  2. Parse with `papaparse` (new runtime dep, ~45KB, zero native).
  3. Validate headers + every category/subcategory id against what's already in the DB.
  4. Bulk-insert in chunks of 500 with `user_id: null`.
  5. Progress toast → final "Imported N items" toast.
  6. On error, surface the offending row number; partial chunks roll back so the user can retry cleanly.
- Confirmation dialog before insert ("This will add ~N starter items. Continue?").

### 5. Update BUYER_SETUP.md

Add a new **Step 6 — Load the starter library** at the end:

> After signing in, go to the **Library** page and click **Load Starter Library**. The app will pull in the curated content shipped with your deployment. You'll see "Imported N items" when it's done. The button disappears after first use; you can edit, add, or delete any item from there.

Drop any references to a local "handoff folder" — buyers don't have one.

### 6. Update SELLER_CHECKLIST.md + handoff ZIP

- The handoff ZIP no longer needs to include `library-seed.csv` (it's in the repo's `public/` folder and ships with the Vercel deploy automatically). Update `scripts/build-handoff-zip.mjs` and the checklist accordingly.
- New seller step: "Before publishing a new version, run `npm run library:export` to regenerate `public/library-seed.csv` from your live Supabase, then `npm run library:check` to validate."
- New `scripts/export-library-csv.mjs` reads from your `.env.local` Supabase and overwrites `public/library-seed.csv`. One command per release.

### Technical details

- New runtime dep: `papaparse` + `@types/papaparse`.
- New files:
  - `public/library-seed.csv`
  - `src/components/library/LoadStarterLibraryButton.tsx`
  - `src/hooks/library/useLibraryItemCount.ts`
  - `src/services/library/loadStarterLibrary.ts`
  - `scripts/validate-library-csv.mjs`
  - `scripts/export-library-csv.mjs`
- Edits: `setup.sql` (full rewrite), `src/components/library/LibraryHeader.tsx` (conditional button), `BUYER_SETUP.md`, `SELLER_CHECKLIST.md`, `scripts/build-handoff-zip.mjs`, `package.json`.
- No edge functions, no new secrets, no OAuth.

### Note on CSV content

I'll create `public/library-seed.csv` as an empty-with-header placeholder so the build is green. You'll run `npm run library:export` once after this lands to fill it from your live database — that way I never have to see or hardcode your clinical content.

## Out of scope

- A multi-tenant "share library across clinics" feature.
- An in-app CSV export UI (seller uses the npm script).
- Migrating off string-id subcategories.

Approve and I'll build it.
