"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { useToast } from "@/components/admin/ToastProvider";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@/components/ui/core";
import {
  defaultFloatingSettings,
  type FloatingButtonSetting,
  type FloatingSettings,
} from "@/lib/cms/floating";

export function FloatingSettingsClient() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<FloatingSettings>(defaultFloatingSettings());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/cms/floating", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
      })
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/cms/floating", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });
      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "Lưu thất bại");
      }
      toast("Đã lưu nút nổi");
    } catch (error) {
      toast(error instanceof Error ? error.message : "Lưu thất bại");
    } finally {
      setSaving(false);
    }
  };

  const updateButton = (key: FloatingButtonSetting["key"], patch: Partial<FloatingButtonSetting>) => {
    setSettings((s) => ({
      ...s,
      buttons: s.buttons.map((button) => (button.key === key ? { ...button, ...patch } : button)),
    }));
  };

  if (loading) return <p className="text-sm text-zinc-500">Đang tải…</p>;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Nút nổi (Floating)"
        description="Bật/tắt và tùy chỉnh link hotline, Messenger, Zalo, nút lên đầu trang. Để trống link sẽ dùng số điện thoại / mạng xã hội từ SEO global."
        action={
          <Button onClick={save} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Đang lưu…" : "Lưu thay đổi"}
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Các nút</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {settings.buttons.map((button) => (
            <div
              key={button.key}
              className="flex flex-wrap items-end gap-3 rounded-lg border border-zinc-200 p-3"
            >
              <label className="flex items-center gap-2 text-sm font-semibold">
                <input
                  type="checkbox"
                  checked={button.enabled}
                  onChange={(e) => updateButton(button.key, { enabled: e.target.checked })}
                  className="size-4 rounded border-zinc-300"
                />
                {button.label}
              </label>
              <div className="min-w-[140px] flex-1">
                <label className="mb-1 block text-[11px] font-semibold text-zinc-500">Nhãn</label>
                <Input
                  value={button.label}
                  onChange={(e) => updateButton(button.key, { label: e.target.value })}
                />
              </div>
              {button.key !== "scrollTop" ? (
                <div className="min-w-[200px] flex-[2]">
                  <label className="mb-1 block text-[11px] font-semibold text-zinc-500">
                    Link tùy chỉnh (tuỳ chọn)
                  </label>
                  <Input
                    value={button.href ?? ""}
                    onChange={(e) =>
                      updateButton(button.key, {
                        href: e.target.value.trim() || undefined,
                      })
                    }
                    placeholder={
                      button.key === "hotline"
                        ? "tel:0707536666"
                        : button.key === "zalo"
                          ? "https://zalo.me/..."
                          : "https://m.me/... hoặc Facebook"
                    }
                  />
                </div>
              ) : null}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
