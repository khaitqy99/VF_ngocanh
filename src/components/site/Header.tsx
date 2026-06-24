"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { IMAGES } from "@/lib/images";
import { buttonHover, buttonTap, springSnappy } from "@/lib/motion";

const NAV = [
  { label: "Giới thiệu", href: "/gioi-thieu" },
  { label: "Ô tô", href: "/oto" },
  { label: "Xe máy điện", href: "/xe-may-dien" },
  { label: "Phụ kiện xe", href: "/phu-kien" },
  { label: "Dịch vụ hậu mãi", href: "/dich-vu-hau-mai" },
  { label: "Pin và trạm sạc", href: "/pin-va-tram-sac" },
  { label: "Lưu trữ năng lượng", href: "/luu-tru-nang-luong" },
] as const;

function BrandLogo({ className }: { className?: string }) {
  return (
    <Image
      src={IMAGES.vinfastLogo}
      alt="VinFast — Đại lý VF Ngọc Anh"
      width={140}
      height={32}
      priority
      className={className ?? "h-7 w-auto sm:h-8"}
    />
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
      <motion.header
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ...springSnappy, delay: 0.05 }}
        className={`fixed inset-x-0 top-0 z-50 border-b bg-white/95 backdrop-blur-md transition-shadow duration-300 ${scrolled ? "border-border/60 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.08)]" : "border-transparent"}`}
      >
        <div className="container-vf flex h-14 items-center justify-between gap-3 lg:gap-6">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link href="/" className="flex shrink-0 items-center">
              <BrandLogo />
            </Link>
          </motion.div>

          <nav className="hidden flex-1 items-center justify-center gap-6 xl:gap-8 lg:flex">
            {NAV.map(({ label, href }, i) => {
              const active = pathname === href;
              return (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...springSnappy, delay: 0.1 + i * 0.07 }}
                >
                  <Link
                    href={href}
                    className={`relative whitespace-nowrap pb-0.5 text-xs font-medium transition-colors hover:text-brand ${
                      active ? "text-brand" : "text-foreground/80"
                    }`}
                  >
                    {label}
                    {active && (
                      <motion.span
                        layoutId="nav-active-indicator"
                        className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-brand"
                        transition={springSnappy}
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={buttonHover}
              whileTap={buttonTap}
              className="hidden items-center rounded-md bg-brand px-3.5 py-2 text-[11px] font-semibold tracking-wide text-white shadow-sm shadow-brand/20 transition-colors hover:bg-[#0046cc] sm:inline-flex"
            >
              ĐĂNG KÝ LÁI THỬ
            </motion.button>

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
              <SheetTitle className="sr-only">Menu điều hướng VF Ngọc Anh</SheetTitle>
              <div className="flex items-center pr-10">
                <BrandLogo />
              </div>
            </SheetHeader>

            <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Menu điều hướng">
              <ul className="space-y-1">
                {NAV.map(({ label, href }, i) => {
                  const active = pathname === href;
                  return (
                    <motion.li
                      key={label}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ ...springSnappy, delay: i * 0.08 }}
                    >
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
                    </motion.li>
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
      </motion.header>
      <div className="h-14 shrink-0" aria-hidden />
    </>
  );
}
