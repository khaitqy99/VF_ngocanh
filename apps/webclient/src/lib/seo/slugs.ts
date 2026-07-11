/** Sinh slug readable từ id sản phẩm (migration + fallback khi DB chưa có slug). */

export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Alias slug cũ (thời fallback map dài) → vehicle id.
 * Slug canonical là slug trong DB — hiện trùng với id (vf3, evo, ...).
 * Giữ map này để redirect 301 URL cũ và parse href legacy.
 */
export const LEGACY_CAR_SLUG_ALIASES: Record<string, string> = {
  "vinfast-vf3": "vf3",
  "vinfast-vf5": "vf5",
  "vinfast-vf6": "vf6",
  "vinfast-vf7": "vf7",
  "vinfast-vf8": "vf8",
  "vinfast-vf8-all-new": "vf8-all-new",
  "vinfast-vf9": "vf9",
  "vinfast-mpv7": "vf-mpv7",
  "vinfast-ec-van": "ec-van",
  "vinfast-minio-green": "minio-green",
  "vinfast-herio-green": "herio-green",
  "vinfast-nerio-green": "nerio-green",
  "vinfast-limo-green": "limo-green",
};

export const LEGACY_SCOOTER_SLUG_ALIASES: Record<string, string> = {
  "xe-may-flazz-max": "flazz-max",
  "xe-may-amio-s": "amio-s",
  "xe-may-evo-lite": "evo-lite",
  "xe-may-amio": "amio",
  "xe-may-viper": "viper",
  "xe-may-feliz-ii": "feliz-ii",
  "xe-may-evo": "evo",
  "xe-may-zgoo": "zgoo",
  "xe-may-flazz": "flazz",
  "xe-may-vero-x": "vero-x",
  "xe-may-feliz-2025": "feliz-2025",
  "xe-may-evo-grand": "evo-grand",
  "xe-may-evo-grand-lite": "evo-grand-lite",
  "xe-may-drgnfly": "drgnfly",
  "xe-may-evo-lite-neo": "evo-lite-neo",
};

export function defaultCarSlug(id: string): string {
  return slugify(id);
}

export function defaultScooterSlug(id: string): string {
  return slugify(id);
}

export function defaultAccessorySlug(id: string, name?: string): string {
  const fromName = name ? slugify(name) : "";
  const base = fromName || slugify(id);
  return base.startsWith("phu-kien-") ? base : `phu-kien-${base}`;
}

export function isValidSlug(value: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) && value.length >= 2 && value.length <= 120;
}

/** Slug dành riêng cho route catalog preview — không dùng làm slug sản phẩm. */
export const RESERVED_PRODUCT_SLUGS = new Set(["preview", "catalog-preview"]);

export function isReservedProductSlug(slug: string): boolean {
  return RESERVED_PRODUCT_SLUGS.has(slug);
}

export function resolveProductSlug(
  row: { id: string; slug?: string | null },
  type: "car" | "scooter" | "accessory",
  name?: string,
): string {
  const fromDb = row.slug?.trim();
  if (fromDb && isValidSlug(fromDb) && !isReservedProductSlug(fromDb)) return fromDb;
  if (type === "car") return defaultCarSlug(row.id);
  if (type === "scooter") return defaultScooterSlug(row.id);
  return defaultAccessorySlug(row.id, name);
}

export function carDetailPath(car: { id: string; slug?: string }): string {
  return `/oto/${resolveProductSlug(car, "car")}`;
}

export function scooterDetailPath(scooter: { id: string; slug?: string }): string {
  return `/xe-may-dien/${resolveProductSlug(scooter, "scooter")}`;
}

export function accessoryDetailPath(product: { id: string; slug?: string; name?: string }): string {
  return `/phu-kien/${resolveProductSlug(product, "accessory", product.name)}`;
}

export function carDetailPathFromSlug(slug: string): string {
  return `/oto/${slug}`;
}

export function scooterDetailPathFromSlug(slug: string): string {
  return `/xe-may-dien/${slug}`;
}

export function accessoryDetailPathFromSlug(slug: string): string {
  return `/phu-kien/${slug}`;
}

/** Đổi segment URL (slug canonical hoặc alias cũ) về vehicle id nội bộ. */
export function resolveVehicleIdFromHrefSegment(segment: string, type: "car" | "scooter"): string {
  const aliases = type === "car" ? LEGACY_CAR_SLUG_ALIASES : LEGACY_SCOOTER_SLUG_ALIASES;
  return aliases[segment] ?? segment;
}

/** Slug alias cũ → slug canonical (dùng cho redirect 301 trong route). */
export function resolveLegacyVehicleSlug(
  segment: string,
  type: "car" | "scooter",
): string | undefined {
  const aliases = type === "car" ? LEGACY_CAR_SLUG_ALIASES : LEGACY_SCOOTER_SLUG_ALIASES;
  return aliases[segment];
}

export function vehicleDetailPathFromId(id: string, type: "car" | "scooter"): string {
  if (type === "car") return `/oto/${defaultCarSlug(id)}`;
  return `/xe-may-dien/${defaultScooterSlug(id)}`;
}
