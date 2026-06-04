
import { ReportItem, CategoryType } from "@/types";
import { ItemFormDialog } from "./form/ItemFormDialog";

interface Subcategory {
  id: string;
  name: string;
  parentCategoryId?: string;
  description?: string;
}

interface ItemFormProps {
  activeCategory: CategoryType;
  onSaveItem: (item: Partial<ReportItem> | ReportItem) => void;
  editingItem: ReportItem | null;
  isDialogOpen: boolean;
  setIsDialogOpen: (isOpen: boolean) => void;
  isSubmitting?: boolean;
  availableSubcategories: Subcategory[];
}

export const ItemForm = (props: ItemFormProps) => {
  return <ItemFormDialog {...props} />;
};
