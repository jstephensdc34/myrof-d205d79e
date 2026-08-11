# Fix the "Updating your app" instructions (there is no Sync fork button)

## What we got wrong
The Vercel one-click deploy link does **not** create a GitHub *fork*. It creates an independent copy of the repository in the buyer's own account (your dummy repo `bearstephens34/myrof` confirms this — GitHub shows "You own ... and are not a member of any organizations" instead of a fork banner). Because it is not a fork, there is no **Sync fork → Update branch** button, so the current instructions in `BUYER_SETUP.md` and `SELLER_CHECKLIST.md` cannot be followed.

## New recommended update path: re-deploy fresh
This is the only path that needs zero Git knowledge and zero command line, which matches the promise made everywhere else in the guide. The buyer's Supabase project holds all data, so redeploying the frontend loses nothing.

Buyer steps:
1. If the seller says the database changed, run the new `setup.sql` in Supabase → SQL Editor first and wait for `Setup complete`.
2. Click the seller's **Deploy to Vercel** link again. Vercel creates a new project with a fresh copy of the latest code.
3. Paste the same two environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) from Supabase → Project Settings → API.
4. Deploy, then open the new URL and log in — all library items, reports, and settings are still there because the database never changed.
5. Optional: move the custom domain (or bookmark) to the new project, then delete the old Vercel project.

Also add a short note: the buyer's login, library, and shared report links live in Supabase, not Vercel, so redeploying is safe.

## Secondary path (advanced, optional)
For buyers comfortable with GitHub: open their copied repo, use **Add file → Upload files** or GitHub's import tool to replace the contents from the seller's repo URL, which triggers the existing Vercel project to redeploy on the same URL. Mark this clearly as optional/advanced.

## Files to change
- `BUYER_SETUP.md` — replace the entire "Updating your app to the latest version" section (currently lines ~118-136) with the re-deploy-fresh steps plus the advanced note. Also add a troubleshooting entry: "I can't find the Sync fork button" → explains it is a copy, not a fork, and points to the new section.
- `SELLER_CHECKLIST.md` — rewrite "Releasing updates to existing buyers": drop the sync-fork wording, describe the re-deploy path, and update the buyer-update email template to say "click your Deploy to Vercel link again and re-enter the two Supabase keys".
- Regenerate the Welcome Kit with `npm run handoff` so the ZIP in `public/` and `dist-handoff/` carries the corrected guide.

## Out of scope
- No application code changes.
- No database or schema changes.
