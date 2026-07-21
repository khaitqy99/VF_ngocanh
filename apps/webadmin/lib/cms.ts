import { unstable_cache } from "next/cache";
import { createAdminClient } from "@vinfast3s/supabase/admin";
import { isSupabaseConfigured, type Tables } from "@vinfast3s/supabase";
import {
  mapAccessoryRow,
  mapVehicleToCar,
  mapVehicleToCarDetail,
  mapVehicleToScooter,
  mapVehicleToScooterDetail,
} from "@webclient/lib/cms/mappers";
import type { AccessoryProduct } from "@webclient/lib/accessories";
import type { CarDetail } from "@webclient/lib/car-details";
import type { CarModel } from "@webclient/lib/cars";
import type { ScooterDetail } from "@webclient/lib/scooter-details";
import type { ScooterModel } from "@webclient/lib/scooters";
import { CARS } from "@webclient/lib/cars";
import { SCOOTERS } from "@webclient/lib/scooters";
import { VINFAST_ACCESSORIES } from "@webclient/lib/vinfast-accessories";
import { getCarDetail } from "@webclient/lib/car-details";
import { getScooterDetail } from "@webclient/lib/scooter-details";
import type { MediaImage, NewsArticleMediaRef, PageMediaRef } from "@/lib/media-library";
import { collectImagePathsFromValue } from "@/lib/media-page-images";
import {
  STATIC_PAGE_META,
  STATIC_PAGE_SLUGS,
  getDefaultStaticPageContent,
  mergeStaticPageContent,
  type StaticPageSlug,
} from "@webclient/lib/cms/static-pages";
import { ADMIN_MEDIA_CACHE_TAG } from "@/lib/media-revalidate";

async function fetchVehicles(type: "car" | "scooter") {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("vehicles")
    .select("*")
    .eq("type", type)
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

async function fetchVehicleById(id: string): Promise<Tables<"vehicles"> | null> {
  const admin = createAdminClient();
  const { data, error } = await admin.from("vehicles").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

async function fetchAccessoriesRows() {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("accessories")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export const getAdminCars = unstable_cache(
  async (): Promise<CarModel[]> => {
    if (!isSupabaseConfigured()) return CARS;
    try {
      const rows = await fetchVehicles("car");
      return rows.length ? rows.map(mapVehicleToCar) : CARS;
    } catch {
      return CARS;
    }
  },
  ["admin-cms-cars"],
  { revalidate: 60, tags: ["admin-cms-cars"] },
);

export const getAdminScooters = unstable_cache(
  async (): Promise<ScooterModel[]> => {
    if (!isSupabaseConfigured()) return SCOOTERS;
    try {
      const rows = await fetchVehicles("scooter");
      return rows.length ? rows.map(mapVehicleToScooter) : SCOOTERS;
    } catch {
      return SCOOTERS;
    }
  },
  ["admin-cms-scooters"],
  { revalidate: 60, tags: ["admin-cms-scooters"] },
);

export const getAdminAccessories = unstable_cache(
  async (): Promise<AccessoryProduct[]> => {
    if (!isSupabaseConfigured()) return VINFAST_ACCESSORIES as unknown as AccessoryProduct[];
    try {
      const rows = await fetchAccessoriesRows();
      return rows.length
        ? rows.map(mapAccessoryRow)
        : (VINFAST_ACCESSORIES as unknown as AccessoryProduct[]);
    } catch {
      return VINFAST_ACCESSORIES as unknown as AccessoryProduct[];
    }
  },
  ["admin-cms-accessories"],
  { revalidate: 60, tags: ["admin-cms-accessories"] },
);

export async function getAdminCarDetail(id: string): Promise<CarDetail | undefined> {
  if (!isSupabaseConfigured()) return getCarDetail(id);
  try {
    const row = await fetchVehicleById(id);
    if (!row || row.type !== "car") return getCarDetail(id);
    return mapVehicleToCarDetail(row) ?? getCarDetail(id);
  } catch {
    return getCarDetail(id);
  }
}

export async function getAdminScooterDetail(id: string): Promise<ScooterDetail | undefined> {
  if (!isSupabaseConfigured()) return getScooterDetail(id);
  try {
    const row = await fetchVehicleById(id);
    if (!row || row.type !== "scooter") return getScooterDetail(id);
    return mapVehicleToScooterDetail(row) ?? getScooterDetail(id);
  } catch {
    return getScooterDetail(id);
  }
}

export async function getAdminAccessoryById(id: string): Promise<AccessoryProduct | undefined> {
  const all = await getAdminAccessories();
  return all.find((a) => a.id === id);
}

export async function getAdminVehicleGalleries(): Promise<Map<string, string[]>> {
  const map = new Map<string, string[]>();
  if (!isSupabaseConfigured()) return map;

  try {
    const admin = createAdminClient();
    const { data } = await admin.from("vehicles").select("id, gallery, hero_image_url");
    for (const row of data ?? []) {
      const paths: string[] = [];
      if (Array.isArray(row.gallery)) {
        for (const item of row.gallery) {
          if (typeof item === "string") paths.push(item);
        }
      }
      if (row.hero_image_url) paths.unshift(row.hero_image_url);
      map.set(row.id, [...new Set(paths.filter(Boolean))]);
    }
  } catch {
    return map;
  }

  return map;
}

export async function getAdminMediaAssetsByFolder(): Promise<Map<string, MediaImage[]>> {
  const map = new Map<string, MediaImage[]>();
  if (!isSupabaseConfigured()) return map;

  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("media_assets")
      .select("id, filename, url, folder")
      .order("created_at", { ascending: false });
    if (error) throw error;

    for (const row of data ?? []) {
      if (!row.folder) continue;
      const list = map.get(row.folder) ?? [];
      list.push({
        id: row.id,
        name: row.filename,
        path: row.url,
        assetId: row.id,
      });
      map.set(row.folder, list);
    }
  } catch {
    return map;
  }

  return map;
}

export async function getAdminNewsArticlesForMedia(): Promise<NewsArticleMediaRef[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("news_articles")
      .select("id, slug, title, cover_image_url")
      .order("updated_at", { ascending: false });
    if (error) throw error;

    return (data ?? []).map((row) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      coverImageUrl: row.cover_image_url,
    }));
  } catch {
    return [];
  }
}

