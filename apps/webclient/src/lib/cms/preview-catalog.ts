import { createAdminClient } from "@vinfast3s/supabase/admin";
import { isSupabaseConfigured } from "@vinfast3s/supabase";
import type { CarModel } from "@/lib/cars";
import type { ScooterModel } from "@/lib/scooters";
import type { AccessoryProduct } from "@/lib/accessories";
import type { CarDetail } from "@/lib/car-details";
import type { ScooterDetail } from "@/lib/scooter-details";
import { resolveProductSlug } from "@/lib/seo/slugs";
import {
  mapAccessoryRow,
  mapVehicleToCar,
  mapVehicleToCarDetail,
  mapVehicleToScooter,
  mapVehicleToScooterDetail,
} from "./mappers";
import {
  getAccessories,
  getAccessoryBySlugOrId,
  getCarDetailBySlug,
  getCars,
  getScooterDetailBySlug,
  getScooters,
} from "./index";

function matchesSlug(row: { id: string; slug: string }, slug: string): boolean {
  return row.slug === slug || row.id === slug;
}

export async function getCarsForAdminPreview(includeDraft: boolean): Promise<CarModel[]> {
  if (!includeDraft || !isSupabaseConfigured()) return getCars();

  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("vehicles")
      .select("*")
      .eq("type", "car")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []).map(mapVehicleToCar);
  } catch (error) {
    console.error("[preview-catalog/cars] fetch failed:", error);
    return [];
  }
}

export async function getScootersForAdminPreview(includeDraft: boolean): Promise<ScooterModel[]> {
  if (!includeDraft || !isSupabaseConfigured()) return getScooters();

  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("vehicles")
      .select("*")
      .eq("type", "scooter")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []).map(mapVehicleToScooter);
  } catch (error) {
    console.error("[preview-catalog/scooters] fetch failed:", error);
    return [];
  }
}

export async function getAccessoriesForAdminPreview(
  includeDraft: boolean,
): Promise<AccessoryProduct[]> {
  if (!includeDraft || !isSupabaseConfigured()) return getAccessories();

  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("accessories")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []).map(mapAccessoryRow);
  } catch (error) {
    console.error("[preview-catalog/accessories] fetch failed:", error);
    return [];
  }
}

export async function getCarDetailBySlugForAdminPreview(
  slug: string,
  includeDraft: boolean,
): Promise<CarDetail | undefined> {
  if (!includeDraft || !isSupabaseConfigured()) return getCarDetailBySlug(slug);

  try {
    const admin = createAdminClient();
    const { data, error } = await admin.from("vehicles").select("*").eq("type", "car");
    if (error) throw error;
    const row = data?.find((item) => matchesSlug(item, slug));
    if (!row) return undefined;
    return mapVehicleToCarDetail(row);
  } catch (error) {
    console.error(`[preview-catalog/car-detail] fetch failed for ${slug}:`, error);
    return undefined;
  }
}

export async function getScooterDetailBySlugForAdminPreview(
  slug: string,
  includeDraft: boolean,
): Promise<ScooterDetail | undefined> {
  if (!includeDraft || !isSupabaseConfigured()) return getScooterDetailBySlug(slug);

  try {
    const admin = createAdminClient();
    const { data, error } = await admin.from("vehicles").select("*").eq("type", "scooter");
    if (error) throw error;
    const row = data?.find((item) => matchesSlug(item, slug));
    if (!row) return undefined;
    return mapVehicleToScooterDetail(row);
  } catch (error) {
    console.error(`[preview-catalog/scooter-detail] fetch failed for ${slug}:`, error);
    return undefined;
  }
}

export async function getAccessoryForAdminPreview(
  slug: string,
  includeDraft: boolean,
): Promise<AccessoryProduct | undefined> {
  if (!includeDraft || !isSupabaseConfigured()) return getAccessoryBySlugOrId(slug);

  try {
    const admin = createAdminClient();
    const { data, error } = await admin.from("accessories").select("*");
    if (error) throw error;
    return data
      ?.map(mapAccessoryRow)
      .find(
        (item) => resolveProductSlug(item, "accessory", item.name) === slug || item.id === slug,
      );
  } catch (error) {
    console.error(`[preview-catalog/accessory] fetch failed for ${slug}:`, error);
    return undefined;
  }
}
