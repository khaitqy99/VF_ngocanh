import type { Transition, Variants } from "framer-motion";

export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

export const DURATION = {
  fast: 0.32,
  normal: 0.85,
  slow: 1.1,
  hero: 1.2,
} as const;

export const STAGGER_STEP = 0.07;

export const springGentle = { type: "spring", stiffness: 180, damping: 32, mass: 1.1 } as const;
export const springSnappy = { type: "spring", stiffness: 280, damping: 36, mass: 1 } as const;
export const springSoft = { type: "spring", stiffness: 140, damping: 28, mass: 1.15 } as const;
export const springBounce = { type: "spring", stiffness: 220, damping: 28, mass: 1.1 } as const;

export const viewport = {
  once: true,
  amount: 0.15,
  margin: "0px 0px -48px 0px",
} as const;

/** Mỗi card trong catalog tự animate khi riêng nó vào viewport */
export const catalogItemViewport = {
  once: true,
  amount: 0.12,
  margin: "0px 0px -32px 0px",
} as const;

export const defaultTransition: Transition = {
  duration: DURATION.normal,
  ease: EASE_OUT_EXPO,
};

export const revealTransition: Transition = {
  duration: DURATION.slow,
  ease: EASE_OUT_EXPO,
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ...revealTransition, type: "tween" },
  },
};

export const fadeUpBlur: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: DURATION.slow, ease: EASE_OUT_EXPO },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DURATION.normal } },
};

export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -36 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { ...revealTransition, type: "tween" },
  },
};

export const fadeRight: Variants = {
  hidden: { opacity: 0, x: 36 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { ...revealTransition, type: "tween" },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: springGentle,
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.normal, ease: EASE_OUT_EXPO },
  },
};

/** Catalog / product card — chỉ fade opacity, tránh nhòe chữ do transform */
export const catalogStaggerItem: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DURATION.normal, ease: EASE_OUT_EXPO },
  },
};

/** Lưới catalog — cascade khi mount, morph khi đổi sort/filter */
export const catalogGridItem: Variants = {
  hidden: { opacity: 0, y: 32, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: DURATION.slow, ease: EASE_OUT_EXPO, type: "tween" },
  },
  exit: {
    opacity: 0,
    scale: 0.94,
    y: -12,
    transition: { duration: DURATION.fast, ease: EASE_IN_OUT },
  },
};

export const staggerItemFade: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.normal, ease: EASE_OUT_EXPO },
  },
};

export const reducedVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.15 } },
};

export const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.94, y: 12 },
  visible: { opacity: 1, scale: 1, y: 0, transition: springGentle },
  exit: { opacity: 0, scale: 0.96, y: 8, transition: { duration: DURATION.fast } },
};

export const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DURATION.fast } },
  exit: { opacity: 0, transition: { duration: DURATION.fast } },
};

export const heroSlideVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    scale: 1.06,
    x: direction > 0 ? 48 : -48,
  }),
  center: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: {
      opacity: { duration: DURATION.hero, ease: EASE_OUT_EXPO },
      scale: { duration: 6, ease: "linear" },
      x: { ...springGentle },
    },
  },
  exit: (direction: number) => ({
    opacity: 0,
    scale: 1.02,
    x: direction > 0 ? -48 : 48,
    transition: { duration: DURATION.normal, ease: EASE_IN_OUT },
  }),
};

export const carouselContentVariants: Variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 32 : -32, filter: "blur(4px)" }),
  center: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: DURATION.normal, ease: EASE_OUT_EXPO },
  },
  exit: (dir: number) => ({
    opacity: 0,
    x: dir > 0 ? -24 : 24,
    filter: "blur(4px)",
    transition: { duration: DURATION.fast, ease: EASE_IN_OUT },
  }),
};

export const floatEntrance: Variants = {
  hidden: { opacity: 0, x: 20, scale: 0.85 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { ...springBounce, delay: 0.25 + i * 0.12 },
  }),
};

export const cardHover = {
  boxShadow: "0 20px 40px -12px rgba(20, 100, 244, 0.18), 0 8px 16px -8px rgba(15, 23, 42, 0.08)",
  transition: springSnappy,
};

export const cardTap = { opacity: 0.92, transition: { duration: 0.15 } };

export const imageHover = {
  scale: 1.06,
  transition: { duration: 0.75, ease: EASE_OUT_EXPO },
};

export const buttonHover = {
  y: -2,
  scale: 1.02,
  transition: springSnappy,
};

export const buttonTap = { scale: 0.97, y: 0 };
