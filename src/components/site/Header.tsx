"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const NAV = [
  { label: "Giới thiệu", href: "/gioi-thieu" },
  { label: "Ô tô", href: "/oto" },
  { label: "Xe máy điện", href: "/xe-may-dien" },
  { label: "Phụ kiện xe", href: "/phu-kien" },
  { label: "Dịch vụ hậu mãi", href: "/dich-vu-hau-mai" },
  { label: "Pin và trạm sạc", href: "/pin-va-tram-sac" },
  { label: "Lưu trữ năng lượng", href: "/luu-tru-nang-luong" },
] as const;

function Logo() {
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-brand-dark">
      <svg viewBox="0 0 32 32" className="h-5 w-5" aria-hidden="true">
        <path
          d="M6 24 L16 6 L26 24 Z"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path d="M11 24 L21 24" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b bg-white transition-colors ${scrolled ? "border-border/60" : "border-transparent"}`}
      >
        <div className="container-vf flex h-14 items-center justify-between gap-3 lg:gap-6">
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <Logo />
            <span className="text-sm font-black tracking-tight text-brand-dark">VF NGỌC ANH</span>
          </Link>

          <nav className="hidden flex-1 items-center justify-center gap-6 xl:gap-8 lg:flex">
            {NAV.map(({ label, href }) => {
              const active = pathname === href;
              return (
                <Link
                  key={label}
                  href={href}
                  className={`relative whitespace-nowrap pb-0.5 text-xs font-medium transition-colors hover:text-brand ${
                    active ? "text-brand" : "text-foreground/80"
                  }`}
                >
                  {label}
                  {active && (
                    <span className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-brand" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button className="hidden items-center rounded-md bg-brand px-3.5 py-2 text-[11px] font-semibold tracking-wide text-white shadow-sm transition-colors hover:bg-[#0046cc] sm:inline-flex">
              ĐĂNG KÝ LÁI THỬ
            </button>

            <button
              type="button"
              className="inline-flex size-9 items-center justify-center rounded-md text-brand-dark transition-colors hover:bg-slate-100 lg:hidden"
              aria-label="Mở menu điều hướng"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent
            side="right"
            hideClose
            className="flex w-full flex-col gap-0 p-0 sm:max-w-sm"
          >
            <SheetClose
              type="button"
              className="fixed right-[1.25rem] top-4 z-[60] inline-flex size-10 items-center justify-center rounded-md text-brand-dark transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 lg:hidden"
              aria-label="Đóng menu điều hướng"
            >
              <X className="size-5" />
            </SheetClose>

            <SheetHeader className="border-b border-border/60 px-5 py-4 text-left">
              <div className="flex items-center gap-2.5 pr-10">
                <Logo />
                <SheetTitle className="text-[15px] font-black tracking-tight text-brand-dark">
                  VF NGỌC ANH
                </SheetTitle>
              </div>
            </SheetHeader>

            <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Menu điều hướng">
              <ul className="space-y-1">
                {NAV.map(({ label, href }) => {
                  const active = pathname === href;
                  return (
                    <li key={label}>
                      <SheetClose asChild>
                        <Link
                          href={href}
                          className={`block rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                            active
                              ? "bg-brand/10 text-brand"
                              : "text-foreground/80 hover:bg-slate-50 hover:text-brand"
                          }`}
                        >
                          {label}
                        </Link>
                      </SheetClose>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="border-t border-border/60 p-4">
              <SheetClose asChild>
                <button
                  type="button"
                  className="flex w-full items-center justify-center rounded-md bg-brand px-4 py-3 text-[12px] font-semibold tracking-wide text-white shadow-sm transition-colors hover:bg-[#0046cc]"
                >
                  ĐĂNG KÝ LÁI THỬ
                </button>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </header>
      <div className="h-14 shrink-0" aria-hidden />
    </>
  );
}
