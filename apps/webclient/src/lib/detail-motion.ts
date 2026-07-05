import type { Variants } from "framer-motion";

import { carsBreadcrumb, carsViewport } from "./cars-motion";
import { DURATION, EASE_IN_OUT, EASE_OUT_EXPO, springSnappy, STAGGER_STEP } from "./motion";

export const detailViewport = carsViewport;
export const detailBreadcrumb = carsBreadcrumb;

export const detailHeroStagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.08 },
  },
};

export const detailHeroCol: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: DURATION.normal, ease: EASE_OUT_EXPO },
  },
};

export const detailGalleryImage = {
  enter: { opacity: 0, scale: 0.96 },
  center: {
    opacity: 1,
    scale: 1,
    transition: { duration: DURATION.normal, ease: EASE_OUT_EXPO },
  },
  exit: {
    opacity: 0,
    scale: 1.02,
    transition: { duration: DURATION.fast, ease: EASE_IN_OUT },
  },
};

export const detailSectionReveal: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.subtle, ease: EASE_OUT_EXPO, type: "tween" },
  },
};

export const detailServiceItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.normal, ease: EASE_OUT_EXPO, delay: i * STAGGER_STEP },
  }),
};

export const detailRelatedCard: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: DURATION.normal, ease: EASE_OUT_EXPO, delay: i * STAGGER_STEP },
  }),
};

export const detailPricePulse: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 280, damping: 26 },
  },
};

export const detailThumbDot = {
  inactive: { scale: 1, opacity: 0.7 },
  active: { scale: 1.05, opacity: 1, transition: springSnappy },
};
