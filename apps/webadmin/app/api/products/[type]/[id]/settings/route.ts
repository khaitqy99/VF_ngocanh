import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { isSupabaseConfigured } from "@vinfast3s/supabase";
import { getSessionAdmin } from "@/lib/auth";
import type { ProductType } from "@/lib/product-api";
import {
  getAdminAccessoryMeta,
  getAdminVehicleMeta,
  updateProductSettings,
  type ProductSettingsPayload,
  type PublishStatus,
} from "@/lib/product-meta";
import {
  accessoryRevalidatePayload,
  revalidateWebclient,
  vehicleRevalidatePayload,
} from "@/lib/revalidate-webclient";
import { ADMIN_MEDIA_CACHE_TAG } from "@/lib/media-revalidate";

const VALID_TYPES = new Set<ProductType>(["car", "scooter", "accessory"]);
const VALID_STATUSES = new Set<PublishStatus>(["draft", "published", "archived"]);

function parseType(value: string): ProductType | null {
  return VALID_TYPES.has(value as ProductType) ? (value as ProductType) : null;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ type: string; id: string }> },
) {
  const session = await getSessionAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { type: rawType, id } = await context.params;
  const type = parseType(rawType);
  if (!type) return NextResponse.json({ error: "Loại sản phẩm không hợp lệ" }, { status: 400 });

  const meta =
    type === "accessory"
      ? await getAdminAccessoryMeta(id)
      : await getAdminVehicleMeta(id, type);
  if (!meta) return NextResponse.json({ error: "Không tìm thấy sản phẩm" }, { status: 404 });

  return NextResponse.json({ meta });
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ type: string; id: string }> },
) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Database chưa được cấu hình" }, { status: 503 });
  }

  const session = await getSessionAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { type: rawType, id } = await context.params;
  const type = parseType(rawType);
  if (!type) return NextResponse.json({ error: "Loại sản phẩm không hợp lệ" }, { status: 400 });

  let body: ProductSettingsPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (body.status !== undefined && !VALID_STATUSES.has(body.status)) {
    return NextResponse.json({ error: "Trạng thái không hợp lệ" }, { status: 400 });
  }

  try {
    const meta = await updateProductSettings(type, id, body);

    if (type === "accessory") {
      await revalidateWebclient(accessoryRevalidatePayload(id, meta.slug));
      revalidateTag("admin-cms-accessories");
    } else {
      await revalidateWebclient(vehicleRevalidatePayload(id, type, meta.slug));
      revalidateTag(type === "car" ? "admin-cms-cars" : "admin-cms-scooters");
    }
    revalidateTag(ADMIN_MEDIA_CACHE_TAG);

    return NextResponse.json({ meta });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Lưu thất bại";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
