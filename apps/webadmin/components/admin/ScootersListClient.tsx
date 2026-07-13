"use client";

import { CatalogLiveEditor } from "@/components/admin/CatalogLiveEditor";

export function ScootersListClient() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return (
    <CatalogLiveEditor
      listHref="/admin/scooters"
      listLabel="Xe máy"
      catalogLabel="Danh mục xe máy"
      previewPath="/xe-may-dien/preview"
      publicHref={`${siteUrl}/xe-may-dien`}
      mediaCategory="scooters"
      productKind="scooter"
      newHref="/admin/scooters/new"
      newLabel="Thêm xe máy"
    />
  );
}
