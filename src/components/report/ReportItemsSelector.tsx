
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { CategoryType, MAIN_CATEGORIES, ReportItem } from "@/types";
import { useState } from "react";
import { SubcategorySelector } from "./SubcategorySelector";
import { ReportItemList } from "./ReportItemList";
import { ReportLoadingState } from "./ReportLoadingState";
import { categoryNames, getDefaultSubcategory } from "@/utils/categoryUtils";

interface ReportItemsSelectorProps {
  items: ReportItem[];
  activeCategory: CategoryType;
  selectedItems: string[];
  onCategoryChange: (category: CategoryType) => void;
  onToggleItem: (itemId: string) => void;
  isLoading?: boolean;
  subcategories: any[];
  customTreatmentGoals?: string;
  onTreatmentGoalsChange?: (goals: string) => void;
  estimatedCost?: string;
  onEstimatedCostChange?: (cost: string) => void;
}

export const ReportItemsSelector = ({
  items,
  activeCategory,
  selectedItems,
  onCategoryChange,
  onToggleItem,
  isLoading = false,
  subcategories = [],
  customTreatmentGoals = "",
  onTreatmentGoalsChange,
  estimatedCost = "",
  onEstimatedCostChange,
}: ReportItemsSelectorProps) => {
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(
    getDefaultSubcategory(activeCategory)
  );

  // When category changes, reset subcategory if needed
  const handleCategoryChange = (category: CategoryType) => {
    onCategoryChange(category);
    setActiveSubcategory(getDefaultSubcategory(category));
  };

  // Handle subcategory selection without causing the main tab to change
  const handleSubcategoryClick = (subcategoryId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setActiveSubcategory(subcategoryId);
  };

  // Filter items based on subcategory if active
  const getFilteredItems = (categoryId: string) => {
    if ((categoryId === "diagnosis" || categoryId === "extremity" || categoryId === "treatment" || 
         categoryId === "homecare" || categoryId === "exercises") && activeSubcategory) {
      return items.filter(item => 
        item.categoryId === categoryId && 
        item.subcategoryId === activeSubcategory
      );
    }
    return items.filter(item => item.categoryId === categoryId);
  };

  if (isLoading) {
    return <ReportLoadingState />;
  }

  return (
    <Card>
      <CardHeader className="bg-medical-600">
        <CardTitle className="text-white">Report Contents</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs value={activeCategory} onValueChange={(value) => handleCategoryChange(value as CategoryType)}>
          <TabsList className="w-full bg-gray-100 mb-6">
            {MAIN_CATEGORIES.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="flex-1 data-[state=active]:bg-medical-100 data-[state=active]:text-medical-800"
              >
                {categoryNames[category]}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {MAIN_CATEGORIES.map((category) => (
            <TabsContent key={category} value={category}>
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Select {categoryNames[category]}:</h3>
                
                {(category === "diagnosis" || category === "extremity" || category === "treatment" || 
                  category === "homecare" || category === "exercises") && (
                  <SubcategorySelector
                    category={category}
                    activeSubcategory={activeSubcategory}
                    subcategories={subcategories}
                    onSubcategoryClick={handleSubcategoryClick}
                  />
                )}
                
                <ReportItemList
                  items={getFilteredItems(category)}
                  selectedItems={selectedItems}
                  onToggleItem={onToggleItem}
                />
                
                {category === "treatment" && activeSubcategory === "treatment_goals" && onTreatmentGoalsChange && (
                  <div className="mt-4">
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Additional Treatment Goals
                    </label>
                    <Textarea
                      className="min-h-[100px]"
                      placeholder="Enter any custom treatment goals for this patient..."
                      value={customTreatmentGoals}
                      onChange={(e) => onTreatmentGoalsChange(e.target.value)}
                    />
                  </div>
                )}

                {category === "treatment" && activeSubcategory === "estimated_cost" && onEstimatedCostChange && (
                  <div className="mt-4">
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Estimated Cost (free text)
                    </label>
                    <Input
                      placeholder="e.g. $1,500 or $50 per visit"
                      value={estimatedCost}
                      onChange={(e) => onEstimatedCostChange(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Shown prominently in the Treatment Plan section of the report.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};
