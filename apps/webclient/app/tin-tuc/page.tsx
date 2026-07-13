import type { Metadata } from "next";

import NewsListPage from "@/components/news/NewsListPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { getNewsArticles } from "@/lib/cms/news";
import { buildBreadcrumbSchema } from "@/lib/seo/local-business";
import { buildStaticPageMetadata } from "@/lib/seo/page-metadata";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return buildStaticPageMetadata("news");
}

export default async function TinTucPage() {
  const articles = await getNewsArticles();

  const breadcrumb = buildBreadcrumbSchema([
    { name: "Trang chủ", path: "/" },
    { name: "Tin tức", path: "/tin-tuc" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} />
      <NewsListPage articles={articles} />
    </>
  );
}
