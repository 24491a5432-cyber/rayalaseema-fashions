import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const url = (import.meta as any).env?.VITE_SUPABASE_URL as string;
const anonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string;

if (!url || !anonKey) {
  // Fail fast with a clear message in the console so setup issues are obvious
  // eslint-disable-next-line no-console
  console.error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Set them in your .env file.");
}

export const supabase = createClient<Database>(url, anonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});