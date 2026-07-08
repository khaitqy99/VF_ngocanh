import type { Metadata } from "next";

import CarsPage from "@/components/cars/CarsPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBanners, getCars } from "@/lib/cms";
import { buildBreadcrumbSchema, buildItemListSchema } from "@/lib/seo/local-business";
import { buildStaticPageMetadata } from "@/lib/seo/page-metadata";
import { carDetailPath } from "@/lib/seo/slugs";

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  return buildStaticPageMetadata("cars");
}

export default async function OtoPage() {
  const [cars, heroBanners] = await Promise.all([getCars(), getBanners("cars")]);
  const breadcrumb = buildBreadcrumbSchema([
    { name: "Trang chủ", path: "/" },
    { name: "Ô tô điện", path: "/oto" },
  ]);
  const itemList = buildItemListSchema({
    name: "Danh mục ô tô điện VinFast tại Cà Mau",
    description:
      "Các dòng ô tô điện VinFast đang phân phối tại VinFast Ngọc Anh Cà Mau — Vinfast 3S Cà Mau.",
    items: cars.map((car) => ({ name: car.name, url: carDetailPath(car) })),
  });

  return (
    <>
      <JsonLd data={[breadcrumb, itemList]} />
      <CarsPage cars={cars} heroBanners={heroBanners} />
    </>
  );
}
