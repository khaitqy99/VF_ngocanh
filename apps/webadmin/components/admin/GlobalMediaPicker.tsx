"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { FolderOpen, Search, X } from "lucide-react";
import { Button, Input } from "@/components/ui/core";
import {
  getMediaCategoryLabel,
  MEDIA_CATEGORY_OPTIONS,
  type MediaCategory,
} from "@/lib/media-library";
import { clientAssetUrl } from "@/lib/product-utils";

type MediaFolderOption = {
  category: MediaCategory;
  categoryLabel: string;
  slug: string;
  name: string;
  subtitle?: string;
  coverImage: string;
  storagePath: string;
  images: { id: string; name: string; path: string }[];
};

const PICKER_CATEGORIES = MEDIA_CATEGORY_OPTIONS.filter((option) => option.value !== "all") as {
  value: MediaCategory;
  label: string;
}[];

export function GlobalMediaPicker({
  open,
  onClose,
  onSelect,
  title = "Chọn ảnh từ thư viện",
  defaultCategory = "news",
  defaultFolderSlug,
  filterKind = "image",
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (path: string) => void;
  title?: string;
  defaultCategory?: MediaCategory;
  defaultFolderSlug?: string;
  filterKind?: "image" | "svg";
}) {
  const [search, setSearch] = useState("");
  const [folders, setFolders] = useState<MediaFolderOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<MediaCategory>(defaultCategory);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    setSearch("");
    setCategory(defaultCategory);
    setSelectedSlug(defaultFolderSlug ?? null);
    setLoading(true);

    fetch("/api/cms/media-images", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const nextFolders = (data?.folders ?? []) as MediaFolderOption[];
        setFolders(nextFolders);

        if (defaultFolderSlug) {
          const match = nextFolders.find(
            (folder) => folder.category === defaultCategory && folder.slug === defaultFolderSlug,
          );
          if (match) {
            setSelectedSlug(match.slug);
            return;
          }
        }

        const firstInCategory = nextFolders.find((folder) => folder.category === defaultCategory);
        setSelectedSlug(firstInCategory?.slug ?? null);
      })
      .catch(() => setFolders([]))
      .finally(() => setLoading(false));
  }, [open, defaultCategory, defaultFolderSlug]);

  const categoryFolders = useMemo(
    () => folders.filter((folder) => folder.category === category),
    [folders, category],
  );

  const selectedFolder = useMemo(
    () => categoryFolders.find((folder) => folder.slug === selectedSlug) ?? null,
    [categoryFolders, selectedSlug],
  );

  const filteredImages = useMemo(() => {
    if (!selectedFolder) return [];
    let list = selectedFolder.images;
    if (filterKind === "svg") {
      list = list.filter((img) => img.path.toLowerCase().endsWith(".svg"));
    }
    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter(
      (img) => img.name.toLowerCase().includes(q) || img.path.toLowerCase().includes(q),
    );
  }, [selectedFolder, search, filterKind]);

  const handleCategoryChange = (nextCategory: MediaCategory) => {
    setCategory(nextCategory);
    setSearch("");
    const first = folders.find((folder) => folder.category === nextCategory);
    setSelectedSlug(first?.slug ?? null);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-black/50" aria-label="Đóng" onClick={onClose} />
      <div className="relative flex max-h-[85vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div>
            <h3 className="font-semibold text-zinc-900">{title}</h3>
            <p className="text-xs text-zinc-500">
              {selectedFolder
                ? `${selectedFolder.name} · ${filteredImages.length} ảnh`
                : `${getMediaCategoryLabel(category)} · ${categoryFolders.length} thư mục`}
            </p>
          </div>
          <button type="button" onClick={onClose} className="rounded-md p-1 hover:bg-zinc-100">
            <X className="h-5 w-5 text-zinc-500" />
          </button>
        </div>

        <div className="border-b px-4 py-3">
          <div className="mb-3 flex flex-wrap gap-1">
            {PICKER_CATEGORIES.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => handleCategoryChange(tab.value)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  category === tab.value
                    ? "bg-zinc-900 text-white"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
              >
                {tab.label}
                <span className="ml-1 opacity-70">
                  ({folders.filter((folder) => folder.category === tab.value).length})
                </span>
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
            <Input
              placeholder={selectedFolder ? "Tìm ảnh trong thư mục..." : "Tìm thư mục..."}
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex min-h-0 flex-1">
          <aside className="w-64 shrink-0 overflow-y-auto border-r bg-zinc-50 p-3">
            {loading ? (
              <p className="py-6 text-center text-xs text-zinc-500">Đang tải thư mục...</p>
            ) : categoryFolders.length === 0 ? (
              <p className="py-6 text-center text-xs text-zinc-500">Chưa có thư mục.</p>
            ) : (
              <div className="space-y-1">
                {categoryFolders
                  .filter((folder) => {
                    if (!search.trim() || selectedFolder) return true;
                    const q = search.toLowerCase();
                    return (
                      folder.name.toLowerCase().includes(q) ||
                      folder.slug.toLowerCase().includes(q) ||
                      folder.subtitle?.toLowerCase().includes(q)
                    );
                  })
                  .map((folder) => {
                    const active = folder.slug === selectedSlug;
                    return (
                      <button
                        key={folder.slug}
                        type="button"
                        onClick={() => {
                          setSelectedSlug(folder.slug);
                          setSearch("");
                        }}
                        className={`flex w-full items-start gap-2 rounded-lg px-2.5 py-2 text-left transition ${
                          active ? "bg-white shadow-sm ring-1 ring-red-200" : "hover:bg-white/80"
                        }`}
                      >
                        <FolderOpen
                          className={`mt-0.5 h-4 w-4 shrink-0 ${active ? "text-red-600" : "text-zinc-400"}`}
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium text-zinc-900">
                            {folder.name}
                          </span>
                          <span className="block truncate text-[11px] text-zinc-500">
                            {folder.images.length} ảnh
                          </span>
                        </span>
                      </button>
                    );
                  })}
              </div>
            )}
          </aside>

          <div className="min-w-0 flex-1 overflow-y-auto p-4">
            {loading ? (
              <p className="py-8 text-center text-sm text-zinc-500">Đang tải thư viện ảnh...</p>
            ) : !selectedFolder ? (
              <p className="py-8 text-center text-sm text-zinc-500">Chọn thư mục bên trái để xem ảnh.</p>
            ) : filteredImages.length === 0 ? (
              <div className="py-8 text-center text-sm text-zinc-500">
                <p>
                  {filterKind === "svg"
                    ? "Chưa có file SVG trong thư mục này."
                    : "Thư mục này chưa có ảnh."}
                </p>
                <p className="mt-1 text-xs">
                  Upload tại{" "}
                  <a
                    href={`/admin/media/${selectedFolder.category}/${selectedFolder.slug}`}
                    className="text-red-600 hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Thư viện ảnh
                  </a>
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {filteredImages.map((img) => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => {
                      onSelect(img.path);
                      onClose();
                    }}
                    className="group overflow-hidden rounded-lg border border-zinc-200 bg-white text-left transition hover:border-red-400 hover:ring-2 hover:ring-red-200"
                  >
                    <div className="relative aspect-square bg-zinc-50">
                      <Image
                        src={clientAssetUrl(img.path)}
                        alt={img.name}
                        fill
                        className="object-contain p-1"
                        unoptimized
                      />
                    </div>
                    <p
                      className="truncate border-t border-zinc-100 px-1.5 py-1 text-[9px] text-zinc-500"
                      title={img.path}
                    >
                      {img.name}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between border-t px-4 py-3">
          <span className="truncate text-xs text-zinc-500">
            {selectedFolder
              ? `${getMediaCategoryLabel(category)} / ${selectedFolder.name}`
              : "Chọn thư mục bên trái, sau đó chọn ảnh"}
          </span>
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
        </div>
      </div>
    </div>
  );
}
