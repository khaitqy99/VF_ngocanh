import type { Metadata } from "next";
import { notFound } from "next/navigation";

import AccessoryDetailPage from "@/components/accessories/AccessoryDetailPage";
import { getAccessoryBySlugOrId } from "@/lib/cms";
import { previewNoindexMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ admin?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return previewNoindexMetadata(`Preview — ${slug}`);
}

export default async function AccessoryPreviewRoute({ params, searchParams }: Props) {
  const { slug } = await params;
  const { admin } = await searchParams;
  const product = await getAccessoryBySlugOrId(slug);
  if (!product) notFound();

  return <AccessoryDetailPage product={product} embedded adminEdit={admin === "1"} />;
}
