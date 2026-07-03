import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ScooterDetailPage from "@/components/scooters/ScooterDetailPage";
import { getScooterDetailAccessories, getScooterDetailBySlug, getScooters } from "@/lib/cms";
import { buildScooterMetadata } from "@/lib/seo/product-metadata";
import { resolveProductSlug, scooterDetailPath } from "@/lib/seo/slugs";
import { PRODUCTION_SITE_URL } from "@/lib/seo/types";

export const revalidate = 120;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const scooters = await getScooters();
  return scooters.map((scooter) => ({ slug: resolveProductSlug(scooter, "scooter") }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return buildScooterMetadata(slug);
}

export default async function ScooterDetailRoute({ params }: Props) {
  const { slug } = await params;
  const [detail, detailAccessories] = await Promise.all([
    getScooterDetailBySlug(slug),
    getScooterDetailAccessories(),
  ]);
  if (!detail) notFound();

  const canonicalPath = scooterDetailPath({ id: detail.id, slug });
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `VinFast ${detail.name}`,
    image: detail.image.startsWith("http") ? detail.image : `${PRODUCTION_SITE_URL}${detail.image}`,
    description: `${detail.slogan} — ${detail.tagline}`,
    brand: { "@type": "Brand", name: "VinFast" },
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <ScooterDetailPage detail={detail} detailAccessories={detailAccessories} />
    </>
  );
}
