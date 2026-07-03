import Link from "next/link";
import { AccessoryEditClient } from "@/components/admin/AccessoryEditClient";
import { getAdminAccessoryById, getAdminAccessories } from "@/lib/cms-data";
import { buildPreviewEditUrl } from "@/lib/preview-edit-url";
import { resolveProductSlug } from "@/lib/seo/slugs";

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

  const slug = resolveProductSlug({ id: acc.id, slug: undefined }, "accessory", acc.name);
  const previewUrl = buildPreviewEditUrl(siteUrl, `/phu-kien/${slug}/preview`);

  return <AccessoryEditClient product={acc} siteUrl={siteUrl} previewUrl={previewUrl} />;
}
