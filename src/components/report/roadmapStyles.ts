// Shared by the live document and static HTML so container-responsive layouts match.
export const ROADMAP_CSS = `
.roadmap-document { container-type: inline-size; background: hsl(var(--roadmap-paper)); color: hsl(var(--roadmap-ink)); border-radius: 2rem; overflow: hidden; border: 1px solid hsl(var(--roadmap-border)); }
.roadmap-header { background: linear-gradient(to right, hsl(var(--roadmap-deep)), hsl(var(--roadmap-teal))); color: hsl(var(--roadmap-paper)); padding: 2rem; position: relative; overflow: hidden; }
.roadmap-header-layout { position: relative; display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 1.5rem; }
.roadmap-prepared { background: hsl(var(--roadmap-paper) / .1); border: 1px solid hsl(var(--roadmap-paper) / .2); border-radius: 1rem; padding: 1rem; max-width: 100%; }
.roadmap-eyebrow { background: hsl(var(--roadmap-paper) / .2); color: hsl(var(--roadmap-paper)); border-radius: 999px; display: inline-block; padding: .25rem .75rem; font-size: .625rem; font-weight: 800; text-transform: uppercase; margin-bottom: .75rem; }
.roadmap-body { padding: 1.5rem; }
.roadmap-section { --roadmap-section: var(--roadmap-deep); --roadmap-section-border: var(--roadmap-border); --roadmap-section-bg: var(--roadmap-paper); }
.roadmap-plan { --roadmap-section: var(--roadmap-teal); --roadmap-section-border: var(--roadmap-plan-border); --roadmap-section-bg: var(--roadmap-plan-bg); }
.roadmap-clinic { --roadmap-section: var(--roadmap-blue); }
.roadmap-home { --roadmap-section: var(--roadmap-coral); --roadmap-section-border: var(--roadmap-home-border); --roadmap-section-bg: var(--roadmap-home-bg); }
.roadmap-number { background: hsl(var(--roadmap-section)); color: hsl(var(--roadmap-paper)); width: 2.5rem; height: 2.5rem; border-radius: .75rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 1.125rem; font-weight: 900; }
.roadmap-grid, .roadmap-split { display: grid; grid-template-columns: minmax(0,1fr); gap: 1.5rem; }
.roadmap-card { background: hsl(var(--roadmap-section-bg)); border: 2px solid hsl(var(--roadmap-section-border)); border-radius: 1rem; padding: 1.5rem; display: flex; flex-direction: column; min-width: 0; break-inside: avoid; page-break-inside: avoid; }
.roadmap-card-top { display: flex; flex-wrap: wrap; align-items: flex-start; justify-content: space-between; gap: .75rem; margin-bottom: .75rem; }
.roadmap-card h3 { font-size: 1.125rem; line-height: 1.4; font-weight: 800; overflow-wrap: anywhere; flex: 1 1 120px; }
.roadmap-badge { background: hsl(var(--roadmap-section) / .1); color: hsl(var(--roadmap-section)); font-size: .625rem; line-height: 1.4; font-weight: 800; padding: .25rem .5rem; border-radius: .25rem; text-transform: uppercase; max-width: 100%; overflow-wrap: anywhere; }
.roadmap-card [data-report-item] > p { color: hsl(var(--roadmap-section)); font-weight: 700; line-height: 1.5; padding-bottom: 1rem; margin-bottom: .5rem; border-bottom: 1px solid hsl(var(--roadmap-section-border)); }
.roadmap-card [data-description], .roadmap-card [data-description-toggle] { color: hsl(var(--roadmap-body)); }
.roadmap-card [data-description] { line-height: 1.7; }
.roadmap-demo { background: hsl(var(--roadmap-section) / .1); color: hsl(var(--roadmap-section)); border-radius: .75rem; margin-top: 1rem; width: 100%; font-weight: 700; white-space: normal; height: auto; min-height: 2.5rem; }
.roadmap-demo:hover { background: hsl(var(--roadmap-section)); color: hsl(var(--roadmap-paper)); }
.roadmap-divider { display: flex; align-items: center; gap: 1rem; margin: 2.5rem 0; color: hsl(var(--roadmap-border)); }
.roadmap-divider::before, .roadmap-divider::after { content: ''; height: 1px; background: hsl(var(--roadmap-border)); flex: 1; }
.roadmap-footer { background: hsl(var(--roadmap-footer)); color: hsl(var(--roadmap-body)); border-top: 1px solid hsl(var(--roadmap-border)); padding: 1.5rem; text-align: center; font-size: .75rem; }
@container (min-width: 540px) { .roadmap-problem-grid, .roadmap-split { grid-template-columns: repeat(2,minmax(0,1fr)); } }
@container (min-width: 700px) { .roadmap-plan-grid { grid-template-columns: repeat(3,minmax(0,1fr)); } .roadmap-body, .roadmap-header { padding: 2.5rem; } }
@media print { .roadmap-document { border: none; border-radius: 0; } .roadmap-card { break-inside: avoid; } }
`;