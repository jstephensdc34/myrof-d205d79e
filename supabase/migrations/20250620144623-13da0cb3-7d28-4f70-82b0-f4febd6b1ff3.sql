
-- Insert the new "Condition Specific" subcategory under Homecare
INSERT INTO public.library_subcategories (id, name, description, parent_category_id)
VALUES ('condition_specific', 'Condition Specific', 'Recommendations specific to certain conditions', 'homecare');
