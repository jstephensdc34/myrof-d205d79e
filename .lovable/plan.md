
# Welcome Kit Pivot

The buyer never needs the source code locally — Vercel clones the public repo for them. Only the **setup assets** ship as a small ZIP.

## 1. `scripts/build-handoff-zip.mjs`

- Change `FILES` array from 5 files to 3:
  - `BUYER_SETUP.md`
  - `setup.sql`
  - `LICENSE`
- Rename output: `dist-handoff/myrof-report-handoff.zip` → `dist-handoff/myrof-welcome-kit.zip`.
- Update the success log to say "Welcome Kit created".
- Drop `.env.example` (buyer pastes env vars directly into the Vercel UI from BUYER_SETUP Step 3) and `README.md` (lives in the public repo, not needed for setup).

## 2. `BUYER_SETUP.md`

- Insert a new **Step 0 — Open your Welcome Kit** above Step 1:
  > Unzip the Welcome Kit folder you received upon purchase. Open `setup.sql` in any text editor (Notepad, TextEdit, VS Code) and keep it open — you'll paste its contents in Step 2. You do **not** need to download the application source code; Vercel will pull it from our repository for you in Step 4.
- Renumber nothing else; existing Step 1–6 stay as-is.
- In **Step 4**, replace the parenthetical "or import the repo manually at vercel.com/new" with a single line clarifying that the Deploy-to-Vercel link the seller provided handles cloning automatically — no GitHub account required.
- In Troubleshooting, no changes needed (the `vercel.json` and SQL-error entries still apply).

## 3. `SELLER_CHECKLIST.md`

- Update the "Build the buyer ZIP" section:
  - Output path → `dist-handoff/myrof-welcome-kit.zip`
  - Contents list → `BUYER_SETUP.md`, `setup.sql`, `LICENSE` (3 files, not 5)
  - Add one sentence: "Buyers receive only this Welcome Kit + your Deploy-to-Vercel URL. They never clone the source repo."
- Update "Per-sale checklist" → replace "Grant repository access" block (Option A/B) with:
  - [ ] Email the buyer: Welcome Kit ZIP + Deploy-to-Vercel URL + license record.
  - Remove the GitHub collaborator / private fork instructions entirely.
- Remove "Buyer's GitHub username" from the "Collect from the buyer" list.
- "When ending a license" → drop "Revoke GitHub collaborator access" (no longer applicable); keep the LICENSE §6 destroy-copies notice.

## 4. Out of scope

- No changes to `setup.sql`, `.env.example`, app source code, or `vercel.json`.
- No changes to dry-run script or `release:check` (Welcome Kit still validates because all 3 files already exist at repo root).
- Not actually rebuilding the ZIP — that runs via `npm run handoff` after the patch.

## Technical notes

- `scripts/validate-handoff.mjs` is unaffected — it checks for presence of files at repo root, not ZIP membership. No update needed.
- Repository visibility (public vs private) is a seller decision outside this patch, but the plan assumes **public** so the Deploy-to-Vercel link works without any GitHub auth on the buyer's side. Confirm before I flip the seller checklist wording to "public repo" if you'd prefer to keep that ambiguous.
