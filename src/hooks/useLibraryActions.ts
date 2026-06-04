
// This file is kept for backward compatibility
// It imports from the new refactored hook structure

import { ReportItem, CategoryType } from "@/types";
import { useLibraryActions as useRefactoredLibraryActions } from "./library";

export const useLibraryActions = (
  items: ReportItem[],
  setItems: React.Dispatch<React.SetStateAction<ReportItem[]>>,
  activeCategory: CategoryType,
  activeSubcategory: string | null,
  getCategoryName: (categoryId: string) => string
) => {
  return useRefactoredLibraryActions(items, setItems, activeCategory, activeSubcategory, getCategoryName);
};
