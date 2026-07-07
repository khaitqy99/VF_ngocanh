import { unstable_cache } from "next/cache";
import { createAnonClient } from "@vinfast3s/supabase/anon";
import { isSupabaseConfigured, type Json } from "@vinfast3s/supabase";
import type { Database, Tables } from "@vinfast3s/supabase";
import { getOrSetCache } from "@/lib/cache";
import { CARS } from "@/lib/cars";
import { SCOOTERS } from "@/lib/scooters";
import { ACCESSORIES, type AccessoryProduct } from "@/lib/accessories";
import { getCarDetail } from "@/lib/car-details";
import { getScooterDetail } from "@/lib/scooter-details";
import {
  CAR_HERO_BANNERS,
  SCOOTER_HERO_BANNERS,
  ACCESSORY_HERO_BANNERS,
  AFTER_SALES_HERO_BANNERS,
  CHARGING_HERO_BANNERS,
  HERO_BANNERS,
  type HeroBannerSlide,
} from "@/lib/images";
import {
  VINFAST_FEATURED_CARS,
  VINFAST_FEATURED_SCOOTERS,
  VINFAST_HERO_BANNERS,
} from "@/lib/vinfast-home";
import {
  mapAccessoryRow,
  mapBannerRow,
  mapHomeHeroBanner,
  mapVehicleToCar,
  mapVehicleToCarDetail,
  mapVehicleToScooter,
  mapVehicleToScooterDetail,
  parseHomeCms,
  applyVehicleContentPatches,
  hydrateFeaturedVehicleSlides,
  buildFeaturedSlidesFromIds,
  applyFeaturedPriceOverrides,
  applyFeaturedSlideOverrides,
} from "./mappers";
import {
  mergeHomeSections,
  resolveFeaturedAccessories,
  type HomeSectionsContent,
} from "./home-content";
import { resolveProductSlug } from "@/lib/seo/slugs";
import { CMS_TAGS, vehicleTag } from "./cache-tags";

type BannerPlacement = Database["public"]["Enums"]["banner_placement"];
const CMS_REDIS_TTL_SECONDS = 120;

function getClient() {
  return createAnonClient();
}

async function fetchVehiclesByType(type: "car" | "scooter") {
  return getOrSetCache(`cms:vehicles:${type}`, CMS_REDIS_TTL_SECONDS, async () => {
    const supabase = getClient();
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .eq("type", type)
      .eq("status", "published")
      .order("sort_order", { ascending: true });

    if (error) throw new Error(error.message);
    return data ?? [];
  });
}

async function fetchVehicleById(id: string): Promise<Tables<"vehicles"> | null> {
  return getOrSetCache(`cms:vehicle:${id}`, CMS_REDIS_TTL_SECONDS, async () => {
    const supabase = getClient();
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .eq("id", id)
      .eq("status", "published")
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data;
  });
}

async function fetchAccessoriesRows() {
  return getOrSetCache(`cms:accessories`, CMS_REDIS_TTL_SECONDS, async () => {
    const supabase = getClient();
    const { data, error } = await supabase
      .from("accessories")
      .select("*")
      .eq("status", "published")
      .order("sort_order", { ascending: true });

    if (error) throw new Error(error.message);
    return data ?? [];
  });
}

async function fetchBannersByPlacement(placement: BannerPlacement) {
  return getOrSetCache(`cms:banners:${placement}`, CMS_REDIS_TTL_SECONDS, async () => {
    const supabase = getClient();
    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .eq("placement", placement)
      .eq("status", "published")
      .order("sort_order", { ascending: true });

    if (error) throw new Error(error.message);
    return data ?? [];
  });
}

async function fetchHomePage(): Promise<Json | null> {
  return getOrSetCache(`cms:page:home`, CMS_REDIS_TTL_SECONDS, async () => {
    const supabase = getClient();
    const { data, error } = await supabase
      .from("cms_pages")
      .select("content")
      .eq("slug", "home")
      .eq("status", "published")
      .maybeSingle();

    if (error) throw new Error(error.message);
    const row = data as Pick<Tables<"cms_pages">, "content"> | null;
    return row?.content ?? null;
  });
}

export const getCars = unstable_cache(
  async () => {
    if (!isSupabaseConfigured()) return CARS;
    try {
      const rows = await fetchVehiclesByType("car");
      if (!rows.length) return CARS;
      return rows.map(mapVehicleToCar);
    } catch {
      return CARS;
    }
  },
  ["cms-cars"],
  { revalidate: 120, tags: [CMS_TAGS.all, CMS_TAGS.cars] },
);

