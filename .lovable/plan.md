## Phase 4 — Final BYOK polish, deploy hardening & QA (revised)

Adjustments noted: email confirmation is now a **mandatory** pre-flight step, and the docs include an emergency admin password-reset path that bypasses SMTP entirely.

### 1. Vercel SPA hardening

- Add **`vercel.json`** with SPA rewrites so `/library`, `/report`, `/shared-report?id=...`, `/reset-password` all survive a hard refresh:
  ```json
  { "rewrites": [{ "source": "/(.*)", "destination": "/" }] }
  ```
- Add `Cache-Control: no-cache` header for `/library-seed.csv` so buyers always fetch the latest seed after a re-deploy.

### 2. Password reset flow (UI + emergency fallback)

UI flow:
- "Forgot password?" link on `AuthForm` login mode.
- `ForgotPasswordDialog` → `supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + '/reset-password' })`.
- New **`/reset-password`** public route that detects `type=recovery`, shows a new-password form, calls `supabase.auth.updateUser({ password })`, then routes to `/auth`.

Docs (Troubleshooting → **Emergency Admin Recovery**):
- Step-by-step instructions to bypass UI + SMTP entirely:
  1. Supabase dashboard → **Authentication → Users**
  2. Find your account → **⋯ menu → Send password recovery** (or **Reset password** to set one directly)
  3. If SMTP is unreliable, use **Reset password** to set a temporary password directly in the dashboard — no email needed.
- Explicit note that because the buyer owns the Supabase project, they can never be permanently locked out.

### 3. Friendly "database not set up yet" guard

If a buyer deploys with valid env vars but skips `setup.sql`, the app currently 404s silently in the console. Add:
- `useDatabaseReady` hook: one `head` query against `library_categories`.
- On `42P01` / PostgREST 404, render a `SetupRequired` screen mirroring the existing `Configuration required` style, pointing back to BUYER_SETUP.md Step 2.

### 4. Email-confirmation aware signup (UI fallback only)

- After `signUp`, inspect `data.session`. If null, show "Check your email to confirm your account — if it doesn't arrive within a minute, see BUYER_SETUP.md Troubleshooting" and stay on `/auth`.
- This is purely a safety net. Per the revised plan, the docs push buyers to disable email confirmation entirely before first login, so this path should rarely fire.

### 5. BUYER_SETUP.md — mandatory pre-flight step

Insert a new **Step 3.5 — REQUIRED: Disable email confirmation** between Step 3 (copy keys) and Step 4 (deploy to Vercel), with strong wording:

> ### ⚠️ Step 3.5 — REQUIRED: Disable email confirmation
>
> Supabase's built-in test email server is heavily rate-limited and frequently drops messages in the first week. If you skip this step, your very first signup may never receive a confirmation email and you'll be locked out of your own app.
>
> 1. In your Supabase project, go to **Authentication → Providers → Email**.
> 2. Toggle **Confirm email** to **OFF**.
> 3. Click **Save**.
>
> You can re-enable confirmation later after configuring your own SMTP provider — but for initial setup, this step is mandatory, not optional.

The existing "Step 5 — Create your clinic login" now works on the first try.

Troubleshooting section additions:
- "I never received my confirmation email" → points back to Step 3.5.
- "I'm locked out of my account" → Emergency Admin Recovery (Section 2 above).
- "App loads but everything 404s / 'Setup required' screen" → run `setup.sql`.
- "Configuration required screen" → check Vercel env vars.

### 6. Final no-OAuth audit

The only `google|apple|oauth` match in `src/` is unrelated string content in `renderReportToHtml.tsx`. Lock it in with a CI-style check: new `scripts/validate-handoff.mjs` greps for `signInWithOAuth` / `signInWithOtp` and fails loudly if either reappears. Wired into `npm run handoff:check`.

### 7. End-to-end dry-run checklist for the seller

New `scripts/dry-run-checklist.mjs` — interactive terminal checklist the seller ticks off before each release. Now includes the SMTP-bypass steps explicitly:
1. Fresh Supabase project created
2. `setup.sql` ran clean
3. **Email confirmation toggled OFF in Supabase**
4. Env vars set in Vercel; build succeeded
5. Signup → immediate login works (no email round-trip)
6. Load Starter Library imported N items
7. Library item create/edit/delete works
8. Report generation + PDF + share link in incognito
9. `/reset-password` works end-to-end (or admin-reset documented works)
10. `npm run handoff:check` exits clean

Writes a timestamped log to `dist-handoff/dry-run-<date>.log`.

### 8. Doc polish (SELLER_CHECKLIST.md, README.md)

- `SELLER_CHECKLIST.md`: add dry-run script + no-OAuth grep + reminder that BUYER_SETUP.md Step 3.5 is mandatory wording.
- `README.md`: tighten buyer summary; add "What's not included" (no OAuth, no transactional email, no AI keys, no production SMTP — buyers may add their own SMTP in Supabase later).

### Technical details

- **New files:** `vercel.json`, `src/pages/ResetPassword.tsx`, `src/components/auth/ForgotPasswordDialog.tsx`, `src/hooks/useDatabaseReady.ts`, `src/components/SetupRequired.tsx`, `scripts/validate-handoff.mjs`, `scripts/dry-run-checklist.mjs`.
- **Edited:** `src/App.tsx` (new `/reset-password` route + setup guard wrapper), `src/components/auth/AuthForm.tsx` (forgot-password link, session-aware signup), `BUYER_SETUP.md`, `SELLER_CHECKLIST.md`, `README.md`, `package.json` (add `handoff:check`, `dry-run` scripts).
- No new runtime deps. No edge functions. No new secrets. No OAuth.

### Out of scope

- Custom transactional email (Resend) — excluded per project memory.
- OAuth providers — excluded per project memory.
- Multi-tenant or role hierarchies beyond single-clinic.
- In-app admin UI for Supabase configuration.

Approve to execute.
