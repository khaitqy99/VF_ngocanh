"use client";

import { Card, CardContent } from "@/components/ui/core";
import { EditField } from "@/components/admin/pdp/EditSection";
import { MediaImageField } from "@/components/admin/MediaImageField";
import type { MediaCategory } from "@/lib/media-library";

export function EditFeatureCard({
  index,
  title,
  desc,
  image,
  mediaCategory,
  mediaSlug,
}: {
  index: number;
  title: string;
  desc: string;
  image: string;
  mediaCategory: MediaCategory;
  mediaSlug: string;
}) {
  return (
    <Card>
      <CardContent className="space-y-3 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">#{index + 1}</p>
        <EditField label="Tiêu đề">
          <input
            defaultValue={title}
            className="flex h-9 w-full rounded-md border border-zinc-200 px-3 text-sm"
          />
        </EditField>
        <EditField label="Mô tả">
          <textarea
            defaultValue={desc}
            className="min-h-[72px] w-full rounded-md border border-zinc-200 px-3 py-2 text-sm"
          />
        </EditField>
        <MediaImageField
          defaultValue={image}
          category={mediaCategory}
          slug={mediaSlug}
          label="Ảnh minh họa"
        />
      </CardContent>
    </Card>
  );
}
