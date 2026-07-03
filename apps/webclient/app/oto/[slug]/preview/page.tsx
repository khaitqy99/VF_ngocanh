import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CarPreviewClient } from "@/components/admin-edit/CarPreviewClient";
import { getCarDetailBySlug } from "@/lib/cms";
import { previewNoindexMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ admin?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return previewNoindexMetadata(`Preview — ${slug}`);
}

export default async function CarPreviewRoute({ params, searchParams }: Props) {
  const { slug } = await params;
  const { admin } = await searchParams;
  const detail = await getCarDetailBySlug(slug);
  if (!detail) notFound();

  return <CarPreviewClient detail={detail} admin={admin === "1"} />;
}
