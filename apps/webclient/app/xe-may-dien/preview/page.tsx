import type { Metadata } from "next";
import { headers } from "next/headers";
import { getBanners, getScooters } from "@/lib/cms";
import { PreviewEditScopeProvider } from "@/components/admin-edit/PreviewEditScope";
import { PreviewScootersPage } from "@/components/admin-edit/PreviewEditViews";
import { previewNoindexMetadata } from "@/lib/seo";
import { canEnablePreviewEdit } from "@/lib/preview-edit-token";

export async function generateMetadata(): Promise<Metadata> {
  return previewNoindexMetadata("Preview catalog — Xe máy");
}

export default async function ScooterCatalogPreviewRoute() {
  const referer = (await headers()).get("referer");
  const serverAllowed = canEnablePreviewEdit({ referer });
  const [scooters, heroBanners] = await Promise.all([getScooters(), getBanners("scooters")]);

  return (
    <PreviewEditScopeProvider scope="xe-may-dien" serverAllowed={serverAllowed}>
      <PreviewScootersPage scooters={scooters} heroBanners={heroBanners} />
    </PreviewEditScopeProvider>
  );
}
