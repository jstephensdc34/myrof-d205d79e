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
- A free [Vercel](https://vercel.com) account (where the app will live online)
- About 15 minutes

You do **not** need: a developer, a command line, Docker, an OAuth
account, an email service, or any paid API key.

---

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

## Step 4 — Deploy to Vercel

1. Click the **Deploy to Vercel** link your seller provided (or import the repo manually at [vercel.com/new](https://vercel.com/new)).
2. When Vercel asks for **Environment Variables**, paste:
   - `VITE_SUPABASE_URL` = the Project URL from Step 3
   - `VITE_SUPABASE_PUBLISHABLE_KEY` = the `anon` key from Step 3
3. Click **Deploy**. The first build takes 1–3 minutes.
4. When the build finishes, click **Visit** to open your live site.

## Step 5 — Create your clinic login

1. Open your live URL.
2. Click **Sign Up** and create your clinic's account using your work email and a strong password.
3. Log in. You're ready to start building your library and generating reports.

---

## Optional: skip email confirmation

By default, Supabase sends a "confirm your email" link when you sign up. If you want users to log in instantly without that step:

1. In Supabase, go to **Authentication → Providers → Email**.
2. Turn **off** "Confirm email".
3. Save.

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

**The app loads but I can't sign up / log in.**
Re-check that your two environment variables in Vercel exactly match the Project URL and `anon` key from your Supabase project. Redeploy after fixing.

**The SQL setup script shows an error.**
You may have run it twice. The script is safe to re-run on a fresh project — if you've already created tables, delete the Supabase project and start fresh, or contact your seller.

**A shared report link returns 404 / blank.**
Make sure Step 2 completed and `Setup complete` was shown. The shared-reports storage bucket is created at the end of that script.

---

## Support & disclaimer

This software is provided AS IS under the terms of the `LICENSE` file.
It is a documentation tool — not a medical device — and does not
provide medical advice. You and your clinicians remain solely
responsible for all clinical content and patient care decisions.

For support, contact the seller you purchased your license from.