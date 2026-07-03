import { type NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured } from "@vinfast3s/supabase";
import { isAdminUser, updateSession } from "@vinfast3s/supabase/middleware";

const PUBLIC_ADMIN_PATHS = ["/admin/login", "/api/auth/callback", "/api/health"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isSupabaseConfigured()) {
    if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.next();
  }

  if (!pathname.startsWith("/admin") && !pathname.startsWith("/api")) {
    const { response } = await updateSession(request);
    return response;
  }

  if (PUBLIC_ADMIN_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
    const { response, user } = await updateSession(request);

    if (pathname === "/admin/login" && user && isAdminUser(user)) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    return response;
  }

  const { response, user } = await updateSession(request);

  if (!user || !isAdminUser(user)) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
