import type { Json } from "@vinfast3s/supabase";
import type { CarColor } from "@/lib/car-details";

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
