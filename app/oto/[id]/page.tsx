import type { Metadata } from "next";
import { notFound } from "next/navigation";

import CarDetailPage from "@/components/cars/CarDetailPage";
import { CARS } from "@/lib/cars";
import { getCarDetail } from "@/lib/car-details";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return CARS.map((car) => ({ id: car.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const detail = getCarDetail(id);
  if (!detail) return { title: "Không tìm thấy" };
  return {
    title: detail.tagline,
    description: `${detail.slogan} — Giá từ ${detail.price.toLocaleString("vi-VN")} VND tại VF Ngọc Anh.`,
  };
}

export default async function CarDetailRoute({ params }: Props) {
  const { id } = await params;
  const detail = getCarDetail(id);
  if (!detail) notFound();
  return <CarDetailPage detail={detail} />;
}
