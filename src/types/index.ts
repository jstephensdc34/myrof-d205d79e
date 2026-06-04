
export interface ReportItem {
  id: string;
  name: string;
  definition?: string;
  description: string;
  infoLink?: string;
  categoryId: string;
  subcategoryId?: string;
}

export interface Category {
  id: string;
  name: string;
  parentId?: string | null;
  description?: string;
}

export interface Subcategory {
  id: string;
  name: string;
  parentCategoryId: string;
  description?: string;
}

export interface PatientInfo {
  name: string;
  age?: number;
  gender?: string;
  date: string;
}

export interface ReportData {
  patient: PatientInfo;
  selectedItems: ReportItem[];
  notes?: string;
}

export interface PDFReportData {
  patient: PatientInfo;
  selectedItems: ReportItem[];
  notes: string;
  customTreatmentGoals?: string;
  estimatedCost?: string;
  settings: ReportSetting[];
  subcategories: Subcategory[];
}

export type CategoryType = 'diagnosis' | 'extremity' | 'treatment' | 'homecare' | 'exercises';

export const MAIN_CATEGORIES: CategoryType[] = ['diagnosis', 'extremity', 'treatment', 'homecare', 'exercises'];

export const DIAGNOSIS_SUBCATEGORIES = [
  'general_diagnosis',
  'cervical_diagnosis',
  'thoracic_diagnosis',
  'lumbopelvic_diagnosis'
];

export const EXTREMITY_SUBCATEGORIES = [
  'shoulder',
  'elbow',
  'wrist_hand',
  'hip',
  'knee',
  'ankle_foot'
];

export const TREATMENT_SUBCATEGORIES = [
  'care_plan_type',
  'phase_of_care',
  'treatment_modalities',
  'treatment_goals'
];

export const HOMECARE_SUBCATEGORIES = [
  'home_therapy',
  'adls',
  'activity_modification',
  'condition_specific',
  'wellness'
];

export const EXERCISES_SUBCATEGORIES = [
  'general_exercises',
  'cervical_exercises',
  'thoracic_exercises',
  'lumbopelvic_exercises',
  'lower_extremity_exercises',
  'upper_extremity_exercises'
];

// Updated ReportSetting interface to match the one in reportSettingsService.ts
export interface ReportSetting {
  id: string;
  name: string;
  value: string;
  created_at: string;
}

