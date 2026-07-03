import { StaticPageSeoClient } from "@/components/admin/seo/StaticPageSeoClient";

export default async function StaticPageSeoRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <StaticPageSeoClient slug={slug} />;
}
