import type { Metadata } from "next";

import ChargingPage from "@/components/charging/ChargingPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBanners } from "@/lib/cms";
import { buildBreadcrumbSchema } from "@/lib/seo/local-business";
import { buildStaticPageMetadata } from "@/lib/seo/page-metadata";

export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
  return buildStaticPageMetadata("charging");
}

export default async function PinVaTramSacPage() {
  const heroBanners = await getBanners("charging");
  const breadcrumb = buildBreadcrumbSchema([
    { name: "Trang chủ", path: "/" },
    { name: "Pin & Trạm sạc", path: "/pin-va-tram-sac" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} />
      <ChargingPage heroBanners={heroBanners} />
    </>
  );
}
