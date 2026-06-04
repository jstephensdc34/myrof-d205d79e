import { supabase } from "@/integrations/supabase/client";
import { PatientInfo, ReportItem } from "@/types";
import { ReportSetting } from "@/services/reportSettingsService";
import { renderReportToHtml } from "./renderReportToHtml";

export type ShareReportFormat = "full" | "overview";

interface ShareReportParams {
  patient: PatientInfo;
  selectedItems: ReportItem[];
  notes: string;
  customTreatmentGoals?: string;
  estimatedCost?: string;
  settings: ReportSetting[];
  subcategories: any[];
  format?: ShareReportFormat;
}

export const shareReport = async (params: ShareReportParams): Promise<string> => {
  const format: ShareReportFormat = params.format ?? "full";
  const html = renderReportToHtml({ ...params, format });

  const timestamp = Date.now();
  const safeName = params.patient.name.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
  const fileName = `report-${format}-${safeName}-${timestamp}.html`;

  const { error } = await supabase.storage
    .from("shared-reports")
    .upload(fileName, new Blob([html], { type: "text/html" }), {
      contentType: "text/html",
      cacheControl: "3600",
    });

  if (error) {
    throw new Error(`Failed to upload report: ${error.message}`);
  }

  const basePath = import.meta.env.BASE_URL || "/";
  const shareUrl = new URL(`${basePath.replace(/\/$/, "")}/shared-report`, window.location.origin);
  shareUrl.searchParams.set("file", fileName);

  return shareUrl.toString();
};
