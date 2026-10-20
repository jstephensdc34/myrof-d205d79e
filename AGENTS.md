# Project rules
- Use OverviewReport as the single active report renderer for preview, shared HTML and DOM-based PDF export to keep outputs consistent.
- Compose Dossier and Dashboard headings inside the content sheet through ClinicalReportHeading with embedded scoped CSS so shared HTML and DOM PDF match the preview without a separate cover page.
- Keep description expansion in local React state; self-contained shared HTML uses matching frontend-only event handlers because static markup has no React runtime.
- Compose the roadmap variant inside OverviewReport using shared scoped CSS and a pure section mapper so preview, HTML and DOM PDF remain consistent without schema changes.
- Generate seller archives outside the served app in temporary packaging storage; never copy them to public or expose a download route, so buyer handoff stays separate from the demo.