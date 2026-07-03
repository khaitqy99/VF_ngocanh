import type { Metadata } from "next";
import { notFound } from "next/navigation";

import AccessoryDetailPage from "@/components/accessories/AccessoryDetailPage";
import { PreviewEditTokenProvider } from "@/components/admin-edit/PreviewEditTokenContext";
import { getAccessoryBySlugOrId } from "@/lib/cms";
import { previewNoindexMetadata } from "@/lib/seo";
import { verifyPreviewEditToken } from "@/lib/preview-edit-token";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ edit_token?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return previewNoindexMetadata(`Preview — ${slug}`);
}

export default async function AccessoryPreviewRoute({ params, searchParams }: Props) {
  const { slug } = await params;
  const { edit_token } = await searchParams;
  const previewPath = `/phu-kien/${slug}/preview`;
  const adminEdit = verifyPreviewEditToken(previewPath, edit_token);
  const product = await getAccessoryBySlugOrId(slug);
  if (!product) notFound();

  return (
    <PreviewEditTokenProvider token={adminEdit ? (edit_token ?? null) : null}>
      <AccessoryDetailPage product={product} embedded adminEdit={adminEdit} />
    </PreviewEditTokenProvider>
  );
}
