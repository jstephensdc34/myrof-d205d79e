
import { supabase } from "@/integrations/supabase/client";
import { Category } from "@/types";

// Fetch all categories
export const fetchCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from("library_categories")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }

  return data.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description
  }));
};

// Mock data - would be replaced with Supabase fetch
export const mockCategories: Category[] = [
  { id: "diagnosis", name: "Spinal Diagnosis", description: "Clinical diagnoses" },
  { id: "extremity", name: "Extremity Diagnosis", description: "Diagnoses for extremities" },
  { id: "treatment", name: "Treatment Plan", description: "In-office procedures" },
  { id: "homecare", name: "Home Care", description: "At-home recommendations" },
  { id: "exercises", name: "Therapeutic Exercises", description: "Rehabilitative movements" }
];
