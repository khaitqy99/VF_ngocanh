import { unstable_cache } from "next/cache";
import { createAnonClient } from "@vinfast3s/supabase/anon";
import { isSupabaseConfigured, type Json } from "@vinfast3s/supabase";

import { getOrSetCache } from "@/lib/cache";
import {
  defaultSiteSeoSettings,
  mergeSiteSeoSettings,
  parseSeoRecord,
  parseSiteSeoSettings,
  type SeoRecord,
  type SiteSeoSettings,
} from "@/lib/seo";

import { getCmsCacheRevalidate, getCmsCacheTtlSeconds } from "./cache-config";
import { vehicleTag } from "./cache-tags";

export const CMS_SEO_TAG = "cms-seo";

export async function fetchSiteSeoRow(): Promise<SiteSeoSettings> {
  return getOrSetCache(`cms:settings:seo`, getCmsCacheTtlSeconds(), async () => {
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
  });
}

export async function fetchPageSeoRow(slug: string): Promise<SeoRecord | null> {
  return getOrSetCache(`cms:page-seo:${slug}`, getCmsCacheTtlSeconds(), async () => {
    if (!isSupabaseConfigured()) return null;
    const supabase = createAnonClient();
    const { data: published, error: publishedError } = await supabase
      .from("cms_pages")
      .select("seo")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();
    if (publishedError) throw new Error(publishedError.message);
    if (published?.seo) return parseSeoRecord(published.seo as Json);

    // Fallback: any row with SEO for this slug (draft/archived) so admin saves are not silently dropped.
    const { data: anyRow, error: anyError } = await supabase
      .from("cms_pages")
      .select("seo")
      .eq("slug", slug)
      .maybeSingle();
    if (anyError) throw new Error(anyError.message);
    if (!anyRow?.seo) return null;
    return parseSeoRecord(anyRow.seo as Json);
  });
}

export const getSiteSeo = unstable_cache(async () => fetchSiteSeoRow(), ["cms-site-seo"], {
  revalidate: getCmsCacheRevalidate(),
  tags: ["cms", CMS_SEO_TAG],
});

export async function getPageSeo(slug: string): Promise<SeoRecord | null> {
  return unstable_cache(async () => fetchPageSeoRow(slug), [`cms-page-seo-${slug}`], {
    revalidate: getCmsCacheRevalidate(),
    tags: ["cms", CMS_SEO_TAG, `cms-page-seo-${slug}`],
  })();
}

export async function fetchVehicleSeoRow(id: string): Promise<SeoRecord> {
  return getOrSetCache(`cms:vehicle-seo:${id}`, getCmsCacheTtlSeconds(), async () => {
    if (!isSupabaseConfigured()) return {};
    const supabase = createAnonClient();
    const { data, error } = await supabase
      .from("vehicles")
      .select("seo")
      .eq("id", id)
      .eq("status", "published")
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data?.seo) return {};
    return parseRowSeoColumn(data.seo as Json);
  });
}

export async function getVehicleSeoById(id: string): Promise<SeoRecord> {
  return unstable_cache(async () => fetchVehicleSeoRow(id), [`cms-vehicle-seo-${id}`], {
    revalidate: getCmsCacheRevalidate(),
    tags: ["cms", CMS_SEO_TAG, vehicleTag(id)],
  })();
}

export async function fetchAccessorySeoRow(id: string): Promise<SeoRecord> {
  return getOrSetCache(`cms:accessory-seo:${id}`, getCmsCacheTtlSeconds(), async () => {
    if (!isSupabaseConfigured()) return {};
    const supabase = createAnonClient();
    // SEO lives in accessories.content.seo (JSON), not a dedicated seo column.
    const { data, error } = await supabase
      .from("accessories")
      .select("content")
      .eq("id", id)
      .eq("status", "published")
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data?.content || typeof data.content !== "object" || Array.isArray(data.content)) {
      return {};
    }
    return parseSeoRecord((data.content as Record<string, unknown>).seo);
  });
}

export async function getAccessorySeoById(id: string): Promise<SeoRecord> {
  return unstable_cache(async () => fetchAccessorySeoRow(id), [`cms-accessory-seo-${id}`], {
    revalidate: getCmsCacheRevalidate(),
    tags: ["cms", CMS_SEO_TAG, "cms-accessories", `accessory-${id}`],
  })();
}

export function parseVehicleSeo(content: Json | null | undefined): SeoRecord {
  if (!content || typeof content !== "object" || Array.isArray(content)) return {};
  const seo = (content as Record<string, unknown>).seo;
  return parseSeoRecord(seo);
}

export function parseRowSeoColumn(seo: Json | null | undefined): SeoRecord {
  return parseSeoRecord(seo);
}

/** True when SEO explicitly disables indexing. */
export function seoRecordIsNoindex(seo: SeoRecord | null | undefined): boolean {
  if (!seo) return false;
  if (seo.noindex === true) return true;
  if (seo.robots?.index === false) return true;
  return false;
}

/** Batch-load published vehicle SEO by id (sitemap images + noindex). */
export async function fetchVehicleSeoByIdMap(): Promise<Map<string, SeoRecord>> {
  const rows = await getOrSetCache(
    `cms:vehicle-seo-map`,
    getCmsCacheTtlSeconds(),
    async (): Promise<{ id: string; seo: SeoRecord }[]> => {
      if (!isSupabaseConfigured()) return [];
      const supabase = createAnonClient();
      const { data, error } = await supabase
        .from("vehicles")
        .select("id, seo")
        .eq("status", "published");
      if (error) throw new Error(error.message);
      return (data ?? []).map((row) => ({
        id: row.id,
        seo: parseRowSeoColumn(row.seo as Json),
      }));
    },
  );
  return new Map(rows.map((row) => [row.id, row.seo]));
}

/** Batch-load vehicle ids whose SEO is noindex (for sitemap filtering). */
export async function fetchVehicleNoindexIds(): Promise<Set<string>> {
  const map = await fetchVehicleSeoByIdMap();
  const ids = new Set<string>();
  for (const [id, seo] of map) {
    if (seoRecordIsNoindex(seo)) ids.add(id);
  }
  return ids;
}

/** Batch-load published accessory SEO by id (content.seo). */
export async function fetchAccessorySeoByIdMap(): Promise<Map<string, SeoRecord>> {
  const rows = await getOrSetCache(
    `cms:accessory-seo-map`,
    getCmsCacheTtlSeconds(),
    async (): Promise<{ id: string; seo: SeoRecord }[]> => {
      if (!isSupabaseConfigured()) return [];
      const supabase = createAnonClient();
      const { data, error } = await supabase
        .from("accessories")
        .select("id, content")
        .eq("status", "published");
      if (error) throw new Error(error.message);
      const list: { id: string; seo: SeoRecord }[] = [];
      for (const row of data ?? []) {
        if (!row.content || typeof row.content !== "object" || Array.isArray(row.content)) continue;
        list.push({
          id: row.id,
          seo: parseSeoRecord((row.content as Record<string, unknown>).seo),
        });
      }
      return list;
    },
  );
  return new Map(rows.map((row) => [row.id, row.seo]));
}

/** Batch-load accessory ids whose content.seo is noindex. */
export async function fetchAccessoryNoindexIds(): Promise<Set<string>> {
  const map = await fetchAccessorySeoByIdMap();
  const ids = new Set<string>();
  for (const [id, seo] of map) {
    if (seoRecordIsNoindex(seo)) ids.add(id);
  }
  return ids;
}
