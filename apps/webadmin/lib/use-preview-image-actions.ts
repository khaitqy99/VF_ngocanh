"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import type { MediaCategory } from "@/lib/media-library";

export type PreviewImageTarget = {
  path: string;
  category: MediaCategory;
  slug: string;
  productId?: string;
  kind?: "image" | "svg";
};

export function usePreviewImageActions({
  toast,
  siteUrl,
  iframeRef,
  defaultCategory,
  defaultSlug,
}: {
  toast: (message: string, type?: "success" | "error") => void;
  siteUrl: string;
  iframeRef: RefObject<HTMLIFrameElement | null>;
  defaultCategory?: MediaCategory;
  defaultSlug?: string;
}) {
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const [imagePicker, setImagePicker] = useState<PreviewImageTarget | null>(null);
  const [uploadTarget, setUploadTarget] = useState<PreviewImageTarget | null>(null);
  const [uploading, setUploading] = useState(false);

  const resolveTarget = useCallback(
    (data: Record<string, unknown>): PreviewImageTarget | null => {
      const category = (data.category ?? defaultCategory) as MediaCategory | undefined;
      const slug = typeof data.slug === "string" ? data.slug : defaultSlug;
      const path = typeof data.path === "string" ? data.path : "";
      if (!category || !slug) return null;
      return {
        path,
        category,
        slug,
        productId:
          typeof data.productId === "string"
            ? data.productId
            : typeof data.slug === "string"
              ? data.slug
              : defaultSlug,
        kind: data.kind === "svg" ? "svg" : "image",
      };
    },
    [defaultCategory, defaultSlug],
  );

  const applyImageToPreview = useCallback(
    (target: PreviewImageTarget, imagePath: string) => {
      if (!target.path) return;
      iframeRef.current?.contentWindow?.postMessage(
        {
          type: "vf-admin-image-selected",
          path: target.path,
          imagePath,
          productId: target.productId,
        },
        siteUrl,
      );
    },
    [iframeRef, siteUrl],
  );

  const uploadFiles = useCallback(
    async (target: PreviewImageTarget, files: FileList | File[]) => {
      const list = Array.from(files).filter((file) => file.type.startsWith("image/"));
      if (!list.length) {
        toast("Không có file ảnh hợp lệ", "error");
        return;
      }
      if (uploading) return;

      const formData = new FormData();
      formData.set("category", target.category);
      formData.set("slug", target.slug);
      for (const file of list) {
        formData.append("files", file);
      }

      setUploading(true);
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

        const uploaded = Array.isArray(data.uploaded) ? data.uploaded : [];
        toast(`Đã upload ${uploaded.length}/${list.length} ảnh`);
        if (Array.isArray(data.errors) && data.errors.length) {
          toast(data.errors.join(" · "), "error");
        }

        if (target.path && uploaded[0]?.path) {
          applyImageToPreview(target, uploaded[0].path);
          toast("Đã cập nhật ảnh trên preview");
        }
      } catch {
        toast("Upload thất bại — kiểm tra kết nối", "error");
      } finally {
        setUploading(false);
        setUploadTarget(null);
      }
    },
    [applyImageToPreview, toast, uploading],
  );

  const onUploadInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length || !uploadTarget) return;
    await uploadFiles(uploadTarget, files);
    event.target.value = "";
  };

  const startUpload = useCallback(
    (partial?: Partial<PreviewImageTarget>) => {
      if (!defaultCategory || !defaultSlug) {
        toast("Không xác định được thư mục ảnh sản phẩm", "error");
        return;
      }
      const target: PreviewImageTarget = {
        path: partial?.path ?? "",
        category: partial?.category ?? defaultCategory,
        slug: partial?.slug ?? defaultSlug,
        productId: partial?.productId ?? defaultSlug,
        kind: partial?.kind ?? "image",
      };
      setUploadTarget(target);
      uploadInputRef.current?.click();
    },
    [defaultCategory, defaultSlug, toast],
  );

  const openLibrary = useCallback(
    (partial?: Partial<PreviewImageTarget>) => {
      if (!defaultCategory || !defaultSlug) {
        toast("Không xác định được thư mục ảnh sản phẩm", "error");
        return;
      }
      setImagePicker({
        path: partial?.path ?? "",
        category: partial?.category ?? defaultCategory,
        slug: partial?.slug ?? defaultSlug,
        productId: partial?.productId ?? defaultSlug,
        kind: partial?.kind ?? "image",
      });
    },
    [defaultCategory, defaultSlug, toast],
  );

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.data?.type === "vf-admin-pick-image") {
        const target = resolveTarget(event.data as Record<string, unknown>);
        if (!target) {
          toast("Không xác định được thư mục ảnh", "error");
          return;
        }
        setImagePicker(target);
      }
      if (event.data?.type === "vf-admin-upload-image") {
        const target = resolveTarget(event.data as Record<string, unknown>);
        if (!target) {
          toast("Không xác định được thư mục ảnh", "error");
          return;
        }
        setUploadTarget(target);
        uploadInputRef.current?.click();
      }
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [resolveTarget, toast]);

  const handleImageSelect = (imagePath: string) => {
    if (!imagePicker) return;
    if (imagePicker.path) {
      applyImageToPreview(imagePicker, imagePath);
      toast("Đã chọn ảnh");
    } else {
      toast("Ảnh đã có trong thư viện sản phẩm");
    }
    setImagePicker(null);
  };

  return {
    uploadInputRef,
    uploading,
    imagePicker,
    setImagePicker,
    handleImageSelect,
    onUploadInputChange,
    openLibrary,
    startUpload,
  };
}
