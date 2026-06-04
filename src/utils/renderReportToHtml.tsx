import { renderToStaticMarkup } from "react-dom/server";
import { PatientInfo, ReportItem } from "@/types";
import { ReportSetting } from "@/services/reportSettingsService";
import { ReportPreview } from "@/components/report/ReportPreview";
import { OverviewReport } from "@/components/report/OverviewReport";

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
}
html, body { margin: 0; padding: 0; background: #f3f4f6; font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; color: hsl(var(--foreground)); }
.printable-report-wrapper { padding: 24px 16px; }
.printable-report-wrapper > div { background: #ffffff; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
@media print {
  body { background: #fff; }
  .printable-report-wrapper { padding: 0; }
  .printable-report-wrapper > div { box-shadow: none; }
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
  settings: ReportSetting[];
  subcategories: any[];
  format: "full" | "overview";
}

export const renderReportToHtml = (params: RenderReportParams): string => {
  const selectedIds = params.selectedItems.map((i) => i.id);
  const shared = {
    patient: params.patient,
    items: params.selectedItems,
    selectedItems: selectedIds,
    customTreatmentGoals: params.customTreatmentGoals,
    estimatedCost: params.estimatedCost,
    subcategories: params.subcategories,
    settings: params.settings,
    printMode: true as const,
  };

  const body =
    params.format === "overview"
      ? renderToStaticMarkup(
          <OverviewReport {...shared} additionalNotes={params.notes} />
        )
      : renderToStaticMarkup(
          <ReportPreview {...shared} additionalNotes={params.notes} />
        );

  const title = `Patient Report - ${params.patient.name || "Patient"}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${title}</title>
<script src="https://cdn.tailwindcss.com"></script>
<script>${TW_CONFIG}</script>
<style>${CSS_VARS}</style>
</head>
<body>
<div class="printable-report-wrapper">${body}</div>
</body>
</html>`;
};
