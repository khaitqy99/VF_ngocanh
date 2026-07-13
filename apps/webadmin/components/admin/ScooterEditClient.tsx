"use client";

import { Suspense } from "react";
import { ProductEditShell } from "@/components/admin/ProductEditShell";
import type { AdminProductMeta } from "@/lib/product-meta";
import type { ScooterDetail } from "@/lib/scooter-details";

export function ScooterEditClient({
  detail,
  id,
  meta,
  siteUrl,
}: {
  detail: ScooterDetail;
  id: string;
  meta: AdminProductMeta;
  siteUrl: string;
}) {
  return (
    <Suspense fallback={<p className="p-6 text-sm text-zinc-500">Đang tải…</p>}>
      <ProductEditShell
        productType="scooter"
        productId={id}
        productName={detail.name}
        listHref="/admin/scooters"
        listLabel="Xe máy"
        siteUrl={siteUrl}
        mediaCategory="scooters"
        mediaSlug={id}
        initialMeta={meta}
      />
    </Suspense>
  );
}
