import type { Metadata } from "next";
import { headers } from "next/headers";

import { StaticPagePreviewClient } from "@/components/admin-edit/StaticPagePreviewClient";
import { PreviewEditScopeProvider } from "@/components/admin-edit/PreviewEditScope";
import { getStaticPageEditorData } from "@/lib/cms/static-page-editor";
import { previewNoindexMetadata } from "@/lib/seo";
import { canEnablePreviewEdit } from "@/lib/preview-edit-token";

export async function generateMetadata(): Promise<Metadata> {
  return previewNoindexMetadata("Preview — Lưu trữ năng lượng");
}

export default async function EnergyPreviewRoute() {
  const referer = (await headers()).get("referer");
  const serverAllowed = canEnablePreviewEdit({ referer });
  const editorData = await getStaticPageEditorData("energy");

  return (
    <PreviewEditScopeProvider scope="energy" serverAllowed={serverAllowed}>
      <StaticPagePreviewClient slug="energy" editorData={editorData} fallbackHeroBanners={[]} />
    </PreviewEditScopeProvider>
  );
}
