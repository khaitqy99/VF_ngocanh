import type { Metadata } from "next";

import AccessoriesPage from "@/components/accessories/AccessoriesPage";
import { getAccessories, getBanners } from "@/lib/cms";
import { buildStaticPageMetadata } from "@/lib/seo/page-metadata";

export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
  return buildStaticPageMetadata("accessories");
}

export default async function PhuKienPage() {
  const [accessories, heroBanners] = await Promise.all([
    getAccessories(),
    getBanners("accessories"),
  ]);
  return <AccessoriesPage accessories={accessories} heroBanners={heroBanners} />;
}
