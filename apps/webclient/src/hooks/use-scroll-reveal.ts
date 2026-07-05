"use client";

import type { Variants } from "framer-motion";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import {
  fadeUpSubtle,
  reducedVariants,
  subtleRevealTransition,
  subtleViewport,
} from "@/lib/motion";

export function useScrollReveal(customVariants?: Variants) {
  const reduced = useReducedMotion();

  return {
    reduced,
    initial: reduced ? false : ("hidden" as const),
    whileInView: reduced ? undefined : ("visible" as const),
    viewport: subtleViewport,
    variants: reduced ? undefined : (customVariants ?? fadeUpSubtle),
    transition: reduced ? undefined : subtleRevealTransition,
  };
}

export function useMountReveal(delay = 0) {
  const reduced = useReducedMotion();

  return {
    reduced,
    initial: reduced ? false : { opacity: 0, y: -16 },
    animate: reduced ? undefined : { opacity: 1, y: 0 },
    transition: reduced ? undefined : { ...subtleRevealTransition, delay },
  };
}
