
import { supabase } from "@/integrations/supabase/client";
import { Subcategory } from "@/types";

// Fetch all subcategories
export const fetchSubcategories = async (): Promise<Subcategory[]> => {
  const { data, error } = await supabase
    .from("library_subcategories")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching subcategories:", error);
    throw error;
  }

  return data.map(item => ({
    id: item.id,
    name: item.name,
    parentCategoryId: item.parent_category_id,
    description: item.description
  }));
};

// Mock data - would be replaced with Supabase fetch
export const mockSubcategories: Subcategory[] = [
  { id: "general_diagnosis", name: "General Diagnosis", parentCategoryId: "diagnosis", description: "General spinal conditions" },
  { id: "cervical_diagnosis", name: "Cervical Diagnosis", parentCategoryId: "diagnosis", description: "Neck region conditions" },
  { id: "thoracic_diagnosis", name: "Thoracic Diagnosis", parentCategoryId: "diagnosis", description: "Mid-back conditions" },
  { id: "lumbopelvic_diagnosis", name: "Lumbopelvic Diagnosis", parentCategoryId: "diagnosis", description: "Low back and pelvic conditions" },
  // Extremity subcategories
  { id: "shoulder", name: "Shoulder", parentCategoryId: "extremity", description: "Shoulder conditions" },
  { id: "elbow", name: "Elbow", parentCategoryId: "extremity", description: "Elbow conditions" },
  { id: "wrist_hand", name: "Wrist & Hand", parentCategoryId: "extremity", description: "Wrist and hand conditions" },
  { id: "hip", name: "Hip", parentCategoryId: "extremity", description: "Hip conditions" },
  { id: "knee", name: "Knee", parentCategoryId: "extremity", description: "Knee conditions" },
  { id: "ankle_foot", name: "Ankle & Foot", parentCategoryId: "extremity", description: "Ankle and foot conditions" },
  // Treatment plan subcategories
  { id: "care_plan_type", name: "Care Plan Type", parentCategoryId: "treatment", description: "Types of care plans" },
  { id: "treatment_modalities", name: "Treatment Modalities", parentCategoryId: "treatment", description: "Treatment techniques and approaches" },
  { id: "treatment_goals", name: "Treatment Goals", parentCategoryId: "treatment", description: "Objectives of the treatment" },
  // Home care subcategories
  { id: "home_therapy", name: "Home Therapy", parentCategoryId: "homecare", description: "Self-administered therapeutic techniques" },
  { id: "adls", name: "ADLs", parentCategoryId: "homecare", description: "Activities of Daily Living modifications" },
  { id: "activity_modification", name: "Activity Modification", parentCategoryId: "homecare", description: "Recommendations for modifying daily activities" },
  { id: "condition_specific", name: "Condition Specific", parentCategoryId: "homecare", description: "Recommendations specific to certain conditions" },
  { id: "wellness", name: "Wellness", parentCategoryId: "homecare", description: "General health and wellness recommendations" },
  // Exercises subcategories
  { id: "cervical_exercises", name: "Cervical", parentCategoryId: "exercises", description: "Neck exercises" },
  { id: "thoracic_exercises", name: "Thoracic", parentCategoryId: "exercises", description: "Mid-back exercises" },
  { id: "lumbopelvic_exercises", name: "Lumbopelvic", parentCategoryId: "exercises", description: "Low back and pelvic exercises" },
  { id: "lower_extremity_exercises", name: "Lower Extremity", parentCategoryId: "exercises", description: "Leg and foot exercises" },
  { id: "upper_extremity_exercises", name: "Upper Extremity", parentCategoryId: "exercises", description: "Arm and shoulder exercises" }
];
