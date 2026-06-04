
-- 1. care_plans: scope SELECT/UPDATE/DELETE to owner
DROP POLICY IF EXISTS "Authenticated users can view all care plans" ON public.care_plans;
DROP POLICY IF EXISTS "Authenticated users can update care plans" ON public.care_plans;
DROP POLICY IF EXISTS "Authenticated users can delete care plans" ON public.care_plans;

CREATE POLICY "Users can view their own care plans"
  ON public.care_plans FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own care plans"
  ON public.care_plans FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own care plans"
  ON public.care_plans FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- 2. report_settings: restrict reads + writes to authenticated users (single-clinic app)
DROP POLICY IF EXISTS "Allow public read access" ON public.report_settings;
DROP POLICY IF EXISTS "Allow authenticated users to insert" ON public.report_settings;
DROP POLICY IF EXISTS "Allow authenticated users to update" ON public.report_settings;
DROP POLICY IF EXISTS "Allow authenticated users to delete" ON public.report_settings;

CREATE POLICY "Authenticated can read report settings"
  ON public.report_settings FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Authenticated can insert report settings"
  ON public.report_settings FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated can update report settings"
  ON public.report_settings FOR UPDATE TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated can delete report settings"
  ON public.report_settings FOR DELETE TO authenticated
  USING (auth.uid() IS NOT NULL);

-- 3. clinic-assets storage: scope UPDATE/DELETE to file owner
DROP POLICY IF EXISTS "Allow authenticated users to update files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete files" ON storage.objects;

CREATE POLICY "Users can update their own clinic-assets files"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'clinic-assets' AND owner = auth.uid())
  WITH CHECK (bucket_id = 'clinic-assets' AND owner = auth.uid());

CREATE POLICY "Users can delete their own clinic-assets files"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'clinic-assets' AND owner = auth.uid());

-- 4. shared-reports storage: add owner-scoped UPDATE/DELETE
CREATE POLICY "Users can update their own shared-reports files"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'shared-reports' AND owner = auth.uid())
  WITH CHECK (bucket_id = 'shared-reports' AND owner = auth.uid());

CREATE POLICY "Users can delete their own shared-reports files"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'shared-reports' AND owner = auth.uid());

-- 5. Lock down SECURITY DEFINER function so only authenticated users can execute it
REVOKE EXECUTE ON FUNCTION public.claim_and_update_library_item(uuid, uuid, text, text, text, text, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.claim_and_update_library_item(uuid, uuid, text, text, text, text, text, text) TO authenticated;

-- 6. Fix mutable search_path on update_modified_column trigger function
CREATE OR REPLACE FUNCTION public.update_modified_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$function$;
