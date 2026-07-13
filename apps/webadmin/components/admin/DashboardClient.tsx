"use client";

import Link from "next/link";
import { Car, Bike, Wrench, Users, Images, ChevronRight, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/core";
import { PageHeader } from "@/components/admin/PageHeader";
import { CacheWarmPanel } from "@/components/admin/CacheWarmPanel";
import type { AdminDashboardStats } from "@/lib/cms-data";
import { useLeadsCounts } from "@/lib/use-leads-count";

function buildDraftSummary(stats: AdminDashboardStats): string[] {
  const parts: string[] = [];
  if (stats.draftCarCount > 0) {
    parts.push(`${stats.draftCarCount} ô tô nháp`);
  }
  if (stats.draftScooterCount > 0) {
    parts.push(`${stats.draftScooterCount} xe máy nháp`);
  }
  if (stats.draftAccessoryCount > 0) {
    parts.push(`${stats.draftAccessoryCount} phụ kiện nháp`);
  }
  if (stats.draftMissingImageCount > 0) {
    parts.push(`${stats.draftMissingImageCount} sản phẩm nháp chưa có ảnh`);
  }
  return parts;
}

export function DashboardClient({ stats }: { stats: AdminDashboardStats }) {
  const { new: newLeadCount, total: leadCount } = useLeadsCounts();
  const draftParts = buildDraftSummary(stats);
  const draftTotal =
    stats.draftCarCount + stats.draftScooterCount + stats.draftAccessoryCount;

  const links = [
    { href: "/admin/cars", label: "Ô tô điện", count: stats.carCount, icon: Car },
    { href: "/admin/scooters", label: "Xe máy điện", count: stats.scooterCount, icon: Bike },
    { href: "/admin/accessories", label: "Phụ kiện", count: stats.accessoryCount, icon: Wrench },
    {
      href: "/admin/media",
      label: "Thư viện ảnh",
      count: stats.mediaFolderCount,
      icon: Images,
      sub: `${stats.mediaImageCount} ảnh`,
    },
    {
      href: "/admin/leads",
      label: "Lead khách",
      count: leadCount,
      icon: Users,
      badge: newLeadCount,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Tổng quan" description="Quản lý sản phẩm, thư viện ảnh và lead khách hàng" />

      {draftTotal > 0 || stats.draftMissingImageCount > 0 ? (
        <Card className="border-amber-200 bg-amber-50/60">
          <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-3">
              <div className="rounded-lg bg-amber-100 p-2">
                <AlertCircle className="h-5 w-5 text-amber-700" />
              </div>
              <div>
                <p className="font-semibold text-amber-950">Sản phẩm nháp cần xử lý</p>
                <p className="mt-1 text-sm text-amber-900/80">
                  {draftParts.join(" · ")}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {stats.draftCarCount > 0 ? (
                <Link
                  href="/admin/cars"
                  className="rounded-md border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium text-amber-900 hover:bg-amber-50"
                >
                  Ô tô nháp
                </Link>
              ) : null}
              {stats.draftScooterCount > 0 ? (
                <Link
                  href="/admin/scooters"
                  className="rounded-md border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium text-amber-900 hover:bg-amber-50"
                >
                  Xe máy nháp
                </Link>
              ) : null}
              {stats.draftAccessoryCount > 0 ? (
                <Link
                  href="/admin/accessories"
                  className="rounded-md border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium text-amber-900 hover:bg-amber-50"
                >
                  Phụ kiện nháp
                </Link>
              ) : null}
              {stats.draftMissingImageCount > 0 ? (
                <Link
                  href="/admin/media"
                  className="rounded-md border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium text-amber-900 hover:bg-amber-50"
                >
                  Thư viện ảnh
                </Link>
              ) : null}
            </div>
          </CardContent>
        </Card>
      ) : null}

      <CacheWarmPanel />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {links.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardContent className="flex flex-col gap-4 p-6">
                  <div className="flex items-center justify-between">
                    <div className="rounded-lg bg-red-50 p-2">
                      <Icon className="h-5 w-5 text-red-600" />
                    </div>
                    <span className="text-2xl font-bold tabular-nums">{item.count}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-zinc-900">{item.label}</p>
                    {"badge" in item && item.badge ? (
                      <span className="rounded-full bg-red-600 px-2 py-0.5 text-xs font-bold text-white">
                        {item.badge} mới
                      </span>
                    ) : "sub" in item && item.sub ? (
                      <span className="text-xs text-zinc-500">{item.sub}</span>
                    ) : null}
                  </div>
                  <span className="flex items-center text-sm font-medium text-red-600">
                    Mở <ChevronRight className="ml-1 h-4 w-4" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
