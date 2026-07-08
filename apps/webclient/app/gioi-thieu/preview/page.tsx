import type { Metadata } from "next";
import { headers } from "next/headers";

import { StaticPagePreviewClient } from "@/components/admin-edit/StaticPagePreviewClient";
import { PreviewEditScopeProvider } from "@/components/admin-edit/PreviewEditScope";
import { getStaticPageEditorData } from "@/lib/cms/static-page-editor";
import { getSiteSeo } from "@/lib/cms/seo";
import { resolveDealershipContact } from "@/lib/dealership";
import { previewNoindexMetadata } from "@/lib/seo";
import { canEnablePreviewEdit } from "@/lib/preview-edit-token";

export async function generateMetadata(): Promise<Metadata> {
  return previewNoindexMetadata("Preview — Giới thiệu");
}

export default async function GioiThieuPreviewRoute() {
  const referer = (await headers()).get("referer");
  const serverAllowed = canEnablePreviewEdit({ referer });
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
