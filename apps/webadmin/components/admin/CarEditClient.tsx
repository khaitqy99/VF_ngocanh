"use client";

import { Suspense } from "react";
import { ProductEditShell } from "@/components/admin/ProductEditShell";
import type { AdminProductMeta } from "@/lib/product-meta";
import type { CarDetail } from "@/lib/car-details";

export function CarEditClient({
  detail,
  id,
  meta,
  siteUrl,
}: {
  detail: CarDetail;
  id: string;
  meta: AdminProductMeta;
  siteUrl: string;
}) {
  return (
    <Suspense fallback={<p className="p-6 text-sm text-zinc-500">Đang tải…</p>}>
      <ProductEditShell
        productType="car"
        productId={id}
        productName={detail.name}
        listHref="/admin/cars"
        listLabel="Ô tô"
        siteUrl={siteUrl}
        mediaCategory="cars"
        mediaSlug={id}
        initialMeta={meta}
      />
    </Suspense>
  );
}
