"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { FolderOpen, FolderPlus, Loader2, Search, Upload, X } from "lucide-react";
import { Button, Input } from "@/components/ui/core";
import { useToast } from "@/components/admin/ToastProvider";
import {
  getMediaCategoryLabel,
  MEDIA_CATEGORY_OPTIONS,
  type MediaCategory,
} from "@/lib/media-library";
import { clientAssetUrl } from "@/lib/product-utils";
import { sanitizeMediaFolderSlug, slugFromFolderName } from "@/lib/media-storage";

type MediaFolderOption = {
  category: MediaCategory;
  categoryLabel: string;
  slug: string;
  name: string;
  subtitle?: string;
  coverImage: string;
  storagePath: string;
  images: { id: string; name: string; path: string; altText?: string | null }[];
};

const PICKER_CATEGORIES = MEDIA_CATEGORY_OPTIONS.filter((option) => option.value !== "all") as {
  value: MediaCategory;
  label: string;
}[];

const CUSTOM_FOLDER_CATEGORIES = new Set<MediaCategory>(["news", "pages"]);

async function fetchMediaFolders(): Promise<MediaFolderOption[]> {
  const res = await fetch("/api/cms/media-images", { credentials: "include" });
  if (!res.ok) return [];
  const data = await res.json();
  return (data?.folders ?? []) as MediaFolderOption[];
}

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
  onSelect: (path: string, meta?: { altText?: string | null }) => void;
  title?: string;
  defaultCategory?: MediaCategory;
  defaultFolderSlug?: string;
  filterKind?: "image" | "svg";
}) {
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const dragDepth = useRef(0);

  const [search, setSearch] = useState("");
  const [folders, setFolders] = useState<MediaFolderOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<MediaCategory>(defaultCategory);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadCount, setUploadCount] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [creatingFolder, setCreatingFolder] = useState(false);

  const refreshFolders = useCallback(async (preferredSlug?: string | null) => {
    const nextFolders = await fetchMediaFolders();
    setFolders(nextFolders);

    const slugToSelect = preferredSlug ?? selectedSlug;
    if (slugToSelect) {
      const match = nextFolders.find(
        (folder) => folder.category === category && folder.slug === slugToSelect,
      );
      if (match) {
        setSelectedSlug(match.slug);
        return nextFolders;
      }
    }

    const firstInCategory = nextFolders.find((folder) => folder.category === category);
    setSelectedSlug(firstInCategory?.slug ?? null);
    return nextFolders;
  }, [category, selectedSlug]);

  useEffect(() => {
    if (!open) return;

    setSearch("");
    setCategory(defaultCategory);
    setSelectedSlug(defaultFolderSlug ?? null);
    setShowCreateFolder(false);
    setNewFolderName("");
    setLoading(true);

    fetchMediaFolders()
      .then((nextFolders) => {
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
    setShowCreateFolder(false);
    const first = folders.find((folder) => folder.category === nextCategory);
    setSelectedSlug(first?.slug ?? null);
  };

  const uploadFiles = useCallback(
    async (fileList: FileList | File[]) => {
      if (!selectedFolder) {
        toast("Chọn thư mục trước khi upload", "error");
        return;
      }

      const files = Array.from(fileList).filter((file) => file.type.startsWith("image/"));
      if (!files.length) {
        toast("Không có file ảnh hợp lệ", "error");
        return;
      }
      if (uploading) return;

      const formData = new FormData();
      formData.set("category", selectedFolder.category);
      formData.set("slug", selectedFolder.slug);
      for (const file of files) {
        formData.append("files", file);
      }

      setUploading(true);
      setUploadCount(files.length);
      try {
        const res = await fetch("/api/cms/media-upload", {
          method: "POST",
          body: formData,
          credentials: "include",
        });
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          toast(data.error ?? "Upload thất bại", "error");
          return;
        }

        const count = Array.isArray(data.uploaded) ? data.uploaded.length : 0;
        toast(`Đã upload ${count}/${files.length} ảnh`);
        if (Array.isArray(data.errors) && data.errors.length) {
          toast(data.errors.join(" · "), "error");
        }
        await refreshFolders(selectedFolder.slug);
      } catch {
        toast("Upload thất bại — kiểm tra kết nối", "error");
      } finally {
        setUploading(false);
        setUploadCount(0);
      }
    },
    [refreshFolders, selectedFolder, toast, uploading],
  );

  const onUploadInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    await uploadFiles(files);
    e.target.value = "";
  };

  const onDragEnter = (e: React.DragEvent) => {
    if (!selectedFolder || filterKind === "svg") return;
    e.preventDefault();
    e.stopPropagation();
    dragDepth.current += 1;
    setDragActive(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    if (!selectedFolder || filterKind === "svg") return;
    e.preventDefault();
    e.stopPropagation();
    dragDepth.current -= 1;
    if (dragDepth.current <= 0) {
      dragDepth.current = 0;
      setDragActive(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    if (!selectedFolder || filterKind === "svg") return;
    e.preventDefault();
    e.stopPropagation();
  };

  const onDrop = async (e: React.DragEvent) => {
    if (!selectedFolder || filterKind === "svg") return;
    e.preventDefault();
    e.stopPropagation();
    dragDepth.current = 0;
    setDragActive(false);
    if (!e.dataTransfer.files?.length) return;
    await uploadFiles(e.dataTransfer.files);
  };

  const createFolder = async () => {
    const name = newFolderName.trim();
    if (!name) {
      toast("Nhập tên thư mục", "error");
      return;
    }
    if (creatingFolder) return;

    setCreatingFolder(true);
    try {
      const res = await fetch("/api/cms/media-folder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ category, name }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast(data.error ?? "Tạo thư mục thất bại", "error");
        return;
      }

      const slug = typeof data.folder?.slug === "string" ? data.folder.slug : slugFromFolderName(name);
      toast(`Đã tạo thư mục "${name}"`);
      setNewFolderName("");
      setShowCreateFolder(false);
      await refreshFolders(slug);
    } catch {
      toast("Tạo thư mục thất bại — kiểm tra kết nối", "error");
    } finally {
      setCreatingFolder(false);
    }
  };

  if (!open) return null;

  const canCreateFolder = CUSTOM_FOLDER_CATEGORIES.has(category);
  const canUpload = !!selectedFolder && filterKind !== "svg";

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
          <div className="flex items-center gap-2">
            {canUpload && (
              <>
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={onUploadInput}
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={uploading}
                  onClick={() => inputRef.current?.click()}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                      {uploadCount} ảnh...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-1.5 h-4 w-4" />
                      Upload ảnh
                    </>
                  )}
                </Button>
              </>
            )}
            <button type="button" onClick={onClose} className="rounded-md p-1 hover:bg-zinc-100">
              <X className="h-5 w-5 text-zinc-500" />
            </button>
          </div>
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
          <aside className="flex w-64 shrink-0 flex-col border-r bg-zinc-50">
            {canCreateFolder && (
              <div className="border-b p-3">
                {showCreateFolder ? (
                  <div className="space-y-2">
                    <Input
                      placeholder="Tên thư mục mới..."
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") void createFolder();
                        if (e.key === "Escape") {
                          setShowCreateFolder(false);
                          setNewFolderName("");
                        }
                      }}
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        className="flex-1"
                        disabled={creatingFolder}
                        onClick={() => void createFolder()}
                      >
                        {creatingFolder ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Tạo"
                        )}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setShowCreateFolder(false);
                          setNewFolderName("");
                        }}
                      >
                        Hủy
                      </Button>
                    </div>
                    {newFolderName.trim() && (
                      <p className="text-[10px] text-zinc-500">
                        Slug: {sanitizeMediaFolderSlug(newFolderName)}
                      </p>
                    )}
                  </div>
                ) : (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowCreateFolder(true)}
                  >
                    <FolderPlus className="mr-1.5 h-4 w-4" />
                    Tạo thư mục
                  </Button>
                )}
              </div>
            )}

            <div className="min-h-0 flex-1 overflow-y-auto p-3">
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
            </div>
          </aside>

          <div
            className={`relative min-w-0 flex-1 overflow-y-auto p-4 ${
              dragActive ? "bg-red-50/60 ring-2 ring-inset ring-red-300" : ""
            }`}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDragOver={onDragOver}
            onDrop={onDrop}
          >
            {dragActive && (
              <div className="pointer-events-none absolute inset-4 z-10 flex items-center justify-center rounded-lg border-2 border-dashed border-red-400 bg-white/80">
                <p className="text-sm font-medium text-red-700">Thả ảnh vào đây để upload</p>
              </div>
            )}

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
                {canUpload && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="mt-4"
                    disabled={uploading}
                    onClick={() => inputRef.current?.click()}
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                        Đang upload...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-1.5 h-4 w-4" />
                        Upload ảnh vào thư mục này
                      </>
                    )}
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {filteredImages.map((img) => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => {
                      onSelect(img.path, { altText: img.altText });
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
              ? `${getMediaCategoryLabel(category)} / ${selectedFolder.name}${
                  canUpload ? " · Kéo thả ảnh để upload" : ""
                }`
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
