
// This file is kept for backward compatibility
// It imports from the new refactored hook structure

import { CategoryType } from "@/types";
import { useLibrary as useRefactoredLibrary } from "./library";

export const useLibrary = (initialCategory: CategoryType = "diagnosis") => {
  return useRefactoredLibrary(initialCategory);
};
