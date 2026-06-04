
import { useState } from "react";
import { CategoryType, PatientInfo, ReportItem } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { generatePDF, RenderPdfProgress } from "@/utils/pdf";
import { ReportSetting } from "@/services/reportSettingsService";
import { shareReport, ShareReportFormat } from "@/utils/shareReport";

export const useReportGeneration = (
  items: ReportItem[],
  settings: ReportSetting[],
  subcategories: any[]
) => {
  const { toast } = useToast();
  const [patient, setPatient] = useState<PatientInfo>({
    name: "",
    age: undefined,
    gender: "",
    date: new Date().toISOString().split("T")[0]
  });
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [additionalNotes, setAdditionalNotes] = useState<string>("");
  const [customTreatmentGoals, setCustomTreatmentGoals] = useState<string>("");
  const [estimatedCost, setEstimatedCost] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<CategoryType>("diagnosis");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState<boolean>(false);
  const [pdfProgress, setPdfProgress] = useState<RenderPdfProgress>({ status: 'preparing', percentage: 0 });
  const [isSharing, setIsSharing] = useState<boolean>(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  const handlePatientInfoChange = (key: keyof PatientInfo, value: string | number) => {
    setPatient(prev => ({ ...prev, [key]: value }));
  };
  
  const handleToggleItem = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };
  
  const handleGenerateReport = async (element: HTMLElement | null) => {
    // Validation
    if (!patient.name) {
      toast({
        title: "Missing Information",
        description: "Please enter the patient's name.",
        variant: "destructive"
      });
      return;
    }
    
    if (selectedItems.length === 0) {
      toast({
        title: "No Items Selected",
        description: "Please select at least one item for the report.",
        variant: "destructive"
      });
      return;
    }

    if (!element) {
      toast({
        title: "Preview Not Ready",
        description: "The report preview is not available yet. Please try again.",
        variant: "destructive"
      });
      return;
    }
    
    setIsGeneratingPDF(true);
    setPdfProgress({ status: 'preparing', percentage: 0 });
    
    try {
      await generatePDF({
        element,
        patientName: patient.name,
        onProgress: (progress) => {
          setPdfProgress(progress);
        }
      });
      
      toast({
        title: "Report Generated",
        description: `Report for ${patient.name} has been downloaded successfully!`
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleShareReport = async (format: ShareReportFormat = "full") => {
    if (!patient.name) {
      toast({ title: "Missing Information", description: "Please enter the patient's name.", variant: "destructive" });
      return;
    }
    if (selectedItems.length === 0) {
      toast({ title: "No Items Selected", description: "Please select at least one item for the report.", variant: "destructive" });
      return;
    }

    setIsSharing(true);
    try {
      const selectedItemsData = items.filter(item => selectedItems.includes(item.id));
      const url = await shareReport({
        patient,
        selectedItems: selectedItemsData,
        notes: additionalNotes,
        customTreatmentGoals,
        estimatedCost,
        settings,
        subcategories,
        format,
      });
      setShareUrl(url);
      toast({ title: "Report Shared", description: "Shareable link has been generated!" });
    } catch (error) {
      console.error("Error sharing report:", error);
      toast({ title: "Error", description: error instanceof Error ? error.message : "Failed to share report.", variant: "destructive" });
    } finally {
      setIsSharing(false);
    }
  };

  return {
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
  };
};
