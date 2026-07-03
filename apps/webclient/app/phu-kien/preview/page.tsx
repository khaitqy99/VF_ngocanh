import type { Metadata } from "next";
import { getAccessories, getBanners } from "@/lib/cms";
import { previewNoindexMetadata } from "@/lib/seo";

import AccessoriesPage from "@/components/accessories/AccessoriesPage";

type Props = {
  searchParams: Promise<{ admin?: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return previewNoindexMetadata("Preview catalog — Phụ kiện");
}

export default async function AccessoryCatalogPreviewRoute({ searchParams }: Props) {
  const { admin } = await searchParams;
  const [accessories, heroBanners] = await Promise.all([
    getAccessories(),
    getBanners("accessories"),
  ]);

  return (
    <AccessoriesPage
      accessories={accessories}
      heroBanners={heroBanners}
      embedded
      adminEdit={admin === "1"}
    />
  );
}
