"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ProductDetailLiveEditor } from "@/components/admin/ProductDetailLiveEditor";
import { ProductDeleteButton } from "@/components/admin/ProductDeleteButton";
import { ProductDuplicateButton } from "@/components/admin/ProductDuplicateButton";
import { ProductSettingsClient } from "@/components/admin/ProductSettingsClient";
import { ProductSeoClient } from "@/components/admin/seo/ProductSeoClient";
import type { AdminProductMeta } from "@/lib/product-meta";
import type { ProductType } from "@/lib/product-api";
import type { MediaCategory } from "@/lib/media-library";

type EditTab = "preview" | "settings" | "seo";

function parseTab(value: string | null): EditTab {
  if (value === "settings" || value === "seo") return value;
  return "preview";
}

function productPreviewPath(type: ProductType, slug: string): string {
  if (type === "car") return `/oto/${slug}/preview`;
  if (type === "scooter") return `/xe-may-dien/${slug}/preview`;
  return `/phu-kien/${slug}/preview`;
}

function productPublicPath(type: ProductType, slug: string): string {
  if (type === "car") return `/oto/${slug}`;
  if (type === "scooter") return `/xe-may-dien/${slug}`;
  return `/phu-kien/${slug}`;
}

export function ProductEditShell({
  productType,
  productId,
  productName,
  listHref,
  listLabel,
  siteUrl,
  mediaCategory,
  mediaSlug,
  initialMeta,
}: {
  productType: ProductType;
  productId: string;
  productName: string;
  listHref: string;
  listLabel: string;
  siteUrl: string;
  mediaCategory: MediaCategory;
  mediaSlug: string;
  initialMeta: AdminProductMeta;
}) {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<EditTab>(() => parseTab(searchParams.get("tab")));
  const [meta, setMeta] = useState(initialMeta);

  const displayName = meta.name || productName;
  const siteBase = siteUrl.replace(/\/$/, "");
  const publicPath = productPublicPath(productType, meta.slug);
  const publicHref = `${siteBase}${publicPath}`;
  const previewPath = productPreviewPath(productType, meta.slug);
  const publicPathPrefix = publicPath.split("/").slice(0, 2).join("/") || publicPath;

  const onMetaSaved = useCallback((next: AdminProductMeta) => {
    setMeta(next);
  }, []);

  return (
    <div className="-mx-4 flex min-h-[calc(100vh-4rem)] flex-col md:-mx-8">
      <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-zinc-200 bg-white px-4 py-2">
        {(
          [
            ["preview", "Nội dung"],
            ["settings", "Thông tin"],
            ["seo", "SEO"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`rounded-md px-3 py-1.5 text-xs font-bold ${
              tab === key ? "bg-red-600 text-white" : "text-zinc-600 hover:bg-zinc-100"
            }`}
          >
            {label}
          </button>
        ))}
        <div className="ml-auto flex flex-wrap items-center gap-2">
        <Link
          href={publicHref}
          target="_blank"
          className="self-center text-xs font-medium text-red-600 hover:underline"
        >
          Xem trên web →
        </Link>
        <ProductDuplicateButton
          productId={productId}
          productName={displayName}
          productType={productType}
          listHref={listHref}
        />
        <ProductDeleteButton
          productId={productId}
          productName={displayName}
          productType={productType}
          listHref={listHref}
        />
        </div>
      </div>

      {tab === "preview" ? (
        <ProductDetailLiveEditor
          listHref={listHref}
          listLabel={listLabel}
          productName={displayName}
          previewPath={previewPath}
          mediaCategory={mediaCategory}
          mediaSlug={mediaSlug}
        />
      ) : null}

      {tab === "settings" ? (
        <ProductSettingsClient
          productType={productType}
          productId={productId}
          productName={displayName}
          listHref={listHref}
          listLabel={listLabel}
          publicPathPrefix={publicPathPrefix}
          onMetaSaved={onMetaSaved}
        />
      ) : null}

      {tab === "seo" ? (
        <ProductSeoClient
          productType={productType}
          productId={productId}
          productName={displayName}
          listHref={listHref}
          listLabel={listLabel}
        />
      ) : null}
    </div>
  );
}
