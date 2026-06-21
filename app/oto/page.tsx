import type { Metadata } from "next";

import CarsPage from "@/components/cars/CarsPage";

export const metadata: Metadata = {
  title: "Ô tô điện VinFast chính hãng",
  description:
    "Khám phá đa dạng dòng ô tô điện VinFast tại VF Ngọc Anh Cà Mau — VF 3, VF 5, VF 6, VF 7, VF 8, VF 9 và VF e34. Giá tốt nhất, ưu đãi ngập tràn.",
  alternates: {
    canonical: "/oto",
  },
  openGraph: {
    title: "Mua ô tô điện VinFast chính hãng | VF Ngọc Anh",
    description:
      "Khám phá đa dạng dòng ô tô điện VinFast tại VF Ngọc Anh Cà Mau. Hỗ trợ trả góp, lái thử tận nhà.",
    url: "/oto",
    images: [
      {
        url: "/images/cars/oto-hero.jpg",
        width: 1200,
        height: 630,
        alt: "Dòng xe ô tô điện VinFast - VF Ngọc Anh Cà Mau",
      },
    ],
  },
};

export default function OtoPage() {
  return <CarsPage />;
}
