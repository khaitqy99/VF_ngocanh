import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vinfast3scamau.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "VF Ngọc Anh — Đại lý chính thức VinFast",
    template: "%s | VF Ngọc Anh",
  },
  description:
    "VF Ngọc Anh - Đại lý chính thức của VinFast. Khám phá ô tô điện, xe máy điện, phụ kiện và dịch vụ hậu mãi.",
  openGraph: {
    title: "VF Ngọc Anh — Đại lý chính thức VinFast",
    description: "Khám phá ô tô điện, xe máy điện VinFast với nhiều ưu đãi hấp dẫn.",
    type: "website",
    locale: "vi_VN",
    siteName: "VF Ngọc Anh",
    url: siteUrl,
    images: [
      {
        url: "/images/cars/oto-hero.jpg",
        width: 1200,
        height: 630,
        alt: "VF Ngọc Anh — Đại lý chính thức VinFast Cà Mau",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VF Ngọc Anh — Đại lý chính thức VinFast Cà Mau",
    description: "Khám phá ô tô điện, xe máy điện VinFast với nhiều ưu đãi hấp dẫn.",
    images: ["/images/cars/oto-hero.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
