"use client";

import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { MOTION_VISIBLE, safeRevealTransition } from "@/lib/motion-safe";
import { vfDisplayHero, vfHeroEyebrow } from "@/lib/typography";

export function PageEditorialHero({
  imageSrc,
  imageAlt,
  imagePosition = "center",
  bannerControls,
  eyebrow,
  title,
  titleAccent,
  description,
  actions,
  stats,
  separateContentSection = false,
}: {
  imageSrc: string;
  imageAlt: string;
  imagePosition?: "center" | "top" | "bottom" | "left" | "right";
  bannerControls?: ReactNode;
  eyebrow: ReactNode;
  title: ReactNode;
  titleAccent?: ReactNode;
  description: ReactNode;
  actions: ReactNode;
  stats?: readonly { icon: LucideIcon; value: ReactNode; label: ReactNode }[];
  separateContentSection?: boolean;
}) {
  const reduced = useReducedMotion();
  const hasStats = Boolean(stats?.length);
  const imagePositionClass =
    imagePosition === "top"
      ? "object-top"
      : imagePosition === "bottom"
        ? "object-bottom"
        : imagePosition === "left"
          ? "object-left"
          : imagePosition === "right"
            ? "object-right"
            : "object-center";
  const sectionShellClassName = separateContentSection
    ? "relative overflow-hidden border-b border-border/60 home-feature-surface py-10 sm:py-12 lg:py-14 z-20 -mt-8 sm:-mt-10 lg:-mt-12"
    : "container-vf relative z-10 flex min-h-[68vh] items-end py-16 sm:min-h-[70vh] sm:py-20 lg:min-h-[72vh] lg:py-24";
  const textToneClassName = separateContentSection ? "text-brand-dark" : "text-white";
  const subtitleToneClassName = separateContentSection ? "text-brand" : "text-white/92";
  const descriptionToneClassName = separateContentSection
    ? "text-muted-foreground"
    : "text-white/75";
  const statValueToneClassName = separateContentSection ? "text-brand-dark" : "text-white";
  const statLabelToneClassName = separateContentSection ? "text-muted-foreground" : "text-white/60";
  const statsSurfaceClassName = separateContentSection
    ? "home-stat-chip-light"
    : "home-hero-stat-chip";

  return (
    <>
      <section className="page-editorial-hero">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute inset-0"
            initial={reduced ? false : { scale: 1.08 }}
            animate={reduced ? MOTION_VISIBLE : { scale: 1 }}
            transition={safeRevealTransition(reduced, { duration: 9, ease: [0.16, 1, 0.3, 1] })}
          >
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              priority
              sizes="100vw"
              className={`object-cover ${imagePositionClass}`}
            />
          </motion.div>
          <div aria-hidden className="page-editorial-hero-overlay" />
          {bannerControls ? (
            <div className="absolute top-4 right-4 z-20">{bannerControls}</div>
          ) : null}
        </div>

        {separateContentSection ? (
          <div className="container-vf relative z-10 flex min-h-[56vh] items-end py-12 sm:min-h-[58vh] sm:py-14 lg:min-h-[60vh] lg:py-16" />
        ) : (
          <div className={sectionShellClassName}>
            <div
              className={
                hasStats
                  ? "grid items-end gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-14"
                  : "max-w-2xl"
              }
            >
              <motion.div
                initial={reduced ? false : { opacity: 0, y: 28 }}
                animate={MOTION_VISIBLE}
                transition={safeRevealTransition(reduced, {
                  duration: 0.85,
                  ease: [0.16, 1, 0.3, 1],
                })}
                className="max-w-2xl"
              >
                <p className={`${vfHeroEyebrow} text-accent-yellow`}>{eyebrow}</p>
                <h1 className={`${vfDisplayHero} mt-4 text-balance ${textToneClassName}`}>
                  {title}
                  {titleAccent ? (
                    <span className={`mt-1 block ${subtitleToneClassName}`}>{titleAccent}</span>
                  ) : null}
                </h1>
                <span
                  aria-hidden
                  className="mt-5 block h-1 w-14 rounded-full bg-accent-yellow shadow-[0_0_24px_rgba(255,213,0,0.45)]"
                />
                <p
                  className={`mt-5 max-w-[46ch] text-sm leading-relaxed sm:text-base ${descriptionToneClassName}`}
                >
                  {description}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">{actions}</div>
              </motion.div>

              {stats?.length ? (
                <motion.div
                  initial={reduced ? false : { opacity: 0, y: 20 }}
                  animate={MOTION_VISIBLE}
                  transition={safeRevealTransition(reduced, {
                    duration: 0.75,
                    delay: reduced ? 0 : 0.15,
                    ease: [0.16, 1, 0.3, 1],
                  })}
                  className="w-full lg:ml-auto lg:max-w-md"
                >
                  <div className="home-hero-stat-grid">
                    {stats.map(({ icon: Icon, value, label }, index) => (
                      <div key={index} className={`${statsSurfaceClassName} rounded-2xl p-4`}>
                        <Icon size={16} className="text-accent-yellow" strokeWidth={1.75} />
                        <p
                          className={`mt-2 font-mono text-lg font-bold tabular-nums tracking-tight ${statValueToneClassName}`}
                        >
                          {value}
                        </p>
                        <p className={`mt-1 text-xs leading-snug ${statLabelToneClassName}`}>
                          {label}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : null}
            </div>
          </div>
        )}
      </section>
      {separateContentSection ? (
        <section className={sectionShellClassName}>
          <div className="container-vf relative">
            <div className="page-showcase-shell rounded-[1.75rem] p-6 sm:p-8 lg:p-10">
              <div
                className={
                  hasStats
                    ? "grid items-end gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-14"
                    : "max-w-2xl"
                }
              >
                <motion.div
                  initial={reduced ? false : { opacity: 0, y: 28 }}
                  animate={MOTION_VISIBLE}
                  transition={safeRevealTransition(reduced, {
                    duration: 0.85,
                    ease: [0.16, 1, 0.3, 1],
                  })}
                  className="max-w-2xl"
                >
                  <p className={`${vfHeroEyebrow} text-brand`}>{eyebrow}</p>
                  <h1 className={`${vfDisplayHero} mt-4 text-balance text-brand-dark`}>
                    {title}
                    {titleAccent ? (
                      <span className="mt-1 block text-brand">{titleAccent}</span>
                    ) : null}
                  </h1>
                  <span
                    aria-hidden
                    className="mt-5 block h-1 w-14 rounded-full bg-accent-yellow shadow-[0_0_20px_rgba(255,213,0,0.35)]"
                  />
                  <div className="mt-8 flex flex-wrap gap-3">{actions}</div>
                </motion.div>

                {stats?.length ? (
                  <motion.div
                    initial={reduced ? false : { opacity: 0, y: 20 }}
                    animate={MOTION_VISIBLE}
                    transition={safeRevealTransition(reduced, {
                      duration: 0.75,
                      delay: reduced ? 0 : 0.15,
                      ease: [0.16, 1, 0.3, 1],
                    })}
                    className="w-full lg:ml-auto lg:max-w-md"
                  >
                    <p className="mb-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
                      {description}
                    </p>
                    <div className="home-hero-stat-grid">
                      {stats.map(({ icon: Icon, value, label }, index) => (
                        <div key={index} className="home-stat-chip-light rounded-2xl p-4">
                          <div className="flex items-center gap-2.5">
                            <Icon size={16} className="text-accent-yellow" strokeWidth={1.75} />
                            <p className="font-mono text-lg font-bold tabular-nums tracking-tight text-brand-dark">
                              {value}
                            </p>
                          </div>
                          <p className="mt-1 text-xs leading-snug text-muted-foreground">{label}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <p className="mt-5 max-w-[46ch] text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
