-- Allow authenticated users to update/delete shared starter library items
-- (rows where user_id IS NULL), in addition to rows they own.

DROP POLICY IF EXISTS "Users update own library items" ON public.library_items;
DROP POLICY IF EXISTS "Users delete own library items" ON public.library_items;

CREATE POLICY "Users update own or shared library items"
  ON public.library_items FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() OR user_id IS NULL)
  WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Users delete own or shared library items"
  ON public.library_items FOR DELETE
  TO authenticated
  USING (user_id = auth.uid() OR user_id IS NULL);
