import { unstable_cache } from "next/cache";
import { createAnonClient } from "@vinfast3s/supabase/anon";
import { isSupabaseConfigured, type Json } from "@vinfast3s/supabase";

import { getOrSetCache } from "@/lib/cache";
import { getCmsCacheRevalidate, getCmsCacheTtlSeconds } from "./cache-config";
import {
  CMS_CAR_PRICING_TAG,
  mergeCarPricingSettings,
  parseCarPricingSettings,
  type CarPricingSettings,
} from "./car-pricing";

async function fetchCarPricingRow(): Promise<CarPricingSettings> {
  return getOrSetCache(`cms:settings:car-pricing`, getCmsCacheTtlSeconds(), async () => {
    if (!isSupabaseConfigured()) return mergeCarPricingSettings(null);
    const supabase = createAnonClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "car_pricing")
      .maybeSingle();
    if (error) throw new Error(error.message);
    return mergeCarPricingSettings(parseCarPricingSettings(data?.value as Json | null | undefined));
  });
}

export const getCarPricingSettings = unstable_cache(
  async () => fetchCarPricingRow(),
  ["cms-car-pricing-settings"],
  {
    revalidate: getCmsCacheRevalidate(),
    tags: ["cms", CMS_CAR_PRICING_TAG],
  },
);
