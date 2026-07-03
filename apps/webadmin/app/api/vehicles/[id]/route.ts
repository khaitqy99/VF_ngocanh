import { NextResponse } from "next/server";
import { createAdminClient } from "@vinfast3s/supabase/admin";
import { isSupabaseConfigured } from "@vinfast3s/supabase";
import type { Json, TablesInsert, TablesUpdate } from "@vinfast3s/supabase";
import { revalidateWebclient, vehicleRevalidatePayload } from "@/lib/revalidate-webclient";

type VehiclePatchBody = {
  patches?: Record<string, unknown>;
  vehicleType?: "car" | "scooter";
  status?: "draft" | "published" | "archived";
};

const VALID_STATUSES = new Set(["draft", "published", "archived"]);
const PATCH_PATH_RE = /^[a-zA-Z0-9_.-]+$/;

function setAtPath(root: Record<string, unknown>, path: string, value: unknown) {
  const keys = path.split(".");
  let cur: Record<string, unknown> = root;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]!;
    const nextKey = keys[i + 1]!;
    const existing = cur[key];
    if (!existing || typeof existing !== "object") {
      cur[key] = /^\d+$/.test(nextKey) ? [] : {};
    }
    cur = cur[key] as Record<string, unknown>;
  }
  cur[keys[keys.length - 1]!] = value;
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function asNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value.replace(/\./g, "").replace(/[^\d.-]/g, ""));
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

function asJsonArray(value: unknown): Json[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value as Json[];
}

function mergeDetailWithPatches(detail: unknown, patches: Record<string, unknown>) {
  if (!detail || typeof detail !== "object" || Array.isArray(detail)) return undefined;
  const next = structuredClone(detail) as Record<string, unknown>;
  for (const [path, value] of Object.entries(patches)) {
    if (path === "_updatedAt") continue;
    setAtPath(next, path, value);
  }
  return next;
}

function syncVehicleColumnsFromPatches(
  target: TablesUpdate<"vehicles">,
  patches: Record<string, unknown>,
  currentDetail?: Record<string, unknown>,
): string | null {
  const detailPatched = currentDetail
    ? (mergeDetailWithPatches(currentDetail, patches) as Record<string, unknown> | undefined)
    : undefined;
  const source = detailPatched ?? patches;

  const nextName = asString(patches.name) ?? asString(source.name);
  if (nextName) target.name = nextName;

  const nextTagline =
    asString(patches.tagline) ?? asString(patches.subtitle) ?? asString(source.tagline);
  if (nextTagline !== undefined) target.tagline = nextTagline;

  const nextSlogan = asString(patches.slogan) ?? asString(source.slogan);
  if (nextSlogan !== undefined) target.slogan = nextSlogan;

  const nextPrice = asNumber(patches.price) ?? asNumber(source.price);
  if (nextPrice !== undefined) {
    if (nextPrice < 0) return "Giá không được âm";
    target.starting_price = nextPrice;
  }

  const nextImage = asString(patches.image) ?? asString(source.image);
  if (nextImage) target.hero_image_url = nextImage;

  const nextGallery = asJsonArray(source.gallery);
  if (nextGallery) target.gallery = nextGallery;

  const nextColors = asJsonArray(source.colors);
  if (nextColors) target.colors = nextColors;

  const nextVariants = asJsonArray(source.variants);
  if (nextVariants) target.variants = nextVariants;

  return null;
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Database chưa được cấu hình" }, { status: 503 });
  }

  const { id } = await context.params;
  let body: VehiclePatchBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const patches = body.patches ?? {};
  const hasPatches = Object.keys(patches).length > 0;
  const hasStatus = body.status !== undefined;
  if (!hasPatches && !hasStatus) {
    return NextResponse.json({ error: "Không có thay đổi để lưu" }, { status: 400 });
  }
  if (hasStatus && !VALID_STATUSES.has(body.status!)) {
    return NextResponse.json({ error: "Trạng thái không hợp lệ" }, { status: 400 });
  }
  if (Object.keys(patches).length > 300) {
    return NextResponse.json({ error: "Số lượng thay đổi vượt giới hạn" }, { status: 400 });
  }
  for (const key of Object.keys(patches)) {
    if (key.length > 120 || !PATCH_PATH_RE.test(key)) {
      return NextResponse.json({ error: `Path patch không hợp lệ: ${key}` }, { status: 400 });
    }
  }

  const admin = createAdminClient();
  const { data: existing, error: fetchError } = await admin
    .from("vehicles")
    .select("content, type")
    .eq("id", id)
    .maybeSingle();

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  const currentContent =
    existing?.content && typeof existing.content === "object" && !Array.isArray(existing.content)
      ? (existing.content as Record<string, Json | undefined>)
      : {};

  const adminPatches =
    currentContent.admin_patches &&
    typeof currentContent.admin_patches === "object" &&
    !Array.isArray(currentContent.admin_patches)
      ? (currentContent.admin_patches as Record<string, Json | undefined>)
      : {};

  const nextContent = (hasPatches
    ? {
        ...currentContent,
        ...(currentContent.detail
          ? {
              detail: mergeDetailWithPatches(
                currentContent.detail as Record<string, unknown>,
                patches,
              ),
            }
          : {}),
        admin_patches: {
          ...adminPatches,
          ...patches,
          _updatedAt: new Date().toISOString(),
        },
      }
    : currentContent) as Json;

  const vehicleType: "car" | "scooter" =
    existing?.type === "scooter" || existing?.type === "car"
      ? existing.type
      : body.vehicleType === "scooter"
        ? "scooter"
        : "car";

  if (existing) {
    const updatePayload: TablesUpdate<"vehicles"> = { content: nextContent };
    if (body.status) {
      updatePayload.status = body.status;
    }

    const currentDetail =
      currentContent.detail && typeof currentContent.detail === "object" && !Array.isArray(currentContent.detail)
        ? (currentContent.detail as Record<string, unknown>)
        : undefined;

    if (hasPatches) {
      const columnError = syncVehicleColumnsFromPatches(updatePayload, patches, currentDetail);
      if (columnError) {
        return NextResponse.json({ error: columnError }, { status: 400 });
      }
    }

    const { error } = await admin.from("vehicles").update(updatePayload).eq("id", id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await revalidateWebclient(vehicleRevalidatePayload(id, vehicleType));

    return NextResponse.json({ ok: true, mode: "update" });
  }
  const insertPayload: TablesInsert<"vehicles"> = {
    id,
    type: vehicleType,
    name: asString(patches.name) ?? id,
    slug: id,
    status: body.status ?? "published",
    content: nextContent,
  };
  if (hasPatches) {
    const columnError = syncVehicleColumnsFromPatches(insertPayload, patches);
    if (columnError) {
      return NextResponse.json({ error: columnError }, { status: 400 });
    }
  }
  const { error } = await admin.from("vehicles").insert(insertPayload);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await revalidateWebclient(vehicleRevalidatePayload(id, vehicleType));

  return NextResponse.json({ ok: true, mode: "insert" });
}
