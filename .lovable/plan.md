# Plan: Buyer Update Process (document + live walkthrough)

## Goal

Give the seller a tested, repeatable process for shipping updates to already-deployed buyer apps, documented as a seller-side email template in `SELLER_CHECKLIST.md`. The user will then perform the update live on their dummy Vercel deployment (buyer repo: `bearstephens34/myrof`) to validate each step.

## Background (current state)

- The Vercel one-click deploy creates a **copy** of the seller's repo in the buyer's GitHub account — it is not a fork, so GitHub's "Sync fork" button does not appear (confirmed earlier via the buyer's tooltip).
- The buyer's repo is still connected to Vercel: any change merged into the buyer's `main` triggers an automatic Vercel redeploy.
- An earlier "Updating your app" section was added to BUYER_SETUP.md and then removed at the user's request — updates are seller-announced, not pre-documented for buyers.
- The Welcome Kit stays exactly three files: `BUYER_SETUP.md`, `setup.sql`, `LICENSE`. Nothing buyer-facing changes.

## Changes

### 1. Add "Releasing updates to existing buyers" section to `SELLER_CHECKLIST.md`

Containing:

- **Pre-release seller checklist:**
  - Confirm Lovable changes are synced to the seller's GitHub repo (Lovable pushes automatically).
  - If the starter library changed: `npm run library:export`, `npm run library:check`, commit.
  - Note whether `setup.sql` changed; if yes, include the re-run instruction in the update email (buyers paste the new `setup.sql` into Supabase SQL Editor — the script is safe to re-run).
  - Rebuild the Welcome Kit (`npm run handoff`) only if `setup.sql`, `BUYER_SETUP.md`, or `LICENSE` changed; re-send the ZIP only in that case.
- **Primary method — GitHub compare-link pull request (no command line, keeps the buyer's URL and Vercel app):**
  - The seller builds the link once per release:
    `https://github.com/BUYER-USERNAME/BUYER-REPO/compare/main...SELLER-USERNAME/SELLER-REPO:main`
    and includes it in the update email (buyer username differs per buyer).
  - Buyer steps (documented verbatim for the email template): open the link → **Create pull request** → confirm base is buyer's repo / head is the seller's repo → **Merge pull request** → Vercel auto-redeploys in 1–3 minutes.
  - Note: buyers who never edit code will see no conflicts. If GitHub shows conflicts or the merge fails → fallback.
- **Fallback method — redeploy fresh:**
  - Click the original Deploy-to-Vercel link again, re-enter the same two Supabase env vars, deploy.
  - Trade-offs to state in the email: new URL (update bookmarks), old Vercel project/repo should be deleted after the new one works, database data is untouched because it lives in Supabase.
- **Fill-in-the-blanks update email template** the seller pastes into each release announcement, with slots for: what changed, whether the Welcome Kit ZIP is re-attached, whether `setup.sql` must be re-run, and the compare link.
- **Post-release seller verification** mirrors the dry-run list (app loads, sign-up/login, report generation, share link).

### 2. No other file changes

- `BUYER_SETUP.md`, `setup.sql`, `LICENSE`, app code: unchanged. Welcome Kit ZIP unchanged (regenerate only if a doc changes — it should not here).

## Live walkthrough (in chat, after the doc edit)

Walk the user through the primary method against the dummy deployment step by step, using the real repo names:

1. Open the compare link for `bearstephens34/myrof` vs the seller's repo.
2. Create and merge the pull request.
3. Watch Vercel pick up the merge (Deployments tab shows a new build).
4. Verify the updated app loads and the latest features are present (e.g. Report Style toggle, UI layout options).
5. If the merge path hits a snag, run the fallback redeploy-fresh on the dummy account instead and document what actually happened.

## Technical notes

- The compare URL is a standard GitHub feature that works between any two repos, fork or not; it creates a PR from the seller's `main` into the buyer's `main`.
- Merge conflicts are only possible if the buyer edited code files, which the product deliberately avoids (all customization is data: settings rows, library items).
- Vercel redeploy on push requires the buyer's Vercel project to remain connected to their GitHub repo (default after the one-click deploy).
