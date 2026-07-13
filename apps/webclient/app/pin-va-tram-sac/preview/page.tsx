import type { Metadata } from "next";

import { StaticPagePreviewClient } from "@/components/admin-edit/StaticPagePreviewClient";
import { PreviewEditScopeProvider } from "@/components/admin-edit/PreviewEditScope";
import { getBanners } from "@/lib/cms";
import { getStaticPageEditorData } from "@/lib/cms/static-page-editor";
import { CHARGING_HERO_BANNERS } from "@/lib/images";
import { previewNoindexMetadata } from "@/lib/seo";
import { resolvePreviewEditAccess } from "@/lib/preview-access";

export async function generateMetadata(): Promise<Metadata> {
  return previewNoindexMetadata("Preview — Pin & Trạm sạc");
}

type Props = { searchParams: Promise<{ pt?: string }> };

export default async function ChargingPreviewRoute({ searchParams }: Props) {
  const { pt } = await searchParams;
  const serverAllowed = await resolvePreviewEditAccess({ pt });
  const [editorData, heroBanners] = await Promise.all([
    getStaticPageEditorData("charging"),
    getBanners("charging"),
  ]);

  return (
    <PreviewEditScopeProvider scope="charging" serverAllowed={serverAllowed}>
      <StaticPagePreviewClient
        slug="charging"
        editorData={editorData}
        fallbackHeroBanners={heroBanners.length ? heroBanners : [...CHARGING_HERO_BANNERS]}
      />
    </PreviewEditScopeProvider>
  );
}
