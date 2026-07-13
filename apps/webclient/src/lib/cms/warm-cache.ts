import type { Database } from "@vinfast3s/supabase";
import { getRedisClient } from "@/lib/redis";
import { STATIC_PAGE_SEO } from "@/lib/seo/types";
import {
  fetchAccessoriesRows,
  fetchBannersByPlacement,
  fetchCarDetailMapped,
  fetchCmsPageContent,
  fetchHomePage,
  fetchScooterDetailMapped,
  fetchVehicleById,
  fetchVehiclesByType,
} from "./index";
import type { StaticPageSlug } from "./static-pages";
import { fetchCarPricingRow } from "./car-pricing-fetch";
import { fetchFooterSettingsRow } from "./footer-fetch";
import { fetchPublishedNews } from "./news";
import { fetchAccessorySeoRow, fetchPageSeoRow, fetchSiteSeoRow, fetchVehicleSeoRow } from "./seo";

type BannerPlacement = Database["public"]["Enums"]["banner_placement"];

const BANNER_PLACEMENTS: BannerPlacement[] = [
  "home",
  "cars",
  "scooters",
  "accessories",
  "after_sales",
  "charging",
  "energy",
];

const STATIC_PAGE_SLUGS: StaticPageSlug[] = ["about", "after-sales", "charging", "energy"];

export type WarmCmsRedisResult = {
  cars: number;
  scooters: number;
  vehicles: number;
  vehicleDetails: number;
  accessories: number;
  banners: number;
  staticPages: number;
  pageSeo: number;
  newsArticles: number;
  settings: number;
  redisKeys: number;
};

export async function countRedisCmsKeys(): Promise<number> {
  const redis = getRedisClient();
  if (!redis) return 0;

  let count = 0;
  let cursor = "0";
  do {
    const [nextCursor, keys] = await redis.scan(cursor, "MATCH", "cms:*", "COUNT", 200);
    cursor = nextCursor;
    count += keys.length;
  } while (cursor !== "0");

  return count;
}

/** Ghi toàn bộ dữ liệu CMS text vào Redis (gọi sau deploy hoặc khi cần preload). */
export async function warmCmsRedisCache(): Promise<WarmCmsRedisResult> {
  if (!getRedisClient()) {
    throw new Error("REDIS_URL chưa được cấu hình — không thể warm cache");
  }

  const [carRows, scooterRows, accessoryRows] = await Promise.all([
    fetchVehiclesByType("car"),
    fetchVehiclesByType("scooter"),
    fetchAccessoriesRows(),
  ]);

  const newsArticles = await fetchPublishedNews();

  await Promise.all([
    fetchHomePage(),
    fetchFooterSettingsRow(),
    fetchSiteSeoRow(),
    fetchCarPricingRow(),
    ...BANNER_PLACEMENTS.map((placement) => fetchBannersByPlacement(placement)),
    ...STATIC_PAGE_SLUGS.map((slug) => fetchCmsPageContent(slug)),
    ...STATIC_PAGE_SEO.map((page) => fetchPageSeoRow(page.slug)),
  ]);

  const vehicleRows = [...carRows, ...scooterRows];
  const vehicleIds = vehicleRows.map((row) => row.id);

  await Promise.all(
    vehicleRows.flatMap((row) => {
      const detailWarm =
        row.type === "car" ? fetchCarDetailMapped(row.id) : fetchScooterDetailMapped(row.id);
      return [fetchVehicleById(row.id), fetchVehicleSeoRow(row.id), detailWarm];
    }),
  );

  await Promise.all(accessoryRows.map((row) => fetchAccessorySeoRow(row.id)));

  const redisKeys = await countRedisCmsKeys();

  return {
    cars: carRows.length,
    scooters: scooterRows.length,
    vehicles: vehicleIds.length,
    vehicleDetails: vehicleIds.length,
    accessories: accessoryRows.length,
    banners: BANNER_PLACEMENTS.length,
    staticPages: STATIC_PAGE_SLUGS.length + 1,
    pageSeo: STATIC_PAGE_SEO.length,
    newsArticles: newsArticles.length,
    settings: 3,
    redisKeys,
  };
}
