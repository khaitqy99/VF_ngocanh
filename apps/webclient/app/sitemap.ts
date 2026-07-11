import type { MetadataRoute } from "next";
import { getAccessories, getCars, getScooters } from "@/lib/cms";
import { accessoryDetailPath, carDetailPath, scooterDetailPath } from "@/lib/seo/slugs";
import { PRODUCTION_SITE_URL } from "@/lib/seo/types";

const STATIC_ROUTES = [
  "",
  "/gioi-thieu",
  "/oto",
  "/xe-may-dien",
  "/pin-va-tram-sac",
  "/luu-tru-nang-luong",
  "/phu-kien",
  "/dich-vu-hau-mai",
  "/chinh-sach-bao-mat",
  "/dieu-khoan-su-dung",
] as const;

const LEGAL_ROUTES = new Set(["/chinh-sach-bao-mat", "/dieu-khoan-su-dung"]);

function buildStaticEntries(): MetadataRoute.Sitemap {
  return STATIC_ROUTES.map((route) => ({
    url: `${PRODUCTION_SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency:
      route === ""
        ? ("daily" as const)
        : LEGAL_ROUTES.has(route)
          ? ("yearly" as const)
          : ("weekly" as const),
    priority: route === "" ? 1.0 : LEGAL_ROUTES.has(route) ? 0.3 : 0.8,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = buildStaticEntries();

  try {
    const [cars, scooters, accessories] = await Promise.all([
      getCars(),
      getScooters(),
      getAccessories(),
    ]);

    const carRoutes = cars.map((car) => ({
      url: `${PRODUCTION_SITE_URL}${carDetailPath(car)}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    const scooterRoutes = scooters.map((scooter) => ({
      url: `${PRODUCTION_SITE_URL}${scooterDetailPath(scooter)}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    const accessoryRoutes = accessories.map((product) => ({
      url: `${PRODUCTION_SITE_URL}${accessoryDetailPath(product)}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

    return [...staticRoutes, ...carRoutes, ...scooterRoutes, ...accessoryRoutes];
  } catch (error) {
    console.error("[sitemap] Failed to load dynamic routes, serving static routes only:", error);
    return staticRoutes;
  }
}
