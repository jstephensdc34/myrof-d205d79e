
-- Care plans table: stores both auto-saved drafts and manually saved named plans
CREATE TABLE public.care_plans (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  title text NOT NULL DEFAULT 'Untitled Care Plan',
  is_draft boolean NOT NULL DEFAULT false,
  patient_name text,
  report_date text,
  selected_item_ids jsonb NOT NULL DEFAULT '[]'::jsonb,
  additional_notes text,
  custom_treatment_goals text,
  active_category text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Ensure only ONE rolling draft exists per user
CREATE UNIQUE INDEX care_plans_one_draft_per_user
  ON public.care_plans (user_id)
  WHERE is_draft = true;

CREATE INDEX care_plans_user_updated_idx ON public.care_plans (user_id, updated_at DESC);

ALTER TABLE public.care_plans ENABLE ROW LEVEL SECURITY;

-- Shared across the clinic: any authenticated user can view/load/edit/delete
CREATE POLICY "Authenticated users can view all care plans"
  ON public.care_plans FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create care plans"
  ON public.care_plans FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can update care plans"
  ON public.care_plans FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete care plans"
  ON public.care_plans FOR DELETE
  TO authenticated
  USING (true);

-- Updated_at trigger
CREATE TRIGGER care_plans_set_updated_at
  BEFORE UPDATE ON public.care_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_modified_column();
