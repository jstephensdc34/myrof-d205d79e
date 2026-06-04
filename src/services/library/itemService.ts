
import { supabase } from "@/integrations/supabase/client";
import { ReportItem } from "@/types";

// Fetch items by category and optionally by subcategory
export const fetchItemsByCategory = async (
  categoryId: string,
  subcategoryId?: string
): Promise<ReportItem[]> => {
  let query = supabase
    .from("library_items")
    .select("*")
    .eq("category_id", categoryId);

  if (subcategoryId) {
    query = query.eq("subcategory_id", subcategoryId);
  }

  const { data, error } = await query.order("name");

  if (error) {
    console.error("Error fetching items:", error);
    throw error;
  }

  return data.map(item => ({
    id: item.id,
    name: item.name,
    definition: item.definition,
    description: item.description,
    infoLink: item.info_link,
    categoryId: item.category_id,
    subcategoryId: item.subcategory_id
  }));
};

// Create a new item
export const createItem = async (
  item: Omit<ReportItem, "id">, 
  userId: string
): Promise<ReportItem> => {
  const { data, error } = await supabase
    .from("library_items")
    .insert({
      name: item.name,
      definition: item.definition,
      description: item.description,
      info_link: item.infoLink,
      category_id: item.categoryId,
      subcategory_id: item.subcategoryId,
      user_id: userId
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating item:", error);
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    definition: data.definition,
    description: data.description,
    infoLink: data.info_link,
    categoryId: data.category_id,
    subcategoryId: data.subcategory_id
  };
};

// Update an existing item
export const updateItem = async (
  item: ReportItem,
  userId: string
): Promise<ReportItem> => {
  const { data, error } = await supabase.rpc('claim_and_update_library_item', {
    _item_id: item.id,
    _user_id: userId,
    _name: item.name,
    _definition: item.definition || null,
    _description: item.description,
    _info_link: item.infoLink || null,
    _category_id: item.categoryId,
    _subcategory_id: item.subcategoryId || null,
  });

  if (error) {
    console.error("Error updating item:", error);
    throw error;
  }

  // The function returns the new/updated item id
  const newId = data as string;
  return {
    ...item,
    id: newId,
  };
};

// Delete an item
export const deleteItem = async (id: string): Promise<void> => {
  console.log("ItemService: Starting deletion of item with ID:", id);
  
  try {
    const { error } = await supabase
      .from("library_items")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Supabase error deleting item:", error);
      throw new Error(`Failed to delete item: ${error.message}`);
    }
    
    console.log("ItemService: Item successfully deleted from database:", id);
  } catch (error) {
    console.error("Error in deleteItem function:", error);
    throw error;
  }
};
