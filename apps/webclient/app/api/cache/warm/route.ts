import { revalidatePath, unstable_expirePath, unstable_expireTag } from "next/cache";
import { NextResponse } from "next/server";

import { deleteCacheByPrefix } from "@/lib/cache";
import { warmCmsRedisCache } from "@/lib/cms/warm-cache";

/** Tags covering all dual-cached CMS loaders on webclient. */
const CMS_WARM_TAGS = [
  "cms",
  "cms-seo",
  "cms-news",
  "cms-home",
  "cms-footer",
  "cms-car-pricing",
  "cms-cars",
  "cms-scooters",
  "cms-accessories",
  "cms-banners",
  "cms-banners-home",
] as const;

const CMS_WARM_PATHS = [
  "/",
  "/oto",
  "/xe-may-dien",
  "/phu-kien",
  "/gioi-thieu",
  "/tin-tuc",
  "/dich-vu-hau-mai",
  "/pin-va-tram-sac",
  "/luu-tru-nang-luong",
  "/chinh-sach-bao-mat",
  "/dieu-khoan-su-dung",
  "/sitemap.xml",
] as const;

export async function POST(request: Request) {
  const secret = request.headers.get("x-revalidate-secret");
  if (!secret || secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    for (const tag of CMS_WARM_TAGS) {
      unstable_expireTag(tag);
    }
    for (const path of CMS_WARM_PATHS) {
      unstable_expirePath(path, "page");
      unstable_expirePath(path, "layout");
      revalidatePath(path, "layout");
    }

    const redisDeletedKeys = await deleteCacheByPrefix("cms:");
    const result = await warmCmsRedisCache();
    return NextResponse.json({ ok: true, redisDeletedKeys, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Warm cache thất bại";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
