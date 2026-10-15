import { renderToStaticMarkup } from "react-dom/server";
import { PatientInfo, ReportItem } from "@/types";
import { ReportSetting } from "@/services/reportSettingsService";
import { OverviewReport } from "@/components/report/OverviewReport";
import { ReportStyle, DEFAULT_REPORT_STYLE } from "@/components/report/reportStyleVariants";

const CSS_VARS = `
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;
  --radius: 0.5rem;
  --success: 160 84% 30%;
  --success-foreground: 0 0% 100%;
  --success-soft: 152 81% 96%;
  --warning: 32 95% 35%;
  --warning-foreground: 0 0% 100%;
  --warning-soft: 48 96% 96%;
  --diagnosis: 221 83% 53%;
  --diagnosis-soft: 214 100% 97%;
  --diagnosis-border: 213 97% 87%;
  --extremity: 239 84% 67%;
  --extremity-soft: 226 100% 97%;
  --extremity-border: 228 96% 89%;
  --treatment: 160 84% 30%;
  --treatment-soft: 152 81% 96%;
  --treatment-border: 152 69% 81%;
  --homecare: 347 77% 50%;
  --homecare-soft: 356 100% 97%;
  --homecare-border: 353 96% 90%;
  --exercise: 271 81% 56%;
  --exercise-soft: 270 100% 98%;
  --exercise-border: 269 100% 92%;
  --report-primary: 205 100% 27%;
  --report-accent: 211 92% 44%;
  --roadmap-deep: 188 56% 23%;
  --roadmap-teal: 176 56% 55%;
  --roadmap-coral: 0 100% 71%;
  --roadmap-blue: 217 91% 60%;
  --roadmap-paper: 0 0% 100%;
  --roadmap-ink: 221 39% 11%;
  --roadmap-body: 215 14% 34%;
  --roadmap-border: 220 14% 96%;
  --roadmap-plan-border: 167 85% 89%;
  --roadmap-plan-bg: 166 76% 99%;
  --roadmap-home-border: 34 100% 92%;
  --roadmap-home-bg: 33 100% 99%;
  --roadmap-gold: 40 92% 32%;
  --roadmap-goal-border: 42 96% 82%;
  --roadmap-goal-bg: 48 100% 96%;
  --roadmap-footer: 210 33% 98%;
}
html, body { margin: 0; padding: 0; background: #f3f4f6; font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; color: hsl(var(--foreground)); }
.printable-report-wrapper { padding: 24px 16px; }
.printable-report-wrapper > div { background: #ffffff; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
[hidden] { display: none !important; }
[data-description] { line-height: 1.6; }
[data-description] p { margin: 0 0 0.75em; }
[data-description] ul, [data-description] ol { padding-left: 1.5em; margin: 0.75em 0; }
[data-description] ul { list-style: disc; }
[data-description] ol { list-style: decimal; }
[data-description] li { margin: 0.4em 0; }
@media print {
  body { background: #fff; }
  .printable-report-wrapper { padding: 0; }
  .printable-report-wrapper > div { box-shadow: none; }
  [data-report-controls], [data-description-toggle] { display: none !important; }
}
`;

const TW_CONFIG = `
tailwind.config = {
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
        success: { DEFAULT: 'hsl(var(--success))', foreground: 'hsl(var(--success-foreground))', soft: 'hsl(var(--success-soft))' },
        warning: { DEFAULT: 'hsl(var(--warning))', foreground: 'hsl(var(--warning-foreground))', soft: 'hsl(var(--warning-soft))' },
        diagnosis: { DEFAULT: 'hsl(var(--diagnosis))', soft: 'hsl(var(--diagnosis-soft))', border: 'hsl(var(--diagnosis-border))' },
        extremity: { DEFAULT: 'hsl(var(--extremity))', soft: 'hsl(var(--extremity-soft))', border: 'hsl(var(--extremity-border))' },
        treatment: { DEFAULT: 'hsl(var(--treatment))', soft: 'hsl(var(--treatment-soft))', border: 'hsl(var(--treatment-border))' },
        homecare: { DEFAULT: 'hsl(var(--homecare))', soft: 'hsl(var(--homecare-soft))', border: 'hsl(var(--homecare-border))' },
        exercise: { DEFAULT: 'hsl(var(--exercise))', soft: 'hsl(var(--exercise-soft))', border: 'hsl(var(--exercise-border))' },
        report: { primary: 'hsl(var(--report-primary))', accent: 'hsl(var(--report-accent))' },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      }
    }
  }
}
`;

export interface RenderReportParams {
  patient: PatientInfo;
  selectedItems: ReportItem[];
  notes: string;
  customTreatmentGoals?: string;
  estimatedCost?: string;
  treatmentSchedule?: string;
  settings: ReportSetting[];
  subcategories: any[];
  reportStyle?: ReportStyle;
  format: "overview";
}

export const renderReportToHtml = (params: RenderReportParams): string => {
  const selectedIds = params.selectedItems.map((i) => i.id);
  const shared = {
    patient: params.patient,
    items: params.selectedItems,
    selectedItems: selectedIds,
    customTreatmentGoals: params.customTreatmentGoals,
    estimatedCost: params.estimatedCost,
    treatmentSchedule: params.treatmentSchedule,
    subcategories: params.subcategories,
    settings: params.settings,
    reportStyle: params.reportStyle ?? DEFAULT_REPORT_STYLE,
    printMode: true as const,
  };

  const body = renderToStaticMarkup(
    <OverviewReport {...shared} additionalNotes={params.notes} />
  );

  const title = `Patient Report - ${params.patient.name || "Patient"}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${title.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</title>
<script src="https://cdn.tailwindcss.com"></script>
<script>${TW_CONFIG}</script>
<style>${CSS_VARS}</style>
</head>
<body>
<div class="printable-report-wrapper">${body}</div>
<script>
(() => {
  const setExpanded = (button, expanded) => {
    const content = document.getElementById(button.getAttribute('aria-controls'));
    if (!content) return;
    content.hidden = !expanded;
    button.setAttribute('aria-expanded', String(expanded));
    button.querySelector('[data-disclosure-label]').textContent = expanded ? 'Show Less' : 'Read More';
    button.querySelector('[data-chevron-down]').classList.toggle('hidden', expanded);
    button.querySelector('[data-chevron-up]').classList.toggle('hidden', !expanded);
  };
  const updateAll = () => {
    const buttons = [...document.querySelectorAll('[data-description-toggle]')];
    const allExpanded = buttons.length > 0 && buttons.every(button => button.getAttribute('aria-expanded') === 'true');
    document.querySelectorAll('[data-expand-all]').forEach(button => {
      button.setAttribute('aria-expanded', String(allExpanded));
      button.querySelector('[data-expand-label]').textContent = allExpanded ? 'Collapse All' : 'Expand All';
      button.querySelector('[data-expand-down]').classList.toggle('hidden', allExpanded);
      button.querySelector('[data-expand-up]').classList.toggle('hidden', !allExpanded);
    });
  };
  document.addEventListener('click', event => {
    if (!(event.target instanceof Element)) return;
    const itemButton = event.target.closest('[data-description-toggle]');
    const allButton = event.target.closest('[data-expand-all]');
    if (itemButton) setExpanded(itemButton, itemButton.getAttribute('aria-expanded') !== 'true');
    if (allButton) document.querySelectorAll('[data-description-toggle]').forEach(button => setExpanded(button, allButton.getAttribute('aria-expanded') !== 'true'));
    updateAll();
  });
})();
</script>
</body>
</html>`;
};
