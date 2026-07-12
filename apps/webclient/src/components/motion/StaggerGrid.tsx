"use client";

import { motion } from "framer-motion";
import type { HTMLAttributes, ReactNode } from "react";

import { useInViewReveal } from "@/hooks/use-in-view-reveal";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { homeCardReveal, homeViewport } from "@/lib/home-motion";
import {
  catalogItemViewport,
  catalogStaggerItem,
  reducedVariants,
  STAGGER_STEP,
} from "@/lib/motion";
import { revealVariantAnimate, safeRevealTransition } from "@/lib/motion-safe";
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
  variant = "default",
}: {
  children: ReactNode;
  className?: string;
  /** Dùng cho stagger nhẹ trong cùng một hàng (0–5) */
  index?: number;
  /** home = reveal mạnh hơn cho trang chủ */
  variant?: "default" | "home";
}) {
  const reduced = useReducedMotion();
  const staggerDelay = (index % 6) * STAGGER_STEP;
  const variants = reduced
    ? reducedVariants
    : variant === "home"
      ? homeCardReveal
      : catalogStaggerItem;
  const viewport = variant === "home" ? homeViewport : catalogItemViewport;
  const { ref, show } = useInViewReveal(viewport);

  if (reduced) {
    return <div className={cn("h-full", className)}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      custom={index}
      initial="hidden"
      animate={revealVariantAnimate(reduced, show)}
      variants={variants}
      transition={safeRevealTransition(reduced, { delay: staggerDelay })}
      className={cn("h-full", className)}
    >
      {children}
    </motion.div>
  );
}
