import { NextResponse } from "next/server";
import { createServerClient } from "@vinfast3s/supabase/server";
import { createAdminClient } from "@vinfast3s/supabase/admin";
import { mapLeadRow } from "@vinfast3s/supabase/leads";
import { isSupabaseConfigured, type Json, type TablesUpdate } from "@vinfast3s/supabase";

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ leads: [], configured: false });
  }

  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[api/leads] fetch failed:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    configured: true,
    leads: (data ?? []).map(mapLeadRow),
  });
}

export async function PATCH(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Database chưa được cấu hình" }, { status: 503 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const id = typeof body.id === "string" ? body.id : null;
  if (!id) {
    return NextResponse.json({ error: "Missing lead id" }, { status: 400 });
  }

  const updates: TablesUpdate<"leads"> = {};
  if (typeof body.status === "string") {
    updates.status = body.status as TablesUpdate<"leads">["status"];
  }
  if (typeof body.message === "string") {
    updates.message = body.message;
  }

  const admin = createAdminClient();
  const { data: existing } = await admin.from("leads").select("metadata").eq("id", id).single();

  if (body.assignedTo !== undefined || body.type !== undefined) {
    const metadata: Json =
      existing?.metadata && typeof existing.metadata === "object" && !Array.isArray(existing.metadata)
        ? { ...(existing.metadata as Record<string, Json | undefined>) }
        : {};

    if (body.assignedTo !== undefined) {
      metadata.assignedTo = String(body.assignedTo);
    }
    if (typeof body.type === "string") {
      metadata.type = body.type;
    }
    updates.metadata = metadata;
  }

  const { error } = await admin.from("leads").update(updates).eq("id", id);

  if (error) {
    console.error("[api/leads] update failed:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
