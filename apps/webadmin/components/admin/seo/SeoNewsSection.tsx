"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, Newspaper } from "lucide-react";
import { getNewsCategoryLabel, type NewsArticle } from "@webclient/lib/cms/news-types";
import type { SeoRecord } from "@/lib/seo";
import { Card, CardContent } from "@/components/ui/core";

const STATUS_LABELS: Record<string, string> = {
  draft: "Nháp",
  published: "Đã đăng",
  scheduled: "Lên lịch",
  archived: "Lưu trữ",
};

function isSeoOptimized(seo: SeoRecord): boolean {
  return Boolean(seo.metaTitle?.trim() && seo.metaDescription?.trim());
}

export function SeoNewsSection() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [configured, setConfigured] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/news", { credentials: "include" })
      .then(async (response) => {
        const data = await response.json().catch(() => null);
        if (!response.ok) {
          throw new Error(data?.error ?? "Không tải được danh sách bài viết");
        }
        if (cancelled) return;
        setConfigured(data?.configured !== false);
        setArticles(Array.isArray(data?.articles) ? data.articles : []);
        setError(null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Không tải được danh sách bài viết");
        setArticles([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <p className="text-sm text-zinc-500">Đang tải danh sách bài viết…</p>;
  }

  if (!configured) {
    return (
      <p className="text-sm text-zinc-500">
        Database chưa được cấu hình nên chưa tải được danh sách bài viết.
      </p>
    );
  }

  if (error) {
    return <p className="text-sm text-red-600">Không tải được danh sách bài viết: {error}</p>;
  }

  if (articles.length === 0) {
    return (
      <Card>
        <div className="flex flex-col items-center gap-3 p-12 text-center">
          <FileText className="h-10 w-10 text-zinc-300" />
          <p className="text-sm text-zinc-500">
            Chưa có bài viết nào. Tạo bài viết ở mục Tin tức trước khi tối ưu SEO.
          </p>
          <Link href="/admin/posts" className="text-sm font-medium text-red-600 hover:underline">
            Đi tới Tin tức
          </Link>
        </div>
      </Card>
    );
  }

  const optimizedCount = articles.filter((article) => isSeoOptimized(article.seo)).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-zinc-500">
        <Newspaper className="h-4 w-4" />
        <span>
          {optimizedCount}/{articles.length} bài đã có meta title &amp; mô tả
        </span>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => {
          const optimized = isSeoOptimized(article.seo);
          return (
            <Card key={article.id} className="transition hover:border-red-200 hover:shadow-sm">
              <CardContent className="flex flex-col gap-3 p-4">
                <div className="min-w-0">
                  <p className="truncate font-medium text-zinc-900">{article.title}</p>
                  <p className="truncate text-xs text-zinc-500">/tin-tuc/{article.slug}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded bg-zinc-100 px-1.5 py-0.5 font-medium text-zinc-600">
                    {STATUS_LABELS[article.status] ?? article.status}
                  </span>
                  <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-zinc-600">
                    {getNewsCategoryLabel(article.category)}
                  </span>
                  <span
                    className={`rounded px-1.5 py-0.5 font-medium ${
                      optimized
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {optimized ? "Đã tối ưu SEO" : "Chưa tối ưu SEO"}
                  </span>
                </div>
                <div className="flex gap-3 text-xs">
                  <Link
                    href={`/admin/posts/${article.id}`}
                    className="font-medium text-zinc-600 hover:text-zinc-900"
                  >
                    Nội dung
                  </Link>
                  <Link
                    href={`/admin/posts/${article.id}?tab=seo`}
                    className="font-medium text-red-600 hover:underline"
                  >
                    SEO
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
