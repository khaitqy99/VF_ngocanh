import { NextResponse } from "next/server";
import { createAdminClient } from "@vinfast3s/supabase/admin";
import { isSupabaseConfigured, type Json, type TablesInsert } from "@vinfast3s/supabase";
import {
  DEFAULT_HOME_SECTIONS,
  mergeHomeSections,
  type HomeBannerInput,
  type HomeSectionsContent,
  type HomeFeaturedPrices,
  type HomeFeaturedSlideOverrides,
} from "@/lib/cms/home-content";
import { parseHomeCms } from "@webclient/lib/cms/mappers";
import { VINFAST_FEATURED_CARS, VINFAST_FEATURED_SCOOTERS } from "@webclient/lib/vinfast-home";
import { homePageRevalidatePayload, revalidateWebclient } from "@/lib/revalidate-webclient";

type HomePagePayload = {
  sections?: HomeSectionsContent;
  featuredCarIds?: string[];
  featuredScooterIds?: string[];
  featuredAccessoryIds?: string[];
  featuredCarPrices?: HomeFeaturedPrices;
  featuredScooterPrices?: HomeFeaturedPrices;
  featuredCarSlideOverrides?: HomeFeaturedSlideOverrides;
  featuredScooterSlideOverrides?: HomeFeaturedSlideOverrides;
  banners?: HomeBannerInput[];
  status?: "draft" | "published";
};

