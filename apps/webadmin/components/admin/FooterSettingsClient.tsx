"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Plus, RefreshCw, Save, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { useToast } from "@/components/admin/ToastProvider";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Textarea } from "@/components/ui/core";
import {
  defaultFooterSettings,
  type FooterColumn,
  type FooterLink,
  type FooterSettings,
} from "@/lib/cms/footer";

type ColumnKey = keyof FooterSettings["columns"];

const COLUMN_KEYS: { key: ColumnKey; label: string }[] = [
  { key: "products", label: "Cột Sản phẩm" },
  { key: "services", label: "Cột Dịch vụ" },
  { key: "about", label: "Cột Về chúng tôi" },
  { key: "policies", label: "Cột Chính sách" },
];

function LinkRowsEditor({
  links,
  onChange,
}: {
  links: FooterLink[];
  onChange: (links: FooterLink[]) => void;
}) {
  const updateLink = (index: number, patch: Partial<FooterLink>) => {
    onChange(links.map((link, i) => (i === index ? { ...link, ...patch } : link)));
  };

  const removeLink = (index: number) => {
    onChange(links.filter((_, i) => i !== index));
  };

  const addLink = () => {
    onChange([...links, { label: "Link mới", href: "/" }]);
  };

  return (
    <div className="space-y-2">
      {links.map((link, index) => (
        <div key={`${link.label}-${index}`} className="flex gap-2">
          <Input
            value={link.label}
            onChange={(e) => updateLink(index, { label: e.target.value })}
            placeholder="Nhãn"
            className="flex-1"
          />
          <Input
            value={link.href}
            onChange={(e) => updateLink(index, { href: e.target.value })}
            placeholder="/duong-dan"
            className="flex-[1.2]"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => removeLink(index)}
            aria-label="Xóa link"
          >
            <Trash2 className="h-4 w-4 text-zinc-400" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={addLink}>
        <Plus className="mr-1 h-4 w-4" />
        Thêm link
      </Button>
    </div>
  );
}

function ColumnEditor({
  column,
  onChange,
}: {
  column: FooterColumn;
  onChange: (column: FooterColumn) => void;
}) {
  return (
    <div className="space-y-3">
      <div>
        <label className="mb-1 block text-xs font-semibold">Tiêu đề cột</label>
        <Input
          value={column.title}
          onChange={(e) => onChange({ ...column, title: e.target.value })}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold">Danh sách link</label>
        <LinkRowsEditor
          links={column.links}
          onChange={(links) => onChange({ ...column, links })}
        />
      </div>
    </div>
  );
}

export function FooterSettingsClient() {
  const { toast } = useToast();
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const [settings, setSettings] = useState<FooterSettings>(defaultFooterSettings());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  useEffect(() => {
    fetch("/api/cms/footer", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
      })
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/cms/footer", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });
      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "Lưu thất bại");
      }
      toast("Đã lưu cài đặt footer");
      setIframeKey((key) => key + 1);
    } catch (error) {
      toast(error instanceof Error ? error.message : "Lưu thất bại");
    } finally {
      setSaving(false);
    }
  };

  const updateColumn = (key: ColumnKey, column: FooterColumn) => {
    setSettings((current) => ({
      ...current,
      columns: { ...current.columns, [key]: column },
    }));
  };

  if (loading) return <p className="text-sm text-zinc-500">Đang tải…</p>;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cài đặt Footer"
        description="Chỉnh nội dung footer hiển thị trên toàn site. Hotline, email, địa chỉ chỉnh tại SEO chung."
        action={
          <Button onClick={save} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Đang lưu…" : "Lưu thay đổi"}
          </Button>
        }
      />

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm">Xem trước footer</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIframeKey((key) => key + 1)}
            >
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
              Tải lại
            </Button>
            <a
              href={siteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-8 items-center gap-1.5 rounded-md border border-zinc-200 px-3 text-xs font-medium hover:bg-zinc-50"
            >
              Website
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <iframe
            key={iframeKey}
            title="Xem trước footer"
            src={`${siteUrl}/footer/preview`}
            className="h-[560px] w-full rounded-b-xl border-0 bg-white"
          />
          <p className="border-t border-zinc-100 px-4 py-2 text-xs text-zinc-500">
            Preview cập nhật sau khi bấm <strong>Lưu thay đổi</strong> — hoặc bấm Tải lại.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Thương hiệu</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div>
            <label className="mb-1 block text-xs font-semibold">Dòng tiêu đề (dưới logo)</label>
            <Input
              value={settings.brandTitle}
              onChange={(e) => setSettings((s) => ({ ...s, brandTitle: e.target.value }))}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold">Mô tả ngắn</label>
            <Textarea
              rows={3}
              value={settings.brandDescription}
              onChange={(e) => setSettings((s) => ({ ...s, brandDescription: e.target.value }))}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        {COLUMN_KEYS.map(({ key, label }) => (
          <Card key={key}>
            <CardHeader>
              <CardTitle className="text-sm">{label}</CardTitle>
            </CardHeader>
            <CardContent>
              <ColumnEditor
                column={settings.columns[key]}
                onChange={(column) => updateColumn(key, column)}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Liên hệ & Bản đồ</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <p className="text-xs text-zinc-500">
            Tên showroom, hotline tư vấn, email, địa chỉ và giờ mở cửa lấy từ{" "}
            <a href="/admin/seo/global" className="font-medium text-red-600 hover:underline">
              Cài đặt SEO chung → LocalBusiness
            </a>
            .
          </p>
          <div>
            <label className="mb-1 block text-xs font-semibold">Hotline cứu hộ 24/7</label>
            <Input
              value={settings.rescueHotline}
              onChange={(e) => setSettings((s) => ({ ...s, rescueHotline: e.target.value }))}
              placeholder="0707 54 6666"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold">URL embed Google Maps</label>
            <Textarea
              rows={4}
              value={settings.mapEmbed}
              onChange={(e) => setSettings((s) => ({ ...s, mapEmbed: e.target.value }))}
              placeholder="https://www.google.com/maps/embed?pb=..."
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Thanh copyright</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div>
            <label className="mb-1 block text-xs font-semibold">Dòng copyright</label>
            <Input
              value={settings.copyright}
              onChange={(e) => setSettings((s) => ({ ...s, copyright: e.target.value }))}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold">Link phía phải</label>
            <LinkRowsEditor
              links={settings.bottomLinks}
              onChange={(bottomLinks) => setSettings((s) => ({ ...s, bottomLinks }))}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
