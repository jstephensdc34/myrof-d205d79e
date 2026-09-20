# Seller Checklist — Internal Use Only

> Do **not** include this file when distributing the repo to buyers.
> Delete it from any fork you hand off, or keep buyers on a private
> repo where they only see the necessary files.

---

## One-time setup (do this once, before your first sale)

- [ ] Open `LICENSE` and replace:
  - [ ] `[Your Name / Company]` with your legal copyright holder name
  - [ ] `[Your Jurisdiction]` with your governing jurisdiction (e.g. "the State of California, USA")
- [ ] Update `README.md` contact / support email if you want a public-facing one.
- [ ] Push the repo to GitHub as a **private** repository (settings → Visibility → Private).
- [ ] Optionally mark it as a **template repository** so each buyer fork is independent.
- [ ] Build your one-click Deploy-to-Vercel URL:

      https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FYOUR_ORG%2FYOUR_REPO&env=VITE_SUPABASE_URL,VITE_SUPABASE_ANON_KEY&envDescription=Get%20these%20from%20Supabase%20Project%20Settings%20%E2%86%92%20API

- [ ] Do a full **dry-run deployment** yourself using throwaway Supabase + Vercel accounts:
  - [ ] `setup.sql` runs clean with `Setup complete`
  - [ ] **Disabled "Confirm email"** in Supabase → Authentication → Providers → Email (matches BUYER_SETUP.md Step 3.5)
  - [ ] App loads on the Vercel URL
  - [ ] Sign up + log in works
  - [ ] **Load Starter Library** button appears on the empty Library page and imports without errors
  - [ ] Create a library item
  - [ ] Generate a report (PDF download works)
  - [ ] Share a report (shared link loads in a fresh browser)
  - [ ] `/reset-password` flow works end-to-end (or admin-reset path in BUYER_SETUP.md Troubleshooting works)
  - [ ] `npm run handoff:check` exits clean (no OAuth in src/, all handoff files present)

You can run the full interactive checklist with:

```
npm run dry-run
```

A timestamped pass/fail log is written to `dist-handoff/dry-run-<date>.log`.

---

## Before each release: refresh the starter library

The starter library ships as `public/library-seed.csv` inside the repo and
is served as `/library-seed.csv` on the deployed app. Re-export it from
your live database whenever you've added/edited items you want buyers to
receive:

```
npm run library:export   # pulls from your Supabase into public/library-seed.csv
npm run library:check    # validates IDs against setup.sql
```

`library:export` reads `SUPABASE_SERVICE_ROLE_KEY` (preferred) or
`VITE_SUPABASE_ANON_KEY` from `.env.local`. The service-role key bypasses
RLS so per-user rows are included as shared starter content.

Commit the updated CSV and re-deploy. Buyers who deploy after that point
get the latest version automatically.

---

## Releasing updates to existing buyers

Buyers deploy through the one-click Vercel link, which **copies** this
repo into the buyer's GitHub account (it is a copy, not a fork — the
"Sync fork" button will not exist for them). The buyer's copy stays
connected to their Vercel project, so any change merged into the
buyer's `main` triggers an automatic Vercel redeploy. Updates use that.

### Pre-release checklist (you, before announcing an update)

- [ ] Confirm your latest Lovable changes are on your public GitHub repo
      (Lovable pushes automatically; spot-check a recent change on GitHub).
- [ ] Starter library changed? Run `npm run library:export` and
      `npm run library:check`, then commit the updated
      `public/library-seed.csv`.
- [ ] Did `setup.sql` change? If yes, the update email must tell buyers
      to re-run it (Supabase → SQL Editor → paste new `setup.sql` → Run).
      The script is safe to re-run on an existing database.
- [ ] Rebuild the Welcome Kit (`npm run handoff`) and re-attach the ZIP
      to the update email **only if** `setup.sql`, `BUYER_SETUP.md`, or
      `LICENSE` changed. Code-only updates need no new ZIP.
- [ ] Build each buyer's update link (see Primary method below).

