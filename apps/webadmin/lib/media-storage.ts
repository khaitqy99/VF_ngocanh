import type { MediaCategory } from "@/lib/media-library";

export const MEDIA_MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
};

export const MAX_MEDIA_UPLOAD_BYTES = 10 * 1024 * 1024;

export function mediaFolderStoragePrefix(category: MediaCategory, slug: string): string {
  switch (category) {
    case "cars":
      return `images/vinfast/gallery/${slug}`;
    case "scooters":
      return `images/vinfast/scooters/${slug}`;
    case "accessories":
      return `images/vinfast/accessories/${slug}`;
    case "news":
      return `images/news/${slug}`;
    case "pages":
      return `images/pages/${slug}`;
  }
}

export function sanitizeMediaFolderSlug(input: string): string {
  return (
    input
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9._-]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .toLowerCase() || "thu-muc"
  );
}

export function slugFromFolderName(name: string): string {
  return sanitizeMediaFolderSlug(name.trim());
}

export function sanitizeMediaFilename(name: string): string {
  const base = name.split(/[/\\]/).pop() ?? "image";
  const ext = base.includes(".") ? base.slice(base.lastIndexOf(".")) : "";
  const stem = ext ? base.slice(0, -ext.length) : base;
  const safeStem =
    stem
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9._-]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .toLowerCase() || "image";
  const safeExt = ext.toLowerCase().replace(/[^a-z0-9.]/g, "");
  return `${safeStem}${safeExt}`;
}

export function uniqueUploadStoragePath(folder: string, filename: string): string {
  const stamp = Date.now();
  const rand = Math.random().toString(36).slice(2, 8);
  return `${folder}/${stamp}-${rand}-${filename}`;
}

export function storagePathFromPublicUrl(url: string): string | null {
  const marker = "/storage/v1/object/public/media/";
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return decodeURIComponent(url.slice(idx + marker.length));
}

export function mimeFromFilename(filename: string): string {
  const ext = filename.includes(".") ? filename.slice(filename.lastIndexOf(".")).toLowerCase() : "";
  return MEDIA_MIME[ext] ?? "application/octet-stream";
}

export function resolveAccessoryMediaSlug(vehicles: string[]): string {
  return vehicles.length > 0 ? vehicles[0]! : "chung";
}