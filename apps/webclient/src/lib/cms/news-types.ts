import type { SeoRecord } from "@/lib/seo/types";

export type PublishStatus = "draft" | "published" | "archived" | "scheduled";

export type NewsBodyFormat = "plain" | "html";

export type NewsRelatedProduct = {
  type: "car" | "scooter" | "accessory";
  id: string;
};

export type NewsArticle = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string | null;
  bodyFormat: NewsBodyFormat;
  category: string | null;
  coverImageUrl: string | null;
  status: PublishStatus;
  publishedAt: string | null;
  isFeatured: boolean;
  seo: SeoRecord;
  relatedProducts: NewsRelatedProduct[];
  authorId: string | null;
  authorName: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ResolvedNewsProduct = {
  type: NewsRelatedProduct["type"];
  id: string;
  name: string;
  image: string;
  href: string;
  price?: number;
};

export const NEWS_CATEGORIES = [
  { value: "promotion", label: "Khuyến mãi" },
  { value: "event", label: "Sự kiện" },
  { value: "technology", label: "Công nghệ" },
  { value: "dealership", label: "Đại lý" },
  { value: "after-sales", label: "Hậu mãi" },
  { value: "general", label: "Tin chung" },
] as const;

export function getNewsCategoryLabel(value: string | null | undefined): string {
  if (!value) return "Tin chung";
  return NEWS_CATEGORIES.find((c) => c.value === value)?.label ?? value;
}

export function formatNewsDate(iso: string | null | undefined): string {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}

export function parseNewsRelatedProducts(value: unknown): NewsRelatedProduct[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== "object" || Array.isArray(item)) return null;
      const row = item as Record<string, unknown>;
      const type = row.type;
      const id = row.id;
      if (
        (type === "car" || type === "scooter" || type === "accessory") &&
        typeof id === "string" &&
        id.trim()
      ) {
        return { type, id: id.trim() };
      }
      return null;
    })
    .filter((item): item is NewsRelatedProduct => item !== null);
}
