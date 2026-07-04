import type { Metadata } from "next";

import AboutPage from "@/components/about/AboutPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { getSiteSeo } from "@/lib/cms/seo";
import { resolveDealershipContact } from "@/lib/dealership";
import { buildBreadcrumbSchema, buildLocalBusinessSchema } from "@/lib/seo/local-business";
import { buildStaticPageMetadata } from "@/lib/seo/page-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildStaticPageMetadata("about");
}

export default async function GioiThieuPage() {
  const site = await getSiteSeo();
  const contact = resolveDealershipContact(site);
  const breadcrumb = buildBreadcrumbSchema([
    { name: "Trang chủ", path: "/" },
    { name: "Giới thiệu", path: "/gioi-thieu" },
  ]);

  return (
    <>
      <JsonLd data={[breadcrumb, buildLocalBusinessSchema(site)]} />
      <AboutPage contact={contact} />
    </>
  );
}
