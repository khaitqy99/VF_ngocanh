"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { useHomeAdminEdit } from "@/components/admin-edit/home/HomeAdminEditContext";
import { HomeEditImageButton } from "@/components/admin-edit/home/HomeEditImageButton";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { homeImageZoom, homeOverlayCard } from "@/lib/home-motion";
import { vfCardTitle } from "@/lib/typography";

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
  /** Mobile/tablet: ảnh trên + copy dưới; desktop giữ overlay */
  stackOnMobile?: boolean;
  mobilePanelClass?: string;
  imageFit?: "cover" | "contain";
  imageZoom?: boolean;
  /** Admin: path for "Đổi ảnh" inside the image shell */
  imageEditPath?: string;
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
  stackOnMobile = false,
  mobilePanelClass = "bg-brand-dark p-5 text-white",
  imageFit = "cover",
  imageZoom = true,
  imageEditPath,
}: HomeOverlayCardProps) {
  const reduced = useReducedMotion();
  const edit = useHomeAdminEdit();
  const editing = Boolean(edit?.editMode);

  const imageClass =
    imageFit === "contain"
      ? "absolute inset-0 h-full w-full object-contain object-center p-5 sm:p-6 lg:p-8"
      : "absolute inset-0 h-full w-full object-cover object-center";

  const fallbackTitle = <h3 className={vfCardTitle}>{title}</h3>;
  const imageButton = imageEditPath ? <HomeEditImageButton imagePath={imageEditPath} /> : null;

  // Admin edit: always stack image + form so fields are visible/clickable
  // (no <a> navigation, no hover slide-hide overlay).
  if (editing) {
    return (
      <motion.div
        initial="rest"
        variants={homeOverlayCard}
        className={`group relative flex w-full flex-col overflow-hidden rounded-2xl shadow-soft ${
          fillHeight ? "h-full" : ""
        } ${heightClass ?? ""}`}
      >
        <div className="relative w-full shrink-0 overflow-hidden bg-surface-muted aspect-[16/10] sm:aspect-[2.2/1]">
          {imageButton}
          <motion.img src={image} alt={imageAlt} className={imageClass} loading="lazy" />
        </div>
        <div className={mobilePanelClass}>{children ?? fallbackTitle}</div>
      </motion.div>
    );
  }

  const rootClass = stackOnMobile
    ? `group relative flex w-full flex-col overflow-hidden rounded-2xl shadow-soft transition-[box-shadow,transform] duration-300 hover:shadow-[var(--shadow-brand)] lg:relative lg:block ${
        fillHeight ? "h-full lg:h-full lg:min-h-[280px]" : "lg:min-h-[220px]"
      } ${heightClass ?? ""}`
    : `group relative block h-full w-full overflow-hidden rounded-2xl shadow-soft transition-[box-shadow,transform] duration-300 hover:shadow-[var(--shadow-brand)] ${
        fillHeight ? "h-full min-h-[280px]" : ""
      } ${heightClass ?? ""}`;

  const imageShellClass = stackOnMobile
    ? `relative w-full shrink-0 overflow-hidden bg-surface-muted aspect-[16/10] sm:aspect-[2.2/1] lg:absolute lg:inset-0 lg:aspect-auto lg:h-full lg:min-h-full ${aspectClass}`
    : `relative h-full w-full overflow-hidden bg-surface-muted ${aspectClass}`;

  return (
    <motion.a
      href={href}
      {...(external ? { target: "_blank", rel: rel ?? "noopener noreferrer" } : {})}
      initial="rest"
      whileHover={reduced ? undefined : "hover"}
      whileTap={reduced ? undefined : "tap"}
      variants={homeOverlayCard}
      className={rootClass}
    >
      <div className={imageShellClass}>
        {imageButton}
        <motion.img
          src={image}
          alt={imageAlt}
          variants={reduced || !imageZoom ? undefined : homeImageZoom}
          className={imageClass}
          loading="lazy"
        />
        <div className={stackOnMobile ? `hidden lg:block ${overlayClass}` : overlayClass}>
          {children ?? fallbackTitle}
        </div>
      </div>
      {stackOnMobile && children ? (
        <div className={`lg:hidden ${mobilePanelClass}`}>{children}</div>
      ) : null}
    </motion.a>
  );
}
