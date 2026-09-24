
import { supabase } from "@/integrations/supabase/client";

export interface ReportSetting {
  id: string;
  name: string;
  value: string;
  created_at: string;
}

const currentUserId = async (): Promise<string> => {
  const { data } = await supabase.auth.getSession();
  if (!data.session) throw new Error("Authentication required to save settings");
  return data.session.user.id;
};

// Returns one row per setting name: the user's own row wins over the shared default.
export const fetchSettings = async (): Promise<ReportSetting[]> => {
  const { data, error } = await supabase.from("report_settings").select("*").order("name");
  if (error) {
    console.error("Error fetching report settings:", error);
    throw new Error(error.message);
  }
  const byName = new Map<string, any>();
  for (const row of data || []) {
    const existing = byName.get(row.name);
    if (!existing || (existing.user_id === null && row.user_id !== null)) byName.set(row.name, row);
  }
  return Array.from(byName.values());
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
    .insert({ name, value, user_id: sessionData.session.user.id })
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

// Saves a setting for the signed-in user. Accepts a setting name or a row id.
// Shared defaults are never modified; the user gets their own copy instead.
export const updateSetting = async (nameOrId: string, value: string): Promise<ReportSetting> => {
  if (!nameOrId.trim()) throw new Error("Setting name or ID cannot be empty");
  const userId = await currentUserId();

  let name = nameOrId;
  const { data: byId } = await supabase
    .from("report_settings").select("name").eq("id", nameOrId).maybeSingle();
  if (byId?.name) name = byId.name;

  const { data: own } = await supabase
    .from("report_settings").select("id").eq("name", name).eq("user_id", userId).maybeSingle();

  if (own?.id) {
    const { data, error } = await supabase
      .from("report_settings").update({ value }).eq("id", own.id).select().single();
    if (error || !data) throw new Error(error?.message || "Failed to update setting");
    return data;
  }
  return createSetting(name, value);
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

// Upsert by name for the signed-in user.
export const upsertSettingByName = async (name: string, value: string): Promise<ReportSetting> => {
  if (!name.trim()) throw new Error("Setting name cannot be empty");
  return updateSetting(name, value);
};
