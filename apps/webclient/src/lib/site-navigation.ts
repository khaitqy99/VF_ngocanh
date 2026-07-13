export type SiteNavItem = {
  label: string;
  href: string;
};

/** Primary header navigation — keep in sync with Header.tsx */
export const MAIN_SITE_NAV: readonly SiteNavItem[] = [
  { label: "Giới thiệu", href: "/gioi-thieu" },
  { label: "Ô tô", href: "/oto" },
  { label: "Xe máy điện", href: "/xe-may-dien" },
  { label: "Phụ kiện xe", href: "/phu-kien" },
  { label: "Dịch vụ hậu mãi", href: "/dich-vu-hau-mai" },
  { label: "Pin và trạm sạc", href: "/pin-va-tram-sac" },
  { label: "Lưu trữ năng lượng", href: "/luu-tru-nang-luong" },
  { label: "Tin tức", href: "/tin-tuc" },
] as const;

/** High-intent pages often shown as sitelinks for automotive brands */
export const FEATURED_SITE_NAV: readonly SiteNavItem[] = [
  { label: "VF 3", href: "/oto/vf3" },
  { label: "VF 5", href: "/oto/vf5" },
  { label: "VF 8", href: "/oto/vf8" },
  { label: "Ô tô điện", href: "/oto" },
  { label: "Xe máy điện", href: "/xe-may-dien" },
  { label: "Phụ kiện xe", href: "/phu-kien" },
] as const;
