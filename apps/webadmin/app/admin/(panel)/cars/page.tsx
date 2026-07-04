import { CarsListClient } from "@/components/admin/CarsListClient";

export const revalidate = 60;

export default async function CarsListPage() {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  return <CarsListClient publicHref={`${siteUrl}/oto`} />;
}
