"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { ProductDetailLiveEditor } from "@/components/admin/ProductDetailLiveEditor";
import { ProductSortPanel } from "@/components/admin/ProductSortPanel";
import type { MediaCategory } from "@/lib/media-library";
import type { ProductType } from "@/lib/product-api";

export function CatalogLiveEditor({
  listHref,
  listLabel,
  catalogLabel,
  previewPath,
  mediaCategory,
  productKind,
  newHref,
  newLabel,
}: {
  listHref: string;
  listLabel: string;
  catalogLabel: string;
  previewPath: string;
  mediaCategory: MediaCategory;
  productKind: ProductType;
  newHref?: string;
  newLabel?: string;
}) {
  return (
    <div className="space-y-4">
      <ProductSortPanel kind={productKind} listHref={listHref} />
      <div className="flex justify-end px-4 md:px-0">
        {newHref ? (
          <Link
            href={newHref}
            className="inline-flex h-9 shrink-0 items-center rounded-md bg-red-600 px-4 text-sm font-medium text-white hover:bg-red-700"
          >
            <Plus className="mr-1.5 h-4 w-4" />
            {newLabel ?? "Thêm sản phẩm"}
          </Link>
        ) : null}
      </div>
      <ProductDetailLiveEditor
      listHref={listHref}
      listLabel={listLabel}
      productName={catalogLabel}
      previewPath={previewPath}
      mediaCategory={mediaCategory}
      />
    </div>
  );
}
