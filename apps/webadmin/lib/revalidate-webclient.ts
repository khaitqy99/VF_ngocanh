type RevalidatePayload = {
  tags?: string[];
  paths?: string[];
  warm?: boolean;
};

/** Hub routes that share layout data (footer, site SEO, navigation). */
export const PUBLIC_HUB_PATHS = [
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
] as const;

export async function revalidateWebclient(payload: RevalidatePayload): Promise<boolean> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const secret = process.env.REVALIDATION_SECRET;

  if (!siteUrl || !secret) {
    console.warn(
      "[revalidate] Thiếu NEXT_PUBLIC_SITE_URL hoặc REVALIDATION_SECRET — bỏ qua cache invalidation",
    );
    return false;
  }

  try {
    const response = await fetch(`${siteUrl.replace(/\/$/, "")}/api/revalidate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-revalidate-secret": secret,
      },
      body: JSON.stringify({ warm: true, ...payload }),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      console.error(`[revalidate] Thất bại (${response.status}):`, text);
      return false;
    }

    return true;
  } catch (error) {
    console.error("[revalidate] Lỗi khi gọi webclient:", error);
    return false;
  }
}

function uniquePaths(paths: string[]): string[] {
  return [...new Set(paths.filter(Boolean))];
}

export function vehicleRevalidatePayload(
  id: string,
  vehicleType: "car" | "scooter",
  slug?: string,
  previousSlug?: string,
): RevalidatePayload {
  const prefix = vehicleType === "car" ? "/oto" : "/xe-may-dien";
  const paths = uniquePaths([
    `${prefix}/${id}`,
    slug ? `${prefix}/${slug}` : "",
    previousSlug && previousSlug !== slug ? `${prefix}/${previousSlug}` : "",
    prefix,
    `${prefix}/preview`,
    "/",
    "/sitemap.xml",
  ]);

  return {
    tags: ["cms", vehicleType === "car" ? "cms-cars" : "cms-scooters", `vehicle-${id}`, "cms-seo"],
    paths,
  };
}

export function accessoryRevalidatePayload(
  id: string,
  slug?: string,
  previousSlug?: string,
): RevalidatePayload {
  return {
    tags: ["cms", "cms-accessories", `accessory-${id}`, "cms-seo"],
    paths: uniquePaths([
      `/phu-kien/${id}`,
      slug ? `/phu-kien/${slug}` : "",
      previousSlug && previousSlug !== slug ? `/phu-kien/${previousSlug}` : "",
      "/phu-kien",
      "/phu-kien/preview",
      "/",
      "/sitemap.xml",
    ]),
  };
}

export function homePageRevalidatePayload(): RevalidatePayload {
  return {
    tags: ["cms", "cms-home", "cms-banners-home", "cms-news"],
    paths: ["/"],
  };
}

const STATIC_PAGE_PATHS: Record<string, string> = {
  about: "/gioi-thieu",
  "after-sales": "/dich-vu-hau-mai",
  charging: "/pin-va-tram-sac",
  energy: "/luu-tru-nang-luong",
  home: "/",
  cars: "/oto",
  scooters: "/xe-may-dien",
  accessories: "/phu-kien",
  news: "/tin-tuc",
};

export function staticPageRevalidatePayload(slug: string): RevalidatePayload {
  const path = STATIC_PAGE_PATHS[slug];
  return {
    tags: ["cms", `cms-page-${slug}`, "cms-seo"],
    paths: path ? [path] : [],
  };
}

export function newsRevalidatePayload(slug?: string, previousSlug?: string): RevalidatePayload {
  return {
    tags: ["cms", "cms-news", "cms-home"],
    paths: uniquePaths([
      "/",
      "/tin-tuc",
      slug ? `/tin-tuc/${slug}` : "",
      previousSlug && previousSlug !== slug ? `/tin-tuc/${previousSlug}` : "",
      "/sitemap.xml",
    ]),
  };
}

export function sitewideLayoutRevalidatePayload(extraTags: string[] = []): RevalidatePayload {
  return {
    tags: uniquePaths(["cms", ...extraTags]),
    paths: [...PUBLIC_HUB_PATHS],
  };
}
