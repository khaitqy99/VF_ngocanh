import type { Metadata } from "next";

import AboutPage from "@/components/about/AboutPage";

export const metadata: Metadata = {
  title: "Giới thiệu về VF Ngọc Anh",
  description:
    "Tìm hiểu về VF Ngọc Anh — đại lý ủy quyền chính thức VinFast tại Cà Mau. Sứ mệnh, tầm nhìn, giá trị cốt lõi và hành trình phát triển.",
  alternates: {
    canonical: "/gioi-thieu",
  },
  openGraph: {
    title: "Giới thiệu về VF Ngọc Anh - Đại lý VinFast Cà Mau",
    description: "Tìm hiểu sứ mệnh, tầm nhìn và dịch vụ chuyên nghiệp của VF Ngọc Anh Cà Mau.",
    url: "/gioi-thieu",
    images: [
      {
        url: "/images/showroom.jpg",
        width: 1200,
        height: 630,
        alt: "Showroom VinFast Ngọc Anh Cà Mau",
      },
    ],
  },
};

export default function GioiThieuPage() {
  return <AboutPage />;
}
