
-- Create the shared-reports storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('shared-reports', 'shared-reports', true);

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload shared reports"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'shared-reports');

-- Allow public read access
CREATE POLICY "Public can read shared reports"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'shared-reports');
