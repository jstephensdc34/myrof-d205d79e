# Fix "Bucket not found" on Copy Email / Share Report Link

## What's happening
Both buttons upload the generated report HTML to a storage bucket named `shared-reports`. That bucket exists in your Vercel/Supabase instance (it's created by `setup.sql`), but it was never created in this Lovable preview backend — so every share/copy attempt fails with "Bucket not found".

## The fix
1. Create the public `shared-reports` bucket in this project's backend.
2. Add the matching storage access rules so:
   - anyone can read shared report files (that's what makes the link work for patients),
   - signed-in users can upload, and update/delete only their own files.
3. Re-test: sign in, build a report, click "Share Report Link" and "Copy Email to Clipboard" and confirm a link is produced and opens in the shared-report viewer.

Nothing changes in the buyer-facing `setup.sql` — it already creates this bucket and these policies, so buyer deployments are unaffected.

## Technical notes
- Bucket created with the storage bucket tool (`name: shared-reports`, `public: true`).
- Policies added on `storage.objects` mirroring `setup.sql` lines 334-359: public SELECT, authenticated INSERT, owner-scoped UPDATE/DELETE.
- The daily 90-day cleanup cron in `setup.sql` targets a deployed project ref; it is not required for preview testing.
