import type { Metadata } from "next";

import EnergyStoragePage from "@/components/energy-storage/EnergyStoragePage";

export const metadata: Metadata = {
  title: "Giải pháp lưu trữ năng lượng VinFast LFP",
  description:
    "Giải pháp lưu trữ năng lượng VinFast tại VF Ngọc Anh Cà Mau — pin LFP an toàn, tích hợp điện mặt trời, trạm sạc xe điện và hệ sinh thái năng lượng xanh V-Green.",
  alternates: {
    canonical: "/luu-tru-nang-luong",
  },
  openGraph: {
    title: "Giải pháp lưu trữ năng lượng xanh VinFast LFP | VF Ngọc Anh",
    description:
      "Khám phá giải pháp lưu trữ năng lượng thông minh, an toàn, tích hợp điện mặt trời tại Cà Mau.",
    url: "/luu-tru-nang-luong",
    images: [
      {
        url: "/images/charging-stations.jpg",
        width: 1200,
        height: 630,
        alt: "Giải pháp lưu trữ năng lượng VinFast",
      },
    ],
  },
};

export default function LuuTruNangLuongPage() {
  return <EnergyStoragePage />;
}
