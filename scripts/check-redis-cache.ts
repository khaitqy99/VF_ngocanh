#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = resolve(root, ".env");

function loadEnv() {
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

async function countKeys(redis: import("ioredis").default, pattern: string) {
  let count = 0;
  let cursor = "0";
  do {
    const [nextCursor, keys] = await redis.scan(cursor, "MATCH", pattern, "COUNT", 500);
    cursor = nextCursor;
    count += keys.length;
  } while (cursor !== "0");
  return count;
}

async function main() {
  loadEnv();

  const { getRedisClient } = await import("../apps/webclient/src/lib/redis.ts");
  const redis = getRedisClient();
  if (!redis) {
    console.error("❌ REDIS_URL chưa cấu hình");
    process.exit(1);
  }

  const patterns: [string, string][] = [
    ["cms:vehicles:*", "Danh sách xe (car/scooter)"],
    ["cms:vehicle:*", "Row xe từng ID"],
    ["cms:vehicle-detail:*", "PDP xe đã map"],
    ["cms:vehicle-seo:*", "SEO từng xe"],
    ["cms:accessories", "Danh sách phụ kiện"],
    ["cms:accessory-seo:*", "SEO từng phụ kiện"],
    ["cms:banners:*", "Banner theo vị trí"],
    ["cms:page:*", "Nội dung trang CMS"],
    ["cms:page-seo:*", "SEO trang"],
    ["cms:settings:*", "Footer / SEO site / giá lăn bánh"],
    ["cms:news:*", "Tin tức"],
  ];

  console.log("Redis cache audit (pattern cms:*)\n");
  for (const [pattern, label] of patterns) {
    const count = await countKeys(redis, pattern);
    console.log(`${String(count).padStart(4)}  ${label}  [${pattern}]`);
  }

  const total = await countKeys(redis, "cms:*");
  console.log(`\n${String(total).padStart(4)}  TỔNG key cms:*`);

  const carList = await redis.get("cms:vehicles:car");
  const accessories = await redis.get("cms:accessories");
  const home = await redis.get("cms:page:home");
  console.log("\nMẫu dữ liệu (độ dài JSON):");
  console.log(`  cms:vehicles:car     → ${carList ? `${carList.length} bytes` : "MISSING"}`);
  console.log(`  cms:accessories      → ${accessories ? `${accessories.length} bytes` : "MISSING"}`);
  console.log(`  cms:page:home        → ${home ? `${home.length} bytes` : "MISSING"}`);

  const ttlCar = await redis.ttl("cms:vehicles:car");
  console.log(`\nTTL cms:vehicles:car: ${ttlCar > 0 ? `${ttlCar}s (~${Math.round(ttlCar / 3600)}h)` : ttlCar}`);

  await redis.quit();
}

main().catch((error) => {
  console.error("❌", error instanceof Error ? error.message : error);
  process.exit(1);
});
