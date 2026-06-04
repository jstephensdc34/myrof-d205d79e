
// This file is for backward compatibility and redirects to the refactored hooks

import { CategoryType } from "@/types";
import { useLibraryCategories } from './useLibraryCategories';
import { useLibraryItems } from './useLibraryItems';

export const useLibraryData = (initialCategory: CategoryType = "diagnosis") => {
  const {
    activeCategory,
    setActiveCategory,
    activeSubcategory,
    setActiveSubcategory,
    categories,
    subcategories,
    getCategoryName,
    getSubcategoriesForCategory
  } = useLibraryCategories(initialCategory);

  const {
    items,
    setItems,
    isLoading
  } = useLibraryItems(activeCategory, activeSubcategory);

  return {
    activeCategory,
    setActiveCategory,
    activeSubcategory,
    setActiveSubcategory,
    items,
    setItems,
    categories,
    subcategories,
    isLoading,
    getCategoryName,
    getSubcategoriesForCategory
  };
};
