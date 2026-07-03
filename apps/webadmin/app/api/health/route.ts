import { NextResponse } from "next/server";
import { createServerClient } from "@vinfast3s/supabase/server";
import { createAdminClient } from "@vinfast3s/supabase/admin";
import { isSupabaseAdminConfigured, isSupabaseConfigured } from "@vinfast3s/supabase";

export async function GET() {
  const configured = isSupabaseConfigured();
  const adminConfigured = isSupabaseAdminConfigured();

  if (!configured) {
    return NextResponse.json({
      ok: false,
      configured: false,
      message: "Thiếu NEXT_PUBLIC_SUPABASE_URL hoặc NEXT_PUBLIC_SUPABASE_ANON_KEY trong .env",
    });
  }

  try {
    const supabase = await createServerClient();
    const { error: publicError } = await supabase.from("site_settings").select("key").limit(1);

    let adminOk = false;
    let adminMessage = "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY";

    if (adminConfigured) {
      const admin = createAdminClient();
      const { error: adminError } = await admin.from("site_settings").select("key").limit(1);
      adminOk = !adminError;
      adminMessage = adminError?.message ?? "OK";
    }

    return NextResponse.json({
      ok: !publicError,
      configured: true,
      publicApi: publicError ? { ok: false, error: publicError.message } : { ok: true },
      adminApi: { ok: adminOk, message: adminMessage },
      urls: {
        client: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
        admin: process.env.NEXT_PUBLIC_ADMIN_URL ?? "http://localhost:3001",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, configured: true, error: message }, { status: 500 });
  }
}
