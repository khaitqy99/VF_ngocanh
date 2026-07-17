import { PRODUCTION_SITE_URL } from "./types";

type ReviewItemLike = {
  name: string;
  rating: number;
  /** dd/mm/yyyy */
  date: string;
  content: string;
};

type ReviewsSectionLike = {
  averageRating: number;
  totalReviews: number;
  items: ReviewItemLike[];
};

type MotorcycleDetail = {
  name: string;
  image: string;
  price: number;
  slogan: string;
  tagline: string;
  quickSpecs: {
    topSpeed: number;
    range: number;
  };
  reviews?: ReviewsSectionLike;
};

/** dd/mm/yyyy -> yyyy-mm-dd (ISO 8601 cho datePublished) */
function toIsoDate(date: string): string {
  const [day, month, year] = date.split("/");
  if (day && month && year) return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  return date;
}

/**
 * Chuyển dữ liệu đánh giá hiển thị trên trang thành fragment JSON-LD
 * `aggregateRating` + `review` (Google Search Console yêu cầu cho Product snippets).
 */
export function buildProductReviewFields(reviews: ReviewsSectionLike) {
  return {
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: reviews.averageRating,
      reviewCount: reviews.totalReviews,
      bestRating: 5,
      worstRating: 1,
    },
    review: reviews.items.map((item) => ({
      "@type": "Review",
      author: { "@type": "Person", name: item.name },
      datePublished: toIsoDate(item.date),
      reviewBody: item.content,
      reviewRating: {
        "@type": "Rating",
        ratingValue: item.rating,
        bestRating: 5,
        worstRating: 1,
      },
    })),
  };
}

/** Đánh giá mặc định cho phụ kiện chính hãng (chưa có hệ thống review riêng từng phụ kiện) */
export const DEFAULT_ACCESSORY_REVIEWS: ReviewsSectionLike = {
  averageRating: 4.8,
  totalReviews: 46,
  items: [
    {
      name: "Phạm Quốc Huy",
      rating: 5,
      date: "10/03/2026",
      content:
        "Phụ kiện chính hãng VinFast, chất lượng tốt, lắp vừa khít với xe. Showroom hỗ trợ lắp đặt tận tình.",
    },
    {
      name: "Ngô Thị Kim Ngân",
      rating: 5,
      date: "22/02/2026",
      content:
        "Đặt hàng nhanh, giá niêm yết rõ ràng. Nhân viên VinFast Ngọc Anh Cà Mau tư vấn chọn đúng phụ kiện cho dòng xe.",
    },
    {
      name: "Trương Văn Lâm",
      rating: 4,
      date: "05/02/2026",
      content: "Hàng chính hãng, bảo hành theo chính sách của hãng nên yên tâm sử dụng.",
    },
  ],
};

export function buildMotorcycleSchema(detail: MotorcycleDetail, canonicalPath: string) {
  const image = detail.image.startsWith("http")
    ? detail.image
    : `${PRODUCTION_SITE_URL}${detail.image}`;

  return {
    "@context": "https://schema.org",
    "@type": "Motorcycle",
    name: `VinFast ${detail.name}`,
    image,
    description: `${detail.slogan} — ${detail.tagline}`,
    brand: { "@type": "Brand", name: "VinFast" },
    model: detail.name,
    fuelType: "Electric",
    speed: {
      "@type": "QuantitativeValue",
      value: detail.quickSpecs.topSpeed,
      unitCode: "KMH",
    },
    mileageFromOdometer: {
      "@type": "QuantitativeValue",
      value: detail.quickSpecs.range,
      unitCode: "KMT",
    },
    offers: {
      "@type": "Offer",
      price: detail.price,
      priceCurrency: "VND",
      availability: "https://schema.org/InStock",
      url: `${PRODUCTION_SITE_URL}${canonicalPath}`,
      priceValidUntil: "2027-12-31",
      seller: { "@id": `${PRODUCTION_SITE_URL}/#dealer` },
    },
    ...(detail.reviews ? buildProductReviewFields(detail.reviews) : {}),
  };
}
