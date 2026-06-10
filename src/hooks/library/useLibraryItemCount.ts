import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Returns the total row count of public.library_items.
 * Cheap: uses `head: true, count: 'exact'` so no rows are transferred.
 * `refresh()` lets callers invalidate after a bulk import.
 */
export const useLibraryItemCount = () => {
  const [count, setCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    const { count, error } = await supabase
      .from("library_items")
      .select("*", { count: "exact", head: true });
    if (error) {
      console.error("useLibraryItemCount:", error);
      setCount(null);
    } else {
      setCount(count ?? 0);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { count, isLoading, refresh: load };
};