import type { Metadata } from "next";

import { StaticPagePreviewClient } from "@/components/admin-edit/StaticPagePreviewClient";
import { PreviewEditScopeProvider } from "@/components/admin-edit/PreviewEditScope";
import { getStaticPageEditorData } from "@/lib/cms/static-page-editor";
import { getSiteSeo } from "@/lib/cms/seo";
import { resolveDealershipContact } from "@/lib/dealership";
import { previewNoindexMetadata } from "@/lib/seo";
import { resolvePreviewEditAccess } from "@/lib/preview-access";

export async function generateMetadata(): Promise<Metadata> {
  return previewNoindexMetadata("Preview — Giới thiệu");
}

type Props = { searchParams: Promise<{ pt?: string }> };

export default async function GioiThieuPreviewRoute({ searchParams }: Props) {
  const { pt } = await searchParams;
  const serverAllowed = await resolvePreviewEditAccess({ pt });
  const [site, editorData] = await Promise.all([getSiteSeo(), getStaticPageEditorData("about")]);
  const contact = resolveDealershipContact(site);

  return (
    <PreviewEditScopeProvider scope="about" serverAllowed={serverAllowed}>
      <StaticPagePreviewClient
        slug="about"
        editorData={editorData}
        contact={contact}
        fallbackHeroBanners={[]}
      />
    </PreviewEditScopeProvider>
  );
}
