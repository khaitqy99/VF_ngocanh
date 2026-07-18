import type { Metadata } from "next";

import {
  getShowroomSameAs,
  SCHEMA_BUSINESS_NAME,
  SHOWROOM_CITY,
  SHOWROOM_EMAIL,
  SHOWROOM_LAT,
  SHOWROOM_LNG,
  SHOWROOM_OPENING,
  SHOWROOM_PHONE,
  SHOWROOM_POSTAL,
  SHOWROOM_REGION,
  SHOWROOM_STREET,
} from "@/lib/dealership";
import {
  PRODUCTION_SITE_URL,
  SITE_BRAND_NAME,
  type OrganizationSettings,
  type SeoRecord,
  type SiteSeoSettings,
  type StaticPageSeoDefinition,
} from "./types";

function mergeOrganization(
  base?: OrganizationSettings,
  partial?: OrganizationSettings,
): OrganizationSettings | undefined {
  if (!base && !partial) return undefined;
  return {
    ...base,
    ...partial,
    geo: { ...base?.geo, ...partial?.geo },
    openingHours: { ...base?.openingHours, ...partial?.openingHours },
    sameAs: partial?.sameAs?.length ? partial.sameAs : base?.sameAs,
  };
}

export type SeoAutoFill = {
  title?: string;
  description?: string;
  image?: string;
  path?: string;
};

function asTrimmedString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

/** Prefer camelCase SEO fields; accept legacy { title, description } from seed/create. */
export function parseSeoRecord(value: unknown): SeoRecord {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const raw = value as Record<string, unknown>;
  const robots =
    raw.robots && typeof raw.robots === "object" && !Array.isArray(raw.robots)
      ? {
          index:
            typeof (raw.robots as Record<string, unknown>).index === "boolean"
              ? ((raw.robots as Record<string, unknown>).index as boolean)
              : undefined,
          follow:
            typeof (raw.robots as Record<string, unknown>).follow === "boolean"
              ? ((raw.robots as Record<string, unknown>).follow as boolean)
              : undefined,
        }
      : undefined;

  return {
    metaTitle: asTrimmedString(raw.metaTitle) ?? asTrimmedString(raw.title),
    metaDescription: asTrimmedString(raw.metaDescription) ?? asTrimmedString(raw.description),
    focusKeyword: asTrimmedString(raw.focusKeyword),
    ogTitle: asTrimmedString(raw.ogTitle),
    ogDescription: asTrimmedString(raw.ogDescription),
    ogImage: asTrimmedString(raw.ogImage),
    canonical: asTrimmedString(raw.canonical),
    robots,
    schemaType:
      raw.schemaType === "WebPage" ||
      raw.schemaType === "Product" ||
      raw.schemaType === "Car" ||
      raw.schemaType === "LocalBusiness" ||
      raw.schemaType === "BreadcrumbList"
        ? raw.schemaType
        : undefined,
    noindex: typeof raw.noindex === "boolean" ? raw.noindex : undefined,
  };
}

export function parseSiteSeoSettings(value: unknown): SiteSeoSettings {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const raw = value as Record<string, unknown>;
  const org =
    raw.organization && typeof raw.organization === "object" && !Array.isArray(raw.organization)
      ? (raw.organization as OrganizationSettings)
      : undefined;
  const orgGeo =
    org?.geo && typeof org.geo === "object" && !Array.isArray(org.geo)
      ? (org.geo as OrganizationSettings["geo"])
      : undefined;
  const orgHours =
    org?.openingHours && typeof org.openingHours === "object" && !Array.isArray(org.openingHours)
      ? (org.openingHours as OrganizationSettings["openingHours"])
      : undefined;

  return {
    siteName: asTrimmedString(raw.siteName),
    titleTemplate: asTrimmedString(raw.titleTemplate) ?? asTrimmedString(raw.title_template),
    defaultTitle: asTrimmedString(raw.defaultTitle) ?? asTrimmedString(raw.default_title),
    defaultDescription:
      asTrimmedString(raw.defaultDescription) ?? asTrimmedString(raw.default_description),
    defaultOgTitle: asTrimmedString(raw.defaultOgTitle) ?? asTrimmedString(raw.default_og_title),
    defaultOgDescription:
      asTrimmedString(raw.defaultOgDescription) ?? asTrimmedString(raw.default_og_description),
    defaultOgImage: asTrimmedString(raw.defaultOgImage) ?? asTrimmedString(raw.default_og_image),
    robots:
      raw.robots && typeof raw.robots === "object" && !Array.isArray(raw.robots)
        ? {
            index:
              typeof (raw.robots as Record<string, unknown>).index === "boolean"
                ? ((raw.robots as Record<string, unknown>).index as boolean)
                : undefined,
            follow:
              typeof (raw.robots as Record<string, unknown>).follow === "boolean"
                ? ((raw.robots as Record<string, unknown>).follow as boolean)
                : undefined,
          }
        : undefined,
    organization: org
      ? {
          ...org,
          geo: orgGeo,
          openingHours: orgHours,
          sameAs: Array.isArray(org.sameAs)
            ? org.sameAs.filter((url): url is string => typeof url === "string")
            : undefined,
        }
      : undefined,
  };
}

