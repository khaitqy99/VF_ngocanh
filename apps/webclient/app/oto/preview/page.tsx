import type { Metadata } from "next";
import { getBanners, getCars } from "@/lib/cms";
import { previewNoindexMetadata } from "@/lib/seo";

import CarsPage from "@/components/cars/CarsPage";

type Props = {
  searchParams: Promise<{ admin?: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return previewNoindexMetadata("Preview catalog — Ô tô");
}

export default async function OtoCatalogPreviewRoute({ searchParams }: Props) {
  const { admin } = await searchParams;
  const [cars, heroBanners] = await Promise.all([getCars(), getBanners("cars")]);

  return (
    <CarsPage
      cars={cars}
      heroBanners={heroBanners}
      embedded
      adminEdit={admin === "1"}
    />
  );
}
