import { PRODUCTION_SITE_URL, type SeoSchemaType } from "./types";

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

type CarDetail = {
  name: string;
  image: string;
  price: number;
  slogan: string;
  tagline: string;
  seats?: number;
};

type AccessoryDetail = {
  name: string;
  image: string;
  price: number;
  description: string;
  inStock?: boolean;
};

function absoluteImageUrl(image: string): string {
  return image.startsWith("http") ? image : `${PRODUCTION_SITE_URL}${image}`;
}

function resolveProductSchemaType(
  override: SeoSchemaType | string | undefined,
  fallback: "Car" | "Motorcycle" | "Product",
): string {
  if (
    override === "Car" ||
    override === "Motorcycle" ||
    override === "Product" ||
    override === "WebPage"
  ) {
    return override;
  }
  return fallback;
}

export function buildMotorcycleSchema(
  detail: MotorcycleDetail,
  canonicalPath: string,
  options?: { description?: string; schemaType?: SeoSchemaType | string },
) {
  const image = absoluteImageUrl(detail.image);
  const description = options?.description?.trim() || `${detail.slogan} — ${detail.tagline}`;

  return {
    "@context": "https://schema.org",
    "@type": resolveProductSchemaType(options?.schemaType, "Motorcycle"),
    name: `VinFast ${detail.name}`,
    image,
    description,
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

export function buildCarSchema(
  detail: CarDetail,
  canonicalPath: string,
  options?: { description?: string; schemaType?: SeoSchemaType | string },
) {
  const image = absoluteImageUrl(detail.image);
  const description = options?.description?.trim() || `${detail.slogan} — ${detail.tagline}`;

  return {
    "@context": "https://schema.org",
    "@type": resolveProductSchemaType(options?.schemaType, "Car"),
    name: `VinFast ${detail.name}`,
    image,
    description,
    brand: { "@type": "Brand", name: "VinFast" },
    model: detail.name,
    ...(typeof detail.seats === "number" ? { vehicleSeatingCapacity: detail.seats } : {}),
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

export function buildAccessoryProductSchema(
  detail: AccessoryDetail,
  canonicalPath: string,
  options?: { description?: string; schemaType?: SeoSchemaType | string },
) {
  const image = absoluteImageUrl(detail.image);
  const description = options?.description?.trim() || detail.description;

  return {
    "@context": "https://schema.org",
    "@type": resolveProductSchemaType(options?.schemaType, "Product"),
    name: detail.name,
    image,
    description,
    brand: { "@type": "Brand", name: "VinFast" },
    offers: {
      "@type": "Offer",
      price: detail.price,
      priceCurrency: "VND",
      availability:
        detail.inStock === false ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      url: `${PRODUCTION_SITE_URL}${canonicalPath}`,
      seller: { "@id": `${PRODUCTION_SITE_URL}/#dealer` },
    },
  };
}
