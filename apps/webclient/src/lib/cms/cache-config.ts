/** Default 24h — nội dung site ít đổi; admin lưu CMS sẽ xóa cache ngay qua revalidate API. */
const DEFAULT_CMS_CACHE_TTL_SECONDS = 86_400;

const MIN_CMS_CACHE_TTL_SECONDS = 60;

export function getCmsCacheTtlSeconds(): number {
  const raw = process.env.CMS_CACHE_TTL_SECONDS;
  if (!raw?.trim()) return DEFAULT_CMS_CACHE_TTL_SECONDS;

  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed < MIN_CMS_CACHE_TTL_SECONDS) {
    return DEFAULT_CMS_CACHE_TTL_SECONDS;
  }

  return parsed;
}

/** Dùng cho Next.js `unstable_cache({ revalidate })` — cùng TTL với Redis. */
export function getCmsCacheRevalidate(): number {
  return getCmsCacheTtlSeconds();
}

/** `export const revalidate` trên App Router — đồng bộ TTL toàn site. */
export const CMS_PAGE_REVALIDATE = getCmsCacheRevalidate();
