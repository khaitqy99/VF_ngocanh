"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { useToast } from "@/components/admin/ToastProvider";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Textarea } from "@/components/ui/core";
import { defaultSiteSeoSettings, type SiteSeoSettings } from "@/lib/seo";

export function GlobalSeoClient() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<SiteSeoSettings>(defaultSiteSeoSettings());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/seo/global", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
      })
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/seo/global", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });
      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "Lưu thất bại");
      }
      toast("Đã lưu cài đặt SEO chung");
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
        title="Cài đặt SEO chung"
        description="Title template, mô tả mặc định và thông tin tổ chức cho toàn site"
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Site & Title</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold">Tên site</label>
            <Input
              value={settings.siteName ?? ""}
              onChange={(e) => setSettings((s) => ({ ...s, siteName: e.target.value }))}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold">Title template</label>
            <Input
              value={settings.titleTemplate ?? ""}
              onChange={(e) => setSettings((s) => ({ ...s, titleTemplate: e.target.value }))}
              placeholder="%s | Vinfast 3S Cà Mau"
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-xs font-semibold">Title mặc định</label>
            <Input
              value={settings.defaultTitle ?? ""}
              onChange={(e) => setSettings((s) => ({ ...s, defaultTitle: e.target.value }))}
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-xs font-semibold">Mô tả mặc định</label>
            <Textarea
              rows={3}
              value={settings.defaultDescription ?? ""}
              onChange={(e) => setSettings((s) => ({ ...s, defaultDescription: e.target.value }))}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Open Graph mặc định</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Input
            value={settings.defaultOgTitle ?? ""}
            onChange={(e) => setSettings((s) => ({ ...s, defaultOgTitle: e.target.value }))}
            placeholder="OG title mặc định"
          />
          <Textarea
            rows={2}
            value={settings.defaultOgDescription ?? ""}
            onChange={(e) => setSettings((s) => ({ ...s, defaultOgDescription: e.target.value }))}
            placeholder="OG description mặc định"
          />
          <Input
            value={settings.defaultOgImage ?? ""}
            onChange={(e) => setSettings((s) => ({ ...s, defaultOgImage: e.target.value }))}
            placeholder="/images/cars/oto-hero.webp"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">LocalBusiness / AutoDealer (Schema & Geo)</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Input
            value={settings.organization?.name ?? ""}
            onChange={(e) =>
              setSettings((s) => ({
                ...s,
                organization: { ...s.organization, name: e.target.value },
              }))
            }
            placeholder="Tên schema (VD: VF Ngọc Anh — Vinfast 3S Cà Mau)"
          />
          <Input
            value={settings.organization?.telephone ?? ""}
            onChange={(e) =>
              setSettings((s) => ({
                ...s,
                organization: { ...s.organization, telephone: e.target.value },
              }))
            }
            placeholder="Hotline"
          />
          <Input
            value={settings.organization?.email ?? ""}
            onChange={(e) =>
              setSettings((s) => ({
                ...s,
                organization: { ...s.organization, email: e.target.value },
              }))
            }
            placeholder="Email"
          />
          <Input
            value={settings.organization?.streetAddress ?? ""}
            onChange={(e) =>
              setSettings((s) => ({
                ...s,
                organization: { ...s.organization, streetAddress: e.target.value },
              }))
            }
            placeholder="Số nhà, đường"
          />
          <Input
            value={settings.organization?.addressLocality ?? ""}
            onChange={(e) =>
              setSettings((s) => ({
                ...s,
                organization: { ...s.organization, addressLocality: e.target.value },
              }))
            }
            placeholder="Thành phố / Quận"
          />
          <Input
            value={settings.organization?.addressRegion ?? ""}
            onChange={(e) =>
              setSettings((s) => ({
                ...s,
                organization: { ...s.organization, addressRegion: e.target.value },
              }))
            }
            placeholder="Tỉnh / Vùng"
          />
          <Input
            value={settings.organization?.postalCode ?? ""}
            onChange={(e) =>
              setSettings((s) => ({
                ...s,
                organization: { ...s.organization, postalCode: e.target.value },
              }))
            }
            placeholder="Mã bưu chính"
          />
          <Input
            type="number"
            step="any"
            value={settings.organization?.geo?.latitude ?? ""}
            onChange={(e) =>
              setSettings((s) => ({
                ...s,
                organization: {
                  ...s.organization,
                  geo: {
                    ...s.organization?.geo,
                    latitude: e.target.value ? Number(e.target.value) : undefined,
                  },
                },
              }))
            }
            placeholder="Vĩ độ (latitude)"
          />
          <Input
            type="number"
            step="any"
            value={settings.organization?.geo?.longitude ?? ""}
            onChange={(e) =>
              setSettings((s) => ({
                ...s,
                organization: {
                  ...s.organization,
                  geo: {
                    ...s.organization?.geo,
                    longitude: e.target.value ? Number(e.target.value) : undefined,
                  },
                },
              }))
            }
            placeholder="Kinh độ (longitude)"
          />
          <Input
            value={settings.organization?.openingHours?.opens ?? ""}
            onChange={(e) =>
              setSettings((s) => ({
                ...s,
                organization: {
                  ...s.organization,
                  openingHours: { ...s.organization?.openingHours, opens: e.target.value },
                },
              }))
            }
            placeholder="Giờ mở (VD: 08:00)"
          />
          <Input
            value={settings.organization?.openingHours?.closes ?? ""}
            onChange={(e) =>
              setSettings((s) => ({
                ...s,
                organization: {
                  ...s.organization,
                  openingHours: { ...s.organization?.openingHours, closes: e.target.value },
                },
              }))
            }
            placeholder="Giờ đóng (VD: 18:00)"
          />
          <div className="md:col-span-2">
            <label className="mb-1 block text-xs font-semibold">
              Ngày mở cửa (cách nhau bằng dấu phẩy, tiếng Anh)
            </label>
            <Input
              value={(settings.organization?.openingHours?.days ?? []).join(", ")}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  organization: {
                    ...s.organization,
                    openingHours: {
                      ...s.organization?.openingHours,
                      days: e.target.value
                        .split(",")
                        .map((day) => day.trim())
                        .filter(Boolean),
                    },
                  },
                }))
              }
              placeholder="Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday"
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-xs font-semibold">
              sameAs — link Google Maps, Facebook, Zalo (mỗi dòng một URL)
            </label>
            <Textarea
              rows={3}
              value={(settings.organization?.sameAs ?? []).join("\n")}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  organization: {
                    ...s.organization,
                    sameAs: e.target.value
                      .split("\n")
                      .map((line) => line.trim())
                      .filter(Boolean),
                  },
                }))
              }
              placeholder="https://www.google.com/maps/..."
            />
          </div>
        </CardContent>
      </Card>

      <Button type="button" onClick={save} disabled={saving}>
        <Save className="mr-2 h-4 w-4" />
        {saving ? "Đang lưu…" : "Lưu cài đặt chung"}
      </Button>
    </div>
  );
}
