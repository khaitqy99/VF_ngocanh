import Link from "next/link";
import { CarEditClient } from "@/components/admin/CarEditClient";
import { getAdminCarDetail, getAdminCars } from "@/lib/cms-data";

export const revalidate = 60;

export async function generateStaticParams() {
  const cars = await getAdminCars();
  return cars.map((c: { id: string }) => ({ id: c.id }));
}

export default async function CarEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const detail = await getAdminCarDetail(id);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  if (!detail) {
    return (
      <p className="py-12 text-center text-zinc-500">
        Không tìm thấy sản phẩm.{" "}
        <Link href="/admin/cars" className="text-red-600 hover:underline">
          Quay lại
        </Link>
      </p>
    );
  }

  return <CarEditClient detail={detail} id={id} siteUrl={siteUrl} />;
}
