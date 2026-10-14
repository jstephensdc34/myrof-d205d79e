import { TreatmentScheduleParts } from "@/utils/treatmentSchedule";


import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PatientInfo, ReportItem, CategoryType } from "@/types";
import { PatientInfoForm } from "@/components/report/PatientInfoForm";
import { NotesField } from "@/components/report/NotesField";
import { ReportItemsSelector } from "@/components/report/ReportItemsSelector";
import { OverviewReport } from "@/components/report/OverviewReport";
import { ReportSetting } from "@/services/reportSettingsService";
import { PDFGenerationProgress } from "@/components/report/PDFGenerationProgress";
import { ShareReportDialog } from "@/components/report/ShareReportDialog";
import { ShareReportFormat } from "@/utils/shareReport";
import { RenderPdfProgress } from "@/utils/pdf";
import { ShareReportActions } from "@/components/report/ShareReportActions";
import { Link, ChevronDown } from "lucide-react";
import { ExportStyleMenu } from "@/components/report/ExportStyleMenu";
import { CarePlansPanel } from "@/components/report/CarePlansPanel";
import { useCarePlans } from "@/hooks/useCarePlans";
import { ReportStyleToggle } from "@/components/report/ReportStyleToggle";
import { UILayout } from "@/components/report/UILayoutSwitcher";
import {
  ReportStyle,
  DEFAULT_REPORT_STYLE,
  REPORT_STYLE_SETTING_NAME,
  isReportStyle,
} from "@/components/report/reportStyleVariants";

interface ReportBuilderProps {
  patient: PatientInfo;
  items: ReportItem[];
  selectedItems: string[];
  additionalNotes: string;
  customTreatmentGoals: string;
  estimatedCost: string;
  schedule: TreatmentScheduleParts;
  treatmentSchedule: string;
  onScheduleChange: (schedule: TreatmentScheduleParts) => void;
  settings: ReportSetting[];
  settingsLoading: boolean;
  isLoading: boolean;
  isGeneratingPDF: boolean;
  pdfProgress: RenderPdfProgress;
  isSharing: boolean;
  shareUrl: string | null;
  subcategories: any[];
  activeCategory: CategoryType;
  onPatientInfoChange: (key: keyof PatientInfo, value: string | number) => void;
  onToggleItem: (itemId: string) => void;
  onCategoryChange: (category: CategoryType) => void;
  onNotesChange: (notes: string) => void;
  onTreatmentGoalsChange: (goals: string) => void;
  onEstimatedCostChange: (cost: string) => void;
  onGeneratePDF: (element: HTMLElement | null) => void;
  onShareReport: (format: ShareReportFormat, reportStyle?: ReportStyle) => void;
  onShareUrlChange: (url: string | null) => void;
  carePlans: ReturnType<typeof useCarePlans>;
  onSettingsUpdated?: () => void;
  uiLayout?: UILayout;
}

