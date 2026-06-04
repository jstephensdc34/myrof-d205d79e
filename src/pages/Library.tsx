
import { Navbar } from "@/components/layout/Navbar";
import { ItemForm } from "@/components/library/ItemForm";
import { LibraryHeader } from "@/components/library/LibraryHeader";
import { LibraryContent } from "@/components/library/LibraryContent";
import { LoadingState } from "@/components/library/LoadingState";
import { useLibrary } from "@/hooks/useLibrary";

const Library = () => {
  const {
    activeCategory,
    setActiveCategory,
    activeSubcategory,
    items,
    categories,
    isDialogOpen,
    setIsDialogOpen,
    editingItem,
    isLoading,
    isSubmitting,
    handleSaveItem,
    handleDeleteItem,
    handleEditItem,
    handleSubcategoryClick,
    getCategoryName,
    getSubcategoriesForCategory,
    handleAddNewItem
  } = useLibrary();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <LibraryHeader 
          onAddNewItem={handleAddNewItem} 
          isSubmitting={isSubmitting} 
        />

        {categories.length > 0 ? (
          <LibraryContent
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            activeSubcategory={activeSubcategory}
            onSubcategoryClick={handleSubcategoryClick}
            isLoading={isLoading}
            items={items}
            onEdit={handleEditItem}
            onDelete={handleDeleteItem}
            getCategoryName={getCategoryName}
            getSubcategoriesForCategory={getSubcategoriesForCategory}
          />
        ) : (
          <LoadingState message="Loading categories..." />
        )}

        <ItemForm 
          activeCategory={activeCategory}
          onSaveItem={handleSaveItem}
          editingItem={editingItem}
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          isSubmitting={isSubmitting}
          availableSubcategories={getSubcategoriesForCategory(activeCategory)}
        />
      </div>
    </div>
  );
};

export default Library;
