import type { Metadata } from "next";
import { getBanners, getScooters } from "@/lib/cms";
import { PreviewEditTokenProvider } from "@/components/admin-edit/PreviewEditTokenContext";
import { previewNoindexMetadata } from "@/lib/seo";
import { verifyPreviewEditToken } from "@/lib/preview-edit-token";

import ScootersPage from "@/components/scooters/ScootersPage";

const PREVIEW_PATH = "/xe-may-dien/preview";

type Props = {
  searchParams: Promise<{ edit_token?: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return previewNoindexMetadata("Preview catalog — Xe máy");
}

export default async function ScooterCatalogPreviewRoute({ searchParams }: Props) {
  const { edit_token } = await searchParams;
  const adminEdit = verifyPreviewEditToken(PREVIEW_PATH, edit_token);
  const [scooters, heroBanners] = await Promise.all([getScooters(), getBanners("scooters")]);

  return (
    <PreviewEditTokenProvider token={adminEdit ? (edit_token ?? null) : null}>
      <ScootersPage
        scooters={scooters}
        heroBanners={heroBanners}
        embedded={adminEdit}
        adminEdit={adminEdit}
      />
    </PreviewEditTokenProvider>
  );
}
