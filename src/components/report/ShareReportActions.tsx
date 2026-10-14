import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Mail, Loader2, ChevronDown } from "lucide-react";
import { ExportStyleMenu } from "@/components/report/ExportStyleMenu";
import { toast } from "sonner";
import { PatientInfo, ReportItem, Subcategory, ReportSetting } from "@/types";
import { shareReport } from "@/utils/shareReport";
import { composeReportEmail, buildMailtoUrl } from "@/utils/composeReportEmail";
import { EMAIL_TEMPLATE_SETTING_KEYS } from "@/utils/emailTemplateDefaults";
import { ReportStyle, DEFAULT_REPORT_STYLE } from "@/components/report/reportStyleVariants";

interface ShareReportActionsProps {
  patient: PatientInfo;
  items: ReportItem[];
  selectedItems: string[];
  additionalNotes: string;
  customTreatmentGoals: string;
  estimatedCost: string;
  treatmentSchedule?: string;
  settings: ReportSetting[];
  subcategories: Subcategory[];
  reportStyle?: ReportStyle;
  disabled?: boolean;
}

type PendingAction = "copy" | "draft" | null;

export const ShareReportActions = ({
  patient,
  items,
  selectedItems,
  additionalNotes,
  customTreatmentGoals,
  estimatedCost,
  treatmentSchedule,
  settings,
  subcategories,
  reportStyle = DEFAULT_REPORT_STYLE,
  disabled,
}: ShareReportActionsProps) => {
  const [pending, setPending] = useState<PendingAction>(null);

  const buildEmail = async (chosenStyle: ReportStyle) => {
    const selectedItemsData = items.filter((item) => selectedItems.includes(item.id));
    const getSetting = (n: string, f = "") =>
      settings.find((s) => s.name === n)?.value || f;

    const baseParams = {
      patient,
      selectedItems: selectedItemsData,
      notes: additionalNotes,
      customTreatmentGoals,
      estimatedCost,
      treatmentSchedule,
      settings,
      subcategories,
      reportStyle: chosenStyle,
    };

    const overviewReportUrl = await shareReport({ ...baseParams, format: "overview" });

    return composeReportEmail({
      patientName: patient.name,
      clinicName: getSetting("clinic_name", "Your Clinic"),
      overviewReportUrl,
      templates: {
        subject: getSetting(EMAIL_TEMPLATE_SETTING_KEYS.subject),
        body: getSetting(EMAIL_TEMPLATE_SETTING_KEYS.body),
        overviewButtonLabel: getSetting(EMAIL_TEMPLATE_SETTING_KEYS.overviewButton),
      },
    });
  };

  const handleCopy = async (style: ReportStyle) => {
    setPending("copy");
    try {
      const { subject, body, html } = await buildEmail(style);
      const text = `Subject: ${subject}\n\n${body}`;
      const richHtml = `<p><strong>Subject:</strong> ${subject}</p>${html}`;

      try {
        if (typeof ClipboardItem !== "undefined" && navigator.clipboard?.write) {
          await navigator.clipboard.write([
            new ClipboardItem({
              "text/html": new Blob([richHtml], { type: "text/html" }),
              "text/plain": new Blob([text], { type: "text/plain" }),
            }),
          ]);
        } else {
          await navigator.clipboard.writeText(text);
        }
        toast.success("Email copied to clipboard");
      } catch {
        await navigator.clipboard.writeText(text);
        toast.success("Email copied to clipboard");
      }
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to copy email");
    } finally {
      setPending(null);
    }
  };

  const handleDraft = async (style: ReportStyle) => {
    setPending("draft");
    try {
      const composed = await buildEmail(style);
      window.location.href = buildMailtoUrl(composed);
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to open email draft");
    } finally {
      setPending(null);
    }
  };

  const isDisabled = disabled || pending !== null;

  return (
    <div className="flex flex-col gap-2">
      <ExportStyleMenu
        currentStyle={reportStyle}
        onSelect={handleCopy}
        disabled={isDisabled}
        trigger={
          <Button
            variant="outline"
            className="w-full border-medical-600 text-medical-700 hover:bg-medical-50 text-base py-6"
            disabled={isDisabled}
          >
            {pending === "copy" ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Copy className="mr-2 h-4 w-4" />
            )}
            Copy Email to Clipboard
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        }
      />
      <ExportStyleMenu
        currentStyle={reportStyle}
        onSelect={handleDraft}
        disabled={isDisabled}
        trigger={
          <Button
            variant="outline"
            className="w-full border-medical-600 text-medical-700 hover:bg-medical-50 text-base py-6"
            disabled={isDisabled}
          >
            {pending === "draft" ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Mail className="mr-2 h-4 w-4" />
            )}
            Draft Email
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        }
      />
    </div>
  );
};
