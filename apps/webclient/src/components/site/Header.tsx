"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useMountReveal } from "@/hooks/use-scroll-reveal";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { IMAGES } from "@/lib/images";
import { buttonHover, buttonTap, springSnappy } from "@/lib/motion";
import { MOTION_INSTANT } from "@/lib/motion-safe";
import { MAIN_SITE_NAV } from "@/lib/site-navigation";

function BrandLogo() {
  return (
    <Image
      src={IMAGES.vinfastLogo}
      alt="VinFast — Đại lý VinFast Ngọc Anh Cà Mau"
      width={140}
      height={32}
      priority
      className="h-7 w-auto sm:h-8"
    />
  );
}

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const reduced = useReducedMotion();
  const mount = useMountReveal(0.05);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navLink = (active: boolean) =>
    active ? "text-brand" : "text-foreground/80 hover:text-brand";

  const ctaClass =
    "hidden items-center rounded-full bg-brand px-4 py-2 text-[11px] font-semibold tracking-wide text-white shadow-sm shadow-brand/20 transition-colors hover:bg-[#0046cc] sm:inline-flex";

  const menuBtnClass =
    "inline-flex size-9 items-center justify-center rounded-md text-brand-dark transition-colors hover:bg-slate-100 lg:hidden";

  return (
    <>
      <motion.header
        initial={mount.initial}
        animate={mount.animate}
        transition={mount.transition}
        className={`fixed inset-x-0 top-0 z-50 border-b bg-white/90 backdrop-blur-xl transition-[box-shadow,border-color,background-color] duration-300 ${scrolled ? "border-border/60 shadow-[var(--shadow-brand)]" : "border-transparent"}`}
      >
        <div className="container-vf flex h-14 items-center justify-between gap-3 lg:gap-6">
          <motion.div
            whileHover={reduced ? undefined : { scale: 1.02 }}
            whileTap={reduced ? undefined : { scale: 0.98 }}
          >
            <Link href="/" className="flex shrink-0 items-center">
              <BrandLogo />
            </Link>
          </motion.div>

          <nav className="hidden flex-1 items-center justify-center gap-6 xl:gap-8 lg:flex">
            {MAIN_SITE_NAV.map(({ label, href }, i) => {
              const active = pathname === href;
              return (
                <motion.div
                  key={label}
                  initial={reduced ? false : { opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={reduced ? MOTION_INSTANT : { ...springSnappy, delay: 0.1 + i * 0.07 }}
                >
                  <Link
                    href={href}
                    className={`relative whitespace-nowrap pb-0.5 text-xs font-medium transition-colors ${navLink(active)}`}
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
            <motion.button whileHover={buttonHover} whileTap={buttonTap} className={ctaClass}>
              ĐĂNG KÝ LÁI THỬ
            </motion.button>

            <button
              type="button"
              className={menuBtnClass}
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
              <SheetTitle className="sr-only">Menu điều hướng VinFast Ngọc Anh Cà Mau</SheetTitle>
              <div className="flex items-center pr-10">
                <BrandLogo />
              </div>
            </SheetHeader>

            <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Menu điều hướng">
              <ul className="space-y-1">
                {MAIN_SITE_NAV.map(({ label, href }, i) => {
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
                              : "text-foreground/80 hover:bg-surface-muted hover:text-brand"
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
                  className="home-cta-primary flex w-full items-center justify-center rounded-full px-4 py-3 text-[12px] font-semibold tracking-wide text-white transition hover:bg-[#0046cc]"
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
