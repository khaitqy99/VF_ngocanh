"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { SeoForm } from "@/components/admin/seo/SeoForm";
import { useToast } from "@/components/admin/ToastProvider";
import { STATIC_PAGE_SEO, type SeoRecord } from "@/lib/seo";

export function StaticPageSeoClient({ slug }: { slug: string }) {
  const definition = STATIC_PAGE_SEO.find((page) => page.slug === slug);
  const { toast } = useToast();
  const [seo, setSeo] = useState<SeoRecord>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!definition) return;
    fetch(`/api/seo/pages/${encodeURIComponent(slug)}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.seo) setSeo(data.seo);
      })
      .catch(() => toast("Không tải được dữ liệu SEO"))
      .finally(() => setLoading(false));
  }, [slug, definition, toast]);

  if (!definition) {
    return <p className="py-12 text-center text-zinc-500">Không tìm thấy trang.</p>;
  }

  const save = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/seo/pages/${encodeURIComponent(slug)}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seo }),
      });
      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "Lưu thất bại");
      }
      toast("Đã lưu SEO trang");
    } catch (error) {
      toast(error instanceof Error ? error.message : "Lưu thất bại");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-zinc-500">
        <Link href="/admin/seo" className="hover:text-zinc-900">
          SEO
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-zinc-900">{definition.label}</span>
      </div>

      <PageHeader
        title={`SEO — ${definition.label}`}
        description={`${definition.path} · Canonical: https://vinfast3scamau.com${definition.path === "/" ? "" : definition.path}`}
      />

      {loading ? (
        <p className="text-sm text-zinc-500">Đang tải…</p>
      ) : (
        <SeoForm
          value={seo}
          defaults={{
            title: definition.defaultTitle,
            description: definition.defaultDescription,
            image: definition.defaultOgImage,
            path: definition.path,
          }}
          onChange={setSeo}
          onSave={save}
          saving={saving}
        />
      )}
    </div>
  );
}
