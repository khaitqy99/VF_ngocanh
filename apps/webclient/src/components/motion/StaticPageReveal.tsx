"use client";

import type { ReactNode } from "react";

import { FadeIn } from "@/components/motion";

export function StaticPageReveal({ children }: { children: ReactNode }) {
  return (
    <FadeIn direction="up" className="relative max-w-md text-center">
      {children}
    </FadeIn>
  );
}
