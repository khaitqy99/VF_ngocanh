import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import CarDetailPage from "@/components/cars/CarDetailPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { getCarDetailAccessories, getCarDetailBySlug, getCarBySlug, getCars } from "@/lib/cms";
import { getCarPricingSettings } from "@/lib/cms/car-pricing-fetch";
import { getVehicleSeoById } from "@/lib/cms/seo";
import { buildCarMetadata } from "@/lib/seo/product-metadata";
import { buildBreadcrumbSchema } from "@/lib/seo/local-business";
import { buildCarSchema } from "@/lib/seo/product-schema";
import {
  carDetailPath,
  resolveLegacyVehicleSlug,
  resolveProductSlug,
  isReservedProductSlug,
} from "@/lib/seo/slugs";

export const revalidate = 86400;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const cars = await getCars();
  return cars
    .map((car) => ({ slug: resolveProductSlug(car, "car") }))
    .filter((entry) => !isReservedProductSlug(entry.slug));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return buildCarMetadata(slug);
}

export default async function CarDetailRoute({ params }: Props) {
  const { slug } = await params;
  if (isReservedProductSlug(slug)) notFound();
  const detail = await getCarDetailBySlug(slug);
  if (!detail) {
    // 301 alias slug cũ (vd. vinfast-vf3) về slug canonical để tránh 404
    const legacyId = resolveLegacyVehicleSlug(slug, "car");
    if (legacyId) {
      const car = await getCarBySlug(legacyId);
      if (car) permanentRedirect(carDetailPath(car));
    }
    notFound();
  }

  const [detailAccessories, pricing, seo] = await Promise.all([
    getCarDetailAccessories(detail.id),
    getCarPricingSettings(),
    getVehicleSeoById(detail.id),
  ]);
  const canonicalPath = carDetailPath({ id: detail.id, slug });

  const carSchema = buildCarSchema(detail, canonicalPath, {
    description: seo.metaDescription,
    schemaType: seo.schemaType,
  });

  const breadcrumb = buildBreadcrumbSchema([
    { name: "Trang chủ", path: "/" },
    { name: "Ô tô điện", path: "/oto" },
    { name: detail.name, path: canonicalPath },
  ]);

  return (
    <>
      <JsonLd data={[carSchema, breadcrumb]} />
      <CarDetailPage detail={detail} detailAccessories={detailAccessories} pricing={pricing} />
    </>
  );
}
