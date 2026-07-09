import { unstable_cache } from "next/cache";
import { createAdminClient } from "@vinfast3s/supabase/admin";
import { isSupabaseConfigured, type Tables } from "@vinfast3s/supabase";
import {
  mapAccessoryRow,
  mapVehicleToCar,
  mapVehicleToCarDetail,
  mapVehicleToScooter,
  mapVehicleToScooterDetail,
} from "@webclient/lib/cms/mappers";
import type { AccessoryProduct } from "@webclient/lib/accessories";
import type { CarDetail } from "@webclient/lib/car-details";
import type { CarModel } from "@webclient/lib/cars";
import type { ScooterDetail } from "@webclient/lib/scooter-details";
import type { ScooterModel } from "@webclient/lib/scooters";
import { CARS } from "@webclient/lib/cars";
import { SCOOTERS } from "@webclient/lib/scooters";
import { VINFAST_ACCESSORIES } from "@webclient/lib/vinfast-accessories";
import { getCarDetail } from "@webclient/lib/car-details";
import { getScooterDetail } from "@webclient/lib/scooter-details";
import type { MediaImage } from "@/lib/media-library";
import { ADMIN_MEDIA_CACHE_TAG } from "@/lib/media-revalidate";

async function fetchVehicles(type: "car" | "scooter") {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("vehicles")
    .select("*")
    .eq("type", type)
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

async function fetchVehicleById(id: string): Promise<Tables<"vehicles"> | null> {
  const admin = createAdminClient();
  const { data, error } = await admin.from("vehicles").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

async function fetchAccessoriesRows() {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("accessories")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export const getAdminCars = unstable_cache(
  async (): Promise<CarModel[]> => {
    if (!isSupabaseConfigured()) return CARS;
    try {
      const rows = await fetchVehicles("car");
      return rows.length ? rows.map(mapVehicleToCar) : CARS;
    } catch {
      return CARS;
    }
  },
  ["admin-cms-cars"],
  { revalidate: 60, tags: ["admin-cms-cars"] },
);

export const getAdminScooters = unstable_cache(
  async (): Promise<ScooterModel[]> => {
    if (!isSupabaseConfigured()) return SCOOTERS;
    try {
      const rows = await fetchVehicles("scooter");
      return rows.length ? rows.map(mapVehicleToScooter) : SCOOTERS;
    } catch {
      return SCOOTERS;
    }
  },
  ["admin-cms-scooters"],
  { revalidate: 60, tags: ["admin-cms-scooters"] },
);

export const getAdminAccessories = unstable_cache(
  async (): Promise<AccessoryProduct[]> => {
    if (!isSupabaseConfigured()) return VINFAST_ACCESSORIES as unknown as AccessoryProduct[];
    try {
      const rows = await fetchAccessoriesRows();
      return rows.length
        ? rows.map(mapAccessoryRow)
        : (VINFAST_ACCESSORIES as unknown as AccessoryProduct[]);
    } catch {
      return VINFAST_ACCESSORIES as unknown as AccessoryProduct[];
    }
  },
  ["admin-cms-accessories"],
  { revalidate: 60, tags: ["admin-cms-accessories"] },
);

export async function getAdminCarDetail(id: string): Promise<CarDetail | undefined> {
  if (!isSupabaseConfigured()) return getCarDetail(id);
  try {
    const row = await fetchVehicleById(id);
    if (!row || row.type !== "car") return getCarDetail(id);
    return mapVehicleToCarDetail(row) ?? getCarDetail(id);
  } catch {
    return getCarDetail(id);
  }
}

export async function getAdminScooterDetail(id: string): Promise<ScooterDetail | undefined> {
  if (!isSupabaseConfigured()) return getScooterDetail(id);
  try {
    const row = await fetchVehicleById(id);
    if (!row || row.type !== "scooter") return getScooterDetail(id);
    return mapVehicleToScooterDetail(row) ?? getScooterDetail(id);
  } catch {
    return getScooterDetail(id);
  }
}

export async function getAdminAccessoryById(id: string): Promise<AccessoryProduct | undefined> {
  const all = await getAdminAccessories();
  return all.find((a) => a.id === id);
}

export async function getAdminVehicleGalleries(): Promise<Map<string, string[]>> {
  const map = new Map<string, string[]>();
  if (!isSupabaseConfigured()) return map;

  try {
    const admin = createAdminClient();
    const { data } = await admin.from("vehicles").select("id, gallery, hero_image_url");
    for (const row of data ?? []) {
      const paths: string[] = [];
      if (Array.isArray(row.gallery)) {
        for (const item of row.gallery) {
          if (typeof item === "string") paths.push(item);
        }
      }
      if (row.hero_image_url) paths.unshift(row.hero_image_url);
      map.set(row.id, [...new Set(paths.filter(Boolean))]);
    }
  } catch {
    return map;
  }

  return map;
}

export async function getAdminMediaAssetsByFolder(): Promise<Map<string, MediaImage[]>> {
  const map = new Map<string, MediaImage[]>();
  if (!isSupabaseConfigured()) return map;

  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("media_assets")
      .select("id, filename, url, folder")
      .order("created_at", { ascending: false });
    if (error) throw error;

    for (const row of data ?? []) {
      if (!row.folder) continue;
      const list = map.get(row.folder) ?? [];
      list.push({
        id: row.id,
        name: row.filename,
        path: row.url,
        assetId: row.id,
      });
      map.set(row.folder, list);
    }
  } catch {
    return map;
  }

  return map;
}

export type AdminDashboardStats = {
  carCount: number;
  scooterCount: number;
  accessoryCount: number;
  mediaFolderCount: number;
  mediaImageCount: number;
};

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const folders = await getAdminMediaFolders();
  const [cars, scooters, accessories] = await Promise.all([
    getAdminCars(),
    getAdminScooters(),
    getAdminAccessories(),
  ]);
  return {
    carCount: cars.length,
    scooterCount: scooters.length,
    accessoryCount: accessories.length,
    mediaFolderCount: folders.length,
    mediaImageCount: folders.reduce((sum, f) => sum + f.images.length, 0),
  };
}

export const getAdminMediaFolders = unstable_cache(
  async () => {
    const { buildMediaFolders } = await import("@/lib/media-library");
    const [cars, scooters, accessories, galleries, mediaAssets] = await Promise.all([
      getAdminCars(),
      getAdminScooters(),
      getAdminAccessories(),
      getAdminVehicleGalleries(),
      getAdminMediaAssetsByFolder(),
    ]);
    return buildMediaFolders(cars, scooters, accessories, galleries, mediaAssets);
  },
  ["admin-cms-media-folders"],
  { revalidate: 60, tags: [ADMIN_MEDIA_CACHE_TAG] },
);
