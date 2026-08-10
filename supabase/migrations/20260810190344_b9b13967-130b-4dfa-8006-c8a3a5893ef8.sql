CREATE POLICY "Public can read shared reports"
ON storage.objects FOR SELECT
USING (bucket_id = 'shared-reports');

CREATE POLICY "Authenticated can upload shared reports"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'shared-reports');

CREATE POLICY "Owners can update shared reports"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'shared-reports' AND owner = auth.uid())
WITH CHECK (bucket_id = 'shared-reports' AND owner = auth.uid());

CREATE POLICY "Owners can delete shared reports"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'shared-reports' AND owner = auth.uid());