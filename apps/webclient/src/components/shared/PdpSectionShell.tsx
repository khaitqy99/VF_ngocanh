"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

import { useScrollReveal } from "@/hooks/use-scroll-reveal";

export type PdpSectionVariant = "default" | "muted" | "dark";

const VARIANT_CLASS: Record<PdpSectionVariant, string> = {
  default: "bg-white text-foreground",
  muted: "bg-surface-muted text-foreground",
  dark: "bg-gradient-to-b from-[#081428] via-[#0b1f5b] to-[#0d2650] text-white",
};

export function PdpSection({
  id,
  variant = "default",
  children,
}: {
  id: string;
  variant?: PdpSectionVariant;
  children: ReactNode;
}) {
  const reveal = useScrollReveal();

  return (
    <motion.section
      id={id}
      {...reveal}
      className={`scroll-mt-[8.75rem] py-12 sm:py-16 lg:scroll-mt-[7.5rem] lg:py-20 ${VARIANT_CLASS[variant]}`}
    >
      <div className="container-vf">{children}</div>
    </motion.section>
  );
}
