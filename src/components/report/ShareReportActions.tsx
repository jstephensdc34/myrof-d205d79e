import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PatientInfo, ReportItem, Subcategory, ReportSetting } from "@/types";
import { shareReport } from "@/utils/shareReport";
import { composeReportEmail, buildMailtoUrl } from "@/utils/composeReportEmail";

interface ShareReportActionsProps {
  patient: PatientInfo;
  items: ReportItem[];
  selectedItems: string[];
  additionalNotes: string;
  customTreatmentGoals: string;
  estimatedCost: string;
  settings: ReportSetting[];
  subcategories: Subcategory[];
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
  settings,
  subcategories,
  disabled,
}: ShareReportActionsProps) => {
  const [pending, setPending] = useState<PendingAction>(null);

  const buildEmail = async () => {
    const selectedItemsData = items.filter((item) => selectedItems.includes(item.id));
    const getSetting = (n: string, f = "") =>
      settings.find((s) => s.name === n)?.value || f;

    const baseParams = {
      patient,
      selectedItems: selectedItemsData,
      notes: additionalNotes,
      customTreatmentGoals,
      estimatedCost,
      settings,
      subcategories,
    };

    const [fullReportUrl, overviewReportUrl] = await Promise.all([
      shareReport({ ...baseParams, format: "full" }),
      shareReport({ ...baseParams, format: "overview" }),
    ]);

    return composeReportEmail({
      patientName: patient.name,
      clinicName: getSetting("clinic_name", "Your Clinic"),
      fullReportUrl,
      overviewReportUrl,
    });
  };

  const handleCopy = async () => {
    setPending("copy");
    try {
      const { subject, body, html } = await buildEmail();
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

  const handleDraft = async () => {
    setPending("draft");
    try {
      const composed = await buildEmail();
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
    <div className="flex gap-2">
      <Button
        variant="outline"
        className="flex-1 border-medical-600 text-medical-700 hover:bg-medical-50 text-base py-6"
        onClick={handleCopy}
        disabled={isDisabled}
      >
        {pending === "copy" ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Copy className="mr-2 h-4 w-4" />
        )}
        Copy Email to Clipboard
      </Button>
      <Button
        variant="outline"
        className="flex-1 border-medical-600 text-medical-700 hover:bg-medical-50 text-base py-6"
        onClick={handleDraft}
        disabled={isDisabled}
      >
        {pending === "draft" ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Mail className="mr-2 h-4 w-4" />
        )}
        Draft Email
      </Button>
    </div>
  );
};
