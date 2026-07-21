import { unstable_cache } from "next/cache";
import { createAnonClient } from "@vinfast3s/supabase/anon";
import { isSupabaseConfigured, type Json } from "@vinfast3s/supabase";

import { getOrSetCache } from "@/lib/cache";
import { getCmsCacheRevalidate, getCmsCacheTtlSeconds } from "./cache-config";
import {
  CMS_FLOATING_TAG,
  mergeFloatingSettings,
  parseFloatingSettings,
  type FloatingSettings,
} from "./floating";

export async function fetchFloatingSettingsRow(): Promise<FloatingSettings> {
  return getOrSetCache(`cms:settings:floating`, getCmsCacheTtlSeconds(), async () => {
    if (!isSupabaseConfigured()) return mergeFloatingSettings(null);
    const supabase = createAnonClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "floating")
      .maybeSingle();
    if (error) throw new Error(error.message);
    return mergeFloatingSettings(parseFloatingSettings(data?.value as Json | null | undefined));
  });
}

export const getFloatingSettings = unstable_cache(
  async () => fetchFloatingSettingsRow(),
  ["cms-floating-settings"],
  {
    revalidate: getCmsCacheRevalidate(),
    tags: ["cms", CMS_FLOATING_TAG],
  },
);
