import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import "./globals.css";
import { getSiteSeo } from "@/lib/cms/seo";
import { seoToNextMetadata, resolveSeoContent } from "@/lib/seo";
import { PRODUCTION_SITE_URL } from "@/lib/seo/types";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin", "vietnamese"],
  variable: "--font-plus-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

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
  return {
    ...meta,
    metadataBase: new URL(PRODUCTION_SITE_URL),
    title: {
      default: site.defaultTitle ?? "Vinfast 3S Cà Mau",
      template: site.titleTemplate ?? "%s | Vinfast 3S Cà Mau",
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${plusJakartaSans.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
