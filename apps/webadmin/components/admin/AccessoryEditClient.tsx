"use client";

import { Suspense } from "react";
import { ProductEditShell } from "@/components/admin/ProductEditShell";
import { resolveAccessoryMediaSlug } from "@webclient/lib/accessories";
import type { AdminProductMeta } from "@/lib/product-meta";

type AccessoryItem = {
  id: string;
  name: string;
  vehicles: string[];
};

export function AccessoryEditClient({
  product,
  meta,
  siteUrl,
}: {
  product: AccessoryItem;
  meta: AdminProductMeta;
  siteUrl: string;
}) {
  return (
    <Suspense fallback={<p className="p-6 text-sm text-zinc-500">Đang tải…</p>}>
      <ProductEditShell
        productType="accessory"
        productId={product.id}
        productName={product.name}
        listHref="/admin/accessories"
        listLabel="Phụ kiện"
        siteUrl={siteUrl}
        mediaCategory="accessories"
        mediaSlug={resolveAccessoryMediaSlug(product.vehicles)}
        initialMeta={meta}
      />
    </Suspense>
  );
}
