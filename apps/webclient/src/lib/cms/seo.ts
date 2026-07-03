import { unstable_cache } from "next/cache";
import { createAnonClient } from "@vinfast3s/supabase/anon";
import { isSupabaseConfigured, type Json } from "@vinfast3s/supabase";

import {
  defaultSiteSeoSettings,
  mergeSiteSeoSettings,
  parseSeoRecord,
  parseSiteSeoSettings,
  type SeoRecord,
  type SiteSeoSettings,
} from "@/lib/seo";

export const CMS_SEO_TAG = "cms-seo";

async function fetchSiteSeoRow(): Promise<SiteSeoSettings> {
  if (!isSupabaseConfigured()) return defaultSiteSeoSettings();
  const supabase = createAnonClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "seo")
    .maybeSingle();
  if (error) throw new Error(error.message);
  const value = data?.value;
  return mergeSiteSeoSettings(parseSiteSeoSettings(value));
}

async function fetchPageSeoRow(slug: string): Promise<SeoRecord | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = createAnonClient();
  const { data, error } = await supabase
    .from("cms_pages")
    .select("seo")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data?.seo) return null;
  return parseSeoRecord(data.seo as Json);
}

export const getSiteSeo = unstable_cache(
  async () => fetchSiteSeoRow(),
  ["cms-site-seo"],
  { revalidate: 120, tags: ["cms", CMS_SEO_TAG] },
);

export async function getPageSeo(slug: string): Promise<SeoRecord | null> {
  return unstable_cache(
    async () => fetchPageSeoRow(slug),
    [`cms-page-seo-${slug}`],
    { revalidate: 120, tags: ["cms", CMS_SEO_TAG, `cms-page-seo-${slug}`] },
  )();
}

export function parseVehicleSeo(content: Json | null | undefined): SeoRecord {
  if (!content || typeof content !== "object" || Array.isArray(content)) return {};
  const seo = (content as Record<string, unknown>).seo;
  return parseSeoRecord(seo);
}

export function parseRowSeoColumn(seo: Json | null | undefined): SeoRecord {
  return parseSeoRecord(seo);
}
