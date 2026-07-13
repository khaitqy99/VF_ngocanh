import type { Metadata } from "next";
import { headers } from "next/headers";
import { getBanners } from "@/lib/cms";
import { getAccessoriesForAdminPreview } from "@/lib/cms/preview-catalog";
import { PreviewEditScopeProvider } from "@/components/admin-edit/PreviewEditScope";
import { PreviewAccessoriesPage } from "@/components/admin-edit/PreviewEditViews";
import { previewNoindexMetadata } from "@/lib/seo";
import { canEnablePreviewEdit } from "@/lib/preview-edit-token";

export async function generateMetadata(): Promise<Metadata> {
  return previewNoindexMetadata("Preview catalog — Phụ kiện");
}

export default async function AccessoryCatalogPreviewRoute() {
  const referer = (await headers()).get("referer");
  const serverAllowed = canEnablePreviewEdit({ referer });
  const [accessories, heroBanners] = await Promise.all([
    getAccessoriesForAdminPreview(serverAllowed),
    getBanners("accessories"),
  ]);

  return (
    <PreviewEditScopeProvider scope="phu-kien" serverAllowed={serverAllowed}>
      <PreviewAccessoriesPage accessories={accessories} heroBanners={heroBanners} />
    </PreviewEditScopeProvider>
  );
}
