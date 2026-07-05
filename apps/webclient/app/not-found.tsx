import type { Metadata } from "next";
import Link from "next/link";

import { StaticPageReveal } from "@/components/motion/StaticPageReveal";

export const metadata: Metadata = {
  title: "Không tìm thấy trang",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function NotFound() {
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
        <h1 className="mt-3 font-mono text-7xl font-bold tabular-nums tracking-tighter text-brand-dark sm:text-8xl">
          404
        </h1>
        <p className="mt-3 text-base font-semibold text-brand-dark">Trang không tồn tại</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Đường dẫn có thể đã thay đổi hoặc trang đã được gỡ bỏ.
        </p>
        <Link
          href="/"
          className="home-cta-primary mt-8 inline-flex rounded-full px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#0046cc]"
        >
          Về trang chủ
        </Link>
      </StaticPageReveal>
    </div>
  );
}
