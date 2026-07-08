import { NextResponse } from "next/server";
import { createAdminClient } from "@vinfast3s/supabase/admin";
import { isSupabaseConfigured, type Json } from "@vinfast3s/supabase";
import {
  defaultFooterSettings,
  mergeFooterSettings,
  parseFooterSettings,
  type FooterSettings,
} from "@/lib/cms/footer";
import { revalidateFooter } from "@/lib/footer-revalidate";

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ settings: defaultFooterSettings(), configured: false });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("site_settings")
    .select("value")
    .eq("key", "footer")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    settings: mergeFooterSettings(parseFooterSettings(data?.value)),
    configured: true,
  });
}

export async function PATCH(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Database chưa được cấu hình" }, { status: 503 });
  }

  let body: { settings?: FooterSettings };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.settings || typeof body.settings !== "object") {
    return NextResponse.json({ error: "Thiếu settings" }, { status: 400 });
  }

  const admin = createAdminClient();
  const value = mergeFooterSettings(body.settings) as unknown as Json;

  const { error } = await admin.from("site_settings").upsert(
    {
      key: "footer",
      value,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" },
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await revalidateFooter();
  return NextResponse.json({ ok: true, settings: value });
}
