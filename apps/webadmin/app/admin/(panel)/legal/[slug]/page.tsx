import { LegalEditorClient } from "@/components/admin/LegalEditorClient";
import { isLegalPageSlug } from "@/lib/cms/legal";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export default async function LegalAdminPage({ params }: Props) {
  const { slug } = await params;
  if (!isLegalPageSlug(slug)) notFound();
  return <LegalEditorClient slug={slug} />;
}
