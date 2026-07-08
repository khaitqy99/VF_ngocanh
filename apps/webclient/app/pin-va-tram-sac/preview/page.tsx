import type { Metadata } from "next";
import { headers } from "next/headers";

import { StaticPagePreviewClient } from "@/components/admin-edit/StaticPagePreviewClient";
import { PreviewEditScopeProvider } from "@/components/admin-edit/PreviewEditScope";
import { getBanners } from "@/lib/cms";
import { getStaticPageEditorData } from "@/lib/cms/static-page-editor";
import { CHARGING_HERO_BANNERS } from "@/lib/images";
import { previewNoindexMetadata } from "@/lib/seo";
import { canEnablePreviewEdit } from "@/lib/preview-edit-token";

export async function generateMetadata(): Promise<Metadata> {
  return previewNoindexMetadata("Preview — Pin & Trạm sạc");
}

export default async function ChargingPreviewRoute() {
  const referer = (await headers()).get("referer");
  const serverAllowed = canEnablePreviewEdit({ referer });
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
