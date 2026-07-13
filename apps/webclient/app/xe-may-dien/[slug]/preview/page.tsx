import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PreviewEditScopeProvider } from "@/components/admin-edit/PreviewEditScope";
import { PreviewScooterDetail } from "@/components/admin-edit/PreviewEditViews";
import { getScooterDetailBySlugForAdminPreview } from "@/lib/cms/preview-catalog";
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

export default async function ScooterPreviewRoute({ params, searchParams }: Props) {
  const { slug } = await params;
  const { pt } = await searchParams;
  const serverAllowed = await resolvePreviewEditAccess({ pt });
  const detail = await getScooterDetailBySlugForAdminPreview(slug, serverAllowed);
  if (!detail) notFound();

  return (
    <PreviewEditScopeProvider scope="xe-may-dien" serverAllowed={serverAllowed}>
      <PreviewScooterDetail detail={detail} />
    </PreviewEditScopeProvider>
  );
}