export function defaultSiteSeoSettings(): SiteSeoSettings {
  return {
    siteName: SITE_BRAND_NAME,
    titleTemplate: `%s | ${SITE_BRAND_NAME}`,
    defaultTitle: `${SITE_BRAND_NAME} — Đại lý VinFast chính hãng`,
    defaultDescription:
      "VinFast Ngọc Anh Cà Mau — Vinfast 3S Cà Mau. Khám phá ô tô điện, xe máy điện, phụ kiện và dịch vụ hậu mãi tại Cà Mau.",
    defaultOgTitle: `${SITE_BRAND_NAME} — Đại lý VinFast chính hãng`,
    defaultOgDescription:
      "Khám phá ô tô điện, xe máy điện VinFast với nhiều ưu đãi hấp dẫn tại Cà Mau.",
    defaultOgImage: "/images/cars/oto-hero.webp",
    robots: { index: true, follow: true },
    organization: {
      name: SCHEMA_BUSINESS_NAME,
      legalName: SCHEMA_BUSINESS_NAME,
      url: PRODUCTION_SITE_URL,
      logo: `${PRODUCTION_SITE_URL}/images/vinfast/vinfast-logo-header.webp`,
      telephone: SHOWROOM_PHONE,
      email: SHOWROOM_EMAIL,
      address: `${SHOWROOM_STREET}, ${SHOWROOM_CITY}, ${SHOWROOM_REGION}`,
      streetAddress: SHOWROOM_STREET,
      addressLocality: SHOWROOM_CITY,
      addressRegion: SHOWROOM_REGION,
      postalCode: SHOWROOM_POSTAL,
      geo: { latitude: SHOWROOM_LAT, longitude: SHOWROOM_LNG },
      openingHours: {
        opens: SHOWROOM_OPENING.opens,
        closes: SHOWROOM_OPENING.closes,
        days: [...SHOWROOM_OPENING.days],
      },
      sameAs: getShowroomSameAs(),
    },
  };
}

export function mergeSiteSeoSettings(partial?: SiteSeoSettings | null): SiteSeoSettings {
  const base = defaultSiteSeoSettings();
  if (!partial) return base;
  // Use ?? so explicit `undefined` from parsers does not wipe code defaults.
  return {
    siteName: partial.siteName ?? base.siteName,
    titleTemplate: partial.titleTemplate ?? base.titleTemplate,
    defaultTitle: partial.defaultTitle ?? base.defaultTitle,
    defaultDescription: partial.defaultDescription ?? base.defaultDescription,
    defaultOgTitle: partial.defaultOgTitle ?? base.defaultOgTitle,
    defaultOgDescription: partial.defaultOgDescription ?? base.defaultOgDescription,
    defaultOgImage: partial.defaultOgImage ?? base.defaultOgImage,
    robots: { ...base.robots, ...partial.robots },
    organization: mergeOrganization(base.organization, partial.organization),
  };
}

