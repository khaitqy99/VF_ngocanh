import type { Metadata } from "next";

import ScootersPage from "@/components/scooters/ScootersPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBanners, getScooters } from "@/lib/cms";
import { buildBreadcrumbSchema, buildItemListSchema } from "@/lib/seo/local-business";
import { buildStaticPageMetadata } from "@/lib/seo/page-metadata";
import { scooterDetailPath } from "@/lib/seo/slugs";

export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
  return buildStaticPageMetadata("scooters");
}

export default async function XeMayDienPage() {
  const [scooters, heroBanners] = await Promise.all([getScooters(), getBanners("scooters")]);
  const breadcrumb = buildBreadcrumbSchema([
    { name: "Trang chủ", path: "/" },
    { name: "Xe máy điện", path: "/xe-may-dien" },
  ]);
  const itemList = buildItemListSchema({
    name: "Danh mục xe máy điện VinFast tại Cà Mau",
    description: "Các dòng xe máy điện VinFast đang phân phối tại VF Ngọc Anh — Vinfast 3S Cà Mau.",
    items: scooters.map((scooter) => ({ name: scooter.name, url: scooterDetailPath(scooter) })),
  });

  return (
    <>
      <JsonLd data={[breadcrumb, itemList]} />
      <ScootersPage scooters={scooters} heroBanners={heroBanners} />
    </>
  );
}
