import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { isSupabaseConfigured } from "@vinfast3s/supabase";
import { getSessionAdmin } from "@/lib/auth";
import { createVehicleFromClone, type CreateVehiclePayload } from "@/lib/product-api";
import { revalidateWebclient, vehicleRevalidatePayload } from "@/lib/revalidate-webclient";
import { ADMIN_MEDIA_CACHE_TAG } from "@/lib/media-revalidate";
import { getVehicleCatalogItems } from "@/lib/product-catalog";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  if (type === "car") {
    return NextResponse.json({ items: await getVehicleCatalogItems("car") });
  }

  if (type === "scooter") {
    return NextResponse.json({ items: await getVehicleCatalogItems("scooter") });
  }

  return NextResponse.json({ error: "Thiếu type=car hoặc type=scooter" }, { status: 400 });
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Database chưa được cấu hình" }, { status: 503 });
  }

  const session = await getSessionAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: CreateVehiclePayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (body.type !== "car" && body.type !== "scooter") {
    return NextResponse.json({ error: "type phải là car hoặc scooter" }, { status: 400 });
  }

  try {
    const vehicle = await createVehicleFromClone(body);
    const revalidated = await revalidateWebclient(
      vehicleRevalidatePayload(vehicle.id, body.type, vehicle.slug),
    );
    revalidateTag(body.type === "car" ? "admin-cms-cars" : "admin-cms-scooters");
    revalidateTag(ADMIN_MEDIA_CACHE_TAG);
    return NextResponse.json({ vehicle, revalidated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Tạo sản phẩm thất bại";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
