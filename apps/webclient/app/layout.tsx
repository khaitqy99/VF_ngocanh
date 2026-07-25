import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";

import "./globals.css";
import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";
import FloatingButtons from "@/components/site/FloatingButtons";
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
  "Vinfast 3S Cà Mau",
  "đại lý VinFast Ngọc Anh Cà Mau",
  "ô tô điện Cà Mau",
  "xe máy điện Cà Mau",
  "showroom VinFast Ngọc Anh Cà Mau",
];

const GOOGLE_SITE_VERIFICATION = "sxgFg7V_2_LtDK9QCin2ka8viud2xHBRLTD";
const GOOGLE_TAG_MANAGER_ID = "GTM-WFTNR7TJ";

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
  const keywords = site.keywords?.length ? site.keywords : SITE_KEYWORDS;
  const verification =
    site.googleSiteVerification?.trim() ||
    process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
    GOOGLE_SITE_VERIFICATION;

  return {
    ...meta,
    metadataBase: new URL(PRODUCTION_SITE_URL),
    title: {
      default: site.defaultTitle ?? "Vinfast 3S Cà Mau",
      template: site.titleTemplate ?? "%s | Vinfast 3S Cà Mau",
    },
    keywords,
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
    verification: { google: verification },
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
      <head>
        <Script id="google-tag-manager" strategy="beforeInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GOOGLE_TAG_MANAGER_ID}');
          `}
        </Script>
      </head>
      <body className={`${plusJakartaSans.variable} relative font-sans antialiased`}>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GOOGLE_TAG_MANAGER_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <div
          aria-hidden
          className="home-grain pointer-events-none fixed inset-0 -z-10 opacity-[0.028] max-lg:hidden"
        />
        <GoogleAnalytics />
        <SiteNavigationJsonLd />
        <SiteHeader />
        <div className="relative">{children}</div>
        <SiteFooter />
        <FloatingButtons />
      </body>
    </html>
  );
}
