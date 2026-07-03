"use client";

import { ProductDetailLiveEditor } from "@/components/admin/ProductDetailLiveEditor";
import type { MediaCategory } from "@/lib/media-library";

export function CatalogLiveEditor({
  listHref,
  listLabel,
  catalogLabel,
  previewPath,
  publicHref,
  mediaCategory,
}: {
  listHref: string;
  listLabel: string;
  catalogLabel: string;
  previewPath: string;
  publicHref: string;
  mediaCategory: MediaCategory;
}) {
  return (
    <ProductDetailLiveEditor
      listHref={listHref}
      listLabel={listLabel}
      productName={catalogLabel}
      previewPath={previewPath}
      publicHref={publicHref}
      mediaCategory={mediaCategory}
      editorHint="Chỉnh sửa trực tiếp trên thẻ catalog — bấm Lưu thẻ sau khi hoàn tất"
    />
  );
}
