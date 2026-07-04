import { AccessoriesListClient } from "@/components/admin/AccessoriesListClient";

export const revalidate = 60;

export default async function AccessoriesListPage() {
  return <AccessoriesListClient />;
}
