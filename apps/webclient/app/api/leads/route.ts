import { NextResponse } from "next/server";
import { createAdminClient } from "@vinfast3s/supabase/admin";
import { isSupabaseAdminConfigured, isSupabaseConfigured } from "@vinfast3s/supabase";
import {
  SERVICE_TO_LEAD_TYPE,
  toLeadInsert,
  type CreateLeadInput,
} from "@vinfast3s/supabase/leads";

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Database chưa được cấu hình. Thêm biến môi trường Supabase vào file .env ở root." },
      { status: 503 },
    );
  }

  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json(
      { error: "Server chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." },
      { status: 503 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const fullName = String(body.fullName ?? body.full_name ?? "").trim();
  const phone = String(body.phone ?? "").trim();

  if (!fullName || !phone) {
    return NextResponse.json({ error: "Họ tên và số điện thoại là bắt buộc" }, { status: 400 });
  }

  const service = typeof body.service === "string" ? body.service : undefined;
  const input: CreateLeadInput = {
    fullName,
    phone,
    email: typeof body.email === "string" ? body.email : undefined,
    type:
      (body.type as CreateLeadInput["type"]) ??
      (service ? SERVICE_TO_LEAD_TYPE[service] : undefined) ??
      "general",
    vehicleInterest:
      typeof body.vehicleInterest === "string"
        ? body.vehicleInterest
        : typeof body.vehicle_interest === "string"
          ? body.vehicle_interest
          : typeof body.vehicleName === "string"
            ? body.vehicleName
            : undefined,
    source: (body.source as CreateLeadInput["source"]) ?? "website",
    message: typeof body.message === "string" ? body.message : service,
  };

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("leads")
    .insert(toLeadInsert(input))
    .select("id")
    .single();

  if (error) {
    console.error("[api/leads] insert failed:", error.message);
    return NextResponse.json(
      { error: "Không thể gửi yêu cầu. Vui lòng thử lại." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, id: data.id });
}
