import type { MetadataRoute } from "next";
import { getAccessories, getCars, getNewsArticles, getScooters } from "@/lib/cms";
import {
  fetchAccessorySeoByIdMap,
  fetchVehicleSeoByIdMap,
  getPageSeo,
  getSiteSeo,
  seoRecordIsNoindex,
} from "@/lib/cms/seo";
import { accessoryDetailPath, carDetailPath, scooterDetailPath } from "@/lib/seo/slugs";
import { collectSitemapImages } from "@/lib/seo/sitemap-images";
import { PRODUCTION_SITE_URL, STATIC_PAGE_SEO } from "@/lib/seo/types";

export type SitemapEntryData = {
  path: string;
  url: string;
  lastModified: Date;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  priority: number;
  images: string[];
};

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

const LEGAL_SET = new Set<string>(LEGAL_ROUTES);

function isTestProduct(id: string, name?: string): boolean {
  const haystack = `${id} ${name ?? ""}`.toLowerCase();
  return /(^|[\s/_-])(test|demo|sample|draft)([\s/_-]|$)/.test(haystack);
}

function makeEntry(
  path: string,
  options: {
    lastModified?: Date;
    changeFrequency?: SitemapEntryData["changeFrequency"];
    priority: number;
    images?: Array<string | null | undefined>;
  },
): SitemapEntryData {
  return {
    path,
    url: `${PRODUCTION_SITE_URL}${path}`,
    lastModified: options.lastModified ?? new Date(),
    changeFrequency: options.changeFrequency ?? "weekly",
    priority: options.priority,
    images: collectSitemapImages(...(options.images ?? [])),
  };
}

async function loadStaticPageAssets(): Promise<{
  noindexPaths: Set<string>;
  imagesByPath: Map<string, string[]>;
}> {
  const site = await getSiteSeo();
  const noindexPaths = new Set<string>();
  const imagesByPath = new Map<string, string[]>();

  await Promise.all(
    STATIC_PAGE_SEO.map(async (page) => {
      const seo = await getPageSeo(page.slug);
      const pathKey = page.path === "/" ? "" : page.path;
      if (seoRecordIsNoindex(seo)) noindexPaths.add(pathKey);
      imagesByPath.set(
        pathKey,
        collectSitemapImages(seo?.ogImage, page.defaultOgImage, site.defaultOgImage),
      );
    }),
  );

  return { noindexPaths, imagesByPath };
}

function buildHubEntries(
  routes: readonly string[],
  noindexPaths: Set<string>,
  imagesByPath: Map<string, string[]>,
): SitemapEntryData[] {
  return routes
    .filter((route) => !noindexPaths.has(route))
    .map((route) =>
      makeEntry(route, {
        changeFrequency: route === "" ? "daily" : LEGAL_SET.has(route) ? "yearly" : "weekly",
        priority: HUB_PRIORITY[route] ?? 0.5,
        images: imagesByPath.get(route) ?? [],
      }),
    );
}

/** Shared sitemap data for `/sitemap.xml` and `/sitemap-images.xml`. */
export async function buildSitemapEntries(): Promise<SitemapEntryData[]> {
  let noindexPaths = new Set<string>();
  let imagesByPath = new Map<string, string[]>();

  try {
    const staticAssets = await loadStaticPageAssets();
    noindexPaths = staticAssets.noindexPaths;
    imagesByPath = staticAssets.imagesByPath;
  } catch (error) {
    console.error("[sitemap] Failed to load page SEO assets:", error);
  }

  const priorityHubs = buildHubEntries(PRIORITY_HUB_ROUTES, noindexPaths, imagesByPath);
  const secondaryHubs = buildHubEntries(SECONDARY_HUB_ROUTES, noindexPaths, imagesByPath);
  const legalHubs = buildHubEntries(LEGAL_ROUTES, noindexPaths, imagesByPath);

  try {
    const [cars, scooters, accessories, newsArticles, vehicleSeo, accessorySeo] = await Promise.all(
      [
        getCars(),
        getScooters(),
        getAccessories(),
        getNewsArticles(),
        fetchVehicleSeoByIdMap(),
        fetchAccessorySeoByIdMap(),
      ],
    );

    const carRoutes = cars
      .filter((car) => {
        if (isTestProduct(car.id, car.name)) return false;
        return !seoRecordIsNoindex(vehicleSeo.get(car.id));
      })
      .map((car) => {
        const seo = vehicleSeo.get(car.id);
        return makeEntry(carDetailPath(car), {
          changeFrequency: "weekly",
          priority: 0.9,
          images: [seo?.ogImage, car.image],
        });
      });

    const scooterRoutes = scooters
      .filter((scooter) => {
        if (isTestProduct(scooter.id, scooter.name)) return false;
        return !seoRecordIsNoindex(vehicleSeo.get(scooter.id));
      })
      .map((scooter) => {
        const seo = vehicleSeo.get(scooter.id);
        return makeEntry(scooterDetailPath(scooter), {
          changeFrequency: "weekly",
          priority: 0.85,
          images: [seo?.ogImage, scooter.image],
        });
      });

    const newsRoutes = newsArticles
      .filter((article) => !seoRecordIsNoindex(article.seo))
      .map((article) =>
        makeEntry(`/tin-tuc/${article.slug}`, {
          lastModified: article.updatedAt ? new Date(article.updatedAt) : new Date(),
          changeFrequency: "weekly",
          priority: 0.7,
          images: [article.seo?.ogImage, article.coverImageUrl],
        }),
      );

    const accessoryRoutes = accessories
      .filter((product) => {
        if (isTestProduct(product.id, product.name)) return false;
        return !seoRecordIsNoindex(accessorySeo.get(product.id));
      })
      .map((product) => {
        const seo = accessorySeo.get(product.id);
        return makeEntry(accessoryDetailPath(product), {
          changeFrequency: "monthly",
          priority: 0.4,
          images: [seo?.ogImage, product.image],
        });
      });

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

export function toNextSitemap(entries: SitemapEntryData[]): MetadataRoute.Sitemap {
  return entries.map((item) => ({
    url: item.url,
    lastModified: item.lastModified,
    changeFrequency: item.changeFrequency,
    priority: item.priority,
    ...(item.images.length ? { images: item.images } : {}),
  }));
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

/** Google image sitemap XML (xmlns:image). */
export function renderImageSitemapXml(entries: SitemapEntryData[]): string {
  const withImages = entries.filter((entry) => entry.images.length > 0);
  const body = withImages
    .map((entry) => {
      const imageTags = entry.images
        .map(
          (imageUrl) => `    <image:image>
      <image:loc>${escapeXml(imageUrl)}</image:loc>
    </image:image>`,
        )
        .join("\n");
      return `  <url>
    <loc>${escapeXml(entry.url)}</loc>
${imageTags}
  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${body}
</urlset>
`;
}
