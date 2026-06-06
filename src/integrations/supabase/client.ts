import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY) as string;

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

if (!isSupabaseConfigured) {
  // Don't throw at import time — that crashes the whole React tree and
  // leaves the user with a blank page. Log a clear warning instead; the
  // app shell renders a configuration-required screen.
  // eslint-disable-next-line no-console
  console.error(
    '[supabase] Missing VITE_SUPABASE_URL and/or VITE_SUPABASE_ANON_KEY. ' +
    'Set them in your .env file (local) or your deployment environment (Vercel, etc.).'
  );
}

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

// Fall back to harmless placeholders so module evaluation doesn't crash;
// any network call will fail loudly, but the UI can render a friendly notice.
export const supabase = createClient<Database>(
  SUPABASE_URL || 'https://placeholder.supabase.co',
  SUPABASE_ANON_KEY || 'placeholder-anon-key'
);
