import type { Database } from "@vinfast3s/supabase";
import { getRedisClient } from "@/lib/redis";
import { STATIC_PAGE_SEO } from "@/lib/seo/types";
import {
  fetchAccessoriesRows,
  fetchBannersByPlacement,
  fetchCmsPageContent,
  fetchHomePage,
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
  vehicles: number;
  accessories: number;
  banners: number;
  staticPages: number;
  pageSeo: number;
  news: number;
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

  await Promise.all([
    fetchHomePage(),
    fetchFooterSettingsRow(),
    fetchSiteSeoRow(),
    fetchCarPricingRow(),
    fetchPublishedNews(),
    ...BANNER_PLACEMENTS.map((placement) => fetchBannersByPlacement(placement)),
    ...STATIC_PAGE_SLUGS.map((slug) => fetchCmsPageContent(slug)),
    ...STATIC_PAGE_SEO.map((page) => fetchPageSeoRow(page.slug)),
  ]);

  const vehicleIds = [...carRows, ...scooterRows].map((row) => row.id);

  await Promise.all(vehicleIds.flatMap((id) => [fetchVehicleById(id), fetchVehicleSeoRow(id)]));

  await Promise.all(accessoryRows.map((row) => fetchAccessorySeoRow(row.id)));

  const redisKeys = await countRedisCmsKeys();

  return {
    vehicles: vehicleIds.length,
    accessories: accessoryRows.length,
    banners: BANNER_PLACEMENTS.length,
    staticPages: STATIC_PAGE_SLUGS.length,
    pageSeo: STATIC_PAGE_SEO.length,
    news: 1,
    redisKeys,
  };
}
