"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronRight, ExternalLink, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/core";
import { useToast } from "@/components/admin/ToastProvider";
import { GlobalMediaPicker } from "@/components/admin/GlobalMediaPicker";
import { usePreviewIframeSrc } from "@/lib/use-preview-iframe-src";
import type { MediaCategory } from "@/lib/media-library";
import { STATIC_PAGE_META, type StaticPageSlug } from "@/lib/cms/static-pages";

export function StaticPageLiveEditor({ slug }: { slug: StaticPageSlug }) {
  const meta = STATIC_PAGE_META[slug];
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const previewPath = `${meta.path}/preview`;
  const iframeSrc = usePreviewIframeSrc(previewPath);
  const { toast } = useToast();
  const [iframeKey, setIframeKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [imagePicker, setImagePicker] = useState<{ path: string } | null>(null);

  const notifyIframeEditMode = () => {
    iframeRef.current?.contentWindow?.postMessage({ type: "vf-admin-enable-edit" }, siteUrl);
  };

  useEffect(() => {
    let siteOrigin: string;
    try {
      siteOrigin = new URL(siteUrl).origin;
    } catch {
      return;
    }

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== siteOrigin) return;

      if (event.data?.type === "vf-preview-ready") {
        notifyIframeEditMode();
        return;
      }

      if (event.data?.type === "vf-admin-pick-image" && event.data.productType === "static-page") {
        if (event.data.slug === slug && event.data.path) {
          setImagePicker({ path: event.data.path });
        }
        return;
      }

      if (
        event.data?.type === "vf-admin-saved" &&
        event.data.productType === "static-page" &&
        event.data.slug === slug
      ) {
        const payload = event.data.payload as
          | { content?: Record<string, unknown>; banners?: unknown[]; status?: string }
          | undefined;
        if (!payload?.content) {
          toast("Không có dữ liệu để lưu");
          return;
        }

        fetch(`/api/cms/pages/${encodeURIComponent(slug)}`, {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: payload.content,
            banners: payload.banners,
            status: payload.status ?? "published",
          }),
        })
          .then(async (response) => {
            if (!response.ok) {
              const data = (await response.json().catch(() => null)) as { error?: string } | null;
              throw new Error(data?.error ?? "Lưu thất bại");
            }
            toast(`Đã lưu nội dung ${meta.label}`);
            setIframeKey((key) => key + 1);
          })
          .catch((error) => {
            toast(error instanceof Error ? error.message : "Lưu thất bại");
          });
      }
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [siteUrl, toast, iframeKey, slug, meta.label]);

  const handleIframeLoad = () => {
    notifyIframeEditMode();
    for (const delay of [300, 800, 1500]) {
      window.setTimeout(notifyIframeEditMode, delay);
    }
  };

  const handleImageSelect = (imagePath: string) => {
    if (!imagePicker) return;
    iframeRef.current?.contentWindow?.postMessage(
      {
        type: "vf-admin-image-selected",
        productType: "static-page",
        slug,
        path: imagePicker.path,
        imagePath,
      },
      siteUrl,
    );
    setImagePicker(null);
    toast("Đã chọn ảnh");
  };

  const mediaCategory: MediaCategory = "pages";

  return (
    <div className="-mx-4 flex min-h-[calc(100vh-4rem)] flex-col md:-mx-8">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-zinc-200 bg-white px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-2 text-sm text-zinc-500">
          <Link href="/admin/pages" className="shrink-0 hover:text-zinc-900">
            Nội dung trang
          </Link>
          <ChevronRight className="h-4 w-4 shrink-0" />
          <span className="truncate font-medium text-zinc-900">{meta.label}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => setIframeKey((k) => k + 1)}>
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
            Tải lại
          </Button>
          <a
            href={`${siteUrl}${meta.path}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-zinc-200 px-3 text-xs font-medium hover:bg-zinc-50"
          >
            Website
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

        <p className="shrink-0 border-b border-zinc-100 bg-zinc-50 px-4 py-1.5 text-center text-xs text-zinc-500">
        Bấm trực tiếp vào chữ hoặc ảnh để sửa — Banner: đổi ảnh desktop/mobile, thêm/xóa/sắp xếp slide — Lưu ở thanh dưới
      </p>

      {iframeSrc ? (
        <iframe
          ref={iframeRef}
          key={iframeKey}
          title={`Xem trước ${meta.label}`}
          src={iframeSrc}
          onLoad={handleIframeLoad}
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
          defaultCategory={mediaCategory}
          defaultFolderSlug={slug}
          title="Chọn ảnh cho trang"
          onClose={() => setImagePicker(null)}
          onSelect={handleImageSelect}
        />
      ) : null}
    </div>
  );
}
