"use client";

import { useState } from "react";
import Link from "next/link";
import { ProductDetailLiveEditor } from "@/components/admin/ProductDetailLiveEditor";
import { ProductSeoClient } from "@/components/admin/seo/ProductSeoClient";
import { accessoryDetailPath, resolveProductSlug } from "@/lib/seo/slugs";
import { resolveAccessoryMediaSlug } from "@webclient/lib/accessories";

type AccessoryItem = {
  id: string;
  shopPid?: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  vehicles: string[];
  badge?: string;
  inStock: boolean;
};

export function AccessoryEditClient({
  product,
  siteUrl,
}: {
  product: AccessoryItem;
  siteUrl: string;
}) {
  const [tab, setTab] = useState<"preview" | "seo">("preview");
  const slug = resolveProductSlug({ id: product.id, slug: undefined }, "accessory", product.name);

  return (
    <div className="-mx-4 flex min-h-[calc(100vh-4rem)] flex-col md:-mx-8">
      <div className="flex shrink-0 gap-2 border-b border-zinc-200 bg-white px-4 py-2">
        <button
          type="button"
          onClick={() => setTab("preview")}
          className={`rounded-md px-3 py-1.5 text-xs font-bold ${tab === "preview" ? "bg-red-600 text-white" : "text-zinc-600 hover:bg-zinc-100"}`}
        >
          Nội dung
        </button>
        <button
          type="button"
          onClick={() => setTab("seo")}
          className={`rounded-md px-3 py-1.5 text-xs font-bold ${tab === "seo" ? "bg-red-600 text-white" : "text-zinc-600 hover:bg-zinc-100"}`}
        >
          SEO
        </button>
        <Link
          href={`${siteUrl}${accessoryDetailPath({ id: product.id, slug, name: product.name })}`}
          target="_blank"
          className="ml-auto self-center text-xs font-medium text-red-600 hover:underline"
        >
          Xem trên web →
        </Link>
      </div>

      {tab === "preview" ? (
        <ProductDetailLiveEditor
          listHref="/admin/accessories"
          listLabel="Phụ kiện"
          productName={product.name}
          previewPath={`/phu-kien/${slug}/preview`}
          publicHref={`${siteUrl}${accessoryDetailPath({ id: product.id, slug, name: product.name })}`}
          mediaCategory="accessories"
          mediaSlug={resolveAccessoryMediaSlug(product.vehicles)}
        />
      ) : (
        <ProductSeoClient
          productType="accessory"
          productId={product.id}
          productName={product.name}
          listHref="/admin/accessories"
          listLabel="Phụ kiện"
        />
      )}
    </div>
  );
}
