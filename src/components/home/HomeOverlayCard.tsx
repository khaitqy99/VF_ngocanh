"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { homeImageZoom, homeOverlayCard } from "@/lib/home-motion";

type HomeOverlayCardProps = {
  href: string;
  title: string;
  image: string;
  imageAlt: string;
  overlayClass: string;
  aspectClass: string;
  fillHeight?: boolean;
  external?: boolean;
  rel?: string;
  children?: ReactNode;
  heightClass?: string;
};

export function HomeOverlayCard({
  href,
  title,
  image,
  imageAlt,
  overlayClass,
  aspectClass,
  fillHeight = false,
  external,
  rel,
  children,
  heightClass,
}: HomeOverlayCardProps) {
  const reduced = useReducedMotion();

  return (
    <motion.a
      href={href}
      {...(external ? { target: "_blank", rel: rel ?? "noopener noreferrer" } : {})}
      initial="rest"
      whileHover={reduced ? undefined : "hover"}
      whileTap={reduced ? undefined : "tap"}
      variants={homeOverlayCard}
      className={`group relative block overflow-hidden rounded-xl shadow-soft transition-shadow hover:shadow-card ${
        fillHeight ? "h-full" : ""
      } ${heightClass ?? ""}`}
    >
      <div className={`relative w-full overflow-hidden bg-[#e8ecf2] ${aspectClass}`}>
        <motion.img
          src={image}
          alt={imageAlt}
          variants={reduced ? undefined : homeImageZoom}
          className="absolute inset-0 h-full w-full object-cover object-center"
          loading="lazy"
        />
        <div className={overlayClass}>
          {children ?? <h3 className="text-base font-bold md:text-lg">{title}</h3>}
        </div>
      </div>
    </motion.a>
  );
}
