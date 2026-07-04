import { ScootersListClient } from "@/components/admin/ScootersListClient";

export const revalidate = 60;

export default async function ScootersListPage() {
  return <ScootersListClient />;
}
