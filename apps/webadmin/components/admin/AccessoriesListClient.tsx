"use client";

import { CatalogLiveEditor } from "@/components/admin/CatalogLiveEditor";

export function AccessoriesListClient() {
  return (
    <CatalogLiveEditor
      listHref="/admin/accessories"
      listLabel="Phụ kiện"
      catalogLabel="Danh mục phụ kiện"
      previewPath="/phu-kien/preview"
      mediaCategory="accessories"
      productKind="accessory"
      newHref="/admin/accessories/new"
      newLabel="Thêm phụ kiện"
    />
  );
}
