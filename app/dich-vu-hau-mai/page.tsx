import type { Metadata } from "next";

import AfterSalesPage from "@/components/after-sales/AfterSalesPage";

export const metadata: Metadata = {
  title: "Dịch vụ hậu mãi chính hãng VinFast",
  description:
    "Dịch vụ hậu mãi chính hãng VinFast tại VF Ngọc Anh Cà Mau — bảo dưỡng định kỳ, sửa chữa chuyên nghiệp, chính sách bảo hành 10 năm, cứu hộ 24/7 và phụ tùng thay thế chính hãng.",
  alternates: {
    canonical: "/dich-vu-hau-mai",
  },
  openGraph: {
    title: "Dịch vụ hậu mãi & Bảo dưỡng VinFast | VF Ngọc Anh",
    description:
      "An tâm tuyệt đối với dịch vụ hậu mãi đẳng cấp cực kỳ chu đáo từ đại lý ủy quyền VinFast Cà Mau.",
    url: "/dich-vu-hau-mai",
    images: [
      {
        url: "/images/showroom.jpg",
        width: 1200,
        height: 630,
        alt: "Dịch vụ bảo dưỡng và xưởng dịch vụ VinFast Ngọc Anh",
      },
    ],
  },
};

export default function DichVuHauMaiPage() {
  return <AfterSalesPage />;
}
