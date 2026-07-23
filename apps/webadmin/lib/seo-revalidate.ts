import { CMS_SEO_TAG } from "@/lib/cms/seo";
import { STATIC_PAGE_SEO } from "@/lib/seo/types";
import { PUBLIC_HUB_PATHS, revalidateWebclient } from "./revalidate-webclient";

export async function revalidateSeo(paths: string[] = []): Promise<boolean> {
  const staticPaths = STATIC_PAGE_SEO.map((page) => page.path);
  return revalidateWebclient({
    tags: ["cms", CMS_SEO_TAG, "cms-footer"],
    paths: [...PUBLIC_HUB_PATHS, ...staticPaths, ...paths, "/sitemap.xml", "/sitemap-images.xml"],
  });
}
