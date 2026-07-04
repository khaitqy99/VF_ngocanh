"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/core";
import { useToast } from "@/components/admin/ToastProvider";
import { MediaLibraryPicker } from "@/components/admin/MediaLibraryPicker";
import type { MediaCategory } from "@/lib/media-library";

function parsePreviewEditorPath(previewPath: string): {
  productId: string | null;
  productType: "car" | "scooter" | "accessory" | null;
} {
  const segments = previewPath.split("?")[0].split("/").filter(Boolean);
  const previewIdx = segments.lastIndexOf("preview");

  const productType: "car" | "scooter" | "accessory" | null = previewPath.startsWith("/oto/")
    ? "car"
    : previewPath.startsWith("/xe-may-dien/")
      ? "scooter"
      : previewPath.startsWith("/phu-kien/")
        ? "accessory"
        : null;

  if (previewIdx === -1) {
    return { productId: segments[1] ?? null, productType };
  }
  // /oto/preview, /xe-may-dien/preview, /phu-kien/preview — chỉnh catalog, không có 1 productId
  if (previewIdx === 1) {
    return { productId: null, productType };
  }
  // /oto/{id}/preview
  return { productId: segments[previewIdx - 1] ?? null, productType };
}

export function ProductDetailLiveEditor({
  listHref,
  listLabel,
  productName,
  previewPath,
  publicHref,
  inlineEdit = true,
  mediaCategory,
  mediaSlug,
  editorHint,
}: {
  listHref: string;
  listLabel: string;
  productName: string;
  previewPath: string;
  publicHref: string;
  inlineEdit?: boolean;
  mediaCategory?: MediaCategory;
  mediaSlug?: string;
  editorHint?: string;
}) {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const { toast } = useToast();
  const [iframeKey, setIframeKey] = useState(0);
  const [iframePreviewUrl, setIframePreviewUrl] = useState<string | null>(
    inlineEdit ? null : `${siteUrl}${previewPath}`,
  );
  const [previewLoading, setPreviewLoading] = useState(inlineEdit);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [imagePicker, setImagePicker] = useState<{
    path: string;
    category: MediaCategory;
    slug: string;
    productId?: string;
    kind?: "image" | "svg";
  } | null>(null);

  const { productId, productType } = parsePreviewEditorPath(previewPath);
  const canManageStatus = Boolean(productId && productType);

  useEffect(() => {
    if (!inlineEdit) {
      setIframePreviewUrl(`${siteUrl}${previewPath}`);
      setPreviewLoading(false);
      setPreviewError(null);
      return;
    }

    let cancelled = false;
    setPreviewLoading(true);
    setPreviewError(null);

    fetch(`/api/preview-edit-url?path=${encodeURIComponent(previewPath)}`, {
      credentials: "include",
    })
      .then(async (res) => {
        const data = (await res.json()) as { url?: string; error?: string };
        if (cancelled) return;
        if (!res.ok || !data.url) {
          setPreviewError(
            data.error ??
              "Không tạo được link chỉnh sửa. Kiểm tra REVALIDATION_SECRET trên Vercel (admin + webclient).",
          );
          setIframePreviewUrl(`${siteUrl}${previewPath}`);
          return;
        }
        setIframePreviewUrl(data.url);
      })
      .catch(() => {
        if (!cancelled) {
          setPreviewError("Không kết nối được API preview trên admin.");
          setIframePreviewUrl(`${siteUrl}${previewPath}`);
        }
      })
      .finally(() => {
        if (!cancelled) setPreviewLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [previewPath, inlineEdit, siteUrl, iframeKey]);

  const handleStatusUpdate = async (status: "draft" | "published" | "archived") => {
    if (!productId || !productType || statusUpdating) return;
    setStatusUpdating(true);
    try {
      const endpoint =
        productType === "accessory"
          ? `/api/accessories/${encodeURIComponent(productId)}`
          : `/api/vehicles/${encodeURIComponent(productId)}`;
      const payload =
        productType === "accessory"
          ? { status }
          : { status, vehicleType: productType };
      const response = await fetch(endpoint, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "Cập nhật trạng thái thất bại");
      }
      toast(status === "published" ? "Đã xuất bản sản phẩm" : "Đã chuyển về bản nháp");
      setIframeKey((k) => k + 1);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Cập nhật trạng thái thất bại";
      toast(message);
    } finally {
      setStatusUpdating(false);
    }
  };

  useEffect(() => {
    const onMessage = async (event: MessageEvent) => {
      if (event.data?.type === "vf-admin-saved") {
        const productId = event.data.productId as string | undefined;
        const productType = event.data.productType as "car" | "scooter" | "accessory" | undefined;
        const patches = event.data.patches as Record<string, unknown> | undefined;

        if (!productId || !patches || Object.keys(patches).length === 0) {
          toast("Không có thay đổi để lưu");
          return;
        }

        try {
          const isAccessory = productType === "accessory";
          const response = await fetch(
            isAccessory
              ? `/api/accessories/${encodeURIComponent(productId)}`
              : `/api/vehicles/${encodeURIComponent(productId)}`,
            {
              method: "PATCH",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(
                isAccessory ? { patches } : { patches, vehicleType: productType },
              ),
            },
          );

          if (!response.ok) {
            const data = (await response.json().catch(() => null)) as { error?: string } | null;
            throw new Error(data?.error ?? "Lưu thất bại");
          }

          toast("Đã lưu thay đổi vào database");
          setIframeKey((k) => k + 1);
        } catch (error) {
          const message = error instanceof Error ? error.message : "Lưu thất bại";
          toast(message);
        }
      }
      if (event.data?.type === "vf-admin-pick-image" && event.data.path) {
        const category = (event.data.category ?? mediaCategory) as MediaCategory | undefined;
        const slug = event.data.slug ?? mediaSlug;
        if (category && slug) {
          setImagePicker({
            path: event.data.path,
            category,
            slug,
            productId: event.data.productId ?? event.data.slug,
            kind: event.data.kind === "svg" ? "svg" : "image",
          });
        } else {
          toast("Không xác định được thư mục ảnh sản phẩm");
        }
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [toast, mediaCategory, mediaSlug]);

  const handleImageSelect = (imagePath: string) => {
    if (!imagePicker) return;
    iframeRef.current?.contentWindow?.postMessage(
      {
        type: "vf-admin-image-selected",
        path: imagePicker.path,
        imagePath,
        productId: imagePicker.productId,
      },
      siteUrl,
    );
    setImagePicker(null);
    toast("Đã chọn ảnh");
  };

  return (
    <div className="-mx-4 flex min-h-[calc(100vh-4rem)] flex-col md:-mx-8">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-zinc-200 bg-white px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-2 text-sm text-zinc-500">
          <Link href={listHref} className="shrink-0 hover:text-zinc-900">
            {listLabel}
          </Link>
          <ChevronRight className="h-4 w-4 shrink-0" />
          <span className="truncate font-medium text-zinc-900">
            {productName}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {canManageStatus ? (
            <>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={statusUpdating}
                onClick={() => handleStatusUpdate("draft")}
              >
                Nháp
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={statusUpdating}
                onClick={() => handleStatusUpdate("published")}
              >
                Xuất bản
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={statusUpdating}
                onClick={() => handleStatusUpdate("archived")}
              >
                Lưu trữ
              </Button>
            </>
          ) : null}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIframeKey((k) => k + 1)}
          >
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
            Tải lại
          </Button>
          <Link
            href={publicHref}
            target="_blank"
            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-zinc-200 px-3 text-xs font-medium hover:bg-zinc-50"
          >
            Website
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {previewError ? (
        <p className="shrink-0 border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-xs text-amber-900">
          {previewError}
        </p>
      ) : null}

      {inlineEdit ? (
        <p className="shrink-0 border-b border-zinc-100 bg-zinc-50 px-4 py-1.5 text-center text-xs text-zinc-500">
          {editorHint ??
            "Chỉnh sửa trực tiếp trên form — bấm Lưu sau khi hoàn tất · + Thêm / × cho danh sách & màu sắc"}
        </p>
      ) : null}

      {previewLoading || !iframePreviewUrl ? (
        <div className="flex min-h-0 flex-1 items-center justify-center bg-zinc-50 text-sm text-zinc-500">
          Đang tải preview chỉnh sửa...
        </div>
      ) : (
        <iframe
          ref={iframeRef}
          key={iframeKey}
          title={`Xem trước ${productName}`}
          src={iframePreviewUrl}
          className="min-h-0 w-full flex-1 border-0 bg-white"
        />
      )}

      {imagePicker ? (
        <MediaLibraryPicker
          open
          category={imagePicker.category}
          slug={imagePicker.slug}
          title={imagePicker.kind === "svg" ? "Chọn icon SVG" : "Chọn ảnh cho preview"}
          filterKind={imagePicker.kind}
          onClose={() => setImagePicker(null)}
          onSelect={handleImageSelect}
        />
      ) : null}
    </div>
  );
}
