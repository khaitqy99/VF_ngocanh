import type { Metadata } from "next";

import ScootersPage from "@/components/scooters/ScootersPage";

export const metadata: Metadata = {
  title: "Xe máy điện",
  description:
    "Khám phá đa dạng dòng xe máy điện VinFast tại VF Ngọc Anh — Motio, Evo, Feliz, Klara, Vento và Theon.",
};

export default function XeMayDienPage() {
  return <ScootersPage />;
}
