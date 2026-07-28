import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PreviewEditScopeProvider } from "@/components/admin-edit/PreviewEditScope";
import { PreviewCarDetail } from "@/components/admin-edit/PreviewEditViews";
import { getCarDetailBySlugForAdminPreview } from "@/lib/cms/preview-catalog";
import { getCarPricingSettings } from "@/lib/cms/car-pricing-fetch";
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

export default async function CarPreviewRoute({ params, searchParams }: Props) {
  const { slug } = await params;
  const { pt } = await searchParams;
  const serverAllowed = await resolvePreviewEditAccess({ pt });
  const [detail, pricing] = await Promise.all([
    getCarDetailBySlugForAdminPreview(slug, serverAllowed),
    getCarPricingSettings(),
  ]);
  if (!detail) notFound();

  return (
    <PreviewEditScopeProvider scope="oto" serverAllowed={serverAllowed}>
      <PreviewCarDetail detail={detail} pricing={pricing} />
    </PreviewEditScopeProvider>
  );
}
