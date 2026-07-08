"use client";

import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { MOTION_VISIBLE, safeRevealTransition } from "@/lib/motion-safe";
import { vfDisplayHero, vfHeroEyebrow } from "@/lib/typography";

export function PageEditorialHero({
  imageSrc,
  imageAlt,
  eyebrow,
  title,
  titleAccent,
  description,
  actions,
  stats,
}: {
  imageSrc: string;
  imageAlt: string;
  eyebrow: ReactNode;
  title: ReactNode;
  titleAccent?: ReactNode;
  description: ReactNode;
  actions: ReactNode;
  stats?: readonly { icon: LucideIcon; value: ReactNode; label: ReactNode }[];
}) {
  const reduced = useReducedMotion();

  return (
    <section className="page-editorial-hero">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-0"
          initial={reduced ? false : { scale: 1.08 }}
          animate={reduced ? MOTION_VISIBLE : { scale: 1 }}
          transition={safeRevealTransition(reduced, { duration: 9, ease: [0.16, 1, 0.3, 1] })}
        >
          <img src={imageSrc} alt={imageAlt} className="h-full w-full object-cover object-center" />
        </motion.div>
        <div aria-hidden className="page-editorial-hero-overlay" />
      </div>

      <div className="container-vf relative z-10 py-24 sm:py-28 lg:py-32">
        <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-14">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 28 }}
            animate={MOTION_VISIBLE}
            transition={safeRevealTransition(reduced, { duration: 0.85, ease: [0.16, 1, 0.3, 1] })}
            className="max-w-2xl"
          >
            <p className={`${vfHeroEyebrow} text-accent-yellow`}>{eyebrow}</p>
            <h1 className={`${vfDisplayHero} mt-4 text-balance text-white`}>
              {title}
              {titleAccent ? <span className="mt-1 block text-white/92">{titleAccent}</span> : null}
            </h1>
            <span
              aria-hidden
              className="mt-5 block h-1 w-14 rounded-full bg-accent-yellow shadow-[0_0_24px_rgba(255,213,0,0.45)]"
            />
            <p className="mt-5 max-w-[46ch] text-sm leading-relaxed text-white/75 sm:text-base">
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
                  <div key={index} className="home-hero-stat-chip rounded-2xl p-4">
                    <Icon size={16} className="text-accent-yellow" strokeWidth={1.75} />
                    <p className="mt-2 font-mono text-lg font-bold tabular-nums tracking-tight text-white">
                      {value}
                    </p>
                    <p className="mt-1 text-xs leading-snug text-white/60">{label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
