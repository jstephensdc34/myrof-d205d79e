Update `src/pages/Index.tsx` with three specific content changes:

1. **Tagline** — Update the `<p>` under the headline to:  
   "Comprehensive patient education tool to create patient report and deliver patient education materials."

2. **Center the two cards** — The existing grid uses `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`. Change to a centered 2-column layout so the two cards ("Create New Report", "Manage Library") sit centered rather than left-aligned within a 3-column track.

3. **About section rewrite** —
   - **Paragraph**: Rewrite to describe MyROF Report as a tool for generating three structured patient reports (Diagnosis, Treatment Plan, Home Care) and delivering them as shareable HTML reports or PDF exports.
   - **Four bullets** (replaces the existing four):
     a. **Diagnosis Report** — Structured findings and assessment documentation
     b. **Treatment Plan** — Personalized care plans with goals and modalities
     c. **Home Care Report** — Patient take-home instructions and recommendations
     d. **Shareable HTML + PDF Export** — Deliver reports via link or download as PDF