import { NextResponse } from "next/server";
import { createAdminClient } from "@vinfast3s/supabase/admin";
import { isSupabaseConfigured } from "@vinfast3s/supabase";

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ configured: false, new: 0, total: 0 });
  }

  const admin = createAdminClient();

  const [newResult, totalResult] = await Promise.all([
    admin.from("leads").select("*", { count: "exact", head: true }).eq("status", "new"),
    admin.from("leads").select("*", { count: "exact", head: true }),
  ]);

  if (newResult.error || totalResult.error) {
    const message = newResult.error?.message ?? totalResult.error?.message ?? "Count failed";
    console.error("[api/leads/count]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({
    configured: true,
    new: newResult.count ?? 0,
    total: totalResult.count ?? 0,
  });
}
