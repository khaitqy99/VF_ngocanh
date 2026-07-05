"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { subtleRevealTransition, subtleViewport } from "@/lib/motion";

export function RevealImage({
  children,
  className,
  direction = "up",
}: {
  children: ReactNode;
  className?: string;
  direction?: "up" | "scale";
}) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={
        direction === "scale"
          ? { opacity: 0, scale: 0.98, y: 12 }
          : { opacity: 0, y: 16, scale: 1.02 }
      }
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={subtleViewport}
      transition={subtleRevealTransition}
      className={`overflow-hidden ${className ?? ""}`}
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={subtleRevealTransition}
        className="h-full w-full"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
