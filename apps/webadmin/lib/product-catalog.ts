import { createAdminClient } from "@vinfast3s/supabase/admin";
import { isSupabaseConfigured } from "@vinfast3s/supabase";
import { CARS } from "@webclient/lib/cars";
import { SCOOTERS } from "@webclient/lib/scooters";
import { VINFAST_ACCESSORIES } from "@webclient/lib/vinfast-accessories";
import {
  defaultAccessorySlug,
  defaultCarSlug,
  defaultScooterSlug,
  resolveProductSlug,
} from "@webclient/lib/seo/slugs";

export type CatalogSortItem = {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  status: string;
};

export async function getVehicleCatalogItems(
  type: "car" | "scooter",
): Promise<CatalogSortItem[]> {
  const fallback = type === "car" ? CARS : SCOOTERS;
  const fallbackItems = fallback.map((item, index) => ({
    id: item.id,
    name: item.name,
    slug: type === "car" ? defaultCarSlug(item.id) : defaultScooterSlug(item.id),
    sortOrder: index,
    status: "published",
  }));

  if (!isSupabaseConfigured()) return fallbackItems;

  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("vehicles")
      .select("id, name, slug, sort_order, status")
      .eq("type", type)
      .order("sort_order", { ascending: true });
    if (error || !data?.length) return fallbackItems;
    return data.map((row) => ({
      id: row.id,
      name: row.name,
      slug: resolveProductSlug({ id: row.id, slug: row.slug }, type),
      sortOrder: row.sort_order,
      status: row.status,
    }));
  } catch {
    return fallbackItems;
  }
}

export async function getAccessoryCatalogItems(): Promise<CatalogSortItem[]> {
  const fallbackItems = VINFAST_ACCESSORIES.map((item, index) => ({
    id: item.id,
    name: item.name,
    slug: defaultAccessorySlug(item.id, item.name),
    sortOrder: index,
    status: "published",
  }));

  if (!isSupabaseConfigured()) return fallbackItems;

  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("accessories")
      .select("id, name, slug, sort_order, status")
      .order("sort_order", { ascending: true });
    if (error || !data?.length) return fallbackItems;
    return data.map((row) => ({
      id: row.id,
      name: row.name,
      slug: resolveProductSlug({ id: row.id, slug: row.slug }, "accessory", row.name),
      sortOrder: row.sort_order,
      status: row.status,
    }));
  } catch {
    return fallbackItems;
  }
}
