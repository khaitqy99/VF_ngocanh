import type { Metadata } from "next";

import AccessoriesPage from "@/components/accessories/AccessoriesPage";

export const metadata: Metadata = {
  title: "Phụ kiện xe VinFast chính hãng",
  description:
    "Phụ kiện chính hãng VinFast tại VF Ngọc Anh Cà Mau — nâng cấp nội thất, bộ sạc treo tường, thảm lót sàn, phụ kiện an toàn và quà tặng VinFast cao cấp.",
  alternates: {
    canonical: "/phu-kien",
  },
  openGraph: {
    title: "Phụ kiện xe VinFast chính hãng | VF Ngọc Anh Cà Mau",
    description:
      "Trang bị các phụ kiện chính hãng tốt nhất cho xế cưng của bạn. Cam kết chính hãng 100%.",
    url: "/phu-kien",
    images: [
      {
        url: "/images/acc-charger.jpg",
        width: 1200,
        height: 630,
        alt: "Bộ phụ kiện sạc xe VinFast chính hãng",
      },
    ],
  },
};

export default function PhuKienPage() {
  return <AccessoriesPage />;
}
