/** Bật sửa preview chỉ khi iframe được mở từ admin CMS. */
export function canEnablePreviewEdit(options: { referer?: string | null }): boolean {
  const adminBase = process.env.NEXT_PUBLIC_ADMIN_URL?.replace(/\/$/, "");
  const referer = options.referer ?? "";
  if (adminBase && referer.startsWith(adminBase)) {
    return true;
  }

  return false;
}

export type PreviewEditScope = "oto" | "xe-may-dien" | "phu-kien";

export function previewScopeFromRequestPath(pathname: string): PreviewEditScope | null {
  const path = pathname.split("?")[0];
  if (path === "/oto/preview" || path.startsWith("/oto/")) return "oto";
  if (path === "/xe-may-dien/preview" || path.startsWith("/xe-may-dien/")) return "xe-may-dien";
  if (path === "/phu-kien/preview" || path.startsWith("/phu-kien/")) return "phu-kien";
  return null;
}
