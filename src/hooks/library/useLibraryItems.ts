
import { useState, useEffect } from "react";
import { ReportItem, CategoryType } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { fetchItemsByCategory } from "@/services/library";

export const useLibraryItems = (
  activeCategory: CategoryType,
  activeSubcategory: string | null
) => {
  const [items, setItems] = useState<ReportItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { toast } = useToast();

  // Fetch items when category or subcategory changes
  useEffect(() => {
    const loadItems = async () => {
      setIsLoading(true);
      try {
        const fetchedItems = await fetchItemsByCategory(activeCategory, activeSubcategory || undefined);
        setItems(fetchedItems);
      } catch (error) {
        console.error("Error fetching items:", error);
        toast({
          title: "Error",
          description: "Failed to load library items.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadItems();
  }, [activeCategory, activeSubcategory, toast]);

  return {
    items,
    setItems,
    isLoading
  };
};
