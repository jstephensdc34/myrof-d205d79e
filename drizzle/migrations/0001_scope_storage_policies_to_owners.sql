DROP POLICY IF EXISTS "Public can read shared reports" ON storage.objects;
DROP POLICY IF EXISTS "clinic_assets_public_read" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can upload shared reports" ON storage.objects;
DROP POLICY IF EXISTS "clinic_assets_auth_insert" ON storage.objects;

CREATE POLICY "Owners read own shared reports" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'shared-reports' AND owner = auth.uid());
CREATE POLICY "Owners read own clinic assets" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'clinic-assets' AND owner = auth.uid());
CREATE POLICY "Users upload shared reports to own folder" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'shared-reports' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users upload clinic assets to own folder" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'clinic-assets' AND (storage.foldername(name))[1] = auth.uid()::text);