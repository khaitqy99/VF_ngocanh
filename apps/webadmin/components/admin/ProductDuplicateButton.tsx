"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy } from "lucide-react";
import { Button, Input } from "@/components/ui/core";
import { useToast } from "@/components/admin/ToastProvider";
import { slugify } from "@webclient/lib/seo/slugs";
import type { ProductType } from "@/lib/product-api";

export function ProductDuplicateButton({
  productId,
  productName,
  productType,
  listHref,
}: {
  productId: string;
  productName: string;
  productType: ProductType;
  listHref: string;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState(`${productName} (bản sao)`);
  const [slug, setSlug] = useState(slugify(`${productId}-ban-sao`));

  const handleDuplicate = async () => {
    if (!name.trim()) {
      toast("Nhập tên sản phẩm");
      return;
    }
    setSaving(true);
    try {
      const endpoint = productType === "accessory" ? "/api/accessories" : "/api/vehicles";
      const payload =
        productType === "accessory"
          ? {
              cloneFromId: productId,
              name: name.trim(),
              slug: slug.trim() || undefined,
            }
          : {
              cloneFromId: productId,
              name: name.trim(),
              slug: slug.trim() || undefined,
              type: productType,
            };

      const res = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Nhân bản thất bại");

      const newId =
        productType === "accessory" ? data.accessory?.id : data.vehicle?.id;
      toast("Đã tạo bản sao — trạng thái nháp");
      setOpen(false);
      router.push(`${listHref}/${newId}`);
    } catch (error) {
      toast(error instanceof Error ? error.message : "Nhân bản thất bại");
    } finally {
      setSaving(false);
    }
  };

  if (!open) {
    return (
      <Button type="button" variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Copy className="mr-1.5 h-3.5 w-3.5" />
        Nhân bản
      </Button>
    );
  }

  return (
    <div className="flex flex-wrap items-end gap-2 rounded-lg border border-zinc-200 bg-zinc-50 p-3">
      <div className="min-w-[160px] flex-1 space-y-1">
        <label className="text-xs font-medium text-zinc-600">Tên bản sao</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} className="h-8 bg-white text-sm" />
      </div>
      <div className="min-w-[140px] flex-1 space-y-1">
        <label className="text-xs font-medium text-zinc-600">Slug</label>
        <Input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="h-8 bg-white text-sm"
          placeholder="vf8-ban-sao"
        />
      </div>
      <Button type="button" size="sm" disabled={saving} onClick={() => void handleDuplicate()}>
        {saving ? "Đang tạo..." : "Tạo bản sao"}
      </Button>
      <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
        Hủy
      </Button>
    </div>
  );
}
