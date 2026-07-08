import { unstable_cache } from "next/cache";
import { createAnonClient } from "@vinfast3s/supabase/anon";
import { isSupabaseConfigured, type Json } from "@vinfast3s/supabase";

import { getOrSetCache } from "@/lib/cache";
import { getCmsCacheRevalidate, getCmsCacheTtlSeconds } from "./cache-config";
import {
  CMS_FOOTER_TAG,
  mergeFooterSettings,
  parseFooterSettings,
  type FooterSettings,
} from "./footer";

async function fetchFooterSettingsRow(): Promise<FooterSettings> {
  return getOrSetCache(`cms:settings:footer`, getCmsCacheTtlSeconds(), async () => {
    if (!isSupabaseConfigured()) return mergeFooterSettings(null);
    const supabase = createAnonClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "footer")
      .maybeSingle();
    if (error) throw new Error(error.message);
    return mergeFooterSettings(parseFooterSettings(data?.value as Json | null | undefined));
  });
}

export const getFooterSettings = unstable_cache(
  async () => fetchFooterSettingsRow(),
  ["cms-footer-settings"],
  {
    revalidate: getCmsCacheRevalidate(),
    tags: ["cms", CMS_FOOTER_TAG],
  },
);
