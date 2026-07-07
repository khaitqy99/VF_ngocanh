import type { Metadata } from "next";

import AccessoriesPage from "@/components/accessories/AccessoriesPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { getAccessories, getBanners } from "@/lib/cms";
import { buildBreadcrumbSchema, buildItemListSchema } from "@/lib/seo/local-business";
import { buildStaticPageMetadata } from "@/lib/seo/page-metadata";
import { accessoryDetailPath } from "@/lib/seo/slugs";

export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
  return buildStaticPageMetadata("accessories");
}

export default async function PhuKienPage() {
  const [accessories, heroBanners] = await Promise.all([
    getAccessories(),
    getBanners("accessories"),
  ]);
  const breadcrumb = buildBreadcrumbSchema([
    { name: "Trang chủ", path: "/" },
    { name: "Phụ kiện", path: "/phu-kien" },
  ]);
  const itemList = buildItemListSchema({
    name: "Danh mục phụ kiện VinFast chính hãng tại Cà Mau",
    description: "Phụ kiện VinFast chính hãng đang phân phối tại VinFast Ngọc Anh Cà Mau — Vinfast 3S Cà Mau.",
    items: accessories.map((product) => ({
      name: product.name,
      url: accessoryDetailPath(product),
    })),
  });

  return (
    <>
      <JsonLd data={[breadcrumb, itemList]} />
      <AccessoriesPage accessories={accessories} heroBanners={heroBanners} />
    </>
  );
}
