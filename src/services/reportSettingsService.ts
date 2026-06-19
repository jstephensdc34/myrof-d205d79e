
import { supabase } from "@/integrations/supabase/client";

export interface ReportSetting {
  id: string;
  name: string;
  value: string;
  created_at: string;
}

export const fetchSettings = async (): Promise<ReportSetting[]> => {
  const { data, error } = await supabase
    .from("report_settings")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching report settings:", error);
    throw new Error(error.message);
  }

  return data || [];
};

export const createSetting = async (name: string, value: string): Promise<ReportSetting> => {
  // Validate inputs before sending to Supabase
  if (!name.trim()) {
    throw new Error("Setting name cannot be empty");
  }
  
  // Check authentication before attempting to create
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) {
    throw new Error("Authentication required to create settings");
  }
  
  const { data, error } = await supabase
    .from("report_settings")
    .insert({ name, value })
    .select()
    .single();

  if (error) {
    console.error("Error creating report setting:", error);
    if (error.code === "PGRST301" || error.code === "42501") {
      throw new Error("Authentication required to create settings");
    }
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Failed to create setting: No data returned");
  }

  return data;
};

export const updateSetting = async (nameOrId: string, value: string): Promise<ReportSetting> => {
  // Validate inputs
  if (!nameOrId.trim()) {
    throw new Error("Setting name or ID cannot be empty");
  }
  
  // Check authentication before attempting to update
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) {
    throw new Error("Authentication required to update settings");
  }
  
  // First, try to get the setting by name
  const { data: existingSettings } = await supabase
    .from("report_settings")
    .select("*")
    .eq("name", nameOrId);
    
  if (existingSettings && existingSettings.length > 0) {
    // If found by name, update using the ID
    const settingId = existingSettings[0].id;
    
    const { data, error } = await supabase
      .from("report_settings")
      .update({ value })
      .eq("id", settingId)
      .select()
      .single();

    if (error) {
      console.error("Error updating report setting:", error);
      if (error.code === "PGRST301" || error.code === "42501") {
        throw new Error("Authentication required to update settings");
      }
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error("Failed to update setting: No data returned");
    }

    return data;
  } else {
    // If not found by name, try to update by ID (in case nameOrId is actually an ID)
    const { data, error } = await supabase
      .from("report_settings")
      .update({ value })
      .eq("id", nameOrId)
      .select()
      .single();

    if (error) {
      console.error("Error updating report setting:", error);
      if (error.code === "PGRST301" || error.code === "42501") {
        throw new Error("Authentication required to update settings");
      }
      throw new Error(`Setting with name or ID "${nameOrId}" not found`);
    }

    if (!data) {
      throw new Error("Failed to update setting: No data returned");
    }

    return data;
  }
};

export const deleteSetting = async (id: string): Promise<void> => {
  if (!id.trim()) {
    throw new Error("Setting ID cannot be empty");
  }
  
  // Check authentication before attempting to delete
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) {
    throw new Error("Authentication required to delete settings");
  }
  
  const { error } = await supabase
    .from("report_settings")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting report setting:", error);
    if (error.code === "PGRST301" || error.code === "42501") {
      throw new Error("Authentication required to delete settings");
    }
    throw new Error(error.message);
  }
};

// Upsert by name: updates if a row with that name exists, otherwise creates it.
export const upsertSettingByName = async (
  name: string,
  value: string
): Promise<ReportSetting> => {
  if (!name.trim()) {
    throw new Error("Setting name cannot be empty");
  }

  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) {
    throw new Error("Authentication required to save settings");
  }

  const { data: existing } = await supabase
    .from("report_settings")
    .select("id")
    .eq("name", name)
    .maybeSingle();

  if (existing?.id) {
    return updateSetting(existing.id, value);
  }

  return createSetting(name, value);
};
