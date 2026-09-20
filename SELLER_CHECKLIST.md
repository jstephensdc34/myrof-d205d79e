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
"Sync fork" button will not exist for them).

> **Tested finding:** GitHub's compare-link / pull-request method does
> NOT work for these copy-based buyers. GitHub compares only repos in
> the same fork network, and the buyer's copy has unrelated history, so
> the compare page reports "There isn't anything to compare." Do not
> send compare links. Use the redeploy-fresh method below.

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

### Update method — redeploy fresh (the only method that works)

Because the buyer's repo is a copy, the reliable update is a fresh
redeploy from your repo. The buyer's database lives in their own
Supabase project, so their data, settings, and library are untouched —
only the app code is replaced.

Buyer steps (include these in the update email):

1. Open your Deploy-to-Vercel link (the same one from their original
   setup).
2. Vercel creates a new project from the latest code. When asked, enter
   the same two environment values as before (`VITE_SUPABASE_URL` and
   `VITE_SUPABASE_ANON_KEY` — see their original setup guide). Using the
   same values is what keeps all existing data.
3. Click Deploy and wait 1–3 minutes.
4. Open the new URL and confirm the update is visible.

Trade-offs to state in the email: the app lives at a new URL (bookmarks
must be updated), and once the new deployment is verified, the buyer
should delete the old Vercel project and the old repo copy in their
GitHub account.

### Update email template (fill in the blanks and send)

```text
Subject: Update available for Chiropractic Patient Report Generator

Hi [Buyer first name],

We've shipped an update to Chiropractic Patient Report Generator.
This release includes:

- [Change 1 — e.g. New report style options]
- [Change 2]

Updating takes about 5 minutes and does not touch your data,
settings, or library. Your app will move to a new web address —
just update your bookmark:

1. Open this link: [your Deploy-to-Vercel URL]
2. Vercel builds the updated app. When asked, enter the same two
   values as your original setup (they're in your saved setup guide):
   VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY. Using the same
   values is what keeps all your existing reports and data.
3. Click Deploy and wait 1–3 minutes.
4. Open your new app link and confirm you can see the update.

[Only if setup.sql changed:] This update also includes a database
improvement. In your Supabase project, open SQL Editor, paste the
contents of the updated setup.sql (attached), and click Run.

[Only if ZIP re-attached:] The updated setup guide is attached
([welcome-kit.zip]) — replace your saved copy.

Once you've confirmed everything works, you can delete your old
Vercel project and the old copy of the code in your GitHub account —
we'll point you to the right ones if you're unsure.

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