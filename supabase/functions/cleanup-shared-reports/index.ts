// Deletes shared-report HTML files older than RETENTION_DAYS (default 90).
// Invoked on a schedule by pg_cron via pg_net.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const RETENTION_DAYS = 90;
const BUCKET = "shared-reports";

Deno.serve(async () => {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const cutoff = Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000;
    const toDelete: string[] = [];
    let offset = 0;
    const pageSize = 1000;

    // Page through the bucket listing all files.
    // list() returns objects with name + created_at (ISO string).
    // Files are stored at the bucket root (no folder prefix).
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { data, error } = await supabase.storage.from(BUCKET).list("", {
        limit: pageSize,
        offset,
        sortBy: { column: "created_at", order: "asc" },
      });
      if (error) throw error;
      if (!data || data.length === 0) break;

      for (const obj of data) {
        const createdAt = obj.created_at ? Date.parse(obj.created_at) : NaN;
        if (!Number.isNaN(createdAt) && createdAt < cutoff) {
          toDelete.push(obj.name);
        }
      }

      if (data.length < pageSize) break;
      offset += pageSize;
    }

    let deleted = 0;
    // Delete in batches of 100.
    for (let i = 0; i < toDelete.length; i += 100) {
      const batch = toDelete.slice(i, i + 100);
      const { error } = await supabase.storage.from(BUCKET).remove(batch);
      if (error) throw error;
      deleted += batch.length;
    }

    return new Response(
      JSON.stringify({ ok: true, deleted, retention_days: RETENTION_DAYS }),
      { headers: { "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("cleanup-shared-reports failed", err);
    return new Response(
      JSON.stringify({ ok: false, error: String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});