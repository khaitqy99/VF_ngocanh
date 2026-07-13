"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, ArrowUpRight, Clock, Search } from "lucide-react";

import FloatingButtons from "@/components/site/FloatingButtons";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { IMAGES } from "@/lib/images";
import { HOTLINE, HOTLINE_TEL } from "@/lib/contact";
import { NEWS_PAGE_SIZE, paginateNews } from "@/lib/cms/news-publish";
import {
  formatNewsDate,
  getNewsCategoryLabel,
  NEWS_CATEGORIES,
  type NewsArticle,
} from "@/lib/cms/news-types";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { vfCardTitle, vfEyebrow } from "@/lib/typography";

const CAR_MODELS = [
  { label: "Tất cả dòng xe", href: "/oto" },
  { label: "VF 3", href: "/oto/vf3" },
  { label: "VF 5", href: "/oto/vf5" },
  { label: "VF 6", href: "/oto/vf6" },
  { label: "VF 7", href: "/oto/vf7" },
  { label: "VF 8", href: "/oto/vf8-all-new" },
  { label: "VF 9", href: "/oto/vf9" },
];

function NewsBreadcrumbBar() {
  return (
    <div className="border-b border-border/60 bg-background">
      <div className="container-vf py-3.5">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  href="/"
                  className="text-xs font-bold text-slate-500 transition-colors hover:text-brand"
                >
                  Trang chủ
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-xs font-extrabold text-brand-dark">
                Tin tức
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
}

function CategoryBadge({
  category,
  variant = "default",
}: {
  category: string | null;
  variant?: "default" | "on-dark";
}) {
  if (variant === "on-dark") {
    return (
      <span className="rounded-md bg-brand px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
        {getNewsCategoryLabel(category)}
      </span>
    );
  }

  return (
    <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-brand">
      {getNewsCategoryLabel(category)}
    </span>
  );
}

function NewsHighlightsSection({ main, side }: { main: NewsArticle | null; side: NewsArticle[] }) {
  if (!main) return null;

  return (
    <section className="section-y border-b border-border/60 bg-white">
      <div className="container-vf">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-5">
          <Link
            href={`/tin-tuc/${main.slug}`}
            className="group relative min-h-[320px] overflow-hidden rounded-xl bg-brand-dark shadow-card md:min-h-[420px]"
          >
            <Image
              src={main.coverImageUrl || IMAGES.showroom}
              alt={main.title}
              fill
              className="object-cover transition duration-700 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 66vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/95 via-brand-dark/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 md:p-8">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <CategoryBadge category={main.category} variant="on-dark" />
                {main.isFeatured ? (
                  <span className="rounded-md bg-accent-yellow/90 px-2.5 py-1 text-[10px] font-bold uppercase text-brand-dark">
                    Nổi bật
                  </span>
                ) : null}
              </div>
              <h3 className="text-xl font-extrabold leading-snug text-white md:text-2xl lg:text-3xl">
                {main.title}
              </h3>
              {main.excerpt ? (
                <p className="mt-3 line-clamp-2 max-w-2xl text-sm leading-relaxed text-white/80 md:text-base">
                  {main.excerpt}
                </p>
              ) : null}
            </div>
          </Link>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {side.map((article) => (
              <Link
                key={article.id}
                href={`/tin-tuc/${article.slug}`}
                className="group relative min-h-[180px] overflow-hidden rounded-xl bg-slate-100 shadow-soft lg:min-h-[200px]"
              >
                <Image
                  src={article.coverImageUrl || IMAGES.showroom}
                  alt={article.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/85 via-brand-dark/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <CategoryBadge category={article.category} variant="on-dark" />
                  <p className="mt-2 line-clamp-2 text-sm font-bold leading-snug text-white">
                    {article.title}
                  </p>
                </div>
              </Link>
            ))}
            {side.length === 0 ? (
              <div className="flex min-h-[180px] items-center justify-center rounded-xl border border-dashed border-border bg-surface-muted p-6 text-center text-sm text-muted-foreground lg:min-h-[200px]">
                Thêm bài viết để hiển thị tiêu điểm phụ
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function NewsListRow({ article }: { article: NewsArticle }) {
  return (
    <Link
      href={`/tin-tuc/${article.slug}`}
      className="group flex gap-4 border-b border-border/60 py-6 transition first:pt-0 last:border-b-0 hover:bg-surface-muted/40"
    >
      <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-lg bg-slate-100 ring-1 ring-black/5 sm:h-28 sm:w-40">
        <Image
          src={article.coverImageUrl || IMAGES.showroom}
          alt={article.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="160px"
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <CategoryBadge category={article.category} />
          {article.publishedAt ? (
            <span className="inline-flex items-center gap-1 font-medium">
              <Clock className="h-3.5 w-3.5 text-brand/70" />
              {formatNewsDate(article.publishedAt)}
            </span>
          ) : null}
        </div>
        <h3 className={`${vfCardTitle} line-clamp-2 transition group-hover:text-brand`}>
          {article.title}
        </h3>
        {article.excerpt ? (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {article.excerpt}
          </p>
        ) : null}
        <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand">
          Đọc tiếp
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

function NewsSidebar({ articles }: { articles: NewsArticle[] }) {
  const [carModel, setCarModel] = useState(CAR_MODELS[0]!.href);
  const mostRead = useMemo(
    () =>
      [...articles]
        .sort((a, b) => {
          const aTime = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
          const bTime = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
          return bTime - aTime;
        })
        .slice(0, 5),
    [articles],
  );

  return (
    <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
      <div className="overflow-hidden rounded-xl bg-brand-dark p-5 text-white shadow-card">
        <p className={vfEyebrow}>Tìm xe nhanh</p>
        <h3 className="mt-2 text-lg font-extrabold tracking-tight">Khám phá dòng xe VinFast</h3>
        <div className="mt-4 space-y-3">
          <select
            value={carModel}
            onChange={(e) => setCarModel(e.target.value)}
            className="h-10 w-full rounded-lg border border-white/15 bg-white/10 px-3 text-sm text-white outline-none focus:border-brand focus:ring-1 focus:ring-brand"
          >
            {CAR_MODELS.map((model) => (
              <option key={model.href} value={model.href} className="text-brand-dark">
                {model.label}
              </option>
            ))}
          </select>
          <Link
            href={carModel}
            className="flex h-10 w-full items-center justify-center rounded-lg bg-brand text-sm font-bold uppercase tracking-wide text-white transition hover:bg-blue-600"
          >
            Tìm kiếm
          </Link>
        </div>
      </div>

      <div className="page-section-card overflow-hidden">
        <div className="border-b border-border/60 px-5 py-4">
          <h3 className="text-sm font-black uppercase tracking-wide text-brand-dark">
            Đọc nhiều nhất
          </h3>
        </div>
        <ol className="divide-y divide-border/60">
          {mostRead.length === 0 ? (
            <li className="px-5 py-6 text-sm text-muted-foreground">Chưa có bài viết.</li>
          ) : (
            mostRead.map((article, index) => (
              <li key={article.id}>
                <Link
                  href={`/tin-tuc/${article.slug}`}
                  className="flex gap-3 px-5 py-4 transition hover:bg-surface-muted/60"
                >
                  <span className="text-2xl font-black leading-none text-brand/15">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="line-clamp-2 text-sm font-semibold leading-snug text-brand-dark">
                      {article.title}
                    </span>
                    {article.publishedAt ? (
                      <span className="mt-1 block text-xs text-muted-foreground">
                        {formatNewsDate(article.publishedAt)}
                      </span>
                    ) : null}
                  </span>
                </Link>
              </li>
            ))
          )}
        </ol>
      </div>

      <Link
        href="/oto"
        className="group relative block min-h-[280px] overflow-hidden rounded-xl bg-brand-dark shadow-card"
      >
        <Image
          src={IMAGES.showroom}
          alt="Ưu đãi VinFast Ngọc Anh Cà Mau"
          fill
          className="object-cover opacity-60 transition duration-500 group-hover:scale-105"
          sizes="320px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/50 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <span className="rounded-md bg-accent-yellow px-2 py-1 text-[10px] font-bold uppercase text-brand-dark">
            Ưu đãi
          </span>
          <h3 className="mt-3 text-xl font-extrabold leading-snug text-white">
            Đăng ký lái thử xe điện VinFast
          </h3>
          <p className="mt-2 text-sm text-white/75">Trải nghiệm trực tiếp tại showroom Cà Mau</p>
          <span className="mt-4 inline-flex items-center gap-1 rounded-full bg-white px-4 py-2 text-sm font-bold text-brand-dark">
            Nhận ưu đãi
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </Link>

      <Link
        href={HOTLINE_TEL}
        className="page-section-card block p-5 text-center transition hover:shadow-card"
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Tư vấn nhanh
        </p>
        <p className="mt-1 text-lg font-extrabold text-brand">{HOTLINE}</p>
      </Link>
    </aside>
  );
}

export default function NewsListPage({ articles }: { articles: NewsArticle[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [page, setPage] = useState(1);

  const highlightMain = useMemo(
    () => articles.find((article) => article.isFeatured) ?? articles[0] ?? null,
    [articles],
  );

  const highlightSide = useMemo(() => {
    if (!highlightMain) return [];
    return articles.filter((article) => article.id !== highlightMain.id).slice(0, 2);
  }, [articles, highlightMain]);

  const highlightIds = useMemo(
    () => new Set([highlightMain?.id, ...highlightSide.map((a) => a.id)].filter(Boolean)),
    [highlightMain, highlightSide],
  );

  const filtered = useMemo(() => {
    return articles
      .filter((article) => !highlightIds.has(article.id))
      .filter((article) => {
        if (category !== "all" && article.category !== category) return false;
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          article.title.toLowerCase().includes(q) ||
          (article.excerpt?.toLowerCase().includes(q) ?? false)
        );
      });
  }, [articles, category, search, highlightIds]);

  const paged = useMemo(() => paginateNews(filtered, page, NEWS_PAGE_SIZE), [filtered, page]);

  return (
    <div className="relative min-h-screen bg-background font-sans text-foreground antialiased">
      <main>
        <NewsBreadcrumbBar />

        <section className="border-b border-border/60 bg-white py-8 md:py-10">
          <div className="container-vf">
            <SectionHeader
              eyebrow="VinFast Ngọc Anh Cà Mau"
              title="Tin tức & sự kiện"
              description="Cập nhật khuyến mãi, sự kiện lái thử, công nghệ xe điện và hoạt động tại đại lý VinFast 3S Cà Mau."
              align="editorial"
              className="mb-0"
            />
          </div>
        </section>

        {articles.length > 0 ? (
          <NewsHighlightsSection main={highlightMain} side={highlightSide} />
        ) : null}

        <section className="section-y bg-surface-muted">
          <div className="container-vf">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-10 xl:grid-cols-[minmax(0,1fr)_340px]">
              <div className="min-w-0">
                <div className="page-section-card overflow-hidden">
                  <div className="border-b border-border/60 px-4 pt-4 sm:px-6">
                    <div className="mb-4">
                      <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          value={search}
                          onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                          }}
                          placeholder="Tìm tin tức..."
                          className="border-border bg-white pl-9"
                        />
                      </div>
                    </div>

                    <div className="flex gap-1 overflow-x-auto pb-px [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      <button
                        type="button"
                        onClick={() => {
                          setCategory("all");
                          setPage(1);
                        }}
                        className={`shrink-0 border-b-2 px-3 py-3 text-sm font-semibold transition ${
                          category === "all"
                            ? "border-brand text-brand"
                            : "border-transparent text-muted-foreground hover:text-brand-dark"
                        }`}
                      >
                        Tất cả
                      </button>
                      {NEWS_CATEGORIES.map((cat) => (
                        <button
                          key={cat.value}
                          type="button"
                          onClick={() => {
                            setCategory(cat.value);
                            setPage(1);
                          }}
                          className={`shrink-0 border-b-2 px-3 py-3 text-sm font-semibold transition ${
                            category === cat.value
                              ? "border-brand text-brand"
                              : "border-transparent text-muted-foreground hover:text-brand-dark"
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="px-4 sm:px-6">
                    {filtered.length === 0 && articles.length === 0 ? (
                      <div className="py-16 text-center text-sm text-muted-foreground">
                        Chưa có bài viết nào.
                      </div>
                    ) : filtered.length === 0 ? (
                      <div className="py-16 text-center text-sm text-muted-foreground">
                        Không tìm thấy bài viết phù hợp.
                      </div>
                    ) : (
                      <>
                        {paged.items.map((article) => (
                          <NewsListRow key={article.id} article={article} />
                        ))}

                        {paged.totalPages > 1 ? (
                          <div className="flex items-center justify-center gap-2 border-t border-border/60 py-6">
                            <button
                              type="button"
                              disabled={page <= 1}
                              onClick={() => setPage((current) => Math.max(1, current - 1))}
                              className="rounded-full border border-border px-4 py-2 text-sm font-medium text-brand-dark transition hover:border-brand hover:text-brand disabled:opacity-40"
                            >
                              Trước
                            </button>
                            <span className="px-3 text-sm text-muted-foreground">
                              Trang {paged.page} / {paged.totalPages}
                            </span>
                            <button
                              type="button"
                              disabled={page >= paged.totalPages}
                              onClick={() =>
                                setPage((current) => Math.min(paged.totalPages, current + 1))
                              }
                              className="rounded-full border border-border px-4 py-2 text-sm font-medium text-brand-dark transition hover:border-brand hover:text-brand disabled:opacity-40"
                            >
                              Sau
                            </button>
                          </div>
                        ) : null}
                      </>
                    )}
                  </div>
                </div>
              </div>

              <NewsSidebar articles={articles} />
            </div>
          </div>
        </section>
      </main>

      <FloatingButtons />
    </div>
  );
}
