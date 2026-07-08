/** URL admin CMS — fallback production nếu env chưa khai báo trên webclient Vercel. */
export function getAdminAppUrl(): string {
  const configured = process.env.NEXT_PUBLIC_ADMIN_URL?.replace(/\/$/, "");
  if (configured) return configured;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  if (siteUrl.includes("vinfast3scamau.com")) {
    return "https://cms.vinfast3scamau.com";
  }

  return "";
}

/** Bật sửa preview chỉ khi iframe được mở từ admin CMS. */
export function canEnablePreviewEdit(options: { referer?: string | null }): boolean {
  const adminBase = getAdminAppUrl();
  const referer = options.referer ?? "";
  if (adminBase && referer.startsWith(adminBase)) {
    return true;
  }

  return false;
}

export type PreviewEditScope =
  "oto" | "xe-may-dien" | "phu-kien" | "home" | "about" | "after-sales" | "charging" | "energy";

export function previewScopeFromRequestPath(pathname: string): PreviewEditScope | null {
  const path = pathname.split("?")[0];
  if (path === "/preview") return "home";
  if (path === "/gioi-thieu/preview" || path.startsWith("/gioi-thieu/")) return "about";
  if (path === "/dich-vu-hau-mai/preview" || path.startsWith("/dich-vu-hau-mai/"))
    return "after-sales";
  if (path === "/pin-va-tram-sac/preview" || path.startsWith("/pin-va-tram-sac/"))
    return "charging";
  if (path === "/luu-tru-nang-luong/preview" || path.startsWith("/luu-tru-nang-luong/"))
    return "energy";
  if (path === "/oto/preview" || path.startsWith("/oto/")) return "oto";
  if (path === "/xe-may-dien/preview" || path.startsWith("/xe-may-dien/")) return "xe-may-dien";
  if (path === "/phu-kien/preview" || path.startsWith("/phu-kien/")) return "phu-kien";
  return null;
}
