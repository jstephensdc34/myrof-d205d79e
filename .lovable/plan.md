## Goal

Fix the 403 "Failed to load resource" errors on `/rest/v1/library_categories`, `library_subcategories`, `library_items`, and `care_plans` by adding the missing GRANTs and RLS policies. Save it as a migration in `supabase/migrations/` so future remixes carry it, and also run it once in the external Supabase project's SQL Editor since that project isn't connected via Lovable Cloud.

## What I'll create

A new file `supabase/migrations/<timestamp>_library_grants_and_rls.sql` containing:

### 1. GRANTs (Data API visibility)

```sql
-- Reference data: readable by anyone signed in (and anon, since they're not user-scoped)
GRANT SELECT ON public.library_categories    TO anon, authenticated;
GRANT SELECT ON public.library_subcategories TO anon, authenticated;
GRANT ALL    ON public.library_categories    TO service_role;
GRANT ALL    ON public.library_subcategories TO service_role;

-- User-owned data
GRANT SELECT, INSERT, UPDATE, DELETE ON public.library_items TO authenticated;
GRANT ALL ON public.library_items TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.care_plans TO authenticated;
GRANT ALL ON public.care_plans TO service_role;
```

### 2. Enable RLS

```sql
ALTER TABLE public.library_categories    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_items         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.care_plans            ENABLE ROW LEVEL SECURITY;
```

### 3. Policies

- **library_categories / library_subcategories** — `SELECT` for `authenticated` `USING (true)` (reference data, no writes from client).
- **library_items** — uses the existing `user_id uuid` column:
  - `SELECT`: `user_id = auth.uid() OR user_id IS NULL` (lets seeded shared items show for everyone)
  - `INSERT`: `WITH CHECK (user_id = auth.uid())`
  - `UPDATE`: `USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid())`
  - `DELETE`: `USING (user_id = auth.uid())`
- **care_plans** — assumes a `user_id uuid` column with the same four policies as `library_items` (without the `IS NULL` clause, since care plans aren't shared).

All policies use `CREATE POLICY IF NOT EXISTS`-style guards (`DROP POLICY IF EXISTS` then `CREATE POLICY`) so re-running is safe.

## After the file is created

Since your Vercel deployment talks to an external Supabase project (`brotpabqmiulrfzhmzvc`) that isn't connected to Lovable Cloud, the migration won't auto-apply there. You'll need to:

1. Open that Supabase project's SQL Editor.
2. Paste the contents of the new migration file.
3. Click **Run**.

I'll give you the exact SQL to paste once the file is written.

## Assumptions to confirm (otherwise tell me)

- `library_items.user_id` is `uuid` and nullable (nullable so seeded "global" items remain visible to everyone).
- `care_plans` has a `user_id uuid` column. If it's named something else (e.g. `owner_id`, `created_by`), let me know and I'll adjust.
- `library_categories` and `library_subcategories` are reference data — no client writes needed. If clinicians need to create custom subcategories from the app, say so and I'll add INSERT policies.
