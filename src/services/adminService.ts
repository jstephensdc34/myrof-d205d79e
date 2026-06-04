
import { supabase } from "@/integrations/supabase/client";

interface CopyLibraryItemsResult {
  success: boolean;
  message: string;
  count?: number;
  sourceCount?: number;
  error?: string;
}

export const copyLibraryItems = async (
  sourceUserId: string,
  targetUserId: string
): Promise<CopyLibraryItemsResult> => {
  try {
    const { data, error } = await supabase.functions.invoke("copy-library-items", {
      body: {
        sourceUserId,
        targetUserId,
      },
    });

    if (error) {
      console.error("Error copying library items:", error);
      return {
        success: false,
        message: "Failed to copy library items",
        error: error.message,
      };
    }

    return {
      success: true,
      message: data.message,
      count: data.count,
      sourceCount: data.sourceCount,
    };
  } catch (error: any) {
    console.error("Unexpected error copying library items:", error);
    return {
      success: false,
      message: "An unexpected error occurred",
      error: error.message,
    };
  }
};

export const searchUsers = async (email: string) => {
  try {
    const { data, error } = await supabase.functions.invoke("search-users", {
      body: { email },
    });

    if (error) {
      console.error("Error searching users:", error);
      return { success: false, users: [], error: error.message };
    }

    return { success: true, users: data.users || [] };
  } catch (error: any) {
    console.error("Unexpected error searching users:", error);
    return {
      success: false,
      users: [],
      error: error.message,
    };
  }
};
