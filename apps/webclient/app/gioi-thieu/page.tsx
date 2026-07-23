import type { Metadata } from "next";

import AboutPage from "@/components/about/AboutPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { getStaticPageContent } from "@/lib/cms";
import { getPageSeo, getSiteSeo } from "@/lib/cms/seo";
import { resolveDealershipContact } from "@/lib/dealership";
import {
  buildBreadcrumbSchema,
  buildFaqPageSchema,
  buildLocalBusinessSchema,
  buildWebPageSchema,
} from "@/lib/seo/local-business";
import { buildStaticPageMetadata } from "@/lib/seo/page-metadata";
import { getStaticPageSeoDefinition, resolveStaticPageSeo } from "@/lib/seo";

export const revalidate = 86400;

const PAGE_SLUG = "about";
const PAGE_PATH = "/gioi-thieu";

export async function generateMetadata(): Promise<Metadata> {
  return buildStaticPageMetadata(PAGE_SLUG);
}

export default async function GioiThieuPage() {
  const definition = getStaticPageSeoDefinition(PAGE_SLUG)!;
  const [site, seo, content] = await Promise.all([
    getSiteSeo(),
    getPageSeo(PAGE_SLUG),
    getStaticPageContent("about"),
  ]);
  const contact = resolveDealershipContact(site);
  const resolved = resolveStaticPageSeo(definition, seo, site);
  const breadcrumb = buildBreadcrumbSchema([
    { name: "Trang chủ", path: "/" },
    { name: "Giới thiệu", path: PAGE_PATH },
  ]);
  const webpage = buildWebPageSchema({
    name: resolved.title,
    description: resolved.description,
    path: PAGE_PATH,
    schemaType: seo?.schemaType ?? "LocalBusiness",
  });
  const schemas: Record<string, unknown>[] = [
    breadcrumb as Record<string, unknown>,
    buildLocalBusinessSchema(site) as Record<string, unknown>,
    webpage as Record<string, unknown>,
  ];
  if (content.faq?.length) {
    schemas.push(
      buildFaqPageSchema(
        content.faq.map((item) => ({ question: item.q, answer: item.a })),
      ) as Record<string, unknown>,
    );
  }

  return (
    <>
      <JsonLd data={schemas} />
      <AboutPage contact={contact} content={content} />
    </>
  );
}
