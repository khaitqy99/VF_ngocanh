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

async function fetchSiteSeoRow(): Promise<SiteSeoSettings> {
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

async function fetchPageSeoRow(slug: string): Promise<SeoRecord | null> {
  return getOrSetCache(`cms:page-seo:${slug}`, getCmsCacheTtlSeconds(), async () => {
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

async function fetchVehicleSeoRow(id: string): Promise<SeoRecord> {
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

async function fetchAccessorySeoRow(id: string): Promise<SeoRecord> {
  return getOrSetCache(`cms:accessory-seo:${id}`, getCmsCacheTtlSeconds(), async () => {
    if (!isSupabaseConfigured()) return {};
    const supabase = createAnonClient();
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
