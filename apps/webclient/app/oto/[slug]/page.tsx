import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import CarDetailPage from "@/components/cars/CarDetailPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { getCarDetailAccessories, getCarDetailBySlug, getCarBySlug, getCars } from "@/lib/cms";
import { getCarPricingSettings } from "@/lib/cms/car-pricing-fetch";
import { buildCarMetadata } from "@/lib/seo/product-metadata";
import { buildBreadcrumbSchema } from "@/lib/seo/local-business";
import {
  carDetailPath,
  resolveLegacyVehicleSlug,
  resolveProductSlug,
  isReservedProductSlug,
} from "@/lib/seo/slugs";
import { PRODUCTION_SITE_URL } from "@/lib/seo/types";

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

  const [detailAccessories, pricing] = await Promise.all([
    getCarDetailAccessories(detail.id),
    getCarPricingSettings(),
  ]);
  const canonicalPath = carDetailPath({ id: detail.id, slug });

  const carSchema = {
    "@context": "https://schema.org",
    "@type": "Car",
    name: `VinFast ${detail.name}`,
    image: detail.image.startsWith("http") ? detail.image : `${PRODUCTION_SITE_URL}${detail.image}`,
    description: `${detail.slogan} — ${detail.tagline}`,
    brand: { "@type": "Brand", name: "VinFast" },
    model: detail.name,
    vehicleSeatingCapacity: detail.seats,
    offers: {
      "@type": "Offer",
      price: detail.price,
      priceCurrency: "VND",
      availability: "https://schema.org/InStock",
      url: `${PRODUCTION_SITE_URL}${canonicalPath}`,
      priceValidUntil: "2027-12-31",
      seller: { "@id": `${PRODUCTION_SITE_URL}/#dealer` },
    },
  };

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
