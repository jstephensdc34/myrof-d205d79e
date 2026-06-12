import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type DatabaseReadyState = "checking" | "ready" | "not-ready";

/**
 * Probes a known table (library_categories) to detect whether setup.sql has
 * been run on the buyer's Supabase project. Returns "not-ready" on
 * relation-does-not-exist (42P01) or PostgREST 404, "ready" otherwise.
 */
export function useDatabaseReady(): {
  state: DatabaseReadyState;
  errorMessage?: string;
} {
  const [state, setState] = useState<DatabaseReadyState>("checking");
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { error } = await supabase
          .from("library_categories")
          .select("id", { count: "exact", head: true });

        if (cancelled) return;

        if (!error) {
          setState("ready");
          return;
        }

        const code = (error as { code?: string }).code;
        const status = (error as { status?: number }).status;
        const msg = error.message || "";

        if (
          code === "42P01" ||
          status === 404 ||
          /relation .* does not exist/i.test(msg) ||
          /not found/i.test(msg)
        ) {
          setErrorMessage(msg);
          setState("not-ready");
        } else {
          // Some other transient error — don't block the app on this.
          setState("ready");
        }
      } catch (err) {
        if (cancelled) return;
        // Network error etc. — let the app render and surface its own errors.
        setState("ready");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { state, errorMessage };
}