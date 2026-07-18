import type { Json, Tables, TablesInsert } from "@vinfast3s/supabase";
import { createAdminClient } from "@vinfast3s/supabase/admin";
import { CARS } from "@webclient/lib/cars";
import { SCOOTERS } from "@webclient/lib/scooters";
import { VINFAST_ACCESSORIES } from "@webclient/lib/vinfast-accessories";
import { getCarDetail } from "@webclient/lib/car-details";
import { getScooterDetail } from "@webclient/lib/scooter-details";
import { getCarGallery } from "@webclient/lib/vinfast-galleries";
import type { MediaCategory } from "@/lib/media-library";
import {
  ensureUniqueProductId,
  ensureUniqueSlug,
  isValidProductId,
  isValidSlug,
  normalizeProductId,
  normalizeSlug,
} from "@/lib/content-slug";
import { deleteMediaFolderAssets } from "@/lib/product-media-cleanup";
import { mediaFolderStoragePrefix } from "@/lib/media-storage";

export const PRODUCT_PLACEHOLDER_IMAGE = "/images/showroom.webp";

export type ProductType = "car" | "scooter" | "accessory";

export type ProductReference = {
  type: "homepage" | "news" | "accessory";
  label: string;
  href?: string;
};

export type CreateVehiclePayload = {
  cloneFromId: string;
  name: string;
  id?: string;
  slug?: string;
  type: "car" | "scooter";
  vehicles?: string[];
};

export type CreateAccessoryPayload = {
  cloneFromId: string;
  name: string;
  id?: string;
  slug?: string;
  vehicles?: string[];
};

function asObject(value: Json | null | undefined): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function stripImagesDeep(value: unknown): unknown {
  if (Array.isArray(value)) {
    if (value.every((item) => typeof item === "string")) {
      return [];
    }
    return value.map(stripImagesDeep);
  }

  if (!value || typeof value !== "object") return value;

  const source = value as Record<string, unknown>;
  const next: Record<string, unknown> = {};

  for (const [key, child] of Object.entries(source)) {
    if (key === "gallery" && Array.isArray(child)) {
      next[key] = [];
      continue;
    }
    if (
      (key === "image" ||
        key === "imageUrl" ||
        key === "coverImage" ||
        key === "hero_image_url" ||
        key === "image_url" ||
        key === "cover_image_url") &&
      typeof child === "string" &&
      child
    ) {
      next[key] = PRODUCT_PLACEHOLDER_IMAGE;
      continue;
    }
    next[key] = stripImagesDeep(child);
  }

  return next;
}

function buildVehicleRowFromStatic(id: string, type: "car" | "scooter"): TablesInsert<"vehicles"> | null {
  if (type === "car") {
    const car = CARS.find((item) => item.id === id);
    if (!car) return null;
    const detail = getCarDetail(car.id);
    const gallery = getCarGallery(car);
    return {
      id: car.id,
      type: "car",
      name: car.name,
      slug: car.id,
      category: car.segment,
      tagline: car.subtitle,
      starting_price: car.price,
      status: "published",
      sort_order: 0,
      featured: Boolean(car.isBestSeller || car.isNew),
      hero_image_url: car.image,
      gallery,
      colors: car.colors as Json,
      variants: (detail?.variants ?? []) as Json,
      spec_table: (detail?.specGroups ?? []) as Json,
      content: { catalog: car, detail } as Json,
      seo: { metaTitle: car.name, metaDescription: car.subtitle } as Json,
    };
  }

  const scooter = SCOOTERS.find((item) => item.id === id);
  if (!scooter) return null;
  const detail = getScooterDetail(scooter.id);
  return {
    id: scooter.id,
    type: "scooter",
    name: scooter.name,
    slug: scooter.id,
    category: scooter.type,
    tagline: scooter.subtitle,
    starting_price: scooter.price,
    status: "published",
    sort_order: 0,
    featured: Boolean(scooter.isBestSeller || scooter.isNew),
    hero_image_url: scooter.image,
    gallery: [],
    colors: scooter.colors as Json,
    variants: (detail?.variants ?? []) as Json,
    spec_table: (detail?.specGroups ?? []) as Json,
    content: { catalog: scooter, detail } as Json,
    seo: { metaTitle: scooter.name, metaDescription: scooter.subtitle } as Json,
  };
}

function buildAccessoryRowFromStatic(id: string): TablesInsert<"accessories"> | null {
  const item = VINFAST_ACCESSORIES.find((row) => row.id === id);
  if (!item) return null;
  return {
    id: item.id,
    name: item.name,
    slug: item.id,
    category: item.category,
    description: item.description,
    price: item.price,
    image_url: item.image,
    in_stock: item.inStock !== false,
    featured: item.badge === "Bán chạy",
    status: "published",
    sort_order: 0,
    content: item as unknown as Json,
  };
}

