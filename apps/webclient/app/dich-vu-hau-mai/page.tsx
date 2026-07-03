import type { Metadata } from "next";

import AfterSalesPage from "@/components/after-sales/AfterSalesPage";
import { getBanners } from "@/lib/cms";
import { buildStaticPageMetadata } from "@/lib/seo/page-metadata";

export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
  return buildStaticPageMetadata("after-sales");
}

export default async function DichVuHauMaiPage() {
  const heroBanners = await getBanners("after_sales");
  return <AfterSalesPage heroBanners={heroBanners} />;
}
