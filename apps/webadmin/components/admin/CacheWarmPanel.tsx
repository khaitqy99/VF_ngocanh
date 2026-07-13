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
  const statusLabel = loadingConfig ? "…" : ready ? "Sẵn sàng" : "Chưa OK";
  const siteHost = config?.siteUrl?.replace(/^https?:\/\//, "") ?? null;
  const isLocalSite =
    siteHost != null &&
    (siteHost.startsWith("localhost") || siteHost.startsWith("127.0.0.1"));
  const sub = lastResult?.ok
    ? formatWarmSummary(lastResult)
    : siteHost
      ? isLocalSite
        ? `Dev · ${siteHost}`
        : siteHost
      : "Preload CMS lên Redis";

  return (
    <Card className="h-full transition-shadow hover:shadow-md">
      <CardContent className="flex h-full flex-col gap-3 p-5">
        <div className="flex items-start justify-between">
          <div className="rounded-lg bg-sky-50 p-2">
            <Database className="h-5 w-5 text-sky-600" />
          </div>
          <span
            className={`text-sm font-bold ${ready ? "text-emerald-600" : "text-amber-600"}`}
          >
            {statusLabel}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-semibold text-zinc-900">Cache Redis</p>
          <p className="mt-0.5 truncate text-xs text-zinc-500" title={sub}>
            {sub}
          </p>
        </div>

        <Button
          type="button"
          onClick={handleWarm}
          disabled={!ready || warming || loadingConfig}
          className="h-8 w-full text-xs"
        >
          {warming ? (
            <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
          ) : (
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
          )}
          {warming ? "Đang warm..." : "Làm mới cache"}
        </Button>
      </CardContent>
    </Card>
  );
}
