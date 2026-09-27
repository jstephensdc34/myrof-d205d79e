DROP POLICY IF EXISTS "clinic_assets_public_read" ON storage.objects;
DROP POLICY IF EXISTS "clinic_assets_auth_insert" ON storage.objects;
DROP POLICY IF EXISTS "clinic_assets_owner_update" ON storage.objects;
DROP POLICY IF EXISTS "clinic_assets_owner_delete" ON storage.objects;
CREATE POLICY "clinic_assets_public_read" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'clinic-assets');
CREATE POLICY "clinic_assets_auth_insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'clinic-assets');
CREATE POLICY "clinic_assets_owner_update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'clinic-assets' AND owner = auth.uid()) WITH CHECK (bucket_id = 'clinic-assets' AND owner = auth.uid());
CREATE POLICY "clinic_assets_owner_delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'clinic-assets' AND owner = auth.uid());