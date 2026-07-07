import {
  DEALERSHIP_NAME,
  getShowroomSameAs,
  SCHEMA_BUSINESS_NAME,
  SHOWROOM_CITY,
  SHOWROOM_COUNTRY,
  SHOWROOM_EMAIL,
  SHOWROOM_LAT,
  SHOWROOM_LNG,
  SHOWROOM_OPENING,
  SHOWROOM_PHONE,
  SHOWROOM_POSTAL,
  SHOWROOM_REGION,
  SHOWROOM_STREET,
} from "@/lib/dealership";
import { mergeSiteSeoSettings } from "./resolve";
import { PRODUCTION_SITE_URL, SITE_BRAND_NAME, type SiteSeoSettings } from "./types";

export function buildAutoDealerSchema(site?: SiteSeoSettings | null) {
  const merged = mergeSiteSeoSettings(site);
  const org = merged.organization ?? {};

  const name = org.name?.trim() || SCHEMA_BUSINESS_NAME;
  const telephone = (org.telephone ?? SHOWROOM_PHONE).replace(/\s/g, "");
  const email = org.email?.trim() || SHOWROOM_EMAIL;
  const streetAddress = org.streetAddress?.trim() || SHOWROOM_STREET;
  const addressLocality = org.addressLocality?.trim() || SHOWROOM_CITY;
  const addressRegion = org.addressRegion?.trim() || SHOWROOM_REGION;
  const postalCode = org.postalCode?.trim() || SHOWROOM_POSTAL;
  const latitude = org.geo?.latitude ?? SHOWROOM_LAT;
  const longitude = org.geo?.longitude ?? SHOWROOM_LNG;
  const opens = org.openingHours?.opens ?? SHOWROOM_OPENING.opens;
  const closes = org.openingHours?.closes ?? SHOWROOM_OPENING.closes;
  const days = org.openingHours?.days ?? [...SHOWROOM_OPENING.days];
  const sameAs = org.sameAs?.length ? org.sameAs : getShowroomSameAs();
  const logo = org.logo?.trim() || `${PRODUCTION_SITE_URL}/images/vinfast/vinfast-logo-header.webp`;
  const image = merged.defaultOgImage?.startsWith("http")
    ? merged.defaultOgImage
    : `${PRODUCTION_SITE_URL}${merged.defaultOgImage ?? "/images/cars/oto-hero.webp"}`;

  return {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    "@id": `${PRODUCTION_SITE_URL}/#dealer`,
    name,
    alternateName: [DEALERSHIP_NAME, SITE_BRAND_NAME],
    image,
    url: PRODUCTION_SITE_URL,
    logo,
    telephone,
    email,
    priceRange: "$$$",
    address: {
      "@type": "PostalAddress",
      streetAddress,
      addressLocality,
      addressRegion,
      postalCode,
      addressCountry: SHOWROOM_COUNTRY,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude,
      longitude,
    },
    openingHoursSpecification: days.map((day) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: day,
      opens,
      closes,
    })),
    ...(sameAs.length ? { sameAs } : {}),
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Cà Mau, Việt Nam",
    },
  };
}

export function buildWebSiteSchema(site?: SiteSeoSettings | null) {
  const merged = mergeSiteSeoSettings(site);
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${PRODUCTION_SITE_URL}/#website`,
    name: merged.siteName ?? SITE_BRAND_NAME,
    alternateName: SCHEMA_BUSINESS_NAME,
    url: PRODUCTION_SITE_URL,
    inLanguage: "vi-VN",
    publisher: { "@id": `${PRODUCTION_SITE_URL}/#dealer` },
  };
}

export function buildBreadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${PRODUCTION_SITE_URL}${item.path.startsWith("/") ? item.path : `/${item.path}`}`,
    })),
  };
}

export function buildItemListSchema({
  name,
  description,
  items,
}: {
  name: string;
  description?: string;
  items: { name: string; url: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    ...(description ? { description } : {}),
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: `${PRODUCTION_SITE_URL}${item.url.startsWith("/") ? item.url : `/${item.url}`}`,
    })),
  };
}

export function buildLocalBusinessSchema(site?: SiteSeoSettings | null) {
  const base = buildAutoDealerSchema(site);
  return {
    ...base,
    "@type": "LocalBusiness",
    "@id": `${PRODUCTION_SITE_URL}/gioi-thieu#business`,
    description:
      "VinFast Ngọc Anh Cà Mau — Đại lý VinFast 3S chính thức tại Cà Mau, cung cấp ô tô điện, xe máy điện, phụ kiện và dịch vụ hậu mãi.",
  };
}

export function buildFaqPageSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
