import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PreviewEditScopeProvider } from "@/components/admin-edit/PreviewEditScope";
import { PreviewAccessoryDetail } from "@/components/admin-edit/PreviewEditViews";
import { getAccessoryForAdminPreview } from "@/lib/cms/preview-catalog";
import { previewNoindexMetadata } from "@/lib/seo";
import { resolvePreviewEditAccess } from "@/lib/preview-access";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ pt?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return previewNoindexMetadata(`Preview — ${slug}`);
}

export default async function AccessoryPreviewRoute({ params, searchParams }: Props) {
  const { slug } = await params;
  const { pt } = await searchParams;
  const serverAllowed = await resolvePreviewEditAccess({ pt });
  const product = await getAccessoryForAdminPreview(slug, serverAllowed);
  if (!product) notFound();

  return (
    <PreviewEditScopeProvider scope="phu-kien" serverAllowed={serverAllowed}>
      <PreviewAccessoryDetail product={product} />
    </PreviewEditScopeProvider>
  );
}
