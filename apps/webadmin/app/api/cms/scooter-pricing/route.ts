import { NextResponse } from "next/server";
import { createAdminClient } from "@vinfast3s/supabase/admin";
import { isSupabaseConfigured, type Json } from "@vinfast3s/supabase";
import {
  defaultScooterPricingSettings,
  mergeScooterPricingSettings,
  parseScooterPricingSettings,
  type ScooterPricingSettings,
} from "@/lib/cms/scooter-pricing";
import { revalidateScooterPricing } from "@/lib/scooter-pricing-revalidate";

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ settings: defaultScooterPricingSettings(), configured: false });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("site_settings")
    .select("value")
    .eq("key", "scooter_pricing")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    settings: mergeScooterPricingSettings(parseScooterPricingSettings(data?.value)),
    configured: true,
  });
}

export async function PATCH(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Database chưa được cấu hình" }, { status: 503 });
  }

  let body: { settings?: ScooterPricingSettings };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.settings || typeof body.settings !== "object") {
    return NextResponse.json({ error: "Thiếu settings" }, { status: 400 });
  }

  const admin = createAdminClient();
  const value = mergeScooterPricingSettings(body.settings) as unknown as Json;

  const { error } = await admin.from("site_settings").upsert(
    {
      key: "scooter_pricing",
      value,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" },
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const revalidated = await revalidateScooterPricing();
  return NextResponse.json({ ok: true, settings: value, revalidated });
}
