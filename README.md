# MyROF Report

A clinical report generation and patient education library for
chiropractic and physical therapy clinics. Generate professional
diagnosis, treatment plan, and home care documents; manage a custom
library of conditions, treatments, and exercises; export PDFs and
share read-only patient links.

## For buyers

If you have purchased a license, follow **[BUYER_SETUP.md](./BUYER_SETUP.md)**
to deploy your private instance in about 15 minutes — no coding required.

## License

Single-clinic commercial license. See **[LICENSE](./LICENSE)**. Resale,
redistribution, and sharing with other clinics is prohibited.

## Tech stack

Vite • React • TypeScript • Tailwind CSS • shadcn/ui • Supabase
(database, auth, storage). No edge functions, no server required.

## What's not included (by design)

- ❌ OAuth providers (Google, Apple, etc.) — email + password only
- ❌ Transactional email service (Resend, SendGrid) — uses mailto drafts
- ❌ AI API keys — no LLM calls anywhere in the app
- ❌ Production SMTP — buyers can plug their own SMTP into Supabase later

This keeps deployment to two env vars and zero recurring third-party costs.

---

Built with [Lovable](https://lovable.dev).
