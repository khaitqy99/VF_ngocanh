import type { Metadata } from "next";

import ScootersPage from "@/components/scooters/ScootersPage";

export const metadata: Metadata = {
  title: "Xe máy điện VinFast chính hãng",
  description:
    "Khám phá đa dạng dòng xe máy điện VinFast tại VF Ngọc Anh Cà Mau — Evo200, Feliz S, Klara S, Vento S và Theon S. Tiết kiệm, phong cách, xanh sạch.",
  alternates: {
    canonical: "/xe-may-dien",
  },
  openGraph: {
    title: "Xe máy điện VinFast chính hãng | VF Ngọc Anh",
    description:
      "Khám phá và đặt mua các dòng xe máy điện VinFast thông minh thế hệ mới tại VF Ngọc Anh Cà Mau.",
    url: "/xe-may-dien",
    images: [
      {
        url: "/images/evo-scooter.png",
        width: 1200,
        height: 630,
        alt: "Xe máy điện VinFast - VF Ngọc Anh",
      },
    ],
  },
};

export default function XeMayDienPage() {
  return <ScootersPage />;
}
