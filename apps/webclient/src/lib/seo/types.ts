export type SeoRobots = {
  index?: boolean;
  follow?: boolean;
};

export type SeoSchemaType = "WebPage" | "Product" | "Car" | "LocalBusiness" | "BreadcrumbList";

export type SeoRecord = {
  metaTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonical?: string;
  robots?: SeoRobots;
  schemaType?: SeoSchemaType;
  noindex?: boolean;
};

export type OrganizationSettings = {
  name?: string;
  legalName?: string;
  url?: string;
  logo?: string;
  telephone?: string;
  email?: string;
  /** Full formatted address (display) */
  address?: string;
  streetAddress?: string;
  addressLocality?: string;
  addressRegion?: string;
  postalCode?: string;
  geo?: {
    latitude?: number;
    longitude?: number;
  };
  openingHours?: {
    opens?: string;
    closes?: string;
    days?: string[];
  };
  sameAs?: string[];
};

export type SiteSeoSettings = {
  siteName?: string;
  titleTemplate?: string;
  defaultTitle?: string;
  defaultDescription?: string;
  defaultOgTitle?: string;
  defaultOgDescription?: string;
  defaultOgImage?: string;
  robots?: SeoRobots;
  organization?: OrganizationSettings;
};

export type StaticPageSeoDefinition = {
  slug: string;
  label: string;
  path: string;
  group: "core" | "catalog" | "service";
  defaultTitle: string;
  defaultDescription: string;
  defaultOgImage?: string;
};

export const SITE_BRAND_NAME = "Vinfast 3S Cà Mau";
export const PRODUCTION_SITE_URL = "https://vinfast3scamau.com";

export const STATIC_PAGE_SEO: StaticPageSeoDefinition[] = [
  {
    slug: "home",
    label: "Trang chủ",
    path: "/",
    group: "core",
    defaultTitle: "Vinfast 3S Cà Mau — Đại lý VinFast chính hãng",
    defaultDescription:
      "VinFast Ngọc Anh Cà Mau — Vinfast 3S Cà Mau. Khám phá ô tô điện, xe máy điện VinFast với ưu đãi hấp dẫn, hỗ trợ trả góp và dịch vụ hậu mãi tại Cà Mau.",
    defaultOgImage: "/images/cars/oto-hero.webp",
  },
  {
    slug: "about",
    label: "Giới thiệu",
    path: "/gioi-thieu",
    group: "core",
    defaultTitle: "Giới thiệu Vinfast 3S Cà Mau",
    defaultDescription:
      "VinFast Ngọc Anh Cà Mau — Vinfast 3S Cà Mau. Tìm hiểu đại lý ủy quyền VinFast tại Cà Mau — sứ mệnh, tầm nhìn và dịch vụ 3S chuyên nghiệp.",
    defaultOgImage: "/images/showroom.webp",
  },
  {
    slug: "cars",
    label: "Ô tô điện",
    path: "/oto",
    group: "catalog",
    defaultTitle: "Ô tô điện VinFast chính hãng",
    defaultDescription:
      "Khám phá dòng ô tô điện VinFast tại Vinfast 3S Cà Mau — VF 3, VF 5, VF 6, VF 7, VF 8, VF 9. Giá tốt, ưu đãi ngập tràn.",
    defaultOgImage: "/images/cars/oto-hero.webp",
  },
  {
    slug: "scooters",
    label: "Xe máy điện",
    path: "/xe-may-dien",
    group: "catalog",
    defaultTitle: "Xe máy điện VinFast chính hãng",
    defaultDescription:
      "Mua xe máy điện VinFast tại Cà Mau — Klara, Evo, Feliz và nhiều mẫu hot. Trả góp 0%, bảo hành chính hãng.",
    defaultOgImage: "/images/scooters/xe-may-hero.webp",
  },
  {
    slug: "accessories",
    label: "Phụ kiện",
    path: "/phu-kien",
    group: "catalog",
    defaultTitle: "Phụ kiện VinFast chính hãng",
    defaultDescription:
      "Phụ kiện VinFast chính hãng — nội thất, sạc pin, an toàn, quà tặng. Mua tại Vinfast 3S Cà Mau.",
    defaultOgImage: "/images/accessories/phu-kien-hero.webp",
  },
  {
    slug: "after-sales",
    label: "Dịch vụ hậu mãi",
    path: "/dich-vu-hau-mai",
    group: "service",
    defaultTitle: "Dịch vụ hậu mãi VinFast",
    defaultDescription:
      "Dịch vụ bảo dưỡng, sửa chữa và chăm sóc xe VinFast tại Vinfast 3S Cà Mau — đội ngũ kỹ thuật chính hãng.",
    defaultOgImage: "/images/after-sales/hero.webp",
  },
  {
    slug: "charging",
    label: "Pin & Trạm sạc",
    path: "/pin-va-tram-sac",
    group: "service",
    defaultTitle: "Pin & Trạm sạc VinFast",
    defaultDescription:
      "Giải pháp pin và trạm sạc VinFast — thuê pin, mua pin, mạng lưới sạc toàn quốc. Tư vấn tại Vinfast 3S Cà Mau.",
    defaultOgImage: "/images/charging/hero.webp",
  },
  {
    slug: "energy",
    label: "Lưu trữ năng lượng",
    path: "/luu-tru-nang-luong",
    group: "service",
    defaultTitle: "Lưu trữ năng lượng VinFast",
    defaultDescription:
      "Giải pháp lưu trữ năng lượng VinFast cho gia đình và doanh nghiệp tại Cà Mau.",
    defaultOgImage: "/images/energy/hero.webp",
  },
];

export function getStaticPageSeoDefinition(slug: string): StaticPageSeoDefinition | undefined {
  return STATIC_PAGE_SEO.find((page) => page.slug === slug);
}

export function getStaticPageByPath(path: string): StaticPageSeoDefinition | undefined {
  const normalized = path === "" ? "/" : path;
  return STATIC_PAGE_SEO.find((page) => page.path === normalized);
}
