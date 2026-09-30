import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function getBrowserClient() {
  return createClient(supabaseUrl, supabaseAnon);
}