### Primary method — GitHub compare link (no command line)

For each buyer, build this link once per release and put it in the
update email (the buyer's GitHub username/repo differ per buyer):

```
https://github.com/BUYER-USERNAME/BUYER-REPO/compare/main...YOUR-USERNAME/YOUR-REPO:main
```

When the buyer opens it, GitHub compares their `main` against your
public repo's `main` and offers to create a pull request. Merging that
PR pulls your update into their repo, and Vercel redeploys
automatically in 1–3 minutes. Their URL, Vercel project, database, and
data are all untouched.

Buyers never edit code, so conflicts should not occur. If GitHub shows
a conflict or the merge errors out, use the fallback below.

### Fallback method — redeploy fresh

Only if the compare-link merge fails:

1. Buyer clicks your original Deploy-to-Vercel link again.
2. Re-enters the same two environment variables
   (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` — same Supabase
   project, so all data is preserved).
3. Deploys. This creates a **new** URL and a new copy of the repo.

State the trade-offs in the email: bookmarks must be updated, and the
old Vercel project + GitHub copy should be deleted once the new one is
verified.

### Update email template (fill in the blanks and send)

```text
Subject: Update available for Chiropractic Patient Report Generator

Hi [Buyer first name],

We've shipped an update to Chiropractic Patient Report Generator.
This release includes:

- [Change 1 — e.g. New report style options]
- [Change 2]

Updating takes about 2 minutes and does not touch your data,
settings, or library:

1. Open this link: [compare link]
2. GitHub will show a "Comparing changes" page. Click
   "Create pull request".
3. On the next screen, click "Merge pull request", then confirm.
4. Wait 2–3 minutes — your app redeploys automatically. Refresh
   your app tab to see the update.

[Only if setup.sql changed:] This update also includes a database
improvement. In your Supabase project, open SQL Editor, paste the
contents of the updated setup.sql (attached), and click Run.

[Only if ZIP re-attached:] The updated setup guide is attached
([welcome-kit.zip]) — replace your saved copy.

[Only if a problem occurs:] If GitHub shows an error or conflict,
reply to this email and we'll walk you through a fresh redeploy —
your data is safe either way.

Questions? Just reply.
[Your name]
```

### Post-release verification (you, on your dummy deployment)

- [ ] App loads at the buyer-style URL with no setup screens
- [ ] Sign-up / log in works
- [ ] Latest features are visible (e.g. report style toggle, UI layout options)
- [ ] Generate a report; PDF download works
- [ ] Share a report; the shared link loads in a fresh browser

---

## Build the Welcome Kit ZIP (one command)

Bundle the three setup assets the buyer actually needs into a single download:

```
npm install        # one time
npm run handoff
```

Output: `dist-handoff/chiropractic-patient-report-generator-welcome-kit.zip` — attach this single file to
the buyer handoff email. It contains: `BUYER_SETUP.md`, `setup.sql`,
`LICENSE`.

Buyers receive only this Welcome Kit plus your Deploy-to-Vercel URL. They
never clone the source repo, and they never need a GitHub account — the
Vercel one-click link handles cloning from your public repository for them.

The starter library (`public/library-seed.csv`) is **not** in the ZIP —
it ships inside the Vercel deployment automatically. Buyers load it from
the in-app "Load Starter Library" button.

`SELLER_CHECKLIST.md` is also intentionally excluded from the ZIP.

---

## Per-sale checklist

- [ ] Payment received and recorded.
- [ ] Collect from the buyer:
  - [ ] Buyer's full legal business entity name (for license record)
  - [ ] Primary contact email
- [ ] Email the buyer:
  - [ ] The Welcome Kit ZIP (`dist-handoff/chiropractic-patient-report-generator-welcome-kit.zip`)
  - [ ] Your custom Deploy-to-Vercel URL
  - [ ] Their license record (entity name + sale date)
- [ ] Log the sale in your records: entity name, sale date, version sold.

---

## When ending a license

- [ ] Notify buyer in writing that the license has terminated and they must destroy all copies (per LICENSE §6).