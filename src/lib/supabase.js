import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

function isValidUrl(u) {
  try {
    const parsed = new URL(u);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

if (!isValidUrl(SUPABASE_URL)) {
  console.error('Invalid VITE_SUPABASE_URL:', SUPABASE_URL);
  export const supabase = null;
} else if (!SUPABASE_ANON_KEY) {
  console.error('Missing VITE_SUPABASE_ANON_KEY');
  export const supabase = null;
} else {
  export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
