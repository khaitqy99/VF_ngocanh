import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/LegalPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { getLegalPageContent } from "@/lib/cms/legal-fetch";
import { getPageSeo, getSiteSeo } from "@/lib/cms/seo";
import { buildBreadcrumbSchema, buildWebPageSchema } from "@/lib/seo/local-business";
import { buildStaticPageMetadata } from "@/lib/seo/page-metadata";
import { getStaticPageSeoDefinition, resolveStaticPageSeo } from "@/lib/seo";

export const revalidate = 86400;

const PAGE_PATH = "/chinh-sach-bao-mat";
const PAGE_SLUG = "privacy" as const;

export async function generateMetadata(): Promise<Metadata> {
  return buildStaticPageMetadata(PAGE_SLUG);
}

export default async function ChinhSachBaoMatPage() {
  const definition = getStaticPageSeoDefinition(PAGE_SLUG)!;
  const [site, seo, content] = await Promise.all([
    getSiteSeo(),
    getPageSeo(PAGE_SLUG),
    getLegalPageContent(PAGE_SLUG),
  ]);
  const resolved = resolveStaticPageSeo(definition, seo, site);
  const breadcrumb = buildBreadcrumbSchema([
    { name: "Trang chủ", path: "/" },
    { name: content.breadcrumbLabel, path: PAGE_PATH },
  ]);
  const webpage = buildWebPageSchema({
    name: resolved.title,
    description: resolved.description,
    path: PAGE_PATH,
    schemaType: seo?.schemaType ?? "WebPage",
  });

  return (
    <>
      <JsonLd data={breadcrumb} />
      <JsonLd data={webpage} />
      <LegalPage
        title={content.title}
        breadcrumbLabel={content.breadcrumbLabel}
        updatedAt={content.updatedAt}
        introHtml={content.introHtml}
        sections={content.sections}
      />
    </>
  );
}
