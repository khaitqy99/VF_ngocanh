import { unstable_cache } from "next/cache";
import { createAnonClient } from "@vinfast3s/supabase/anon";
import { isSupabaseConfigured, type Json } from "@vinfast3s/supabase";

import { getOrSetCache } from "@/lib/cache";
import { getCmsCacheRevalidate, getCmsCacheTtlSeconds } from "./cache-config";
import {
  CMS_SCOOTER_PRICING_TAG,
  mergeScooterPricingSettings,
  parseScooterPricingSettings,
  type ScooterPricingSettings,
} from "./scooter-pricing";

export async function fetchScooterPricingRow(): Promise<ScooterPricingSettings> {
  return getOrSetCache(`cms:settings:scooter-pricing`, getCmsCacheTtlSeconds(), async () => {
    if (!isSupabaseConfigured()) return mergeScooterPricingSettings(null);
    const supabase = createAnonClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "scooter_pricing")
      .maybeSingle();
    if (error) throw new Error(error.message);
    return mergeScooterPricingSettings(
      parseScooterPricingSettings(data?.value as Json | null | undefined),
    );
  });
}

export const getScooterPricingSettings = unstable_cache(
  async () => fetchScooterPricingRow(),
  ["cms-scooter-pricing-settings"],
  {
    revalidate: getCmsCacheRevalidate(),
    tags: ["cms", CMS_SCOOTER_PRICING_TAG],
  },
);
