import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { isSupabaseConfigured } from "@vinfast3s/supabase";
import { getSessionAdmin } from "@/lib/auth";
import { createAccessoryFromClone, type CreateAccessoryPayload } from "@/lib/product-api";
import { accessoryRevalidatePayload, revalidateWebclient } from "@/lib/revalidate-webclient";
import { ADMIN_MEDIA_CACHE_TAG } from "@/lib/media-revalidate";
import { getAccessoryCatalogItems } from "@/lib/product-catalog";

export async function GET() {
  return NextResponse.json({ items: await getAccessoryCatalogItems() });
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Database chưa được cấu hình" }, { status: 503 });
  }

  const session = await getSessionAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: CreateAccessoryPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const accessory = await createAccessoryFromClone(body);
    const revalidated = await revalidateWebclient(
      accessoryRevalidatePayload(accessory.id, accessory.slug),
    );
    revalidateTag("admin-cms-accessories");
    revalidateTag(ADMIN_MEDIA_CACHE_TAG);
    return NextResponse.json({ accessory, revalidated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Tạo phụ kiện thất bại";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
