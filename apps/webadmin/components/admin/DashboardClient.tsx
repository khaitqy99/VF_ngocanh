"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Car, Bike, Wrench, Users, Images, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/core";
import { PageHeader } from "@/components/admin/PageHeader";
import type { AdminDashboardStats } from "@/lib/cms-data";
import { countNewLeads, fetchLeads, MOCK_LEADS } from "@/lib/leads";

export function DashboardClient({ stats }: { stats: AdminDashboardStats }) {
  const [leadCount, setLeadCount] = useState(MOCK_LEADS.length);
  const [newLeadCount, setNewLeadCount] = useState(countNewLeads(MOCK_LEADS));

  useEffect(() => {
    fetchLeads()
      .then((data) => {
        if (data.configured) {
          setLeadCount(data.leads.length);
          setNewLeadCount(countNewLeads(data.leads));
        }
      })
      .catch(() => undefined);
  }, []);

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
