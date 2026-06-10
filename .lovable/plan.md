
# Auth: Email/Password Only — Confirmed

## Current state (verified)

I scanned the codebase for any social-OAuth code (Google, Apple, Facebook, GitHub, Discord, generic `signInWithOAuth`, `provider:` options). **None exists.**

- `src/components/auth/AuthForm.tsx` uses only `supabase.auth.signInWithPassword()` and `signUp()`.
- No `signInWithOAuth` calls anywhere.
- No social provider buttons in the UI.
- The only "apple" reference is in a CSS font-family stack (`-apple-system`) — that's a system font fallback, unrelated to Apple sign-in.

The app already meets your requirement. No code changes needed today.

## Rule going forward (will be enforced in all future work)

I will:
- Never add Google, Apple, Facebook, GitHub, Discord, magic-link, or any social/OAuth provider UI or code.
- Never call `supabase.auth.signInWithOAuth()` or `signInWithOtp()`.
- Keep `AuthForm.tsx` strictly email + password.
- Add this to project memory so future sessions don't reintroduce it.

## What buyers need to do in their own Supabase project

Just one thing in their Supabase dashboard, and only if they want — defaults already work:

- **Authentication → Providers → Email** is enabled by default in every new Supabase project. Nothing to configure.
- **Optional:** turn off "Confirm email" if they want users to log in immediately after signup without clicking a verification link. (Otherwise Supabase sends a default verification email automatically — no domain, no API key, no setup required from the buyer.)

This will be documented in the `BUYER_SETUP.md` as one optional line, not a required step.

## What I'd like to confirm before moving on

You're choosing to use **Supabase's default auth emails** (signup confirmation, password reset). These are sent from a generic `noreply@mail.app.supabase.io` address and work with zero buyer setup. Custom-branded auth emails would require each buyer to configure their own email domain — exactly the kind of friction we're avoiding.

Confirm: stick with Supabase default auth emails (recommended for the BYOK model) → I'll save the rule to memory and we're done with this topic.

Or, if you want to revisit: the only path to branded auth emails per buyer is them setting up an email-sending service themselves (Resend, SendGrid, etc.) and pasting an SMTP config into their Supabase dashboard. That's optional and doesn't touch our codebase.
