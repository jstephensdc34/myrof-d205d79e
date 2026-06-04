
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthContext";

export const useSupabaseConnection = () => {
  const { isAuthenticated } = useAuth();
  const [connectionStatus, setConnectionStatus] = useState<"checking" | "connected" | "disconnected">("checking");

  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Try to ping the library_categories table as it's public
        const { data, error } = await supabase
          .from("library_categories")
          .select("count")
          .limit(1);
          
        if (error) {
          throw error;
        }
        
        setConnectionStatus("connected");
      } catch (error) {
        console.error("Database connection error:", error);
        setConnectionStatus("disconnected");
      }
    };

    checkConnection();
  }, []);

  return { isAuthenticated, connectionStatus };
};
