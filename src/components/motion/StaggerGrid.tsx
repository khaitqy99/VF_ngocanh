"use client";

import { motion } from "framer-motion";
import type { HTMLAttributes, ReactNode } from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import {
  catalogItemViewport,
  catalogStaggerItem,
  reducedVariants,
  STAGGER_STEP,
} from "@/lib/motion";
import { cn } from "@/lib/utils";

type StaggerGridProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

/** Layout wrapper — animation xử lý riêng từng StaggerItem */
export function StaggerGrid({ children, className, ...props }: StaggerGridProps) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}

export function StaggerItem({
  children,
  className,
  index = 0,
}: {
  children: ReactNode;
  className?: string;
  /** Dùng cho stagger nhẹ trong cùng một hàng (0–5) */
  index?: number;
}) {
  const reduced = useReducedMotion();
  const staggerDelay = (index % 6) * STAGGER_STEP;

  if (reduced) {
    return <div className={cn("h-full", className)}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={catalogItemViewport}
      variants={catalogStaggerItem}
      transition={{ delay: staggerDelay }}
      className={cn("h-full", className)}
    >
      {children}
    </motion.div>
  );
}
