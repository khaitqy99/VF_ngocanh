"use client";

import { useEffect, useState } from "react";

function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

function appendPreviewToken(path: string, token: string): string {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}pt=${encodeURIComponent(token)}`;
}

/** Lấy URL iframe preview kèm token ký — chỉ admin đã đăng nhập gọi được API. */
export function usePreviewIframeSrc(previewPath: string): string | null {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const base = `${getSiteUrl()}${previewPath}`;

    fetch("/api/preview-token", { credentials: "include", cache: "no-store" })
      .then((response) => response.json())
      .then((data: { token?: string | null }) => {
        if (cancelled) return;
        if (data.token) {
          setSrc(`${getSiteUrl()}${appendPreviewToken(previewPath, data.token)}`);
          return;
        }
        setSrc(base);
      })
      .catch(() => {
        if (!cancelled) setSrc(base);
      });

    return () => {
      cancelled = true;
    };
  }, [previewPath]);

  return src;
}
