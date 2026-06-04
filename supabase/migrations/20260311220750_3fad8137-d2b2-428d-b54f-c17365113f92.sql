
CREATE OR REPLACE FUNCTION public.claim_and_update_library_item(
  _item_id uuid,
  _user_id uuid,
  _name text,
  _definition text,
  _description text,
  _info_link text,
  _category_id text,
  _subcategory_id text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _owner_id uuid;
  _new_id uuid;
BEGIN
  -- Check who owns the item
  SELECT user_id INTO _owner_id FROM library_items WHERE id = _item_id;
  
  IF _owner_id IS NULL OR _owner_id = _user_id THEN
    -- User owns it (or no owner), just update directly
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
    -- Different owner: delete old, insert new
    DELETE FROM library_items WHERE id = _item_id;
    INSERT INTO library_items (name, definition, description, info_link, category_id, subcategory_id, user_id)
    VALUES (_name, _definition, _description, _info_link, _category_id, _subcategory_id, _user_id)
    RETURNING id INTO _new_id;
    RETURN _new_id;
  END IF;
END;
$$;
