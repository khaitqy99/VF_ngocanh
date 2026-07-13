import type { Metadata } from "next";

import { previewNoindexMetadata } from "@/lib/seo";

// Luôn render mới để admin thấy footer ngay sau khi lưu
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return previewNoindexMetadata("Preview — Footer");
}

/**
 * Trang rỗng — footer thật render từ root layout (SiteFooter).
 * Header tự ẩn vì path kết thúc bằng /preview (isPreviewPath).
 */
export default function FooterPreviewRoute() {
  return null;
}
