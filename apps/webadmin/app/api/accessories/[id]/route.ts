import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { createAdminClient } from "@vinfast3s/supabase/admin";
import { isSupabaseConfigured } from "@vinfast3s/supabase";
import type { Json, TablesInsert, TablesUpdate } from "@vinfast3s/supabase";
import { accessoryRevalidatePayload, revalidateWebclient } from "@/lib/revalidate-webclient";
import { ADMIN_MEDIA_CACHE_TAG } from "@/lib/media-revalidate";

type AccessoryPatchBody = {
  patches?: Record<string, unknown>;
  status?: "draft" | "published" | "archived";
};
const VALID_STATUSES = new Set(["draft", "published", "archived"]);
const PATCH_PATH_RE = /^[a-zA-Z0-9_.-]+$/;

type AccessoryContent = {
  vehicles?: string[];
  badge?: string;
  [key: string]: Json | undefined;
};

function asString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function asNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

function asBoolean(value: unknown): boolean | undefined {
  return typeof value === "boolean" ? value : undefined;
}

function asStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const arr = value.filter((item): item is string => typeof item === "string");
  return arr;
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Database chưa được cấu hình" }, { status: 503 });
  }

  const { id } = await context.params;
  let body: AccessoryPatchBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const patches = body.patches ?? {};
  if (Object.keys(patches).length === 0 && body.status === undefined) {
    return NextResponse.json({ error: "Không có thay đổi để lưu" }, { status: 400 });
  }
  if (body.status !== undefined && !VALID_STATUSES.has(body.status)) {
    return NextResponse.json({ error: "Trạng thái không hợp lệ" }, { status: 400 });
  }
  if (Object.keys(patches).length > 200) {
    return NextResponse.json({ error: "Số lượng thay đổi vượt giới hạn" }, { status: 400 });
  }
  for (const key of Object.keys(patches)) {
    if (key.length > 120 || !PATCH_PATH_RE.test(key)) {
      return NextResponse.json({ error: `Path patch không hợp lệ: ${key}` }, { status: 400 });
    }
  }

  const admin = createAdminClient();
  const { data: existing, error: fetchError } = await admin
    .from("accessories")
    .select("content, slug")
    .eq("id", id)
    .maybeSingle();

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  const currentContent =
    existing?.content && typeof existing.content === "object" && !Array.isArray(existing.content)
      ? (existing.content as AccessoryContent)
      : {};

  const updatePayload: TablesUpdate<"accessories"> = {
    content:
      Object.keys(patches).length > 0
        ? ({
            ...currentContent,
            ...patches,
            _updatedAt: new Date().toISOString(),
          } satisfies Json)
        : (currentContent as Json),
  };
  if (body.status) {
    updatePayload.status = body.status;
  }

  const mergedContent: AccessoryContent =
    Object.keys(patches).length > 0
      ? (updatePayload.content as AccessoryContent)
      : currentContent;

  const name = asString(mergedContent.name) ?? asString(patches.name);
  const description = asString(mergedContent.description) ?? asString(patches.description);
  const image = asString(mergedContent.image) ?? asString(patches.image);
  const category = asString(mergedContent.category) ?? asString(patches.category);
  const price = asNumber(mergedContent.price) ?? asNumber(patches.price);
  const inStock = asBoolean(mergedContent.inStock) ?? asBoolean(patches.inStock);

  if (name !== undefined) {
    if (!name.trim()) {
      return NextResponse.json({ error: "Tên phụ kiện không được để trống" }, { status: 400 });
    }
    updatePayload.name = name.trim();
  }
  if (description !== undefined) updatePayload.description = description.trim();
  if (image !== undefined) updatePayload.image_url = image;
  if (category !== undefined) updatePayload.category = category;
  if (price !== undefined) {
    if (price < 0) {
      return NextResponse.json({ error: "Giá phụ kiện không được âm" }, { status: 400 });
    }
    updatePayload.price = price;
  }
  if (inStock !== undefined) updatePayload.in_stock = inStock;

  const vehicles = asStringArray(mergedContent.vehicles) ?? asStringArray(patches.vehicles);
  const badge = asString(mergedContent.badge) ?? asString(patches.badge);
  if (vehicles !== undefined || badge !== undefined) {
    const nextContent: AccessoryContent =
      (updatePayload.content as AccessoryContent | undefined) ?? currentContent;
    if (vehicles !== undefined) nextContent.vehicles = vehicles;
    if (badge !== undefined) nextContent.badge = badge;
    updatePayload.content = nextContent as Json;
  }

  if (!existing) {
    const insertPayload: TablesInsert<"accessories"> = {
      id,
      name: asString(patches.name) ?? id,
      slug: id,
      status: body.status ?? "published",
      content: (updatePayload.content as Json) ?? (currentContent as Json),
      description: asString(patches.description),
      image_url: asString(patches.image),
      category: asString(patches.category),
      price: asNumber(patches.price),
      in_stock: asBoolean(patches.inStock) ?? true,
    };
    const { error } = await admin.from("accessories").insert(insertPayload);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    await revalidateWebclient(accessoryRevalidatePayload(id, id));
    revalidateTag("admin-cms-accessories");
    revalidateTag(ADMIN_MEDIA_CACHE_TAG);
    return NextResponse.json({ ok: true, mode: "insert" });
  }

  const { data: updated, error } = await admin
    .from("accessories")
    .update(updatePayload)
    .eq("id", id)
    .select("id")
    .maybeSingle();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!updated) {
    return NextResponse.json({ error: "Không tìm thấy phụ kiện để cập nhật" }, { status: 404 });
  }

  await revalidateWebclient(accessoryRevalidatePayload(id, existing.slug ?? id));
  revalidateTag("admin-cms-accessories");
  revalidateTag(ADMIN_MEDIA_CACHE_TAG);

  return NextResponse.json({ ok: true, mode: "update" });
}
