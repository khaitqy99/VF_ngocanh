"use client";

import Link from "next/link";

import { StaticPageReveal } from "@/components/motion/StaticPageReveal";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,87,255,0.08),transparent_55%)]"
      />
      <StaticPageReveal>
        <p className="text-[11px] font-semibold tracking-[0.16em] text-brand uppercase">
          VinFast 3S Cà Mau
        </p>
        <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-brand-dark sm:text-3xl">
          Có lỗi xảy ra
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Hệ thống gặp sự cố tạm thời. Anh/chị vui lòng thử lại sau giây lát.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => reset()}
            className="home-cta-primary inline-flex rounded-full px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#0046cc]"
          >
            Thử lại
          </button>
          <Link
            href="/"
            className="inline-flex rounded-full border border-brand/25 bg-white px-7 py-3 text-sm font-semibold text-brand transition hover:bg-brand/5"
          >
            Về trang chủ
          </Link>
        </div>
      </StaticPageReveal>
    </div>
  );
}
