import type { Metadata } from "next";
import { notFound } from "next/navigation";

import NewsDetailPage from "@/components/news/NewsDetailPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { getNewsArticleWithRelated } from "@/lib/cms/news";
import { getSiteSeo } from "@/lib/cms/seo";
import { buildBreadcrumbSchema } from "@/lib/seo/local-business";
import { buildNewsArticleSchema } from "@/lib/seo/news-article-schema";
import { resolveSeoContent, seoToNextMetadata } from "@/lib/seo/resolve";

export const revalidate = 60;

export async function generateStaticParams() {
  const { getNewsArticles } = await import("@/lib/cms/news");
  const articles = await getNewsArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const payload = await getNewsArticleWithRelated(slug);
  if (!payload) return { title: "Không tìm thấy bài viết" };

  const { article } = payload;
  const site = await getSiteSeo();
  const defaults = {
    title: article.title,
    description: article.excerpt ?? article.title,
    image: article.coverImageUrl ?? "/images/showroom.webp",
    path: `/tin-tuc/${article.slug}`,
  };
  const resolved = resolveSeoContent(article.seo, defaults, site);
  return seoToNextMetadata(resolved, site);
}

export default async function TinTucDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const payload = await getNewsArticleWithRelated(slug);
  if (!payload) notFound();

  const { article, related, relatedProducts } = payload;

  const breadcrumb = buildBreadcrumbSchema([
    { name: "Trang chủ", path: "/" },
    { name: "Tin tức", path: "/tin-tuc" },
    { name: article.title, path: `/tin-tuc/${article.slug}` },
  ]);

  return (
    <>
      <JsonLd data={[breadcrumb, buildNewsArticleSchema(article)]} />
      <NewsDetailPage article={article} related={related} relatedProducts={relatedProducts} />
    </>
  );
}
