import type { Json } from "@vinfast3s/supabase";
import type { CarColor } from "@/lib/car-details";

const VF8_ALL_NEW_GALLERY = "/images/vinfast/gallery/vf8-all-new";
const VF8_ALL_NEW_HOTLINK_MAP: Record<string, string> = {
  "VF8PH-13": `${VF8_ALL_NEW_GALLERY}/product-CE1M.webp`,
  "VF8PH-15": `${VF8_ALL_NEW_GALLERY}/product-CE18.webp`,
  "VF8PH-21": `${VF8_ALL_NEW_GALLERY}/product-CE11.webp`,
  "VF8PH-17": `${VF8_ALL_NEW_GALLERY}/product-CE17.webp`,
  "VF8PH-19": `${VF8_ALL_NEW_GALLERY}/product-CE1V.webp`,
  "VF8PH-23": `${VF8_ALL_NEW_GALLERY}/product-1V18.webp`,
};

function uniquePaths(paths: string[]): string[] {
  return [...new Set(paths.filter(Boolean))];
}

/** VinFast chặn hotlink ảnh từ domain của họ (403). */
export function isBlockedHotlink(url: string): boolean {
  if (!url.startsWith("http")) return false;
  try {
    const host = new URL(url).hostname;
    return host === "vinfastauto.com" || host.endsWith(".vinfastauto.com");
  } catch {
    return false;
  }
}

/** Map URL hotlink VinFast sang ảnh local đã mirror (nếu có). */
export function localizeVinfastHotlink(
  url: string | undefined,
  vehicleId: string,
): string | undefined {
  if (!url || !isBlockedHotlink(url)) return url;
  if (vehicleId === "vf8-all-new") {
    for (const [code, local] of Object.entries(VF8_ALL_NEW_HOTLINK_MAP)) {
      if (url.includes(code)) return local;
    }
    return `${VF8_ALL_NEW_GALLERY}/PDP-vf8-img-top.webp`;
  }
  return undefined;
}

/** Chuẩn hóa danh sách ảnh cho thư viện admin — bỏ hotlink, thêm fallback local. */
export function resolveVehicleMediaPaths(
  vehicleId: string,
  fromDb: string[] | undefined,
  fallbackPaths: string[],
): string[] {
  const localized = (fromDb ?? [])
    .map((url) => localizeVinfastHotlink(url, vehicleId) ?? url)
    .filter((url) => !isBlockedHotlink(url));

  const fallback = fallbackPaths.filter((url) => !isBlockedHotlink(url));
  return uniquePaths([...localized, ...fallback]);
}

export function asStringArray(value: Json | null | undefined): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === "string" && v.length > 0);
}

/** Bỏ URL hotlink bị chặn; giữ Supabase Storage / local path. */
export function sanitizeImageUrls(urls: string[], fallback = ""): string[] {
  const out: string[] = [];
  for (const url of urls) {
    if (isBlockedHotlink(url)) continue;
    if (!out.includes(url)) out.push(url);
  }
  if (!out.length && fallback && !isBlockedHotlink(fallback)) {
    out.push(fallback);
  }
  return out;
}

type DbColor = { name?: string; hex?: string; image?: string };

export function parseDbColors(colorsJson: Json | null | undefined): CarColor[] {
  if (!Array.isArray(colorsJson)) return [];
  return colorsJson
    .filter((c): c is DbColor => Boolean(c) && typeof c === "object" && !Array.isArray(c))
    .map((c, i) => ({
      id: `color-${i}`,
      name: String(c.name ?? ""),
      hex: String(c.hex ?? "#000000"),
      image:
        c.image && typeof c.image === "string" && !isBlockedHotlink(c.image) ? c.image : undefined,
    }));
}

/** Gallery từ cột `vehicles.gallery`, fallback `content.detail.gallery`. */
export function resolveVehicleGallery(
  rowGallery: Json | null | undefined,
  detailGallery: string[] | undefined,
  heroImage: string,
): string[] {
  const fromDb = sanitizeImageUrls(asStringArray(rowGallery), heroImage);
  if (fromDb.length) return fromDb;
  return sanitizeImageUrls(detailGallery ?? [], heroImage);
}
