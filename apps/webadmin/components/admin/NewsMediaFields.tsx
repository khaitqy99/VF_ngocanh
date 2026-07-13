"use client";

import { useState } from "react";
import Image from "next/image";
import { Images } from "lucide-react";
import { Button, Input } from "@/components/ui/core";
import { GlobalMediaPicker } from "@/components/admin/GlobalMediaPicker";
import { clientAssetUrl } from "@/lib/product-utils";

export { GlobalMediaPicker } from "@/components/admin/GlobalMediaPicker";

export function NewsCoverImageField({
  value,
  onChange,
  articleSlug,
}: {
  value: string;
  onChange: (value: string) => void;
  articleSlug?: string;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <>
      <div className="flex gap-3">
        <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg border bg-zinc-50">
          {value ? (
            <Image
              src={clientAssetUrl(value)}
              alt=""
              fill
              className="object-cover"
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
            onChange={(e) => onChange(e.target.value)}
            placeholder="/images/showroom.webp"
            className="font-mono text-xs"
          />
          <Button type="button" variant="outline" size="sm" onClick={() => setPickerOpen(true)}>
            <Images className="mr-1.5 h-3.5 w-3.5" />
            Chọn từ thư viện
          </Button>
        </div>
      </div>

      <GlobalMediaPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={onChange}
        title="Chọn ảnh bìa"
        defaultCategory="news"
        defaultFolderSlug={articleSlug ?? "chung"}
      />
    </>
  );
}
