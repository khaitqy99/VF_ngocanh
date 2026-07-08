import type { Metadata } from "next";

import EnergyStoragePage from "@/components/energy-storage/EnergyStoragePage";
import { JsonLd } from "@/components/seo/JsonLd";
import { getStaticPageContent } from "@/lib/cms";
import { buildBreadcrumbSchema } from "@/lib/seo/local-business";
import { buildStaticPageMetadata } from "@/lib/seo/page-metadata";

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  return buildStaticPageMetadata("energy");
}

export default async function LuuTruNangLuongPage() {
  const content = await getStaticPageContent("energy");
  const breadcrumb = buildBreadcrumbSchema([
    { name: "Trang chủ", path: "/" },
    { name: "Lưu trữ năng lượng", path: "/luu-tru-nang-luong" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} />
      <EnergyStoragePage content={content} />
    </>
  );
}
