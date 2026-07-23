import type { Json, TablesUpdate } from "@vinfast3s/supabase";
import type { SeoRecord } from "@/lib/seo";
import type {
  NewsBodyFormat,
  NewsRelatedProduct,
  PublishStatus,
} from "@webclient/lib/cms/news-types";
import { parseNewsRelatedProducts } from "@webclient/lib/cms/news-types";

export type NewsPayload = {
  title?: string;
  slug?: string;
  excerpt?: string | null;
  body?: string | null;
  bodyFormat?: NewsBodyFormat;
  category?: string | null;
  coverImageUrl?: string | null;
  coverImageAlt?: string | null;
  status?: PublishStatus;
  publishedAt?: string | null;
  isFeatured?: boolean;
  seo?: SeoRecord;
  relatedProducts?: NewsRelatedProduct[];
  authorId?: string | null;
  authorName?: string | null;
};

export function resolvePublishedAtForStatus(
  status: PublishStatus,
  publishedAt: string | null | undefined,
  existingPublishedAt: string | null | undefined,
): string | null {
  if (status === "scheduled") {
    return publishedAt ?? existingPublishedAt ?? null;
  }
  if (status === "published") {
    return publishedAt ?? existingPublishedAt ?? new Date().toISOString();
  }
  return publishedAt ?? existingPublishedAt ?? null;
}

export async function clearOtherFeaturedArticles(
  admin: ReturnType<typeof import("@vinfast3s/supabase/admin").createAdminClient>,
  articleId?: string,
) {
  let query = admin.from("news_articles").update({ is_featured: false }).eq("is_featured", true);
  if (articleId) query = query.neq("id", articleId);
  await query;
}

export function buildNewsInsertRow(body: NewsPayload, slug: string) {
  const status = body.status ?? "draft";
  return {
    title: body.title!.trim(),
    slug,
    excerpt: body.excerpt ?? null,
    body: body.body ?? null,
    body_format: body.bodyFormat ?? "html",
    category: body.category ?? "general",
    cover_image_url: body.coverImageUrl ?? null,
    cover_image_alt: body.coverImageAlt ?? null,
    status,
    published_at: resolvePublishedAtForStatus(status, body.publishedAt, null),
    is_featured: Boolean(body.isFeatured),
    seo: (body.seo ?? {}) as Json,
    related_products: (body.relatedProducts ?? []) as Json,
    author_id: body.authorId ?? null,
    author_name: body.authorName ?? null,
  };
}

export function buildNewsPatchRow(
  body: NewsPayload,
  existing: { published_at: string | null; status: PublishStatus },
): TablesUpdate<"news_articles"> {
  const patch: TablesUpdate<"news_articles"> = {};

  if (body.title !== undefined) patch.title = body.title.trim();
  if (body.excerpt !== undefined) patch.excerpt = body.excerpt;
  if (body.body !== undefined) patch.body = body.body;
  if (body.bodyFormat !== undefined) patch.body_format = body.bodyFormat;
  if (body.category !== undefined) patch.category = body.category;
  if (body.coverImageUrl !== undefined) patch.cover_image_url = body.coverImageUrl;
  if (body.coverImageAlt !== undefined) patch.cover_image_alt = body.coverImageAlt;
  if (body.isFeatured !== undefined) patch.is_featured = body.isFeatured;
  if (body.seo !== undefined) patch.seo = body.seo as Json;
  if (body.relatedProducts !== undefined) {
    patch.related_products = parseNewsRelatedProducts(body.relatedProducts) as Json;
  }
  if (body.authorId !== undefined) patch.author_id = body.authorId;
  if (body.authorName !== undefined) patch.author_name = body.authorName;

  if (body.status !== undefined) {
    patch.status = body.status;
    patch.published_at = resolvePublishedAtForStatus(
      body.status,
      body.publishedAt,
      existing.published_at,
    );
  } else if (body.publishedAt !== undefined) {
    patch.published_at = body.publishedAt;
  }

  return patch;
}
