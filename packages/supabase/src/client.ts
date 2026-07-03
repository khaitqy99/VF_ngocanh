import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./database.types";

function getBrowserSupabaseConfig() {
  // Must read NEXT_PUBLIC_* directly so Next.js inlines them in client bundles.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  }
  return { url, anonKey };
}

export function createClient() {
  const { url, anonKey } = getBrowserSupabaseConfig();
  return createBrowserClient<Database>(url, anonKey);
}

export { createClient as createBrowserClient };
