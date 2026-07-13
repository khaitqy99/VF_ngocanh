import { createAdminClient } from "@vinfast3s/supabase/admin";
import { isSupabaseConfigured, type Tables, type TablesInsert, type TablesUpdate } from "@vinfast3s/supabase";
import { CARS } from "@webclient/lib/cars";
import { SCOOTERS } from "@webclient/lib/scooters";
import { VINFAST_ACCESSORIES } from "@webclient/lib/vinfast-accessories";
import {
  defaultAccessorySlug,
  defaultCarSlug,
  defaultScooterSlug,
  resolveProductSlug,
} from "@webclient/lib/seo/slugs";
import type { ProductType } from "@/lib/product-api";
import {
  ensureUniqueSlug,
  isValidSlug,
  normalizeSlug,
} from "@/lib/content-slug";

export type PublishStatus = "draft" | "published" | "archived";

export type AdminProductMeta = {
  id: string;
  name: string;
  slug: string;
  status: PublishStatus;
  featured: boolean;
  tagline?: string;
  category?: string;
  startingPrice?: number;
  price?: number;
  inStock?: boolean;
  inDatabase: boolean;
};

export type ProductSettingsPayload = {
  name?: string;
  slug?: string;
  status?: PublishStatus;
  featured?: boolean;
  tagline?: string;
  category?: string;
  startingPrice?: number;
  price?: number;
  inStock?: boolean;
};

function mapVehicleMeta(row: Tables<"vehicles">): AdminProductMeta {
  const type = row.type === "scooter" ? "scooter" : "car";
  return {
    id: row.id,
    name: row.name,
    slug: resolveProductSlug({ id: row.id, slug: row.slug }, type),
    status: row.status as PublishStatus,
    featured: row.featured,
    tagline: row.tagline ?? undefined,
    category: row.category ?? undefined,
    startingPrice: row.starting_price ?? undefined,
    inDatabase: true,
  };
}

function mapAccessoryMeta(row: Tables<"accessories">): AdminProductMeta {
  return {
    id: row.id,
    name: row.name,
    slug: resolveProductSlug({ id: row.id, slug: row.slug }, "accessory", row.name),
    status: row.status as PublishStatus,
    featured: row.featured,
    category: row.category ?? undefined,
    price: row.price ?? undefined,
    inStock: row.in_stock,
    inDatabase: true,
  };
}

export async function getAdminVehicleMeta(
  id: string,
  type: "car" | "scooter",
): Promise<AdminProductMeta | null> {
  if (isSupabaseConfigured()) {
    try {
      const admin = createAdminClient();
      const { data } = await admin.from("vehicles").select("*").eq("id", id).maybeSingle();
      if (data && data.type === type) return mapVehicleMeta(data);
    } catch {
      /* fallback */
    }
  }

  const fallback = type === "car" ? CARS.find((item) => item.id === id) : SCOOTERS.find((item) => item.id === id);
  if (!fallback) return null;

  return {
    id: fallback.id,
    name: fallback.name,
    slug: type === "car" ? defaultCarSlug(fallback.id) : defaultScooterSlug(fallback.id),
    status: "published",
    featured: Boolean(fallback.isBestSeller || fallback.isNew),
    tagline: fallback.subtitle,
    startingPrice: fallback.price,
    inDatabase: false,
  };
}

export async function getAdminAccessoryMeta(id: string): Promise<AdminProductMeta | null> {
  if (isSupabaseConfigured()) {
    try {
      const admin = createAdminClient();
      const { data } = await admin.from("accessories").select("*").eq("id", id).maybeSingle();
      if (data) return mapAccessoryMeta(data);
    } catch {
      /* fallback */
    }
  }

  const fallback = VINFAST_ACCESSORIES.find((item) => item.id === id);
  if (!fallback) return null;

  return {
    id: fallback.id,
    name: fallback.name,
    slug: defaultAccessorySlug(fallback.id, fallback.name),
    status: "published",
    featured: fallback.badge === "Bán chạy",
    category: fallback.category,
    price: fallback.price,
    inStock: fallback.inStock !== false,
    inDatabase: false,
  };
}

