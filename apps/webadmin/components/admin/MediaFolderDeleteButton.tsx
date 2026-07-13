"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/core";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/admin/ToastProvider";
import type { MediaCategory } from "@/lib/media-library";

export function MediaFolderDeleteButton({
  category,
  slug,
  folderName,
  redirectTo,
  variant = "outline",
  size = "sm",
  label = "Xóa thư mục",
}: {
  category: MediaCategory;
  slug: string;
  folderName: string;
  redirectTo?: string;
  variant?: "outline" | "ghost" | "default";
  size?: "sm" | "default";
  label?: string;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<{
    imageCount: number;
    warnings: string[];
  } | null>(null);

  const openDialog = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/cms/media-folder?category=${encodeURIComponent(category)}&slug=${encodeURIComponent(slug)}&preview=delete`,
        { credentials: "include" },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Không kiểm tra được thư mục");
      setPreview({
        imageCount: data.preview?.imageCount ?? 0,
        warnings: data.preview?.warnings ?? [],
      });
      setOpen(true);
    } catch (error) {
      toast(error instanceof Error ? error.message : "Không mở được hộp thoại xóa");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/cms/media-folder?category=${encodeURIComponent(category)}&slug=${encodeURIComponent(slug)}`,
        { method: "DELETE", credentials: "include" },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Xóa thư mục thất bại");

      toast(
        `Đã xóa thư mục "${folderName}" (${data.deletedFiles ?? 0} file, ${data.deletedAssets ?? 0} bản ghi)`,
      );
      setOpen(false);
      if (redirectTo) {
        router.push(redirectTo);
      }
      router.refresh();
    } catch (error) {
      toast(error instanceof Error ? error.message : "Xóa thư mục thất bại");
    } finally {
      setLoading(false);
    }
  };

  const bullets = [
    `Xóa toàn bộ ảnh trong thư mục "${folderName}".`,
    preview ? `${preview.imageCount} ảnh sẽ bị xóa khỏi Storage và database.` : null,
    "Hành động này không thể hoàn tác.",
    ...(preview?.warnings ?? []),
  ].filter((item): item is string => Boolean(item));

  return (
    <>
      <Button
        type="button"
        variant={variant}
        size={size}
        disabled={loading}
        className={variant === "outline" ? "text-red-600 hover:text-red-700" : undefined}
        onClick={() => void openDialog()}
      >
        <Trash2 className="mr-1.5 h-3.5 w-3.5" />
        {loading && !open ? "Đang tải…" : label}
      </Button>

      <ConfirmDialog
        open={open}
        title={`Xóa thư mục "${folderName}"?`}
        description="Tất cả ảnh đã upload trong thư mục này sẽ bị xóa vĩnh viễn."
        bullets={bullets}
        confirmLabel="Xóa thư mục"
        destructive
        loading={loading}
        onClose={() => setOpen(false)}
        onConfirm={() => void confirmDelete()}
      />
    </>
  );
}
