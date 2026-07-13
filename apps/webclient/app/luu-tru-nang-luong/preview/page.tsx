import type { Metadata } from "next";

import { StaticPagePreviewClient } from "@/components/admin-edit/StaticPagePreviewClient";
import { PreviewEditScopeProvider } from "@/components/admin-edit/PreviewEditScope";
import { getStaticPageEditorData } from "@/lib/cms/static-page-editor";
import { previewNoindexMetadata } from "@/lib/seo";
import { resolvePreviewEditAccess } from "@/lib/preview-access";

export async function generateMetadata(): Promise<Metadata> {
  return previewNoindexMetadata("Preview — Lưu trữ năng lượng");
}

type Props = { searchParams: Promise<{ pt?: string }> };

export default async function EnergyPreviewRoute({ searchParams }: Props) {
  const { pt } = await searchParams;
  const serverAllowed = await resolvePreviewEditAccess({ pt });
  const editorData = await getStaticPageEditorData("energy");

  return (
    <PreviewEditScopeProvider scope="energy" serverAllowed={serverAllowed}>
      <StaticPagePreviewClient slug="energy" editorData={editorData} fallbackHeroBanners={[]} />
    </PreviewEditScopeProvider>
  );
}
