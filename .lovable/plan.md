## Plan: Use verified Resend domain for report emails

Update the `send-report-email` edge function to send from your verified domain `info.chiropracticspecialistsmn.com` instead of Resend's shared sandbox sender. This unblocks sending to any recipient (not just your own Resend account email).

### Changes

1. **`supabase/functions/send-report-email/index.ts`**
   - Replace `onboarding@resend.dev` with `reports@info.chiropracticspecialistsmn.com`.
   - Keep the `From` display name as the clinic name from settings (e.g. `Chiropractic Specialists MN <reports@info.chiropracticspecialistsmn.com>`).
   - Keep `reply_to` pointing at the clinic email from settings so patient replies go to the clinic, not the sender mailbox.

2. **Deploy** the updated edge function.

3. **Verify** by sending a test report email to a non-Resend-account address.

### White-label note

Hardcoding the sender domain ties every cloned clinic to *your* Resend domain. If you plan to clone this app per clinic via Vercel/GitHub, a cleaner pattern is to read the from-address from an env var (e.g. `REPORT_FROM_ADDRESS`) or from a clinic setting, so each clone uses its own verified domain.

**Question:** Do you want me to:
- **(A)** Hardcode `reports@info.chiropracticspecialistsmn.com` now (simplest, works immediately for your clinic), or
- **(B)** Make it configurable via a `REPORT_FROM_ADDRESS` secret, defaulting to your domain (white-label friendly)?
