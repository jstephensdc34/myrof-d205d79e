DO $$ DECLARE c text; BEGIN
  FOR c IN SELECT conname FROM pg_constraint WHERE conrelid='public.report_settings'::regclass AND contype='u' LOOP
    EXECUTE format('ALTER TABLE public.report_settings DROP CONSTRAINT %I', c);
  END LOOP;
END $$;
CREATE UNIQUE INDEX IF NOT EXISTS report_settings_owner_name_key
  ON public.report_settings (COALESCE(user_id, '00000000-0000-0000-0000-000000000000'::uuid), name);
DROP POLICY IF EXISTS "Users update own or shared report settings" ON public.report_settings;
CREATE POLICY "Users update own report settings" ON public.report_settings
  FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());