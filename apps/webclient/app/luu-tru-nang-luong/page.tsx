import type { Metadata } from "next";

import EnergyStoragePage from "@/components/energy-storage/EnergyStoragePage";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbSchema } from "@/lib/seo/local-business";
import { buildStaticPageMetadata } from "@/lib/seo/page-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildStaticPageMetadata("energy");
}

export default function LuuTruNangLuongPage() {
  const breadcrumb = buildBreadcrumbSchema([
    { name: "Trang chủ", path: "/" },
    { name: "Lưu trữ năng lượng", path: "/luu-tru-nang-luong" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} />
      <EnergyStoragePage />
    </>
  );
}
