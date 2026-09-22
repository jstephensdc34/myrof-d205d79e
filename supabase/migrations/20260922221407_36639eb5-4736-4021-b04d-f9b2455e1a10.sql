-- report_settings: add ownership and scope access
ALTER TABLE public.report_settings ADD COLUMN IF NOT EXISTS user_id uuid;

DROP POLICY IF EXISTS "Authenticated can read report settings"   ON public.report_settings;
DROP POLICY IF EXISTS "Authenticated can insert report settings" ON public.report_settings;
DROP POLICY IF EXISTS "Authenticated can update report settings" ON public.report_settings;
DROP POLICY IF EXISTS "Authenticated can delete report settings" ON public.report_settings;

CREATE POLICY "Users read own or shared report settings"
  ON public.report_settings FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Users insert own report settings"
  ON public.report_settings FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users update own or shared report settings"
  ON public.report_settings FOR UPDATE TO authenticated
  USING (user_id = auth.uid() OR user_id IS NULL)
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users delete own report settings"
  ON public.report_settings FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- library taxonomy: signed-in users only (no anonymous access)
DROP POLICY IF EXISTS "Anyone can read categories" ON public.library_categories;
CREATE POLICY "Signed-in users read categories"
  ON public.library_categories FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Anyone can read subcategories" ON public.library_subcategories;
CREATE POLICY "Signed-in users read subcategories"
  ON public.library_subcategories FOR SELECT TO authenticated
  USING (true);

REVOKE SELECT ON public.library_categories FROM anon;
REVOKE SELECT ON public.library_subcategories FROM anon;
GRANT SELECT ON public.library_categories TO authenticated;
GRANT SELECT ON public.library_subcategories TO authenticated;