import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vinfast3scamau.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/_next/", "/static/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
