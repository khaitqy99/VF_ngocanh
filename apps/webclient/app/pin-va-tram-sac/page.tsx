import type { Metadata } from "next";

import ChargingPage from "@/components/charging/ChargingPage";
import { getBanners } from "@/lib/cms";
import { buildStaticPageMetadata } from "@/lib/seo/page-metadata";

export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
  return buildStaticPageMetadata("charging");
}

export default async function PinVaTramSacPage() {
  const heroBanners = await getBanners("charging");
  return <ChargingPage heroBanners={heroBanners} />;
}
