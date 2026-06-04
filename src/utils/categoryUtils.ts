
// Mapping of category IDs to display names
export const categoryNames: Record<string, string> = {
  diagnosis: "Spinal Diagnosis",
  extremity: "Extremity Diagnosis",
  treatment: "Treatment Plan",
  homecare: "Home Care",
  exercises: "Therapeutic Exercises"
};

// Special ordering for diagnosis subcategories
export const getOrderedSubcategories = (categoryId: string, subcategories: any[]) => {
  const categorySubs = subcategories.filter(subcat => subcat.parentCategoryId === categoryId);
  
  // Special ordering for diagnosis subcategories
  if (categoryId === "diagnosis") {
    // Define the desired order
    const diagnosisOrder = [
      "general_diagnosis",
      "cervical_diagnosis",
      "thoracic_diagnosis",
      "lumbopelvic_diagnosis"
    ];
    
    // Sort according to the defined order
    return categorySubs.sort((a, b) => {
      const indexA = diagnosisOrder.indexOf(a.id);
      const indexB = diagnosisOrder.indexOf(b.id);
      return indexA - indexB;
    });
  }
  
  // Special ordering for extremity subcategories
  if (categoryId === "extremity") {
    // Define the desired order
    const extremityOrder = [
      "shoulder",
      "elbow",
      "wrist_hand",
      "hip",
      "knee",
      "ankle_foot"
    ];
    
    // Sort according to the defined order
    return categorySubs.sort((a, b) => {
      const indexA = extremityOrder.indexOf(a.id);
      const indexB = extremityOrder.indexOf(b.id);
      return indexA - indexB;
    });
  }
  
  // Special ordering for treatment subcategories
  if (categoryId === "treatment") {
    // Define the desired order
    const treatmentOrder = [
      "care_plan_type",
      "phase_of_care",
      "treatment_modalities",
      "treatment_goals"
    ];
    
    // Sort according to the defined order
    return categorySubs.sort((a, b) => {
      const indexA = treatmentOrder.indexOf(a.id);
      const indexB = treatmentOrder.indexOf(b.id);
      return indexA - indexB;
    });
  }
  
  // Special ordering for homecare subcategories
  if (categoryId === "homecare") {
    // Define the desired order
    const homecareOrder = [
      "home_therapy",
      "adls",
      "activity_modification",
      "condition_specific",
      "wellness"
    ];
    
    // Sort according to the defined order
    return categorySubs.sort((a, b) => {
      const indexA = homecareOrder.indexOf(a.id);
      const indexB = homecareOrder.indexOf(b.id);
      return indexA - indexB;
    });
  }
  
  // Special ordering for exercises subcategories
  if (categoryId === "exercises") {
    // Define the desired order
    const exercisesOrder = [
      "general_exercises",
      "cervical_exercises",
      "thoracic_exercises",
      "lumbopelvic_exercises",
      "upper_extremity_exercises",
      "lower_extremity_exercises"
    ];
    
    // Sort according to the defined order
    return categorySubs.sort((a, b) => {
      const indexA = exercisesOrder.indexOf(a.id);
      const indexB = exercisesOrder.indexOf(b.id);
      return indexA - indexB;
    });
  }
  
  return categorySubs;
};

// Get default subcategory based on category
export const getDefaultSubcategory = (categoryId: string): string | null => {
  switch (categoryId) {
    case "diagnosis":
      return "general_diagnosis";
    case "extremity":
      return "shoulder";
    case "treatment":
      return "care_plan_type";
    case "homecare":
      return "home_therapy";
    case "exercises":
      return "general_exercises";
    default:
      return null;
  }
};
