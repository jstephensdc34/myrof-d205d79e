## Diagnosis

The "invalid path specified in request URL" error comes from Supabase Auth rejecting the redirect target. Two issues in your URL Configuration screenshot are causing it:

1. **Site URL is still `http://localhost:3000`** — Supabase uses this as the default redirect when no matching redirect URL is found, and as the base for email links. It must be your Vercel production URL.
2. **Redirect URL is too narrow** — only `https://therapy-trail-maker.vercel.app/` is whitelisted. Any deep path (like `/auth`, `/report`, or an email confirmation link with query params) won't match exactly, so Supabase rejects it as "invalid path."

The app also never tells Supabase where to redirect after signup confirmation, so it falls back to the (wrong) Site URL.

## Fix Plan

### 1. Update Supabase URL Configuration (you do this in the Supabase dashboard)

- **Site URL**: change `http://localhost:3000` → `https://therapy-trail-maker.vercel.app`
- **Redirect URLs**: replace the single entry with these three:
  - `https://therapy-trail-maker.vercel.app/**`  (covers all paths on prod)
  - `https://*-therapy-trail-maker.vercel.app/**`  (covers Vercel preview deployments)
  - `http://localhost:3000/**`  (covers local dev)

Click **Save changes** on Site URL and **Add URL** for each redirect entry.

### 2. Code change: pass `emailRedirectTo` on signup

Update `src/components/auth/AuthForm.tsx` so the signup call tells Supabase exactly where to send users after email confirmation:

```ts
await supabase.auth.signUp({
  email,
  password,
  options: {
    emailRedirectTo: `${window.location.origin}/report`,
  },
});
```

This makes the confirmation link land back on the same origin the user signed up from (prod, preview, or localhost) instead of relying on the Site URL fallback.

### 3. Verify

After saving Supabase config and redeploying:
- Visit `https://therapy-trail-maker.vercel.app/auth`
- Try signup and login — both should complete without the "invalid path" error.

## Why this fixes it

Supabase validates every redirect (including the implicit one used during auth page loads and email links) against Site URL + Redirect URL allow-list. A bare `https://therapy-trail-maker.vercel.app/` only matches that exact URL — not `/auth` or any callback with query params. The `/**` wildcard suffix permits all subpaths, and updating Site URL ensures the default fallback is a real, allowed URL.

## Note on Vercel SPA routing

You're already reaching `/auth` (the error comes from Supabase, not a 404), so SPA rewrites are working. No `vercel.json` is needed right now — but if you later see Vercel 404s on refresh of deep links, add one with a catch-all rewrite to `/index.html`.
