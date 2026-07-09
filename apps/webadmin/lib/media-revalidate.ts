import { revalidateTag } from "next/cache";

export const ADMIN_MEDIA_CACHE_TAG = "admin-cms-media-folders";

export async function revalidateAdminMedia() {
  revalidateTag(ADMIN_MEDIA_CACHE_TAG);
}
