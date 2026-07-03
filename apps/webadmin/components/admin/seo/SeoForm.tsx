"use client";

import { useMemo, useState } from "react";
import { Save } from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Textarea } from "@/components/ui/core";
import type { SeoRecord } from "@/lib/seo";
import { resolveSeoContent, type SeoAutoFill } from "@/lib/seo/resolve";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-zinc-700">{label}</label>
      {children}
      {hint ? <p className="mt-1 text-[11px] text-zinc-500">{hint}</p> : null}
    </div>
  );
}

export function SeoPreviewCard({
  resolved,
}: {
  resolved: ReturnType<typeof resolveSeoContent>;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Preview Google</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="truncate text-sm text-[#1a0dab]">{resolved.title}</p>
          <p className="truncate text-xs text-[#006621]">{resolved.canonical}</p>
          <p className="mt-1 line-clamp-2 text-xs text-zinc-600">{resolved.description}</p>
        </div>
        <div className="border-t border-zinc-100 pt-3">
          <p className="mb-2 text-xs font-semibold text-zinc-700">Preview Facebook</p>
          <p className="text-sm font-semibold text-zinc-900">{resolved.ogTitle}</p>
          <p className="mt-1 line-clamp-2 text-xs text-zinc-600">{resolved.ogDescription}</p>
          <p className="mt-1 truncate text-[11px] text-zinc-400">{resolved.ogImage}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function SeoForm({
  value,
  defaults,
  slug,
  slugEditable = false,
  onSlugChange,
  onChange,
  onSave,
  saving = false,
}: {
  value: SeoRecord;
  defaults: SeoAutoFill;
  slug?: string;
  slugEditable?: boolean;
  onSlugChange?: (slug: string) => void;
  onChange: (next: SeoRecord) => void;
  onSave: () => void;
  saving?: boolean;
}) {
  const resolved = useMemo(() => resolveSeoContent(value, defaults), [value, defaults]);

  const setField = <K extends keyof SeoRecord>(key: K, fieldValue: SeoRecord[K]) => {
    onChange({ ...value, [key]: fieldValue });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        {slugEditable && slug !== undefined ? (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">URL (slug)</CardTitle>
            </CardHeader>
            <CardContent>
              <Field label="Slug" hint="Chữ thường, số và gạch ngang. Đổi slug = URL mới (link cũ 404).">
                <Input value={slug} onChange={(e) => onSlugChange?.(e.target.value)} />
              </Field>
            </CardContent>
          </Card>
        ) : null}

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Meta cơ bản</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field label="Meta title" hint={`Để trống → dùng: ${defaults.title ?? "mặc định"}`}>
              <Input
                value={value.metaTitle ?? ""}
                onChange={(e) => setField("metaTitle", e.target.value)}
                placeholder={defaults.title}
              />
            </Field>
            <Field label="Meta description">
              <Textarea
                rows={3}
                value={value.metaDescription ?? ""}
                onChange={(e) => setField("metaDescription", e.target.value)}
                placeholder={defaults.description}
              />
            </Field>
            <Field label="Focus keyword (gợi ý nội bộ)">
              <Input
                value={value.focusKeyword ?? ""}
                onChange={(e) => setField("focusKeyword", e.target.value)}
                placeholder="vinfast vf8 cà mau"
              />
            </Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Social (Open Graph)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field label="OG title">
              <Input
                value={value.ogTitle ?? ""}
                onChange={(e) => setField("ogTitle", e.target.value)}
                placeholder={resolved.title}
              />
            </Field>
            <Field label="OG description">
              <Textarea
                rows={2}
                value={value.ogDescription ?? ""}
                onChange={(e) => setField("ogDescription", e.target.value)}
                placeholder={resolved.description}
              />
            </Field>
            <Field label="OG image URL" hint="Khuyến nghị 1200×630">
              <Input
                value={value.ogImage ?? ""}
                onChange={(e) => setField("ogImage", e.target.value)}
                placeholder={defaults.image}
              />
            </Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Robots & Canonical</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4 text-sm">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={Boolean(value.noindex)}
                  onChange={(e) => setField("noindex", e.target.checked)}
                />
                Noindex
              </label>
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={value.robots?.follow === false}
                  onChange={(e) =>
                    setField("robots", {
                      ...value.robots,
                      follow: e.target.checked ? false : true,
                    })
                  }
                />
                Nofollow
              </label>
            </div>
            <Field label="Canonical URL (tùy chọn)" hint="Để trống → dùng URL chuẩn của trang">
              <Input
                value={value.canonical ?? ""}
                onChange={(e) => setField("canonical", e.target.value)}
                placeholder={defaults.path}
              />
            </Field>
          </CardContent>
        </Card>

        <Button type="button" onClick={onSave} disabled={saving}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Đang lưu…" : "Lưu SEO"}
        </Button>
      </div>

      <div className="lg:sticky lg:top-4 lg:self-start">
        <SeoPreviewCard resolved={resolved} />
      </div>
    </div>
  );
}
