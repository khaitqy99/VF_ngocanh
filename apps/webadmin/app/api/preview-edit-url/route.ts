import { NextResponse } from "next/server";
import { createServerClient } from "@vinfast3s/supabase/server";
import { isAdminUser } from "@vinfast3s/supabase/middleware";
import {
  buildPreviewEditUrl,
  getPreviewEditSecret,
  previewScopeFromPath,
} from "@/lib/preview-edit-url";

export async function GET(request: Request) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdminUser(user)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const previewPath = searchParams.get("path");

  if (!previewPath || !previewPath.startsWith("/")) {
    return NextResponse.json({ error: "Thiếu path hợp lệ" }, { status: 400 });
  }

  const secret = getPreviewEditSecret();
  if (!secret) {
    return NextResponse.json(
      {
        error:
          "Thiếu REVALIDATION_SECRET trên server admin. Thêm biến này (cùng giá trị với webclient) trong Vercel.",
        configured: false,
      },
      { status: 503 },
    );
  }

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const url = buildPreviewEditUrl(siteUrl, previewPath);

  if (!url.includes("edit_token=")) {
    return NextResponse.json(
      { error: "Không tạo được edit_token", configured: false },
      { status: 503 },
    );
  }

  return NextResponse.json({
    url,
    scope: previewScopeFromPath(previewPath),
    configured: true,
  });
}
