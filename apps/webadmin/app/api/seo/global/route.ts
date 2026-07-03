import { NextResponse } from "next/server";
import { createAdminClient } from "@vinfast3s/supabase/admin";
import { isSupabaseConfigured } from "@vinfast3s/supabase";
import type { Json } from "@vinfast3s/supabase";
import {
  defaultSiteSeoSettings,
  mergeSiteSeoSettings,
  parseSiteSeoSettings,
  type SiteSeoSettings,
} from "@/lib/seo";
import { revalidateSeo } from "@/lib/seo-revalidate";

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ settings: defaultSiteSeoSettings(), configured: false });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("site_settings")
    .select("value")
    .eq("key", "seo")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    settings: mergeSiteSeoSettings(parseSiteSeoSettings(data?.value)),
    configured: true,
  });
}

export async function PATCH(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Database chưa được cấu hình" }, { status: 503 });
  }

  let body: { settings?: SiteSeoSettings };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.settings || typeof body.settings !== "object") {
    return NextResponse.json({ error: "Thiếu settings" }, { status: 400 });
  }

  const admin = createAdminClient();
  const value = mergeSiteSeoSettings(body.settings) as unknown as Json;

  const { error } = await admin.from("site_settings").upsert(
    {
      key: "seo",
      value,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" },
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await revalidateSeo();
  return NextResponse.json({ ok: true });
}
