import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "./database.types";
import { getSupabaseAnonKey, getSupabaseUrl } from "./env";

export type AdminRole = "admin" | "super_admin";

export function getAdminRole(user: { app_metadata?: Record<string, unknown> } | null): AdminRole | null {
  const role = user?.app_metadata?.role;
  if (role === "admin" || role === "super_admin") {
    return role;
  }
  return null;
}

export function isAdminUser(user: { app_metadata?: Record<string, unknown> } | null): boolean {
  return getAdminRole(user) !== null;
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { response, supabase, user };
}
