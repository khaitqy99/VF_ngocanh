export type SeoRobots = {
  index?: boolean;
  follow?: boolean;
};

export type SeoSchemaType =
  | "WebPage"
  | "Product"
  | "Car"
  | "Motorcycle"
  | "NewsArticle"
  | "Service"
  | "FAQPage"
  | "LocalBusiness"
  | "BreadcrumbList";

export const SEO_SCHEMA_TYPE_OPTIONS: { value: SeoSchemaType; label: string }[] = [
  { value: "WebPage", label: "WebPage" },
  { value: "Product", label: "Product" },
  { value: "Car", label: "Car (ô tô)" },
  { value: "Motorcycle", label: "Motorcycle (xe máy)" },
  { value: "NewsArticle", label: "NewsArticle" },
  { value: "Service", label: "Service" },
  { value: "FAQPage", label: "FAQPage" },
  { value: "LocalBusiness", label: "LocalBusiness" },
  { value: "BreadcrumbList", label: "BreadcrumbList" },
];

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
  googleSiteVerification?: string;
  keywords?: string[];
  robotsDisallow?: string[];
  robots?: SeoRobots;
  organization?: OrganizationSettings;
};

export type StaticPageSeoDefinition = {
  slug: string;
  label: string;
  path: string;
  group: "core" | "catalog" | "service" | "legal";
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
    defaultTitle: "Xe máy điện VinFast chính hãng tại Cà Mau",
    defaultDescription:
      "Mua xe máy điện VinFast tại Cà Mau — Evo, Feliz, Klara, Flazz và nhiều mẫu hot. Trả góp 0%, bảo hành chính hãng, giao xe nhanh tại Vinfast 3S Cà Mau.",
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
    defaultTitle: "Dịch vụ hậu mãi VinFast Cà Mau",
    defaultDescription:
      "Bảo dưỡng, sửa chữa và chăm sóc xe VinFast tại Vinfast 3S Cà Mau — đội ngũ kỹ thuật chính hãng, phụ tùng zin, cứu hộ 24/7 và chính sách bảo hành minh bạch.",
    defaultOgImage: "/images/after-sales/hero.webp",
  },
  {
    slug: "charging",
    label: "Pin & Trạm sạc",
    path: "/pin-va-tram-sac",
    group: "service",
    defaultTitle: "Pin & Trạm sạc VinFast Cà Mau",
    defaultDescription:
      "Giải pháp pin và trạm sạc VinFast tại Cà Mau — thuê pin, mua pin, mạng lưới sạc toàn quốc. Tư vấn chi phí, chính sách và lắp đặt trạm sạc tại nhà.",
    defaultOgImage: "/images/charging/hero.webp",
  },
  {
    slug: "energy",
    label: "Lưu trữ năng lượng",
    path: "/luu-tru-nang-luong",
    group: "service",
    defaultTitle: "Lưu trữ năng lượng VinFast Cà Mau",
    defaultDescription:
      "Giải pháp pin lưu trữ năng lượng VinFast cho gia đình và doanh nghiệp tại Cà Mau — tiết kiệm điện, an toàn, tư vấn lắp đặt và bảo hành chính hãng.",
    defaultOgImage: "/images/energy/hero.webp",
  },
  {
    slug: "news",
    label: "Tin tức",
    path: "/tin-tuc",
    group: "core",
    defaultTitle: "Tin tức VinFast Ngọc Anh Cà Mau",
    defaultDescription:
      "Cập nhật ưu đãi, sự kiện lái thử, công nghệ xe điện và hoạt động của đại lý VinFast Ngọc Anh Cà Mau.",
    defaultOgImage: "/images/showroom.webp",
  },
  {
    slug: "privacy",
    label: "Chính sách bảo mật",
    path: "/chinh-sach-bao-mat",
    group: "legal",
    defaultTitle: "Chính sách bảo mật",
    defaultDescription:
      "Chính sách bảo mật thông tin khách hàng của VinFast Ngọc Anh Cà Mau — cách chúng tôi thu thập, sử dụng và bảo vệ dữ liệu cá nhân khi bạn sử dụng website vinfast3scamau.com.",
    defaultOgImage: "/images/showroom.webp",
  },
  {
    slug: "terms",
    label: "Điều khoản sử dụng",
    path: "/dieu-khoan-su-dung",
    group: "legal",
    defaultTitle: "Điều khoản sử dụng",
    defaultDescription:
      "Điều khoản sử dụng website vinfast3scamau.com của VinFast Ngọc Anh Cà Mau — quy định về nội dung, giá bán tham khảo, sở hữu trí tuệ và trách nhiệm của người dùng.",
    defaultOgImage: "/images/showroom.webp",
  },
];

export function getStaticPageSeoDefinition(slug: string): StaticPageSeoDefinition | undefined {
  return STATIC_PAGE_SEO.find((page) => page.slug === slug);
}

export function getStaticPageByPath(path: string): StaticPageSeoDefinition | undefined {
  const normalized = path === "" ? "/" : path;
  return STATIC_PAGE_SEO.find((page) => page.path === normalized);
}
