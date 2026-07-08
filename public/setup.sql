-- ============================================================
-- MyROF Report — Database Setup (single-file, from-scratch)
-- ============================================================
-- Paste this entire file into your Supabase SQL Editor and click Run.
-- Safe to re-run on the same project (uses IF NOT EXISTS / ON CONFLICT).
-- ============================================================

-- ------------------------------------------------------------
-- 0. Shared trigger function: keeps updated_at fresh.
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_modified_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ============================================================
-- 1. Library taxonomy: categories + subcategories (reference data)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.library_categories (
  id          text PRIMARY KEY,
  name        text NOT NULL,
  description text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.library_subcategories (
  id                 text PRIMARY KEY,
  name               text NOT NULL,
  description        text,
  parent_category_id text NOT NULL REFERENCES public.library_categories(id) ON DELETE CASCADE,
  created_at         timestamptz NOT NULL DEFAULT now()
);

-- Seed categories.
INSERT INTO public.library_categories (id, name, description) VALUES
  ('diagnosis', 'Diagnosis', 'Spinal and general diagnosis content'),
  ('extremity', 'Extremity', 'Extremity diagnosis content'),
  ('treatment', 'Treatment Plan', 'Treatment plan content'),
  ('homecare',  'Home Care',  'Home care recommendations'),
  ('exercises', 'Exercises',  'Therapeutic exercises')
ON CONFLICT (id) DO NOTHING;

-- Seed subcategories — full set the app expects.
INSERT INTO public.library_subcategories (id, name, parent_category_id, description) VALUES
  -- Diagnosis
  ('general_diagnosis',     'General Diagnosis',     'diagnosis', 'General spinal conditions'),
  ('cervical_diagnosis',    'Cervical Diagnosis',    'diagnosis', 'Neck region conditions'),
  ('thoracic_diagnosis',    'Thoracic Diagnosis',    'diagnosis', 'Mid-back conditions'),
  ('lumbopelvic_diagnosis', 'Lumbopelvic Diagnosis', 'diagnosis', 'Low back and pelvic conditions'),
  -- Extremity
  ('shoulder',   'Shoulder',     'extremity', 'Shoulder conditions'),
  ('elbow',      'Elbow',        'extremity', 'Elbow conditions'),
  ('wrist_hand', 'Wrist & Hand', 'extremity', 'Wrist and hand conditions'),
  ('hip',        'Hip',          'extremity', 'Hip conditions'),
  ('knee',       'Knee',         'extremity', 'Knee conditions'),
  ('ankle_foot', 'Ankle & Foot', 'extremity', 'Ankle and foot conditions'),
  -- Treatment
  ('care_plan_type',       'Care Plan Type',       'treatment', 'Types of care plans'),
  ('phase_of_care',        'Phase of Care',        'treatment', 'Phase of care for treatment plan'),
  ('treatment_modalities', 'Treatment Modalities', 'treatment', 'Treatment techniques and approaches'),
  ('treatment_goals',      'Treatment Goals',      'treatment', 'Objectives of the treatment'),
  -- Homecare
  ('home_therapy',         'Home Therapy',         'homecare', 'Self-administered therapeutic techniques'),
  ('adls',                 'ADLs',                 'homecare', 'Activities of Daily Living modifications'),
  ('activity_modification','Activity Modification','homecare', 'Recommendations for modifying daily activities'),
  ('condition_specific',   'Condition Specific',   'homecare', 'Recommendations specific to certain conditions'),
  ('wellness',             'Miscellaneous',        'homecare', 'General health and wellness recommendations'),
  -- Exercises
  ('general_exercises',         'General',         'exercises', 'General exercises'),
  ('cervical_exercises',        'Cervical',        'exercises', 'Neck exercises'),
  ('thoracic_exercises',        'Thoracic',        'exercises', 'Mid-back exercises'),
  ('lumbopelvic_exercises',     'Lumbopelvic',     'exercises', 'Low back and pelvic exercises'),
  ('lower_extremity_exercises', 'Lower Extremity', 'exercises', 'Leg and foot exercises'),
  ('upper_extremity_exercises', 'Upper Extremity', 'exercises', 'Arm and shoulder exercises')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 2. Library items (per-clinic; user_id NULL = shared starter row)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.library_items (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text NOT NULL,
  definition      text,
  description     text NOT NULL,
  info_link       text,
  category_id     text NOT NULL REFERENCES public.library_categories(id),
  subcategory_id  text REFERENCES public.library_subcategories(id),
  user_id         uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS library_items_set_updated_at ON public.library_items;
CREATE TRIGGER library_items_set_updated_at
  BEFORE UPDATE ON public.library_items
  FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();

-- ============================================================
-- 3. Report settings (clinic info shown on every report)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.report_settings (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL UNIQUE,
  value      text,
  created_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.report_settings (name, value) VALUES
  ('clinic_name', ''),
  ('address',     ''),
  ('phone',       ''),
  ('email',       ''),
  ('website',     ''),
  ('logo_url',    '')
ON CONFLICT (name) DO NOTHING;

-- ============================================================
-- 4. Care plans (saved per-user)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.care_plans (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                uuid NOT NULL,
  title                  text NOT NULL DEFAULT 'Untitled Care Plan',
  is_draft               boolean NOT NULL DEFAULT false,
  patient_name           text,
  report_date            text,
  selected_item_ids      jsonb NOT NULL DEFAULT '[]'::jsonb,
  additional_notes       text,
  custom_treatment_goals text,
  active_category        text,
  created_at             timestamptz NOT NULL DEFAULT now(),
  updated_at             timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS care_plans_user_updated_idx
  ON public.care_plans (user_id, updated_at DESC);

DROP TRIGGER IF EXISTS care_plans_set_updated_at ON public.care_plans;
CREATE TRIGGER care_plans_set_updated_at
  BEFORE UPDATE ON public.care_plans
  FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();

-- ============================================================
-- 5. claim_and_update_library_item RPC
-- ============================================================
CREATE OR REPLACE FUNCTION public.claim_and_update_library_item(
  _item_id        uuid,
  _user_id        uuid,
  _name           text,
  _definition     text,
  _description    text,
  _info_link      text,
  _category_id    text,
  _subcategory_id text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _owner_id uuid;
  _new_id   uuid;
BEGIN
  SELECT user_id INTO _owner_id FROM library_items WHERE id = _item_id;

  IF _owner_id IS NULL OR _owner_id = _user_id THEN
    UPDATE library_items SET
      name = _name,
      definition = _definition,
      description = _description,
      info_link = _info_link,
      category_id = _category_id,
      subcategory_id = _subcategory_id,
      user_id = _user_id,
      updated_at = now()
    WHERE id = _item_id;
    RETURN _item_id;
  ELSE
    DELETE FROM library_items WHERE id = _item_id;
    INSERT INTO library_items
      (name, definition, description, info_link, category_id, subcategory_id, user_id)
    VALUES
      (_name, _definition, _description, _info_link, _category_id, _subcategory_id, _user_id)
    RETURNING id INTO _new_id;
    RETURN _new_id;
  END IF;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.claim_and_update_library_item(uuid, uuid, text, text, text, text, text, text) FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.claim_and_update_library_item(uuid, uuid, text, text, text, text, text, text) TO authenticated;

-- ============================================================
-- 6. GRANTs (REST API access via PostgREST)
-- ============================================================
GRANT SELECT ON public.library_categories    TO anon, authenticated;
GRANT SELECT ON public.library_subcategories TO anon, authenticated;
GRANT ALL    ON public.library_categories    TO service_role;
GRANT ALL    ON public.library_subcategories TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.library_items   TO authenticated;
GRANT ALL                            ON public.library_items   TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.report_settings TO authenticated;
GRANT ALL                            ON public.report_settings TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.care_plans      TO authenticated;
GRANT ALL                            ON public.care_plans      TO service_role;

-- ============================================================
-- 7. Row Level Security
-- ============================================================
ALTER TABLE public.library_categories    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_items         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_settings       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.care_plans            ENABLE ROW LEVEL SECURITY;

-- library_categories (reference data; readable by all)
DROP POLICY IF EXISTS "Anyone can read categories" ON public.library_categories;
CREATE POLICY "Anyone can read categories"
  ON public.library_categories FOR SELECT
  TO authenticated, anon
  USING (true);

-- library_subcategories (reference data; readable by all)
DROP POLICY IF EXISTS "Anyone can read subcategories" ON public.library_subcategories;
CREATE POLICY "Anyone can read subcategories"
  ON public.library_subcategories FOR SELECT
  TO authenticated, anon
  USING (true);

-- library_items
-- Shared starter rows (user_id IS NULL) are visible and editable to every
-- signed-in clinic user. Per-user rows are private to their owner.
DROP POLICY IF EXISTS "Users read own or shared library items"   ON public.library_items;
DROP POLICY IF EXISTS "Users insert own library items"           ON public.library_items;
DROP POLICY IF EXISTS "Users update own library items"           ON public.library_items;
DROP POLICY IF EXISTS "Users delete own library items"           ON public.library_items;
DROP POLICY IF EXISTS "Users update own or shared library items" ON public.library_items;
DROP POLICY IF EXISTS "Users delete own or shared library items" ON public.library_items;

CREATE POLICY "Users read own or shared library items"
  ON public.library_items FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Users insert library items"
  ON public.library_items FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Users update own or shared library items"
  ON public.library_items FOR UPDATE
  TO authenticated
  USING      (user_id = auth.uid() OR user_id IS NULL)
  WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Users delete own or shared library items"
  ON public.library_items FOR DELETE
  TO authenticated
  USING (user_id = auth.uid() OR user_id IS NULL);

-- report_settings (single-clinic app: all authenticated users share)
DROP POLICY IF EXISTS "Authenticated can read report settings"   ON public.report_settings;
DROP POLICY IF EXISTS "Authenticated can insert report settings" ON public.report_settings;
DROP POLICY IF EXISTS "Authenticated can update report settings" ON public.report_settings;
DROP POLICY IF EXISTS "Authenticated can delete report settings" ON public.report_settings;

CREATE POLICY "Authenticated can read report settings"
  ON public.report_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert report settings"
  ON public.report_settings FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated can update report settings"
  ON public.report_settings FOR UPDATE TO authenticated
  USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated can delete report settings"
  ON public.report_settings FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

-- care_plans (per-user)
DROP POLICY IF EXISTS "Users read own care plans"   ON public.care_plans;
DROP POLICY IF EXISTS "Users insert own care plans" ON public.care_plans;
DROP POLICY IF EXISTS "Users update own care plans" ON public.care_plans;
DROP POLICY IF EXISTS "Users delete own care plans" ON public.care_plans;

CREATE POLICY "Users read own care plans"
  ON public.care_plans FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users insert own care plans"
  ON public.care_plans FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users update own care plans"
  ON public.care_plans FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users delete own care plans"
  ON public.care_plans FOR DELETE TO authenticated USING (user_id = auth.uid());

-- ============================================================
-- 8. Storage buckets
-- ============================================================

-- clinic-assets: private bucket for the clinic logo and similar.
INSERT INTO storage.buckets (id, name, public)
VALUES ('clinic-assets', 'clinic-assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "clinic_assets_public_read"  ON storage.objects;
DROP POLICY IF EXISTS "clinic_assets_auth_insert"  ON storage.objects;
DROP POLICY IF EXISTS "clinic_assets_owner_update" ON storage.objects;
DROP POLICY IF EXISTS "clinic_assets_owner_delete" ON storage.objects;

CREATE POLICY "clinic_assets_public_read"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'clinic-assets');

CREATE POLICY "clinic_assets_auth_insert"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'clinic-assets');

CREATE POLICY "clinic_assets_owner_update"
  ON storage.objects FOR UPDATE TO authenticated
  USING      (bucket_id = 'clinic-assets' AND owner = auth.uid())
  WITH CHECK (bucket_id = 'clinic-assets' AND owner = auth.uid());

CREATE POLICY "clinic_assets_owner_delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'clinic-assets' AND owner = auth.uid());

-- shared-reports: public bucket for shareable report HTML.
INSERT INTO storage.buckets (id, name, public)
VALUES ('shared-reports', 'shared-reports', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "shared_reports_public_read"  ON storage.objects;
DROP POLICY IF EXISTS "shared_reports_auth_insert"  ON storage.objects;
DROP POLICY IF EXISTS "shared_reports_owner_update" ON storage.objects;
DROP POLICY IF EXISTS "shared_reports_owner_delete" ON storage.objects;

CREATE POLICY "shared_reports_public_read"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'shared-reports');

CREATE POLICY "shared_reports_auth_insert"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'shared-reports');

CREATE POLICY "shared_reports_owner_update"
  ON storage.objects FOR UPDATE TO authenticated
  USING      (bucket_id = 'shared-reports' AND owner = auth.uid())
  WITH CHECK (bucket_id = 'shared-reports' AND owner = auth.uid());

CREATE POLICY "shared_reports_owner_delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'shared-reports' AND owner = auth.uid());

-- ============================================================
-- 8. Automatic cleanup of old shared-report files (90 days).
-- ============================================================
-- Shared-report HTML files live in the public `shared-reports` bucket.
-- Without cleanup they accumulate forever. The job below invokes the
-- `cleanup-shared-reports` edge function once a day; the function deletes
-- any file in that bucket whose `created_at` is older than 90 days.
--
-- Requires two extensions (safe to re-run):
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net  WITH SCHEMA extensions;

-- ------------------------------------------------------------
-- Schedule the daily cleanup job.
--
-- REPLACE the two placeholders below with values from your own Supabase
-- project (Project Settings -> API):
--   <YOUR-PROJECT-REF>  e.g. abcd1234efgh5678ijkl
--   <YOUR-ANON-KEY>     the "anon public" key (starts with sb_publishable_ or eyJ...)
--
-- Safe to re-run: the block first removes any previous schedule with the
-- same name before creating a new one.
-- ------------------------------------------------------------
DO $$
BEGIN
  PERFORM cron.unschedule(jobid)
  FROM cron.job
  WHERE jobname = 'cleanup-shared-reports-daily';
EXCEPTION WHEN OTHERS THEN
  -- No prior job; ignore.
  NULL;
END $$;

SELECT cron.schedule(
  'cleanup-shared-reports-daily',
  '15 3 * * *',  -- daily at 03:15 UTC
  $cron$
  SELECT net.http_post(
    url     := 'https://<YOUR-PROJECT-REF>.supabase.co/functions/v1/cleanup-shared-reports',
    headers := '{"Content-Type":"application/json","apikey":"<YOUR-ANON-KEY>","Authorization":"Bearer <YOUR-ANON-KEY>"}'::jsonb,
    body    := '{}'::jsonb
  ) AS request_id;
  $cron$
);

-- ============================================================
SELECT 'Setup complete' AS status;
