# Plan: Copy "More Information" button styling to Chiro Patient Education App

## Goal
Apply the same report-link UI update from this project to the `Chiro Patient Education App` project: replace the raw URL text under "For more information" with a prominent, section-colored "More Information" button that opens the link in a new tab.

## Verified current state
Checked out a read-only snapshot of `Chiro Patient Education App`. All four affected files exist and currently display the raw URL as italic text:

- `src/components/report/ReportItem.tsx` — line 30-34 shows `For more information: {item.infoLink}`
- `src/components/report/OverviewReport.tsx` — line 89-93 shows `For more information: {infoLink}`
- `src/utils/generateOverviewReportHtml.ts` — line 30 renders a plain `<p>` with the URL as link text
- `src/utils/pdf/reportItemRenderer.ts` — line 15 renders a plain `<p class="item-link">` with the URL as link text

## Changes

### 1. In-app Full Report preview (`src/components/report/ReportItem.tsx`)
Replace the italic paragraph that displays the URL with a styled `<a>` button:
- Label: "More Information"
- Inline-flex layout with external-link icon
- Background color from `style.headerBg`
- White text, rounded-md, small shadow, hover opacity change
- Keep `target="_blank"` and `rel="noopener noreferrer"`

### 2. In-app Overview Report preview (`src/components/report/OverviewReport.tsx`)
Apply the same button treatment inside the `OverviewCard` component, using the section `style.headerBg` for the button background.

### 3. Shared HTML reports (`src/utils/generateOverviewReportHtml.ts`)
Update the `renderCard` function so the infoLink renders as an inline-styled `<a>` button matching the in-app look:
- Background = `colors.headerBg`
- White text, 6px border-radius, 6px 12px padding
- External-link SVG icon
- No raw URL text shown

### 4. PDF/full report HTML (`src/utils/pdf/reportItemRenderer.ts`)
Replace the `<p class="item-link">` block with the same styled button markup, using `colors.headerBg` as the background.

### 5. Verification
- Run the target project's TypeScript typecheck/build to confirm no errors.
- Optionally open the target project's preview and confirm a report item with an `infoLink` shows the new button instead of the URL.

## Out of scope
- No changes to the `InfoLink` header link (the small `[info]` marker remains separate).
- No changes to report data models, storage, or backend.
- No changes to other UI surfaces unless they also display raw `infoLink` URLs.
