"use client";

import type { UseInViewOptions } from "framer-motion";

import { useInViewReveal } from "@/hooks/use-in-view-reveal";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { revealVariantAnimate } from "@/lib/motion-safe";

/** Shared in-view state for a section — replaces fragile whileInView-only reveals. */
export function useSectionReveal<T extends Element = HTMLDivElement>(viewport?: UseInViewOptions) {
  const reduced = useReducedMotion();
  const { ref, show } = useInViewReveal<T>(viewport);

  return {
    ref,
    reduced,
    show,
    initial: reduced ? false : ("hidden" as const),
    animate: revealVariantAnimate(reduced, show),
  };
}
