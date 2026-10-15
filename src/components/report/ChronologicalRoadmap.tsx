import { ArrowDownCircle, Calendar, Map, PlayCircle, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PatientInfo, ReportItem } from "@/types";
import type { ReportSetting } from "@/services/reportSettingsService";
import { getRoadmapSection, type RoadmapSection } from "@/utils/roadmapSections";
import { ReportDescription } from "./ReportDescription";
import { ROADMAP_CSS } from "./roadmapStyles";

interface RoadmapProps {
  patient: PatientInfo;
  items: ReportItem[];
  settings: ReportSetting[];
  treatmentSchedule: string;
  customTreatmentGoals: string;
  estimatedCost: string;
  additionalNotes: string;
}

const labels: Record<string, string> = {
  diagnosis: "Spinal Diagnosis", extremity: "Extremity Diagnosis", homecare: "Home Care",
  exercises: "Therapeutic Exercise", care_plan_type: "Care Plan Type", phase_of_care: "Phase of Care",
  treatment_goals: "Treatment Goal", treatment_modalities: "Treatment Modality",
};

const RoadmapCard = ({ item }: { item: ReportItem }) => (
  <article className="roadmap-card">
    <div className="roadmap-card-top">
      <h3>{item.name}</h3>
      <span className="roadmap-badge">{labels[item.subcategoryId || ""] || labels[item.categoryId] || "Treatment Plan"}</span>
    </div>
    <ReportDescription itemId={item.id} definition={item.definition} description={item.description} />
    {item.infoLink && <Button asChild variant="ghost" className="roadmap-demo">
      <a href={item.infoLink} target="_blank" rel="noopener noreferrer"><PlayCircle className="h-4 w-4" />Watch Demo</a>
    </Button>}
  </article>
);

const Divider = () => <div className="roadmap-divider" aria-hidden="true"><ArrowDownCircle className="h-6 w-6 shrink-0" /></div>;

export const ChronologicalRoadmap = ({ patient, items, settings, treatmentSchedule, customTreatmentGoals, estimatedCost, additionalNotes }: RoadmapProps) => {
  const getSetting = (name: string, fallback = "") => settings.find((setting) => setting.name === name)?.value || fallback;
  const clinicName = getSetting("clinic_name", "Your Clinic Name");
  const planOrder = ["care_plan_type", "phase_of_care", "treatment_goals"];
  const groups = (section: RoadmapSection) => items.filter((item) => getRoadmapSection(item) === section)
    .sort((a, b) => section === "plan"
      ? (planOrder.indexOf(a.subcategoryId || "") + 1 || 4) - (planOrder.indexOf(b.subcategoryId || "") + 1 || 4)
      : 0);
  const hasProblem = groups("problem").length > 0;
  const hasPlan = groups("plan").length > 0 || !!treatmentSchedule || !!customTreatmentGoals || !!estimatedCost;
  const hasClinic = groups("clinic").length > 0;
  const hasHome = groups("home").length > 0;
  const renderSection = (section: RoadmapSection, number: number, title: string, gridClass = "") => (
    <section className={`roadmap-section roadmap-${section}`}>
      <div className="mb-6 flex items-center gap-4">
        <span className="roadmap-number">{number}</span>
        <h2 className="text-2xl font-black break-words">{title}</h2>
      </div>
      {section === "plan" && treatmentSchedule && <article className="roadmap-card mb-6">
        <div className="roadmap-card-top"><h3>Treatment Frequency &amp; Duration</h3></div>
        <p className="text-xl font-bold text-treatment">{treatmentSchedule}</p>
      </article>}
      <div className={`roadmap-grid ${gridClass}`}>
        {groups(section).map((item) => <RoadmapCard key={item.id} item={item} />)}
        {section === "plan" && customTreatmentGoals && <article className="roadmap-card">
          <div className="roadmap-card-top"><h3>Additional Treatment Goals</h3></div>
          <ul className="list-disc pl-5 text-sm font-bold"><li className="whitespace-pre-wrap">{customTreatmentGoals}</li></ul>
        </article>}
      </div>
      {section === "plan" && estimatedCost && <article className="roadmap-card mt-6">
        <div className="roadmap-card-top"><h3>Estimated Cost</h3></div>
        <p className="text-xl font-bold text-treatment">{estimatedCost}</p>
        <p className="mt-2 text-xs italic">Note: This is an estimate based on the recommended clinical care plan. Please refer to your official financial breakdown for detailed billing, insurance, and payment information.</p>
      </article>}
    </section>
  );

  return <>
    <style dangerouslySetInnerHTML={{ __html: ROADMAP_CSS }} />
    <div className="roadmap-document">
      <header className="roadmap-header">
        <Map className="pointer-events-none absolute -right-8 -top-8 h-64 w-64 opacity-10" aria-hidden="true" />
        <div className="roadmap-header-layout">
          <div className="min-w-0 w-full">
            <span className="roadmap-eyebrow">Your Personal Recovery Roadmap</span>
            <h1 className="mb-3 text-3xl font-black break-words">Clinical Report of Findings</h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
              <span className="flex items-center gap-1.5"><User className="h-4 w-4 shrink-0" />Patient: {patient.name}</span>
              <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 shrink-0" />Date: {new Date(patient.date).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="roadmap-prepared">
            {getSetting("logo_url") && <img src={getSetting("logo_url")} alt={`${clinicName} Logo`} className="mb-2 h-12 max-w-full object-contain" />}
            <p className="mb-1 text-xs font-extrabold uppercase">Prepared By</p>
            <p className="text-lg font-bold break-words">{clinicName}</p>
            {getSetting("clinic_address") && <p className="mt-1 text-sm break-words">{getSetting("clinic_address")}</p>}
          </div>
        </div>
      </header>
      <div className="roadmap-body">
        {hasProblem && renderSection("problem", 1, "The Problem (Diagnosis)", "roadmap-problem-grid")}
        {hasProblem && (hasPlan || hasClinic || hasHome) && <Divider />}
        {hasPlan && renderSection("plan", 2, "The Plan", "roadmap-plan-grid")}
        {hasPlan && (hasClinic || hasHome) && <Divider />}
        <div className="roadmap-split">
          {hasClinic && renderSection("clinic", 3, "In-Clinic Plan")}
          {hasHome && renderSection("home", 4, "At-Home Plan")}
        </div>
        {additionalNotes && <section className="mt-8 border-t pt-6">
          <h2 className="mb-3 text-lg font-bold">Additional Notes</h2>
          <p className="whitespace-pre-wrap text-sm">{additionalNotes}</p>
        </section>}
      </div>
      <footer className="roadmap-footer">
        <p>{[getSetting("clinic_phone"), getSetting("clinic_email"), getSetting("clinic_website")].filter(Boolean).join(" · ")}</p>
        <p className="mt-1">This roadmap is a clinical guideline and does not replace acute medical advice.</p>
      </footer>
    </div>
  </>;
};