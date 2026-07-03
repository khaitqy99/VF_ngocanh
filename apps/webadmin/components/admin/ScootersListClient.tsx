"use client";

import { CatalogLiveEditor } from "@/components/admin/CatalogLiveEditor";

export function ScootersListClient({
  previewUrl,
  publicHref,
}: {
  previewUrl: string;
  publicHref: string;
}) {
  return (
    <CatalogLiveEditor
      listHref="/admin/scooters"
      listLabel="Xe máy"
      catalogLabel="Danh mục xe máy"
      previewPath="/xe-may-dien/preview"
      previewUrl={previewUrl}
      publicHref={publicHref}
      mediaCategory="scooters"
    />
  );
}
