"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Calendar, Clock, User } from "lucide-react";

import { ArticleBody } from "@/components/news/ArticleBody";
import { IMAGES } from "@/lib/images";
import { formatPrice } from "@/lib/cars";
import {
  formatNewsDate,
  getNewsCategoryLabel,
  type NewsArticle,
  type ResolvedNewsProduct,
} from "@/lib/cms/news-types";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { vfCardTitle, vfHeroTitle } from "@/lib/typography";

function RelatedArticleCard({ item }: { item: NewsArticle }) {
  return (
    <Link
      href={`/tin-tuc/${item.slug}`}
      className="page-section-card group overflow-hidden transition hover:-translate-y-0.5 hover:shadow-card"
    >
      <div className="relative aspect-[16/10] bg-slate-100">
        <Image
          src={item.coverImageUrl || IMAGES.showroom}
          alt={item.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="p-4">
        <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="rounded-full bg-brand/10 px-2 py-0.5 font-bold uppercase tracking-wide text-brand">
            {getNewsCategoryLabel(item.category)}
          </span>
          {item.publishedAt ? (
            <span className="inline-flex items-center gap-1 font-medium">
              <Clock className="h-3.5 w-3.5" />
              {formatNewsDate(item.publishedAt)}
            </span>
          ) : null}
        </div>
        <h3 className={`${vfCardTitle} line-clamp-2 transition group-hover:text-brand`}>
          {item.title}
        </h3>
        {item.excerpt ? (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {item.excerpt}
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

export default function NewsDetailPage({
  article,
  related,
  relatedProducts,
}: {
  article: NewsArticle;
  related: NewsArticle[];
  relatedProducts: ResolvedNewsProduct[];
}) {
  const cover = article.coverImageUrl || IMAGES.showroom;

  return (
    <div className="relative min-h-screen bg-background font-sans text-foreground antialiased">
      <section className="border-b border-border/60 bg-background py-3.5">
        <div className="container-vf">
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
                <BreadcrumbLink asChild>
                  <Link
                    href="/tin-tuc"
                    className="text-xs font-bold text-slate-500 transition-colors hover:text-brand"
                  >
                    Tin tức
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-xs font-extrabold text-brand-dark line-clamp-1">
                  {article.title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </section>

      <article className="container-vf section-y">
        <Link
          href="/tin-tuc"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-brand"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại tin tức
        </Link>

        <div className="mx-auto max-w-4xl">
          <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand">
              {getNewsCategoryLabel(article.category)}
            </span>
            {article.publishedAt ? (
              <span className="inline-flex items-center gap-1.5 font-medium">
                <Calendar className="h-4 w-4 text-brand/70" />
                {formatNewsDate(article.publishedAt)}
              </span>
            ) : null}
            {article.authorName ? (
              <span className="inline-flex items-center gap-1.5 font-medium">
                <User className="h-4 w-4 text-brand/70" />
                {article.authorName}
              </span>
            ) : null}
          </div>

          <h1 className={vfHeroTitle}>{article.title}</h1>

          {article.excerpt ? (
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{article.excerpt}</p>
          ) : null}

          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-xl bg-slate-100 shadow-card ring-1 ring-black/5">
            <Image
              src={cover}
              alt={article.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 896px"
              priority
            />
          </div>

          <div className="mt-10">
            {article.body ? (
              <ArticleBody body={article.body} bodyFormat={article.bodyFormat} />
            ) : null}
          </div>
        </div>

        {relatedProducts.length > 0 ? (
          <section className="mx-auto mt-16 max-w-4xl border-t border-border/60 pt-10">
            <h2 className="text-xl font-extrabold text-brand-dark">Sản phẩm liên quan</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((product) => (
                <Link
                  key={`${product.type}-${product.id}`}
                  href={product.href}
                  className="page-section-card overflow-hidden transition hover:-translate-y-0.5 hover:shadow-card"
                >
                  <div className="relative aspect-[4/3] bg-surface-muted">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain p-3"
                    />
                  </div>
                  <div className="p-4">
                    <p className="font-semibold text-brand-dark">{product.name}</p>
                    {product.price ? (
                      <p className="mt-1 text-sm font-bold text-brand">
                        {formatPrice(product.price)} VNĐ
                      </p>
                    ) : null}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        {related.length > 0 ? (
          <section className="mx-auto mt-16 max-w-4xl border-t border-border/60 pt-10">
            <h2 className="text-xl font-extrabold text-brand-dark">Bài viết liên quan</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Các tin tức khác bạn có thể quan tâm
            </p>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <RelatedArticleCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        ) : null}
      </article>
    </div>
  );
}
