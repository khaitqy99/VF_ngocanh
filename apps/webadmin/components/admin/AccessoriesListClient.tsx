"use client";

import { CatalogLiveEditor } from "@/components/admin/CatalogLiveEditor";

export function AccessoriesListClient({ publicHref }: { publicHref: string }) {
  return (
    <CatalogLiveEditor
      listHref="/admin/accessories"
      listLabel="Phụ kiện"
      catalogLabel="Danh mục phụ kiện"
      previewPath="/phu-kien/preview"
      publicHref={publicHref}
      mediaCategory="accessories"
    />
  );
}
