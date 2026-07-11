import type { MetadataRoute } from "next";
import { PRODUCTION_SITE_URL } from "@/lib/seo/types";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", "/static/", "/preview", "/*/preview", "/*/preview/*"],
      },
    ],
    sitemap: `${PRODUCTION_SITE_URL}/sitemap.xml`,
    host: PRODUCTION_SITE_URL,
  };
}
