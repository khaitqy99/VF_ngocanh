export type WarmWebclientCacheResult = {
  ok: boolean;
  error?: string;
  redisDeletedKeys?: number;
  cars?: number;
  scooters?: number;
  vehicles?: number;
  vehicleDetails?: number;
  accessories?: number;
  banners?: number;
  staticPages?: number;
  pageSeo?: number;
  newsArticles?: number;
  settings?: number;
  redisKeys?: number;
};

export type WarmCacheConfigStatus = {
  siteUrl: string | null;
  secretConfigured: boolean;
  ready: boolean;
};

export function getWarmCacheConfigStatus(): WarmCacheConfigStatus {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || null;
  const secretConfigured = Boolean(process.env.REVALIDATION_SECRET?.trim());
  return {
    siteUrl,
    secretConfigured,
    ready: Boolean(siteUrl && secretConfigured),
  };
}

/** Gọi webclient POST /api/cache/warm — xóa cache cũ rồi preload toàn bộ CMS vào Redis. */
export async function warmWebclientCache(): Promise<WarmWebclientCacheResult> {
  const { siteUrl, secretConfigured, ready } = getWarmCacheConfigStatus();
  if (!ready || !siteUrl) {
    const missing: string[] = [];
    if (!siteUrl) missing.push("NEXT_PUBLIC_SITE_URL");
    if (!secretConfigured) missing.push("REVALIDATION_SECRET");
    return {
      ok: false,
      error: `Thiếu cấu hình: ${missing.join(", ")}`,
    };
  }

  const secret = process.env.REVALIDATION_SECRET!.trim();

  try {
    const response = await fetch(`${siteUrl.replace(/\/$/, "")}/api/cache/warm`, {
      method: "POST",
      headers: {
        "x-revalidate-secret": secret,
      },
      cache: "no-store",
    });

    const data = (await response.json().catch(() => null)) as WarmWebclientCacheResult | null;
    if (!response.ok) {
      return {
        ok: false,
        error: data?.error ?? `Warm cache thất bại (HTTP ${response.status})`,
      };
    }

    return { ok: true, ...data };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Không gọi được API warm cache",
    };
  }
}
