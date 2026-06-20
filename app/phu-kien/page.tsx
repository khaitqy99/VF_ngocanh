import type { Metadata } from "next";

import AccessoriesPage from "@/components/accessories/AccessoriesPage";

export const metadata: Metadata = {
  title: "Phụ kiện xe",
  description:
    "Phụ kiện chính hãng VinFast tại VF Ngọc Anh — nội thất, sạc pin, an toàn, quà tặng và phụ kiện chung cho mọi dòng xe.",
};

export default function PhuKienPage() {
  return <AccessoriesPage />;
}
