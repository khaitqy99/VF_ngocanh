import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ScooterPreviewClient } from "@/components/admin-edit/ScooterPreviewClient";
import { getScooterDetailBySlug } from "@/lib/cms";
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

export default async function ScooterPreviewRoute({ params, searchParams }: Props) {
  const { slug } = await params;
  const { edit_token } = await searchParams;
  const previewPath = `/xe-may-dien/${slug}/preview`;
  const adminEdit = verifyPreviewEditToken(previewPath, edit_token);
  const detail = await getScooterDetailBySlug(slug);
  if (!detail) notFound();

  return (
    <ScooterPreviewClient
      detail={detail}
      admin={adminEdit}
      editToken={adminEdit ? (edit_token ?? null) : null}
    />
  );
}
