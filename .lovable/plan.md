## Goal

Replace the three-tab Settings UI with a single, clean Clinic Information page (logo + clinic fields). Drop the raw "View Settings" table and the "Create Setting" key/value form — they aren't useful for end users.

## Changes

1. **`src/components/report/ReportSettings.tsx`** — Rewrite to remove `Tabs`/`TabsList`/`TabsContent` and the `activeTab` state. Render `<ClinicInfoForm>` directly inside the card. Keep the `ConnectionStatus` indicator in the header, the loading/error states, and the auth-aware footer message. Drop imports for `SettingsList`, `CreateSettingForm`, and `Tabs`.

2. **Delete unused files** (no other consumers):
   - `src/components/report/settings/SettingsList.tsx`
   - `src/components/report/settings/CreateSettingForm.tsx`

3. **Verify nothing else imports them** — quick `rg` for `SettingsList` and `CreateSettingForm` before deleting. If anything references them, update or leave the file until a follow-up.

## Out of scope

- No backend / database changes. The `report_settings` table stays as-is; clinic fields continue to be stored as individual `clinic_*` rows via the existing `ClinicInfoForm` save logic.
- No styling redesign of the form itself — just removing the tab wrapper.
- The "Create Setting" capability goes away from the UI. Custom keys can still exist in the DB but won't be user-editable. If you ever need power-user editing again, we'd add it back as a separate admin route.
