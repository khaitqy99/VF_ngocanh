"use client";

import type { Variants } from "framer-motion";

import { useInViewReveal } from "@/hooks/use-in-view-reveal";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import {
  MOTION_INSTANT,
  MOTION_VISIBLE,
  revealAnimate,
  revealInitial,
  revealVariantAnimate,
  safeRevealTransition,
} from "@/lib/motion-safe";
import { fadeUpSubtle, subtleRevealTransition, subtleViewport } from "@/lib/motion";

export function useScrollReveal(customVariants?: Variants) {
  const reduced = useReducedMotion();
  const { ref, show } = useInViewReveal(subtleViewport);
  const variants = customVariants ?? fadeUpSubtle;

  return {
    ref,
    initial: revealInitial(reduced, "hidden"),
    animate: revealVariantAnimate(reduced, show),
    variants: reduced ? { hidden: { opacity: 0, y: 16 }, visible: MOTION_VISIBLE } : variants,
    transition: safeRevealTransition(reduced, subtleRevealTransition),
  };
}

export function useMountReveal(delay = 0) {
  const reduced = useReducedMotion();

  return {
    initial: revealInitial(reduced, { opacity: 0, y: -16 }),
    animate: MOTION_VISIBLE,
    transition: reduced ? MOTION_INSTANT : { ...subtleRevealTransition, delay },
  };
}
