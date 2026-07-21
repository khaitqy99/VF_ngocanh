import { getNewsAuthorLabel, type NewsArticle } from "@/lib/cms/news-types";
import { PRODUCTION_SITE_URL, SITE_BRAND_NAME } from "@/lib/seo/types";
import { resolveSeoContent } from "@/lib/seo/resolve";

export function buildNewsArticleSchema(article: NewsArticle) {
  const defaults = {
    title: article.title,
    description: article.excerpt ?? article.title,
    image: article.coverImageUrl ?? "/images/showroom.webp",
    path: `/tin-tuc/${article.slug}`,
  };
  const seo = resolveSeoContent(article.seo, defaults);
  const imageUrl = seo.ogImage.startsWith("http")
    ? seo.ogImage
    : `${PRODUCTION_SITE_URL}${seo.ogImage}`;

  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: seo.title,
    description: seo.description,
    image: [imageUrl],
    datePublished: article.publishedAt ?? article.createdAt,
    dateModified: article.updatedAt,
    author: {
      "@type": "Person",
      name: getNewsAuthorLabel(article.authorName),
    },
    publisher: {
      "@type": "Organization",
      name: SITE_BRAND_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${PRODUCTION_SITE_URL}/images/vinfast/vinfast-logo.webp`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${PRODUCTION_SITE_URL}/tin-tuc/${article.slug}`,
    },
  };
}
