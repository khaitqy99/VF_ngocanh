"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const NAV = [
  "Giới thiệu",
  "Ô tô",
  "Xe máy điện",
  "Phụ kiện xe",
  "Dịch vụ hậu mãi",
  "Pin và trạm sạc",
  "Lưu trữ năng lượng",
];

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
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

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
          {NAV.map((n) => (
            <a
              key={n}
              href="#"
              className="whitespace-nowrap text-[13px] font-medium text-foreground/80 transition-colors hover:text-brand"
            >
              {n}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2.5">
          <button className="hidden items-center rounded-md bg-brand px-4 py-2.5 text-[12px] font-semibold tracking-wide text-white shadow-sm transition-colors hover:bg-[#0046cc] sm:inline-flex">
            ĐĂNG KÝ LÁI THỬ
          </button>
          <button
            onClick={() => setOpen(!open)}
            className="rounded-md p-2 text-brand-dark lg:p-2.5"
            aria-label="Menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t bg-white lg:hidden">
          <div className="container-vf flex flex-col gap-1 py-4">
            {NAV.map((n) => (
              <a key={n} href="#" className="py-2.5 text-sm font-medium text-foreground/85">
                {n}
              </a>
            ))}
            <button className="mt-3 rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white">
              ĐĂNG KÝ LÁI THỬ
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
