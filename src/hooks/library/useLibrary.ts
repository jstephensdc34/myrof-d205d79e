
import { CategoryType } from "@/types";
import { useLibraryCategories } from './useLibraryCategories';
import { useLibraryItems } from './useLibraryItems';
import { useLibraryDialog } from './useLibraryDialog';

export const useLibrary = (initialCategory: CategoryType = "diagnosis") => {
  const {
    activeCategory,
    setActiveCategory,
    activeSubcategory,
    setActiveSubcategory,
    getCategoryName,
    getSubcategoriesForCategory,
    categories,
    subcategories
  } = useLibraryCategories(initialCategory);

  const {
    items,
    setItems,
    isLoading,
  } = useLibraryItems(activeCategory, activeSubcategory);

  const {
    isDialogOpen,
    setIsDialogOpen,
    editingItem,
    setEditingItem,
    isSubmitting,
    handleSaveItem,
    handleDeleteItem,
    handleEditItem,
    handleAddNewItem
  } = useLibraryDialog(items, setItems, activeCategory, activeSubcategory, getCategoryName);

  const handleSubcategoryClick = (subcategoryId: string) => {
    setActiveSubcategory(subcategoryId);
  };

  return {
    activeCategory,
    setActiveCategory,
    activeSubcategory,
    items,
    categories,
    subcategories,
    isDialogOpen,
    setIsDialogOpen,
    editingItem,
    setEditingItem,
    isLoading,
    isSubmitting,
    handleSaveItem,
    handleDeleteItem,
    handleEditItem,
    handleSubcategoryClick,
    getCategoryName,
    getSubcategoriesForCategory,
    handleAddNewItem
  };
};
