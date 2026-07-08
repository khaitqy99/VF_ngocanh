import type { Metadata } from "next";

import AfterSalesPage from "@/components/after-sales/AfterSalesPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBanners, getStaticPageContent } from "@/lib/cms";
import { buildBreadcrumbSchema } from "@/lib/seo/local-business";
import { buildStaticPageMetadata } from "@/lib/seo/page-metadata";

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  return buildStaticPageMetadata("after-sales");
}

export default async function DichVuHauMaiPage() {
  const [heroBanners, content] = await Promise.all([
    getBanners("after_sales"),
    getStaticPageContent("after-sales"),
  ]);
  const breadcrumb = buildBreadcrumbSchema([
    { name: "Trang chủ", path: "/" },
    { name: "Dịch vụ hậu mãi", path: "/dich-vu-hau-mai" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} />
      <AfterSalesPage heroBanners={heroBanners} content={content} />
    </>
  );
}