async function fetchVehicleSourceRow(
  id: string,
  type: "car" | "scooter",
): Promise<Tables<"vehicles"> | null> {
  const admin = createAdminClient();
  const { data } = await admin.from("vehicles").select("*").eq("id", id).maybeSingle();
  if (data && data.type === type) return data;
  const staticRow = buildVehicleRowFromStatic(id, type);
  return staticRow as Tables<"vehicles"> | null;
}

async function fetchAccessorySourceRow(id: string): Promise<Tables<"accessories"> | null> {
  const admin = createAdminClient();
  const { data } = await admin.from("accessories").select("*").eq("id", id).maybeSingle();
  if (data) return data;
  return buildAccessoryRowFromStatic(id) as Tables<"accessories"> | null;
}

async function nextVehicleSortOrder(type: "car" | "scooter"): Promise<number> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("vehicles")
    .select("sort_order")
    .eq("type", type)
    .order("sort_order", { ascending: false })
    .limit(1);
  return (data?.[0]?.sort_order ?? -1) + 1;
}

async function nextAccessorySortOrder(): Promise<number> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("accessories")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1);
  return (data?.[0]?.sort_order ?? -1) + 1;
}

function cloneVehicleContent(
  content: Json,
  next: { id: string; slug: string; name: string; type: "car" | "scooter" },
): Json {
  const stripped = stripImagesDeep(content) as Record<string, unknown>;
  const catalog = asObject(stripped.catalog as Json) ?? {};
  const detail = asObject(stripped.detail as Json) ?? {};

  catalog.id = next.id;
  catalog.name = next.name;
  catalog.image = PRODUCT_PLACEHOLDER_IMAGE;

  detail.id = next.id;
  detail.name = next.name;
  detail.image = PRODUCT_PLACEHOLDER_IMAGE;
  detail.gallery = [];

  return {
    ...stripped,
    catalog,
    detail,
    admin_patches: {},
  } as Json;
}

function cloneAccessoryContent(content: Json, next: { id: string; name: string; vehicles?: string[] }): Json {
  const stripped = stripImagesDeep(content) as Record<string, unknown>;
  return {
    ...stripped,
    id: next.id,
    name: next.name,
    image: PRODUCT_PLACEHOLDER_IMAGE,
    vehicles: next.vehicles ?? (Array.isArray(stripped.vehicles) ? stripped.vehicles : []),
    _updatedAt: new Date().toISOString(),
  } as Json;
}

export async function createVehicleFromClone(payload: CreateVehiclePayload) {
  const name = payload.name?.trim();
  if (!name) throw new Error("Tên sản phẩm là bắt buộc");

  const cloneFromId = payload.cloneFromId?.trim();
  if (!cloneFromId) throw new Error("Chọn sản phẩm mẫu để sao chép");

  const baseId = normalizeProductId(payload.id?.trim() || payload.slug?.trim() || name);
  const baseSlug = normalizeSlug(payload.slug?.trim() || baseId);

  if (payload.id && !isValidProductId(baseId)) {
    throw new Error("ID không hợp lệ — dùng chữ thường, số và dấu gạch ngang (vd: vf9-plus)");
  }
  if (payload.slug && !isValidSlug(baseSlug)) {
    throw new Error("Slug không hợp lệ — dùng chữ thường, số và dấu gạch ngang");
  }

  const source = await fetchVehicleSourceRow(cloneFromId, payload.type);
  if (!source) throw new Error("Không tìm thấy sản phẩm mẫu");

  const id = await ensureUniqueProductId("vehicles", baseId);
  const slug = await ensureUniqueSlug("vehicles", baseSlug);

  const insertRow: TablesInsert<"vehicles"> = {
    id,
    type: payload.type,
    name,
    slug,
    category: source.category,
    tagline: source.tagline,
    slogan: source.slogan,
    overview: source.overview,
    starting_price: source.starting_price,
    status: "draft",
    sort_order: await nextVehicleSortOrder(payload.type),
    featured: false,
    hero_image_url: PRODUCT_PLACEHOLDER_IMAGE,
    gallery: [],
    variants: source.variants,
    colors: stripImagesDeep(source.colors) as Json,
    spec_table: source.spec_table,
    content: cloneVehicleContent(source.content, { id, slug, name, type: payload.type }),
    seo: {
      ...(asObject(source.seo as Json) ?? {}),
      metaTitle: name,
    } as Json,
  };

  const admin = createAdminClient();
  const { data, error } = await admin.from("vehicles").insert(insertRow).select("*").single();
  if (error) throw new Error(error.message);
  return data;
}

