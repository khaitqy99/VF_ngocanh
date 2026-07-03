import type { Metadata } from "next";
import { notFound } from "next/navigation";

import CarDetailPage from "@/components/cars/CarDetailPage";
import { getCarDetailAccessories, getCarDetailBySlug, getCars } from "@/lib/cms";
import { buildCarMetadata } from "@/lib/seo/product-metadata";
import { carDetailPath, resolveProductSlug } from "@/lib/seo/slugs";
import { PRODUCTION_SITE_URL } from "@/lib/seo/types";

export const revalidate = 120;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const cars = await getCars();
  return cars.map((car) => ({ slug: resolveProductSlug(car, "car") }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return buildCarMetadata(slug);
}

export default async function CarDetailRoute({ params }: Props) {
  const { slug } = await params;
  const detail = await getCarDetailBySlug(slug);
  if (!detail) notFound();

  const [detailAccessories] = await Promise.all([getCarDetailAccessories(detail.id)]);
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
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(carSchema) }}
      />
      <CarDetailPage detail={detail} detailAccessories={detailAccessories} />
    </>
  );
}
