"use client";

import type { ReactNode } from "react";

import { FadeIn } from "@/components/motion";
import { vfCtaHeading } from "@/lib/typography";

export function PageCtaSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-brand-dark section-y">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,87,255,0.18),transparent_55%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(11,31,91,0.4)_0%,transparent_40%)]"
      />
      <FadeIn className="container-vf relative z-10 text-center text-white">
        <h2 className={vfCtaHeading}>{title}</h2>
        {description ? (
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/72">
            {description}
          </p>
        ) : null}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">{children}</div>
      </FadeIn>
    </section>
  );
}

export const pageCtaPrimary =
  "home-cta-primary inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0046cc]";

export const pageCtaGhost =
  "inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition hover:border-white/55 hover:bg-white/16";

export const pdpCtaPrimary =
  "home-cta-primary inline-flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-semibold text-white transition hover:bg-[#0046cc]";

export const pdpCtaSecondary =
  "inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-brand bg-white py-3.5 text-sm font-semibold text-brand transition hover:bg-brand/5";

export const pdpCtaInline =
  "inline-flex items-center gap-2 rounded-full border-2 border-brand bg-white px-6 py-3 text-sm font-semibold text-brand transition hover:bg-brand/5";

export const pdpCtaInlineLight =
  "inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-dark transition hover:bg-white/90";

export const pdpCtaInlineGhost =
  "inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10";
