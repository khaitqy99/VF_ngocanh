import type { Transition, Variants } from "framer-motion";

import {
  DURATION,
  EASE_IN_OUT,
  EASE_OUT_EXPO,
  springGentle,
  springSnappy,
  STAGGER_STEP,
} from "./motion";

export const homeViewport = {
  once: true,
  amount: 0.12,
  margin: "0px 0px -24px 0px",
} as const;

export const homeHeroDot = {
  inactive: { width: 6, opacity: 0.45 },
  active: { width: 24, opacity: 1 },
};

export const homeHeroDotTransition: Transition = {
  type: "spring",
  stiffness: 380,
  damping: 32,
};

export const homeHeroSlide = {
  enter: (dir: number) => ({
    opacity: 0,
    scale: 1.07,
    x: dir > 0 ? "6%" : "-6%",
  }),
  center: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: {
      opacity: { duration: DURATION.hero, ease: EASE_OUT_EXPO },
      x: { duration: DURATION.hero, ease: EASE_OUT_EXPO },
      scale: { duration: 9, ease: "linear" as const },
    },
  },
  exit: (dir: number) => ({
    opacity: 0,
    scale: 1.02,
    x: dir > 0 ? "-5%" : "5%",
    transition: { duration: DURATION.normal, ease: EASE_IN_OUT },
  }),
};

export const homeSectionTitle: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.subtle, ease: EASE_OUT_EXPO },
  },
};

export const homeSectionRule: Variants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: DURATION.normal, ease: EASE_OUT_EXPO, delay: 0.12 },
  },
};

export const homeCarouselImage = {
  enter: (dir: number) => ({
    opacity: 0,
    scale: 1.06,
    x: dir > 0 ? "7%" : "-7%",
  }),
  center: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: {
      opacity: { duration: DURATION.hero, ease: EASE_OUT_EXPO },
      x: { duration: DURATION.hero, ease: EASE_OUT_EXPO },
      scale: { duration: 7.5, ease: "linear" as const },
    },
  },
  exit: (dir: number) => ({
    opacity: 0,
    scale: 1.02,
    x: dir > 0 ? "-5%" : "5%",
    transition: { duration: DURATION.normal, ease: EASE_IN_OUT },
  }),
};

export const homeCarouselText = {
  enter: (dir: number) => ({
    opacity: 0,
    y: 32,
    x: dir > 0 ? 28 : -28,
    filter: "blur(8px)",
  }),
  center: {
    opacity: 1,
    y: 0,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: DURATION.normal, ease: EASE_OUT_EXPO, delay: 0.06 },
  },
  exit: (dir: number) => ({
    opacity: 0,
    y: -18,
    x: dir > 0 ? -18 : 18,
    filter: "blur(6px)",
    transition: { duration: DURATION.fast, ease: EASE_IN_OUT },
  }),
};

export const homeSpecStagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.055, delayChildren: 0.14 },
  },
};

export const homeSpecItem: Variants = {
  hidden: { opacity: 0, y: 14, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.48, ease: EASE_OUT_EXPO },
  },
};

export const homeCardReveal: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: DURATION.subtle,
      ease: EASE_OUT_EXPO,
      delay: i * STAGGER_STEP,
    },
  }),
};

export const homeBrandClip: Variants = {
  hidden: { opacity: 0, clipPath: "inset(8% 8% 8% 8% round 12px)", scale: 1.03 },
  visible: {
    opacity: 1,
    clipPath: "inset(0% 0% 0% 0% round 12px)",
    scale: 1,
    transition: { duration: DURATION.slow, ease: EASE_OUT_EXPO },
  },
};

export const homeBrandLine: Variants = {
  hidden: { opacity: 0, x: 40, filter: "blur(6px)" },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: DURATION.normal, ease: EASE_OUT_EXPO, delay: 0.22 + i * 0.09 },
  }),
};

export const homeNewsletterBlock: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.98, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: DURATION.slow,
      ease: EASE_OUT_EXPO,
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const homeNewsletterChild: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.normal, ease: EASE_OUT_EXPO },
  },
};

export const homeOverlayCard = {
  rest: { y: 0, scale: 1 },
  hover: { y: -6, scale: 1.008, transition: springSnappy },
  tap: { scale: 0.995, transition: springGentle },
};

export const homeImageZoom = {
  rest: { scale: 1 },
  hover: { scale: 1.06, transition: { duration: 0.75, ease: EASE_OUT_EXPO } },
};

export const homeNavBtn = {
  rest: { scale: 1, opacity: 0.92 },
  hover: { scale: 1.06, opacity: 1, transition: springSnappy },
  tap: { scale: 0.94 },
};
