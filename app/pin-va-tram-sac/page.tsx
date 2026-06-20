import type { Metadata } from "next";

import ChargingPage from "@/components/charging/ChargingPage";

export const metadata: Metadata = {
  title: "Pin và trạm sạc",
  description:
    "Hệ sinh thái pin & trạm sạc VinFast tại VF Ngọc Anh — mạng lưới 150.000+ cổng sạc, pin LFP an toàn, bộ sạc tại nhà và thiết bị di động chính hãng.",
};

export default function PinVaTramSacPage() {
  return <ChargingPage />;
}
