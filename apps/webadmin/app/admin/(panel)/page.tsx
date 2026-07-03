import { DashboardClient } from "@/components/admin/DashboardClient";
import { getAdminDashboardStats } from "@/lib/cms-data";

export const revalidate = 60;

export default async function DashboardPage() {
  const stats = await getAdminDashboardStats();
  return <DashboardClient stats={stats} />;
}
