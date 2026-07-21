"use client";

import { CatalogLiveEditor } from "@/components/admin/CatalogLiveEditor";

export function ScootersListClient() {
  return (
    <CatalogLiveEditor
      listHref="/admin/scooters"
      listLabel="Xe máy"
      catalogLabel="Danh mục xe máy"
      previewPath="/xe-may-dien/preview"
      mediaCategory="scooters"
      productKind="scooter"
      newHref="/admin/scooters/new"
      newLabel="Thêm xe máy"
    />
  );
}
