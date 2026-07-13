import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

import { PreviewEditScopeProvider } from "@/components/admin-edit/PreviewEditScope";
import { PreviewAccessoryDetail } from "@/components/admin-edit/PreviewEditViews";
import { getAccessoryForAdminPreview } from "@/lib/cms/preview-catalog";
import { previewNoindexMetadata } from "@/lib/seo";
import { canEnablePreviewEdit } from "@/lib/preview-edit-token";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return previewNoindexMetadata(`Preview — ${slug}`);
}

export default async function AccessoryPreviewRoute({ params }: Props) {
  const { slug } = await params;
  const referer = (await headers()).get("referer");
  const serverAllowed = canEnablePreviewEdit({ referer });
  const product = await getAccessoryForAdminPreview(slug, serverAllowed);
  if (!product) notFound();

  return (
    <PreviewEditScopeProvider scope="phu-kien" serverAllowed={serverAllowed}>
      <PreviewAccessoryDetail product={product} />
    </PreviewEditScopeProvider>
  );
}
