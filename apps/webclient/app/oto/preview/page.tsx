import type { Metadata } from "next";
import { getBanners } from "@/lib/cms";
import { getCarsForAdminPreview } from "@/lib/cms/preview-catalog";
import { PreviewEditScopeProvider } from "@/components/admin-edit/PreviewEditScope";
import { PreviewCarsPage } from "@/components/admin-edit/PreviewEditViews";
import { previewNoindexMetadata } from "@/lib/seo";
import { resolvePreviewEditAccess } from "@/lib/preview-access";

export async function generateMetadata(): Promise<Metadata> {
  return previewNoindexMetadata("Preview catalog — Ô tô");
}

type Props = { searchParams: Promise<{ pt?: string }> };

export default async function OtoCatalogPreviewRoute({ searchParams }: Props) {
  const { pt } = await searchParams;
  const serverAllowed = await resolvePreviewEditAccess({ pt });
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
