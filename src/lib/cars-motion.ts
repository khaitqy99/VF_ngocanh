import type { Variants } from "framer-motion";

import { aboutBreadcrumb } from "./about-motion";
import { homeViewport } from "./home-motion";
import { DURATION, EASE_IN_OUT, EASE_OUT_EXPO, springSnappy, STAGGER_STEP } from "./motion";

export const carsViewport = homeViewport;
export const carsBreadcrumb = aboutBreadcrumb;

export const carsSearchBar: Variants = {
  hidden: { opacity: 0, y: -12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASE_OUT_EXPO },
  },
};

export const carsFilterReveal: Variants = {
  hidden: { opacity: 0, x: -24, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: DURATION.normal, ease: EASE_OUT_EXPO },
  },
};

export const carsListHeader: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.normal, ease: EASE_OUT_EXPO },
  },
};

export const carsEmptyState: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: DURATION.normal, ease: EASE_OUT_EXPO },
  },
};

export const carsEstimatorBlock: Variants = {
  hidden: { opacity: 0, y: 36, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: DURATION.slow, ease: EASE_OUT_EXPO },
  },
};

export const carsEstimatorPanel = {
  enter: (tab: string) => ({
    opacity: 0,
    x: tab === "rolling" ? -20 : 20,
    filter: "blur(4px)",
  }),
  center: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: DURATION.normal, ease: EASE_OUT_EXPO },
  },
  exit: (tab: string) => ({
    opacity: 0,
    x: tab === "rolling" ? 16 : -16,
    filter: "blur(4px)",
    transition: { duration: DURATION.fast, ease: EASE_IN_OUT },
  }),
};

export const carsTotalReveal: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 260, damping: 28 },
  },
};

export const carsPromoCard = {
  rest: { y: 0, scale: 1 },
  hover: { y: -5, scale: 1.008, transition: springSnappy },
};

export const carsPromoImage = {
  rest: { scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.7, ease: EASE_OUT_EXPO } },
};

export const carsWhyCard: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: DURATION.normal,
      ease: EASE_OUT_EXPO,
      delay: i * STAGGER_STEP,
    },
  }),
};

export const carsWhyIcon = {
  rest: { scale: 1, rotate: 0 },
  hover: { scale: 1.1, rotate: -6, transition: springSnappy },
};

export const carsBookingStep = {
  enter: (dir: number) => ({
    opacity: 0,
    x: dir > 0 ? 24 : -24,
    filter: "blur(4px)",
  }),
  center: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: DURATION.normal, ease: EASE_OUT_EXPO },
  },
  exit: (dir: number) => ({
    opacity: 0,
    x: dir > 0 ? -20 : 20,
    filter: "blur(4px)",
    transition: { duration: DURATION.fast, ease: EASE_IN_OUT },
  }),
};
