# Fix "bucket not found" when uploading a clinic logo

## Cause
The logo uploader saves files to a storage area named `clinic-assets`. The buyer setup script creates it, but this project's own backend never got it. The only storage area here is `shared-reports`. Buyer installs that ran the setup script are not affected.

## Fix
1. Create a public `clinic-assets` storage bucket on this backend. Public is required because the logo is shown on reports and shared links.
2. Add the same access rules the setup script uses:
   - Anyone can view logos.
   - Signed-in users can upload.
   - Users can replace or delete only the files they uploaded.
3. Upload a logo in Settings to confirm it saves and appears on a report.

No app code or setup-script changes are needed.

## Technical details
- Bucket: made with the storage bucket tool (`clinic-assets`, public).
- Migration: storage.objects policies `clinic_assets_public_read` (SELECT to anon and authenticated), `clinic_assets_auth_insert` (INSERT to authenticated), and `clinic_assets_owner_update` / `clinic_assets_owner_delete` (owner = auth.uid()). These match setup.sql lines 329-349.
