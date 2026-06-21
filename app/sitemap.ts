import type { MetadataRoute } from "next";
import { CARS } from "@/lib/cars";
import { SCOOTERS } from "@/lib/scooters";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vinfast3scamau.com";

  // Static routes
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

  // Dynamic car routes
  const carRoutes = CARS.map((car) => ({
    url: `${siteUrl}/oto/${car.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const scooterRoutes = SCOOTERS.map((scooter) => ({
    url: `${siteUrl}/xe-may-dien/${scooter.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...carRoutes, ...scooterRoutes];
}
