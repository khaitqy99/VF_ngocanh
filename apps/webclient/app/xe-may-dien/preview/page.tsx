import type { Metadata } from "next";
import { getBanners, getScooters } from "@/lib/cms";
import { previewNoindexMetadata } from "@/lib/seo";

import ScootersPage from "@/components/scooters/ScootersPage";

type Props = {
  searchParams: Promise<{ admin?: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return previewNoindexMetadata("Preview catalog — Xe máy");
}

export default async function ScooterCatalogPreviewRoute({ searchParams }: Props) {
  const { admin } = await searchParams;
  const [scooters, heroBanners] = await Promise.all([getScooters(), getBanners("scooters")]);

  return (
    <ScootersPage
      scooters={scooters}
      heroBanners={heroBanners}
      embedded
      adminEdit={admin === "1"}
    />
  );
}