export const getScooters = unstable_cache(
  async () => {
    if (!isSupabaseConfigured()) return SCOOTERS;
    try {
      const rows = await fetchVehiclesByType("scooter");
      if (!rows.length) return SCOOTERS;
      return rows.map(mapVehicleToScooter);
    } catch {
      return SCOOTERS;
    }
  },
  ["cms-scooters"],
  { revalidate: 120, tags: [CMS_TAGS.all, CMS_TAGS.scooters] },
);

export const getAccessories = unstable_cache(
  async () => {
    if (!isSupabaseConfigured()) return ACCESSORIES;
    try {
      const rows = await fetchAccessoriesRows();
      if (!rows.length) return ACCESSORIES;
      return rows.map(mapAccessoryRow);
    } catch {
      return ACCESSORIES;
    }
  },
  ["cms-accessories"],
  { revalidate: 120, tags: [CMS_TAGS.all, CMS_TAGS.accessories] },
);

export async function getCarDetailById(id: string) {
  return unstable_cache(
    async () => {
      if (!isSupabaseConfigured()) return getCarDetail(id);
      try {
        const row = await fetchVehicleById(id);
        if (!row || row.type !== "car") return getCarDetail(id);
        const mapped = mapVehicleToCarDetail(row);
        if (mapped) return mapped;
        const fallback = getCarDetail(id);
        if (!fallback) return undefined;
        return applyVehicleContentPatches(fallback, row.content);
      } catch {
        return getCarDetail(id);
      }
    },
    ["cms-car-detail", id],
    { revalidate: 120, tags: [CMS_TAGS.all, CMS_TAGS.cars, vehicleTag(id)] },
  )();
}

export async function getScooterDetailById(id: string) {
  return unstable_cache(
    async () => {
      if (!isSupabaseConfigured()) return getScooterDetail(id);
      try {
        const row = await fetchVehicleById(id);
        if (!row || row.type !== "scooter") return getScooterDetail(id);
        const mapped = mapVehicleToScooterDetail(row);
        if (mapped) return mapped;
        const fallback = getScooterDetail(id);
        if (!fallback) return undefined;
        return applyVehicleContentPatches(fallback, row.content);
      } catch {
        return getScooterDetail(id);
      }
    },
    ["cms-scooter-detail", id],
    { revalidate: 120, tags: [CMS_TAGS.all, CMS_TAGS.scooters, vehicleTag(id)] },
  )();
}

export async function getAccessoryById(id: string) {
  const all = await getAccessories();
  return all.find((a) => a.id === id);
}

export async function getBanners(placement: BannerPlacement): Promise<HeroBannerSlide[]> {
  const fallbacks: Record<BannerPlacement, HeroBannerSlide[]> = {
    home: HERO_BANNERS,
    cars: CAR_HERO_BANNERS,
    scooters: SCOOTER_HERO_BANNERS,
    accessories: ACCESSORY_HERO_BANNERS,
    after_sales: AFTER_SALES_HERO_BANNERS,
    charging: CHARGING_HERO_BANNERS,
    energy: [],
  };

  return unstable_cache(
    async () => {
      if (!isSupabaseConfigured()) return fallbacks[placement];
      try {
        const rows = await fetchBannersByPlacement(placement);
        if (!rows.length) return fallbacks[placement];
        return rows.map(mapBannerRow).filter((b) => b.desktop);
      } catch {
        return fallbacks[placement];
      }
    },
    ["cms-banners", placement],
    { revalidate: 120, tags: [CMS_TAGS.all, CMS_TAGS.banners, `cms-banners-${placement}`] },
  )();
}

