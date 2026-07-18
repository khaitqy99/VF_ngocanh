import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { isSupabaseConfigured } from "@vinfast3s/supabase";
import { getSessionAdmin } from "@/lib/auth";
import type { ProductType } from "@/lib/product-api";
import { updateProductSortOrder } from "@/lib/product-sort";
import {
  accessoryRevalidatePayload,
  revalidateWebclient,
  vehicleRevalidatePayload,
} from "@/lib/revalidate-webclient";
import { ADMIN_MEDIA_CACHE_TAG } from "@/lib/media-revalidate";

type SortBody = {
  kind?: ProductType;
  orderedIds?: string[];
};

export async function PATCH(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Database chưa được cấu hình" }, { status: 503 });
  }

  const session = await getSessionAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: SortBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const kind = body.kind;
  const orderedIds = body.orderedIds;
  if (kind !== "car" && kind !== "scooter" && kind !== "accessory") {
    return NextResponse.json({ error: "kind không hợp lệ" }, { status: 400 });
  }
  if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
    return NextResponse.json({ error: "orderedIds là bắt buộc" }, { status: 400 });
  }
  if (orderedIds.length > 200) {
    return NextResponse.json({ error: "Quá nhiều sản phẩm trong một lần sắp xếp" }, { status: 400 });
  }

  try {
    await updateProductSortOrder(kind, orderedIds);

    let revalidated = false;
    if (kind === "accessory") {
      revalidated = await revalidateWebclient(accessoryRevalidatePayload("catalog"));
      revalidateTag("admin-cms-accessories");
    } else {
      revalidated = await revalidateWebclient(vehicleRevalidatePayload("catalog", kind));
      revalidateTag(kind === "car" ? "admin-cms-cars" : "admin-cms-scooters");
    }
    revalidateTag(ADMIN_MEDIA_CACHE_TAG);

    return NextResponse.json({ ok: true, revalidated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Sắp xếp thất bại";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
