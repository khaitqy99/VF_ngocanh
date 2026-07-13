"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronDown, ChevronUp, GripVertical, Loader2, Pencil } from "lucide-react";
import { Button, Card, CardContent } from "@/components/ui/core";
import { useToast } from "@/components/admin/ToastProvider";
import { ProductDeleteButton } from "@/components/admin/ProductDeleteButton";
import type { ProductType } from "@/lib/product-api";

type SortItem = {
  id: string;
  name: string;
  sortOrder: number;
  status?: string;
};

function moveItem<T>(items: T[], from: number, to: number): T[] {
  if (from < 0 || from >= items.length || to < 0 || to >= items.length || from === to) {
    return items;
  }
  const next = [...items];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved!);
  return next;
}

const KIND_LABEL: Record<ProductType, string> = {
  car: "ô tô",
  scooter: "xe máy",
  accessory: "phụ kiện",
};

export function ProductSortPanel({
  kind,
  listHref,
}: {
  kind: ProductType;
  listHref: string;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [listOpen, setListOpen] = useState(false);
  const [sortMode, setSortMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [items, setItems] = useState<SortItem[]>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const catalogUrl = kind === "accessory" ? "/api/accessories" : `/api/vehicles?type=${kind}`;

  const loadItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(catalogUrl, { credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Không tải được danh sách");
      setItems(
        (data.items ?? []).map((item: SortItem) => ({
          id: item.id,
          name: item.name,
          sortOrder: item.sortOrder ?? 0,
          status: item.status,
        })),
      );
      setLoaded(true);
    } catch (error) {
      toast(error instanceof Error ? error.message : "Không tải được danh sách");
    } finally {
      setLoading(false);
    }
  }, [catalogUrl, toast]);

  useEffect(() => {
    if (listOpen && !loaded && !loading) {
      void loadItems();
    }
  }, [listOpen, loaded, loading, loadItems]);

  const saveOrder = async (nextItems: SortItem[]) => {
    setSaving(true);
    try {
      const res = await fetch("/api/products/sort-order", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind,
          orderedIds: nextItems.map((item) => item.id),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Lưu thứ tự thất bại");
      toast("Đã cập nhật thứ tự hiển thị trên web");
      router.refresh();
    } catch (error) {
      toast(error instanceof Error ? error.message : "Lưu thứ tự thất bại");
      void loadItems();
    } finally {
      setSaving(false);
    }
  };

  const onDrop = async (targetIndex: number) => {
    if (dragIndex == null || dragIndex === targetIndex) {
      setDragIndex(null);
      return;
    }
    const next = moveItem(items, dragIndex, targetIndex);
    setItems(next);
    setDragIndex(null);
    await saveOrder(next);
  };

  const toggleList = () => {
    setListOpen((open) => {
      if (open) setSortMode(false);
      return !open;
    });
  };

  const subtitle = loaded
    ? `${items.length} sản phẩm · Sửa, SEO, xóa, sắp xếp`
    : "Sửa nội dung, thông tin, SEO hoặc xóa từng sản phẩm";

  return (
    <Card className="mx-4 md:mx-0">
      <button
        type="button"
        onClick={toggleList}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-zinc-50"
      >
        <div className="min-w-0">
          <p className="text-sm font-semibold text-zinc-900">Quản lý {KIND_LABEL[kind]}</p>
          <p className="text-xs text-zinc-500">{subtitle}</p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-zinc-600">
          {listOpen ? "Thu gọn" : "Mở danh sách"}
          {listOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </span>
      </button>

      {listOpen ? (
        <CardContent className="space-y-3 border-t border-zinc-100 p-4 pt-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-zinc-500">
              {sortMode
                ? "Kéo thả để đổi thứ tự hiển thị trên web"
                : "Chọn thao tác cho từng sản phẩm"}
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={loading || items.length < 2}
              onClick={() => setSortMode((value) => !value)}
            >
              <GripVertical className="mr-1 h-3.5 w-3.5" />
              {sortMode ? "Xong sắp xếp" : "Sắp xếp thứ tự"}
            </Button>
          </div>

          {loading ? (
            <p className="flex items-center gap-2 text-sm text-zinc-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Đang tải danh sách...
            </p>
          ) : items.length === 0 ? (
            <p className="text-sm text-zinc-500">Chưa có sản phẩm.</p>
          ) : (
            <ul className="max-h-[min(420px,50vh)] space-y-2 overflow-y-auto pr-1">
              {items.map((item, index) => (
                <li
                  key={item.id}
                  draggable={sortMode && !saving}
                  onDragStart={() => sortMode && setDragIndex(index)}
                  onDragEnd={() => setDragIndex(null)}
                  onDragOver={(event) => sortMode && event.preventDefault()}
                  onDrop={() => sortMode && void onDrop(index)}
                  className={`flex flex-wrap items-center gap-2 rounded-lg border bg-white px-3 py-2.5 sm:gap-3 ${
                    dragIndex === index ? "border-red-300 bg-red-50" : "border-zinc-200"
                  }`}
                >
                  {sortMode ? (
                    <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-zinc-400" />
                  ) : null}
                  {sortMode ? (
                    <span className="w-6 text-center text-xs font-bold text-zinc-400">{index + 1}</span>
                  ) : null}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-zinc-900">{item.name}</p>
                    <p className="truncate text-xs text-zinc-500">{item.id}</p>
                  </div>
                  {item.status === "draft" ? (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                      Nháp
                    </span>
                  ) : null}
                  {!sortMode ? (
                    <div className="flex w-full flex-wrap items-center gap-2 sm:ml-auto sm:w-auto">
                      <Link
                        href={`${listHref}/${item.id}`}
                        className="inline-flex h-8 items-center rounded-md border border-zinc-200 px-2.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
                      >
                        <Pencil className="mr-1 h-3.5 w-3.5" />
                        Sửa
                      </Link>
                      <LinkButton href={`${listHref}/${item.id}?tab=settings`} label="Thông tin" />
                      <LinkButton href={`${listHref}/${item.id}?tab=seo`} label="SEO" />
                      <ProductDeleteButton
                        productId={item.id}
                        productName={item.name}
                        productType={kind}
                        listHref={listHref}
                        onDeleted={() => void loadItems()}
                      />
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
          {sortMode && saving ? (
            <p className="text-xs text-zinc-500">Đang lưu thứ tự...</p>
          ) : null}
        </CardContent>
      ) : null}
    </Card>
  );
}

function LinkButton({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex h-8 items-center rounded-md border border-zinc-200 px-2.5 text-xs font-medium text-zinc-600 hover:bg-zinc-50"
    >
      {label}
    </Link>
  );
}
