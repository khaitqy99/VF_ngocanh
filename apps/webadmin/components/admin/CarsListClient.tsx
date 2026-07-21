"use client";

import { CatalogLiveEditor } from "@/components/admin/CatalogLiveEditor";

export function CarsListClient() {
  return (
    <CatalogLiveEditor
      listHref="/admin/cars"
      listLabel="Ô tô"
      catalogLabel="Danh mục ô tô"
      previewPath="/oto/preview"
      mediaCategory="cars"
      productKind="car"
      newHref="/admin/cars/new"
      newLabel="Thêm ô tô"
    />
  );
}
