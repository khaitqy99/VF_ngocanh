import type { MetadataRoute } from "next";
import { buildSitemapEntries, toNextSitemap } from "@/lib/seo/build-sitemap";

/** Keep sitemap in sync with CMS catalog cache (same cadence as public pages). */
export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = await buildSitemapEntries();
  return toNextSitemap(entries);
}
