
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CategoryType, MAIN_CATEGORIES, ReportItem, Subcategory } from "@/types";
import { ItemsList } from "@/components/library/ItemsList";
import { LoadingState } from "@/components/library/LoadingState";
import { SubcategorySelector } from "@/components/library/SubcategorySelector";
import { getOrderedSubcategories } from "@/utils/categoryUtils";

interface LibraryContentProps {
  activeCategory: CategoryType;
  setActiveCategory: (category: CategoryType) => void;
  activeSubcategory: string | null;
  onSubcategoryClick: (subcategoryId: string) => void;
  isLoading: boolean;
  items: ReportItem[];
  onEdit: (item: ReportItem) => void;
  onDelete: (id: string) => void;
  getCategoryName: (categoryId: string) => string;
  getSubcategoriesForCategory: (categoryId: string) => Subcategory[];
}

export const LibraryContent = ({
  activeCategory,
  setActiveCategory,
  activeSubcategory,
  onSubcategoryClick,
  isLoading,
  items,
  onEdit,
  onDelete,
  getCategoryName,
  getSubcategoriesForCategory
}: LibraryContentProps) => {
  // Get ordered subcategories for the active category
  const getOrderedSubcategoriesForCategory = (categoryId: string) => {
    const subcategories = getSubcategoriesForCategory(categoryId);
    return getOrderedSubcategories(categoryId, subcategories);
  };

  return (
    <Tabs value={activeCategory} onValueChange={(value) => setActiveCategory(value as CategoryType)}>
      <TabsList className="mb-6 bg-white border border-gray-200">
        {MAIN_CATEGORIES.map((category) => (
          <TabsTrigger
            key={category}
            value={category}
            className="data-[state=active]:bg-medical-100 data-[state=active]:text-medical-800"
          >
            {getCategoryName(category)}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {MAIN_CATEGORIES.map((category) => (
        <TabsContent key={category} value={category}>
          {(category === "diagnosis" || category === "extremity" || 
            category === "treatment" || category === "homecare" ||
            category === "exercises") && (
            <SubcategorySelector
              subcategories={getOrderedSubcategoriesForCategory(category)}
              activeSubcategory={activeSubcategory}
              onSubcategoryClick={onSubcategoryClick}
            />
          )}
          
          {isLoading ? (
            <LoadingState />
          ) : (
            <ItemsList 
              items={items}
              onEdit={onEdit}
              onDelete={onDelete}
              categoryName={getCategoryName(category)}
            />
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
};
