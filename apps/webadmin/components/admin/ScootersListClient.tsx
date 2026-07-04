"use client";

import { CatalogLiveEditor } from "@/components/admin/CatalogLiveEditor";

export function ScootersListClient({ publicHref }: { publicHref: string }) {
  return (
    <CatalogLiveEditor
      listHref="/admin/scooters"
      listLabel="Xe máy"
      catalogLabel="Danh mục xe máy"
      previewPath="/xe-may-dien/preview"
      publicHref={publicHref}
      mediaCategory="scooters"
    />
  );
}
