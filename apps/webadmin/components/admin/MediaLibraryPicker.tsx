"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Search, X, FolderOpen } from "lucide-react";
import { Button, Input } from "@/components/ui/core";
import { type MediaCategory, type MediaFolder } from "@/lib/media-library";
import { clientAssetUrl } from "@/lib/product-utils";

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
  const [search, setSearch] = useState("");
  const [folder, setFolder] = useState<MediaFolder | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetch(`/api/cms/media-folder?category=${encodeURIComponent(category)}&slug=${encodeURIComponent(slug)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setFolder(data?.folder ?? null))
      .catch(() => setFolder(null))
      .finally(() => setLoading(false));
  }, [open, category, slug]);

  const images = useMemo(() => {
    if (!folder) return [];
    let list = folder.images;
    if (filterKind === "svg") {
      list = list.filter((img) => img.path.toLowerCase().endsWith(".svg"));
    }
    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter(
      (img) => img.name.toLowerCase().includes(q) || img.path.toLowerCase().includes(q),
    );
  }, [folder, search, filterKind]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Đóng"
        onClick={onClose}
      />
      <div className="relative flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div>
            <h3 className="font-semibold text-zinc-900">{title}</h3>
            {folder ? (
              <p className="flex items-center gap-1 text-xs text-zinc-500">
                <FolderOpen className="h-3 w-3" />
                {folder.name} · {folder.images.length} ảnh
              </p>
            ) : null}
          </div>
          <button type="button" onClick={onClose} className="rounded-md p-1 hover:bg-zinc-100">
            <X className="h-5 w-5 text-zinc-500" />
          </button>
        </div>

        <div className="border-b px-4 py-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Tìm tên file..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <p className="py-8 text-center text-sm text-zinc-500">Đang tải thư viện ảnh...</p>
          ) : !folder ? (
            <p className="py-8 text-center text-sm text-zinc-500">Không tìm thấy thư mục ảnh.</p>
          ) : images.length === 0 ? (
            <p className="py-8 text-center text-sm text-zinc-500">
              {filterKind === "svg"
                ? "Chưa có file SVG — thêm vào thư mục /images/icons/ hoặc thư viện sản phẩm."
                : "Không có ảnh phù hợp."}
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
              {images.map((img) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => {
                    onSelect(img.path);
                    onClose();
                  }}
                  className="group relative aspect-square overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 transition hover:border-red-400 hover:ring-2 hover:ring-red-200"
                >
                  <Image
                    src={clientAssetUrl(img.path)}
                    alt={img.name}
                    fill
                    className="object-contain p-1"
                    unoptimized
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-1.5 opacity-0 transition group-hover:opacity-100">
                    <p className="truncate text-[9px] text-white">{img.name}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="border-t px-4 py-3 text-right">
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
        </div>
      </div>
    </div>
  );
}
