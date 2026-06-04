
import { useState, useEffect, useCallback } from "react";
import { ReportSetting, fetchSettings } from "@/services/reportSettingsService";

export const useReportSettings = (connectionStatus: "checking" | "connected" | "disconnected") => {
  const [settings, setSettings] = useState<ReportSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSettings = useCallback(async () => {
    if (connectionStatus !== "connected") {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching report settings...");
      const data = await fetchSettings();
      console.log("Fetched settings:", data);
      setSettings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while fetching settings");
      console.error("Error fetching settings:", err);
    } finally {
      setLoading(false);
    }
  }, [connectionStatus]);

  // Load settings on initial render and when connection status changes
  useEffect(() => {
    loadSettings();
  }, [connectionStatus, loadSettings]);

  return { 
    settings, 
    loading, 
    error, 
    setSettings, 
    reloadSettings: loadSettings 
  };
};
