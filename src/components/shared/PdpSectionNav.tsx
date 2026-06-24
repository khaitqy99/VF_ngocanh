"use client";

import { useEffect, useState } from "react";

export type PdpNavItem = { id: string; label: string };

export function PdpSectionNav({ items }: { items: PdpNavItem[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    for (const item of items) {
      const el = document.getElementById(item.id);
      if (!el) continue;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(item.id);
        },
        { rootMargin: "-28% 0px -58% 0px", threshold: 0 },
      );
      obs.observe(el);
      observers.push(obs);
    }
    return () => observers.forEach((o) => o.disconnect());
  }, [items]);

  return (
    <nav
      aria-label="Mục nội dung sản phẩm"
      className="sticky top-14 z-30 border-b border-slate-200/90 bg-white/95 shadow-[0_1px_0_rgba(0,0,0,0.04)] backdrop-blur-md supports-[backdrop-filter]:bg-white/85"
    >
      <div className="container-vf overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <ul className="flex min-w-max gap-0">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
                  setActive(item.id);
                }}
                className={`relative block whitespace-nowrap px-4 py-3.5 text-xs font-semibold tracking-wide transition sm:px-5 sm:text-[13px] ${
                  active === item.id ? "text-brand" : "text-slate-500 hover:text-brand-dark"
                }`}
              >
                {item.label}
                {active === item.id && (
                  <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-brand sm:inset-x-4" />
                )}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
