import type { Metadata } from "next";
import { notFound } from "next/navigation";

import AccessoryDetailPage from "@/components/accessories/AccessoryDetailPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { getAccessories, getAccessoryBySlugOrId } from "@/lib/cms";
import { getAccessorySeoById } from "@/lib/cms/seo";
import { buildAccessoryMetadata } from "@/lib/seo/product-metadata";
import { buildBreadcrumbSchema } from "@/lib/seo/local-business";
import { buildAccessoryProductSchema } from "@/lib/seo/product-schema";
import { accessoryDetailPath, resolveProductSlug, isReservedProductSlug } from "@/lib/seo/slugs";

export const revalidate = 86400;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const accessories = await getAccessories();
  return accessories
    .map((product) => ({
      slug: resolveProductSlug(product, "accessory", product.name),
    }))
    .filter((entry) => !isReservedProductSlug(entry.slug));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return buildAccessoryMetadata(slug);
}

export default async function AccessoryDetailRoute({ params }: Props) {
  const { slug } = await params;
  if (isReservedProductSlug(slug)) notFound();
  const product = await getAccessoryBySlugOrId(slug);
  if (!product) notFound();

  const canonicalPath = accessoryDetailPath(product);
  const seo = await getAccessorySeoById(product.id);
  const productSchema = buildAccessoryProductSchema(product, canonicalPath, {
    description: seo.metaDescription,
    schemaType: seo.schemaType,
  });

  const breadcrumb = buildBreadcrumbSchema([
    { name: "Trang chủ", path: "/" },
    { name: "Phụ kiện", path: "/phu-kien" },
    { name: product.name, path: canonicalPath },
  ]);

  return (
    <>
      <JsonLd data={[productSchema, breadcrumb]} />
      <AccessoryDetailPage product={product} />
    </>
  );
}
