import type { MetadataRoute } from "next";

import { SCHEMA_BUSINESS_NAME, SITE_DISPLAY_NAME } from "@/lib/dealership";
import { PRODUCTION_SITE_URL } from "@/lib/seo/types";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SCHEMA_BUSINESS_NAME,
    short_name: SITE_DISPLAY_NAME,
    description:
      "Đại lý VinFast 3S chính hãng tại Cà Mau — ô tô điện, xe máy điện, phụ kiện và dịch vụ hậu mãi.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0066cc",
    lang: "vi",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    id: PRODUCTION_SITE_URL,
  };
}
