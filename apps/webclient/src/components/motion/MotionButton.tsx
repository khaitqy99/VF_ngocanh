"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { buttonHover, buttonTap } from "@/lib/motion";

type MotionButtonProps = HTMLMotionProps<"button"> & {
  children: ReactNode;
};

export function MotionButton({ children, className, ...props }: MotionButtonProps) {
  const reduced = useReducedMotion();

  return (
    <motion.button
      whileHover={reduced ? undefined : buttonHover}
      whileTap={reduced ? undefined : buttonTap}
      className={className}
      {...props}
    >
      {children}
    </motion.button>
  );
}

type MotionLinkButtonProps = HTMLMotionProps<"a"> & {
  children: ReactNode;
};

export function MotionLinkButton({ children, className, ...props }: MotionLinkButtonProps) {
  const reduced = useReducedMotion();

  return (
    <motion.a
      whileHover={reduced ? undefined : buttonHover}
      whileTap={reduced ? undefined : buttonTap}
      className={className}
      {...props}
    >
      {children}
    </motion.a>
  );
}
