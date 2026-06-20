import type { Metadata } from "next";

import AboutPage from "@/components/about/AboutPage";

export const metadata: Metadata = {
  title: "Giới thiệu",
  description:
    "Tìm hiểu về VF Ngọc Anh — đại lý ủy quyền chính thức VinFast. Sứ mệnh, tầm nhìn và hành trình phát triển.",
};

export default function GioiThieuPage() {
  return <AboutPage />;
}
