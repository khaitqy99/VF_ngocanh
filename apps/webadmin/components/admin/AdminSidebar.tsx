"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Car, Bike, Wrench, Users, Images, LogOut, Menu, Search } from "lucide-react";
import { cn, Button } from "@/components/ui/core";
import { countNewLeads, fetchLeads } from "@/lib/leads";

const MENU_ITEMS = [
  { href: "/admin/cars", label: "Ô tô", icon: Car },
  { href: "/admin/scooters", label: "Xe máy", icon: Bike },
  { href: "/admin/accessories", label: "Phụ kiện", icon: Wrench },
  { href: "/admin/seo", label: "SEO", icon: Search },
  { href: "/admin/media", label: "Thư viện ảnh", icon: Images },
  { href: "/admin/leads", label: "Lead khách", icon: Users, badge: true },
];

export function AdminSidebar({
  isOpen,
  onLogout,
}: {
  isOpen: boolean;
  onLogout: () => void;
}) {
  const pathname = usePathname();
  const [newLeads, setNewLeads] = useState(0);

  useEffect(() => {
    fetchLeads()
      .then((data) => {
        if (data.configured) {
          setNewLeads(countNewLeads(data.leads));
        }
      })
      .catch(() => undefined);
  }, []);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <aside
      className={cn(
        "flex shrink-0 flex-col border-r border-zinc-200 bg-white transition-all duration-300",
        isOpen ? "w-64" : "w-0 overflow-hidden md:w-20",
      )}
    >
      <div className="flex h-16 items-center border-b border-zinc-200 px-6 py-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-red-600 font-bold text-white">
          V
        </div>
        <span className={cn("ml-3 font-semibold text-zinc-900", !isOpen && "hidden")}>
          VF Ngọc Anh
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-red-50 text-red-700"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
                !isOpen && "md:justify-center",
              )}
              title={!isOpen ? item.label : undefined}
            >
              <Icon
                className={cn("h-4 w-4 shrink-0", active ? "text-red-600" : "text-zinc-500")}
              />
              <span className={cn("ml-3 flex-1", !isOpen && "hidden")}>{item.label}</span>
              {item.badge && newLeads > 0 && isOpen ? (
                <span className="rounded-full bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {newLeads}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-zinc-200 p-4">
        <Button
          variant="ghost"
          className={cn("w-full justify-start", !isOpen && "md:justify-center md:px-0")}
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span className={cn("ml-3", !isOpen && "hidden")}>Đăng xuất</span>
        </Button>
      </div>
    </aside>
  );
}

export function AdminHeader({ toggleSidebar }: { toggleSidebar: () => void }) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-4 md:px-8">
      <button
        type="button"
        onClick={toggleSidebar}
        className="text-zinc-500 hover:text-zinc-900"
        aria-label="Toggle sidebar"
      >
        <Menu className="h-5 w-5" />
      </button>
      <p className="hidden text-sm text-zinc-500 sm:block">Sản phẩm, ảnh & Lead khách hàng</p>
      <div className="w-8" />
    </header>
  );
}
