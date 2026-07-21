"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  Upload,
  Copy,
  Check,
  ExternalLink,
  Trash2,
  FolderOpen,
  Loader2,
  ImageIcon,
} from "lucide-react";
import { Button, Card, CardContent } from "@/components/ui/core";
import { PageHeader } from "@/components/admin/PageHeader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { MediaFolderDeleteButton } from "@/components/admin/MediaFolderDeleteButton";
import { useToast } from "@/components/admin/ToastProvider";
import {
  getMediaCategoryLabel,
  type MediaFolder,
  type MediaImage,
} from "@/lib/media-library";
import { clientAssetUrl } from "@/lib/product-utils";

import { useMediaFolder } from "@/lib/use-media-folders";

export function MediaFolderClient({ folder: initialFolder }: { folder: MediaFolder }) {
  const router = useRouter();
  const { toast } = useToast();
  const { folder, refreshFolder } = useMediaFolder(
    initialFolder,
    initialFolder.category,
    initialFolder.slug,
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadCount, setUploadCount] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [imageDeleteTarget, setImageDeleteTarget] = useState<MediaImage | null>(null);
  const dragDepth = useRef(0);

  const uploadFiles = useCallback(
    async (fileList: FileList | File[]) => {
      if (!folder) return;
      const files = Array.from(fileList).filter((file) => file.type.startsWith("image/"));
      if (!files.length) {
        toast("Không có file ảnh hợp lệ");
        return;
      }
      if (uploading) return;

      const formData = new FormData();
      formData.set("category", folder.category);
      formData.set("slug", folder.slug);
      for (const file of files) {
        formData.append("files", file);
      }

      setUploading(true);
      setUploadCount(files.length);
      try {
        const res = await fetch("/api/cms/media-upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          toast(data.error ?? "Upload thất bại");
          return;
        }

        const count = Array.isArray(data.uploaded) ? data.uploaded.length : 0;
        toast(`Đã upload ${count}/${files.length} ảnh (chuyển WebP & lưu CSDL)`);
        if (Array.isArray(data.errors) && data.errors.length) {
          toast(data.errors.join(" · "));
        }
        await refreshFolder();
        router.refresh();
      } catch {
        toast("Upload thất bại — kiểm tra kết nối");
      } finally {
        setUploading(false);
        setUploadCount(0);
      }
    },
    [folder, refreshFolder, router, toast, uploading],
  );

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    await uploadFiles(files);
    e.target.value = "";
  };

  const onDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragDepth.current += 1;
    setDragActive(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragDepth.current -= 1;
    if (dragDepth.current <= 0) {
      dragDepth.current = 0;
      setDragActive(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragDepth.current = 0;
    setDragActive(false);
    if (!e.dataTransfer.files?.length) return;
    await uploadFiles(e.dataTransfer.files);
  };

  const onDelete = (image: MediaImage) => {
    if (!image.assetId || deletingId) return;
    setImageDeleteTarget(image);
  };

  const confirmDeleteImage = async () => {
    if (!imageDeleteTarget?.assetId) return;
    setDeletingId(imageDeleteTarget.assetId);
    try {
      const res = await fetch(`/api/cms/media-asset/${imageDeleteTarget.assetId}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast(data.error ?? "Không xóa được ảnh");
        return;
      }
      toast("Đã xóa ảnh");
      setImageDeleteTarget(null);
      await refreshFolder();
      router.refresh();
    } catch {
      toast("Không xóa được ảnh");
    } finally {
      setDeletingId(null);
    }
  };

  if (!folder) {
    return <p className="py-12 text-center text-sm text-zinc-500">Đang tải thư mục...</p>;
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center gap-2 text-sm text-zinc-500">
        <Link href="/admin/media" className="hover:text-zinc-900">
          Thư viện ảnh
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span>{getMediaCategoryLabel(folder.category)}</span>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-zinc-900">{folder.name}</span>
      </div>

      <PageHeader
        title={folder.name}
        description={`${folder.images.length} ảnh · ${folder.storagePath}`}
        action={
          <div className="flex flex-wrap gap-2">
            {folder.productHref ? (
              <Link href={folder.productHref}>
                <Button variant="outline" size="sm">
                  Sửa sản phẩm
                </Button>
              </Link>
            ) : null}
            <MediaFolderDeleteButton
              category={folder.category}
              slug={folder.slug}
              folderName={folder.name}
              redirectTo="/admin/media"
            />
            <Button size="sm" disabled={uploading} onClick={() => inputRef.current?.click()}>
              {uploading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              {uploading
                ? `Đang upload ${uploadCount} ảnh...`
                : "Tải nhiều ảnh"}
            </Button>
          </div>
        }
      />

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
        multiple
        className="hidden"
        onChange={onUpload}
      />

      <Card>
        <CardContent className="flex items-center gap-3 p-4 text-sm text-zinc-600">
          <FolderOpen className="h-5 w-5 shrink-0 text-red-600" />
          <div>
            <p>
              Thư mục lưu trữ:{" "}
              <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs">
                Supabase Storage / media{folder.storagePath}
              </code>
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              Kéo thả hoặc chọn nhiều ảnh cùng lúc (tối đa 20/lần). PNG/JPG/GIF tự chuyển WebP
              trước khi lưu Storage và bảng{" "}
              <code className="rounded bg-zinc-100 px-1 py-0.5">media_assets</code>.
            </p>
          </div>
        </CardContent>
      </Card>

      <div
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        className={`rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
          dragActive
            ? "border-red-500 bg-red-50"
            : "border-zinc-200 bg-white hover:border-zinc-300"
        } ${uploading ? "pointer-events-none opacity-60" : "cursor-pointer"}`}
        onClick={() => !uploading && inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (!uploading) inputRef.current?.click();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="Khu vực kéo thả hoặc chọn ảnh để upload"
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2 text-zinc-600">
            <Loader2 className="h-8 w-8 animate-spin text-red-600" />
            <p className="text-sm font-medium">Đang upload {uploadCount} ảnh...</p>
            <p className="text-xs text-zinc-500">Chuyển WebP và lưu vào CSDL</p>
          </div>
        ) : dragActive ? (
          <div className="flex flex-col items-center gap-2 text-red-700">
            <Upload className="h-8 w-8" />
            <p className="text-sm font-medium">Thả ảnh vào đây để upload</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-zinc-600">
            <Upload className="h-8 w-8 text-zinc-400" />
            <p className="text-sm font-medium">Kéo thả ảnh vào đây</p>
            <p className="text-xs text-zinc-500">
              hoặc bấm để chọn nhiều file · PNG, JPG, GIF, WebP, SVG
            </p>
          </div>
        )}
      </div>

      {folder.images.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-sm text-zinc-500">Chưa có ảnh trong thư mục — dùng khu vực phía trên để tải lên.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {folder.images.map((img) => (
            <ImageCard
              key={img.id}
              image={img}
              deleting={deletingId === img.assetId}
              onDelete={() => onDelete(img)}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(imageDeleteTarget)}
        title={imageDeleteTarget ? `Xóa ảnh "${imageDeleteTarget.name}"?` : "Xóa ảnh?"}
        description="Ảnh sẽ bị xóa khỏi Storage và database."
        bullets={["Hành động này không thể hoàn tác."]}
        confirmLabel="Xóa ảnh"
        destructive
        loading={Boolean(deletingId)}
        onClose={() => setImageDeleteTarget(null)}
        onConfirm={() => void confirmDeleteImage()}
      />
    </div>
  );
}

function ImageCard({
  image,
  deleting,
  onDelete,
}: {
  image: MediaImage;
  deleting: boolean;
  onDelete: () => void;
}) {
  const { toast } = useToast();
  const [copied, setCopied] = useState<"path" | "url" | null>(null);
  const [failed, setFailed] = useState(false);
  const src = clientAssetUrl(image.path);
  const canDelete = Boolean(image.assetId);

  const copy = async (text: string, kind: "path" | "url") => {
    await navigator.clipboard.writeText(text);
    setCopied(kind);
    toast(kind === "path" ? "Đã copy đường dẫn" : "Đã copy URL");
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <Card className="group overflow-hidden">
      <div className="relative aspect-square bg-zinc-50">
        {failed ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1 p-2 text-zinc-400">
            <ImageIcon className="h-8 w-8" />
            <span className="line-clamp-2 text-center text-[10px] leading-tight">{image.name}</span>
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={image.name}
            className="h-full w-full object-contain p-1"
            loading="lazy"
            decoding="async"
            onError={() => setFailed(true)}
          />
        )}
        <div className="absolute inset-0 flex items-end justify-center gap-1 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            type="button"
            title="Copy đường dẫn"
            onClick={() => copy(image.path, "path")}
            className="rounded-md bg-white/90 p-1.5 text-zinc-700 hover:bg-white"
          >
            {copied === "path" ? (
              <Check className="h-3.5 w-3.5 text-green-600" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
          <button
            type="button"
            title="Copy URL"
            onClick={() => copy(src, "url")}
            className="rounded-md bg-white/90 p-1.5 text-zinc-700 hover:bg-white"
          >
            {copied === "url" ? (
              <Check className="h-3.5 w-3.5 text-green-600" />
            ) : (
              <ExternalLink className="h-3.5 w-3.5" />
            )}
          </button>
          {canDelete ? (
            <button
              type="button"
              title="Xóa"
              disabled={deleting}
              onClick={onDelete}
              className="rounded-md bg-white/90 p-1.5 text-red-600 hover:bg-white disabled:opacity-50"
            >
              {deleting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Trash2 className="h-3.5 w-3.5" />
              )}
            </button>
          ) : null}
        </div>
      </div>
      <p className="truncate px-2 py-1.5 font-mono text-[10px] text-zinc-500" title={image.name}>
        {image.name}
      </p>
    </Card>
  );
}
