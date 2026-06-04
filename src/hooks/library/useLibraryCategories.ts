
import { useState, useEffect } from "react";
import { CategoryType, Category, Subcategory } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { fetchCategories, fetchSubcategories } from "@/services/library";

export const useLibraryCategories = (initialCategory: CategoryType = "diagnosis") => {
  const [activeCategory, setActiveCategory] = useState<CategoryType>(initialCategory);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>("general_diagnosis");
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  
  const { toast } = useToast();

  // Fetch categories and subcategories on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [fetchedCategories, fetchedSubcategories] = await Promise.all([
          fetchCategories(),
          fetchSubcategories()
        ]);
        
        setCategories(fetchedCategories);
        setSubcategories(fetchedSubcategories);
      } catch (error) {
        console.error("Error loading initial data:", error);
        toast({
          title: "Error",
          description: "Failed to load categories and subcategories.",
          variant: "destructive",
        });
      }
    };
    
    loadInitialData();
  }, [toast]);

  // Reset subcategory selection when category changes
  useEffect(() => {
    if (activeCategory === "diagnosis") {
      setActiveSubcategory("general_diagnosis");
    } else if (activeCategory === "extremity") {
      setActiveSubcategory("shoulder");
    } else if (activeCategory === "treatment") {
      setActiveSubcategory("care_plan_type");
    } else if (activeCategory === "homecare") {
      setActiveSubcategory("home_therapy");
    } else if (activeCategory === "exercises") {
      setActiveSubcategory("general_exercises");
    } else {
      setActiveSubcategory(null);
    }
  }, [activeCategory]);

  const getCategoryName = (categoryId: string): string => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : "Unknown Category";
  };

  const getSubcategoriesForCategory = (categoryId: string) => {
    return subcategories.filter(subcat => subcat.parentCategoryId === categoryId);
  };

  return {
    activeCategory,
    setActiveCategory,
    activeSubcategory,
    setActiveSubcategory,
    categories,
    subcategories,
    getCategoryName,
    getSubcategoriesForCategory
  };
};
