import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@vinfast3s/supabase";
import { getSessionAdmin } from "@/lib/auth";

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ configured: false, user: null });
  }

  const session = await getSessionAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    configured: true,
    user: {
      id: session.id,
      email: session.email ?? "",
      role: session.role,
    },
  });
}
