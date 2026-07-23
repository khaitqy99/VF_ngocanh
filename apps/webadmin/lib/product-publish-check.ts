import type { Json, Tables } from "@vinfast3s/supabase";
import { PRODUCT_PLACEHOLDER_IMAGE } from "@/lib/product-api";

export type PublishCheckItem = {
  id: string;
  label: string;
};

const PLACEHOLDER_MARKERS = [
  PRODUCT_PLACEHOLDER_IMAGE,
  "/images/vinfast/showroom.webp",
  "/images/showroom.webp",
];

export function isPlaceholderImage(url: string | null | undefined): boolean {
  if (!url?.trim()) return true;
  const normalized = url.trim().toLowerCase();
  return PLACEHOLDER_MARKERS.some((marker) => normalized.includes(marker.replace(/^\//, "").toLowerCase()));
}

function galleryHasRealImages(gallery: Json | null | undefined): boolean {
  if (!Array.isArray(gallery)) return false;
  return gallery.some((item) => typeof item === "string" && !isPlaceholderImage(item));
}

function seoIsIncomplete(
  seo: Json | null | undefined,
  options?: { productImage?: string | null },
): boolean {
  if (!seo || typeof seo !== "object" || Array.isArray(seo)) return true;
  const record = seo as Record<string, unknown>;
  const title =
    (typeof record.metaTitle === "string" && record.metaTitle.trim()) ||
    (typeof record.title === "string" && record.title.trim()) ||
    "";
  const description =
    (typeof record.metaDescription === "string" && record.metaDescription.trim()) ||
    (typeof record.description === "string" && record.description.trim()) ||
    "";
  if (!title || !description) return true;

  const ogImage =
    typeof record.ogImage === "string" && record.ogImage.trim() ? record.ogImage.trim() : "";
  if (ogImage) return false;
  // OG image optional when the product already has a real hero/gallery image.
  if (options?.productImage && !isPlaceholderImage(options.productImage)) return false;
  return true;
}

export function buildVehiclePublishCheck(row: Tables<"vehicles">): PublishCheckItem[] {
  const issues: PublishCheckItem[] = [];

  if (isPlaceholderImage(row.hero_image_url)) {
    issues.push({
      id: "hero",
      label: "Ảnh đại diện vẫn là ảnh mặc định — cần upload ảnh thật",
    });
  }

  if (!row.starting_price || row.starting_price <= 0) {
    issues.push({ id: "price", label: "Giá bán chưa được thiết lập (bằng 0 hoặc trống)" });
  }

  if (!galleryHasRealImages(row.gallery)) {
    issues.push({ id: "gallery", label: "Gallery chưa có ảnh sản phẩm" });
  }

  if (
    seoIsIncomplete(row.seo, {
      productImage: !isPlaceholderImage(row.hero_image_url)
        ? row.hero_image_url
        : Array.isArray(row.gallery)
          ? (row.gallery.find(
              (item): item is string => typeof item === "string" && !isPlaceholderImage(item),
            ) ?? null)
          : null,
    })
  ) {
    issues.push({
      id: "seo",
      label: "SEO chưa điền đầy đủ (tiêu đề, mô tả, và OG image nếu chưa có ảnh sản phẩm)",
    });
  }

  return issues;
}

export function buildAccessoryPublishCheck(row: Tables<"accessories">): PublishCheckItem[] {
  const issues: PublishCheckItem[] = [];

  if (isPlaceholderImage(row.image_url)) {
    issues.push({
      id: "hero",
      label: "Ảnh phụ kiện vẫn là ảnh mặc định — cần upload ảnh thật",
    });
  }

  if (!row.price || row.price <= 0) {
    issues.push({ id: "price", label: "Giá phụ kiện chưa được thiết lập (bằng 0 hoặc trống)" });
  }

  const content =
    row.content && typeof row.content === "object" && !Array.isArray(row.content)
      ? (row.content as Record<string, unknown>)
      : null;
  const seo = content?.seo;
  if (seoIsIncomplete(seo as Json | undefined, { productImage: row.image_url })) {
    issues.push({
      id: "seo",
      label: "SEO chưa điền đầy đủ (tiêu đề, mô tả, và OG image nếu chưa có ảnh sản phẩm)",
    });
  }

  return issues;
}

export function vehicleMissingRealImage(row: Tables<"vehicles">): boolean {
  return isPlaceholderImage(row.hero_image_url) && !galleryHasRealImages(row.gallery);
}

export function accessoryMissingRealImage(row: Tables<"accessories">): boolean {
  return isPlaceholderImage(row.image_url);
}
