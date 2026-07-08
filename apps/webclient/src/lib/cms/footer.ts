import type { Json } from "@vinfast3s/supabase";

import { SHOWROOM_MAP_EMBED, RESCUE_HOTLINE } from "@/lib/dealership";

export const CMS_FOOTER_TAG = "cms-footer";

export type FooterLink = {
  label: string;
  href: string;
};

export type FooterColumn = {
  title: string;
  links: FooterLink[];
};

export type FooterSettings = {
  brandTitle: string;
  brandDescription: string;
  columns: {
    products: FooterColumn;
    services: FooterColumn;
    about: FooterColumn;
    policies: FooterColumn;
  };
  rescueHotline: string;
  mapEmbed: string;
  copyright: string;
  bottomLinks: FooterLink[];
};

const DEFAULT_PRODUCT_LINKS: FooterLink[] = [
  { label: "VF 3", href: "/oto/vf3" },
  { label: "VF 5", href: "/oto/vf5" },
  { label: "VF 6", href: "/oto/vf6" },
  { label: "VF 7", href: "/oto/vf7" },
  { label: "VF 8", href: "/oto/vf8" },
  { label: "VF 9", href: "/oto/vf9" },
  { label: "Xe máy điện", href: "/xe-may-dien" },
];

const DEFAULT_SERVICE_LINKS: FooterLink[] = [
  { label: "Đăng ký lái thử", href: "/oto" },
  { label: "Bảo dưỡng — Sửa chữa", href: "/dich-vu-hau-mai" },
  { label: "Bảo hành", href: "/dich-vu-hau-mai" },
  { label: "Pin và trạm sạc", href: "/pin-va-tram-sac" },
  { label: "Phụ kiện xe", href: "/phu-kien" },
];

const DEFAULT_ABOUT_LINKS: FooterLink[] = [
  { label: "Giới thiệu", href: "/gioi-thieu" },
  { label: "Tin tức", href: "/gioi-thieu" },
  { label: "Tuyển dụng", href: "/gioi-thieu" },
  { label: "Liên hệ", href: "/gioi-thieu" },
];

const DEFAULT_POLICY_LINKS: FooterLink[] = [
  { label: "Chính sách bảo mật", href: "/gioi-thieu" },
  { label: "Điều khoản sử dụng", href: "/gioi-thieu" },
];

const DEFAULT_BOTTOM_LINKS: FooterLink[] = [
  { label: "Chính sách bảo mật", href: "/gioi-thieu" },
  { label: "Điều khoản sử dụng", href: "/gioi-thieu" },
];

function parseFooterLink(value: unknown): FooterLink | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const row = value as Record<string, unknown>;
  const label = typeof row.label === "string" ? row.label.trim() : "";
  const href = typeof row.href === "string" ? row.href.trim() : "";
  if (!label || !href) return null;
  return { label, href };
}

function parseFooterLinks(value: unknown, fallback: FooterLink[]): FooterLink[] {
  if (!Array.isArray(value)) return fallback;
  const parsed = value.map(parseFooterLink).filter((link): link is FooterLink => link !== null);
  return parsed.length > 0 ? parsed : fallback;
}

function parseFooterColumn(
  value: unknown,
  fallbackTitle: string,
  fallbackLinks: FooterLink[],
): FooterColumn {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { title: fallbackTitle, links: fallbackLinks };
  }
  const row = value as Record<string, unknown>;
  const title =
    typeof row.title === "string" && row.title.trim() ? row.title.trim() : fallbackTitle;
  return {
    title,
    links: parseFooterLinks(row.links, fallbackLinks),
  };
}

export function defaultFooterSettings(): FooterSettings {
  return {
    brandTitle: "VINFAST NGỌC ANH CÀ MAU",
    brandDescription:
      "VinFast Ngọc Anh Cà Mau — Vinfast 3S Cà Mau. Trải nghiệm xe điện thông minh cùng dịch vụ 3S tận tâm tại Cà Mau.",
    columns: {
      products: { title: "Sản phẩm", links: DEFAULT_PRODUCT_LINKS },
      services: { title: "Dịch vụ", links: DEFAULT_SERVICE_LINKS },
      about: { title: "Về chúng tôi", links: DEFAULT_ABOUT_LINKS },
      policies: { title: "Chính sách", links: DEFAULT_POLICY_LINKS },
    },
    rescueHotline: RESCUE_HOTLINE,
    mapEmbed: SHOWROOM_MAP_EMBED,
    copyright: "© 2026 VinFast Ngọc Anh Cà Mau. All rights reserved.",
    bottomLinks: DEFAULT_BOTTOM_LINKS,
  };
}

