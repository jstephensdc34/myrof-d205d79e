
# White-Label Packaging — Final Plan

Confirmed defaults: bracketed placeholders in LICENSE, single legal entity (multi-location OK), `SELLER_CHECKLIST.md` separate from buyer guide.

## Files to create

### 1. `LICENSE` (project root)
Custom proprietary "Single-Clinic Use" license:
- `© 2026 [Your Name / Company]. All rights reserved.` placeholder.
- **Grant:** non-exclusive, non-transferable, revocable license to deploy and use for **one (1) legal business entity** (the Licensee), covering all clinical locations operated by that entity.
- **Prohibited:** reselling, redistributing, sublicensing, leasing, white-labeling, sharing source code / build artifacts / repository access (GitHub link, fork, archive) with any third party or other entity.
- **Permitted:** internal modifications for use at the licensed entity.
- **Ownership:** all IP retained by Licensor; this is a license, not a sale.
- **Termination:** automatic on breach; buyer must destroy copies.
- **AS-IS, no warranty,** liability capped at fees paid.
- **Medical disclaimer:** documentation tool only, not a medical device, no medical advice.
- **Governing law:** `[Your Jurisdiction]` placeholder.

### 2. `setup.sql` (project root)
Single self-contained script consolidating all 12 existing migrations in chronological order:
- Extensions, enums, tables, indexes
- `GRANT` statements for `authenticated`/`service_role` (and `anon` only where policies allow)
- `ENABLE ROW LEVEL SECURITY` + all policies
- Functions/RPCs (`has_role`, `claim_and_update_library_item`, etc.) + triggers
- Storage: create `shared-reports` bucket as **public**, with policies (anon SELECT; authenticated INSERT/UPDATE/DELETE)
- Final `SELECT 'Setup complete' AS status;`

No schema changes — pure packaging.

### 3. `.env.example` (project root)
```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key-here
```

### 4. `BUYER_SETUP.md` (project root)
Non-developer step-by-step:
1. **Terms of Use warning** (boxed, top) — single-clinic license reminder, link to LICENSE.
2. What you need (Supabase free, Vercel free, ~15 min).
3. Create Supabase project.
4. Run `setup.sql` in SQL Editor.
5. Copy Project URL + anon key.
6. Deploy to Vercel (one-click button), paste env vars.
7. Sign up the clinic account on the live URL.
8. Optional: disable email confirmation in Supabase Auth.
9. Explicit "NOT required": no CLI, no edge functions, no OAuth, no SMTP.

### 5. `SELLER_CHECKLIST.md` (project root, your-eyes-only)
- One-time: fill LICENSE placeholders, make GitHub repo private template, test end-to-end, build the Deploy-to-Vercel URL.
- Per-sale: collect payment + GitHub username + clinic legal name, add as collaborator/send fork, deliver `BUYER_SETUP.md` + deploy link.

### 6. `README.md` (update)
Replace generic content with: project name, one-paragraph description, links to `BUYER_SETUP.md` and `LICENSE`, "Built with Lovable" footer.

## Order of Operations (the final answer to your question)

**Phase A — Seller (you), one time:**
1. Open `LICENSE`, replace `[Your Name / Company]` and `[Your Jurisdiction]`.
2. Open `SELLER_CHECKLIST.md`, follow the one-time section.
3. Push to GitHub as a private repository.
4. Do a dry-run buyer deployment yourself with throwaway Supabase + Vercel accounts to verify `setup.sql` runs clean and the app boots.
5. Build your Deploy-to-Vercel URL with the two env-var prompts pre-wired.

**Phase B — Per sale:**
1. Take payment; collect buyer's GitHub username + clinic legal name.
2. Grant repo access (collaborator on private repo, or hand off a fresh fork).
3. Send buyer the link to `BUYER_SETUP.md` + your Deploy-to-Vercel URL.

**Phase C — Buyer (~15 min, no code):**
1. Create Supabase project.
2. Paste `setup.sql` into Supabase SQL Editor, run it.
3. Copy Project URL + anon key from Supabase Settings → API.
4. Click Deploy to Vercel, paste the two keys, deploy.
5. Open the live URL, click Sign Up, create the single clinic account.
6. Start generating reports.

## How earlier decisions are reflected

| Decision | Reflected in |
|---|---|
| Edge functions removed | `BUYER_SETUP.md` has zero CLI steps; no function deployment mentioned |
| Email/password only | Step 7 = "click Sign Up"; no OAuth provider config in Supabase |
| Shared reports public bucket | `setup.sql` creates `shared-reports` as public + storage policies |
| Name = MyROF Report | Used throughout LICENSE, guide, README |
| Single-clinic license | `LICENSE` + Terms warning at top of `BUYER_SETUP.md` |

Approve and I'll generate all six files in one pass.
