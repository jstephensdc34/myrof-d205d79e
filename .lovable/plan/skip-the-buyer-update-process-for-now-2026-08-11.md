# Skip the buyer update process for now

## Decision
The user will not document a formal update workflow yet. When a real update is ready, they will write and send instructions to buyers at that time. This avoids committing to an update path (re-deploy, sync, or Git commands) before testing it.

## Changes
1. Remove the "Updating your app to the latest version" section from `BUYER_SETUP.md` so buyers are not given instructions that don't match the actual Vercel/GitHub behavior.
2. Remove the "Releasing updates to existing buyers" subsection from `SELLER_CHECKLIST.md` and its email template.
3. Regenerate the Welcome Kit ZIP with `npm run handoff` so the distributed guide matches.

## Out of scope
- No new update instructions.
- No application code or database changes.
