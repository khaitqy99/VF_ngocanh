"use client";

import { useEffect, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { useToast } from "@/components/admin/ToastProvider";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Textarea } from "@/components/ui/core";
import {
  defaultLegalPageContent,
  LEGAL_PAGE_META,
  type LegalPageContent,
  type LegalPageSlug,
} from "@/lib/cms/legal";

export function LegalEditorClient({ slug }: { slug: LegalPageSlug }) {
  const { toast } = useToast();
  const meta = LEGAL_PAGE_META[slug];
  const [content, setContent] = useState<LegalPageContent>(defaultLegalPageContent(slug));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/cms/legal/${slug}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.content) setContent(data.content);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const save = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/cms/legal/${slug}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "Lưu thất bại");
      }
      toast(`Đã lưu ${meta.label}`);
    } catch (error) {
      toast(error instanceof Error ? error.message : "Lưu thất bại");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-sm text-zinc-500">Đang tải…</p>;

  return (
    <div className="space-y-6">
      <PageHeader
        title={meta.label}
        description={`Nội dung trang ${meta.path}. Hỗ trợ HTML đơn giản (p, ul, li).`}
        action={
          <Button onClick={save} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Đang lưu…" : "Lưu thay đổi"}
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Thông tin chung</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-semibold">Tiêu đề trang</label>
            <Input
              value={content.title}
              onChange={(e) => setContent((c) => ({ ...c, title: e.target.value }))}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold">Nhãn breadcrumb</label>
            <Input
              value={content.breadcrumbLabel}
              onChange={(e) => setContent((c) => ({ ...c, breadcrumbLabel: e.target.value }))}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold">Ngày cập nhật</label>
            <Input
              value={content.updatedAt}
              onChange={(e) => setContent((c) => ({ ...c, updatedAt: e.target.value }))}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-semibold">Mở đầu (HTML)</label>
            <Textarea
              rows={4}
              value={content.introHtml}
              onChange={(e) => setContent((c) => ({ ...c, introHtml: e.target.value }))}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Các mục</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {content.sections.map((section, index) => (
            <div key={index} className="rounded-lg border border-zinc-200 p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold">Mục {index + 1}</p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setContent((c) => ({
                      ...c,
                      sections: c.sections.filter((_, i) => i !== index),
                    }))
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-[11px] font-semibold text-zinc-500">
                    Tiêu đề mục
                  </label>
                  <Input
                    value={section.heading}
                    onChange={(e) =>
                      setContent((c) => ({
                        ...c,
                        sections: c.sections.map((item, i) =>
                          i === index ? { ...item, heading: e.target.value } : item,
                        ),
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-semibold text-zinc-500">
                    Nội dung (HTML)
                  </label>
                  <Textarea
                    rows={5}
                    value={section.bodyHtml}
                    onChange={(e) =>
                      setContent((c) => ({
                        ...c,
                        sections: c.sections.map((item, i) =>
                          i === index ? { ...item, bodyHtml: e.target.value } : item,
                        ),
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setContent((c) => ({
                ...c,
                sections: [...c.sections, { heading: "Mục mới", bodyHtml: "<p></p>" }],
              }))
            }
          >
            <Plus className="mr-1 h-4 w-4" />
            Thêm mục
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
