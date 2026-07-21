"use client";

import { FolderOpen, Upload } from "lucide-react";
import { postAdminPickImage, postAdminUploadImage } from "@/lib/admin-preview-messages";
import { toast } from "sonner";

type MediaCategory = "cars" | "scooters" | "accessories";

const btnClass =
  "flex items-center gap-1 rounded bg-brand px-2 py-1 text-[10px] font-bold text-white hover:bg-[#0046cc]";

export function AdminImageActions({
  path,
  category,
  slug,
  productId,
  kind = "image",
  className = "absolute right-3 top-3 z-10 flex gap-1",
}: {
  path: string;
  category: MediaCategory;
  slug: string;
  productId?: string;
  kind?: "image" | "svg";
  className?: string;
}) {
  const payload = { path, category, slug, productId: productId ?? slug, kind };

  const pick = () => {
    if (!postAdminPickImage(payload)) {
      toast.message("Mở từ trang admin để dùng thư viện media");
    }
  };

  const upload = () => {
    if (!postAdminUploadImage(payload)) {
      toast.message("Mở từ trang admin để upload ảnh");
    }
  };

  return (
    <div className={className}>
      <button type="button" onClick={pick} className={btnClass}>
        <FolderOpen className="size-3" />
        Thư viện
      </button>
      <button type="button" onClick={upload} className={btnClass}>
        <Upload className="size-3" />
        Upload
      </button>
    </div>
  );
}
