"use client";

import { motion } from "framer-motion";
import type { HTMLAttributes, ReactNode } from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { homeCardReveal, homeViewport } from "@/lib/home-motion";
import { catalogItemViewport, catalogStaggerItem, STAGGER_STEP } from "@/lib/motion";
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
  const variants = variant === "home" ? homeCardReveal : catalogStaggerItem;
  const viewport = variant === "home" ? homeViewport : catalogItemViewport;

  if (reduced) {
    return <div className={cn("h-full", className)}>{children}</div>;
  }

  if (variant === "home") {
    return (
      <motion.div
        custom={index}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={variants}
        className={cn("h-full", className)}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={variants}
      transition={{ delay: staggerDelay }}
      className={cn("h-full", className)}
    >
      {children}
    </motion.div>
  );
}
