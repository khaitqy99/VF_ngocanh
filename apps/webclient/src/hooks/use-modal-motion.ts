"use client";

import type { Target, Transition } from "framer-motion";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { DURATION, springGentle } from "@/lib/motion";

type MotionTriplet = {
  initial: Target;
  animate: Target;
  exit: Target;
  transition?: Transition;
};

export function useModalMotion() {
  const reduced = useReducedMotion();

  const overlay: MotionTriplet = reduced
    ? {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        exit: { opacity: 1 },
      }
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: DURATION.fast },
      };

  const panel: MotionTriplet = reduced
    ? {
        initial: { opacity: 1, scale: 1, y: 0 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 1, scale: 1, y: 0 },
      }
    : {
        initial: { opacity: 0, scale: 0.94, y: 12 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.96, y: 8 },
        transition: springGentle,
      };

  const step: MotionTriplet = reduced
    ? {
        initial: { opacity: 1, x: 0 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 1, x: 0 },
      }
    : {
        initial: { opacity: 0, x: 16 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -16 },
        transition: { duration: DURATION.subtle },
      };

  const drawer: MotionTriplet = reduced
    ? {
        initial: { x: 0 },
        animate: { x: 0 },
        exit: { x: 0 },
      }
    : {
        initial: { x: "100%" },
        animate: { x: 0 },
        exit: { x: "100%" },
        transition: { type: "spring", damping: 30, stiffness: 200 },
      };

  return { reduced, overlay, panel, step, drawer };
}
