"use client";

import { useCallback, useEffect, useState } from "react";
import { Database, Loader2, RefreshCw } from "lucide-react";
import { Button, Card, CardContent } from "@/components/ui/core";
import { useToast } from "@/components/admin/ToastProvider";
import type { WarmWebclientCacheResult } from "@/lib/warm-webclient-cache";

type ConfigStatus = {
  siteUrl: string | null;
  secretConfigured: boolean;
  ready: boolean;
};

function formatWarmSummary(result: WarmWebclientCacheResult): string {
  const parts = [
    result.cars != null && result.scooters != null
      ? `${result.cars} ô tô · ${result.scooters} xe máy`
      : null,
    result.vehicleDetails != null ? `${result.vehicleDetails} PDP xe` : null,
    result.accessories != null ? `${result.accessories} phụ kiện` : null,
    result.newsArticles != null ? `${result.newsArticles} tin tức` : null,
    result.redisKeys != null ? `${result.redisKeys} key Redis` : null,
  ].filter(Boolean);

  return parts.join(" · ");
}

export function CacheWarmPanel() {
  const { toast } = useToast();
  const [config, setConfig] = useState<ConfigStatus | null>(null);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [warming, setWarming] = useState(false);
  const [lastResult, setLastResult] = useState<WarmWebclientCacheResult | null>(null);

  const loadConfig = useCallback(async () => {
    setLoadingConfig(true);
    try {
      const response = await fetch("/api/cache/warm", { credentials: "include", cache: "no-store" });
      if (!response.ok) throw new Error("Không tải được cấu hình cache");
      setConfig((await response.json()) as ConfigStatus);
    } catch {
      setConfig(null);
    } finally {
      setLoadingConfig(false);
    }
  }, []);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  async function handleWarm() {
    setWarming(true);
    try {
      const response = await fetch("/api/cache/warm", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
      });
      const result = (await response.json()) as WarmWebclientCacheResult;
      setLastResult(result);

      if (!response.ok || !result.ok) {
        toast(result.error ?? "Warm cache thất bại", "error");
        return;
      }

      toast(`Đã làm mới cache Redis — ${formatWarmSummary(result)}`, "success");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Warm cache thất bại";
      toast(message, "error");
    } finally {
      setWarming(false);
    }
  }

  const ready = config?.ready ?? false;

  return (
    <Card className="border-sky-200 bg-sky-50/40">
      <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-3">
          <div className="rounded-lg bg-sky-100 p-2">
            <Database className="h-5 w-5 text-sky-700" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sky-950">Cache Redis website</p>
            <p className="mt-1 text-sm text-sky-900/80">
              {loadingConfig
                ? "Đang kiểm tra cấu hình..."
                : ready
                  ? "Preload toàn bộ dữ liệu CMS (sản phẩm, trang, SEO, tin tức…) lên Redis sau deploy hoặc khi cần làm mới."
                  : "Chưa sẵn sàng — cần NEXT_PUBLIC_SITE_URL và REVALIDATION_SECRET trên webadmin. Redis URL cấu hình trên webclient (Vercel)."}
            </p>
            {config?.siteUrl ? (
              <p className="mt-1 truncate text-xs text-sky-800/70">Website: {config.siteUrl}</p>
            ) : null}
            {lastResult?.ok ? (
              <p className="mt-2 text-xs font-medium text-emerald-800">
                Lần gần nhất: {formatWarmSummary(lastResult)}
                {lastResult.redisDeletedKeys != null
                  ? ` · đã xóa ${lastResult.redisDeletedKeys} key cũ`
                  : ""}
              </p>
            ) : lastResult?.error ? (
              <p className="mt-2 text-xs font-medium text-red-700">{lastResult.error}</p>
            ) : null}
          </div>
        </div>

        <Button
          type="button"
          onClick={handleWarm}
          disabled={!ready || warming || loadingConfig}
          className="shrink-0"
        >
          {warming ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          {warming ? "Đang warm cache..." : "Làm mới cache Redis"}
        </Button>
      </CardContent>
    </Card>
  );
}
