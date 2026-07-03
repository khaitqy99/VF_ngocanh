import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ScooterPreviewClient } from "@/components/admin-edit/ScooterPreviewClient";
import { getScooterDetailBySlug } from "@/lib/cms";
import { previewNoindexMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ admin?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return previewNoindexMetadata(`Preview — ${slug}`);
}

export default async function ScooterPreviewRoute({ params, searchParams }: Props) {
  const { slug } = await params;
  const { admin } = await searchParams;
  const detail = await getScooterDetailBySlug(slug);
  if (!detail) notFound();

  return <ScooterPreviewClient detail={detail} admin={admin === "1"} />;
}
