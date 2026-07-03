import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { getSupabaseAnonKey, getSupabaseUrl } from "./env";

/** Server-side client dùng anon key — cho public API (vd: gửi lead từ webclient). */
export function createAnonClient() {
  return createClient<Database>(getSupabaseUrl(), getSupabaseAnonKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
