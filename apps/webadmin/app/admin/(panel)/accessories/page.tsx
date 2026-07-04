import { AccessoriesListClient } from "@/components/admin/AccessoriesListClient";

export const revalidate = 60;

export default async function AccessoriesListPage() {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  return <AccessoriesListClient publicHref={`${siteUrl}/phu-kien`} />;
}
