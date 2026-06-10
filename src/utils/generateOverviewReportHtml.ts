import { PatientInfo, ReportItem } from "@/types";
import { ReportSetting } from "@/services/reportSettingsService";

interface GenerateOverviewHtmlParams {
  patient: PatientInfo;
  selectedItems: ReportItem[];
  notes: string;
  customTreatmentGoals?: string;
  estimatedCost?: string;
  settings: ReportSetting[];
  subcategories: any[];
}

const sectionColors: Record<string, { bg: string; headerBg: string; border: string }> = {
  diagnosis: { bg: "#eff6ff", headerBg: "#2563eb", border: "#bfdbfe" },
  extremity: { bg: "#eef2ff", headerBg: "#4f46e5", border: "#c7d2fe" },
  treatment: { bg: "#ecfdf5", headerBg: "#059669", border: "#a7f3d0" },
  carePlan: { bg: "#fffbeb", headerBg: "#d97706", border: "#fde68a" },
  homecare: { bg: "#fff1f2", headerBg: "#e11d48", border: "#fecdd3" },
  exercises: { bg: "#faf5ff", headerBg: "#9333ea", border: "#e9d5ff" },
};

const renderCard = (name: string, definition: string | undefined, infoLink: string | undefined, colors: typeof sectionColors.diagnosis) => `
  <div style="border-radius:8px;border:1px solid ${colors.border};background:${colors.bg};overflow:hidden;box-shadow:0 1px 2px rgba(0,0,0,0.05);">
    <div style="padding:8px 16px;background:${colors.headerBg};">
      <h4 style="margin:0;font-size:14px;font-weight:600;color:#fff;">${name}</h4>
    </div>
    <div style="padding:12px 16px;">
      <p style="margin:0 0 ${infoLink ? "8px" : "0"} 0;font-size:13px;color:#374151;">${definition || "No definition provided."}</p>
      ${infoLink ? `<p style="margin:0;font-size:11px;color:#6b7280;font-style:italic;">For more information: <a href="${infoLink}" target="_blank" rel="noopener" style="color:#2563eb;text-decoration:underline;">${infoLink}</a></p>` : ""}
    </div>
  </div>
`;

const renderSectionHeader = (label: string, headerBg: string) => `
  <div style="border-radius:8px;padding:10px 16px;background:${headerBg};margin-bottom:12px;">
    <h3 style="margin:0;font-size:16px;font-weight:700;color:#fff;">${label}</h3>
  </div>
`;

