import { CarsListClient } from "@/components/admin/CarsListClient";
import { buildPreviewEditUrl } from "@/lib/preview-edit-url";

export const revalidate = 60;

export default async function CarsListPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const previewUrl = buildPreviewEditUrl(siteUrl, "/oto/preview");

  return <CarsListClient previewUrl={previewUrl} publicHref={`${siteUrl}/oto`} />;
}