export const getHomeData = unstable_cache(
  async () => {
    const [homeContent, homeBanners, accessories, cars, scooters] = await Promise.all([
      isSupabaseConfigured() ? fetchHomePage().catch(() => null) : null,
      getBanners("home"),
      getAccessories(),
      getCars(),
      getScooters(),
    ]);

    const parsed = homeContent ? parseHomeCms(homeContent) : null;

    const featuredCarsBase = parsed?.featuredCarIds?.length
      ? buildFeaturedSlidesFromIds(parsed.featuredCarIds, VINFAST_FEATURED_CARS, cars, "car")
      : parsed?.featuredCars?.length
        ? parsed.featuredCars
        : VINFAST_FEATURED_CARS;

    const featuredScootersBase = parsed?.featuredScooterIds?.length
      ? buildFeaturedSlidesFromIds(
          parsed.featuredScooterIds,
          VINFAST_FEATURED_SCOOTERS,
          scooters,
          "scooter",
        )
      : parsed?.featuredScooters?.length
        ? parsed.featuredScooters
        : VINFAST_FEATURED_SCOOTERS;

    const featuredCars = applyFeaturedSlideOverrides(
      applyFeaturedPriceOverrides(
        hydrateFeaturedVehicleSlides(featuredCarsBase, cars),
        parsed?.featuredCarIds ?? [],
        parsed?.featuredCarPrices ?? {},
      ),
      parsed?.featuredCarIds ?? [],
      parsed?.featuredCarSlideOverrides ?? {},
    );

    const featuredScooters = applyFeaturedSlideOverrides(
      applyFeaturedPriceOverrides(
        hydrateFeaturedVehicleSlides(featuredScootersBase, scooters),
        parsed?.featuredScooterIds ?? [],
        parsed?.featuredScooterPrices ?? {},
      ),
      parsed?.featuredScooterIds ?? [],
      parsed?.featuredScooterSlideOverrides ?? {},
    );

    const sections: HomeSectionsContent = mergeHomeSections(parsed?.sections);
    const featuredAccessories = resolveFeaturedAccessories(
      accessories,
      parsed?.featuredAccessoryIds,
    );

    return {
      heroBanners:
        homeBanners.length > 0
          ? homeBanners
          : parsed?.heroBannersAll?.length
            ? parsed.heroBannersAll
            : HERO_BANNERS,
      featuredCars,
      featuredScooters,
      vinfastHeroBanners: homeBanners.length
        ? (await fetchBannersByPlacement("home").catch(() => [])).map(mapHomeHeroBanner)
        : VINFAST_HERO_BANNERS,
      accessories: featuredAccessories,
      sections,
    };
  },
  ["cms-home"],
  { revalidate: 120, tags: [CMS_TAGS.all, CMS_TAGS.home] },
);

export async function getCarDetailAccessories(carId: string): Promise<AccessoryProduct[]> {
  const all = await getAccessories();
  const normalized = carId.replace(/-all-new$/, "").replace(/^vf/, "vf");
  return all
    .filter((item) => {
      if (!item.vehicles?.length || item.vehicles.includes("all")) return true;
      return item.vehicles.some(
        (v) => v === carId || v === normalized || carId.includes(v) || v.includes(carId),
      );
    })
    .slice(0, 4);
}

export async function getScooterDetailAccessories(): Promise<AccessoryProduct[]> {
  const all = await getAccessories();
  return all
    .filter(
      (item) =>
        !item.vehicles?.length ||
        item.vehicles.includes("all") ||
        item.vehicles.some((v) =>
          ["flazz", "evo", "feliz", "vero", "amio", "viper", "zgoo", "drgnfly"].some((k) =>
            v.includes(k),
          ),
        ),
    )
    .slice(0, 4);
}

export { getSiteSeo, getPageSeo, CMS_SEO_TAG } from "./seo";
export { parseRowSeoColumn, parseVehicleSeo } from "./seo";

export async function getCarBySlug(slug: string) {
  const cars = await getCars();
  return cars.find((car) => resolveProductSlug(car, "car") === slug);
}

export async function getScooterBySlug(slug: string) {
  const scooters = await getScooters();
  return scooters.find((scooter) => resolveProductSlug(scooter, "scooter") === slug);
}

export async function getAccessoryBySlug(slug: string) {
  const all = await getAccessories();
  return all.find((item) => resolveProductSlug(item, "accessory", item.name) === slug);
}

export async function getCarDetailBySlug(slug: string) {
  const car = await getCarBySlug(slug);
  if (!car) return undefined;
  return getCarDetailById(car.id);
}

export async function getScooterDetailBySlug(slug: string) {
  const scooter = await getScooterBySlug(slug);
  if (!scooter) return undefined;
  return getScooterDetailById(scooter.id);
}

export async function getAccessoryBySlugOrId(slug: string) {
  return (await getAccessoryBySlug(slug)) ?? (await getAccessoryById(slug));
}
