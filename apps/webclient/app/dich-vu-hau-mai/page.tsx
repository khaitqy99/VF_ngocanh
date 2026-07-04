import type { Metadata } from "next";

import AfterSalesPage from "@/components/after-sales/AfterSalesPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBanners } from "@/lib/cms";
import { buildBreadcrumbSchema } from "@/lib/seo/local-business";
import { buildStaticPageMetadata } from "@/lib/seo/page-metadata";

export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
  return buildStaticPageMetadata("after-sales");
}

export default async function DichVuHauMaiPage() {
  const heroBanners = await getBanners("after_sales");
  const breadcrumb = buildBreadcrumbSchema([
    { name: "Trang chủ", path: "/" },
    { name: "Dịch vụ hậu mãi", path: "/dich-vu-hau-mai" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} />
      <AfterSalesPage heroBanners={heroBanners} />
    </>
  );
}
