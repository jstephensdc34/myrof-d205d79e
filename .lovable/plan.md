## Problem

Two separate issues stemming from the white-label cleanup:

1. **Lovable preview is blank.** `src/integrations/supabase/client.ts` throws when `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` are missing. Deleting `.env` removed those vars from the Lovable sandbox, so the app crashes on import. (Vercel is unaffected because env vars are set there.)

2. **"Library items failed to load" on Vercel after login.** Almost certainly an RLS/GRANT or empty-data issue in the connected Supabase project — not a code bug.

## Plan

### Step 1 — Fix the blank preview (restore local `.env`, keep it out of git)

- Add `.env` and `.env.local` to `.gitignore` so secrets never get committed again.
- Recreate `.env` in the project root with the Lovable Cloud Supabase URL + anon key the preview was using. This file stays local to the sandbox; it will not be pushed to GitHub.
- Soften `client.ts` so a missing env var renders a friendly inline error message instead of throwing during module import (prevents future blank-screen crashes for template buyers who forget to set env vars).

### Step 2 — Diagnose the "library items failed to load" error

I need one piece of info from you before changing anything backend-side. On your Vercel site, after logging in and seeing the red error:

1. Open DevTools → **Network** tab
2. Find the failing request to `…supabase.co/rest/v1/library_items…`
3. Tell me the **HTTP status** (200 / 401 / 403 / etc.) and the **response body** text

Most likely outcomes and the fix for each:

- **403 + "permission denied for table library_items"** → missing `GRANT SELECT … TO authenticated` on the table. Fix with a migration.
- **200 + empty `[]`** → table is empty in the new Supabase project. Fix by seeding starter library data.
- **401** → anon key / URL mismatch in Vercel env vars. Re-paste the keys.

### Step 3 — Document for template buyers

Add a short `README.md` section explaining required env vars (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) and how to seed the library tables, so future buyers don't hit the same two issues.

## Technical details

- `.env` is read by Vite at dev-server start; restoring it requires a dev-server restart, which Lovable handles automatically.
- The friendly-error change in `client.ts` exports a sentinel and the app renders a centered "Configuration required" card when env vars are absent — no thrown error, no blank page.
- No code change can fix step 2 until we know the failing request's status; running a migration without that risks adding the wrong policy or masking a different issue.
