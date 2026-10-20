import { Calendar, User } from "lucide-react";
import type { PatientInfo } from "@/types";
import type { ReportSetting } from "@/services/reportSettingsService";
import type { ReportStyle } from "./reportStyleVariants";

const HEADING_CSS = `
.clinical-heading { container-type: inline-size; margin-bottom: 32px; break-inside: avoid; page-break-inside: avoid; }
.clinical-heading-layout { display: grid; grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr); gap: 24px; align-items: start; }
.clinical-heading-clinic { min-width: 0; text-align: right; }
.clinical-heading-logo { display: block; height: 56px; max-width: 100%; object-fit: contain; margin: 0 0 12px auto; }
.clinical-heading-dossier { border-top: 4px solid hsl(var(--report-primary)); border-bottom: 1px solid hsl(var(--report-primary) / .2); padding: 24px 0; }
.clinical-heading-dossier h1 { color: hsl(var(--report-primary)); }
.clinical-heading-dossier .clinical-heading-eyebrow { color: hsl(var(--report-accent)); }
.clinical-heading-dashboard { border-bottom: 4px solid hsl(var(--diagnosis)); background: hsl(var(--diagnosis-soft)); padding: 24px; }
.clinical-heading-dashboard h1, .clinical-heading-dashboard .clinical-heading-eyebrow { color: hsl(var(--diagnosis)); }
.clinical-heading-contact { margin-top: 20px; padding-top: 12px; border-top: 1px solid hsl(var(--border)); overflow-wrap: anywhere; }
@container (max-width: 480px) {
  .clinical-heading-layout { grid-template-columns: minmax(0, 1fr); gap: 20px; }
  .clinical-heading-clinic { text-align: left; }
  .clinical-heading-logo { margin-left: 0; }
}
`;

export const ClinicalReportHeading = ({ patient, settings, reportStyle }: {
  patient: PatientInfo;
  settings: ReportSetting[];
  reportStyle: ReportStyle;
}) => {
  const getSetting = (name: string, fallback = "") => settings.find(setting => setting.name === name)?.value || fallback;
  const clinicName = getSetting("clinic_name", "Your Clinic Name");
  const logo = getSetting("logo_url");
  const contact = [getSetting("clinic_phone"), getSetting("clinic_email"), getSetting("clinic_website")].filter(Boolean);
  return <>
    <style dangerouslySetInnerHTML={{ __html: HEADING_CSS }} />
    <header className={`clinical-heading clinical-heading-${reportStyle}`}>
      <div className="clinical-heading-layout">
        <div className="min-w-0">
          <p className="clinical-heading-eyebrow mb-2 text-xs font-semibold uppercase">Your Personalized Care Plan</p>
          <h1 className="mb-4 text-3xl font-bold break-words">Clinical Report</h1>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-foreground">
            <span className="flex min-w-0 items-start gap-1.5"><User className="h-4 w-4 shrink-0 mt-0.5" /><span className="break-words">Patient ID: {patient.name}</span></span>
            <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 shrink-0" />Date: {new Date(patient.date).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="clinical-heading-clinic">
          {logo && <img src={logo} alt={`${clinicName} Logo`} className="clinical-heading-logo" />}
          <p className="mb-1 text-xs font-semibold uppercase text-muted-foreground">Prepared By</p>
          <p className="text-lg font-bold text-foreground break-words">{clinicName}</p>
          {getSetting("clinic_address") && <p className="mt-1 text-sm text-muted-foreground break-words">{getSetting("clinic_address")}</p>}
        </div>
      </div>
      {contact.length > 0 && <p className="clinical-heading-contact text-xs text-muted-foreground">{contact.join(" · ")}</p>}
    </header>
  </>;
};