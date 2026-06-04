
import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { ReportSettings } from "@/components/report/ReportSettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useReportSettings } from "@/hooks/useReportSettings";
import { useSupabaseConnection } from "@/hooks/useSupabaseConnection";
import { useReportData } from "@/hooks/useReportData";
import { useReportGeneration } from "@/hooks/useReportGeneration";
import { useCarePlans } from "@/hooks/useCarePlans";
import { ReportBuilder } from "@/components/report/ReportBuilder";
import { CategoryType } from "@/types";

const Report = () => {
  const { connectionStatus } = useSupabaseConnection();
  const { settings, loading: settingsLoading, reloadSettings } = useReportSettings(connectionStatus);
  const { items, subcategories, isLoading } = useReportData();
  const {
    patient,
    selectedItems,
    additionalNotes,
    customTreatmentGoals,
    estimatedCost,
    activeCategory,
    isGeneratingPDF,
    pdfProgress,
    isSharing,
    shareUrl,
    handlePatientInfoChange,
    handleToggleItem,
    handleGenerateReport,
    handleShareReport,
    setAdditionalNotes,
    setCustomTreatmentGoals,
    setEstimatedCost,
    setActiveCategory,
    setShareUrl,
    setPatient,
    setSelectedItems,
  } = useReportGeneration(items, settings, subcategories);

  const carePlans = useCarePlans({
    patient,
    selectedItems,
    additionalNotes,
    customTreatmentGoals,
    activeCategory,
    setPatient,
    setSelectedItems,
    setAdditionalNotes,
    setCustomTreatmentGoals,
    setActiveCategory,
  });
  
  const [activeTab, setActiveTab] = useState<"report" | "settings">("report");
  
  // Reload settings when active tab changes to report
  useEffect(() => {
    if (activeTab === "report") {
      reloadSettings();
    }
  }, [activeTab, reloadSettings]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "report" | "settings")} className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="report">Report Builder</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="report">
            <ReportBuilder 
              patient={patient}
              items={items}
              selectedItems={selectedItems}
              additionalNotes={additionalNotes}
              customTreatmentGoals={customTreatmentGoals}
              estimatedCost={estimatedCost}
              settings={settings}
              settingsLoading={settingsLoading}
              isLoading={isLoading}
              isGeneratingPDF={isGeneratingPDF}
              pdfProgress={pdfProgress}
              isSharing={isSharing}
              shareUrl={shareUrl}
              subcategories={subcategories}
              activeCategory={activeCategory}
              onPatientInfoChange={handlePatientInfoChange}
              onToggleItem={handleToggleItem}
              onCategoryChange={setActiveCategory as (category: CategoryType) => void}
              onNotesChange={setAdditionalNotes}
              onTreatmentGoalsChange={setCustomTreatmentGoals}
              onEstimatedCostChange={setEstimatedCost}
              onGeneratePDF={handleGenerateReport}
              onShareReport={(format) => handleShareReport(format)}
              onShareUrlChange={setShareUrl}
              carePlans={carePlans}
            />
          </TabsContent>
          
          <TabsContent value="settings">
            <ReportSettings onSettingsUpdated={reloadSettings} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Report;
