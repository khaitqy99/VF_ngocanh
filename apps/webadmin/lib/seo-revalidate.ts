import { CMS_SEO_TAG } from "@/lib/cms/seo";
import { STATIC_PAGE_SEO } from "@/lib/seo/types";
import { revalidateWebclient } from "./revalidate-webclient";

export async function revalidateSeo(paths: string[] = []) {
  const staticPaths = STATIC_PAGE_SEO.map((page) => page.path);
  await revalidateWebclient({
    tags: ["cms", CMS_SEO_TAG],
    paths: ["/", ...staticPaths, ...paths],
  });
}
