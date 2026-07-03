import type { Metadata } from "next";
import { getAccessories, getBanners } from "@/lib/cms";
import { PreviewEditTokenProvider } from "@/components/admin-edit/PreviewEditTokenContext";
import { previewNoindexMetadata } from "@/lib/seo";
import { verifyPreviewEditToken } from "@/lib/preview-edit-token";

import AccessoriesPage from "@/components/accessories/AccessoriesPage";

const PREVIEW_PATH = "/phu-kien/preview";

type Props = {
  searchParams: Promise<{ edit_token?: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return previewNoindexMetadata("Preview catalog — Phụ kiện");
}

export default async function AccessoryCatalogPreviewRoute({ searchParams }: Props) {
  const { edit_token } = await searchParams;
  const adminEdit = verifyPreviewEditToken(PREVIEW_PATH, edit_token);
  const [accessories, heroBanners] = await Promise.all([
    getAccessories(),
    getBanners("accessories"),
  ]);

  return (
    <PreviewEditTokenProvider token={adminEdit ? (edit_token ?? null) : null}>
      <AccessoriesPage
        accessories={accessories}
        heroBanners={heroBanners}
        embedded={adminEdit}
        adminEdit={adminEdit}
      />
    </PreviewEditTokenProvider>
  );
}
