"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Images, Save } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { useToast } from "@/components/admin/ToastProvider";
import { GlobalMediaPicker } from "@/components/admin/GlobalMediaPicker";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Textarea } from "@/components/ui/core";
import { clientAssetUrl } from "@/lib/product-utils";
import { defaultSiteSeoSettings, type SiteSeoSettings } from "@/lib/seo";

export function GlobalSeoClient({ embedded = false }: { embedded?: boolean }) {
  const { toast } = useToast();
  const [settings, setSettings] = useState<SiteSeoSettings>(defaultSiteSeoSettings());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [ogPickerOpen, setOgPickerOpen] = useState(false);
  const [logoPickerOpen, setLogoPickerOpen] = useState(false);

  useEffect(() => {
    fetch("/api/seo/global", { credentials: "include" })
      .then(async (res) => {
        if (!res.ok) throw new Error("Không tải được SEO chung");
        return res.json();
      })
      .then((data) => {
        if (data.settings) setSettings(data.settings);
      })
      .catch(() => toast("Không tải được cài đặt SEO chung", "error"))
      .finally(() => setLoading(false));
  }, [toast]);

  const save = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/seo/global", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });
      const data = (await response.json().catch(() => null)) as
        | { error?: string; revalidated?: boolean }
        | null;
      if (!response.ok) {
        throw new Error(data?.error ?? "Lưu thất bại");
      }
      if (data?.revalidated === false) {
        toast(
          "Đã lưu SEO nhưng chưa làm mới cache website — kiểm tra NEXT_PUBLIC_SITE_URL và REVALIDATION_SECRET",
          "error",
        );
      } else {
        toast("Đã lưu cài đặt SEO chung");
      }
    } catch (error) {
      toast(error instanceof Error ? error.message : "Lưu thất bại");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-sm text-zinc-500">Đang tải…</p>;

  return (
    <div className={embedded ? "space-y-6" : "space-y-6"}>
      {embedded ? null : (
        <PageHeader
          title="Cài đặt SEO chung"
          description="Title template, mô tả mặc định và thông tin tổ chức cho toàn site"
        />
      )}

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
          <div>
            <label className="mb-1 block text-xs font-semibold">OG image (khuyến nghị 1200×630)</label>
            <div className="flex gap-3">
              <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-lg border bg-zinc-50">
                {settings.defaultOgImage ? (
                  <Image
                    src={clientAssetUrl(settings.defaultOgImage)}
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
                  value={settings.defaultOgImage ?? ""}
                  onChange={(e) => setSettings((s) => ({ ...s, defaultOgImage: e.target.value }))}
                  placeholder="/images/cars/oto-hero.webp"
                  className="font-mono text-xs"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8"
                  onClick={() => setOgPickerOpen(true)}
                >
                  <Images className="mr-1.5 h-3.5 w-3.5" />
                  Chọn từ thư viện
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Robots mặc định (site)</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <label className="flex items-center gap-2 text-sm text-zinc-700">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-zinc-300"
              checked={settings.robots?.index !== false}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  robots: { ...s.robots, index: e.target.checked, follow: s.robots?.follow !== false },
                }))
              }
            />
            Cho phép index toàn site
          </label>
          <label className="flex items-center gap-2 text-sm text-zinc-700">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-zinc-300"
              checked={settings.robots?.follow !== false}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  robots: { ...s.robots, index: s.robots?.index !== false, follow: e.target.checked },
                }))
              }
            />
            Cho phép follow link
          </label>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-semibold">
              robots.txt disallow (mỗi dòng một path)
            </label>
            <Textarea
              rows={3}
              value={(settings.robotsDisallow ?? []).join("\n")}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  robotsDisallow: e.target.value
                    .split("\n")
                    .map((line) => line.trim())
                    .filter(Boolean),
                }))
              }
              placeholder="/api/&#10;/_next/&#10;/preview"
              className="font-mono text-xs"
            />
          </div>
          <p className="sm:col-span-2 text-[11px] text-zinc-500">
            Áp dụng cho metadata mặc định và file robots.txt (luôn nên chặn /api, /preview). Site hiện
            chỉ phục vụ tiếng Việt (vi) — không cấu hình hreflang đa ngôn ngữ.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Verification & Keywords</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div>
            <label className="mb-1 block text-xs font-semibold">Google Search Console verification</label>
            <Input
              value={settings.googleSiteVerification ?? ""}
              onChange={(e) =>
                setSettings((s) => ({ ...s, googleSiteVerification: e.target.value }))
              }
              placeholder="Mã meta google-site-verification"
              className="font-mono text-xs"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold">Keywords (mỗi dòng một từ khóa)</label>
            <Textarea
              rows={4}
              value={(settings.keywords ?? []).join("\n")}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  keywords: e.target.value
                    .split("\n")
                    .map((line) => line.trim())
                    .filter(Boolean),
                }))
              }
              placeholder="VinFast Ngọc Anh Cà Mau"
            />
          </div>
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
            placeholder="Tên schema (VD: VinFast Ngọc Anh Cà Mau — Vinfast 3S Cà Mau)"
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
          <div className="md:col-span-2">
            <label className="mb-1 block text-xs font-semibold">Logo tổ chức (schema)</label>
            <div className="flex gap-3">
              <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-lg border bg-zinc-50">
                {settings.organization?.logo ? (
                  <Image
                    src={clientAssetUrl(settings.organization.logo)}
                    alt=""
                    fill
                    className="object-contain p-1"
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
                  value={settings.organization?.logo ?? ""}
                  onChange={(e) =>
                    setSettings((s) => ({
                      ...s,
                      organization: { ...s.organization, logo: e.target.value },
                    }))
                  }
                  placeholder="https://…/logo.webp hoặc /images/…"
                  className="font-mono text-xs"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8"
                  onClick={() => setLogoPickerOpen(true)}
                >
                  <Images className="mr-1.5 h-3.5 w-3.5" />
                  Chọn từ thư viện
                </Button>
              </div>
            </div>
          </div>
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

      <GlobalMediaPicker
        open={ogPickerOpen}
        onClose={() => setOgPickerOpen(false)}
        onSelect={(path) => {
          setSettings((s) => ({ ...s, defaultOgImage: path }));
          setOgPickerOpen(false);
        }}
        title="Chọn ảnh Open Graph mặc định"
        defaultCategory="pages"
      />
      <GlobalMediaPicker
        open={logoPickerOpen}
        onClose={() => setLogoPickerOpen(false)}
        onSelect={(path) => {
          setSettings((s) => ({
            ...s,
            organization: { ...s.organization, logo: path },
          }));
          setLogoPickerOpen(false);
        }}
        title="Chọn logo tổ chức"
        defaultCategory="pages"
      />
    </div>
  );
}
