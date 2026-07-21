"use client";

import Link from "next/link";
import { useState } from "react";
import { Bike, Car, Wrench } from "lucide-react";
import { Card, CardContent } from "@/components/ui/core";

type CatalogItem = { id: string; name: string; slug: string };

type ProductTab = "car" | "scooter" | "accessory";

const TABS: {
  value: ProductTab;
  label: string;
  icon: typeof Car;
  baseHref: string;
}[] = [
  { value: "car", label: "Ô tô điện", icon: Car, baseHref: "/admin/cars" },
  { value: "scooter", label: "Xe máy điện", icon: Bike, baseHref: "/admin/scooters" },
  { value: "accessory", label: "Phụ kiện", icon: Wrench, baseHref: "/admin/accessories" },
];

export function SeoProductsSectionClient({
  cars,
  scooters,
  accessories,
}: {
  cars: CatalogItem[];
  scooters: CatalogItem[];
  accessories: CatalogItem[];
}) {
  const [tab, setTab] = useState<ProductTab>("car");

  const itemsByTab: Record<ProductTab, CatalogItem[]> = {
    car: cars,
    scooter: scooters,
    accessory: accessories,
  };

  const active = TABS.find((item) => item.value === tab) ?? TABS[0]!;
  const items = itemsByTab[tab];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 border-b border-zinc-200 pb-3">
        {TABS.map((item) => {
          const Icon = item.icon;
          const count = itemsByTab[item.value].length;
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => setTab(item.value)}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-bold ${
                tab === item.value ? "bg-red-600 text-white" : "text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
              <span className={tab === item.value ? "text-white/80" : "text-zinc-400"}>({count})</span>
            </button>
          );
        })}
      </div>

      <div>
        {items.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-sm text-zinc-500">
              Chưa có sản phẩm trong danh mục này.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <Card key={item.id} className="transition hover:border-red-200 hover:shadow-sm">
                <CardContent className="flex items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-zinc-900">{item.name}</p>
                    <p className="truncate text-xs text-zinc-500">/{item.slug}</p>
                  </div>
                  <div className="flex shrink-0 gap-2 text-xs">
                    <Link
                      href={`${active.baseHref}/${item.id}?tab=settings`}
                      className="font-medium text-zinc-600 hover:text-zinc-900"
                    >
                      Thông tin
                    </Link>
                    <Link
                      href={`${active.baseHref}/${item.id}?tab=seo`}
                      className="font-medium text-red-600 hover:underline"
                    >
                      SEO
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
