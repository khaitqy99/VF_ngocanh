"use client";

import { useState } from "react";
import Image from "next/image";
import { Images } from "lucide-react";
import { Button, Input } from "@/components/ui/core";
import { EditField } from "@/components/admin/pdp/EditSection";
import { GlobalMediaPicker } from "@/components/admin/GlobalMediaPicker";
import { clientAssetUrl } from "@/lib/product-utils";
import type { MediaCategory } from "@/lib/media-library";

export function MediaImageField({
  defaultValue,
  category,
  slug,
  label = "Ảnh minh họa",
  hint,
}: {
  defaultValue: string;
  category: MediaCategory;
  slug: string;
  label?: string;
  hint?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <>
      <EditField label={label} hint={hint ?? "Chọn ảnh từ thư viện theo dòng xe"}>
        <div className="flex gap-3">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border bg-zinc-50">
            {value ? (
              <Image
                src={clientAssetUrl(value)}
                alt=""
                fill
                className="object-contain p-1"
                unoptimized
              />
            ) : (
              <div className="flex h-full items-center justify-center text-zinc-300">
                <Images className="h-6 w-6" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1 space-y-2">
            <Input
              value={value}
              readOnly
              className="font-mono text-xs text-zinc-600"
              title={value}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => setPickerOpen(true)}
            >
              <Images className="mr-1.5 h-3.5 w-3.5" />
              Chọn từ thư viện
            </Button>
          </div>
        </div>
      </EditField>

      <GlobalMediaPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={setValue}
        title={`Chọn ${label.toLowerCase()}`}
        defaultCategory={category}
        defaultFolderSlug={slug}
      />
    </>
  );
}
