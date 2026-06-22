import type { Metadata } from "next";
import { notFound } from "next/navigation";

import AccessoryDetailPage from "@/components/accessories/AccessoryDetailPage";
import { ACCESSORIES, getAccessory } from "@/lib/accessories";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return ACCESSORIES.map((product) => ({ id: product.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = getAccessory(id);
  if (!product) return { title: "Không tìm thấy phụ kiện" };

  const title = `${product.name} — Phụ kiện chính hãng VinFast`;
  const description = `${product.description} Mua phụ kiện chính hãng tại đại lý VinFast Ngọc Anh Cà Mau.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/phu-kien/${id}`,
    },
    openGraph: {
      title,
      description,
      url: `/phu-kien/${id}`,
      images: [
        {
          url: product.image,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
  };
}

export default async function AccessoryDetailRoute({ params }: Props) {
  const { id } = await params;
  const product = getAccessory(id);
  if (!product) notFound();

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: `https://vinfast3scamau.com${product.image}`,
    description: product.description,
    brand: {
      "@type": "Brand",
      name: "VinFast",
    },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "VND",
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `https://vinfast3scamau.com/phu-kien/${product.id}`,
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
