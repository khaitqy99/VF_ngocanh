"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  Upload,
  Copy,
  Check,
  ExternalLink,
  Trash2,
  FolderOpen,
} from "lucide-react";
import { Button, Card, CardContent, Badge } from "@/components/ui/core";
import { PageHeader } from "@/components/admin/PageHeader";
import { useToast } from "@/components/admin/ToastProvider";
import {
  getMediaCategoryLabel,
  type MediaFolder,
  type MediaImage,
} from "@/lib/media-library";
import { clientAssetUrl } from "@/lib/product-utils";

export function MediaFolderClient({ folder }: { folder: MediaFolder }) {
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [extraImages, setExtraImages] = useState<MediaImage[]>([]);

  const allImages = [...folder.images, ...extraImages];

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    const added: MediaImage[] = Array.from(files).map((file, i) => ({
      id: `upload-${Date.now()}-${i}`,
      name: file.name,
      path: URL.createObjectURL(file),
    }));
    setExtraImages((prev) => [...prev, ...added]);
    toast(`Đã thêm ${added.length} ảnh (xem trước — chưa lưu lên server)`);
    e.target.value = "";
  };

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
        description={`${allImages.length} ảnh · ${folder.storagePath}`}
        action={
          <div className="flex flex-wrap gap-2">
            {folder.productHref ? (
              <Link href={folder.productHref}>
                <Button variant="outline" size="sm">
                  Sửa sản phẩm
                </Button>
              </Link>
            ) : null}
            <Button size="sm" onClick={() => inputRef.current?.click()}>
              <Upload className="mr-2 h-4 w-4" />
              Tải ảnh lên
            </Button>
          </div>
        }
      />

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
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
              Ảnh hiện có từ dữ liệu website. Upload mới sẽ lưu vào Storage khi nối API upload.
            </p>
          </div>
        </CardContent>
      </Card>

      {allImages.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-sm text-zinc-500">Chưa có ảnh trong thư mục.</p>
          <Button className="mt-4" onClick={() => inputRef.current?.click()}>
            <Upload className="mr-2 h-4 w-4" />
            Tải ảnh đầu tiên
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {allImages.map((img) => (
            <ImageCard key={img.id} image={img} onDelete={() => toast("Đã xóa (demo)")} />
          ))}
        </div>
      )}
    </div>
  );
}

function ImageCard({
  image,
  onDelete,
}: {
  image: MediaImage;
  onDelete: () => void;
}) {
  const { toast } = useToast();
  const [copied, setCopied] = useState<"path" | "url" | null>(null);
  const src = clientAssetUrl(image.path);
  const isBlob = image.path.startsWith("blob:");

  const copy = async (text: string, kind: "path" | "url") => {
    await navigator.clipboard.writeText(text);
    setCopied(kind);
    toast(kind === "path" ? "Đã copy đường dẫn" : "Đã copy URL");
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <Card className="group overflow-hidden">
      <div className="relative aspect-square bg-zinc-50">
        <Image
          src={isBlob ? image.path : src}
          alt={image.name}
          fill
          className="object-contain p-1"
          unoptimized
        />
        {isBlob ? (
          <Badge className="absolute left-1.5 top-1.5 text-[10px]">Mới</Badge>
        ) : null}
        <div className="absolute inset-0 flex items-end justify-center gap-1 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
          {!isBlob ? (
            <>
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
            </>
          ) : null}
          <button
            type="button"
            title="Xóa"
            onClick={onDelete}
            className="rounded-md bg-white/90 p-1.5 text-red-600 hover:bg-white"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <p className="truncate px-2 py-1.5 font-mono text-[10px] text-zinc-500" title={image.name}>
        {image.name}
      </p>
    </Card>
  );
}
