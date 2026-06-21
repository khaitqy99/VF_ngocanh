import type { Metadata } from "next";

import ChargingPage from "@/components/charging/ChargingPage";

export const metadata: Metadata = {
  title: "Hệ thống pin và trạm sạc VinFast",
  description:
    "Hệ sinh thái pin & trạm sạc VinFast tại VF Ngọc Anh Cà Mau — mạng lưới 150.000+ cổng sạc, công nghệ sạc siêu nhanh, pin LFP an toàn và bộ sạc tại nhà chính hãng.",
  alternates: {
    canonical: "/pin-va-tram-sac",
  },
  openGraph: {
    title: "Hệ thống pin và trạm sạc VinFast | VF Ngọc Anh Cà Mau",
    description:
      "Tìm hiểu bản đồ trạm sạc VinFast, chính sách thuê pin và bộ sạc di động, sạc treo tường chính hãng.",
    url: "/pin-va-tram-sac",
    images: [
      {
        url: "/images/charging-stations.jpg",
        width: 1200,
        height: 630,
        alt: "Hệ thống trạm sạc VinFast",
      },
    ],
  },
};

export default function PinVaTramSacPage() {
  return <ChargingPage />;
}
