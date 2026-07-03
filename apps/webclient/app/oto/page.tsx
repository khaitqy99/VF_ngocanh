import type { Metadata } from "next";

import CarsPage from "@/components/cars/CarsPage";
import { getBanners, getCars } from "@/lib/cms";
import { buildStaticPageMetadata } from "@/lib/seo/page-metadata";

export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
  return buildStaticPageMetadata("cars");
}

export default async function OtoPage() {
  const [cars, heroBanners] = await Promise.all([getCars(), getBanners("cars")]);
  return <CarsPage cars={cars} heroBanners={heroBanners} />;
}
