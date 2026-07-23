"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { CheckCircle2, AlertTriangle, XCircle, Images, Save } from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Textarea } from "@/components/ui/core";
import { GlobalMediaPicker } from "@/components/admin/GlobalMediaPicker";
import { clientAssetUrl } from "@/lib/product-utils";
import {
  SEO_SCHEMA_TYPE_OPTIONS,
  type SeoRecord,
  type SeoSchemaType,
  buildSeoChecklist,
} from "@/lib/seo";
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

function ChecklistIcon({ status }: { status: "pass" | "warn" | "fail" }) {
  if (status === "pass") return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />;
  if (status === "warn") return <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />;
  return <XCircle className="h-3.5 w-3.5 text-red-500" />;
}

export function SeoPreviewCard({
  resolved,
  checklist,
}: {
  resolved: ReturnType<typeof resolveSeoContent>;
  checklist: ReturnType<typeof buildSeoChecklist>;
}) {
  return (
    <div className="space-y-4">
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

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-sm">Checklist SEO</CardTitle>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                checklist.score >= 80
                  ? "bg-emerald-50 text-emerald-700"
                  : checklist.score >= 50
                    ? "bg-amber-50 text-amber-700"
                    : "bg-red-50 text-red-700"
              }`}
            >
              {checklist.score}/100
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {checklist.items.map((item) => (
            <div key={item.id} className="flex items-start gap-2 text-xs">
              <ChecklistIcon status={item.status} />
              <div className="min-w-0">
                <p className="font-medium text-zinc-800">{item.label}</p>
                {item.detail ? <p className="text-zinc-500">{item.detail}</p> : null}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function OgImageField({
  value,
  placeholder,
  onChange,
}: {
  value: string;
  placeholder?: string;
  onChange: (next: string) => void;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const preview = value || placeholder || "";

  return (
    <>
      <div className="flex gap-3">
        <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-lg border bg-zinc-50">
          {preview ? (
            <Image
              src={clientAssetUrl(preview)}
              alt=""
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="flex h-full items-center justify-center text-zinc-300">
              <Images className="h-6 w-6" />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder ?? "/images/..."}
            className="font-mono text-xs"
          />
          <Button type="button" variant="outline" size="sm" className="h-8" onClick={() => setPickerOpen(true)}>
            <Images className="mr-1.5 h-3.5 w-3.5" />
            Chọn từ thư viện
          </Button>
        </div>
      </div>
      <GlobalMediaPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(path) => {
          onChange(path);
          setPickerOpen(false);
        }}
        title="Chọn ảnh Open Graph"
        defaultCategory="pages"
      />
    </>
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
  const checklist = useMemo(() => buildSeoChecklist(value, defaults), [value, defaults]);

  const setField = <K extends keyof SeoRecord>(key: K, fieldValue: SeoRecord[K]) => {
    onChange({ ...value, [key]: fieldValue });
  };

  const indexEnabled = !(value.noindex ?? (value.robots?.index === false));
  const followEnabled = value.robots?.follow !== false;

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
            <Field
              label="Focus keyword (gợi ý nội bộ)"
              hint="Dùng cho checklist — kiểm tra title/mô tả có chứa từ khóa."
            >
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
            <Field label="OG image" hint="Khuyến nghị 1200×630 px — chọn từ thư viện hoặc dán URL.">
              <OgImageField
                value={value.ogImage ?? ""}
                placeholder={defaults.image}
                onChange={(next) => setField("ogImage", next)}
              />
            </Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Nâng cao</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field
              label="Canonical path / URL"
              hint={`Để trống → dùng: ${defaults.path ?? "/"}`}
            >
              <Input
                value={value.canonical ?? ""}
                onChange={(e) => setField("canonical", e.target.value)}
                placeholder={defaults.path}
              />
            </Field>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex items-center gap-2 text-sm text-zinc-700">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-zinc-300"
                  checked={indexEnabled}
                  onChange={(e) => {
                    const index = e.target.checked;
                    onChange({
                      ...value,
                      noindex: index ? false : true,
                      robots: { ...value.robots, index, follow: followEnabled },
                    });
                  }}
                />
                Cho phép index (Google)
              </label>
              <label className="flex items-center gap-2 text-sm text-zinc-700">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-zinc-300"
                  checked={followEnabled}
                  onChange={(e) => {
                    const follow = e.target.checked;
                    onChange({
                      ...value,
                      robots: { ...value.robots, index: indexEnabled, follow },
                    });
                  }}
                />
                Cho phép follow link
              </label>
            </div>

            <Field
              label="Schema type (JSON-LD)"
              hint="Gợi ý loại schema — schema chính vẫn gắn theo loại trang (sản phẩm, tin, LocalBusiness)."
            >
              <select
                className="h-9 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm"
                value={value.schemaType ?? ""}
                onChange={(e) =>
                  setField(
                    "schemaType",
                    (e.target.value || undefined) as SeoSchemaType | undefined,
                  )
                }
              >
                <option value="">— Mặc định theo trang —</option>
                {SEO_SCHEMA_TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>
          </CardContent>
        </Card>

        <Button type="button" onClick={onSave} disabled={saving}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Đang lưu…" : "Lưu SEO"}
        </Button>
      </div>

      <div className="lg:sticky lg:top-4 lg:self-start">
        <SeoPreviewCard resolved={resolved} checklist={checklist} />
      </div>
    </div>
  );
}
