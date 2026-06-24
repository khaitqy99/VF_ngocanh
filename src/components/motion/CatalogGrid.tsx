"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { HTMLAttributes, ReactNode } from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { catalogGridItem, STAGGER_STEP } from "@/lib/motion";
import { cn } from "@/lib/utils";

type CatalogGridProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function CatalogGrid({ children, className, ...props }: CatalogGridProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <div className={className} {...props}>
        {children}
      </div>
    );
  }

  return (
    <div className={className} {...props}>
      <AnimatePresence mode="popLayout">{children}</AnimatePresence>
    </div>
  );
}

export function CatalogGridItem({
  children,
  className,
  index = 0,
}: {
  children: ReactNode;
  className?: string;
  index?: number;
}) {
  const reduced = useReducedMotion();
  const staggerDelay = (index % 6) * STAGGER_STEP;

  if (reduced) {
    return <div className={cn("h-full", className)}>{children}</div>;
  }

  return (
    <motion.div
      layout
      variants={catalogGridItem}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ delay: staggerDelay }}
      className={cn("h-full origin-top", className)}
    >
      {children}
    </motion.div>
  );
}
