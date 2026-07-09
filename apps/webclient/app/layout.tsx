import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import "./globals.css";
import SiteFooter from "@/components/site/SiteFooter";
import { GoogleAnalytics } from "@/components/seo/GoogleAnalytics";
import { SiteNavigationJsonLd } from "@/components/seo/SiteNavigationJsonLd";
import { SCHEMA_BUSINESS_NAME } from "@/lib/dealership";
import { getSiteSeo } from "@/lib/cms/seo";
import { seoToNextMetadata, resolveSeoContent } from "@/lib/seo";
import { PRODUCTION_SITE_URL } from "@/lib/seo/types";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin", "vietnamese"],
  variable: "--font-plus-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const SITE_KEYWORDS = [
  "VinFast Ngọc Anh Cà Mau",
  "VinFast Ngọc Anh Cà Mau",
  "Vinfast 3S Cà Mau",
  "đại lý VinFast Ngọc Anh Cà Mau",
  "ô tô điện Cà Mau",
  "xe máy điện Cà Mau",
  "showroom VinFast Ngọc Anh Cà Mau",
];

const GOOGLE_SITE_VERIFICATION = "sxgFg7V_2_LtDK9QCin2ka8viud2xHBRLTD";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteSeo();
  const resolved = resolveSeoContent(
    {},
    {
      title: site.defaultTitle,
      description: site.defaultDescription,
      image: site.defaultOgImage,
      path: "/",
    },
    site,
  );
  const meta = seoToNextMetadata(resolved, site);

  const lat = site.organization?.geo?.latitude ?? 9.173417;
  const lng = site.organization?.geo?.longitude ?? 105.19138;

  return {
    ...meta,
    metadataBase: new URL(PRODUCTION_SITE_URL),
    title: {
      default: site.defaultTitle ?? "Vinfast 3S Cà Mau",
      template: site.titleTemplate ?? "%s | Vinfast 3S Cà Mau",
    },
    keywords: SITE_KEYWORDS,
    authors: [{ name: SCHEMA_BUSINESS_NAME, url: PRODUCTION_SITE_URL }],
    creator: SCHEMA_BUSINESS_NAME,
    publisher: SCHEMA_BUSINESS_NAME,
    formatDetection: {
      telephone: true,
      email: true,
      address: true,
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "48x48" },
        { url: "/favicon.png", sizes: "32x32", type: "image/png" },
        { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
        { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
      shortcut: ["/favicon.ico", "/favicon.png"],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    },
    verification: { google: GOOGLE_SITE_VERIFICATION },
    other: {
      "geo.region": "VN-59",
      "geo.placename": "Cà Mau",
      "geo.position": `${lat};${lng}`,
      ICBM: `${lat}, ${lng}`,
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${plusJakartaSans.variable} relative font-sans antialiased`}>
        <div
          aria-hidden
          className="home-grain pointer-events-none fixed inset-0 z-[60] opacity-[0.028]"
        />
        <GoogleAnalytics />
        <SiteNavigationJsonLd />
        <div className="relative">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
