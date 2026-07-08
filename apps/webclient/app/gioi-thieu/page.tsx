import type { Metadata } from "next";

import AboutPage from "@/components/about/AboutPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { getStaticPageContent } from "@/lib/cms";
import { getSiteSeo } from "@/lib/cms/seo";
import { resolveDealershipContact } from "@/lib/dealership";
import { buildBreadcrumbSchema, buildLocalBusinessSchema } from "@/lib/seo/local-business";
import { buildStaticPageMetadata } from "@/lib/seo/page-metadata";

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  return buildStaticPageMetadata("about");
}

export default async function GioiThieuPage() {
  const [site, content] = await Promise.all([getSiteSeo(), getStaticPageContent("about")]);
  const contact = resolveDealershipContact(site);
  const breadcrumb = buildBreadcrumbSchema([
    { name: "Trang chủ", path: "/" },
    { name: "Giới thiệu", path: "/gioi-thieu" },
  ]);

  return (
    <>
      <JsonLd data={[breadcrumb, buildLocalBusinessSchema(site)]} />
      <AboutPage contact={contact} content={content} />
    </>
  );
}
