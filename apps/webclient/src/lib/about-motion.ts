import type { Variants } from "framer-motion";

import { DURATION, EASE_OUT_EXPO, springSnappy, STAGGER_STEP } from "./motion";
import { homeViewport } from "./home-motion";

export const aboutViewport = homeViewport;

export const aboutHeroBg: Variants = {
  hidden: { scale: 1.1, opacity: 0.6 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 1.4, ease: EASE_OUT_EXPO },
  },
};

export const aboutHeroKenBurns = {
  initial: { scale: 1.08 },
  animate: { scale: 1 },
  transition: { duration: 10, ease: "linear" as const },
};

export const aboutHeroStagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.12 },
  },
};

export const aboutHeroLine: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: DURATION.normal, ease: EASE_OUT_EXPO },
  },
};

export const aboutStatStagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.35 },
  },
};

export const aboutStatItem: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: EASE_OUT_EXPO },
  },
};

export const aboutSectionEyebrow: Variants = {
  hidden: { opacity: 0, y: 12, letterSpacing: "0.2em" },
  visible: {
    opacity: 1,
    y: 0,
    letterSpacing: "0.1em",
    transition: { duration: DURATION.normal, ease: EASE_OUT_EXPO },
  },
};

export const aboutSectionHeader: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.04 },
  },
};

export const aboutMissionCard = {
  rest: { y: 0, scale: 1 },
  hover: { y: -6, scale: 1.01, transition: springSnappy },
};

export const aboutMissionIcon = {
  rest: { scale: 1, rotate: 0 },
  hover: { scale: 1.08, rotate: -4, transition: springSnappy },
};

export const aboutTimelineDot: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 320, damping: 22 },
  },
};

export const aboutTimelineCard: Variants = {
  hidden: { opacity: 0, y: 32, scale: 0.96 },
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

export const aboutTimelineLine: Variants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: 1.1, ease: EASE_OUT_EXPO, delay: 0.15 },
  },
};

export const aboutWhyImage: Variants = {
  hidden: { opacity: 0, x: -40, scale: 0.97, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: DURATION.slow, ease: EASE_OUT_EXPO },
  },
};

export const aboutWhyItem: Variants = {
  hidden: { opacity: 0, x: 28, filter: "blur(4px)" },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: {
      duration: DURATION.normal,
      ease: EASE_OUT_EXPO,
      delay: i * STAGGER_STEP,
    },
  }),
};

export const aboutBreadcrumb: Variants = {
  hidden: { opacity: 0, y: -8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: EASE_OUT_EXPO },
  },
};
