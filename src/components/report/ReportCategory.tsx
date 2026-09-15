
import { ReportItem as ReportItemType } from "@/types";
import { ReportSubcategory } from "./ReportSubcategory";
import { getOrderedSubcategories } from "@/utils/categoryUtils";
import { getSectionIcon } from "@/utils/sectionIcons";
import { ReportStyle, DOSSIER_PRIMARY, DOSSIER_PRIMARY_SOFT } from "./reportStyleVariants";

const sectionStyles: Record<string, { bg: string; border: string; headerBg: string; headerText: string }> = {
  diagnosis: { bg: "bg-diagnosis-soft", border: "border-diagnosis-border", headerBg: "bg-diagnosis", headerText: "text-primary-foreground" },
  extremity: { bg: "bg-extremity-soft", border: "border-extremity-border", headerBg: "bg-extremity", headerText: "text-primary-foreground" },
  treatment: { bg: "bg-treatment-soft", border: "border-treatment-border", headerBg: "bg-treatment", headerText: "text-primary-foreground" },
  homecare: { bg: "bg-homecare-soft", border: "border-homecare-border", headerBg: "bg-homecare", headerText: "text-primary-foreground" },
  exercises: { bg: "bg-exercise-soft", border: "border-exercise-border", headerBg: "bg-exercise", headerText: "text-primary-foreground" },
};

interface ReportCategoryProps {
  categoryId: string;
  categoryName: string;
  items: ReportItemType[];
  subcategories: any[];
  getSubcategoryName: (id: string) => string;
  customTreatmentGoals?: string;
  estimatedCost?: string;
  variant?: ReportStyle;
}

export const ReportCategory = ({ 
  categoryId, 
  categoryName, 
  items, 
  subcategories,
  getSubcategoryName,
  customTreatmentGoals,
  estimatedCost,
  variant = "classic",
}: ReportCategoryProps) => {
  const style = sectionStyles[categoryId] || sectionStyles.diagnosis;
  const isDossier = variant === "dossier";

  const panelClass = isDossier
    ? "pl-4 py-2"
    : `rounded-lg border ${style.border} ${style.bg} overflow-hidden shadow-sm`;

  const renderSubcategoryItems = () => {
    const orderedSubcategories = getOrderedSubcategories(categoryId, subcategories);
    
    return (
      <div className={isDossier ? "space-y-5" : "space-y-3"}>
        {orderedSubcategories.map(subcategory => {
          const subcategoryItems = items.filter(
            item => item.subcategoryId === subcategory.id
          );
          
          return (
            <ReportSubcategory 
              key={subcategory.id} 
              title={getSubcategoryName(subcategory.id)}
              items={subcategoryItems}
              style={style}
              variant={variant}
            />
          );
        })}
        
        {(() => {
          const uncategorizedItems = items.filter(
            item => !item.subcategoryId
          );
          
          return uncategorizedItems.length > 0 ? (
            <ReportSubcategory
              title="Other"
              items={uncategorizedItems}
              style={style}
              variant={variant}
            />
          ) : null;
        })()}

        {customTreatmentGoals && (
          <div
            className={panelClass}
            style={isDossier ? { borderLeft: `2px solid ${DOSSIER_PRIMARY_SOFT}` } : undefined}
          >
            {isDossier ? (
              <h4 className="text-sm font-semibold" style={{ color: DOSSIER_PRIMARY }}>Custom Treatment Goal</h4>
            ) : (
              <div className={`px-4 py-2 ${style.headerBg}`}>
                <h4 className={`font-semibold text-sm ${style.headerText}`}>Custom Treatment Goal</h4>
              </div>
            )}
            <div className={isDossier ? "mt-1.5" : "px-4 py-3"}>
              <p className="text-sm font-bold text-foreground/80">• {customTreatmentGoals}</p>
            </div>
          </div>
        )}

        {estimatedCost && (
          <div
            className={panelClass}
            style={isDossier ? { borderLeft: `2px solid ${DOSSIER_PRIMARY_SOFT}` } : undefined}
          >
            {isDossier ? (
              <h4 className="text-sm font-semibold" style={{ color: DOSSIER_PRIMARY }}>Estimated Cost</h4>
            ) : (
              <div className={`px-4 py-2 ${style.headerBg}`}>
                <h4 className={`font-semibold text-sm ${style.headerText}`}>Estimated Cost</h4>
              </div>
            )}
            <div className={isDossier ? "mt-1.5" : "px-4 py-4 text-center"}>
              <p className="text-2xl font-bold text-treatment">{estimatedCost}</p>
              <p className="text-xs italic text-muted-foreground mt-2">
                Note: This is an estimate based on the recommended clinical care plan. Please refer to your official financial breakdown for detailed billing, insurance, and payment information.
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };

  const Icon = getSectionIcon(categoryName);

  if (isDossier) {
    return (
      <div className="mb-8">
        <div className="mb-3 flex items-center gap-2 border-b pb-2" style={{ borderColor: DOSSIER_PRIMARY_SOFT }}>
          <Icon className="h-5 w-5" strokeWidth={2.25} style={{ color: DOSSIER_PRIMARY }} />
          <h3 className="text-base font-bold uppercase tracking-wide" style={{ color: DOSSIER_PRIMARY }}>
            {categoryName}
          </h3>
        </div>
        {renderSubcategoryItems()}
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className={`rounded-lg px-4 py-2.5 ${style.headerBg} mb-3 flex items-center gap-2`}>
        <Icon className={`h-5 w-5 ${style.headerText}`} strokeWidth={2.25} />
        <h3 className={`font-bold text-base ${style.headerText}`}>{categoryName}</h3>
      </div>
      {renderSubcategoryItems()}
    </div>
  );
};
