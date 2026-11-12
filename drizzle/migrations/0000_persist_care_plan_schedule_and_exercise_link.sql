ALTER TABLE public.care_plans
  ADD COLUMN IF NOT EXISTS treatment_schedule jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS exercise_info_link text NOT NULL DEFAULT '';
NOTIFY pgrst, 'reload schema';