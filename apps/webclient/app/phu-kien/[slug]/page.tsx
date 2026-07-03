import type { Metadata } from "next";
import { notFound } from "next/navigation";

import AccessoryDetailPage from "@/components/accessories/AccessoryDetailPage";
import { getAccessories, getAccessoryBySlugOrId } from "@/lib/cms";
import { buildAccessoryMetadata } from "@/lib/seo/product-metadata";
import { accessoryDetailPath, resolveProductSlug, isReservedProductSlug } from "@/lib/seo/slugs";
import { PRODUCTION_SITE_URL } from "@/lib/seo/types";

export const revalidate = 120;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const accessories = await getAccessories();
  return accessories
    .map((product) => ({
      slug: resolveProductSlug(product, "accessory", product.name),
    }))
    .filter((entry) => !isReservedProductSlug(entry.slug));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return buildAccessoryMetadata(slug);
}

export default async function AccessoryDetailRoute({ params }: Props) {
  const { slug } = await params;
  if (isReservedProductSlug(slug)) notFound();
  const product = await getAccessoryBySlugOrId(slug);
  if (!product) notFound();

  const canonicalPath = accessoryDetailPath(product);
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.image.startsWith("http")
      ? product.image
      : `${PRODUCTION_SITE_URL}${product.image}`,
    description: product.description,
    brand: { "@type": "Brand", name: "VinFast" },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "VND",
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${PRODUCTION_SITE_URL}${canonicalPath}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <AccessoryDetailPage product={product} />
    </>
  );
}
