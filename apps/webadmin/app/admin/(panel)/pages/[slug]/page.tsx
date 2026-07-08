import { notFound } from "next/navigation";
import { StaticPageLiveEditor } from "@/components/admin/StaticPageLiveEditor";
import { isStaticPageSlug } from "@/lib/cms/static-pages";

export default async function StaticPageAdminRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!isStaticPageSlug(slug)) notFound();
  return <StaticPageLiveEditor slug={slug} />;
}
