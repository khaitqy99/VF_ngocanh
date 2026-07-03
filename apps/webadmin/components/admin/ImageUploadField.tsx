"use client";

import * as React from "react";
import Image from "next/image";
import { Upload } from "lucide-react";
import { cn } from "@/components/ui/core";
import { clientAssetUrl } from "@/lib/product-utils";

export function ImageUploadField({
  currentSrc,
  alt,
  onPreviewChange,
}: {
  currentSrc: string;
  alt: string;
  onPreviewChange?: (previewUrl: string) => void;
}) {
  const [preview, setPreview] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const displaySrc = preview ?? clientAssetUrl(currentSrc);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    onPreviewChange?.(url);
  };

  return (
    <div className="space-y-3">
      <div className="relative aspect-video max-w-md overflow-hidden rounded-xl border bg-zinc-50">
        <Image src={displaySrc} alt={alt} fill className="object-contain p-2" unoptimized />
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={onFile}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex w-full max-w-md cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50 p-6 transition-colors hover:border-red-300 hover:bg-red-50/50",
        )}
      >
        <Upload className="mb-2 h-6 w-6 text-zinc-400" />
        <p className="text-sm font-medium text-zinc-900">Chọn ảnh mới</p>
        <p className="mt-1 text-xs text-zinc-500">PNG, JPG, WEBP — tối đa 5MB</p>
      </button>
    </div>
  );
}
