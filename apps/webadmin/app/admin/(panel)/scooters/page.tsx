import { ScootersListClient } from "@/components/admin/ScootersListClient";
import { buildPreviewEditUrl } from "@/lib/preview-edit-url";

export const revalidate = 60;

export default async function ScootersListPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const previewUrl = buildPreviewEditUrl(siteUrl, "/xe-may-dien/preview");

  return <ScootersListClient previewUrl={previewUrl} publicHref={`${siteUrl}/xe-may-dien`} />;
}
