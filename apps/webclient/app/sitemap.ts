import type { MetadataRoute } from "next";
import { getAccessories, getCars, getScooters } from "@/lib/cms";
import { accessoryDetailPath, carDetailPath, scooterDetailPath } from "@/lib/seo/slugs";
import { PRODUCTION_SITE_URL } from "@/lib/seo/types";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = PRODUCTION_SITE_URL;
  const [cars, scooters, accessories] = await Promise.all([
    getCars(),
    getScooters(),
    getAccessories(),
  ]);

  const staticRoutes = [
    "",
    "/gioi-thieu",
    "/oto",
    "/xe-may-dien",
    "/pin-va-tram-sac",
    "/luu-tru-nang-luong",
    "/phu-kien",
    "/dich-vu-hau-mai",
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: (route === "" ? "daily" : "weekly") as "daily" | "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }));

  const carRoutes = cars.map((car) => ({
    url: `${siteUrl}${carDetailPath(car)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const scooterRoutes = scooters.map((scooter) => ({
    url: `${siteUrl}${scooterDetailPath(scooter)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const accessoryRoutes = accessories.map((product) => ({
    url: `${siteUrl}${accessoryDetailPath(product)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...carRoutes, ...scooterRoutes, ...accessoryRoutes];
}
