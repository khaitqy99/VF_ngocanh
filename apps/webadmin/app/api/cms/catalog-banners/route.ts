import { NextResponse } from "next/server";
import { createAdminClient } from "@vinfast3s/supabase/admin";
import { isSupabaseConfigured, type TablesInsert } from "@vinfast3s/supabase";
import type { Database } from "@vinfast3s/supabase";
import type { CmsBannerInput } from "@/lib/cms/static-pages";
import { revalidateWebclient } from "@/lib/revalidate-webclient";

type CatalogPlacement = Extract<
  Database["public"]["Enums"]["banner_placement"],
  "cars" | "scooters" | "accessories"
>;

const CATALOG_PLACEMENTS: CatalogPlacement[] = ["cars", "scooters", "accessories"];

const PLACEMENT_META: Record<
  CatalogPlacement,
  { label: string; path: string; tag: string }
> = {
  cars: { label: "Ô tô", path: "/oto", tag: "cms-banners-cars" },
  scooters: { label: "Xe máy điện", path: "/xe-may-dien", tag: "cms-banners-scooters" },
  accessories: { label: "Phụ kiện", path: "/phu-kien", tag: "cms-banners-accessories" },
};

function isCatalogPlacement(value: string): value is CatalogPlacement {
  return CATALOG_PLACEMENTS.includes(value as CatalogPlacement);
}

function mapBannerRow(row: {
  id: string;
  desktop_image_url: string | null;
  mobile_image_url: string | null;
  alt_text: string | null;
  sort_order: number;
}): CmsBannerInput {
  return {
    id: row.id,
    desktop: row.desktop_image_url ?? "",
    mobile: row.mobile_image_url ?? "",
    alt: row.alt_text ?? "",
    sortOrder: row.sort_order,
  };
}

async function syncBanners(
  admin: ReturnType<typeof createAdminClient>,
  placement: CatalogPlacement,
  banners: CmsBannerInput[],
) {
  const { data: existing } = await admin.from("banners").select("id").eq("placement", placement);

  const existingIds = new Set((existing ?? []).map((row) => row.id));
  const incomingIds = new Set(banners.filter((banner) => banner.id).map((banner) => banner.id!));

  const toDelete = [...existingIds].filter((id) => !incomingIds.has(id));
  if (toDelete.length) {
    const { error } = await admin.from("banners").delete().in("id", toDelete);
    if (error) throw new Error(error.message);
  }

  for (const [index, banner] of banners.entries()) {
    const payload = {
      placement,
      title: banner.alt.slice(0, 120) || `Banner ${index + 1}`,
      alt_text: banner.alt,
      desktop_image_url: banner.desktop,
      mobile_image_url: banner.mobile || banner.desktop,
      status: "published" as const,
      sort_order: index,
      updated_at: new Date().toISOString(),
    };

    if (banner.id && existingIds.has(banner.id)) {
      const { error } = await admin.from("banners").update(payload).eq("id", banner.id);
      if (error) throw new Error(error.message);
      continue;
    }

    const insertPayload: TablesInsert<"banners"> = payload;
    const { error } = await admin.from("banners").insert(insertPayload);
    if (error) throw new Error(error.message);
  }
}

export async function GET(request: Request) {
  const placementParam = new URL(request.url).searchParams.get("placement") ?? "cars";
  if (!isCatalogPlacement(placementParam)) {
    return NextResponse.json({ error: "Placement không hợp lệ" }, { status: 400 });
  }

  const meta = PLACEMENT_META[placementParam];

  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      configured: false,
      placement: placementParam,
      label: meta.label,
      path: meta.path,
      banners: [],
    });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("banners")
    .select("id, desktop_image_url, mobile_image_url, alt_text, sort_order")
    .eq("placement", placementParam)
    .order("sort_order", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    configured: true,
    placement: placementParam,
    label: meta.label,
    path: meta.path,
    banners: (data ?? []).map(mapBannerRow),
  });
}

export async function PATCH(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Database chưa được cấu hình" }, { status: 503 });
  }

  let body: { placement?: string; banners?: CmsBannerInput[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.placement || !isCatalogPlacement(body.placement)) {
    return NextResponse.json({ error: "Placement không hợp lệ" }, { status: 400 });
  }
  if (!Array.isArray(body.banners)) {
    return NextResponse.json({ error: "Thiếu banners" }, { status: 400 });
  }

  const admin = createAdminClient();
  try {
    await syncBanners(admin, body.placement, body.banners);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Lưu banner thất bại" },
      { status: 500 },
    );
  }

  const meta = PLACEMENT_META[body.placement];
  const revalidated = await revalidateWebclient({
    tags: ["cms", "cms-banners", meta.tag],
    paths: [meta.path, `${meta.path}/preview`],
  });

  return NextResponse.json({ ok: true, revalidated });
}
