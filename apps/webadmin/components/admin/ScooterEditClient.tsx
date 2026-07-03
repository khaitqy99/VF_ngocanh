"use client";

import { useState } from "react";
import Link from "next/link";
import { ProductDetailLiveEditor } from "@/components/admin/ProductDetailLiveEditor";
import { ProductSeoClient } from "@/components/admin/seo/ProductSeoClient";
import { resolveProductSlug, scooterDetailPath } from "@/lib/seo/slugs";
import type { ScooterDetail } from "@/lib/scooter-details";

export function ScooterEditClient({
  detail,
  id,
  siteUrl,
}: {
  detail: ScooterDetail;
  id: string;
  siteUrl: string;
}) {
  const [tab, setTab] = useState<"preview" | "seo">("preview");
  const slug = resolveProductSlug({ id, slug: undefined }, "scooter");

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
          href={`${siteUrl}${scooterDetailPath({ id, slug })}`}
          target="_blank"
          className="ml-auto self-center text-xs font-medium text-red-600 hover:underline"
        >
          Xem trên web →
        </Link>
      </div>

      {tab === "preview" ? (
        <ProductDetailLiveEditor
          listHref="/admin/scooters"
          listLabel="Xe máy"
          productName={detail.name}
          previewPath={`/xe-may-dien/${slug}/preview`}
          publicHref={`${siteUrl}${scooterDetailPath({ id, slug })}`}
          mediaCategory="scooters"
          mediaSlug={id}
        />
      ) : (
        <ProductSeoClient
          productType="scooter"
          productId={id}
          productName={detail.name}
          listHref="/admin/scooters"
          listLabel="Xe máy"
        />
      )}
    </div>
  );
}
