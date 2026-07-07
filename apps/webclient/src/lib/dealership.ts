/**
 * Single source of truth for NAP (Name, Address, Phone) and local geo SEO.
 * Schema, footer, map embed, and CMS defaults all derive from here.
 */

export const DEALERSHIP_NAME = "VinFast Ngọc Anh Cà Mau";
export const SITE_DISPLAY_NAME = "Vinfast 3S Cà Mau";
/** Canonical business name for JSON-LD — must match Google Business Profile */
export const SCHEMA_BUSINESS_NAME = "VinFast Ngọc Anh Cà Mau — Vinfast 3S Cà Mau";

export const SHOWROOM_STREET = "Số 111 Lý Thường Kiệt";
export const SHOWROOM_WARD = "Phường Tân Thành";
export const SHOWROOM_CITY = "Thành phố Cà Mau";
export const SHOWROOM_REGION = "Cà Mau";
export const SHOWROOM_POSTAL = "180000";
export const SHOWROOM_COUNTRY = "VN";

export const SHOWROOM_ADDRESS = `${SHOWROOM_STREET}, ${SHOWROOM_WARD}, ${SHOWROOM_CITY}, ${SHOWROOM_REGION}`;

export const SHOWROOM_PHONE = "0707 53 6666";
export const SHOWROOM_PHONE_TEL = "tel:0707536666";
export const SHOWROOM_EMAIL = "gdkdauto.vfcm@ngocanhcm.vn";

export const RESCUE_HOTLINE = "0707 54 6666";
export const RESCUE_HOTLINE_TEL = "tel:0707546666";

/** GPS for 111 Lý Thường Kiệt, Phường Tân Thành — align with Google Maps pin */
export const SHOWROOM_LAT = 9.176413;
export const SHOWROOM_LNG = 105.152389;

export const SHOWROOM_OPENING = {
  opens: "08:00",
  closes: "18:00",
  days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const,
};

const SHOWROOM_MAP_SEARCH = `${SHOWROOM_ADDRESS}, Việt Nam`;

export const SHOWROOM_MAP_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SHOWROOM_MAP_SEARCH)}`;

export const SHOWROOM_MAP_EMBED = `https://www.google.com/maps?q=${encodeURIComponent(SHOWROOM_MAP_SEARCH)}&hl=vi&z=17&output=embed`;

/** Social / GBP links — add URLs via env when available */
export function getShowroomSameAs(): string[] {
  const links = [
    SHOWROOM_MAP_URL,
    process.env.NEXT_PUBLIC_FACEBOOK_URL,
    process.env.NEXT_PUBLIC_ZALO_URL,
    process.env.NEXT_PUBLIC_GOOGLE_BUSINESS_URL,
  ].filter((url): url is string => Boolean(url?.trim()));
  return [...new Set(links)];
}

export const HOTLINE = RESCUE_HOTLINE;
export const HOTLINE_TEL = RESCUE_HOTLINE_TEL;

/** Label dùng trong form đặt lịch / lead — phải khớp địa lý Cà Mau */
export const SHOWROOM_BOOKING_LABEL = `${DEALERSHIP_NAME} — Showroom Cà Mau`;

export type DealershipContact = {
  businessName: string;
  address: string;
  phone: string;
  phoneTel: string;
  email: string;
  mapUrl: string;
  mapEmbed: string;
  opening: { opens: string; closes: string };
  socialLinks: { label: string; href: string; kind: "facebook" | "youtube" | "zalo" | "other" }[];
};

function formatOrganizationAddress(org: {
  streetAddress?: string;
  addressLocality?: string;
  addressRegion?: string;
  address?: string;
}): string {
  if (org.address?.trim()) return org.address.trim();
  const parts = [org.streetAddress, org.addressLocality, org.addressRegion].filter(Boolean);
  return parts.length ? parts.join(", ") : SHOWROOM_ADDRESS;
}

function classifySocialUrl(url: string): DealershipContact["socialLinks"][number]["kind"] {
  const lower = url.toLowerCase();
  if (lower.includes("facebook.com") || lower.includes("fb.com")) return "facebook";
  if (lower.includes("youtube.com") || lower.includes("youtu.be")) return "youtube";
  if (lower.includes("zalo.me") || lower.includes("zalo.vn")) return "zalo";
  return "other";
}

/** Merge CMS organization settings with code defaults for visible NAP + social links */
export function resolveDealershipContact(
  site?: import("@/lib/seo/types").SiteSeoSettings | null,
): DealershipContact {
  const org = site?.organization;
  const phone = org?.telephone?.trim() || SHOWROOM_PHONE;
  const email = org?.email?.trim() || SHOWROOM_EMAIL;
  const address = org ? formatOrganizationAddress(org) : SHOWROOM_ADDRESS;
  const sameAs = org?.sameAs?.length ? org.sameAs : getShowroomSameAs();

  return {
    businessName: org?.name?.trim() || SCHEMA_BUSINESS_NAME,
    address,
    phone,
    phoneTel: `tel:${phone.replace(/\s/g, "")}`,
    email,
    mapUrl: SHOWROOM_MAP_URL,
    mapEmbed: SHOWROOM_MAP_EMBED,
    opening: {
      opens: org?.openingHours?.opens ?? SHOWROOM_OPENING.opens,
      closes: org?.openingHours?.closes ?? SHOWROOM_OPENING.closes,
    },
    socialLinks: sameAs
      .filter((url) => !url.includes("google.com/maps"))
      .map((href) => ({
        href,
        kind: classifySocialUrl(href),
        label:
          classifySocialUrl(href) === "facebook"
            ? "Facebook"
            : classifySocialUrl(href) === "youtube"
              ? "Youtube"
              : classifySocialUrl(href) === "zalo"
                ? "Zalo"
                : "Website",
      })),
  };
}
