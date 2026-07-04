import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

import { PreviewEditScopeProvider } from "@/components/admin-edit/PreviewEditScope";
import { PreviewScooterDetail } from "@/components/admin-edit/PreviewEditViews";
import { getScooterDetailBySlug } from "@/lib/cms";
import { previewNoindexMetadata } from "@/lib/seo";
import { canEnablePreviewEdit } from "@/lib/preview-edit-token";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return previewNoindexMetadata(`Preview — ${slug}`);
}

export default async function ScooterPreviewRoute({ params }: Props) {
  const { slug } = await params;
  const referer = (await headers()).get("referer");
  const serverAllowed = canEnablePreviewEdit({ referer });
  const detail = await getScooterDetailBySlug(slug);
  if (!detail) notFound();

  return (
    <PreviewEditScopeProvider scope="xe-may-dien" serverAllowed={serverAllowed}>
      <PreviewScooterDetail detail={detail} />
    </PreviewEditScopeProvider>
  );
}
