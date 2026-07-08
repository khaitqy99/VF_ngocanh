type RevalidatePayload = {
  tags?: string[];
  paths?: string[];
};

export async function revalidateWebclient(payload: RevalidatePayload) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const secret = process.env.REVALIDATION_SECRET;

  if (!siteUrl || !secret) {
    console.warn("[revalidate] Thiếu NEXT_PUBLIC_SITE_URL hoặc REVALIDATION_SECRET — bỏ qua cache invalidation");
    return false;
  }

  try {
    const response = await fetch(`${siteUrl.replace(/\/$/, "")}/api/revalidate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-revalidate-secret": secret,
      },
      body: JSON.stringify(payload),
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
): RevalidatePayload {
  const prefix = vehicleType === "car" ? "/oto" : "/xe-may-dien";
  const paths = uniquePaths([
    `${prefix}/${id}`,
    slug ? `${prefix}/${slug}` : "",
    prefix,
    `${prefix}/preview`,
    "/",
  ]);

  return {
    tags: ["cms", vehicleType === "car" ? "cms-cars" : "cms-scooters", `vehicle-${id}`],
    paths,
  };
}

export function accessoryRevalidatePayload(id: string, slug?: string): RevalidatePayload {
  return {
    tags: ["cms", "cms-accessories"],
    paths: uniquePaths([`/phu-kien/${id}`, slug ? `/phu-kien/${slug}` : "", "/phu-kien", "/phu-kien/preview", "/"]),
  };
}

export function homePageRevalidatePayload(): RevalidatePayload {
  return {
    tags: ["cms", "cms-home", "cms-banners-home"],
    paths: ["/"],
  };
}

const STATIC_PAGE_PATHS: Record<string, string> = {
  about: "/gioi-thieu",
  "after-sales": "/dich-vu-hau-mai",
  charging: "/pin-va-tram-sac",
  energy: "/luu-tru-nang-luong",
};

export function staticPageRevalidatePayload(slug: string): RevalidatePayload {
  const path = STATIC_PAGE_PATHS[slug];
  return {
    tags: ["cms", `cms-page-${slug}`],
    paths: path ? [path] : [],
  };
}
