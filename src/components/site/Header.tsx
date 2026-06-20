"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-brand-dark">
      <svg viewBox="0 0 32 32" className="h-6 w-6" aria-hidden="true">
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b border-transparent bg-white transition-shadow ${scrolled ? "border-border/60 shadow-[0_2px_16px_-4px_rgba(11,31,91,0.1)]" : ""}`}
    >
      <div className="container-vf flex h-[72px] items-center justify-between gap-4 lg:gap-8">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <Logo />
          <span className="text-[15px] font-black tracking-tight text-brand-dark">VF NGỌC ANH</span>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-6 xl:gap-8 lg:flex">
          {NAV.map(({ label, href }) => {
            const active = pathname === href;
            return (
              <Link
                key={label}
                href={href}
                className={`relative whitespace-nowrap pb-0.5 text-[13px] font-medium transition-colors hover:text-brand ${
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

        <button className="hidden items-center rounded-md bg-brand px-4 py-2.5 text-[12px] font-semibold tracking-wide text-white shadow-sm transition-colors hover:bg-[#0046cc] sm:inline-flex">
          ĐĂNG KÝ LÁI THỬ
        </button>
      </div>
    </header>
  );
}
