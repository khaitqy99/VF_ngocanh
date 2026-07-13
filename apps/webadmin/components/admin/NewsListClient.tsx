"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Calendar, ExternalLink, FileText, Plus, Search, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { useToast } from "@/components/admin/ToastProvider";
import { Badge, Button, Card, Input } from "@/components/ui/core";
import { clientAssetUrl } from "@/lib/product-utils";
import { getPublishStatusLabel } from "@webclient/lib/cms/news-publish";
import {
  formatNewsDate,
  getNewsCategoryLabel,
  type NewsArticle,
  type PublishStatus,
} from "@webclient/lib/cms/news-types";

const STATUS_LABELS: Record<PublishStatus, string> = {
  draft: "Nháp",
  published: "Đã đăng",
  archived: "Lưu trữ",
  scheduled: "Lên lịch",
};

const FALLBACK_COVER = "/images/vinfast/showroom.webp";

function statusVariant(status: PublishStatus): "default" | "secondary" | "outline" {
  if (status === "published") return "default";
  if (status === "draft") return "secondary";
  if (status === "scheduled") return "outline";
  return "outline";
}

function NewsArticleCard({
  article,
  siteUrl,
  onEdit,
  onDelete,
}: {
  article: NewsArticle;
  siteUrl: string;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const cover = article.coverImageUrl || FALLBACK_COVER;

  return (
    <Card className="group flex h-full flex-col overflow-hidden transition-shadow hover:shadow-md">
      <Link href={`/admin/posts/${article.id}`} className="relative block aspect-[16/10] overflow-hidden bg-zinc-100">
        <Image
          src={clientAssetUrl(cover)}
          alt={article.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <Badge variant={statusVariant(article.status)} className="shadow-sm">
            {STATUS_LABELS[article.status] ?? getPublishStatusLabel(article.status)}
          </Badge>
          {article.isFeatured ? (
            <Badge variant="secondary" className="bg-white/90 shadow-sm">
              Nổi bật
            </Badge>
          ) : null}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2">
          <Badge variant="outline">{getNewsCategoryLabel(article.category)}</Badge>
        </div>

        <Link
          href={`/admin/posts/${article.id}`}
          className="line-clamp-2 text-base font-semibold leading-snug text-zinc-900 transition hover:text-red-600"
        >
          {article.title}
        </Link>

        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-zinc-500">
          {article.excerpt || "Chưa có mô tả ngắn"}
        </p>

        <div className="mt-3 space-y-1 border-t border-zinc-100 pt-3 text-xs text-zinc-400">
          <p className="truncate font-mono">/tin-tuc/{article.slug}</p>
          {article.publishedAt ? (
            <p className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formatNewsDate(article.publishedAt)}
            </p>
          ) : null}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {article.status === "published" ? (
            <Link
              href={`${siteUrl}/tin-tuc/${article.slug}`}
              target="_blank"
              className="inline-flex h-8 flex-1 items-center justify-center gap-1 rounded-md border border-zinc-200 px-3 text-xs font-medium hover:bg-zinc-50 sm:flex-none"
            >
              Xem
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          ) : null}
          <Button type="button" variant="outline" size="sm" className="flex-1 sm:flex-none" onClick={onEdit}>
            Sửa
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={onDelete}>
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

export function NewsListClient() {
  const router = useRouter();
  const { toast } = useToast();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<PublishStatus | "all">("all");
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

  useEffect(() => {
    fetch("/api/news", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => setArticles(data.articles ?? []))
      .catch(() => toast("Không tải được danh sách tin tức"))
      .finally(() => setLoading(false));
  }, [toast]);

  const filtered = useMemo(() => {
    return articles.filter((article) => {
      if (statusFilter !== "all" && article.status !== statusFilter) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        article.title.toLowerCase().includes(q) ||
        (article.excerpt?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [articles, search, statusFilter]);

  const handleDelete = async (article: NewsArticle) => {
    if (!confirm(`Xóa bài "${article.title}"?`)) return;
    const response = await fetch(`/api/news/${article.id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!response.ok) {
      const data = await response.json().catch(() => null);
      toast(data?.error ?? "Xóa thất bại");
      return;
    }
    setArticles((prev) => prev.filter((a) => a.id !== article.id));
    toast("Đã xóa bài viết");
  };

  return (
    <div>
      <PageHeader
        title="Tin tức"
        description="Quản lý bài viết hiển thị trên trang /tin-tuc"
        action={
          <Button onClick={() => router.push("/admin/posts/new")}>
            <Plus className="mr-1.5 h-4 w-4" />
            Viết bài mới
          </Button>
        }
      />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tiêu đề..."
            className="pl-9"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as PublishStatus | "all")}
          className="h-9 rounded-md border border-zinc-200 bg-white px-3 text-sm"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="draft">Nháp</option>
          <option value="published">Đã đăng</option>
          <option value="scheduled">Lên lịch</option>
          <option value="archived">Lưu trữ</option>
        </select>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <Card key={item} className="h-[380px] animate-pulse bg-zinc-50" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <div className="flex flex-col items-center gap-3 p-12 text-center">
            <FileText className="h-10 w-10 text-zinc-300" />
            <p className="text-sm text-zinc-500">
              Chưa có bài viết nào. Bấm &quot;Viết bài mới&quot; để bắt đầu.
            </p>
            <Button size="sm" onClick={() => router.push("/admin/posts/new")}>
              <Plus className="mr-1.5 h-4 w-4" />
              Viết bài mới
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((article) => (
            <NewsArticleCard
              key={article.id}
              article={article}
              siteUrl={siteUrl}
              onEdit={() => router.push(`/admin/posts/${article.id}`)}
              onDelete={() => handleDelete(article)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
