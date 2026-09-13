export type ReportStyle = "dossier" | "dashboard" | "classic";

export const DEFAULT_REPORT_STYLE: ReportStyle = "classic";

export const REPORT_STYLE_SETTING_NAME = "default_report_style";

export const REPORT_STYLE_OPTIONS: { value: ReportStyle; label: string }[] = [
  { value: "dossier", label: "Modern Clinical Dossier" },
  { value: "dashboard", label: "Modular Dashboard" },
  { value: "classic", label: "Classic Clinical" },
];

export const DOSSIER_PRIMARY = "hsl(var(--report-primary))";
export const DOSSIER_ACCENT = "hsl(var(--report-accent))";
export const DOSSIER_PRIMARY_SOFT = "hsl(var(--report-primary) / 0.2)";
export const DOSSIER_ACCENT_SOFT = "hsl(var(--report-accent) / 0.2)";

export const isReportStyle = (value: string | undefined): value is ReportStyle =>
  value === "dossier" || value === "dashboard" || value === "classic";
