-- Fix 403 errors from the Data API by ensuring GRANTs and RLS policies
-- exist for the library_* and care_plans tables. Safe to re-run.

-- 1. GRANTs
GRANT SELECT ON public.library_categories    TO anon, authenticated;
GRANT SELECT ON public.library_subcategories TO anon, authenticated;
GRANT ALL    ON public.library_categories    TO service_role;
GRANT ALL    ON public.library_subcategories TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.library_items TO authenticated;
GRANT ALL ON public.library_items TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.care_plans TO authenticated;
GRANT ALL ON public.care_plans TO service_role;

-- 2. Enable RLS
ALTER TABLE public.library_categories    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_items         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.care_plans            ENABLE ROW LEVEL SECURITY;

-- 3. library_categories (reference data)
DROP POLICY IF EXISTS "Authenticated can read categories" ON public.library_categories;
CREATE POLICY "Authenticated can read categories"
  ON public.library_categories FOR SELECT
  TO authenticated, anon
  USING (true);

-- 4. library_subcategories (reference data)
DROP POLICY IF EXISTS "Authenticated can read subcategories" ON public.library_subcategories;
CREATE POLICY "Authenticated can read subcategories"
  ON public.library_subcategories FOR SELECT
  TO authenticated, anon
  USING (true);

-- 5. library_items (per-user; shared rows have user_id IS NULL)
DROP POLICY IF EXISTS "Users read own or shared library items" ON public.library_items;
DROP POLICY IF EXISTS "Users insert own library items"         ON public.library_items;
DROP POLICY IF EXISTS "Users update own library items"         ON public.library_items;
DROP POLICY IF EXISTS "Users delete own library items"         ON public.library_items;

CREATE POLICY "Users read own or shared library items"
  ON public.library_items FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Users insert own library items"
  ON public.library_items FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users update own library items"
  ON public.library_items FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users delete own library items"
  ON public.library_items FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- 6. care_plans (strictly per-user)
DROP POLICY IF EXISTS "Users read own care plans"   ON public.care_plans;
DROP POLICY IF EXISTS "Users insert own care plans" ON public.care_plans;
DROP POLICY IF EXISTS "Users update own care plans" ON public.care_plans;
DROP POLICY IF EXISTS "Users delete own care plans" ON public.care_plans;

CREATE POLICY "Users read own care plans"
  ON public.care_plans FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users insert own care plans"
  ON public.care_plans FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users update own care plans"
  ON public.care_plans FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users delete own care plans"
  ON public.care_plans FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());
