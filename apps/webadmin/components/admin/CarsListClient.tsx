"use client";

import { CatalogLiveEditor } from "@/components/admin/CatalogLiveEditor";

export function CarsListClient({ publicHref }: { publicHref: string }) {
  return (
    <CatalogLiveEditor
      listHref="/admin/cars"
      listLabel="Ô tô"
      catalogLabel="Danh mục ô tô"
      previewPath="/oto/preview"
      publicHref={publicHref}
      mediaCategory="cars"
    />
  );
}
