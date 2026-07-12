"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { HTMLAttributes, ReactNode } from "react";

import { useInViewReveal } from "@/hooks/use-in-view-reveal";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { catalogGridItem, catalogItemViewport, STAGGER_STEP } from "@/lib/motion";
import { revealVariantAnimate, safeRevealTransition } from "@/lib/motion-safe";
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
  inView = false,
}: {
  children: ReactNode;
  className?: string;
  index?: number;
  /** Animate khi scroll vào viewport (trang chủ) thay vì mount ngay */
  inView?: boolean;
}) {
  const reduced = useReducedMotion();
  const staggerDelay = (index % 6) * STAGGER_STEP;
  const { ref, show } = useInViewReveal(catalogItemViewport);

  if (reduced) {
    return <div className={cn("h-full", className)}>{children}</div>;
  }

  return (
    <motion.div
      ref={inView ? ref : undefined}
      layout={!inView}
      variants={catalogGridItem}
      initial="hidden"
      animate={inView ? revealVariantAnimate(reduced, show) : "visible"}
      exit="exit"
      transition={safeRevealTransition(reduced, { delay: staggerDelay })}
      className={cn("h-full origin-top", className)}
    >
      {children}
    </motion.div>
  );
}