export function parseFooterSettings(value: Json | null | undefined): Partial<FooterSettings> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const row = value as Record<string, unknown>;
  const columns = row.columns;
  const columnsObj =
    columns && typeof columns === "object" && !Array.isArray(columns)
      ? (columns as Record<string, unknown>)
      : {};

  const partial: Partial<FooterSettings> = {};

  if (typeof row.brandTitle === "string" && row.brandTitle.trim()) {
    partial.brandTitle = row.brandTitle.trim();
  }
  if (typeof row.brandDescription === "string" && row.brandDescription.trim()) {
    partial.brandDescription = row.brandDescription.trim();
  }
  if (typeof row.rescueHotline === "string" && row.rescueHotline.trim()) {
    partial.rescueHotline = row.rescueHotline.trim();
  }
  if (typeof row.mapEmbed === "string" && row.mapEmbed.trim()) {
    partial.mapEmbed = row.mapEmbed.trim();
  }
  if (typeof row.copyright === "string" && row.copyright.trim()) {
    partial.copyright = row.copyright.trim();
  }

  const parsedColumns: Partial<FooterSettings["columns"]> = {};
  if (columnsObj.products !== undefined) {
    parsedColumns.products = parseFooterColumn(
      columnsObj.products,
      "Sản phẩm",
      DEFAULT_PRODUCT_LINKS,
    );
  }
  if (columnsObj.services !== undefined) {
    parsedColumns.services = parseFooterColumn(
      columnsObj.services,
      "Dịch vụ",
      DEFAULT_SERVICE_LINKS,
    );
  }
  if (columnsObj.about !== undefined) {
    parsedColumns.about = parseFooterColumn(columnsObj.about, "Về chúng tôi", DEFAULT_ABOUT_LINKS);
  }
  if (columnsObj.policies !== undefined) {
    parsedColumns.policies = parseFooterColumn(
      columnsObj.policies,
      "Chính sách",
      DEFAULT_POLICY_LINKS,
    );
  }
  if (Object.keys(parsedColumns).length > 0) {
    partial.columns = parsedColumns as FooterSettings["columns"];
  }

  if (Array.isArray(row.bottomLinks)) {
    partial.bottomLinks = parseFooterLinks(row.bottomLinks, DEFAULT_BOTTOM_LINKS);
  }

  return partial;
}

export function mergeFooterSettings(input?: Partial<FooterSettings> | null): FooterSettings {
  const defaults = defaultFooterSettings();
  if (!input) return defaults;

  return {
    brandTitle: input.brandTitle?.trim() || defaults.brandTitle,
    brandDescription: input.brandDescription?.trim() || defaults.brandDescription,
    columns: {
      products: input.columns?.products
        ? parseFooterColumn(input.columns.products, "Sản phẩm", DEFAULT_PRODUCT_LINKS)
        : defaults.columns.products,
      services: input.columns?.services
        ? parseFooterColumn(input.columns.services, "Dịch vụ", DEFAULT_SERVICE_LINKS)
        : defaults.columns.services,
      about: input.columns?.about
        ? parseFooterColumn(input.columns.about, "Về chúng tôi", DEFAULT_ABOUT_LINKS)
        : defaults.columns.about,
      policies: input.columns?.policies
        ? parseFooterColumn(input.columns.policies, "Chính sách", DEFAULT_POLICY_LINKS)
        : defaults.columns.policies,
    },
    rescueHotline: input.rescueHotline?.trim() || defaults.rescueHotline,
    mapEmbed: input.mapEmbed?.trim() || defaults.mapEmbed,
    copyright: input.copyright?.trim() || defaults.copyright,
    bottomLinks:
      input.bottomLinks && input.bottomLinks.length > 0
        ? input.bottomLinks
            .map((link) => ({
              label: link.label.trim(),
              href: link.href.trim(),
            }))
            .filter((link) => link.label && link.href)
        : defaults.bottomLinks,
  };
}
