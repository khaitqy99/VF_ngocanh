"use client";

import { GlobalMediaPicker } from "@/components/admin/GlobalMediaPicker";
import type { MediaCategory } from "@/lib/media-library";

/** @deprecated Use GlobalMediaPicker directly */
export function MediaLibraryPicker({
  open,
  onClose,
  onSelect,
  category,
  slug,
  title = "Chọn ảnh từ thư viện",
  filterKind = "image",
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (path: string) => void;
  category: MediaCategory;
  slug: string;
  title?: string;
  filterKind?: "image" | "svg";
}) {
  return (
    <GlobalMediaPicker
      open={open}
      onClose={onClose}
      onSelect={onSelect}
      title={title}
      defaultCategory={category}
      defaultFolderSlug={slug}
      filterKind={filterKind}
    />
  );
}
