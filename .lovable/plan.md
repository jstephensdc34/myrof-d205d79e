
# Remove All Edge Functions + Delete Admin Page

## Confirmation

Yes — after this plan executes, **buyers will deploy ZERO edge functions**. Their setup is:
1. Create a free Supabase project
2. Paste `setup.sql` into the SQL Editor and click Run
3. Deploy the GitHub repo to Vercel with two env vars (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)

No Supabase CLI, no Deno, no service-role keys, no function deploys.

## Files to delete

- `supabase/functions/copy-library-items/` (folder)
- `supabase/functions/search-users/` (folder)
- `supabase/functions/serve-report/` (folder)
- `src/components/admin/CopyLibraryItems.tsx`
- `src/services/adminService.ts`
- `src/pages/Admin.tsx`

## Files to edit

- **`src/App.tsx`** — remove the `Admin` import and the `/admin` route.
- **`src/components/layout/Navbar.tsx`** — remove the Admin link if present.
- **`src/pages/SharedReport.tsx`** — replace any call to the `serve-report` edge function with a direct Supabase Storage download:
  ```ts
  const { data, error } = await supabase.storage
    .from('shared-reports')
    .download(fileName);
  const html = await data.text();
  // pass `html` to the existing iframe srcDoc
  ```
- **`supabase/config.toml`** — remove the `[functions.copy-library-items]` and `[functions.search-users]` blocks.

## Shared-report storage policy (covered in setup.sql later)

For the direct-download approach to work with the anon key, the `shared-reports` bucket must allow read access. Two options:

- **Public bucket** — simplest; the `download()` call works for anyone. Links are unguessable (timestamp + name) but technically reachable by anyone with the URL. This is the same security posture as the current edge-function flow.
- **Private bucket + RLS policy** — `SELECT` allowed to `anon`/`authenticated` on `storage.objects` where `bucket_id = 'shared-reports'`. Functionally identical to public for this use case, just expressed as a policy.

Recommendation: **public bucket** — simpler for buyers, behavior unchanged.

## Verification before handoff

1. `grep -r "functions.invoke" src/` returns nothing.
2. `grep -r "/admin" src/` returns nothing.
3. `supabase/functions/` directory is empty or absent.
4. App builds cleanly; `/shared-report?file=…` still renders existing test reports.

## What I'll do in build mode

Single pass:
1. Delete the six files/folders above.
2. Edit `App.tsx`, `Navbar.tsx`, `SharedReport.tsx`, `config.toml`.
3. Run the three greps above to confirm nothing was missed.
4. Visit a shared report URL in the preview to confirm the iframe still renders.

Packaging deliverables (`setup.sql`, `BUYER_SETUP.md`, `.env.example`) remain in the larger white-label plan and will be tackled in a follow-up build pass — not part of this one, which is scoped strictly to edge-function removal.

Approve and I'll execute.
