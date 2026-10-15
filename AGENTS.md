# Project rules
- Use OverviewReport as the single active report renderer for preview, shared HTML and DOM-based PDF export to keep outputs consistent.
- Keep description expansion in local React state; self-contained shared HTML uses matching frontend-only event handlers because static markup has no React runtime.
- Compose the roadmap variant inside OverviewReport using shared scoped CSS and a pure section mapper so preview, HTML and DOM PDF remain consistent without schema changes.