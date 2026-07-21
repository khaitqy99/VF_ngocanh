"use client";

import { useCallback, useEffect, useState } from "react";
import type { MediaFolder } from "@/lib/media-library";

type MediaFolderApi = {
  category: MediaFolder["category"];
  slug: string;
  name: string;
  subtitle?: string;
  coverImage: string;
  storagePath: string;
  images: { id: string; name: string; path: string }[];
};

function mapApiFolders(payload: MediaFolderApi[]): MediaFolder[] {
  return payload.map((folder) => ({
    category: folder.category,
    slug: folder.slug,
    name: folder.name,
    subtitle: folder.subtitle,
    coverImage: folder.coverImage,
    storagePath: folder.storagePath,
    images: folder.images,
  }));
}

export function useMediaFolders(initialFolders: MediaFolder[]) {
  const [folders, setFolders] = useState(initialFolders);
  const [refreshing, setRefreshing] = useState(false);

  const refreshFolders = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/cms/media-images", {
        credentials: "include",
        cache: "no-store",
      });
      if (!res.ok) return;
      const data = await res.json();
      const next = mapApiFolders((data?.folders ?? []) as MediaFolderApi[]);
      if (next.length) setFolders(next);
    } catch {
      // Giữ dữ liệu SSR nếu fetch thất bại
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void refreshFolders();
  }, [refreshFolders]);

  useEffect(() => {
    const onFocus = () => {
      void refreshFolders();
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [refreshFolders]);

  return { folders, refreshing, refreshFolders };
}

export function useMediaFolder(initialFolder: MediaFolder | null, category: string, slug: string) {
  const [folder, setFolder] = useState<MediaFolder | null>(initialFolder);
  const [loading, setLoading] = useState(!initialFolder);

  const refreshFolder = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/cms/media-folder?category=${encodeURIComponent(category)}&slug=${encodeURIComponent(slug)}`,
        { credentials: "include", cache: "no-store" },
      );
      if (!res.ok) return;
      const data = await res.json();
      if (data?.folder) setFolder(data.folder as MediaFolder);
    } catch {
      // Giữ folder SSR nếu có
    } finally {
      setLoading(false);
    }
  }, [category, slug]);

  useEffect(() => {
    void refreshFolder();
  }, [refreshFolder]);

  return { folder, loading, refreshFolder };
}
