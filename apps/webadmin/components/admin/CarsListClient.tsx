"use client";

import { CatalogLiveEditor } from "@/components/admin/CatalogLiveEditor";

export function CarsListClient() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return (
    <CatalogLiveEditor
      listHref="/admin/cars"
      listLabel="Ô tô"
      catalogLabel="Danh mục ô tô"
      previewPath="/oto/preview"
      publicHref={`${siteUrl}/oto`}
      mediaCategory="cars"
      productKind="car"
      newHref="/admin/cars/new"
      newLabel="Thêm ô tô"
    />
  );
}
