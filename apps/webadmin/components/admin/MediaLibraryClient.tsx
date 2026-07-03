"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, FolderOpen, ImageIcon } from "lucide-react";
import { Input, Card, Badge } from "@/components/ui/core";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/complex";
import { PageHeader } from "@/components/admin/PageHeader";
import {
  getMediaFoldersByCategory,
  getMediaCategoryLabel,
  MEDIA_CATEGORY_OPTIONS,
  type MediaCategory,
  type MediaFolder,
} from "@/lib/media-library";
import { clientAssetUrl } from "@/lib/product-utils";

const TAB_OPTIONS = MEDIA_CATEGORY_OPTIONS.filter((o) => o.value !== "all");

export function MediaLibraryClient({ folders }: { folders: MediaFolder[] }) {
  const [search, setSearch] = useState("");

  const filterFolders = (category: MediaCategory | "all") => {
    const list = getMediaFoldersByCategory(folders, category);
    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.slug.toLowerCase().includes(q) ||
        f.subtitle?.toLowerCase().includes(q),
    );
  };

  const totalFolders = folders.length;
  const totalImages = folders.reduce((sum, f) => sum + f.images.length, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Thư viện ảnh"
        description={`${totalFolders} thư mục · ${totalImages} ảnh — chia theo từng mẫu xe`}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Tìm thư mục xe..."
            className="bg-white pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <p className="text-sm text-zinc-500">
          Ảnh lưu tại <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs">Supabase Storage / media</code>
        </p>
      </div>

      <Tabs defaultValue="cars">
        <TabsList className="mb-4 flex h-auto flex-wrap gap-1">
          {TAB_OPTIONS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
              <span className="ml-1.5 text-xs text-zinc-400">
                ({filterFolders(tab.value as MediaCategory).length})
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        {TAB_OPTIONS.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <FolderGrid folders={filterFolders(tab.value as MediaCategory)} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function FolderGrid({ folders }: { folders: MediaFolder[] }) {
  if (folders.length === 0) {
    return (
      <Card className="p-12 text-center text-sm text-zinc-500">
        Không tìm thấy thư mục phù hợp.
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {folders.map((folder) => (
        <Link
          key={`${folder.category}-${folder.slug}`}
          href={`/admin/media/${folder.category}/${folder.slug}`}
        >
          <Card className="group h-full overflow-hidden transition-shadow hover:shadow-md">
            <div className="relative aspect-[4/3] bg-zinc-50">
              <Image
                src={clientAssetUrl(folder.coverImage)}
                alt={folder.name}
                fill
                className="object-contain p-3 transition-transform group-hover:scale-105"
                unoptimized
              />
              <div className="absolute right-2 top-2">
                <Badge variant="secondary" className="bg-white/90 text-xs shadow-sm">
                  {folder.images.length} ảnh
                </Badge>
              </div>
            </div>
            <div className="space-y-1 p-4">
              <div className="flex items-start gap-2">
                <FolderOpen className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-zinc-900">{folder.name}</p>
                  {folder.subtitle ? (
                    <p className="truncate text-xs text-zinc-500">{folder.subtitle}</p>
                  ) : null}
                </div>
              </div>
              <p className="truncate font-mono text-[11px] text-zinc-400">{folder.storagePath}</p>
              <p className="flex items-center gap-1 text-xs font-medium text-red-600">
                <ImageIcon className="h-3 w-3" />
                Mở thư mục
              </p>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
