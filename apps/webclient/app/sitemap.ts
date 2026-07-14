import type { MetadataRoute } from "next";
import { getAccessories, getCars, getNewsArticles, getScooters } from "@/lib/cms";
import { accessoryDetailPath, carDetailPath, scooterDetailPath } from "@/lib/seo/slugs";
import { PRODUCTION_SITE_URL } from "@/lib/seo/types";

/** Hub / landing ưu tiên crawl — ô tô & xe máy trước phụ kiện. */
const PRIORITY_HUB_ROUTES = ["", "/oto", "/xe-may-dien", "/gioi-thieu", "/tin-tuc"] as const;

const SECONDARY_HUB_ROUTES = [
  "/pin-va-tram-sac",
  "/luu-tru-nang-luong",
  "/dich-vu-hau-mai",
  "/phu-kien",
] as const;

const LEGAL_ROUTES = ["/chinh-sach-bao-mat", "/dieu-khoan-su-dung"] as const;

const HUB_PRIORITY: Record<string, number> = {
  "": 1.0,
  "/oto": 0.95,
  "/xe-may-dien": 0.95,
  "/gioi-thieu": 0.85,
  "/tin-tuc": 0.8,
  "/pin-va-tram-sac": 0.7,
  "/luu-tru-nang-luong": 0.7,
  "/dich-vu-hau-mai": 0.7,
  "/phu-kien": 0.55,
  "/chinh-sach-bao-mat": 0.2,
  "/dieu-khoan-su-dung": 0.2,
};

/** Loại product rõ ràng là bản test khỏi sitemap. */
function isTestProduct(id: string, name?: string): boolean {
  const haystack = `${id} ${name ?? ""}`.toLowerCase();
  return /(^|[\s/_-])(test|demo|sample|draft)([\s/_-]|$)/.test(haystack);
}

function entry(
  path: string,
  options: {
    lastModified?: Date;
    changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
  },
): MetadataRoute.Sitemap[number] {
  return {
    url: `${PRODUCTION_SITE_URL}${path}`,
    lastModified: options.lastModified ?? new Date(),
    changeFrequency: options.changeFrequency ?? "weekly",
    priority: options.priority,
  };
}

const LEGAL_SET = new Set<string>(LEGAL_ROUTES);

function buildHubEntries(routes: readonly string[]): MetadataRoute.Sitemap {
  return routes.map((route) =>
    entry(route, {
      changeFrequency: route === "" ? "daily" : LEGAL_SET.has(route) ? "yearly" : "weekly",
      priority: HUB_PRIORITY[route] ?? 0.5,
    }),
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const priorityHubs = buildHubEntries(PRIORITY_HUB_ROUTES);
  const secondaryHubs = buildHubEntries(SECONDARY_HUB_ROUTES);
  const legalHubs = buildHubEntries(LEGAL_ROUTES);

  try {
    const [cars, scooters, accessories, newsArticles] = await Promise.all([
      getCars(),
      getScooters(),
      getAccessories(),
      getNewsArticles(),
    ]);

    // Ô tô trước → xe máy → tin tức → phụ kiện (số lượng lớn, priority thấp)
    const carRoutes = cars
      .filter((car) => !isTestProduct(car.id, car.name))
      .map((car) =>
        entry(carDetailPath(car), {
          changeFrequency: "weekly",
          priority: 0.9,
        }),
      );

    const scooterRoutes = scooters
      .filter((scooter) => !isTestProduct(scooter.id, scooter.name))
      .map((scooter) =>
        entry(scooterDetailPath(scooter), {
          changeFrequency: "weekly",
          priority: 0.85,
        }),
      );

    const newsRoutes = newsArticles.map((article) =>
      entry(`/tin-tuc/${article.slug}`, {
        lastModified: article.updatedAt ? new Date(article.updatedAt) : new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      }),
    );

    const accessoryRoutes = accessories
      .filter((product) => !isTestProduct(product.id, product.name))
      .map((product) =>
        entry(accessoryDetailPath(product), {
          changeFrequency: "monthly",
          priority: 0.4,
        }),
      );

    return [
      ...priorityHubs,
      ...carRoutes,
      ...scooterRoutes,
      ...newsRoutes,
      ...secondaryHubs,
      ...accessoryRoutes,
      ...legalHubs,
    ];
  } catch (error) {
    console.error("[sitemap] Failed to load dynamic routes, serving static routes only:", error);
    return [...priorityHubs, ...secondaryHubs, ...legalHubs];
  }
}
