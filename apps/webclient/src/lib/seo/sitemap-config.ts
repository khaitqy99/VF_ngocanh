import type { SitemapSettings } from "./types";

export function parseSitemapExcludePaths(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.filter((item): item is string => typeof item === "string" && Boolean(item.trim()));
}

export function parseSitemapSettings(value: unknown): SitemapSettings | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  const raw = value as Record<string, unknown>;
  const excludePaths = parseSitemapExcludePaths(raw.excludePaths ?? raw.exclude_paths);
  const includeImageSitemap =
    typeof raw.includeImageSitemap === "boolean"
      ? raw.includeImageSitemap
      : typeof raw.include_image_sitemap === "boolean"
        ? raw.include_image_sitemap
        : undefined;

  if (!excludePaths?.length && includeImageSitemap === undefined) return undefined;

  return {
    excludePaths,
    includeImageSitemap,
  };
}

export function normalizeSitemapPath(path: string): string {
  if (!path || path === "/") return "/";
  return path.startsWith("/") ? path : `/${path}`;
}

/** Returns true when a sitemap path should be omitted. Supports exact paths and trailing `*`. */
export function isSitemapExcluded(path: string, excludePaths: string[] | undefined): boolean {
  if (!excludePaths?.length) return false;
  const normalized = normalizeSitemapPath(path === "" ? "/" : path);

  return excludePaths.some((pattern) => {
    const raw = pattern.trim();
    if (!raw) return false;

    if (raw.endsWith("*")) {
      const prefix = normalizeSitemapPath(raw.slice(0, -1).replace(/\/$/, ""));
      if (normalized === prefix) return true;
      if (normalized.startsWith(`${prefix}/`)) return true;
      if (/[-_]$/.test(prefix) && normalized.startsWith(prefix)) return true;
      return false;
    }

    const exact = normalizeSitemapPath(raw);
    return normalized === exact || normalized === exact.replace(/\/$/, "");
  });
}
