import { NextResponse } from "next/server";
import { createPreviewEditToken } from "@vinfast3s/supabase/preview-token";
import { getSessionAdmin } from "@/lib/auth";

export async function GET() {
  const session = await getSessionAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = createPreviewEditToken();
  if (!token) {
    return NextResponse.json({
      token: null,
      message: "REVALIDATION_SECRET chưa cấu hình — preview dùng chế độ dev (Referer)",
    });
  }

  return NextResponse.json({ token, expiresIn: 3600 });
}
