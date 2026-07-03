import { AccessoriesListClient } from "@/components/admin/AccessoriesListClient";
import { buildPreviewEditUrl } from "@/lib/preview-edit-url";

export const revalidate = 60;

export default async function AccessoriesListPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const previewUrl = buildPreviewEditUrl(siteUrl, "/phu-kien/preview");

  return <AccessoriesListClient previewUrl={previewUrl} publicHref={`${siteUrl}/phu-kien`} />;
}
