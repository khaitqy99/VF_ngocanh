"use client";

import { CatalogLiveEditor } from "@/components/admin/CatalogLiveEditor";

export function AccessoriesListClient({
  previewUrl,
  publicHref,
}: {
  previewUrl: string;
  publicHref: string;
}) {
  return (
    <CatalogLiveEditor
      listHref="/admin/accessories"
      listLabel="Phụ kiện"
      catalogLabel="Danh mục phụ kiện"
      previewPath="/phu-kien/preview"
      previewUrl={previewUrl}
      publicHref={publicHref}
      mediaCategory="accessories"
    />
  );
}