export async function updateProductSettings(
  type: ProductType,
  id: string,
  payload: ProductSettingsPayload,
): Promise<AdminProductMeta> {
  if (!isSupabaseConfigured()) {
    throw new Error("Database chưa được cấu hình");
  }

  const admin = createAdminClient();

  if (type === "accessory") {
    const { data: existing } = await admin.from("accessories").select("*").eq("id", id).maybeSingle();
    const staticItem = VINFAST_ACCESSORIES.find((item) => item.id === id);

    let nextSlug = existing?.slug ?? defaultAccessorySlug(id, existing?.name ?? staticItem?.name);
    if (payload.slug !== undefined) {
      const normalized = normalizeSlug(payload.slug);
      if (!isValidSlug(normalized)) throw new Error("Slug không hợp lệ");
      nextSlug = await ensureUniqueSlug("accessories", normalized, id);
    }

    const update: TablesUpdate<"accessories"> = {};
    if (payload.name !== undefined) {
      if (!payload.name.trim()) throw new Error("Tên phụ kiện không được để trống");
      update.name = payload.name.trim();
    }
    if (payload.slug !== undefined) update.slug = nextSlug;
    if (payload.status !== undefined) update.status = payload.status;
    if (payload.featured !== undefined) update.featured = payload.featured;
    if (payload.category !== undefined) update.category = payload.category;
    if (payload.price !== undefined) {
      if (payload.price < 0) throw new Error("Giá không được âm");
      update.price = payload.price;
    }
    if (payload.inStock !== undefined) update.in_stock = payload.inStock;

    if (existing) {
      const { data, error } = await admin.from("accessories").update(update).eq("id", id).select("*").single();
      if (error) throw new Error(error.message);
      return mapAccessoryMeta(data);
    }

    const insert: TablesInsert<"accessories"> = {
      id,
      name: payload.name?.trim() ?? staticItem?.name ?? id,
      slug: nextSlug,
      status: payload.status ?? "published",
      featured: payload.featured ?? false,
      category: payload.category ?? staticItem?.category,
      price: payload.price ?? staticItem?.price,
      in_stock: payload.inStock ?? staticItem?.inStock !== false,
      content: staticItem as unknown as TablesInsert<"accessories">["content"],
    };
    const { data, error } = await admin.from("accessories").insert(insert).select("*").single();
    if (error) throw new Error(error.message);
    return mapAccessoryMeta(data);
  }

  const vehicleType = type === "scooter" ? "scooter" : "car";
  const { data: existing } = await admin.from("vehicles").select("*").eq("id", id).maybeSingle();
  const staticItem =
    vehicleType === "car"
      ? CARS.find((item) => item.id === id)
      : SCOOTERS.find((item) => item.id === id);

  let nextSlug =
    existing?.slug ??
    (vehicleType === "car" ? defaultCarSlug(id) : defaultScooterSlug(id));
  if (payload.slug !== undefined) {
    const normalized = normalizeSlug(payload.slug);
    if (!isValidSlug(normalized)) throw new Error("Slug không hợp lệ");
    nextSlug = await ensureUniqueSlug("vehicles", normalized, id);
  }

  const update: TablesUpdate<"vehicles"> = {};
  if (payload.name !== undefined) {
    if (!payload.name.trim()) throw new Error("Tên sản phẩm không được để trống");
    update.name = payload.name.trim();
  }
  if (payload.slug !== undefined) update.slug = nextSlug;
  if (payload.status !== undefined) update.status = payload.status;
  if (payload.featured !== undefined) update.featured = payload.featured;
  if (payload.tagline !== undefined) update.tagline = payload.tagline;
  if (payload.category !== undefined) update.category = payload.category;
  if (payload.startingPrice !== undefined) {
    if (payload.startingPrice < 0) throw new Error("Giá không được âm");
    update.starting_price = payload.startingPrice;
  }

  if (existing && existing.type === vehicleType) {
    const { data, error } = await admin.from("vehicles").update(update).eq("id", id).select("*").single();
    if (error) throw new Error(error.message);
    return mapVehicleMeta(data);
  }

  const insert: TablesInsert<"vehicles"> = {
    id,
    type: vehicleType,
    name: payload.name?.trim() ?? staticItem?.name ?? id,
    slug: nextSlug,
    status: payload.status ?? "published",
    featured: payload.featured ?? false,
    tagline: payload.tagline ?? staticItem?.subtitle,
    category: payload.category,
    starting_price: payload.startingPrice ?? staticItem?.price,
    hero_image_url: staticItem?.image,
    content: staticItem ? ({ catalog: staticItem } as TablesInsert<"vehicles">["content"]) : {},
  };
  const { data, error } = await admin.from("vehicles").insert(insert).select("*").single();
  if (error) throw new Error(error.message);
  return mapVehicleMeta(data);
}
