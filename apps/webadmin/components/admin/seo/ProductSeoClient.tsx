"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { SeoForm } from "@/components/admin/seo/SeoForm";
import { useToast } from "@/components/admin/ToastProvider";
import type { SeoAutoFill } from "@/lib/seo/resolve";
import type { SeoRecord } from "@/lib/seo";

export function ProductSeoClient({
  productType,
  productId,
  productName,
  listHref,
  listLabel,
}: {
  productType: "car" | "scooter" | "accessory";
  productId: string;
  productName: string;
  listHref: string;
  listLabel: string;
}) {
  const { toast } = useToast();
  const [seo, setSeo] = useState<SeoRecord>({});
  const [slug, setSlug] = useState("");
  const [defaults, setDefaults] = useState<SeoAutoFill>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/seo/products/${productType}/${encodeURIComponent(productId)}`, {
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Không tải được SEO sản phẩm");
        return res.json();
      })
      .then((data) => {
        if (data.seo) setSeo(data.seo);
        if (data.slug) setSlug(data.slug);
        if (data.defaults) setDefaults(data.defaults);
      })
      .catch(() => toast("Không tải được SEO sản phẩm", "error"))
      .finally(() => setLoading(false));
  }, [productType, productId, toast]);

  const save = async () => {
    setSaving(true);
    try {
      const response = await fetch(
        `/api/seo/products/${productType}/${encodeURIComponent(productId)}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ seo, slug }),
        },
      );
      const data = (await response.json().catch(() => null)) as
        | { error?: string; slug?: string; revalidated?: boolean }
        | null;
      if (!response.ok) {
        throw new Error(data?.error ?? "Lưu thất bại");
      }
      if (data?.slug) setSlug(data.slug);
      if (data?.revalidated === false) {
        toast(
          "Đã lưu SEO nhưng chưa làm mới cache website — kiểm tra NEXT_PUBLIC_SITE_URL và REVALIDATION_SECRET",
          "error",
        );
      } else {
        toast("Đã lưu SEO sản phẩm");
      }
    } catch (error) {
      toast(error instanceof Error ? error.message : "Lưu thất bại");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-6 text-sm text-zinc-500">Đang tải SEO…</p>;

  return (
    <div className="space-y-6 p-4 md:p-6">
      <PageHeader
        title={`SEO — ${productName}`}
        description={`${listLabel} · ID: ${productId}`}
      />
      <SeoForm
        value={seo}
        defaults={defaults}
        slug={slug}
        slugEditable
        onSlugChange={setSlug}
        onChange={setSeo}
        onSave={save}
        saving={saving}
      />
    </div>
  );
}