export async function getAdminPagesForMedia(): Promise<PageMediaRef[]> {
  const buildRef = (
    slug: string,
    name: string,
    productHref: string,
    subtitle: string,
    content: unknown,
    banners: unknown[] = [],
  ): PageMediaRef => {
    const seedPaths = [
      ...collectImagePathsFromValue(content),
      ...collectImagePathsFromValue(banners),
    ];
    return {
      slug,
      name,
      subtitle,
      productHref,
      seedPaths: [...new Set(seedPaths)],
    };
  };

  if (!isSupabaseConfigured()) {
    return [
      buildRef("home", "Trang chủ", "/admin/homepage", "Banner & section trang chủ", null),
      ...STATIC_PAGE_SLUGS.map((slug) => {
        const meta = STATIC_PAGE_META[slug];
        const defaults = getDefaultStaticPageContent(slug);
        return buildRef(
          slug,
          meta.label,
          `/admin/pages/${slug}`,
          meta.path,
          defaults,
        );
      }),
    ];
  }

  try {
    const admin = createAdminClient();
    const { data: cmsPages, error: pagesError } = await admin
      .from("cms_pages")
      .select("slug, content")
      .in("slug", ["home", ...STATIC_PAGE_SLUGS]);
    if (pagesError) throw pagesError;

    const contentBySlug = new Map((cmsPages ?? []).map((row) => [row.slug, row.content]));

    const { data: bannerRows, error: bannersError } = await admin
      .from("banners")
      .select("placement, desktop_image_url, mobile_image_url, alt_text, sort_order")
      .in("placement", ["home", "after_sales", "charging"]);
    if (bannersError) throw bannersError;

    const bannersByPlacement = new Map<string, unknown[]>();
    for (const row of bannerRows ?? []) {
      const list = bannersByPlacement.get(row.placement) ?? [];
      list.push({
        desktop: row.desktop_image_url,
        mobile: row.mobile_image_url,
        alt: row.alt_text,
        sortOrder: row.sort_order,
      });
      bannersByPlacement.set(row.placement, list);
    }

    const homeContent = contentBySlug.get("home");
    const pages: PageMediaRef[] = [
      buildRef(
        "home",
        "Trang chủ",
        "/admin/homepage",
        "/",
        homeContent,
        bannersByPlacement.get("home") ?? [],
      ),
    ];

    for (const slug of STATIC_PAGE_SLUGS) {
      const meta = STATIC_PAGE_META[slug as StaticPageSlug];
      const merged = mergeStaticPageContent(slug, contentBySlug.get(slug));
      const banners = meta.bannerPlacement
        ? bannersByPlacement.get(meta.bannerPlacement) ?? []
        : [];
      pages.push(
        buildRef(slug, meta.label, `/admin/pages/${slug}`, meta.path, merged, banners),
      );
    }

    return pages;
  } catch {
    return [
      buildRef("home", "Trang chủ", "/admin/homepage", "/", null),
      ...STATIC_PAGE_SLUGS.map((slug) => {
        const meta = STATIC_PAGE_META[slug];
        return buildRef(
          slug,
          meta.label,
          `/admin/pages/${slug}`,
          meta.path,
          getDefaultStaticPageContent(slug),
        );
      }),
    ];
  }
}

export type AdminDashboardStats = {
  carCount: number;
  scooterCount: number;
  accessoryCount: number;
  mediaFolderCount: number;
  mediaImageCount: number;
  draftCarCount: number;
  draftScooterCount: number;
  draftAccessoryCount: number;
  draftMissingImageCount: number;
};

export const getAdminMediaFolders = unstable_cache(
  async () => {
    const { buildMediaFolders } = await import("@/lib/media-library");
    const { getCustomMediaFolders } = await import("@/lib/media-custom-folders");
    const [cars, scooters, accessories, galleries, mediaAssets, newsArticles, customFolders, pages] =
      await Promise.all([
        getAdminCars(),
        getAdminScooters(),
        getAdminAccessories(),
        getAdminVehicleGalleries(),
        getAdminMediaAssetsByFolder(),
        getAdminNewsArticlesForMedia(),
        getCustomMediaFolders(),
        getAdminPagesForMedia(),
      ]);
    return buildMediaFolders(
      cars,
      scooters,
      accessories,
      galleries,
      mediaAssets,
      newsArticles,
      customFolders,
      pages,
    );
  },
  ["admin-cms-media-folders"],
  { revalidate: 60, tags: [ADMIN_MEDIA_CACHE_TAG] },
);
