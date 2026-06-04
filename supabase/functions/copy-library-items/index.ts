
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Create a Supabase client with the Admin API key
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

interface CopyLibraryRequest {
  sourceUserId: string;
  targetUserId: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the Authorization header from the request
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify the user is authenticated with Supabase
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized', details: authError }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // For now, anyone can use this function, but in production you'd want to check
    // if the user has admin privileges here

    // Parse request body
    const { sourceUserId, targetUserId } = await req.json() as CopyLibraryRequest;

    if (!sourceUserId || !targetUserId) {
      return new Response(
        JSON.stringify({ error: 'sourceUserId and targetUserId are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch items from the source user
    const { data: sourceItems, error: fetchError } = await supabaseAdmin
      .from('library_items')
      .select('*')
      .eq('user_id', sourceUserId);

    if (fetchError) {
      console.error('Error fetching source items:', fetchError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch source items', details: fetchError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!sourceItems || sourceItems.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No items found for the source user', count: 0 }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Prepare items for the target user by removing IDs and updating user_id
    const itemsToInsert = sourceItems.map(item => ({
      name: item.name,
      description: item.description,
      info_link: item.info_link,
      category_id: item.category_id,
      subcategory_id: item.subcategory_id,
      user_id: targetUserId
    }));

    // Insert items for the target user
    const { data: insertedItems, error: insertError } = await supabaseAdmin
      .from('library_items')
      .insert(itemsToInsert)
      .select();

    if (insertError) {
      console.error('Error inserting items for target user:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to copy items to target user', details: insertError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        message: 'Items copied successfully', 
        count: insertedItems.length,
        sourceCount: sourceItems.length
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
