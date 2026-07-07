import { unstable_cache } from "next/cache";
import { createAnonClient } from "@vinfast3s/supabase/anon";
import { isSupabaseConfigured } from "@vinfast3s/supabase";
import {
  DEFAULT_HOME_SECTIONS,
  mergeHomeSections,
  resolveFeaturedAccessories,
  type HomeBannerInput,
  type HomeSectionsContent,
  type HomeFeaturedPrices,
  type HomeFeaturedSlideOverrides,
} from "./home-content";
import { parseHomeCms } from "./mappers";
import { VINFAST_FEATURED_CARS, VINFAST_FEATURED_SCOOTERS } from "@/lib/vinfast-home";
import { getCars, getScooters, getAccessories } from "./index";

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

export type HomeEditorData = {
  sections: HomeSectionsContent;
  featuredCarIds: string[];
  featuredScooterIds: string[];
  featuredAccessoryIds: string[];
  featuredCarPrices: HomeFeaturedPrices;
  featuredScooterPrices: HomeFeaturedPrices;
  featuredCarSlideOverrides: HomeFeaturedSlideOverrides;
  featuredScooterSlideOverrides: HomeFeaturedSlideOverrides;
  banners: HomeBannerInput[];
  cars: { id: string; name: string; price: number }[];
  scooters: { id: string; name: string; price: number }[];
  accessoriesCatalog: { id: string; name: string; price: number }[];
  status: "draft" | "published";
};

function buildEditorPayload(
  contentObj: Record<string, unknown>,
  parsed: ReturnType<typeof parseHomeCms> | null,
  banners: HomeBannerInput[],
  cars: { id: string; name: string; price: number }[],
  scooters: { id: string; name: string; price: number }[],
  accessoriesCatalog: { id: string; name: string; price: number }[],
  status: "draft" | "published",
): HomeEditorData {
  return {
    sections: mergeHomeSections(contentObj.sections),
    featuredCarIds: parsed?.featuredCarIds?.length
      ? parsed.featuredCarIds
      : defaultFeaturedCarIds(),
    featuredScooterIds: parsed?.featuredScooterIds?.length
      ? parsed.featuredScooterIds
      : defaultFeaturedScooterIds(),
    featuredAccessoryIds: parsed?.featuredAccessoryIds?.length
      ? parsed.featuredAccessoryIds
      : resolveFeaturedAccessories(accessoriesCatalog, undefined).map((item) => item.id),
    featuredCarPrices: parsed?.featuredCarPrices ?? {},
    featuredScooterPrices: parsed?.featuredScooterPrices ?? {},
    featuredCarSlideOverrides: parsed?.featuredCarSlideOverrides ?? {},
    featuredScooterSlideOverrides: parsed?.featuredScooterSlideOverrides ?? {},
    banners,
    cars,
    scooters,
    accessoriesCatalog,
    status,
  };
}

async function fetchHomeEditorData(): Promise<HomeEditorData> {
  const [cars, scooters, accessories] = await Promise.all([
    getCars(),
    getScooters(),
    getAccessories(),
  ]);

  const carsList = cars.map((car) => ({ id: car.id, name: car.name, price: car.price }));
  const scootersList = scooters.map((scooter) => ({
    id: scooter.id,
    name: scooter.name,
    price: scooter.price,
  }));
  const accessoriesCatalog = accessories.map((item) => ({
    id: item.id,
    name: item.name,
    price: item.price,
  }));

  if (!isSupabaseConfigured()) {
    return buildEditorPayload(
      {},
      null,
      [],
      carsList,
      scootersList,
      accessoriesCatalog,
      "published",
    );
  }

  const supabase = createAnonClient();
  const [pageResult, bannersResult] = await Promise.all([
    supabase.from("cms_pages").select("content, status").eq("slug", "home").maybeSingle(),
    supabase
      .from("banners")
      .select("id, desktop_image_url, mobile_image_url, alt_text, sort_order")
      .eq("placement", "home")
      .order("sort_order", { ascending: true }),
  ]);

  const contentObj = (pageResult.data?.content ?? {}) as Record<string, unknown>;
  const parsed = pageResult.data?.content ? parseHomeCms(pageResult.data.content) : null;
  const banners = (bannersResult.data ?? []).map((row) => ({
    id: row.id,
    desktop: row.desktop_image_url ?? "",
    mobile: row.mobile_image_url ?? "",
    alt: row.alt_text ?? "",
    sortOrder: row.sort_order,
  }));

  return buildEditorPayload(
    contentObj,
    parsed,
    banners,
    carsList,
    scootersList,
    accessoriesCatalog,
    (pageResult.data?.status as "draft" | "published" | undefined) ?? "published",
  );
}

export const getHomeEditorData = unstable_cache(fetchHomeEditorData, ["cms-home-editor"], {
  revalidate: 30,
  tags: ["cms", "cms-home"],
});
