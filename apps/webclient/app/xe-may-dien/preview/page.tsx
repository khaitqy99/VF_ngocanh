import type { Metadata } from "next";
import { getBanners } from "@/lib/cms";
import { getScootersForAdminPreview } from "@/lib/cms/preview-catalog";
import { getScooterPricingSettings } from "@/lib/cms/scooter-pricing-fetch";
import { PreviewEditScopeProvider } from "@/components/admin-edit/PreviewEditScope";
import { PreviewScootersPage } from "@/components/admin-edit/PreviewEditViews";
import { previewNoindexMetadata } from "@/lib/seo";
import { resolvePreviewEditAccess } from "@/lib/preview-access";

export async function generateMetadata(): Promise<Metadata> {
  return previewNoindexMetadata("Preview catalog — Xe máy");
}

type Props = { searchParams: Promise<{ pt?: string }> };

export default async function ScooterCatalogPreviewRoute({ searchParams }: Props) {
  const { pt } = await searchParams;
  const serverAllowed = await resolvePreviewEditAccess({ pt });
  const [scooters, heroBanners, pricing] = await Promise.all([
    getScootersForAdminPreview(serverAllowed),
    getBanners("scooters"),
    getScooterPricingSettings(),
  ]);

  return (
    <PreviewEditScopeProvider scope="xe-may-dien" serverAllowed={serverAllowed}>
      <PreviewScootersPage scooters={scooters} heroBanners={heroBanners} pricing={pricing} />
    </PreviewEditScopeProvider>
  );
}