export const generateOverviewReportHtml = (params: GenerateOverviewHtmlParams): string => {
  const { patient, selectedItems, notes, customTreatmentGoals, estimatedCost, settings, subcategories } = params;

  const clinicName = settings.find(s => s.name === "clinic_name")?.value || "Your Clinic";
  const clinicAddress = settings.find(s => s.name === "clinic_address")?.value || "";
  const clinicPhone = settings.find(s => s.name === "clinic_phone")?.value || "";
  const clinicEmail = settings.find(s => s.name === "clinic_email")?.value || "";
  const clinicWebsite = settings.find(s => s.name === "clinic_website")?.value || "";
  const logoUrl = settings.find(s => s.name === "logo_url")?.value || "";

  const byCategory = (catId: string, subId?: string) =>
    selectedItems.filter(i => i.categoryId === catId && (!subId || i.subcategoryId === subId));

  const diagnosisItems = byCategory("diagnosis");
  const extremityItems = byCategory("extremity");
  const treatmentModalityItems = byCategory("treatment", "treatment_modalities");
  const carePlanItems = byCategory("treatment", "care_plan_type");
  const phaseOfCareItems = byCategory("treatment", "phase_of_care");
  const treatmentGoalItems = byCategory("treatment", "treatment_goals");
  const homecareItems = byCategory("homecare");
  const exerciseItems = byCategory("exercises");

  const renderGrid = (items: ReportItem[], colors: typeof sectionColors.diagnosis) =>
    `<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
      ${items.map(item => renderCard(item.name, item.definition, item.infoLink, colors)).join("")}
    </div>`;

  let sections = "";

  if (diagnosisItems.length > 0) {
    sections += `<div style="margin-bottom:24px;">
      ${renderSectionHeader("Diagnosis", sectionColors.diagnosis.headerBg)}
      ${renderGrid(diagnosisItems, sectionColors.diagnosis)}
    </div>`;
  }

  if (extremityItems.length > 0) {
    sections += `<div style="margin-bottom:24px;">
      ${renderSectionHeader("Extremity Diagnosis", sectionColors.extremity.headerBg)}
      ${renderGrid(extremityItems, sectionColors.extremity)}
    </div>`;
  }

  if (treatmentModalityItems.length > 0) {
    sections += `<div style="margin-bottom:24px;">
      ${renderSectionHeader("Treatment Modalities", sectionColors.treatment.headerBg)}
      ${renderGrid(treatmentModalityItems, sectionColors.treatment)}
    </div>`;
  }

  if (carePlanItems.length > 0 || phaseOfCareItems.length > 0 || treatmentGoalItems.length > 0 || customTreatmentGoals || estimatedCost) {
    const carePlanCards = [...carePlanItems, ...phaseOfCareItems].map(item => renderCard(item.name, item.definition, item.infoLink, sectionColors.carePlan)).join("");

    let goalsCard = "";
    if (treatmentGoalItems.length > 0 || customTreatmentGoals) {
      const bullets = [
        ...treatmentGoalItems.map(i => `<li style="margin-bottom:4px;">${i.name}</li>`),
        ...(customTreatmentGoals ? [`<li style="margin-bottom:4px;"><strong>${customTreatmentGoals}</strong></li>`] : []),
      ].join("");

      goalsCard = `
        <div style="border-radius:8px;border:1px solid ${sectionColors.carePlan.border};background:${sectionColors.carePlan.bg};overflow:hidden;box-shadow:0 1px 2px rgba(0,0,0,0.05);">
          <div style="padding:8px 16px;background:${sectionColors.carePlan.headerBg};">
            <h4 style="margin:0;font-size:14px;font-weight:600;color:#fff;">Treatment Goals</h4>
          </div>
          <div style="padding:12px 16px;">
            <ul style="margin:0;padding-left:20px;font-size:13px;color:#374151;">${bullets}</ul>
          </div>
        </div>`;
    }

    const costCard = estimatedCost ? `
      <div style="grid-column:1 / -1;border-radius:8px;border:1px solid ${sectionColors.carePlan.border};background:${sectionColors.carePlan.bg};overflow:hidden;box-shadow:0 1px 2px rgba(0,0,0,0.05);">
        <div style="padding:8px 16px;background:${sectionColors.carePlan.headerBg};">
          <h4 style="margin:0;font-size:14px;font-weight:600;color:#fff;">Estimated Cost</h4>
        </div>
        <div style="padding:16px;text-align:center;">
          <p style="margin:0;font-size:24px;font-weight:700;color:#b45309;">${estimatedCost}</p>
          <p style="margin:8px 0 0 0;font-size:11px;font-style:italic;color:#6b7280;">
            Note: This is an estimate based on the recommended clinical care plan. Please refer to your official financial breakdown for detailed billing, insurance, and payment information.
          </p>
        </div>
      </div>` : "";

    sections += `<div style="margin-bottom:24px;">
      ${renderSectionHeader("Care Plan", sectionColors.carePlan.headerBg)}
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        ${carePlanCards}${goalsCard}${costCard}
      </div>
    </div>`;
  }

  if (homecareItems.length > 0) {
    sections += `<div style="margin-bottom:24px;">
      ${renderSectionHeader("Home Care Recommendations", sectionColors.homecare.headerBg)}
      ${renderGrid(homecareItems, sectionColors.homecare)}
    </div>`;
  }

  if (exerciseItems.length > 0) {
    sections += `<div style="margin-bottom:24px;">
      ${renderSectionHeader("Therapeutic Exercises", sectionColors.exercises.headerBg)}
      ${renderGrid(exerciseItems, sectionColors.exercises)}
    </div>`;
  }

  if (notes && notes.trim()) {
    const escapedNotes = notes.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    sections += `<div style="margin-bottom:24px;">
      ${renderSectionHeader("Additional Notes", "#4b5563")}
      <div style="border-radius:8px;border:1px solid #e5e7eb;background:#f9fafb;overflow:hidden;box-shadow:0 1px 2px rgba(0,0,0,0.05);">
        <div style="padding:12px 16px;">
          <p style="margin:0;font-size:13px;color:#374151;white-space:pre-wrap;">${escapedNotes}</p>
        </div>
      </div>
    </div>`;
  }

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Patient Report - ${patient.name}</title>
<style>
  body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f3f4f6; color: #333; }
  .page { max-width: 800px; margin: 0 auto; background: #fff; padding: 40px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
  .header { display: flex; align-items: center; gap: 16px; margin-bottom: 16px; }
  .logo { max-height: 60px; }
  .clinic-name { font-size: 22px; font-weight: 700; margin: 0; }
  .clinic-info { font-size: 12px; color: #6b7280; margin: 4px 0 0; }
  .patient-name { font-size: 18px; font-weight: 600; margin: 16px 0 4px; }
  .patient-info { font-size: 13px; color: #6b7280; margin: 0 0 24px; }
</style></head><body>
<div class="page">
  <div class="header">
    ${logoUrl ? `<img src="${logoUrl}" alt="Logo" class="logo" />` : ""}
    <div>
      <h1 class="clinic-name">${clinicName}</h1>
      <p class="clinic-info">${[clinicAddress, clinicPhone, clinicEmail, clinicWebsite].filter(Boolean).join(" | ")}</p>
    </div>
  </div>
  <h2 class="patient-name">Patient ID: ${patient.name}</h2>
  <p class="patient-info">
    Date: ${new Date(patient.date).toLocaleDateString()}
  </p>
  ${sections}
</div></body></html>`;
};
