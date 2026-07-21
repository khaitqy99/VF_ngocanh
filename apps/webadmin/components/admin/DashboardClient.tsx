"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Bike,
  Car,
  ChevronRight,
  Globe,
  Images,
  Newspaper,
  Users,
  Wrench,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/core";
import { PageHeader } from "@/components/admin/PageHeader";
import { CacheWarmPanel } from "@/components/admin/CacheWarmPanel";
import type { DashboardOverview } from "@/lib/cms-data";
import {
  formatLeadDate,
  getLeadStatusLabel,
  getLeadTypeLabel,
  getLeadStatusVariant,
} from "@/lib/leads";
import type { LeadType } from "@/lib/leads";
import type { DashboardLeadSummary, DashboardRecentLead } from "@/lib/cms-data";

function StatusBadge({
  label,
  variant,
}: {
  label: string;
  variant: "default" | "secondary" | "success" | "warning";
}) {
  const styles = {
    default: "bg-red-100 text-red-800",
    warning: "bg-amber-100 text-amber-900",
    success: "bg-emerald-100 text-emerald-800",
    secondary: "bg-zinc-100 text-zinc-600",
  };
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${styles[variant]}`}>
      {label}
    </span>
  );
}

function KpiCard({
  href,
  label,
  value,
  sub,
  icon: Icon,
  accent = "red",
}: {
  href: string;
  label: string;
  value: number | string;
  sub?: string;
  icon: ComponentType<{ className?: string }>;
  accent?: "red" | "amber" | "emerald" | "zinc";
}) {
  const accents = {
    red: "bg-red-50 text-red-600",
    amber: "bg-amber-50 text-amber-700",
    emerald: "bg-emerald-50 text-emerald-700",
    zinc: "bg-zinc-100 text-zinc-600",
  };

  return (
    <Link href={href}>
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardContent className="flex flex-col gap-3 p-5">
          <div className="flex items-start justify-between">
            <div className={`rounded-lg p-2 ${accents[accent]}`}>
              <Icon className="h-5 w-5" />
            </div>
            <span className="text-2xl font-bold tabular-nums text-zinc-900">{value}</span>
          </div>
          <div>
            <p className="font-semibold text-zinc-900">{label}</p>
            {sub ? <p className="mt-0.5 text-xs text-zinc-500">{sub}</p> : null}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function DashboardAlerts({
  items,
}: {
  items: {
    id: string;
    tone: "amber" | "red";
    message: string;
    actions?: { href: string; label: string }[];
  }[];
}) {
  if (items.length === 0) return null;

  const iconStyles = {
    red: "text-red-600",
    amber: "text-amber-600",
  };
  const textStyles = {
    red: "text-red-950",
    amber: "text-amber-950",
  };
  const linkStyles = {
    red: "text-red-700 hover:text-red-900",
    amber: "text-amber-800 hover:text-amber-950",
  };

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200/80 bg-zinc-50/70 text-sm">
      <div className="divide-y divide-zinc-200/60">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-wrap items-center gap-x-2.5 gap-y-1 px-3.5 py-2"
          >
            <AlertCircle className={`h-3.5 w-3.5 shrink-0 ${iconStyles[item.tone]}`} />
            <span className={`min-w-0 flex-1 ${textStyles[item.tone]}`}>{item.message}</span>
            {item.actions?.length ? (
              <div className="flex shrink-0 flex-wrap items-center gap-x-2.5 gap-y-0.5">
                {item.actions.map((action, index) => (
                  <span key={action.href} className="inline-flex items-center gap-x-2.5">
                    {index > 0 ? <span className="text-xs text-zinc-300">·</span> : null}
                    <Link
                      href={action.href}
                      className={`inline-flex items-center gap-0.5 text-xs font-medium underline-offset-2 hover:underline ${linkStyles[item.tone]}`}
                    >
                      {action.label}
                      <ChevronRight className="h-3 w-3 opacity-60" />
                    </Link>
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductStatusBar({
  label,
  counts,
}: {
  label: string;
  counts: { published: number; draft: number; archived: number };
}) {
  const total = counts.published + counts.draft + counts.archived;
  if (total === 0) {
    return (
      <div className="flex items-center justify-between text-sm">
        <span className="text-zinc-600">{label}</span>
        <span className="text-zinc-400">Chưa có dữ liệu</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-zinc-800">{label}</span>
        <span className="tabular-nums text-zinc-500">{total} tổng</span>
      </div>
      <div className="flex h-2 overflow-hidden rounded-full bg-zinc-100">
        {counts.published > 0 ? (
          <div
            className="bg-emerald-500"
            style={{ width: `${(counts.published / total) * 100}%` }}
            title={`${counts.published} đã xuất bản`}
          />
        ) : null}
        {counts.draft > 0 ? (
          <div
            className="bg-amber-400"
            style={{ width: `${(counts.draft / total) * 100}%` }}
            title={`${counts.draft} nháp`}
          />
        ) : null}
        {counts.archived > 0 ? (
          <div
            className="bg-zinc-300"
            style={{ width: `${(counts.archived / total) * 100}%` }}
            title={`${counts.archived} lưu trữ`}
          />
        ) : null}
      </div>
      <div className="flex flex-wrap gap-3 text-xs text-zinc-500">
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          {counts.published} xuất bản
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-amber-400" />
          {counts.draft} nháp
        </span>
        {counts.archived > 0 ? (
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-zinc-300" />
            {counts.archived} lưu trữ
          </span>
        ) : null}
      </div>
    </div>
  );
}

function formatPercent(count: number, total: number): string {
  if (total <= 0) return "0%";
  return `${Math.round((count / total) * 100)}%`;
}

const LEAD_TYPE_PALETTE = [
  "#ef4444",
  "#0ea5e9",
  "#8b5cf6",
  "#fbbf24",
  "#10b981",
  "#ec4899",
  "#6366f1",
  "#a1a1aa",
];

function buildConicGradient(
  items: { count: number; hex: string }[],
  total: number,
): string {
  if (total <= 0) return "#f4f4f5";

  let current = 0;
  const stops: string[] = [];

  for (const item of items) {
    if (item.count <= 0) continue;
    const start = current;
    current += (item.count / total) * 100;
    stops.push(`${item.hex} ${start}% ${current}%`);
  }

  return stops.length ? `conic-gradient(${stops.join(", ")})` : "#f4f4f5";
}

function DonutLegendGroup({
  title,
  items,
  total,
}: {
  title: string;
  items: { key: string; label: string; count: number; hex: string }[];
  total: number;
}) {
  if (items.length === 0) return null;

  return (
    <div>
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-400">{title}</p>
      <div className="space-y-1.5">
        {items.map((item) => (
          <div key={item.key} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex min-w-0 items-center gap-2 text-zinc-700">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: item.hex }}
              />
              <span className="truncate">{item.label}</span>
            </span>
            <span className="shrink-0 tabular-nums text-zinc-500">
              {item.count}{" "}
              <span className="text-zinc-400">({formatPercent(item.count, total)})</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LeadTypeDonutChart({
  typeItems,
  total,
}: {
  typeItems: { key: string; label: string; count: number; hex: string }[];
  total: number;
}) {
  const activeType = typeItems.filter((item) => item.count > 0);
  const typeTotal = activeType.reduce((sum, item) => sum + item.count, 0);

  if (total === 0 || activeType.length === 0) {
    return <p className="text-sm text-zinc-400">Chưa có dữ liệu</p>;
  }

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
      <div className="relative h-36 w-36 shrink-0">
        <div
          className="absolute inset-0 rounded-full"
          style={{ background: buildConicGradient(activeType, typeTotal) }}
        />
        <div className="absolute inset-[24%] flex flex-col items-center justify-center rounded-full bg-white">
          <span className="text-xl font-bold tabular-nums text-zinc-900">{total}</span>
          <span className="text-[10px] font-medium uppercase tracking-wide text-zinc-400">Lead</span>
        </div>
      </div>

      <div className="w-full min-w-0 flex-1">
        <DonutLegendGroup title="Loại lead" items={activeType} total={typeTotal} />
      </div>
    </div>
  );
}

function LeadPipelinePanel({ leads }: { leads: DashboardLeadSummary }) {
  const statusItems = [
    {
      key: "new",
      label: "Mới",
      count: leads.new,
      barClass: "bg-red-500",
      href: "/admin/leads?status=new",
    },
    {
      key: "in_progress",
      label: "Đang xử lý",
      count: leads.inProgress,
      barClass: "bg-amber-400",
      href: "/admin/leads?status=in_progress",
    },
    {
      key: "converted",
      label: "Chốt đơn",
      count: leads.converted,
      barClass: "bg-emerald-500",
      href: "/admin/leads?status=converted",
    },
    {
      key: "closed",
      label: "Đóng",
      count: leads.closed,
      barClass: "bg-zinc-300",
      href: "/admin/leads?status=closed",
    },
  ];

  const activeItems = statusItems.filter((item) => item.count > 0);
  const conversionRate = formatPercent(leads.converted, leads.total);

  return (
    <div className="mt-6 space-y-4 rounded-lg border border-zinc-100 bg-zinc-50/70 p-4">
      <div className="flex items-center justify-between gap-3">
        <h4 className="text-xs font-medium uppercase tracking-wide text-zinc-400">
          Pipeline xử lý
        </h4>
        <span className="text-xs text-zinc-500">Tỷ lệ chốt {conversionRate}</span>
      </div>

      {leads.total > 0 ? (
        <div className="flex h-2 overflow-hidden rounded-full bg-zinc-100">
          {activeItems.map((item) => (
            <div
              key={item.key}
              className={item.barClass}
              style={{ width: `${(item.count / leads.total) * 100}%` }}
              title={`${item.label}: ${item.count}`}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-zinc-400">Chưa có lead trong pipeline</p>
      )}

      <div className="grid grid-cols-2 gap-2">
        {statusItems.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className="flex items-center justify-between rounded-md border border-zinc-100 bg-white px-3 py-2 text-sm transition-colors hover:border-zinc-200 hover:bg-zinc-50"
          >
            <span className="flex min-w-0 items-center gap-2 text-zinc-700">
              <span className={`h-2 w-2 shrink-0 rounded-full ${item.barClass}`} />
              <span className="truncate">{item.label}</span>
            </span>
            <span className="shrink-0 font-semibold tabular-nums text-zinc-900">{item.count}</span>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2 border-t border-zinc-100 pt-3">
        <div className="rounded-md bg-white px-2 py-2 text-center">
          <p className="text-lg font-bold tabular-nums text-zinc-900">{leads.today}</p>
          <p className="text-[10px] text-zinc-500">Hôm nay</p>
        </div>
        <div className="rounded-md bg-white px-2 py-2 text-center">
          <p className="text-lg font-bold tabular-nums text-emerald-600">{leads.converted}</p>
          <p className="text-[10px] text-zinc-500">Đã chốt</p>
        </div>
        <div className="rounded-md bg-white px-2 py-2 text-center">
          <p
            className={`text-lg font-bold tabular-nums ${leads.staleNew > 0 ? "text-amber-600" : "text-zinc-900"}`}
          >
            {leads.staleNew}
          </p>
          <p className="text-[10px] text-zinc-500">Quá 24h</p>
        </div>
      </div>
    </div>
  );
}

function LeadsOverviewCard({
  leads,
  recentLeads,
}: {
  leads: DashboardLeadSummary;
  recentLeads: DashboardRecentLead[];
}) {
  const typeEntries = Object.entries(leads.byType)
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([type, count], index) => ({
      key: type,
      label: getLeadTypeLabel(type as LeadType),
      count,
      hex: LEAD_TYPE_PALETTE[index % LEAD_TYPE_PALETTE.length],
    }));

  const conversionRate = formatPercent(leads.converted, leads.total);

  return (
    <Card>
      <CardContent className="p-0">
        <div className="flex flex-col gap-4 border-b border-zinc-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-zinc-900">Lead khách hàng</h2>
            <p className="text-xs text-zinc-500">
              {leads.total} tổng · {leads.today} hôm nay · tỷ lệ chốt {conversionRate}
            </p>
          </div>
          <Link
            href="/admin/leads"
            className="flex items-center text-sm font-medium text-red-600 hover:text-red-700"
          >
            Quản lý lead <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 px-5 py-5 lg:grid-cols-2 lg:items-start">
          <div>
            <h3 className="mb-4 text-sm font-medium text-zinc-800">Tỷ lệ lead</h3>
            <LeadTypeDonutChart typeItems={typeEntries} total={leads.total} />
            <LeadPipelinePanel leads={leads} />
          </div>

          <div className="flex min-h-0 flex-col">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-medium text-zinc-800">Lead gần đây</h3>
              {leads.staleNew > 0 ? (
                <span className="text-xs font-medium text-amber-700">
                  {leads.staleNew} mới quá 24h chưa xử lý
                </span>
              ) : null}
            </div>

            {recentLeads.length === 0 ? (
              <p className="py-6 text-center text-sm text-zinc-500">Chưa có lead nào</p>
            ) : (
              <div className="max-h-[min(380px,55vh)] overflow-y-auto rounded-lg border border-zinc-100 pr-1">
                <div className="divide-y divide-zinc-100">
                  {recentLeads.map((lead) => (
                    <Link
                      key={lead.id}
                      href={`/admin/leads/${lead.id}`}
                      className="flex flex-col gap-2 px-4 py-3 transition-colors hover:bg-zinc-50 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium text-zinc-900">{lead.fullName}</p>
                        <p className="truncate text-sm text-zinc-500">
                          {lead.phone}
                          {lead.vehicleInterest ? ` · ${lead.vehicleInterest}` : ""}
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-wrap items-center gap-2">
                        <StatusBadge label={getLeadTypeLabel(lead.type)} variant="secondary" />
                        <StatusBadge
                          label={getLeadStatusLabel(lead.status)}
                          variant={getLeadStatusVariant(lead.status)}
                        />
                        <span className="text-xs tabular-nums text-zinc-400">
                          {formatLeadDate(lead.createdAt)}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardClient({ overview }: { overview: DashboardOverview }) {
  const draftTotal =
    overview.draftCarCount + overview.draftScooterCount + overview.draftAccessoryCount;

  const draftParts: string[] = [];
  if (overview.draftCarCount > 0) draftParts.push(`${overview.draftCarCount} ô tô nháp`);
  if (overview.draftScooterCount > 0) draftParts.push(`${overview.draftScooterCount} xe máy nháp`);
  if (overview.draftAccessoryCount > 0) {
    draftParts.push(`${overview.draftAccessoryCount} phụ kiện nháp`);
  }
  if (overview.draftMissingImageCount > 0) {
    draftParts.push(`${overview.draftMissingImageCount} nháp chưa có ảnh`);
  }

  const publishedProducts =
    overview.productStatus.cars.published +
    overview.productStatus.scooters.published +
    overview.productStatus.accessories.published;

  const alertItems: {
    id: string;
    tone: "amber" | "red";
    message: string;
    actions?: { href: string; label: string }[];
  }[] = [];

  if (!overview.configured) {
    alertItems.push({
      id: "config",
      tone: "red",
      message: "Database chưa cấu hình — kết nối Supabase trong .env để hiển thị dữ liệu thực.",
    });
  }

  if (overview.leads.staleNew > 0) {
    alertItems.push({
      id: "stale-leads",
      tone: "amber",
      message: `${overview.leads.staleNew} lead mới quá 24h chưa xử lý`,
      actions: [{ href: "/admin/leads?status=new", label: "Xem lead mới" }],
    });
  }

  if (draftTotal > 0 || overview.draftMissingImageCount > 0) {
    const draftActions: { href: string; label: string }[] = [];
    if (overview.draftCarCount > 0) {
      draftActions.push({ href: "/admin/cars", label: "Ô tô nháp" });
    }
    if (overview.draftScooterCount > 0) {
      draftActions.push({ href: "/admin/scooters", label: "Xe máy nháp" });
    }
    if (overview.draftAccessoryCount > 0) {
      draftActions.push({ href: "/admin/accessories", label: "Phụ kiện nháp" });
    }

    alertItems.push({
      id: "draft-products",
      tone: "amber",
      message: draftParts.join(" · "),
      actions: draftActions.length > 0 ? draftActions : undefined,
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tổng quan"
        description="Theo dõi lead, sản phẩm, nội dung và trạng thái hệ thống"
        action={
          overview.siteUrl ? (
            <a
              href={overview.siteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              <Globe className="h-4 w-4" />
              Xem website
            </a>
          ) : null
        }
      />

      <DashboardAlerts items={alertItems} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5">
        <CacheWarmPanel />
        <KpiCard
          href="/admin/leads"
          label="Lead mới"
          value={overview.leads.new}
          sub={`${overview.leads.today} hôm nay · ${overview.leads.total} tổng`}
          icon={Users}
          accent={overview.leads.new > 0 ? "red" : "zinc"}
        />
        <KpiCard
          href="/admin/cars"
          label="Sản phẩm"
          value={publishedProducts}
          sub={`${overview.carCount} ô tô · ${overview.scooterCount} xe máy · ${overview.accessoryCount} PK`}
          icon={Car}
        />
        <KpiCard
          href="/admin/posts"
          label="Tin tức"
          value={overview.news.published}
          sub={
            overview.news.draft + overview.news.scheduled > 0
              ? `${overview.news.draft} nháp · ${overview.news.scheduled} lên lịch`
              : `${overview.news.total} bài`
          }
          icon={Newspaper}
        />
        <KpiCard
          href="/admin/media"
          label="Thư viện ảnh"
          value={overview.mediaImageCount}
          sub={`${overview.mediaFolderCount} thư mục`}
          icon={Images}
        />
      </div>

      <LeadsOverviewCard leads={overview.leads} recentLeads={overview.recentLeads} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="p-5">
            <h2 className="mb-4 font-semibold text-zinc-900">Tình trạng sản phẩm</h2>
            <div className="space-y-5">
              <ProductStatusBar label="Ô tô điện" counts={overview.productStatus.cars} />
              <ProductStatusBar label="Xe máy điện" counts={overview.productStatus.scooters} />
              <ProductStatusBar label="Phụ kiện" counts={overview.productStatus.accessories} />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3">
            {[
              { href: "/admin/cars", label: "Ô tô", count: overview.carCount, icon: Car },
              { href: "/admin/scooters", label: "Xe máy", count: overview.scooterCount, icon: Bike },
              {
                href: "/admin/accessories",
                label: "Phụ kiện",
                count: overview.accessoryCount,
                icon: Wrench,
              },
              { href: "/admin/posts", label: "Tin tức", count: overview.news.total, icon: Newspaper },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <Card className="transition-shadow hover:shadow-md">
                    <CardContent className="flex items-center gap-3 p-4">
                      <div className="rounded-lg bg-red-50 p-2">
                        <Icon className="h-4 w-4 text-red-600" />
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500">{item.label}</p>
                        <p className="text-lg font-bold tabular-nums">{item.count}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
