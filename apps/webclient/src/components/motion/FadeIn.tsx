"use client";

import { motion, type HTMLMotionProps, type Variants } from "framer-motion";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import {
  defaultTransition,
  fadeLeft,
  fadeRight,
  fadeUpSubtle,
  fadeUpBlur,
  reducedVariants,
  subtleRevealTransition,
  springGentle,
  subtleViewport,
} from "@/lib/motion";

type FadeInProps = HTMLMotionProps<"div"> & {
  delay?: number;
  direction?: "up" | "left" | "right" | "scale" | "none";
  blur?: boolean;
};

const directionVariants: Record<NonNullable<FadeInProps["direction"]>, Variants> = {
  up: fadeUpSubtle,
  left: fadeLeft,
  right: fadeRight,
  scale: fadeUpSubtle,
  none: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
};

export function FadeIn({
  children,
  delay = 0,
  direction = "up",
  blur = false,
  className,
  ...props
}: FadeInProps) {
  const reduced = useReducedMotion();
  const variants = reduced ? reducedVariants : blur ? fadeUpBlur : directionVariants[direction];

  const transition =
    reduced || direction === "none"
      ? { ...defaultTransition, delay }
      : direction === "scale"
        ? { ...springGentle, delay }
        : { ...subtleRevealTransition, delay };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={subtleViewport}
      variants={variants}
      transition={transition}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
