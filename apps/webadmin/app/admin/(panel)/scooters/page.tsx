import { ScootersListClient } from "@/components/admin/ScootersListClient";

export const revalidate = 60;

export default async function ScootersListPage() {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  return <ScootersListClient publicHref={`${siteUrl}/xe-may-dien`} />;
}
