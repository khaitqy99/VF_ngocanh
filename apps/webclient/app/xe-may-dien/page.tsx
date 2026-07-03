import type { Metadata } from "next";

import ScootersPage from "@/components/scooters/ScootersPage";
import { getBanners, getScooters } from "@/lib/cms";
import { buildStaticPageMetadata } from "@/lib/seo/page-metadata";

export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
  return buildStaticPageMetadata("scooters");
}

export default async function XeMayDienPage() {
  const [scooters, heroBanners] = await Promise.all([getScooters(), getBanners("scooters")]);
  return <ScootersPage scooters={scooters} heroBanners={heroBanners} />;
}
