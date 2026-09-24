"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ExternalLink, Download, RefreshCw, Save } from "lucide-react";
import { useToast } from "@/components/admin/ToastProvider";
import { Button, Card, CardContent, CardHeader, CardTitle, Textarea } from "@/components/ui/core";
import { isSitemapExcluded } from "@/lib/seo/sitemap-config";
import type { SitemapSettings } from "@/lib/seo";

type SitemapEntryRow = {
  path: string;
  url: string;
  lastModified: string;
  changeFrequency: string;
  priority: number;
  imageCount: number;
};

function parseLines(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function formatPath(path: string): string {
  return path || "/";
}

export function SeoSitemapSection() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [entries, setEntries] = useState<SitemapEntryRow[]>([]);
  const [siteUrl, setSiteUrl] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [settings, setSettings] = useState<SitemapSettings>({
    excludePaths: [],
    includeImageSitemap: true,
  });
  const [excludeDraft, setExcludeDraft] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/seo/sitemap", { credentials: "include" });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.error ?? "Không tải được sitemap");

      const nextSettings = (data.settings ?? {}) as SitemapSettings;
      setSettings(nextSettings);
      setExcludeDraft((nextSettings.excludePaths ?? []).join("\n"));
      setEntries(Array.isArray(data.entries) ? data.entries : []);
      setSiteUrl(typeof data.siteUrl === "string" ? data.siteUrl : null);
      setPreviewError(typeof data.previewError === "string" ? data.previewError : null);
    } catch (error) {
      toast(error instanceof Error ? error.message : "Không tải được sitemap", "error");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    void load();
  }, [load]);

  const draftExcludePaths = useMemo(() => parseLines(excludeDraft), [excludeDraft]);

  const visibleEntries = useMemo(
    () => entries.filter((entry) => !isSitemapExcluded(entry.path, draftExcludePaths)),
    [entries, draftExcludePaths],
  );

  const excludedCount = entries.length - visibleEntries.length;

  const save = async () => {
    setSaving(true);
    try {
      const nextSettings: SitemapSettings = {
        excludePaths: draftExcludePaths,
        includeImageSitemap: settings.includeImageSitemap !== false,
      };
      const response = await fetch("/api/seo/sitemap", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: nextSettings }),
      });
      const data = (await response.json().catch(() => null)) as
        | { error?: string; revalidated?: boolean }
        | null;
      if (!response.ok) throw new Error(data?.error ?? "Lưu thất bại");

      setSettings(nextSettings);
      if (data?.revalidated === false) {
        toast(
          "Đã lưu sitemap nhưng chưa làm mới cache website — kiểm tra NEXT_PUBLIC_SITE_URL và REVALIDATION_SECRET",
          "error",
        );
      } else {
        toast("Đã lưu cài đặt sitemap");
      }
      await load();
    } catch (error) {
      toast(error instanceof Error ? error.message : "Lưu thất bại", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-zinc-500">Đang tải sitemap…</p>;
  }

  const sitemapXmlUrl = siteUrl ? `${siteUrl}/sitemap.xml` : null;
  const sitemapImagesUrl = siteUrl ? `${siteUrl}/sitemap-images.xml` : null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 space-y-0">
          <CardTitle className="text-sm">File sitemap công khai</CardTitle>
          <div className="flex flex-wrap gap-2">
            {sitemapXmlUrl ? (
              <>
                <a
                  href={sitemapXmlUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-8 items-center rounded-md border border-zinc-200 bg-white px-3 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
                >
                  <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                  sitemap.xml
                </a>
                <a
                  href={sitemapXmlUrl}
                  download="sitemap.xml"
                  className="inline-flex h-8 items-center rounded-md border border-zinc-200 bg-white px-3 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
                >
                  <Download className="mr-1.5 h-3.5 w-3.5" />
                  Tải sitemap.xml
                </a>
              </>
            ) : null}
            {sitemapImagesUrl && settings.includeImageSitemap !== false ? (
              <a
                href={sitemapImagesUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-8 items-center rounded-md border border-zinc-200 bg-white px-3 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
              >
                <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                sitemap-images.xml
              </a>
            ) : null}
            <Button type="button" variant="outline" size="sm" onClick={() => void load()} disabled={saving}>
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
              Làm mới
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-zinc-600">
          <p>
            Sitemap tự sinh từ catalog CMS (ô tô, xe máy, phụ kiện, tin tức) và các trang tĩnh. URL có
            SEO <span className="font-semibold">noindex</span> sẽ không xuất hiện.
          </p>
          {previewError ? <p className="text-amber-700">{previewError}</p> : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Cài đặt sitemap</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <label className="flex items-center gap-2 text-sm text-zinc-700">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-zinc-300"
              checked={settings.includeImageSitemap !== false}
              onChange={(e) =>
                setSettings((current) => ({
                  ...current,
                  includeImageSitemap: e.target.checked,
                }))
              }
            />
            Đăng ký <span className="font-mono text-xs">sitemap-images.xml</span> trong robots.txt
          </label>
          <div>
            <label className="mb-1 block text-xs font-semibold">
              Loại trừ khỏi sitemap (mỗi dòng một path)
            </label>
            <Textarea
              rows={5}
              value={excludeDraft}
              onChange={(e) => setExcludeDraft(e.target.value)}
              placeholder={"/phu-kien\n/tin-tuc/bai-cu-*"}
              className="font-mono text-xs"
            />
            <p className="mt-1 text-[11px] text-zinc-500">
              Hỗ trợ path chính xác (VD: <span className="font-mono">/phu-kien</span>) hoặc prefix kết
              thúc bằng <span className="font-mono">*</span> (VD:{" "}
              <span className="font-mono">/tin-tuc/bai-cu-*</span>).
            </p>
          </div>
          <Button type="button" onClick={save} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Đang lưu…" : "Lưu cài đặt sitemap"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">
            URL trong sitemap ({visibleEntries.length}
            {excludedCount > 0 ? ` · ${excludedCount} bị loại trừ theo cài đặt nháp` : ""})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {entries.length === 0 ? (
            <p className="p-6 text-sm text-zinc-500">
              Chưa có dữ liệu preview. Chạy webclient và bấm Làm mới.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="border-t border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Path</th>
                    <th className="px-4 py-3 font-semibold">Priority</th>
                    <th className="px-4 py-3 font-semibold">Tần suất</th>
                    <th className="px-4 py-3 font-semibold">Ảnh</th>
                    <th className="px-4 py-3 font-semibold">Cập nhật</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleEntries.map((entry) => (
                    <tr key={entry.url} className="border-t border-zinc-100">
                      <td className="px-4 py-2.5">
                        <a
                          href={entry.url}
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono text-xs text-red-700 hover:underline"
                        >
                          {formatPath(entry.path)}
                        </a>
                      </td>
                      <td className="px-4 py-2.5 text-zinc-700">{entry.priority.toFixed(2)}</td>
                      <td className="px-4 py-2.5 text-zinc-700">{entry.changeFrequency}</td>
                      <td className="px-4 py-2.5 text-zinc-700">{entry.imageCount}</td>
                      <td className="px-4 py-2.5 text-xs text-zinc-500">
                        {new Date(entry.lastModified).toLocaleString("vi-VN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