export function resolveSeoContent(
  seo: SeoRecord | null | undefined,
  defaults: SeoAutoFill,
  site?: SiteSeoSettings | null,
): {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  canonical: string;
  noindex: boolean;
  nofollow: boolean;
} {
  const siteSeo = mergeSiteSeoSettings(site);
  const title = seo?.metaTitle?.trim() || defaults.title?.trim() || siteSeo.defaultTitle!;
  const description =
    seo?.metaDescription?.trim() || defaults.description?.trim() || siteSeo.defaultDescription!;
  // Prefer page title/description over global OG defaults so admin page SEO is reflected in social cards.
  const ogTitle = seo?.ogTitle?.trim() || title;
  const ogDescription = seo?.ogDescription?.trim() || description;
  const ogImage = seo?.ogImage?.trim() || defaults.image?.trim() || siteSeo.defaultOgImage!;
  const canonicalPath = seo?.canonical?.trim() || defaults.path || "/";
  const canonical = canonicalPath.startsWith("http")
    ? canonicalPath
    : `${PRODUCTION_SITE_URL}${canonicalPath.startsWith("/") ? canonicalPath : `/${canonicalPath}`}`;

  const noindex = Boolean(
    seo?.noindex ?? (seo?.robots?.index !== undefined ? !seo.robots.index : false),
  );
  const nofollow = Boolean(seo?.robots?.follow !== undefined ? !seo.robots.follow : false);

  return { title, description, ogTitle, ogDescription, ogImage, canonical, noindex, nofollow };
}

export function resolveStaticPageSeo(
  page: StaticPageSeoDefinition,
  seo?: SeoRecord | null,
  site?: SiteSeoSettings | null,
) {
  return resolveSeoContent(
    seo,
    {
      title: page.defaultTitle,
      description: page.defaultDescription,
      image: page.defaultOgImage,
      path: page.path,
    },
    site,
  );
}

export function buildProductSeoDefaults(input: {
  name: string;
  tagline?: string;
  slogan?: string;
  description?: string;
  image?: string;
  path: string;
  productLabel: string;
}): SeoAutoFill {
  const tagline = input.tagline?.trim();
  const slogan = input.slogan?.trim();
  const description = input.description?.trim();
  const title = tagline ? `${input.name} — ${tagline}` : `${input.name} — ${input.productLabel}`;
  const metaDescription =
    slogan && slogan.length > 20
      ? `${slogan} — Mua ${input.name} tại ${SITE_BRAND_NAME}.`
      : description
        ? `${description} Mua chính hãng tại ${SITE_BRAND_NAME}.`
        : `Khám phá ${input.name} tại ${SITE_BRAND_NAME} — giá tốt, ưu đãi hấp dẫn, hỗ trợ trả góp.`;

  return {
    title,
    description: metaDescription,
    image: input.image,
    path: input.path,
  };
}

export function seoToNextMetadata(
  resolved: ReturnType<typeof resolveSeoContent>,
  site?: SiteSeoSettings | null,
): Metadata {
  const siteSeo = mergeSiteSeoSettings(site);
  const shareImage = resolved.ogImage.startsWith("http")
    ? resolved.ogImage
    : `${PRODUCTION_SITE_URL}${resolved.ogImage.startsWith("/") ? resolved.ogImage : `/${resolved.ogImage}`}`;

  return {
    title: resolved.title,
    description: resolved.description,
    alternates: {
      canonical: resolved.canonical.replace(PRODUCTION_SITE_URL, "") || "/",
    },
    openGraph: {
      title: resolved.ogTitle,
      description: resolved.ogDescription,
      url: resolved.canonical,
      siteName: siteSeo.siteName ?? SITE_BRAND_NAME,
      locale: "vi_VN",
      type: "website",
      images: [
        {
          url: shareImage,
          width: 1200,
          height: 630,
          alt: resolved.ogTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: resolved.ogTitle,
      description: resolved.ogDescription,
      images: [shareImage],
    },
    robots: {
      index: !resolved.noindex,
      follow: !resolved.nofollow,
      googleBot: {
        index: !resolved.noindex,
        follow: !resolved.nofollow,
        "max-image-preview": "large",
      },
    },
  };
}

export function previewNoindexMetadata(title = "Preview"): Metadata {
  return {
    title,
    robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  };
}

export function emptySeoRecord(): SeoRecord {
  return {};
}
