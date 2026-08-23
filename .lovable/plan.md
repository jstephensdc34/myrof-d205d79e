# Plan: Port "More Information" button changes to Chiro Patient Education App

## Goal
Apply the same report-link UI update from this project to the `Chiro Patient Education App`: replace raw URL text under "For more information" with a prominent, section-colored "More Information" button that opens the link in a new tab.

## Verified current state
A prior cross-project checkout confirmed the target app contains the four affected files and currently displays the raw URL as italic text:

- `src/components/report/ReportItem.tsx`
- `src/components/report/OverviewReport.tsx`
- `src/utils/generateOverviewReportHtml.ts`
- `src/utils/pdf/reportItemRenderer.ts`

## Limitation
Cross-project checkout is read-only. This workspace cannot write directly into another Lovable project. The changes must be prepared here and then applied in the target app.

## Changes

1. Re-checkout a fresh read-only snapshot of `Chiro Patient Education App`.
2. Read the current versions of the four target files to confirm line numbers and exact existing markup.
3. Generate a unified diff patch (or four complete replacement files) in this project under `public/` so it can be downloaded.
4. Provide concise instructions for opening the target app and applying the patch.
5. Verify the generated patch matches the source changes already working in this project.

## Out of scope
- No changes to the target app's data models, backend, or other UI surfaces.
- No direct push or commit to the target app's repository from this workspace.
