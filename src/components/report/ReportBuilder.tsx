

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { PatientInfo, ReportItem, CategoryType } from "@/types";
import { PatientInfoForm } from "@/components/report/PatientInfoForm";
import { NotesField } from "@/components/report/NotesField";
import { ReportItemsSelector } from "@/components/report/ReportItemsSelector";
import { ReportPreview } from "@/components/report/ReportPreview";
import { OverviewReport } from "@/components/report/OverviewReport";
import { ReportSetting } from "@/services/reportSettingsService";
import { PDFGenerationProgress } from "@/components/report/PDFGenerationProgress";
import { ShareReportDialog } from "@/components/report/ShareReportDialog";
import { PdfFormatDialog, PdfFormat } from "@/components/report/PdfFormatDialog";
import { ShareReportFormat } from "@/utils/shareReport";
import { RenderPdfProgress } from "@/utils/pdf";
import { ShareReportActions } from "@/components/report/ShareReportActions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "lucide-react";
import { CarePlansPanel } from "@/components/report/CarePlansPanel";
import { useCarePlans } from "@/hooks/useCarePlans";

interface ReportBuilderProps {
  patient: PatientInfo;
  items: ReportItem[];
  selectedItems: string[];
  additionalNotes: string;
  customTreatmentGoals: string;
  estimatedCost: string;
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
  onShareReport: (format: ShareReportFormat) => void;
  onShareUrlChange: (url: string | null) => void;
  carePlans: ReturnType<typeof useCarePlans>;
}

export const ReportBuilder = ({
  patient,
  items,
  selectedItems,
  additionalNotes,
  customTreatmentGoals,
  estimatedCost,
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
}: ReportBuilderProps) => {
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showPdfDialog, setShowPdfDialog] = useState(false);
  const reportPreviewRef = useRef<HTMLDivElement>(null);
  const overviewReportRef = useRef<HTMLDivElement>(null);

  const handlePdfFormatSelect = (format: PdfFormat) => {
    setShowPdfDialog(false);
    const target = format === "overview" ? overviewReportRef.current : reportPreviewRef.current;
    onGeneratePDF(target);
  };

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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column - Patient Info */}
      <div className="lg:col-span-1">
        <PatientInfoForm 
          patient={patient}
          onPatientInfoChange={onPatientInfoChange}
        />
        
        <NotesField
          notes={additionalNotes}
          onChange={onNotesChange}
        />
        
        <div className="space-y-3 mt-6">
          {isGeneratingPDF ? (
            <PDFGenerationProgress progress={pdfProgress} />
          ) : (
            <Button 
              className="w-full bg-medical-700 hover:bg-medical-800 text-lg py-6"
              onClick={() => setShowPdfDialog(true)}
              disabled={isGeneratingPDF || !patient.name || selectedItems.length === 0}
            >
              Generate PDF Report
            </Button>
          )}
          
          <ShareReportActions
            patient={patient}
            items={items}
            selectedItems={selectedItems}
            additionalNotes={additionalNotes}
            customTreatmentGoals={customTreatmentGoals}
            estimatedCost={estimatedCost}
            settings={settings}
            subcategories={subcategories}
            disabled={isGeneratingPDF || !patient.name || selectedItems.length === 0}
          />

          
          <Button 
            variant="outline"
            className="w-full border-medical-600 text-medical-700 hover:bg-medical-50 text-lg py-6"
            onClick={() => {
              onShareUrlChange(null);
              setShowShareDialog(true);
            }}
            disabled={isGeneratingPDF || !patient.name || selectedItems.length === 0}
          >
            <Link className="mr-2 h-4 w-4" />
            Share Report Link
          </Button>
        </div>
      </div>
      
      {/* Right Column - Report Items */}
      <div className="lg:col-span-2">
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
        />
        
        <Tabs defaultValue="full" className="mt-6">
          <TabsList>
            <TabsTrigger value="full">Full Report</TabsTrigger>
            <TabsTrigger value="overview">Overview Report</TabsTrigger>
          </TabsList>
          <TabsContent value="full" forceMount className="data-[state=inactive]:hidden">
            <ReportPreview
              ref={reportPreviewRef}
              patient={patient}
              items={items}
              selectedItems={selectedItems}
              additionalNotes={additionalNotes}
              customTreatmentGoals={customTreatmentGoals}
              estimatedCost={estimatedCost}
              subcategories={subcategories}
              settings={settings}
              settingsLoading={settingsLoading}
            />
          </TabsContent>
          <TabsContent value="overview" forceMount className="data-[state=inactive]:hidden">
            <OverviewReport
              ref={overviewReportRef}
              patient={patient}
              items={items}
              selectedItems={selectedItems}
              customTreatmentGoals={customTreatmentGoals}
              estimatedCost={estimatedCost}
              additionalNotes={additionalNotes}
              subcategories={subcategories}
              settings={settings}
              settingsLoading={settingsLoading}
            />
          </TabsContent>
        </Tabs>
      </div>




      <ShareReportDialog
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
        shareUrl={shareUrl}
        isLoading={isSharing}
        onShare={(format) => onShareReport(format)}
      />

      <PdfFormatDialog
        open={showPdfDialog}
        onOpenChange={setShowPdfDialog}
        onSelect={handlePdfFormatSelect}
      />
    </div>
    </>
  );
};
