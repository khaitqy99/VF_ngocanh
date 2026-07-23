import { PRODUCTION_SITE_URL } from "./types";

/** Absolute URL for sitemap / OG assets. */
export function absoluteSiteAssetUrl(src?: string | null): string | undefined {
  if (!src?.trim()) return undefined;
  const value = src.trim();
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  return `${PRODUCTION_SITE_URL}${value.startsWith("/") ? value : `/${value}`}`;
}

/** Dedupe and absolutize image URLs for sitemap `images` entries. */
export function collectSitemapImages(...sources: Array<string | null | undefined>): string[] {
  const seen = new Set<string>();
  const images: string[] = [];
  for (const source of sources) {
    const absolute = absoluteSiteAssetUrl(source);
    if (!absolute || seen.has(absolute)) continue;
    seen.add(absolute);
    images.push(absolute);
  }
  return images;
}
