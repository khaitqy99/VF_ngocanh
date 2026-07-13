import type { Metadata } from "next";
import { getBanners } from "@/lib/cms";
import { getAccessoriesForAdminPreview } from "@/lib/cms/preview-catalog";
import { PreviewEditScopeProvider } from "@/components/admin-edit/PreviewEditScope";
import { PreviewAccessoriesPage } from "@/components/admin-edit/PreviewEditViews";
import { previewNoindexMetadata } from "@/lib/seo";
import { resolvePreviewEditAccess } from "@/lib/preview-access";

export async function generateMetadata(): Promise<Metadata> {
  return previewNoindexMetadata("Preview catalog — Phụ kiện");
}

type Props = { searchParams: Promise<{ pt?: string }> };

export default async function AccessoryCatalogPreviewRoute({ searchParams }: Props) {
  const { pt } = await searchParams;
  const serverAllowed = await resolvePreviewEditAccess({ pt });
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
