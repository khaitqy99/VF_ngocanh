import type { Metadata } from "next";
import { getBanners, getCars } from "@/lib/cms";
import { PreviewEditTokenProvider } from "@/components/admin-edit/PreviewEditTokenContext";
import { previewNoindexMetadata } from "@/lib/seo";
import { verifyPreviewEditToken } from "@/lib/preview-edit-token";

import CarsPage from "@/components/cars/CarsPage";

const PREVIEW_PATH = "/oto/preview";

type Props = {
  searchParams: Promise<{ edit_token?: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return previewNoindexMetadata("Preview catalog — Ô tô");
}

export default async function OtoCatalogPreviewRoute({ searchParams }: Props) {
  const { edit_token } = await searchParams;
  const adminEdit = verifyPreviewEditToken(PREVIEW_PATH, edit_token);
  const [cars, heroBanners] = await Promise.all([getCars(), getBanners("cars")]);

  return (
    <PreviewEditTokenProvider token={adminEdit ? (edit_token ?? null) : null}>
      <CarsPage cars={cars} heroBanners={heroBanners} embedded={adminEdit} adminEdit={adminEdit} />
    </PreviewEditTokenProvider>
  );
}
