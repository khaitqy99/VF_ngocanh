import { DashboardClient } from "@/components/admin/DashboardClient";
import { getDashboardOverview } from "@/lib/cms-data";

export const revalidate = 30;

export default async function DashboardPage() {
  const overview = await getDashboardOverview();
  return <DashboardClient overview={overview} />;
}
