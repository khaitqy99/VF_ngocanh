"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Textarea } from "@/components/ui/core";
import { PageHeader } from "@/components/admin/PageHeader";
import { useToast } from "@/components/admin/ToastProvider";
import { ProductDeleteButton } from "@/components/admin/ProductDeleteButton";
import type { AdminProductMeta, PublishStatus } from "@/lib/product-meta";
import type { ProductType } from "@/lib/product-api";

const STATUS_OPTIONS: { value: PublishStatus; label: string }[] = [
  { value: "draft", label: "Nháp" },
  { value: "published", label: "Đã xuất bản" },
  { value: "archived", label: "Lưu trữ" },
];

export function ProductSettingsClient({
  productType,
  productId,
  productName,
  listHref,
  listLabel,
  publicPathPrefix,
  onMetaSaved,
}: {
  productType: ProductType;
  productId: string;
  productName: string;
  listHref: string;
  listLabel: string;
  publicPathPrefix: string;
  onMetaSaved?: (meta: AdminProductMeta) => void;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<AdminProductMeta | null>(null);

  useEffect(() => {
    fetch(`/api/products/${productType}/${encodeURIComponent(productId)}/settings`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.meta) setForm(data.meta);
      })
      .catch(() => toast("Không tải được thông tin sản phẩm"))
      .finally(() => setLoading(false));
  }, [productType, productId, toast]);

  const save = async () => {
    if (!form) return;
    setSaving(true);
    try {
      const payload =
        productType === "accessory"
          ? {
              name: form.name,
              slug: form.slug,
              status: form.status,
              featured: form.featured,
              category: form.category,
              price: form.price,
              inStock: form.inStock,
            }
          : {
              name: form.name,
              slug: form.slug,
              status: form.status,
              featured: form.featured,
              tagline: form.tagline,
              category: form.category,
              startingPrice: form.startingPrice,
            };

      const res = await fetch(`/api/products/${productType}/${encodeURIComponent(productId)}/settings`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Lưu thất bại");

      setForm(data.meta);
      onMetaSaved?.(data.meta);
      toast("Đã lưu thông tin sản phẩm");
      router.refresh();
    } catch (error) {
      toast(error instanceof Error ? error.message : "Lưu thất bại");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-6 text-sm text-zinc-500">Đang tải thông tin…</p>;
  if (!form) return <p className="p-6 text-sm text-zinc-500">Không tải được thông tin sản phẩm.</p>;

  const publicUrl = `${publicPathPrefix}/${form.slug}`;

  return (
    <div className="space-y-6 p-4 md:p-6">
      <PageHeader
        title={`Thông tin — ${productName}`}
        description={`${listLabel} · Chỉnh slug, tên hiển thị và trạng thái`}
      />

      {!form.inDatabase ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Sản phẩm đang dùng dữ liệu mặc định. Lưu lần đầu sẽ tạo bản ghi trong database để chỉnh slug/SEO.
        </p>
      ) : null}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Định danh & URL</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-zinc-700">ID (không đổi)</label>
            <Input value={form.id} readOnly className="bg-zinc-50" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-zinc-700">Tên hiển thị</label>
            <Input
              value={form.name}
              onChange={(e) => setForm((prev) => (prev ? { ...prev, name: e.target.value } : prev))}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-zinc-700">Slug URL</label>
            <Input
              value={form.slug}
              onChange={(e) => setForm((prev) => (prev ? { ...prev, slug: e.target.value } : prev))}
              placeholder="vf9-plus"
            />
            <p className="mt-1 text-[11px] text-zinc-500">
              URL công khai: <code className="rounded bg-zinc-100 px-1">{publicUrl}</code>
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Trạng thái & hiển thị</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-zinc-700">Trạng thái</label>
            <select
              className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm"
              value={form.status}
              onChange={(e) =>
                setForm((prev) =>
                  prev ? { ...prev, status: e.target.value as PublishStatus } : prev,
                )
              }
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) =>
                setForm((prev) => (prev ? { ...prev, featured: e.target.checked } : prev))
              }
            />
            Sản phẩm nổi bật
          </label>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Thông tin bổ sung</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {productType === "accessory" ? (
            <>
              <div>
                <label className="mb-1 block text-xs font-semibold text-zinc-700">Danh mục</label>
                <Input
                  value={form.category ?? ""}
                  onChange={(e) =>
                    setForm((prev) => (prev ? { ...prev, category: e.target.value } : prev))
                  }
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-zinc-700">Giá (VNĐ)</label>
                <Input
                  type="number"
                  min={0}
                  value={form.price ?? ""}
                  onChange={(e) =>
                    setForm((prev) =>
                      prev
                        ? {
                            ...prev,
                            price: e.target.value === "" ? undefined : Number(e.target.value),
                          }
                        : prev,
                    )
                  }
                />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.inStock ?? true}
                  onChange={(e) =>
                    setForm((prev) => (prev ? { ...prev, inStock: e.target.checked } : prev))
                  }
                />
                Còn hàng
              </label>
            </>
          ) : (
            <>
              <div>
                <label className="mb-1 block text-xs font-semibold text-zinc-700">Tagline / mô tả ngắn</label>
                <Textarea
                  rows={2}
                  value={form.tagline ?? ""}
                  onChange={(e) =>
                    setForm((prev) => (prev ? { ...prev, tagline: e.target.value } : prev))
                  }
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-zinc-700">Giá từ (VNĐ)</label>
                <Input
                  type="number"
                  min={0}
                  value={form.startingPrice ?? ""}
                  onChange={(e) =>
                    setForm((prev) =>
                      prev
                        ? {
                            ...prev,
                            startingPrice: e.target.value === "" ? undefined : Number(e.target.value),
                          }
                        : prev,
                    )
                  }
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Button type="button" onClick={() => void save()} disabled={saving}>
        <Save className="mr-2 h-4 w-4" />
        {saving ? "Đang lưu…" : "Lưu thông tin"}
      </Button>

      <Card className="border-red-200 bg-red-50/40">
        <CardHeader>
          <CardTitle className="text-sm text-red-800">Vùng nguy hiểm</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-zinc-600">
            Xóa vĩnh viễn sản phẩm khỏi website
            {productType === "accessory"
              ? " (không xóa ảnh thư mục phụ kiện chung)."
              : " cùng toàn bộ ảnh trong thư mục riêng."}
          </p>
          <ProductDeleteButton
            productId={productId}
            productName={form.name}
            productType={productType}
            listHref={listHref}
          />
        </CardContent>
      </Card>
    </div>
  );
}
