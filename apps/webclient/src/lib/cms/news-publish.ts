import type { NewsArticle, PublishStatus } from "@/lib/cms/news-types";

export const NEWS_PAGE_SIZE = 9;

export function isNewsVisibleOnSite(article: Pick<NewsArticle, "status" | "publishedAt">): boolean {
  if (article.status === "published") return true;
  if (article.status === "scheduled" && article.publishedAt) {
    return new Date(article.publishedAt).getTime() <= Date.now();
  }
  return false;
}

export function getPublishStatusLabel(status: PublishStatus): string {
  if (status === "draft") return "Nháp";
  if (status === "published") return "Đã đăng";
  if (status === "scheduled") return "Lên lịch";
  return "Lưu trữ";
}

export function sortNewsForList(a: NewsArticle, b: NewsArticle): number {
  if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
  const aTime = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
  const bTime = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
  return bTime - aTime;
}

export function paginateNews<T>(items: T[], page: number, pageSize = NEWS_PAGE_SIZE) {
  const safePage = Math.max(1, page);
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(safePage, totalPages);
  const start = (currentPage - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    total,
    page: currentPage,
    pageSize,
    totalPages,
  };
}
