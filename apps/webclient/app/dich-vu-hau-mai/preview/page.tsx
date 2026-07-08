import type { Metadata } from "next";
import { headers } from "next/headers";

import { StaticPagePreviewClient } from "@/components/admin-edit/StaticPagePreviewClient";
import { PreviewEditScopeProvider } from "@/components/admin-edit/PreviewEditScope";
import { getBanners } from "@/lib/cms";
import { getStaticPageEditorData } from "@/lib/cms/static-page-editor";
import { AFTER_SALES_HERO_BANNERS } from "@/lib/images";
import { previewNoindexMetadata } from "@/lib/seo";
import { canEnablePreviewEdit } from "@/lib/preview-edit-token";

export async function generateMetadata(): Promise<Metadata> {
  return previewNoindexMetadata("Preview — Dịch vụ hậu mãi");
}

export default async function AfterSalesPreviewRoute() {
  const referer = (await headers()).get("referer");
  const serverAllowed = canEnablePreviewEdit({ referer });
  const [editorData, heroBanners] = await Promise.all([
    getStaticPageEditorData("after-sales"),
    getBanners("after_sales"),
  ]);

  return (
    <PreviewEditScopeProvider scope="after-sales" serverAllowed={serverAllowed}>
      <StaticPagePreviewClient
        slug="after-sales"
        editorData={editorData}
        fallbackHeroBanners={heroBanners.length ? heroBanners : [...AFTER_SALES_HERO_BANNERS]}
      />
    </PreviewEditScopeProvider>
  );
}
