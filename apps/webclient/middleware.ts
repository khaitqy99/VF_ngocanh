import { type NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured } from "@vinfast3s/supabase";
import { updateSession } from "@vinfast3s/supabase/middleware";
import { getAdminAppUrl, isPreviewPath } from "@/lib/preview-edit-token";
import { matchSeoRedirect } from "@/lib/seo/redirects";

function applyFramePolicy(response: NextResponse, pathname: string) {
  if (isPreviewPath(pathname)) {
    const adminUrl = getAdminAppUrl() || "http://localhost:3001";
    response.headers.delete("X-Frame-Options");
    response.headers.set("Content-Security-Policy", `frame-ancestors 'self' ${adminUrl}`);
    return;
  }

  response.headers.set("X-Frame-Options", "SAMEORIGIN");
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (isSupabaseConfigured()) {
    try {
      const redirect = await matchSeoRedirect(pathname);
      if (redirect && redirect.toPath !== pathname) {
        const url = request.nextUrl.clone();
        url.pathname = redirect.toPath;
        const status =
          redirect.statusCode === 301 ||
          redirect.statusCode === 302 ||
          redirect.statusCode === 307 ||
          redirect.statusCode === 308
            ? redirect.statusCode
            : 301;
        return NextResponse.redirect(url, status);
      }
    } catch {
      // Ignore redirect lookup failures — continue normal request handling.
    }
  }

  if (!isSupabaseConfigured()) {
    const response = NextResponse.next();
    applyFramePolicy(response, pathname);
    return response;
  }

  const { response } = await updateSession(request);
  applyFramePolicy(response, pathname);
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
