"use client";

import { useEffect, useState } from "react";
import { cn } from "@/components/ui/core";

export type EditNavItem = { id: string; label: string };

export function EditSectionNav({
  items,
  variant = "fixed",
}: {
  items: EditNavItem[];
  variant?: "fixed" | "panel";
}) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    for (const item of items) {
      const el = document.getElementById(`edit-${item.id}`);
      if (!el) continue;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(item.id);
        },
        { rootMargin: "-20% 0px -55% 0px", threshold: 0 },
      );
      obs.observe(el);
      observers.push(obs);
    }
    return () => observers.forEach((o) => o.disconnect());
  }, [items]);

  return (
    <nav
      className={cn(
        "z-30 border-b border-zinc-200 bg-white/95 shadow-sm backdrop-blur",
        variant === "fixed"
          ? "fixed top-16 left-0 right-0 px-4 md:left-64 md:px-8"
          : "sticky top-0 px-0",
      )}
    >
      <div className="overflow-x-auto py-2.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <ul className="flex min-w-max items-center gap-1.5">
          {items.map((item) => {
            const isActive = active === item.id;
            return (
              <li key={item.id}>
                <a
                  href={`#edit-${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(`edit-${item.id}`)?.scrollIntoView({ behavior: "smooth" });
                    setActive(item.id);
                  }}
                  className={cn(
                    "inline-flex rounded-full px-3.5 py-1.5 text-xs font-semibold transition",
                    isActive
                      ? "bg-red-600 text-white shadow-sm"
                      : "bg-zinc-100 text-zinc-600 hover:bg-red-50 hover:text-red-700",
                  )}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
