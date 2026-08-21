import { unstable_cache } from "next/cache";
import { createAnonClient } from "@vinfast3s/supabase/anon";
import { isSupabaseConfigured, type Json } from "@vinfast3s/supabase";

import { getOrSetCache } from "@/lib/cache";
import { getCmsCacheRevalidate, getCmsCacheTtlSeconds } from "./cache-config";
import {
  CMS_LEGAL_TAG,
  mergeLegalPageContent,
  parseLegalPageContent,
  type LegalPageContent,
  type LegalPageSlug,
} from "./legal";

export async function fetchLegalPageContent(slug: LegalPageSlug): Promise<LegalPageContent> {
  return getOrSetCache(`cms:page:legal:${slug}`, getCmsCacheTtlSeconds(), async () => {
    if (!isSupabaseConfigured()) return mergeLegalPageContent(slug, null);
    const supabase = createAnonClient();
    const { data, error } = await supabase
      .from("cms_pages")
      .select("content")
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return mergeLegalPageContent(
      slug,
      parseLegalPageContent(data?.content as Json | null | undefined),
    );
  });
}

export function getLegalPageContent(slug: LegalPageSlug) {
  return unstable_cache(async () => fetchLegalPageContent(slug), [`cms-legal-${slug}`], {
    revalidate: getCmsCacheRevalidate(),
    tags: ["cms", CMS_LEGAL_TAG, `cms-page-${slug}`],
  })();
}
