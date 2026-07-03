import Link from "next/link";
import { ScooterEditClient } from "@/components/admin/ScooterEditClient";
import { getAdminScooterDetail, getAdminScooters } from "@/lib/cms-data";

export const revalidate = 60;

export async function generateStaticParams() {
  const scooters = await getAdminScooters();
  return scooters.map((s: { id: string }) => ({ id: s.id }));
}

export default async function ScooterEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const detail = await getAdminScooterDetail(id);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  if (!detail) {
    return (
      <p className="py-12 text-center text-zinc-500">
        Không tìm thấy sản phẩm.{" "}
        <Link href="/admin/scooters" className="text-red-600 hover:underline">
          Quay lại
        </Link>
      </p>
    );
  }

  return <ScooterEditClient detail={detail} id={id} siteUrl={siteUrl} />;
}
