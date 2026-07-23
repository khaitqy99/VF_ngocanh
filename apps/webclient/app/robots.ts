import type { MetadataRoute } from "next";
import { getSiteSeo } from "@/lib/cms/seo";
import { PRODUCTION_SITE_URL } from "@/lib/seo/types";

const DEFAULT_DISALLOW = ["/api/", "/_next/", "/static/", "/preview", "/*/preview", "/*/preview/*"];

export default async function robots(): Promise<MetadataRoute.Robots> {
  const site = await getSiteSeo();
  const allowIndex = site.robots?.index !== false;
  const disallow = [
    ...new Set([...(site.robotsDisallow?.length ? site.robotsDisallow : DEFAULT_DISALLOW)]),
  ];

  // MetadataRoute.Robots has limited follow support; honor disallow + sitewide index flag.
  return {
    rules: [
      {
        userAgent: "*",
        ...(allowIndex
          ? {
              allow: "/",
              disallow,
            }
          : {
              disallow: "/",
            }),
      },
    ],
    sitemap: [`${PRODUCTION_SITE_URL}/sitemap.xml`, `${PRODUCTION_SITE_URL}/sitemap-images.xml`],
    host: PRODUCTION_SITE_URL,
  };
}
