/** Sinh slug readable từ id sản phẩm (migration + fallback khi DB chưa có slug). */

export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const CAR_SLUG_MAP: Record<string, string> = {
  vf3: "vinfast-vf3",
  vf5: "vinfast-vf5",
  vf6: "vinfast-vf6",
  vf7: "vinfast-vf7",
  vf8: "vinfast-vf8",
  "vf8-all-new": "vinfast-vf8-all-new",
  vf9: "vinfast-vf9",
  "vf-mpv7": "vinfast-mpv7",
  "ec-van": "vinfast-ec-van",
  "minio-green": "vinfast-minio-green",
  "herio-green": "vinfast-herio-green",
  "nerio-green": "vinfast-nerio-green",
  "limo-green": "vinfast-limo-green",
};

const SCOOTER_SLUG_MAP: Record<string, string> = {
  "flazz-max": "xe-may-flazz-max",
  "amio-s": "xe-may-amio-s",
  "evo-lite": "xe-may-evo-lite",
  amio: "xe-may-amio",
  viper: "xe-may-viper",
  "feliz-ii": "xe-may-feliz-ii",
  evo: "xe-may-evo",
  zgoo: "xe-may-zgoo",
  flazz: "xe-may-flazz",
  "vero-x": "xe-may-vero-x",
  "feliz-2025": "xe-may-feliz-2025",
  "evo-grand": "xe-may-evo-grand",
  "evo-grand-lite": "xe-may-evo-grand-lite",
  drgnfly: "xe-may-drgnfly",
  "evo-lite-neo": "xe-may-evo-lite-neo",
};

export function defaultCarSlug(id: string): string {
  return CAR_SLUG_MAP[id] ?? `vinfast-${slugify(id)}`;
}

export function defaultScooterSlug(id: string): string {
  return SCOOTER_SLUG_MAP[id] ?? `xe-may-${slugify(id)}`;
}

export function defaultAccessorySlug(id: string, name?: string): string {
  const fromName = name ? slugify(name) : "";
  const base = fromName || slugify(id);
  return base.startsWith("phu-kien-") ? base : `phu-kien-${base}`;
}

export function isValidSlug(value: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) && value.length >= 2 && value.length <= 120;
}

export function resolveProductSlug(
  row: { id: string; slug?: string | null },
  type: "car" | "scooter" | "accessory",
  name?: string,
): string {
  const fromDb = row.slug?.trim();
  if (fromDb && isValidSlug(fromDb)) return fromDb;
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
