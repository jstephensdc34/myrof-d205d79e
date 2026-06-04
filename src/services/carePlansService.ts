import { supabase } from "@/integrations/supabase/client";
import { CategoryType } from "@/types";

export interface CarePlanRow {
  id: string;
  user_id: string;
  title: string;
  is_draft: boolean;
  patient_name: string | null;
  report_date: string | null;
  selected_item_ids: string[];
  additional_notes: string | null;
  custom_treatment_goals: string | null;
  active_category: string | null;
  created_at: string;
  updated_at: string;
}

export interface CarePlanPayload {
  title?: string;
  is_draft?: boolean;
  patient_name: string | null;
  report_date: string | null;
  selected_item_ids: string[];
  additional_notes: string | null;
  custom_treatment_goals: string | null;
  active_category: CategoryType | null;
}

const fromRow = (row: any): CarePlanRow => ({
  ...row,
  selected_item_ids: Array.isArray(row.selected_item_ids) ? row.selected_item_ids : [],
});

export const listSavedCarePlans = async (): Promise<CarePlanRow[]> => {
  const { data, error } = await supabase
    .from("care_plans")
    .select("*")
    .eq("is_draft", false)
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(fromRow);
};

export const getMyDraft = async (): Promise<CarePlanRow | null> => {
  const { data: userData } = await supabase.auth.getUser();
  const uid = userData.user?.id;
  if (!uid) return null;
  const { data, error } = await supabase
    .from("care_plans")
    .select("*")
    .eq("user_id", uid)
    .eq("is_draft", true)
    .maybeSingle();
  if (error) throw error;
  return data ? fromRow(data) : null;
};

export const upsertDraft = async (payload: CarePlanPayload): Promise<CarePlanRow | null> => {
  const { data: userData } = await supabase.auth.getUser();
  const uid = userData.user?.id;
  if (!uid) return null;

  const existing = await getMyDraft();
  if (existing) {
    const { data, error } = await supabase
      .from("care_plans")
      .update({
        patient_name: payload.patient_name,
        report_date: payload.report_date,
        selected_item_ids: payload.selected_item_ids as any,
        additional_notes: payload.additional_notes,
        custom_treatment_goals: payload.custom_treatment_goals,
        active_category: payload.active_category,
      })
      .eq("id", existing.id)
      .select()
      .single();
    if (error) throw error;
    return fromRow(data);
  }

  const { data, error } = await supabase
    .from("care_plans")
    .insert({
      user_id: uid,
      title: "Auto-saved draft",
      is_draft: true,
      patient_name: payload.patient_name,
      report_date: payload.report_date,
      selected_item_ids: payload.selected_item_ids as any,
      additional_notes: payload.additional_notes,
      custom_treatment_goals: payload.custom_treatment_goals,
      active_category: payload.active_category,
    })
    .select()
    .single();
  if (error) throw error;
  return fromRow(data);
};

export const saveNamedCarePlan = async (
  title: string,
  payload: CarePlanPayload,
  existingId?: string
): Promise<CarePlanRow> => {
  const { data: userData } = await supabase.auth.getUser();
  const uid = userData.user?.id;
  if (!uid) throw new Error("You must be signed in to save care plans.");

  if (existingId) {
    const { data, error } = await supabase
      .from("care_plans")
      .update({
        title,
        is_draft: false,
        patient_name: payload.patient_name,
        report_date: payload.report_date,
        selected_item_ids: payload.selected_item_ids as any,
        additional_notes: payload.additional_notes,
        custom_treatment_goals: payload.custom_treatment_goals,
        active_category: payload.active_category,
      })
      .eq("id", existingId)
      .select()
      .single();
    if (error) throw error;
    return fromRow(data);
  }

  const { data, error } = await supabase
    .from("care_plans")
    .insert({
      user_id: uid,
      title,
      is_draft: false,
      patient_name: payload.patient_name,
      report_date: payload.report_date,
      selected_item_ids: payload.selected_item_ids as any,
      additional_notes: payload.additional_notes,
      custom_treatment_goals: payload.custom_treatment_goals,
      active_category: payload.active_category,
    })
    .select()
    .single();
  if (error) throw error;
  return fromRow(data);
};

export const deleteCarePlan = async (id: string): Promise<void> => {
  const { error } = await supabase.from("care_plans").delete().eq("id", id);
  if (error) throw error;
};

export const renameCarePlan = async (id: string, title: string): Promise<void> => {
  const { error } = await supabase.from("care_plans").update({ title }).eq("id", id);
  if (error) throw error;
};
