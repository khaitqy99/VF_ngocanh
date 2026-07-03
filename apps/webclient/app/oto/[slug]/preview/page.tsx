import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CarPreviewClient } from "@/components/admin-edit/CarPreviewClient";
import { getCarDetailBySlug } from "@/lib/cms";
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

export default async function CarPreviewRoute({ params, searchParams }: Props) {
  const { slug } = await params;
  const { edit_token } = await searchParams;
  const previewPath = `/oto/${slug}/preview`;
  const adminEdit = verifyPreviewEditToken(previewPath, edit_token);
  const detail = await getCarDetailBySlug(slug);
  if (!detail) notFound();

  return (
    <CarPreviewClient
      detail={detail}
      admin={adminEdit}
      editToken={adminEdit ? (edit_token ?? null) : null}
    />
  );
}
