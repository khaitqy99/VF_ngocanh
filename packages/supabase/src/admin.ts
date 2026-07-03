import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { getSupabaseServiceRoleKey, getSupabaseUrl } from "./env";

/**
 * Server-only admin client (bypass RLS). Chỉ dùng trong apps/webadmin API routes.
 * Không bao giờ import trong client components.
 */
export function createAdminClient() {
  return createClient<Database>(getSupabaseUrl(), getSupabaseServiceRoleKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
