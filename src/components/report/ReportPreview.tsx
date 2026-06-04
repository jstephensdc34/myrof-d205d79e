
import { forwardRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryType, MAIN_CATEGORIES, PatientInfo, ReportItem } from "@/types";
import { ReportHeader } from "./ReportHeader";
import { ReportSetting } from "@/services/reportSettingsService";
import { PatientInfoDisplay } from "./PatientInfoDisplay";
import { ReportCategory } from "./ReportCategory";

// Category name mapping
const categoryNames: Record<string, string> = {
  diagnosis: "Spinal Diagnosis",
  extremity: "Extremity Diagnosis",
  treatment: "Treatment Plan",
  homecare: "Home Care",
  exercises: "Therapeutic Exercises"
};

interface ReportPreviewProps {
  patient: PatientInfo;
  items: ReportItem[];
  selectedItems: string[];
  additionalNotes: string;
  customTreatmentGoals?: string;
  estimatedCost?: string;
  subcategories: any[];
  settings?: ReportSetting[];
  settingsLoading?: boolean;
  printMode?: boolean;
}

export const ReportPreview = forwardRef<HTMLDivElement, ReportPreviewProps>(({
  patient,
  items,
  selectedItems,
  additionalNotes,
  customTreatmentGoals = "",
  estimatedCost = "",
  subcategories = [],
  settings = [],
  settingsLoading = false,
  printMode = false,
}, ref) => {
  const getSelectedItems = (categoryId: string) => {
    return items.filter(item => 
      item.categoryId === categoryId && selectedItems.includes(item.id)
    );
  };

  const getSubcategoryName = (subcategoryId: string) => {
    const subcategory = subcategories.find(s => s.id === subcategoryId);
    return subcategory ? subcategory.name : "";
  };

  const hasSelectedItemsInCategory = (categoryId: string) => {
    return items.some(item => 
      item.categoryId === categoryId && selectedItems.includes(item.id)
    );
  };

  const getSetting = (name: string, fallback = "") =>
    settings.find(s => s.name === name)?.value || fallback;

  const clinic = {
    name: getSetting("clinic_name", "My Chiropractic Clinic"),
    address: getSetting("clinic_address"),
    phone: getSetting("clinic_phone"),
    email: getSetting("clinic_email"),
    website: getSetting("clinic_website"),
    logoUrl: getSetting("logo_url"),
  };

  const innerContent = selectedItems.length > 0 ? (
    <div ref={ref} className="space-y-6 max-w-[210mm] mx-auto bg-white">

            {/* Cover Page */}
            <div
              className="bg-white border border-border shadow-sm mx-auto flex flex-col items-center justify-between text-center break-after-page max-h-[10.5in]"
              style={{
                padding: '20mm 15mm',
                boxSizing: 'border-box',
                height: '10in',
                pageBreakAfter: 'always',
                breakAfter: 'page',
              }}
            >
              {/* Top spacer */}
              <div />

              {/* Hero block */}
              <div className="flex flex-col items-center gap-8 w-full">
                {clinic.logoUrl ? (
                  <img
                    src={clinic.logoUrl}
                    alt={`${clinic.name} Logo`}
                    className="h-48 w-auto max-w-md object-contain"
                  />
                ) : (
                  <div className="h-48 w-48 bg-gray-100 flex items-center justify-center rounded">
                    <span className="text-sm text-gray-400">Clinic Logo</span>
                  </div>
                )}

                <h1 className="text-4xl font-bold text-gray-900 tracking-tight px-4">
                  Clinical Report of Findings &amp; Care Plan
                </h1>

                <div className="h-px w-24 bg-gray-300" />

                {patient.name && (
                  <div className="text-gray-700 space-y-1">
                    <p className="text-lg">
                      <span className="font-semibold">Patient ID:</span> {patient.name}
                    </p>
                    <p className="text-lg">
                      <span className="font-semibold">Date:</span>{" "}
                      {new Date(patient.date).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              {/* Clinic info footer */}
              <div className="text-sm text-gray-600 space-y-1 pt-8">
                <p className="text-base font-semibold text-gray-800">{clinic.name}</p>
                {clinic.address && <p>{clinic.address}</p>}
                <p className="flex flex-wrap justify-center gap-x-4">
                  {clinic.phone && <span>{clinic.phone}</span>}
                  {clinic.website && <span>{clinic.website}</span>}
                  {clinic.email && <span>{clinic.email}</span>}
                </p>
              </div>
            </div>

            {/* Content Page(s) */}
            <div className="bg-white p-6 border border-border shadow-sm mx-auto"
                 style={{ padding: '15mm', boxSizing: 'border-box' }}>
              
              <div className="space-y-8">
                {/* Render categories in the same order as MAIN_CATEGORIES */}
                {MAIN_CATEGORIES.filter(category => hasSelectedItemsInCategory(category) || (category === "treatment" && (customTreatmentGoals || estimatedCost))).map((category) => (
                  <ReportCategory
                    key={category}
                    categoryId={category}
                    categoryName={categoryNames[category]}
                    items={getSelectedItems(category)}
                    subcategories={subcategories}
                    getSubcategoryName={getSubcategoryName}
                    customTreatmentGoals={category === "treatment" ? customTreatmentGoals : undefined}
                    estimatedCost={category === "treatment" ? estimatedCost : undefined}
                  />
                ))}
                
                {/* Additional Notes Section */}
                {additionalNotes && (
                  <div className="rounded-lg border border-border bg-muted/50 overflow-hidden shadow-sm">
                    <div className="px-4 py-2 bg-gray-600">
                      <h4 className="font-semibold text-sm text-white">Additional Notes</h4>
                    </div>
                    <div className="px-4 py-3">
                      <p className="whitespace-pre-wrap text-sm text-foreground/80">{additionalNotes}</p>
                    </div>
                  </div>
                )}
              </div>
              
            </div>
    </div>
  ) : (
    <div className="p-8 text-center text-muted-foreground">
      <p>Select items from the categories above to build your report.</p>
    </div>
  );

  if (printMode) {
    return innerContent;
  }

  return (
    <Card className="mt-6">
      <CardHeader className="bg-muted border-b">
        <CardTitle className="text-foreground text-lg">Report Preview</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {innerContent}
      </CardContent>
    </Card>
  );
});


ReportPreview.displayName = "ReportPreview";
