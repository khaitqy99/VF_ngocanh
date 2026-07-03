"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { revealTransition, viewport } from "@/lib/motion";

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
          ? { opacity: 0, scale: 0.92, y: 20 }
          : { opacity: 0, y: 32, scale: 1.04 }
      }
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={viewport}
      transition={revealTransition}
      className={`overflow-hidden ${className ?? ""}`}
    >
      <motion.div
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        className="h-full w-full"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
