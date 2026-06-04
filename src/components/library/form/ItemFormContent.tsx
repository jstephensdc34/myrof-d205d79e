
import { useEffect, useState } from "react";
import { ReportItem, CategoryType } from "@/types";
import { FormFields } from "./FormFields";
import { FormActions } from "./FormActions";

interface ItemFormContentProps {
  activeCategory: CategoryType;
  onSaveItem: (item: Partial<ReportItem> | ReportItem) => void;
  editingItem: ReportItem | null;
  isSubmitting?: boolean;
  setIsDialogOpen: (isOpen: boolean) => void;
  availableSubcategories: {
    id: string;
    name: string;
    parentCategoryId?: string;
    description?: string;
  }[];
}

export const ItemFormContent = ({
  activeCategory,
  onSaveItem,
  editingItem,
  isSubmitting = false,
  setIsDialogOpen,
  availableSubcategories,
}: ItemFormContentProps) => {
  const [item, setItem] = useState<Partial<ReportItem>>({ categoryId: activeCategory });
  
  // Update the item when editingItem changes or when activeCategory changes and not editing
  useEffect(() => {
    if (editingItem) {
      // Make sure to use the complete editingItem including the description
      setItem({
        ...editingItem,
        description: editingItem.description || "" // Ensure description is never undefined
      });
    } else {
      setItem({ categoryId: activeCategory });
    }
  }, [editingItem, activeCategory]);

  const handleChange = (field: keyof ReportItem, value: string) => {
    setItem(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // For categories with subcategories, ensure there's a subcategory
    if ((activeCategory === "diagnosis" || activeCategory === "extremity" || 
         activeCategory === "treatment" || activeCategory === "homecare" ||
         activeCategory === "exercises") && 
        !item.subcategoryId && 
        availableSubcategories.length > 0) {
      setItem(prev => ({ 
        ...prev, 
        subcategoryId: availableSubcategories[0].id 
      }));
    }
    
    onSaveItem(item);
  };

  return (
    <div className="grid gap-4 py-4">
      <FormFields
        item={item}
        handleChange={handleChange}
        isSubmitting={isSubmitting}
        availableSubcategories={availableSubcategories}
      />
      <FormActions
        isSubmitting={isSubmitting}
        setIsDialogOpen={setIsDialogOpen}
        handleSave={handleSave}
        isEditing={!!editingItem}
      />
    </div>
  );
};
