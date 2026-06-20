import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vfngocanh.vercel.app";

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
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
