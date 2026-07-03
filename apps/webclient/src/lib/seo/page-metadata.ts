import type { Metadata } from "next";

import { getStaticPageSeoDefinition, resolveStaticPageSeo, seoToNextMetadata } from "@/lib/seo";
import { getPageSeo, getSiteSeo } from "@/lib/cms/seo";

export async function buildStaticPageMetadata(pageSlug: string): Promise<Metadata> {
  const definition = getStaticPageSeoDefinition(pageSlug);
  if (!definition) return {};

  const [site, seo] = await Promise.all([getSiteSeo(), getPageSeo(pageSlug)]);
  const resolved = resolveStaticPageSeo(definition, seo, site);
  return seoToNextMetadata(resolved, site);
}
