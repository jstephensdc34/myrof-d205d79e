import Papa from "papaparse";
import { supabase } from "@/integrations/supabase/client";

export interface StarterLibraryRow {
  name: string;
  definition?: string | null;
  description: string;
  info_link?: string | null;
  category_id: string;
  subcategory_id?: string | null;
}

const REQUIRED_HEADERS = [
  "name",
  "definition",
  "description",
  "info_link",
  "category_id",
  "subcategory_id",
];

const CHUNK_SIZE = 500;

export interface LoadStarterProgress {
  inserted: number;
  total: number;
}

export interface LoadStarterResult {
  inserted: number;
}

/**
 * Fetches /library-seed.csv from the deployed app's public folder,
 * validates it against the live category/subcategory tables, and
 * bulk-inserts rows with user_id = null (shared starter items).
 */
export async function loadStarterLibrary(
  onProgress?: (p: LoadStarterProgress) => void
): Promise<LoadStarterResult> {
  // 1. Fetch the CSV bundled with the deployment.
  const res = await fetch("/library-seed.csv", { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Could not load /library-seed.csv (HTTP ${res.status}).`);
  }
  const text = await res.text();

  // 2. Parse.
  const parsed = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
  });

  if (parsed.errors.length) {
    const first = parsed.errors[0];
    throw new Error(`CSV parse error on row ${first.row}: ${first.message}`);
  }

  const headers = parsed.meta.fields ?? [];
  for (const required of REQUIRED_HEADERS) {
    if (!headers.includes(required)) {
      throw new Error(
        `library-seed.csv is missing required column "${required}". ` +
          `Expected columns: ${REQUIRED_HEADERS.join(", ")}.`
      );
    }
  }

  const rawRows = parsed.data ?? [];
  if (rawRows.length === 0) {
    throw new Error(
      "library-seed.csv has no rows. Ask the seller to re-export the starter library."
    );
  }

  // 3. Pull valid category / subcategory ids from the live DB so we can
  //    fail loudly if the CSV is out of sync with the schema.
  const [{ data: cats, error: catErr }, { data: subs, error: subErr }] =
    await Promise.all([
      supabase.from("library_categories").select("id"),
      supabase.from("library_subcategories").select("id"),
    ]);
  if (catErr) throw catErr;
  if (subErr) throw subErr;

  const validCats = new Set((cats ?? []).map((r) => r.id));
  const validSubs = new Set((subs ?? []).map((r) => r.id));

  // 4. Normalize + validate each row.
  const rows: StarterLibraryRow[] = rawRows.map((raw, idx) => {
    const rowNum = idx + 2; // +1 for header, +1 for 1-based
    const name = (raw.name ?? "").trim();
    const description = (raw.description ?? "").trim();
    const category_id = (raw.category_id ?? "").trim();
    const subcategory_id = (raw.subcategory_id ?? "").trim();
    const definition = (raw.definition ?? "").trim();
    const info_link = (raw.info_link ?? "").trim();

    if (!name) throw new Error(`Row ${rowNum}: "name" is required.`);
    if (!description)
      throw new Error(`Row ${rowNum}: "description" is required.`);
    if (!category_id)
      throw new Error(`Row ${rowNum}: "category_id" is required.`);
    if (!validCats.has(category_id)) {
      throw new Error(
        `Row ${rowNum}: unknown category_id "${category_id}".`
      );
    }
    if (subcategory_id && !validSubs.has(subcategory_id)) {
      throw new Error(
        `Row ${rowNum}: unknown subcategory_id "${subcategory_id}".`
      );
    }

    return {
      name,
      description,
      category_id,
      definition: definition || null,
      info_link: info_link || null,
      subcategory_id: subcategory_id || null,
    };
  });

  // 5. Bulk insert in chunks. Starter items are shared: user_id = null.
  let inserted = 0;
  for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
    const chunk = rows.slice(i, i + CHUNK_SIZE).map((r) => ({
      ...r,
      user_id: null,
    }));
    const { error } = await supabase.from("library_items").insert(chunk);
    if (error) {
      throw new Error(
        `Insert failed at row ${i + 2}–${i + chunk.length + 1}: ${error.message}`
      );
    }
    inserted += chunk.length;
    onProgress?.({ inserted, total: rows.length });
  }

  return { inserted };
}