
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ReportItem } from "@/types";
import { fetchItemsByCategory, fetchSubcategories } from "@/services/library";
import { useAuth } from "@/components/auth/AuthContext";

export const useReportData = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [items, setItems] = useState<ReportItem[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch subcategories on component mount
  useEffect(() => {
    const loadSubcategories = async () => {
      try {
        const fetchedSubcategories = await fetchSubcategories();
        setSubcategories(fetchedSubcategories);
      } catch (error) {
        console.error("Error loading subcategories:", error);
        toast({
          title: "Error",
          description: "Failed to load subcategories.",
          variant: "destructive",
        });
      }
    };
    
    loadSubcategories();
  }, [toast]);
  
  // Fetch items for all categories
  useEffect(() => {
    const loadAllItems = async () => {
      setIsLoading(true);
      try {
        const allCategories = ["diagnosis", "extremity", "treatment", "homecare", "exercises"];
        const promises = allCategories.map(category => fetchItemsByCategory(category));
        const results = await Promise.all(promises);
        
        // Combine all items from all categories
        const allItems = results.flat();
        setItems(allItems);
      } catch (error) {
        console.error("Error fetching items:", error);
        toast({
          title: "Error",
          description: "Failed to load report items.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) {
      loadAllItems();
    }
  }, [user, toast]);

  return {
    items,
    subcategories,
    isLoading
  };
};
