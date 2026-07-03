import { type NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured } from "@vinfast3s/supabase";
import { updateSession } from "@vinfast3s/supabase/middleware";

export async function middleware(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.next();
  }

  const { response } = await updateSession(request);
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
