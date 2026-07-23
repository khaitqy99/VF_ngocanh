import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import ScooterDetailPage from "@/components/scooters/ScooterDetailPage";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  getScooterBySlug,
  getScooterDetailAccessories,
  getScooterDetailBySlug,
  getScooters,
} from "@/lib/cms";
import { getVehicleSeoById } from "@/lib/cms/seo";
import { buildScooterMetadata } from "@/lib/seo/product-metadata";
import { buildBreadcrumbSchema } from "@/lib/seo/local-business";
import { buildMotorcycleSchema } from "@/lib/seo/product-schema";
import {
  resolveLegacyVehicleSlug,
  resolveProductSlug,
  scooterDetailPath,
  isReservedProductSlug,
} from "@/lib/seo/slugs";

export const revalidate = 86400;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const scooters = await getScooters();
  return scooters
    .map((scooter) => ({ slug: resolveProductSlug(scooter, "scooter") }))
    .filter((entry) => !isReservedProductSlug(entry.slug));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return buildScooterMetadata(slug);
}

export default async function ScooterDetailRoute({ params }: Props) {
  const { slug } = await params;
  if (isReservedProductSlug(slug)) notFound();
  const [detail, detailAccessories] = await Promise.all([
    getScooterDetailBySlug(slug),
    getScooterDetailAccessories(),
  ]);
  if (!detail) {
    // 301 alias slug cũ (vd. xe-may-evo) về slug canonical để tránh 404
    const legacyId = resolveLegacyVehicleSlug(slug, "scooter");
    if (legacyId) {
      const scooter = await getScooterBySlug(legacyId);
      if (scooter) permanentRedirect(scooterDetailPath(scooter));
    }
    notFound();
  }

  const canonicalPath = scooterDetailPath({ id: detail.id, slug });
  const seo = await getVehicleSeoById(detail.id);
  const motorcycleSchema = buildMotorcycleSchema(detail, canonicalPath, {
    description: seo.metaDescription,
    schemaType: seo.schemaType,
  });

  const breadcrumb = buildBreadcrumbSchema([
    { name: "Trang chủ", path: "/" },
    { name: "Xe máy điện", path: "/xe-may-dien" },
    { name: detail.name, path: canonicalPath },
  ]);

  return (
    <>
      <JsonLd data={[motorcycleSchema, breadcrumb]} />
      <ScooterDetailPage detail={detail} detailAccessories={detailAccessories} />
    </>
  );
}
