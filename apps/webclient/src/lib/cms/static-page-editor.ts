import { unstable_cache } from "next/cache";
import { createAnonClient } from "@vinfast3s/supabase/anon";
import { isSupabaseConfigured } from "@vinfast3s/supabase";
import type { Database } from "@vinfast3s/supabase";
import {
  getDefaultStaticPageContent,
  mergeStaticPageContent,
  STATIC_PAGE_META,
  type CmsBannerInput,
  type StaticPageSlug,
} from "./static-pages";

type BannerPlacement = Database["public"]["Enums"]["banner_placement"];

export type StaticPageEditorData = {
  slug: StaticPageSlug;
  content: ReturnType<typeof getDefaultStaticPageContent>;
  banners: CmsBannerInput[];
  status: "draft" | "published";
};

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

async function fetchStaticPageEditorData(slug: StaticPageSlug): Promise<StaticPageEditorData> {
  const defaults = getDefaultStaticPageContent(slug);
  const meta = STATIC_PAGE_META[slug];

  if (!isSupabaseConfigured()) {
    return { slug, content: defaults, banners: [], status: "draft" };
  }

  const supabase = createAnonClient();
  const pagePromise = supabase
    .from("cms_pages")
    .select("content, status")
    .eq("slug", slug)
    .maybeSingle();

  const bannerPlacement = meta.bannerPlacement;
  const bannersPromise = bannerPlacement
    ? supabase
        .from("banners")
        .select("id, desktop_image_url, mobile_image_url, alt_text, sort_order")
        .eq("placement", bannerPlacement)
        .order("sort_order", { ascending: true })
    : Promise.resolve({ data: [], error: null });

  const [pageResult, bannersResult] = await Promise.all([pagePromise, bannersPromise]);

  if (pageResult.error) throw new Error(pageResult.error.message);
  if (bannersResult.error) throw new Error(bannersResult.error.message);

  return {
    slug,
    content: mergeStaticPageContent(slug, pageResult.data?.content),
    banners: (bannersResult.data ?? []).map(mapBannerRow),
    status: (pageResult.data?.status as "draft" | "published") ?? "draft",
  };
}

export function getStaticPageEditorData(slug: StaticPageSlug): Promise<StaticPageEditorData> {
  return unstable_cache(() => fetchStaticPageEditorData(slug), ["cms-static-page-editor", slug], {
    revalidate: 30,
    tags: [`cms-page-${slug}`, "cms"],
  })();
}
