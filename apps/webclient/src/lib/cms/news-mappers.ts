import type { Tables } from "@vinfast3s/supabase";
import { parseSeoRecord } from "@/lib/seo/resolve";
import type { NewsArticle } from "@/lib/cms/news-types";
import { parseNewsRelatedProducts } from "@/lib/cms/news-types";

type NewsRow = Tables<"news_articles"> & {
  seo?: unknown;
  is_featured?: boolean;
  related_products?: unknown;
  body_format?: string | null;
  author_name?: string | null;
};

export function mapNewsRow(row: NewsRow): NewsArticle {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    body: row.body,
    bodyFormat: row.body_format === "html" ? "html" : "plain",
    category: row.category,
    coverImageUrl: row.cover_image_url,
    coverImageAlt: row.cover_image_alt ?? null,
    status: row.status as NewsArticle["status"],
    publishedAt: row.published_at,
    isFeatured: Boolean(row.is_featured),
    seo: parseSeoRecord(row.seo),
    relatedProducts: parseNewsRelatedProducts(row.related_products),
    authorId: row.author_id,
    authorName: row.author_name ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
