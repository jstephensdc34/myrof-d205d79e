
// This file is for backward compatibility and redirects to the refactored hooks

import { ReportItem, CategoryType } from "@/types";
import { useLibraryDialog } from './useLibraryDialog';

export const useLibraryActions = (
  items: ReportItem[],
  setItems: React.Dispatch<React.SetStateAction<ReportItem[]>>,
  activeCategory: CategoryType,
  activeSubcategory: string | null,
  getCategoryName: (categoryId: string) => string
) => {
  return useLibraryDialog(items, setItems, activeCategory, activeSubcategory, getCategoryName);
};
