import { unstable_cache } from "next/cache";
import { createAnonClient } from "@vinfast3s/supabase/anon";
import { createAdminClient } from "@vinfast3s/supabase/admin";
import { isSupabaseConfigured } from "@vinfast3s/supabase";
import { getOrSetCache } from "@/lib/cache";
import { mapNewsRow } from "@/lib/cms/news-mappers";
import type { NewsArticle } from "@/lib/cms/news-types";
import { MOCK_NEWS } from "@/lib/mock-news";
import {
  isNewsVisibleOnSite,
  NEWS_PAGE_SIZE,
  paginateNews,
  sortNewsForList,
} from "@/lib/cms/news-publish";
import { resolveNewsRelatedProducts } from "@/lib/cms/news-related";

export const CMS_NEWS_TAG = "cms-news";

export type NewsListResult = {
  articles: NewsArticle[];
  featured: NewsArticle | null;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

async function promoteDueScheduledArticles() {
  if (!isSupabaseConfigured()) return;
  const admin = createAdminClient();
  const now = new Date().toISOString();
  await admin
    .from("news_articles")
    .update({ status: "published" })
    .eq("status", "scheduled")
    .lte("published_at", now);
}

export async function fetchPublishedNews(): Promise<NewsArticle[]> {
  await promoteDueScheduledArticles();

  return getOrSetCache("cms:news:list", 60, async () => {
    const supabase = createAnonClient();
    const { data, error } = await supabase
      .from("news_articles")
      .select("*")
      .in("status", ["published", "scheduled"])
      .order("published_at", { ascending: false, nullsFirst: false });

    if (error) throw new Error(error.message);
    return (data ?? []).map(mapNewsRow).filter(isNewsVisibleOnSite).sort(sortNewsForList);
  });
}

export const getNewsArticles = unstable_cache(
  async (): Promise<NewsArticle[]> => {
    if (!isSupabaseConfigured()) return MOCK_NEWS;
    try {
      return await fetchPublishedNews();
    } catch (error) {
      console.error("[cms/news] fetch failed:", error);
      return [];
    }
  },
  ["cms-news-list"],
  { revalidate: 60, tags: [CMS_NEWS_TAG] },
);

export async function getNewsArticlesPage(page = 1): Promise<NewsListResult> {
  const all = await getNewsArticles();
  const featured = all.find((article) => article.isFeatured) ?? null;
  const list = featured ? all.filter((article) => article.id !== featured.id) : all;
  const paged = paginateNews(list, page, NEWS_PAGE_SIZE);

  return {
    articles: paged.items,
    featured,
    total: list.length,
    page: paged.page,
    pageSize: paged.pageSize,
    totalPages: paged.totalPages,
  };
}

export const getNewsBySlug = unstable_cache(
  async (slug: string): Promise<NewsArticle | null> => {
    const articles = await getNewsArticles();
    return articles.find((a) => a.slug === slug) ?? null;
  },
  ["cms-news-by-slug"],
  { revalidate: 60, tags: [CMS_NEWS_TAG] },
);

export async function getNewsArticleWithRelated(slug: string) {
  const article = await getNewsBySlug(slug);
  if (!article) return null;

  const [articles, relatedProducts] = await Promise.all([
    getNewsArticles(),
    resolveNewsRelatedProducts(article.relatedProducts),
  ]);

  const others = articles.filter((item) => item.slug !== article.slug);
  const sameCategory = others.filter((item) => item.category === article.category);
  const fallback = others.filter((item) => item.category !== article.category);

  const related = [...sameCategory, ...fallback].slice(0, 3);

  return { article, related, relatedProducts };
}

export async function getFeaturedHomeNews(limit = 5, ids?: string[]): Promise<NewsArticle[]> {
  const articles = await getNewsArticles();
  if (ids?.length) {
    const picked = ids
      .map((id) => articles.find((article) => article.id === id))
      .filter((article): article is NewsArticle => Boolean(article));
    if (picked.length) return picked.slice(0, limit);
  }

  const featured = articles.find((article) => article.isFeatured);
  if (!featured) return articles.slice(0, limit);
  const rest = articles.filter((article) => article.id !== featured.id);
  return [featured, ...rest].slice(0, limit);
}
