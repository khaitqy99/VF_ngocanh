import { headers } from "next/headers";
import { verifyPreviewEditToken } from "@vinfast3s/supabase/preview-token";
import { getAdminAppUrl } from "@/lib/preview-edit-token";

/** Bật sửa preview khi có token hợp lệ từ admin CMS (prod). Dev không có secret vẫn dùng Referer. */
export function canEnablePreviewEdit(options: {
  referer?: string | null;
  token?: string | null;
}): boolean {
  if (verifyPreviewEditToken(options.token)) {
    return true;
  }

  const secretConfigured = Boolean(process.env.REVALIDATION_SECRET?.trim());
  if (secretConfigured) {
    return false;
  }

  const adminBase = getAdminAppUrl();
  const referer = options.referer ?? "";
  return Boolean(adminBase && referer.startsWith(adminBase));
}

export async function resolvePreviewEditAccess(options?: { pt?: string }): Promise<boolean> {
  const referer = (await headers()).get("referer");
  return canEnablePreviewEdit({ referer, token: options?.pt });
}
