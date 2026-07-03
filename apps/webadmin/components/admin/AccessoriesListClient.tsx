"use client";

import { CatalogLiveEditor } from "@/components/admin/CatalogLiveEditor";

export function AccessoriesListClient() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return (
    <CatalogLiveEditor
      listHref="/admin/accessories"
      listLabel="Phụ kiện"
      catalogLabel="Danh mục phụ kiện"
      previewPath="/phu-kien/preview"
      publicHref={`${siteUrl}/phu-kien`}
      mediaCategory="accessories"
    />
  );
}
