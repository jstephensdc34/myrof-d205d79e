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

      https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FYOUR_ORG%2FYOUR_REPO&env=VITE_SUPABASE_URL,VITE_SUPABASE_PUBLISHABLE_KEY&envDescription=Get%20these%20from%20Supabase%20Project%20Settings%20%E2%86%92%20API

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

## Build the buyer ZIP (one command)

Bundle the five buyer-handoff docs into a single download:

```
npm install        # one time
npm run handoff
```

Output: `dist-handoff/myrof-report-handoff.zip` — attach this single
file to the buyer handoff email. It contains: `LICENSE`, `setup.sql`,
`.env.example`, `BUYER_SETUP.md`, `README.md`.

The starter library (`public/library-seed.csv`) is **not** in the ZIP —
it ships inside the Vercel deployment automatically. Buyers load it from
the in-app "Load Starter Library" button.

`SELLER_CHECKLIST.md` is also intentionally excluded from the ZIP.

---

## Per-sale checklist

- [ ] Payment received and recorded.
- [ ] Collect from the buyer:
  - [ ] Buyer's full legal business entity name (for license record)
  - [ ] Buyer's GitHub username (if granting repo access directly)
  - [ ] Primary contact email
- [ ] Grant repository access:
  - **Option A (recommended):** Add buyer as a collaborator on a fresh private fork dedicated to that buyer.
  - **Option B:** Send them a zip / archive of the source.
- [ ] Send the buyer:
  - [ ] Link to `BUYER_SETUP.md`
  - [ ] Your custom Deploy-to-Vercel URL
  - [ ] Their license record (entity name + sale date)
- [ ] Log the sale in your records: entity name, sale date, GitHub access granted, version sold.

---

## When ending a license

- [ ] Revoke GitHub collaborator access.
- [ ] Notify buyer in writing that the license has terminated and they must destroy all copies (per LICENSE §6).