import type { Metadata } from "next";

import ChargingPage from "@/components/charging/ChargingPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBanners, getStaticPageContent } from "@/lib/cms";
import { getPageSeo, getSiteSeo } from "@/lib/cms/seo";
import {
  buildBreadcrumbSchema,
  buildFaqPageSchema,
  buildWebPageSchema,
} from "@/lib/seo/local-business";
import { buildStaticPageMetadata } from "@/lib/seo/page-metadata";
import { getStaticPageSeoDefinition, resolveStaticPageSeo } from "@/lib/seo";

export const revalidate = 86400;

const PAGE_SLUG = "charging";
const PAGE_PATH = "/pin-va-tram-sac";

export async function generateMetadata(): Promise<Metadata> {
  return buildStaticPageMetadata(PAGE_SLUG);
}

export default async function PinVaTramSacPage() {
  const definition = getStaticPageSeoDefinition(PAGE_SLUG)!;
  const [site, seo, heroBanners, content] = await Promise.all([
    getSiteSeo(),
    getPageSeo(PAGE_SLUG),
    getBanners("charging"),
    getStaticPageContent("charging"),
  ]);
  const resolved = resolveStaticPageSeo(definition, seo, site);
  const breadcrumb = buildBreadcrumbSchema([
    { name: "Trang chủ", path: "/" },
    { name: "Pin & Trạm sạc", path: PAGE_PATH },
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
      <ChargingPage heroBanners={heroBanners} content={content} />
    </>
  );
}
