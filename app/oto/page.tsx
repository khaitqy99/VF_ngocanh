import type { Metadata } from "next";

import CarsPage from "@/components/cars/CarsPage";

export const metadata: Metadata = {
  title: "Ô tô",
  description:
    "Khám phá đa dạng dòng ô tô điện VinFast tại VF Ngọc Anh — VF 9, VF 8, VF 7, VF 6, VF 5 và VF e34.",
};

export default function OtoPage() {
  return <CarsPage />;
}
