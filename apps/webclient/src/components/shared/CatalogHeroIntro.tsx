"use client";

import { Phone, type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

import { revealTransition } from "@/lib/motion";
import { vfHeroTitle } from "@/lib/typography";
import {
  FadeIn,
  MotionButton,
  MotionLinkButton,
  StaggerGrid,
  StaggerItem,
} from "@/components/motion";

export type CatalogHeroHighlight = {
  value: string;
  label: string;
};

export type CatalogHeroFeature = {
  icon: LucideIcon;
  text: string;
  sub: string;
};

export function CatalogHeroIntro({
  title,
  titleAccent,
  description,
  primaryCta,
  secondaryCta,
  highlights,
  features,
}: {
  title: string;
  titleAccent: string;
  description: string;
  primaryCta: { label: string; onClick: () => void };
  secondaryCta: { label: string; href: string };
  highlights: CatalogHeroHighlight[];
  features: CatalogHeroFeature[];
}) {
  return (
    <section className="relative overflow-hidden border-b border-slate-200/60 bg-gradient-to-b from-[#f4f6fa] via-[#f8f9fc] to-white py-10 sm:py-12 lg:py-14">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-0 size-72 rounded-full bg-brand/5 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-16 left-0 size-56 rounded-full bg-emerald-400/10 blur-3xl"
      />

      <div className="container-vf relative">
        <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-10 xl:gap-14">
          <FadeIn direction="left" blur className="text-center lg:text-left">
            <h1 className={vfHeroTitle}>
              {title}
              <span className="mt-1 block bg-gradient-to-r from-brand via-blue-500 to-emerald-500 bg-clip-text text-transparent italic">
                {titleAccent}
              </span>
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-600 lg:mx-0 lg:text-[15px]">
              {description}
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <MotionButton
                type="button"
                onClick={primaryCta.onClick}
                className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-6 py-3 text-xs font-extrabold tracking-wider text-white shadow-md shadow-brand/25"
              >
                {primaryCta.label}
              </MotionButton>
              <MotionLinkButton
                href={secondaryCta.href}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-xs font-extrabold tracking-wider text-brand-dark shadow-sm hover:border-brand/30 hover:bg-slate-50"
              >
                <Phone className="size-4 text-brand" />
                {secondaryCta.label}
              </MotionLinkButton>
            </div>
          </FadeIn>

          <FadeIn direction="right" delay={0.12} className="flex flex-col gap-4">
            <StaggerGrid className="grid grid-cols-3 gap-2 sm:gap-3">
              {highlights.map((item, index) => (
                <StaggerItem key={item.label} index={index} variant="home">
                  <div className="rounded-xl border border-slate-200/80 bg-white/90 px-2 py-3 text-center shadow-sm backdrop-blur-sm sm:rounded-2xl sm:px-3 sm:py-4">
                    <p className="text-base font-black tabular-nums text-brand sm:text-lg lg:text-xl">
                      {item.value}
                    </p>
                    <p className="mt-1 text-[9px] font-bold leading-snug tracking-wide text-slate-500 uppercase sm:text-[10px]">
                      {item.label}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGrid>

            <ul className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200/60 bg-white/80">
              {features.map(({ icon: Icon, text, sub }, i) => (
                <motion.li
                  key={text}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: 0.2 + i * 0.1, ...revealTransition, type: "tween" }}
                  className="flex items-center gap-3 px-4 py-3.5 sm:px-5 sm:py-4"
                >
                  <Icon className="size-4 shrink-0 text-brand" strokeWidth={1.75} />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-brand-dark sm:text-sm">{text}</p>
                    <p className="mt-0.5 text-[11px] leading-snug text-slate-500">{sub}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
