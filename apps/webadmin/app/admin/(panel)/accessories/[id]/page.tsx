import Link from "next/link";
import { AccessoryEditClient } from "@/components/admin/AccessoryEditClient";
import { getAdminAccessoryById, getAdminAccessories } from "@/lib/cms-data";

export const revalidate = 60;

export async function generateStaticParams() {
  const accessories = await getAdminAccessories();
  return accessories.map((a: { id: string }) => ({ id: a.id }));
}

export default async function AccessoryEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const acc = await getAdminAccessoryById(id);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  if (!acc) {
    return (
      <p className="py-12 text-center text-zinc-500">
        Không tìm thấy phụ kiện.{" "}
        <Link href="/admin/accessories" className="text-red-600 hover:underline">
          Quay lại
        </Link>
      </p>
    );
  }

  return <AccessoryEditClient product={acc} siteUrl={siteUrl} />;
}
