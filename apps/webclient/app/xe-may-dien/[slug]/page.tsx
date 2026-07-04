import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ScooterDetailPage from "@/components/scooters/ScooterDetailPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { getScooterDetailAccessories, getScooterDetailBySlug, getScooters } from "@/lib/cms";
import { buildScooterMetadata } from "@/lib/seo/product-metadata";
import { buildBreadcrumbSchema } from "@/lib/seo/local-business";
import { buildMotorcycleSchema } from "@/lib/seo/product-schema";
import { resolveProductSlug, scooterDetailPath, isReservedProductSlug } from "@/lib/seo/slugs";

export const revalidate = 120;

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
  if (!detail) notFound();

  const canonicalPath = scooterDetailPath({ id: detail.id, slug });
  const motorcycleSchema = buildMotorcycleSchema(detail, canonicalPath);

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
