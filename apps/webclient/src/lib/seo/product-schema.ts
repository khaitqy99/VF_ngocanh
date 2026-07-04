import { PRODUCTION_SITE_URL } from "./types";

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
  };
}
