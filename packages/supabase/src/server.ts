import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./database.types";
import { getSupabaseAnonKey, getSupabaseUrl } from "./env";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // setAll from Server Component — middleware sẽ refresh session
        }
      },
    },
  });
}

export { createClient as createServerClient };
