import { CarsListClient } from "@/components/admin/CarsListClient";

export const revalidate = 60;

export default async function CarsListPage() {
  return <CarsListClient />;
}
