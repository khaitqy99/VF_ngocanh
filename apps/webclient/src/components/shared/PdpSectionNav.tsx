"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { useMountReveal } from "@/hooks/use-scroll-reveal";

export type PdpNavItem = { id: string; label: string };

export function PdpSectionNav({ items }: { items: PdpNavItem[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");
  const mount = useMountReveal(0.05);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    for (const item of items) {
      const el = document.getElementById(item.id);
      if (!el) continue;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(item.id);
        },
        { rootMargin: "-30% 0px -55% 0px", threshold: 0 },
      );
      obs.observe(el);
      observers.push(obs);
    }
    return () => observers.forEach((o) => o.disconnect());
  }, [items]);

  return (
    <motion.nav
      aria-label="Mục nội dung sản phẩm"
      initial={mount.initial}
      animate={mount.animate}
      transition={mount.transition}
      className="sticky top-14 z-30 border-b border-border/40 bg-white/90 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80"
    >
      <div className="container-vf py-2.5 sm:py-3">
        <div className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <ul className="flex min-w-max items-center gap-1.5 sm:gap-2">
            {items.map((item) => {
              const isActive = active === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
                      setActive(item.id);
                    }}
                    className={`inline-flex items-center rounded-full px-4 py-2 text-[11px] font-bold tracking-wide transition sm:px-5 sm:text-xs ${
                      isActive
                        ? "bg-brand text-white shadow-md shadow-brand/25"
                        : "bg-surface text-muted-foreground hover:bg-brand/5 hover:text-brand-dark"
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </motion.nav>
  );
}
