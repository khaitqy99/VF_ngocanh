import { NextResponse } from "next/server";
import { createAdminClient } from "@vinfast3s/supabase/admin";
import { isSupabaseConfigured, type Json, type TablesInsert } from "@vinfast3s/supabase";
import type { Database } from "@vinfast3s/supabase";
import {
  getDefaultStaticPageContent,
  isStaticPageSlug,
  mergeStaticPageContent,
  STATIC_PAGE_META,
  type CmsBannerInput,
  type StaticPageSlug,
} from "@/lib/cms/static-pages";
import { staticPageRevalidatePayload, revalidateWebclient } from "@/lib/revalidate-webclient";

type BannerPlacement = Database["public"]["Enums"]["banner_placement"];

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
  placement: BannerPlacement,
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

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;

  if (!isStaticPageSlug(slug)) {
    return NextResponse.json({ error: "Trang không hợp lệ" }, { status: 404 });
  }

  const meta = STATIC_PAGE_META[slug];
  const defaults = getDefaultStaticPageContent(slug);

  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      configured: false,
      slug,
      label: meta.label,
      path: meta.path,
      content: defaults,
      banners: [],
      status: "draft",
    });
  }

  const admin = createAdminClient();
  const pagePromise = admin
    .from("cms_pages")
    .select("content, status")
    .eq("slug", slug)
    .maybeSingle();

  const bannerPlacement = meta.bannerPlacement;
  const bannersPromise = bannerPlacement
    ? admin
        .from("banners")
        .select("id, desktop_image_url, mobile_image_url, alt_text, sort_order")
        .eq("placement", bannerPlacement)
        .order("sort_order", { ascending: true })
    : Promise.resolve({ data: [], error: null });

  const [pageResult, bannersResult] = await Promise.all([pagePromise, bannersPromise]);

  if (pageResult.error) {
    return NextResponse.json({ error: pageResult.error.message }, { status: 500 });
  }
  if (bannersResult.error) {
    return NextResponse.json({ error: bannersResult.error.message }, { status: 500 });
  }

  return NextResponse.json({
    configured: true,
    slug,
    label: meta.label,
    path: meta.path,
    content: mergeStaticPageContent(slug, pageResult.data?.content),
    banners: (bannersResult.data ?? []).map(mapBannerRow),
    status: pageResult.data?.status ?? "draft",
    bannerPlacement: bannerPlacement ?? null,
  });
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;

  if (!isStaticPageSlug(slug)) {
    return NextResponse.json({ error: "Trang không hợp lệ" }, { status: 404 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Database chưa được cấu hình" }, { status: 503 });
  }

  let body: {
    content?: Record<string, unknown>;
    banners?: CmsBannerInput[];
    status?: "draft" | "published";
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const admin = createAdminClient();
  const meta = STATIC_PAGE_META[slug];
  const title = meta.label;

  const { data: existing } = await admin
    .from("cms_pages")
    .select("content")
    .eq("slug", slug)
    .maybeSingle();

  const nextContent = (body.content ?? existing?.content ?? {}) as Json;

  if (existing) {
    const { error } = await admin
      .from("cms_pages")
      .update({
        content: nextContent,
        status: body.status ?? "published",
        updated_at: new Date().toISOString(),
      })
      .eq("slug", slug);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  } else {
    const insertPayload: TablesInsert<"cms_pages"> = {
      slug,
      title,
      status: body.status ?? "published",
      content: nextContent,
      seo: {},
    };
    const { error } = await admin.from("cms_pages").insert(insertPayload);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  if (body.banners && meta.bannerPlacement) {
    try {
      await syncBanners(admin, meta.bannerPlacement, body.banners);
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Không lưu được banner" },
        { status: 500 },
      );
    }
  }

  const revalidated = await revalidateWebclient(staticPageRevalidatePayload(slug));
  return NextResponse.json({ ok: true, revalidated });
}
