"use client";

import { Phone, type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useInViewReveal } from "@/hooks/use-in-view-reveal";
import { revealAnimate, revealInitial, safeRevealTransition } from "@/lib/motion-safe";
import { subtleRevealTransition } from "@/lib/motion";
import { vfDisplayHero, vfHeroEyebrow } from "@/lib/typography";
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
  overlap = false,
}: {
  title: string;
  titleAccent: string;
  description: string;
  primaryCta: { label: string; onClick: () => void };
  secondaryCta: { label: string; href: string };
  highlights: CatalogHeroHighlight[];
  features: CatalogHeroFeature[];
  /** Kéo section lên chồng banner — giống trang chủ */
  overlap?: boolean;
}) {
  const reduced = useReducedMotion();
  const { ref: featuresRef, show: featuresVisible } = useInViewReveal<HTMLUListElement>({
    once: true,
    margin: "-40px",
  });

  return (
    <section
      className={`relative overflow-hidden border-b border-border/60 home-feature-surface py-10 sm:py-12 lg:py-14 ${
        overlap ? "z-20 -mt-8 sm:-mt-10 lg:-mt-12" : ""
      }`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-0 size-72 rounded-full bg-brand/5 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 left-0 size-96 rounded-full bg-brand/[0.04] blur-3xl"
      />

      <div className="container-vf relative">
        <div className="page-showcase-shell rounded-[1.75rem] p-6 sm:p-8 lg:p-10">
          <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-10 xl:gap-14">
            <FadeIn direction="left" blur className="text-center lg:text-left">
              <p className={`${vfHeroEyebrow} ${overlap ? "text-brand" : ""}`}>
                VinFast · VinFast Ngọc Anh Cà Mau
              </p>
              <h1 className={`${vfDisplayHero} mt-3 text-balance text-brand-dark`}>
                {title}
                <span className="mt-1 block text-brand">{titleAccent}</span>
              </h1>
              <span
                aria-hidden
                className="mx-auto mt-5 block h-1 w-14 rounded-full bg-accent-yellow shadow-[0_0_20px_rgba(255,213,0,0.35)] lg:mx-0"
              />

              <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground lg:mx-0 lg:text-base">
                {description}
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                <MotionButton
                  type="button"
                  onClick={primaryCta.onClick}
                  className="home-cta-primary inline-flex items-center gap-1.5 rounded-full px-7 py-3.5 text-sm font-semibold text-white shadow-[var(--shadow-brand)]"
                >
                  {primaryCta.label}
                </MotionButton>
                <MotionLinkButton
                  href={secondaryCta.href}
                  className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-white px-7 py-3.5 text-sm font-semibold text-brand-dark shadow-sm transition hover:border-brand/30 hover:bg-surface-muted"
                >
                  <Phone className="size-4 text-brand" />
                  {secondaryCta.label}
                </MotionLinkButton>
              </div>
            </FadeIn>

            <FadeIn direction="right" delay={0.12} className="flex flex-col gap-4">
              <StaggerGrid className="home-hero-stat-grid">
                {highlights.map((item, index) => (
                  <StaggerItem key={item.label} index={index} variant="home">
                    <div className="home-stat-chip-light rounded-2xl p-4 text-center">
                      <p className="font-mono text-lg font-bold tabular-nums tracking-tight text-brand-dark sm:text-xl">
                        {item.value}
                      </p>
                      <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
                        {item.label}
                      </p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerGrid>

              <ul
                ref={featuresRef}
                className="divide-y divide-border/60 overflow-hidden rounded-2xl border border-border/60 bg-white/90 backdrop-blur-sm"
              >
                {features.map(({ icon: Icon, text, sub }, i) => (
                  <motion.li
                    key={text}
                    initial={revealInitial(reduced, { opacity: 0, x: 16 })}
                    animate={revealAnimate(reduced, featuresVisible, { opacity: 0, x: 16 })}
                    transition={safeRevealTransition(reduced, {
                      delay: 0.12 + i * 0.06,
                      ...subtleRevealTransition,
                    })}
                    className="flex items-center gap-3 px-4 py-3.5 sm:px-5 sm:py-4"
                  >
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-brand/15 bg-brand/5 text-brand">
                      <Icon className="size-4" strokeWidth={1.75} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-brand-dark">{text}</p>
                      <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{sub}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
