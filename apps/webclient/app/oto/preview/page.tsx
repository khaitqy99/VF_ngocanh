import type { Metadata } from "next";
import { headers } from "next/headers";
import { getBanners } from "@/lib/cms";
import { getCarsForAdminPreview } from "@/lib/cms/preview-catalog";
import { PreviewEditScopeProvider } from "@/components/admin-edit/PreviewEditScope";
import { PreviewCarsPage } from "@/components/admin-edit/PreviewEditViews";
import { previewNoindexMetadata } from "@/lib/seo";
import { canEnablePreviewEdit } from "@/lib/preview-edit-token";

export async function generateMetadata(): Promise<Metadata> {
  return previewNoindexMetadata("Preview catalog — Ô tô");
}

export default async function OtoCatalogPreviewRoute() {
  const referer = (await headers()).get("referer");
  const serverAllowed = canEnablePreviewEdit({ referer });
  const [cars, heroBanners] = await Promise.all([
    getCarsForAdminPreview(serverAllowed),
    getBanners("cars"),
  ]);

  return (
    <PreviewEditScopeProvider scope="oto" serverAllowed={serverAllowed}>
      <PreviewCarsPage cars={cars} heroBanners={heroBanners} />
    </PreviewEditScopeProvider>
  );
}
