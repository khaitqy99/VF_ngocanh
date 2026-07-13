#!/usr/bin/env node
/**
 * Preload toàn bộ dữ liệu CMS text vào Redis.
 * Usage: npm run cache:warm
 */
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

async function main() {
  loadEnv();

  const { warmCmsRedisCache } = await import("../apps/webclient/src/lib/cms/warm-cache.ts");

  console.log("Đang warm Redis cache cho toàn bộ dữ liệu CMS...");
  const result = await warmCmsRedisCache();
  console.log("✅ Hoàn tất warm cache:");
  console.log(`   • Ô tô: ${result.cars} · Xe máy: ${result.scooters}`);
  console.log(`   • PDP xe: ${result.vehicleDetails}`);
  console.log(`   • Phụ kiện: ${result.accessories}`);
  console.log(`   • Banner: ${result.banners} vị trí`);
  console.log(`   • Trang tĩnh + trang chủ: ${result.staticPages}`);
  console.log(`   • SEO trang: ${result.pageSeo}`);
  console.log(`   • Tin tức: ${result.newsArticles} bài`);
  console.log(`   • Cài đặt (footer/seo/giá): ${result.settings}`);
  console.log(`   • Tổng key Redis (cms:*): ${result.redisKeys}`);
}

main().catch((error) => {
  console.error("❌ Warm cache thất bại:", error instanceof Error ? error.message : error);
  process.exit(1);
});