function defaultFeaturedCarIds(): string[] {
  return VINFAST_FEATURED_CARS.map((slide) => {
    const match = slide.href?.match(/^\/oto\/([^/?#]+)/);
    return match?.[1] ?? "";
  }).filter(Boolean);
}

function defaultFeaturedScooterIds(): string[] {
  return VINFAST_FEATURED_SCOOTERS.map((slide) => {
    const match = slide.href?.match(/^\/xe-may-dien\/([^/?#]+)/);
    return match?.[1] ?? "";
  }).filter(Boolean);
}

function mapBannerRow(row: {
  id: string;
  desktop_image_url: string | null;
  mobile_image_url: string | null;
  alt_text: string | null;
  sort_order: number;
}): HomeBannerInput {
  return {
    id: row.id,
    desktop: row.desktop_image_url ?? "",
    mobile: row.mobile_image_url ?? "",
    alt: row.alt_text ?? "",
    sortOrder: row.sort_order,
  };
}

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      configured: false,
      sections: DEFAULT_HOME_SECTIONS,
      featuredCarIds: defaultFeaturedCarIds(),
      featuredScooterIds: defaultFeaturedScooterIds(),
    featuredCarPrices: {},
    featuredScooterPrices: {},
    featuredAccessoryIds: [],
    featuredCarSlideOverrides: {},
    featuredScooterSlideOverrides: {},
    banners: [],
      status: "draft",
      cars: [],
      scooters: [],
    });
  }

  const admin = createAdminClient();
  const [pageResult, bannersResult, carsResult, scootersResult] = await Promise.all([
    admin.from("cms_pages").select("content, status").eq("slug", "home").maybeSingle(),
    admin
      .from("banners")
      .select("id, desktop_image_url, mobile_image_url, alt_text, sort_order")
      .eq("placement", "home")
      .order("sort_order", { ascending: true }),
    admin
      .from("vehicles")
      .select("id, name, type, status")
      .eq("type", "car")
      .order("sort_order", { ascending: true }),
    admin
      .from("vehicles")
      .select("id, name, type, status")
      .eq("type", "scooter")
      .order("sort_order", { ascending: true }),
  ]);

  if (pageResult.error) {
    return NextResponse.json({ error: pageResult.error.message }, { status: 500 });
  }
  if (bannersResult.error) {
    return NextResponse.json({ error: bannersResult.error.message }, { status: 500 });
  }
  if (carsResult.error) {
    return NextResponse.json({ error: carsResult.error.message }, { status: 500 });
  }
  if (scootersResult.error) {
    return NextResponse.json({ error: scootersResult.error.message }, { status: 500 });
  }

  const parsed = pageResult.data?.content ? parseHomeCms(pageResult.data.content) : null;
  const contentObj = (pageResult.data?.content ?? {}) as Record<string, unknown>;

  return NextResponse.json({
    configured: true,
    sections: mergeHomeSections(contentObj.sections),
    featuredCarIds: parsed?.featuredCarIds?.length
      ? parsed.featuredCarIds
      : defaultFeaturedCarIds(),
    featuredScooterIds: parsed?.featuredScooterIds?.length
      ? parsed.featuredScooterIds
      : defaultFeaturedScooterIds(),
    featuredCarPrices: parsed?.featuredCarPrices ?? {},
    featuredScooterPrices: parsed?.featuredScooterPrices ?? {},
    featuredAccessoryIds: parsed?.featuredAccessoryIds ?? [],
    featuredCarSlideOverrides: parsed?.featuredCarSlideOverrides ?? {},
    featuredScooterSlideOverrides: parsed?.featuredScooterSlideOverrides ?? {},
    banners: (bannersResult.data ?? []).map(mapBannerRow),
    status: pageResult.data?.status ?? "published",
    cars: (carsResult.data ?? []).map((row) => ({
      id: row.id,
      name: row.name,
      status: row.status,
    })),
    scooters: (scootersResult.data ?? []).map((row) => ({
      id: row.id,
      name: row.name,
      status: row.status,
    })),
  });
}

async function syncHomeBanners(admin: ReturnType<typeof createAdminClient>, banners: HomeBannerInput[]) {
  const { data: existing } = await admin
    .from("banners")
    .select("id")
    .eq("placement", "home");

  const existingIds = new Set((existing ?? []).map((row) => row.id));
  const incomingIds = new Set(banners.filter((banner) => banner.id).map((banner) => banner.id!));

  const toDelete = [...existingIds].filter((id) => !incomingIds.has(id));
  if (toDelete.length) {
    const { error } = await admin.from("banners").delete().in("id", toDelete);
    if (error) throw new Error(error.message);
  }

  for (const [index, banner] of banners.entries()) {
    const payload = {
      placement: "home" as const,
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

export async function PATCH(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Database chưa được cấu hình" }, { status: 503 });
  }

  let body: HomePagePayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: existing } = await admin
    .from("cms_pages")
    .select("content")
    .eq("slug", "home")
    .maybeSingle();

  const currentContent = (existing?.content ?? {}) as Record<string, unknown>;
  const nextContent: Record<string, unknown> = {
    ...currentContent,
    sections: body.sections ?? currentContent.sections ?? DEFAULT_HOME_SECTIONS,
    featuredCarIds: body.featuredCarIds ?? currentContent.featuredCarIds ?? defaultFeaturedCarIds(),
    featuredScooterIds:
      body.featuredScooterIds ?? currentContent.featuredScooterIds ?? defaultFeaturedScooterIds(),
    featuredCarPrices: body.featuredCarPrices ?? currentContent.featuredCarPrices ?? {},
    featuredScooterPrices:
      body.featuredScooterPrices ?? currentContent.featuredScooterPrices ?? {},
    featuredAccessoryIds:
      body.featuredAccessoryIds ?? currentContent.featuredAccessoryIds ?? [],
    featuredCarSlideOverrides:
      body.featuredCarSlideOverrides ?? currentContent.featuredCarSlideOverrides ?? {},
    featuredScooterSlideOverrides:
      body.featuredScooterSlideOverrides ?? currentContent.featuredScooterSlideOverrides ?? {},
  };

  if (existing) {
    const { error } = await admin
      .from("cms_pages")
      .update({
        content: nextContent as Json,
        status: body.status ?? "published",
        updated_at: new Date().toISOString(),
      })
      .eq("slug", "home");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  } else {
    const insertPayload: TablesInsert<"cms_pages"> = {
      slug: "home",
      title: "Trang chủ",
      status: body.status ?? "published",
      content: nextContent as Json,
      seo: {},
    };
    const { error } = await admin.from("cms_pages").insert(insertPayload);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  if (body.banners) {
    try {
      await syncHomeBanners(admin, body.banners);
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Không lưu được banner" },
        { status: 500 },
      );
    }
  }

  await revalidateWebclient(homePageRevalidatePayload());
  return NextResponse.json({ ok: true });
}
