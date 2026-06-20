import type { Metadata } from "next";

import EnergyStoragePage from "@/components/energy-storage/EnergyStoragePage";

export const metadata: Metadata = {
  title: "Lưu trữ năng lượng",
  description:
    "Giải pháp lưu trữ năng lượng VinFast tại VF Ngọc Anh — pin LFP an toàn, tích hợp điện mặt trời, trạm sạc xe điện và hệ sinh thái V-Green.",
};

export default function LuuTruNangLuongPage() {
  return <EnergyStoragePage />;
}
