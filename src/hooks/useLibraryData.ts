
// This file is kept for backward compatibility
// It imports from the new refactored hook structure

import { CategoryType } from "@/types";
import { useLibraryData as useRefactoredLibraryData } from "./library";

export const useLibraryData = (initialCategory: CategoryType = "diagnosis") => {
  return useRefactoredLibraryData(initialCategory);
};
