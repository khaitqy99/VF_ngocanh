"use client";

import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { homeViewport } from "@/lib/home-motion";

export function PageStatsBar({
  items,
  columns = 4,
}: {
  items: readonly { value: string; label: string; icon?: LucideIcon }[];
  columns?: 2 | 3 | 4;
}) {
  const reduced = useReducedMotion();
  const colClass =
    columns === 2
      ? "grid-cols-2"
      : columns === 3
        ? "grid-cols-2 lg:grid-cols-3"
        : "grid-cols-2 lg:grid-cols-4";

  return (
    <section
      aria-label="Thống kê nhanh"
      className="relative z-20 -mt-6 border-y border-white/10 bg-brand-dark sm:-mt-8"
    >
      <div className="container-vf">
        <motion.ul
          initial={reduced ? false : { opacity: 0, y: 16 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={homeViewport}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className={`grid divide-x divide-white/10 ${colClass}`}
        >
          {items.map(({ icon: Icon, value, label }) => (
            <li key={label} className="min-w-0 px-3 py-5 sm:px-5 sm:py-6 lg:px-6">
              <div className="flex h-full flex-col gap-2">
                {Icon ? <Icon size={18} strokeWidth={1.75} className="text-accent-yellow" /> : null}
                <p className="font-mono text-lg font-bold tabular-nums tracking-tight text-white sm:text-xl">
                  {value}
                </p>
                <p className="line-clamp-2 text-[11px] leading-snug text-white/55">{label}</p>
              </div>
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
