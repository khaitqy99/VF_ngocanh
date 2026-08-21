"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { useToast } from "@/components/admin/ToastProvider";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@/components/ui/core";
import type { CmsBannerInput } from "@/lib/cms/static-pages";

type CatalogPlacement = "cars" | "scooters" | "accessories";

const TABS: { id: CatalogPlacement; label: string }[] = [
  { id: "cars", label: "Ô tô (/oto)" },
  { id: "scooters", label: "Xe máy (/xe-may-dien)" },
  { id: "accessories", label: "Phụ kiện (/phu-kien)" },
];

export function CatalogBannersClient() {
  const { toast } = useToast();
  const [placement, setPlacement] = useState<CatalogPlacement>("cars");
  const [banners, setBanners] = useState<CmsBannerInput[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async (nextPlacement: CatalogPlacement) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/cms/catalog-banners?placement=${nextPlacement}`, {
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Không tải được banner");
      setBanners(Array.isArray(data.banners) ? data.banners : []);
    } catch (error) {
      toast(error instanceof Error ? error.message : "Không tải được banner");
      setBanners([]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    void load(placement);
  }, [load, placement]);

  const save = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/cms/catalog-banners", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ placement, banners }),
      });
      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "Lưu thất bại");
      }
      toast("Đã lưu banner catalog");
      await load(placement);
    } catch (error) {
      toast(error instanceof Error ? error.message : "Lưu thất bại");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Banner catalog"
        description="Hero carousel cho danh mục ô tô, xe máy điện và phụ kiện. Để trống sẽ dùng ảnh mặc định trên webclient."
        action={
          <Button onClick={save} disabled={saving || loading}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Đang lưu…" : "Lưu thay đổi"}
          </Button>
        }
      />

      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <Button
            key={tab.id}
            type="button"
            variant={placement === tab.id ? "default" : "outline"}
            size="sm"
            onClick={() => setPlacement(tab.id)}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">
            Banner — {TABS.find((tab) => tab.id === placement)?.label}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <p className="text-sm text-zinc-500">Đang tải…</p>
          ) : (
            <>
              {banners.map((banner, index) => (
                <div key={banner.id ?? `banner-${index}`} className="rounded-lg border border-zinc-200 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-semibold">Banner {index + 1}</p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setBanners((current) => current.filter((_, i) => i !== index))}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-[11px] font-semibold text-zinc-500">
                        Ảnh desktop
                      </label>
                      <Input
                        value={banner.desktop}
                        onChange={(e) =>
                          setBanners((current) =>
                            current.map((item, i) =>
                              i === index ? { ...item, desktop: e.target.value } : item,
                            ),
                          )
                        }
                        placeholder="/images/..."
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[11px] font-semibold text-zinc-500">
                        Ảnh mobile
                      </label>
                      <Input
                        value={banner.mobile}
                        onChange={(e) =>
                          setBanners((current) =>
                            current.map((item, i) =>
                              i === index ? { ...item, mobile: e.target.value } : item,
                            ),
                          )
                        }
                        placeholder="/images/..."
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="mb-1 block text-[11px] font-semibold text-zinc-500">
                        Alt
                      </label>
                      <Input
                        value={banner.alt}
                        onChange={(e) =>
                          setBanners((current) =>
                            current.map((item, i) =>
                              i === index ? { ...item, alt: e.target.value } : item,
                            ),
                          )
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
                  setBanners((current) => [
                    ...current,
                    { desktop: "", mobile: "", alt: "", sortOrder: current.length },
                  ])
                }
              >
                <Plus className="mr-1 h-4 w-4" />
                Thêm banner
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
