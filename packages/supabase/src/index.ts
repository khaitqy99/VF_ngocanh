export { createClient as createBrowserClient } from "./client";
export { createClient as createServerClient } from "./server";
export { createAdminClient } from "./admin";
export {
  getAdminRole,
  isAdminUser,
  updateSession,
  type AdminRole,
} from "./middleware";
export { isSupabaseAdminConfigured, isSupabaseConfigured } from "./env";
export type { Database, Json, Tables, TablesInsert, TablesUpdate } from "./database.types";
