import { CMS_LEGAL_TAG } from "@/lib/cms/legal";
import { LEGAL_PAGE_META, type LegalPageSlug } from "@/lib/cms/legal";
import { revalidateWebclient } from "./revalidate-webclient";

export async function revalidateLegalPage(slug: LegalPageSlug): Promise<boolean> {
  const meta = LEGAL_PAGE_META[slug];
  return revalidateWebclient({
    tags: ["cms", CMS_LEGAL_TAG, `cms-page-${slug}`, "cms-seo"],
    paths: [meta.path],
  });
}
