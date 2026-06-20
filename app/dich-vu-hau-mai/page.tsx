import type { Metadata } from "next";

import AfterSalesPage from "@/components/after-sales/AfterSalesPage";

export const metadata: Metadata = {
  title: "Dịch vụ hậu mãi",
  description:
    "Dịch vụ hậu mãi chính hãng VinFast tại VF Ngọc Anh — bảo dưỡng, sửa chữa, bảo hành, cứu hộ 24/7 và phụ tùng chính hãng.",
};

export default function DichVuHauMaiPage() {
  return <AfterSalesPage />;
}
