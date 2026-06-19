## Goal

Let the user customize the default text of the patient email draft (subject, body, and the two CTA button labels) from the Settings page. Values persist per-clinic and get used by the existing Copy / Email actions in `ShareReportActions`.

## Where it lives

Settings page (`ReportSettings.tsx` → `ClinicInfoForm.tsx` area). The Settings card becomes two stacked sections inside the same card:

1. **Clinic Information** (existing — logo + name/address/phone/email/website)
2. **Patient Email Template** (new)

No tabs — keeps the "single page" structure we just landed on.

## Storage

Reuse the existing `report_settings` table (key/value rows) — same pattern as `clinic_name`, `logo_url`, etc. New keys:

- `email_subject_template`
- `email_body_template`
- `email_button_label_full`
- `email_button_label_overview`

No schema migration needed; rows are created on first save via the existing `updateSetting` flow. Defaults are applied in code when a key is empty/missing.

## Tokens

Templates support these placeholders, replaced at compose time:

- `{{patient_name}}`
- `{{clinic_name}}`
- `{{full_report_url}}`
- `{{overview_report_url}}`

Tokens that resolve to an empty string (e.g. no patient name) collapse cleanly — leading/trailing whitespace on that line is trimmed.

## UI (new section in Settings)

```text
Patient Email Template
----------------------
Subject               [ single-line input                    ]
Body                  [ multi-line textarea, ~10 rows         ]
"Full Report" button  [ short input ]
"Overview" button     [ short input ]

Available tokens (click to copy):
  {{patient_name}}  {{clinic_name}}  {{full_report_url}}  {{overview_report_url}}

[ Restore defaults ]                              [ Save template ]
```

- Token chips are clickable — they copy the token to the clipboard so the user can paste it where they want.
- "Restore defaults" repopulates the four fields with the current built-in defaults (does not save until they click Save).
- Save writes all four keys via `updateSetting` in parallel, same pattern as `ClinicInfoForm.handleSave`.
- Disabled / loading / auth-gated states match the existing clinic form.

## Wiring into the email composer

Update `src/utils/composeReportEmail.ts`:

- Add optional template overrides to `ComposeReportEmailParams`:
  ```ts
  templates?: {
    subject?: string;
    body?: string;
    fullButtonLabel?: string;
    overviewButtonLabel?: string;
  }
  ```
- Add a small `applyTokens(str, vars)` helper that swaps `{{token}}` placeholders.
- If a template field is provided and non-empty, use it; otherwise fall back to the current hard-coded default.
- Button labels are injected into both the plain-text body (via tokens like `▶ {{label}}: {{url}}` in the default) and the HTML buttons.
- Subject is still passed through `applyTokens`.

Update `ShareReportActions.tsx` (only place that calls `composeReportEmail`):

- Read the four `email_*` settings from `useReportSettings` (already loaded for the rest of the app) and pass them in as `templates`. No other behavior changes — Copy and Email buttons keep working identically.

## Out of scope

- No server-sent email, no Resend, no edge functions — still pure clipboard + `mailto:` (per existing project memory).
- No rich-text editor — plain textarea per your choice.
- No per-patient overrides — clinic-wide template only.
- No template versioning / history.

## Technical notes

- Files touched:
  - `src/utils/composeReportEmail.ts` — add token support + overrides
  - `src/components/report/settings/ClinicInfoForm.tsx` — append the new section (or split into a sibling `EmailTemplateForm.tsx` rendered below it; will decide while implementing — leaning sibling component for cleanliness)
  - `src/components/report/ShareReportActions.tsx` — pass templates into composer
  - Possibly a small `src/utils/emailTemplateDefaults.ts` to centralize the default strings used by both the composer and the "Restore defaults" button
- No DB migration, no new dependencies.