export const ReportBuilder = ({
  patient,
  items,
  selectedItems,
  additionalNotes,
  customTreatmentGoals,
  estimatedCost,
  schedule,
  treatmentSchedule,
  onScheduleChange,
  settings,
  settingsLoading,
  isLoading,
  isGeneratingPDF,
  pdfProgress,
  isSharing,
  shareUrl,
  subcategories,
  activeCategory,
  onPatientInfoChange,
  onToggleItem,
  onCategoryChange,
  onNotesChange,
  onTreatmentGoalsChange,
  onEstimatedCostChange,
  onGeneratePDF,
  onShareReport,
  onShareUrlChange,
  carePlans,
  onSettingsUpdated,
  uiLayout = "ui-workspace",
}: ReportBuilderProps) => {
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [reportStyle, setReportStyle] = useState<ReportStyle>(DEFAULT_REPORT_STYLE);
  const [styleInitialized, setStyleInitialized] = useState(false);
  const overviewReportRef = useRef<HTMLDivElement>(null);
  const [shareStyle, setShareStyle] = useState<ReportStyle>(DEFAULT_REPORT_STYLE);
  const exportDisabled = isGeneratingPDF || !patient.name || selectedItems.length === 0;

  // PDF snapshots the preview, so switch the preview to the chosen style first.
  const handlePdfWithStyle = (style: ReportStyle) => {
    setReportStyle(style);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => setTimeout(() => onGeneratePDF(overviewReportRef.current), 50))
    );
  };

  // Initialize the layout from the saved default
  useEffect(() => {
    if (styleInitialized || settingsLoading) return;
    const saved = settings.find((s) => s.name === REPORT_STYLE_SETTING_NAME)?.value;
    setReportStyle(isReportStyle(saved) ? saved : DEFAULT_REPORT_STYLE);
    setStyleInitialized(true);
  }, [settings, settingsLoading, styleInitialized]);

  // UI layout preview variants (client-side only)
  const isModular = uiLayout === "ui-modular";
  const isWorkspace = uiLayout === "ui-workspace";

  const gridClass = isModular
    ? "grid grid-cols-1 lg:grid-cols-2 gap-6 items-start"
    : isWorkspace
    ? "grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
    : "grid grid-cols-1 gap-10 max-w-4xl mx-auto";

  const leftColClass = isModular
    ? "rounded-xl border bg-card p-5 shadow-sm"
    : isWorkspace
    ? "lg:col-span-1"
    : "";

  const rightColClass = isModular
    ? "rounded-xl border bg-card p-5 shadow-sm"
    : isWorkspace
    ? "lg:col-span-2"
    : "";

  const reportItemsSelector = (
    <ReportItemsSelector
      items={items}
      activeCategory={activeCategory}
      selectedItems={selectedItems}
      onCategoryChange={onCategoryChange}
      onToggleItem={onToggleItem}
      isLoading={isLoading}
      subcategories={subcategories}
      customTreatmentGoals={customTreatmentGoals}
      onTreatmentGoalsChange={onTreatmentGoalsChange}
      estimatedCost={estimatedCost}
      onEstimatedCostChange={onEstimatedCostChange}
      schedule={schedule}
      onScheduleChange={onScheduleChange}
    />
  );

  return (
    <>
      <div className="mb-6">
        <CarePlansPanel
          savedPlans={carePlans.savedPlans}
          loadingPlans={carePlans.loadingPlans}
          currentPlanId={carePlans.currentPlanId}
          currentPlanTitle={carePlans.currentPlanTitle}
          lastAutoSavedAt={carePlans.lastAutoSavedAt}
          draftRestored={carePlans.draftRestored}
          onSaveAs={carePlans.saveAs}
          onUpdateCurrent={carePlans.updateCurrent}
          onLoad={carePlans.loadPlan}
          onDelete={carePlans.removePlan}
          onRename={carePlans.rename}
          onNew={carePlans.newPlan}
          hasContent={!!patient.name || selectedItems.length > 0}
        />
      </div>
    <div className={gridClass}>
      {/* Left Column - Patient Info */}
      <div className={leftColClass}>
        <PatientInfoForm 
          patient={patient}
          onPatientInfoChange={onPatientInfoChange}
        />

        {!isWorkspace && <div className="mt-6">{reportItemsSelector}</div>}
        
        
        <NotesField
          notes={additionalNotes}
          onChange={onNotesChange}
        />
        
      </div>
      
      {/* Right Column - Report Items */}
      <div className={rightColClass}>
        {isWorkspace && reportItemsSelector}
        
        
        <div className="space-y-3 mb-6">
          {isGeneratingPDF ? (
            <PDFGenerationProgress progress={pdfProgress} />
          ) : (
            <ExportStyleMenu
              currentStyle={reportStyle}
              onSelect={handlePdfWithStyle}
              disabled={exportDisabled}
              trigger={
                <Button
                  className="w-full bg-medical-700 hover:bg-medical-800 text-lg py-6"
                  disabled={exportDisabled}
                >
                  Download PDF
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              }
            />
          )}

          <ShareReportActions
            patient={patient}
            items={items}
            selectedItems={selectedItems}
            additionalNotes={additionalNotes}
            customTreatmentGoals={customTreatmentGoals}
            estimatedCost={estimatedCost}
            treatmentSchedule={treatmentSchedule}
            settings={settings}
            subcategories={subcategories}
            reportStyle={reportStyle}
            disabled={isGeneratingPDF || !patient.name || selectedItems.length === 0}
          />

          <ExportStyleMenu
            currentStyle={reportStyle}
            disabled={exportDisabled}
            onSelect={(style) => {
              setShareStyle(style);
              onShareUrlChange(null);
              setShowShareDialog(true);
            }}
            trigger={
              <Button
                variant="outline"
                className="w-full border-medical-600 text-medical-700 hover:bg-medical-50 text-lg py-6"
                disabled={exportDisabled}
              >
                <Link className="mr-2 h-4 w-4" />
                Share Report Link
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            }
          />
        </div>
        <div className={isModular ? "" : "mt-6"}>

          <ReportStyleToggle
            value={reportStyle}
            onChange={setReportStyle}
            settings={settings}
            onSaved={onSettingsUpdated}
          />

            <OverviewReport
              ref={overviewReportRef}
              patient={patient}
              items={items}
              selectedItems={selectedItems}
              customTreatmentGoals={customTreatmentGoals}
              estimatedCost={estimatedCost}
              treatmentSchedule={treatmentSchedule}
              additionalNotes={additionalNotes}
              subcategories={subcategories}
              settings={settings}
              settingsLoading={settingsLoading}
              reportStyle={reportStyle}
            />
        </div>
      </div>




      <ShareReportDialog
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
        shareUrl={shareUrl}
        isLoading={isSharing}
        onShare={(format) => onShareReport(format, shareStyle)}
      />

    </div>
    </>
  );
};
