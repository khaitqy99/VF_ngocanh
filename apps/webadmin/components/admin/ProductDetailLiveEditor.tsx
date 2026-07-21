"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  FolderOpen,
  Loader2,
  RefreshCw,
  RotateCcw,
  Save,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/core";
import { useToast } from "@/components/admin/ToastProvider";
import { GlobalMediaPicker } from "@/components/admin/GlobalMediaPicker";
import { usePreviewIframeSrc } from "@/lib/use-preview-iframe-src";
import { usePreviewImageActions } from "@/lib/use-preview-image-actions";
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
  if (previewIdx === 1) {
    return { productId: null, productType };
  }
  return { productId: segments[previewIdx - 1] ?? null, productType };
}

export function ProductDetailLiveEditor({
  listHref,
  listLabel,
  productName,
  previewPath,
  inlineEdit = true,
  mediaCategory,
  mediaSlug,
}: {
  listHref: string;
  listLabel: string;
  productName: string;
  previewPath: string;
  inlineEdit?: boolean;
  mediaCategory?: MediaCategory;
  mediaSlug?: string;
}) {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const iframeSrc = usePreviewIframeSrc(previewPath);
  const { toast } = useToast();
  const [iframeKey, setIframeKey] = useState(0);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const {
    uploadInputRef,
    uploading,
    imagePicker,
    setImagePicker,
    handleImageSelect,
    onUploadInputChange,
    openLibrary,
    startUpload,
  } = usePreviewImageActions({
    toast,
    siteUrl,
    iframeRef,
    defaultCategory: mediaCategory,
    defaultSlug: mediaSlug,
  });

  const { productId, productType } = parsePreviewEditorPath(previewPath);
  const canManageStatus = Boolean(productId && productType);
  const canManageMedia = Boolean(mediaCategory && mediaSlug);

  const notifyIframeEditMode = () => {
    iframeRef.current?.contentWindow?.postMessage({ type: "vf-admin-enable-edit" }, siteUrl);
  };

  useEffect(() => {
    if (!inlineEdit) return;

    let siteOrigin: string;
    try {
      siteOrigin = new URL(siteUrl).origin;
    } catch {
      return;
    }

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== siteOrigin) return;
      if (event.data?.type !== "vf-preview-ready") return;
      notifyIframeEditMode();
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [inlineEdit, siteUrl, iframeKey]);

  const handleIframeLoad = () => {
    if (!inlineEdit) return;
    notifyIframeEditMode();
    for (const delay of [300, 800, 1500]) {
      window.setTimeout(notifyIframeEditMode, delay);
    }
  };

  const handleStatusUpdate = async (status: "draft" | "published" | "archived") => {
    if (!productId || !productType || statusUpdating) return;

    const endpoint =
      productType === "accessory"
        ? `/api/accessories/${encodeURIComponent(productId)}`
        : `/api/vehicles/${encodeURIComponent(productId)}?type=${productType}`;

    if (status === "published") {
      try {
        const checkRes = await fetch(endpoint, { credentials: "include" });
        const checkData = await checkRes.json();
        if (checkRes.ok && Array.isArray(checkData.publishCheck) && checkData.publishCheck.length > 0) {
          const lines = [
            "Sản phẩm chưa hoàn thiện:",
            ...checkData.publishCheck.map((item: { label: string }) => `• ${item.label}`),
            "",
            "Vẫn xuất bản?",
          ];
          if (!window.confirm(lines.join("\n"))) return;
        }
      } catch {
        // Bỏ qua nếu không kiểm tra được — vẫn cho publish
      }
    }

    setStatusUpdating(true);
    try {
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

  const triggerPreviewSave = () => {
    iframeRef.current?.contentWindow?.postMessage({ type: "vf-admin-trigger-save" }, siteUrl);
  };

  const triggerPreviewReset = () => {
    iframeRef.current?.contentWindow?.postMessage({ type: "vf-admin-trigger-reset" }, siteUrl);
  };

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.data?.type === "vf-admin-unsaved-changes") {
        setHasUnsavedChanges(Boolean(event.data.hasUnsavedChanges));
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  useEffect(() => {
    const onMessage = async (event: MessageEvent) => {
      if (event.data?.type === "vf-admin-saved") {
        const savedProductId = event.data.productId as string | undefined;
        const savedProductType = event.data.productType as "car" | "scooter" | "accessory" | undefined;
        const patches = event.data.patches as Record<string, unknown> | undefined;

        if (!savedProductId || !patches || Object.keys(patches).length === 0) {
          toast("Không có thay đổi để lưu");
          return;
        }

        try {
          const isAccessory = savedProductType === "accessory";
          const response = await fetch(
            isAccessory
              ? `/api/accessories/${encodeURIComponent(savedProductId)}`
              : `/api/vehicles/${encodeURIComponent(savedProductId)}`,
            {
              method: "PATCH",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(
                isAccessory ? { patches } : { patches, vehicleType: savedProductType },
              ),
            },
          );

          if (!response.ok) {
            const data = (await response.json().catch(() => null)) as { error?: string } | null;
            throw new Error(data?.error ?? "Lưu thất bại");
          }

          toast("Đã lưu thay đổi vào database");
          setHasUnsavedChanges(false);
          setIframeKey((k) => k + 1);
        } catch (error) {
          const message = error instanceof Error ? error.message : "Lưu thất bại";
          toast(message);
        }
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [toast]);

  return (
    <div className="-mx-4 flex min-h-[calc(100vh-4rem)] flex-col md:-mx-8">
      <input
        ref={uploadInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={onUploadInputChange}
      />

      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-zinc-200 bg-white px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-2 text-sm text-zinc-500">
          <Link href={listHref} className="shrink-0 hover:text-zinc-900">
            {listLabel}
          </Link>
          <ChevronRight className="h-4 w-4 shrink-0" />
          <span className="truncate font-medium text-zinc-900">{productName}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {canManageMedia ? (
            <>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={uploading}
                onClick={() => startUpload()}
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    Đang upload...
                  </>
                ) : (
                  <>
                    <Upload className="mr-1.5 h-3.5 w-3.5" />
                    Upload ảnh
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => openLibrary()}>
                <FolderOpen className="mr-1.5 h-3.5 w-3.5" />
                Thư viện ảnh
              </Button>
            </>
          ) : null}
          {inlineEdit && productId ? (
            <>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!hasUnsavedChanges}
                onClick={triggerPreviewReset}
              >
                <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                Hoàn tác
              </Button>
              <Button type="button" size="sm" disabled={!hasUnsavedChanges} onClick={triggerPreviewSave}>
                <Save className="mr-1.5 h-3.5 w-3.5" />
                Lưu
              </Button>
            </>
          ) : null}
          {canManageStatus ? (
            <>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={statusUpdating}
                onClick={() => handleStatusUpdate("draft")}
              >
                Chuyển nháp
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
        </div>
      </div>

      {iframeSrc ? (
        <iframe
          ref={iframeRef}
          key={iframeKey}
          title={`Xem trước ${productName}`}
          src={iframeSrc}
          onLoad={inlineEdit ? handleIframeLoad : undefined}
          className="min-h-0 w-full flex-1 border-0 bg-white"
        />
      ) : (
        <div className="flex min-h-0 flex-1 items-center justify-center text-sm text-zinc-500">
          Đang tải preview...
        </div>
      )}

      {imagePicker ? (
        <GlobalMediaPicker
          open
          defaultCategory={imagePicker.category}
          defaultFolderSlug={imagePicker.slug}
          title={
            imagePicker.kind === "svg"
              ? "Chọn icon SVG"
              : imagePicker.path
                ? "Chọn ảnh cho preview"
                : "Thư viện ảnh sản phẩm"
          }
          filterKind={imagePicker.kind}
          onClose={() => setImagePicker(null)}
          onSelect={handleImageSelect}
        />
      ) : null}
    </div>
  );
}
