"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { ArrowRight, Clock } from "lucide-react";

import { CatalogGrid, CatalogGridItem } from "@/components/motion";
import { HomeSectionHeader } from "@/components/home/HomeSectionHeader";
import { IMAGES } from "@/lib/images";
import type { HomeSectionsContent } from "@/lib/cms/home-content";
import { formatNewsDate, getNewsCategoryLabel, type NewsArticle } from "@/lib/cms/news-types";
import { vfCardTitle } from "@/lib/typography";

function CategoryBadge({ category }: { category: string | null }) {
  return (
    <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-brand">
      {getNewsCategoryLabel(category)}
    </span>
  );
}

function ReadMoreLink({ className = "mt-4" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-sm font-semibold text-brand ${className}`}
    >
      Đọc tiếp
      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
    </span>
  );
}

function FeaturedNewsCard({ article }: { article: NewsArticle }) {
  return (
    <Link
      href={`/tin-tuc/${article.slug}`}
      className="page-section-card group grid overflow-hidden transition hover:-translate-y-0.5 hover:shadow-card lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]"
    >
      <div className="relative min-h-[240px] bg-slate-100 lg:min-h-[320px]">
        <Image
          src={article.coverImageUrl || IMAGES.showroom}
          alt={article.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 1024px) 100vw, 55vw"
          priority
        />
      </div>

      <div className="flex flex-col justify-center p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <CategoryBadge category={article.category} />
          {article.publishedAt ? (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
              <Clock className="h-3.5 w-3.5 text-brand/70" />
              {formatNewsDate(article.publishedAt)}
            </span>
          ) : null}
        </div>

        <h3 className="mt-4 text-xl font-extrabold leading-snug text-brand-dark transition group-hover:text-brand md:text-2xl">
          {article.title}
        </h3>

        {article.excerpt ? (
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground md:text-base">
            {article.excerpt}
          </p>
        ) : null}

        <ReadMoreLink />
      </div>
    </Link>
  );
}

function NewsGridCard({ article, index }: { article: NewsArticle; index: number }) {
  return (
    <CatalogGridItem index={index} inView>
      <Link
        href={`/tin-tuc/${article.slug}`}
        className="page-section-card group flex h-full flex-col overflow-hidden transition hover:-translate-y-0.5 hover:shadow-card"
      >
        <div className="relative aspect-[16/10] bg-slate-100">
          <Image
            src={article.coverImageUrl || IMAGES.showroom}
            alt={article.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
        </div>

        <div className="flex flex-1 flex-col p-4">
          <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
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
            <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
              {article.excerpt}
            </p>
          ) : (
            <div className="flex-1" />
          )}

          <ReadMoreLink className="mt-3" />
        </div>
      </Link>
    </CatalogGridItem>
  );
}

export function HomeNewsSection({
  articles,
  section,
}: {
  articles: NewsArticle[];
  section: HomeSectionsContent["news"];
}) {
  const { featured, gridArticles } = useMemo(() => {
    if (!articles.length) return { featured: null, gridArticles: [] as NewsArticle[] };
    const main = articles.find((article) => article.isFeatured) ?? articles[0]!;
    const rest = articles.filter((article) => article.id !== main.id).slice(0, 4);
    return { featured: main, gridArticles: rest };
  }, [articles]);

  if (!featured) return null;

  return (
    <section className="section-y bg-white">
      <div className="container-vf">
        <HomeSectionHeader
          eyebrow={section.eyebrow}
          title={section.title}
          viewAllHref={section.viewAllHref}
        />

        <FeaturedNewsCard article={featured} />

        {gridArticles.length > 0 ? (
          <CatalogGrid className="mt-6 grid grid-cols-1 items-stretch gap-3 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4">
            {gridArticles.map((article, index) => (
              <NewsGridCard key={article.id} article={article} index={index} />
            ))}
          </CatalogGrid>
        ) : null}
      </div>
    </section>
  );
}
