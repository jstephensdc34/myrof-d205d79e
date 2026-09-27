import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthContext";

/**
 * Checks the database is reachable. Library tables require a signed-in user,
 * so the probe only runs with a session; permission errors are not treated as
 * a disconnect (the user simply needs to sign in again).
 */
export const useSupabaseConnection = () => {
  const { isAuthenticated } = useAuth();
  const [connectionStatus, setConnectionStatus] = useState<"checking" | "connected" | "disconnected">("checking");

  useEffect(() => {
    if (!isAuthenticated) {
      setConnectionStatus("checking");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const { error } = await supabase
          .from("library_categories")
          .select("id", { head: true, count: "exact" })
          .limit(1);
        if (cancelled) return;
        if (error && error.code !== "42501" && error.code !== "PGRST301") throw error;
        setConnectionStatus("connected");
      } catch (error) {
        if (cancelled) return;
        console.error("Database connection error:", error);
        setConnectionStatus("disconnected");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  return { isAuthenticated, connectionStatus };
};
