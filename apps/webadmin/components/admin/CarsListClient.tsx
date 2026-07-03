"use client";

import { CatalogLiveEditor } from "@/components/admin/CatalogLiveEditor";

export function CarsListClient({
  previewUrl,
  publicHref,
}: {
  previewUrl: string;
  publicHref: string;
}) {
  return (
    <CatalogLiveEditor
      listHref="/admin/cars"
      listLabel="Ô tô"
      catalogLabel="Danh mục ô tô"
      previewPath="/oto/preview"
      previewUrl={previewUrl}
      publicHref={publicHref}
      mediaCategory="cars"
    />
  );
}
