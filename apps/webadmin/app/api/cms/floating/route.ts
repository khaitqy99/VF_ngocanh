import { NextResponse } from "next/server";
import { createAdminClient } from "@vinfast3s/supabase/admin";
import { isSupabaseConfigured, type Json } from "@vinfast3s/supabase";
import {
  defaultFloatingSettings,
  mergeFloatingSettings,
  parseFloatingSettings,
  type FloatingSettings,
} from "@/lib/cms/floating";
import { revalidateFloating } from "@/lib/floating-revalidate";

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ settings: defaultFloatingSettings(), configured: false });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("site_settings")
    .select("value")
    .eq("key", "floating")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    settings: mergeFloatingSettings(parseFloatingSettings(data?.value)),
    configured: true,
  });
}

export async function PATCH(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Database chưa được cấu hình" }, { status: 503 });
  }

  let body: { settings?: FloatingSettings };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.settings || typeof body.settings !== "object") {
    return NextResponse.json({ error: "Thiếu settings" }, { status: 400 });
  }

  const admin = createAdminClient();
  const value = mergeFloatingSettings(body.settings) as unknown as Json;

  const { error } = await admin.from("site_settings").upsert(
    {
      key: "floating",
      value,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" },
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const revalidated = await revalidateFloating();
  return NextResponse.json({ ok: true, settings: value, revalidated });
}
