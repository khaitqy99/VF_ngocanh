import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ScooterDetailPage from "@/components/scooters/ScooterDetailPage";
import { SCOOTERS } from "@/lib/scooters";
import { getScooterDetail } from "@/lib/scooter-details";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return SCOOTERS.map((scooter) => ({ id: scooter.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const detail = getScooterDetail(id);
  if (!detail) return { title: "Không tìm thấy xe máy" };
  const title = `${detail.name} — ${detail.tagline}`;
  const description = `${detail.slogan} — Khám phá chi tiết thông số kỹ thuật, bảng giá, ưu đãi và chính sách trả góp tại đại lý VinFast Ngọc Anh Cà Mau.`;
  const image = detail.image;
  return {
    title,
    description,
    alternates: {
      canonical: `/xe-may-dien/${id}`,
    },
    openGraph: {
      title,
      description,
      url: `/xe-may-dien/${id}`,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `VinFast ${detail.name} - VF Ngọc Anh Cà Mau`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function ScooterDetailRoute({ params }: Props) {
  const { id } = await params;
  const detail = getScooterDetail(id);
  if (!detail) notFound();

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `VinFast ${detail.name}`,
    image: `https://vinfast3scamau.com${detail.image}`,
    description: `${detail.slogan} — ${detail.tagline}`,
    brand: {
      "@type": "Brand",
      name: "VinFast",
    },
    offers: {
      "@type": "Offer",
      price: detail.price,
      priceCurrency: "VND",
      availability: "https://schema.org/InStock",
      url: `https://vinfast3scamau.com/xe-may-dien/${detail.id}`,
      priceValidUntil: "2027-12-31",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <ScooterDetailPage detail={detail} />
    </>
  );
}
