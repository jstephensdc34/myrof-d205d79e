import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Sanitize the URL defensively: buyers often paste it with a trailing
// slash or an extra path segment (e.g. ".../rest/v1"), which causes
// Supabase to reject requests with "Invalid path specified in request URL".
const sanitizeSupabaseUrl = (raw: string | undefined): string => {
  if (!raw) return '';
  let url = raw.trim().replace(/^['"]|['"]$/g, '');
  // Strip any path/query/hash — only the origin is valid.
  try {
    url = new URL(url).origin;
  } catch {
    // Fall back to trimming trailing slashes and known suffixes.
    url = url.replace(/\/+$/, '').replace(/\/(rest|auth|storage|realtime)(\/v\d+)?$/i, '');
  }
  return url;
};

const SUPABASE_URL = sanitizeSupabaseUrl(import.meta.env.VITE_SUPABASE_URL as string);
const SUPABASE_ANON_KEY = ((import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY) as string | undefined)?.trim() || '';

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