export async function createAccessoryFromClone(payload: CreateAccessoryPayload) {
  const name = payload.name?.trim();
  if (!name) throw new Error("Tên phụ kiện là bắt buộc");

  const cloneFromId = payload.cloneFromId?.trim();
  if (!cloneFromId) throw new Error("Chọn phụ kiện mẫu để sao chép");

  const baseId = normalizeProductId(payload.id?.trim() || payload.slug?.trim() || name);
  const baseSlug = normalizeSlug(payload.slug?.trim() || baseId);

  if (payload.id && !isValidProductId(baseId)) {
    throw new Error("ID không hợp lệ — dùng chữ thường, số và dấu gạch ngang");
  }
  if (payload.slug && !isValidSlug(baseSlug)) {
    throw new Error("Slug không hợp lệ — dùng chữ thường, số và dấu gạch ngang");
  }

  const source = await fetchAccessorySourceRow(cloneFromId);
  if (!source) throw new Error("Không tìm thấy phụ kiện mẫu");

  const id = await ensureUniqueProductId("accessories", baseId);
  const slug = await ensureUniqueSlug("accessories", baseSlug);
  const sourceContent = asObject(source.content) ?? {};
  const vehicles =
    payload.vehicles ??
    (Array.isArray(sourceContent.vehicles)
      ? sourceContent.vehicles.filter((item): item is string => typeof item === "string")
      : []);

  const insertRow: TablesInsert<"accessories"> = {
    id,
    name,
    slug,
    category: source.category,
    description: source.description,
    price: source.price,
    image_url: PRODUCT_PLACEHOLDER_IMAGE,
    in_stock: source.in_stock,
    featured: false,
    status: "draft",
    sort_order: await nextAccessorySortOrder(),
    content: cloneAccessoryContent(source.content, { id, name, vehicles }),
  };

  const admin = createAdminClient();
  const { data, error } = await admin.from("accessories").insert(insertRow).select("*").single();
  if (error) throw new Error(error.message);
  return data;
}

function contentIncludesId(value: unknown, id: string): boolean {
  if (typeof value === "string") return value.includes(id);
  if (Array.isArray(value)) return value.some((item) => contentIncludesId(item, id));
  if (value && typeof value === "object") {
    return Object.values(value as Record<string, unknown>).some((item) => contentIncludesId(item, id));
  }
  return false;
}

export async function findProductReferences(
  productType: ProductType,
  productId: string,
): Promise<ProductReference[]> {
  const admin = createAdminClient();
  const refs: ProductReference[] = [];

  const { data: homePage } = await admin
    .from("cms_pages")
    .select("content")
    .eq("slug", "home")
    .maybeSingle();

  if (homePage?.content && contentIncludesId(homePage.content, productId)) {
    refs.push({
      type: "homepage",
      label: "Trang chủ (slide / sản phẩm nổi bật)",
      href: "/admin/homepage",
    });
  }

  const { data: newsRows } = await admin
    .from("news_articles")
    .select("id, title, slug, related_products")
    .not("related_products", "is", null);

  for (const article of newsRows ?? []) {
    const related = article.related_products;
    if (!Array.isArray(related)) continue;
    const matched = related.some((item) => {
      if (!item || typeof item !== "object") return false;
      const row = item as Record<string, unknown>;
      return row.id === productId || row.productId === productId;
    });
    if (matched) {
      refs.push({
        type: "news",
        label: `Bài viết: ${article.title}`,
        href: `/admin/posts/${article.id}`,
      });
    }
  }

  if (productType === "car" || productType === "scooter") {
    const { data: accessories } = await admin.from("accessories").select("id, name, content");
    for (const item of accessories ?? []) {
      const content = asObject(item.content);
      const vehicles = content?.vehicles;
      if (Array.isArray(vehicles) && vehicles.includes(productId)) {
        refs.push({
          type: "accessory",
          label: `Phụ kiện: ${item.name}`,
          href: `/admin/accessories/${item.id}`,
        });
      }
    }
  }

  return refs;
}

export async function deleteVehicleProduct(id: string, type: "car" | "scooter") {
  const admin = createAdminClient();
  const { data: existing, error: loadError } = await admin
    .from("vehicles")
    .select("id, slug, type")
    .eq("id", id)
    .maybeSingle();

  if (loadError) throw new Error(loadError.message);
  if (!existing || existing.type !== type) throw new Error("Không tìm thấy sản phẩm");

  const mediaCategory: MediaCategory = type === "car" ? "cars" : "scooters";
  const media = await deleteMediaFolderAssets(mediaCategory, id);

  const { error } = await admin.from("vehicles").delete().eq("id", id);
  if (error) throw new Error(error.message);

  return { id, slug: existing.slug, media };
}

export async function deleteAccessoryProduct(id: string) {
  const admin = createAdminClient();
  const { data: existing, error: loadError } = await admin
    .from("accessories")
    .select("id, slug")
    .eq("id", id)
    .maybeSingle();

  if (loadError) throw new Error(loadError.message);
  if (!existing) throw new Error("Không tìm thấy phụ kiện");

  const { error } = await admin.from("accessories").delete().eq("id", id);
  if (error) throw new Error(error.message);

  return { id, slug: existing.slug };
}

export function vehicleMediaFolderPrefix(type: "car" | "scooter", id: string): string {
  return mediaFolderStoragePrefix(type === "car" ? "cars" : "scooters", id);
}
