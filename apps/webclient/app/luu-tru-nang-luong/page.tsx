import type { Metadata } from "next";

import EnergyStoragePage from "@/components/energy-storage/EnergyStoragePage";
import { JsonLd } from "@/components/seo/JsonLd";
import { getStaticPageContent } from "@/lib/cms";
import { getPageSeo, getSiteSeo } from "@/lib/cms/seo";
import {
  buildBreadcrumbSchema,
  buildFaqPageSchema,
  buildWebPageSchema,
} from "@/lib/seo/local-business";
import { buildStaticPageMetadata } from "@/lib/seo/page-metadata";
import { getStaticPageSeoDefinition, resolveStaticPageSeo } from "@/lib/seo";

export const revalidate = 86400;

const PAGE_SLUG = "energy";
const PAGE_PATH = "/luu-tru-nang-luong";

export async function generateMetadata(): Promise<Metadata> {
  return buildStaticPageMetadata(PAGE_SLUG);
}

export default async function LuuTruNangLuongPage() {
  const definition = getStaticPageSeoDefinition(PAGE_SLUG)!;
  const [site, seo, content] = await Promise.all([
    getSiteSeo(),
    getPageSeo(PAGE_SLUG),
    getStaticPageContent("energy"),
  ]);
  const resolved = resolveStaticPageSeo(definition, seo, site);
  const breadcrumb = buildBreadcrumbSchema([
    { name: "Trang chủ", path: "/" },
    { name: "Lưu trữ năng lượng", path: PAGE_PATH },
  ]);
  const webpage = buildWebPageSchema({
    name: resolved.title,
    description: resolved.description,
    path: PAGE_PATH,
    schemaType: seo?.schemaType ?? "Service",
  });
  const schemas: Record<string, unknown>[] = [
    breadcrumb as Record<string, unknown>,
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
      <EnergyStoragePage content={content} />
    </>
  );
}
