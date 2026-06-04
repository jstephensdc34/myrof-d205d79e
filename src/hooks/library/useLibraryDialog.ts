
import { useState } from "react";
import { ReportItem, CategoryType } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/components/auth/AuthContext";
import { createItem, updateItem, deleteItem } from "@/services/library";

export const useLibraryDialog = (
  items: ReportItem[],
  setItems: React.Dispatch<React.SetStateAction<ReportItem[]>>,
  activeCategory: CategoryType,
  activeSubcategory: string | null,
  getCategoryName: (categoryId: string) => string
) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ReportItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();

  const handleSaveItem = async (item: Partial<ReportItem> | ReportItem) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save items to the library.",
        variant: "destructive",
      });
      return;
    }
    
    if (!user || !user.id) {
      toast({
        title: "User Error",
        description: "Could not determine user identity. Please log in again.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      if ('id' in item && item.id) {
        // Update existing item
        const updatedItem = await updateItem(item as ReportItem, user.id);
        setItems(prevItems => prevItems.map(existingItem => 
          existingItem.id === (item as ReportItem).id ? updatedItem : existingItem
        ));
        
        toast({
          title: "Item Updated",
          description: `${updatedItem.name} has been updated successfully.`
        });
      } else if (item.name && item.description) {
        // Create new item
        const newItemData: Omit<ReportItem, "id"> = {
          name: item.name,
          definition: item.definition,
          description: item.description,
          infoLink: item.infoLink,
          categoryId: activeCategory,
          subcategoryId: (activeCategory === "diagnosis" || activeCategory === "extremity" || 
                          activeCategory === "treatment" || activeCategory === "homecare" ||
                          activeCategory === "exercises") 
            ? item.subcategoryId || activeSubcategory || undefined
            : undefined
        };
        
        const createdItem = await createItem(newItemData, user.id);
        setItems([...items, createdItem]);
        
        toast({
          title: "Item Added",
          description: `${createdItem.name} has been added to ${getCategoryName(activeCategory)}.`
        });
      }
    } catch (error) {
      console.error("Error saving item:", error);
      toast({
        title: "Error",
        description: "Failed to save the item. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setEditingItem(null);
      setIsDialogOpen(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to delete items from the library.",
        variant: "destructive",
      });
      return;
    }
    
    const itemToDelete = items.find(item => item.id === id);
    if (!itemToDelete) {
      toast({
        title: "Error",
        description: "Item not found. It may have already been deleted.",
        variant: "destructive",
      });
      return;
    }
    
    console.log("useLibraryDialog: Starting delete operation for item:", id);
    
    try {
      // Delete from database 
      await deleteItem(id);
      console.log("useLibraryDialog: Database deletion successful for item:", id);
      
      // After successful deletion, update the local state
      setItems(prevItems => {
        const newItems = prevItems.filter(item => item.id !== id);
        console.log(`useLibraryDialog: Updated state. Removed item ${id}. Items count before: ${prevItems.length}, after: ${newItems.length}`);
        return newItems;
      });
      
      console.log("useLibraryDialog: Delete operation completed successfully");
    } catch (error) {
      console.error("useLibraryDialog: Error deleting item:", error);
      
      toast({
        title: "Error",
        description: "Failed to delete the item. Please try again.",
        variant: "destructive",
      });
      
      // Re-throw the error so the component can handle it
      throw error;
    }
  };

  const handleEditItem = (item: ReportItem) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to edit items in the library.",
        variant: "destructive",
      });
      return;
    }
    
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleAddNewItem = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add items to the library.",
        variant: "destructive",
      });
      return;
    }
    
    setEditingItem(null);
    setIsDialogOpen(true);
  };

  return {
    isDialogOpen,
    setIsDialogOpen,
    editingItem,
    setEditingItem,
    isSubmitting,
    handleSaveItem,
    handleDeleteItem,
    handleEditItem,
    handleAddNewItem
  };
};
