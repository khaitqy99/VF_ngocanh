"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { detailSectionReveal, detailViewport } from "@/lib/detail-motion";

export type PdpSectionVariant = "default" | "muted" | "dark";

const VARIANT_CLASS: Record<PdpSectionVariant, string> = {
  default: "bg-white text-foreground",
  muted: "bg-[linear-gradient(180deg,#f4f7fc_0%,#fafbfd_45%,#ffffff_100%)] text-foreground",
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
  const reduced = useReducedMotion();

  return (
    <motion.section
      id={id}
      initial={reduced ? false : "hidden"}
      whileInView={reduced ? undefined : "visible"}
      viewport={detailViewport}
      variants={reduced ? undefined : detailSectionReveal}
      className={`scroll-mt-[8.75rem] py-12 sm:py-16 lg:scroll-mt-[7.5rem] lg:py-20 ${VARIANT_CLASS[variant]}`}
    >
      <div className="container-vf">{children}</div>
    </motion.section>
  );
}
