import type { Metadata } from "next";

import HomePage from "@/components/home/HomePage";

export const metadata: Metadata = {
  title: "VF Ngọc Anh — Đại lý chính thức VinFast",
  description:
    "VF Ngọc Anh - Khám phá ô tô điện, xe máy điện VinFast với ưu đãi 0% lãi suất, miễn phí sạc, bảo hành dài hạn.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "VF Ngọc Anh — Đại lý chính thức VinFast",
    description: "Khám phá ô tô điện, xe máy điện VinFast với nhiều ưu đãi hấp dẫn.",
  },
};

export default function Page() {
  return <HomePage />;
}
