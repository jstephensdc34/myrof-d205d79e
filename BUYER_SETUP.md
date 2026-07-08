# MyROF Report — Buyer Deployment Guide

Welcome. This guide walks you through deploying your own private copy
of MyROF Report in about 15 minutes. No coding, no command line.

---

> ## ⚠️ Terms of Use
>
> Your purchase grants you a **single-clinic license** to deploy and
> use this software for **one (1) legal business entity** (your clinic
> or clinic group). You may **NOT** share this repository, source code,
> deployment, or any access link with any other clinic, business, or
> third party. Reselling, redistributing, or sublicensing is strictly
> prohibited. See the `LICENSE` file in this repository for full terms.
> Violation will terminate your license immediately.

---

## What you'll need

- A free [Supabase](https://supabase.com) account (your database & login system)
- A free Github account 
- A free Vercel account (where the app will live online) - (log in with your github account)

- About 15 minutes

You do **not** need: a developer, a command line, Docker, an OAuth
account, an email service, or any paid API key.

---

## Step 0 — Open your Welcome Kit

Unzip the Welcome Kit folder you received upon purchase. Inside you'll find
three files: this guide (`BUYER_SETUP.md`), `setup.sql`, and `LICENSE`.

Open `setup.sql` in any plain text editor (Notepad on Windows, TextEdit on
Mac, or VS Code) and keep it open — you'll paste its contents in Step 2.

You do **not** need to download the application source code. Vercel will
pull it from our repository automatically in Step 4. No GitHub account is
required.

## Step 1 — Create your Supabase project

1. Sign in at [supabase.com](https://supabase.com) and click **New Project**.
2. Pick a name (e.g. "myrof-report"), set a strong database password, and choose the region closest to your clinic.
3. Wait ~2 minutes for the project to finish provisioning.

## Step 2 — Set up the database

1. In your new Supabase project, click **SQL Editor** in the left sidebar.
2. Click **New query**.
3. Open the `setup.sql` file from this repository, copy its **entire** contents, and paste them into the editor.
4. Click **Run** (or press Ctrl/Cmd + Enter).
5. You should see `Setup complete` in the results panel. The database now has every table, security policy, and storage bucket the app needs.

## Step 3 — Copy your Supabase keys

1. In Supabase, go to **Project Settings → API**.
2. Copy these two values and keep them handy:
   - **Project URL** (looks like `https://abcdefgh.supabase.co`)
   - **`anon` `public` key** (a long string starting with `eyJ...`)

These are safe to use in the deployed app — they are public keys.
Do **not** copy the `service_role` key.

> **Paste the Project URL exactly as shown** — just the origin
> (e.g. `https://abcdefgh.supabase.co`). Do **not** include a trailing
> `/`, `/rest/v1`, `/auth`, quotes, or spaces. Do not paste the
> `supabase.com/dashboard/project/...` URL from your browser address
> bar — that is the dashboard, not your Project URL.

## ⚠️ Step 3.5 — REQUIRED: Disable email confirmation

**Do not skip this step.** Supabase's built-in test email server is heavily
rate-limited and frequently drops messages in the first week of a new
project. If you leave confirmation on, your very first signup may never
receive a confirmation email and you'll be locked out of your own app
before you've even started.

1. In your Supabase project, go to **Authentication → Providers → Email**.
2. Toggle **Confirm email** to **OFF**.
3. Click **Save**.

You can re-enable confirmation later after configuring your own SMTP
provider in Supabase. For initial setup, this step is mandatory.

## Step 4 — Deploy to Vercel

1. Click the **Deploy to Vercel** link your seller provided. This one-click link clones the application source into your own Vercel account automatically — you don't need a GitHub account or any local code.
2. When Vercel asks for **Environment Variables**, paste:
   - `VITE_SUPABASE_URL` = the Project URL from Step 3
   - `VITE_SUPABASE_ANON_KEY` = the `anon` key from Step 3
3. Click **Deploy**. The first build takes 1–3 minutes.
4. When the build finishes, click **Visit** to open your live site.

## Step 5 — Create your clinic login

1. Open your live URL.
2. Click **Sign Up** and create your clinic's account using your work email and a strong password.
3. Log in. You're ready to start building your library and generating reports.

## Step 6 — Load the starter library

1. After signing in, click **Library** in the top navigation.
2. You'll see a **Load Starter Library** button at the top-right.
3. Click it and confirm. The app loads the curated starter content that
   shipped with your deployment. When it finishes you'll see
   "Imported N starter items".
4. The button disappears once your library has items in it — no risk of
   accidentally re-importing later. You can edit, add, or delete any
   item from here on.

---

## What is NOT required

You will not need to do any of the following — they are intentionally not part of this app:

- ❌ Install any command-line tools (no Supabase CLI, no Docker, no Node)
- ❌ Deploy edge functions or serverless functions
- ❌ Configure Google, Apple, or any social sign-in
- ❌ Set up an email service (Resend, SendGrid, SMTP)
- ❌ Buy a custom email domain
- ❌ Manage any API keys other than the two Supabase keys above

---

## Troubleshooting

**"Configuration required" screen on first load.**
Your Vercel environment variables aren't set or don't match. Open Vercel
→ Project → Settings → Environment Variables and re-paste the values
from Supabase → Project Settings → API. Redeploy.

**"Database setup required" screen on first load.**
You skipped Step 2. Open Supabase → SQL Editor, paste the entire
`setup.sql`, and click Run. Reload the page.

**Signup fails with "Invalid path specified in request URL".**
Your `VITE_SUPABASE_URL` in Vercel has extra characters. It must be
exactly your Project URL with nothing after `.supabase.co` — no
trailing `/`, no `/rest/v1`, no `/auth`, no quotes, no spaces. Fix it
in Vercel → Settings → Environment Variables, then redeploy from the
Deployments tab (three-dot menu → Redeploy).

**I never received my confirmation email after signing up.**
You skipped Step 3.5. Go back, toggle **Confirm email** off in Supabase,
then either sign up with a different email or use the Emergency Admin
Recovery below to set a password directly.

**I'm locked out of my account (Emergency Admin Recovery).**
Because you own the Supabase project, you can never be permanently
locked out — even if email delivery is broken:

1. Open your Supabase project → **Authentication → Users**.
2. Find your account email in the list.
3. Click the **⋯ menu → Reset password** to set a new password directly
   (no email needed). Use that password to log in.
4. As an alternative, **⋯ menu → Send password recovery** will email a
   reset link — but only do this once Step 3.5 / your own SMTP is set up.

**The SQL setup script shows an error.**
You may have run it twice. The script is safe to re-run on a fresh
project — if you've already created tables, delete the Supabase project
and start fresh, or contact your seller.

**A shared report link returns 404 / blank.**
Make sure Step 2 completed and `Setup complete` was shown. The
shared-reports storage bucket is created at the end of that script.
If the link is more than 90 days old, it has been removed by the
automatic cleanup job (see "Shared report retention" below).

**Shared report retention (90 days).**
Shared-report HTML files are automatically deleted 90 days after they
are created by a daily background job that calls the
`cleanup-shared-reports` edge function. Two things must be true for
this to work:

1. Before running `setup.sql`, open it and replace the two placeholders
   near the bottom (`<YOUR-PROJECT-REF>` and `<YOUR-ANON-KEY>`) with
   the values from your Supabase Project Settings → API page.
2. Deploy the `cleanup-shared-reports` edge function shipped in
   `supabase/functions/cleanup-shared-reports/` (Supabase CLI:
   `supabase functions deploy cleanup-shared-reports --no-verify-jwt`).

To change the retention window, edit `RETENTION_DAYS` at the top of
`supabase/functions/cleanup-shared-reports/index.ts` and redeploy.

**Deep links (e.g. /library) 404 on page refresh.**
The `vercel.json` SPA rewrite handles this automatically. If you removed
or modified it, restore the original from the repo root.

---

## Support & disclaimer

This software is provided AS IS under the terms of the `LICENSE` file.
It is a documentation tool — not a medical device — and does not
provide medical advice. You and your clinicians remain solely
responsible for all clinical content and patient care decisions.

For support, contact the seller you purchased your license from.
