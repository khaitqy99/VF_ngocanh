"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import { useSectionReveal } from "@/hooks/use-section-reveal";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { homeSectionRule, homeSectionTitle, homeViewport } from "@/lib/home-motion";
import { reducedVariants } from "@/lib/motion";
import { vfEyebrow, vfHomeSectionTitle } from "@/lib/typography";
import { HomeEditableText } from "@/components/admin-edit/home/HomeEditableText";
import { useHomeAdminEdit } from "@/components/admin-edit/home/HomeAdminEditContext";

export function HomeEditableSectionHeader({
  title,
  eyebrow,
  description,
  descriptionClassName,
  viewAllHref,
  onEyebrowChange,
  onTitleChange,
  onDescriptionChange,
  onViewAllHrefChange,
  align = "editorial",
  id,
  className = "",
}: {
  title: string;
  eyebrow?: string;
  description?: string;
  descriptionClassName?: string;
  viewAllHref?: string;
  onEyebrowChange?: (value: string) => void;
  onTitleChange?: (value: string) => void;
  onDescriptionChange?: (value: string) => void;
  onViewAllHrefChange?: (value: string) => void;
  align?: "editorial" | "centered";
  id?: string;
  className?: string;
}) {
  const edit = useHomeAdminEdit();
  const { ref, reduced, initial, animate } = useSectionReveal(homeViewport);
  const centered = align === "centered";
  const staggerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.04 } },
  };

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={animate}
      viewport={homeViewport}
      variants={reduced ? reducedVariants : staggerVariants}
      className={`relative mb-9 sm:mb-11 lg:mb-12 ${
        centered
          ? "mx-auto max-w-2xl text-center"
          : "flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"
      } ${className}`}
    >
      <div className={centered ? "min-w-0" : "min-w-0 max-w-2xl"}>
        {eyebrow ? (
          <motion.p
            variants={reduced ? undefined : homeSectionTitle}
            className={`${vfEyebrow} mb-2.5 ${centered ? "mx-auto" : ""}`}
          >
            {edit?.editMode && onEyebrowChange ? (
              <HomeEditableText
                value={eyebrow}
                onChange={onEyebrowChange}
                className={vfEyebrow}
                label="Eyebrow"
              />
            ) : (
              eyebrow
            )}
          </motion.p>
        ) : null}
        <motion.h2
          id={id}
          variants={reduced ? undefined : homeSectionTitle}
          className={`${vfHomeSectionTitle} ${centered ? "text-balance mx-auto" : ""}`}
        >
          {edit?.editMode && onTitleChange ? (
            <HomeEditableText
              value={title}
              onChange={onTitleChange}
              className={vfHomeSectionTitle}
              label="Tiêu đề"
            />
          ) : (
            title
          )}
        </motion.h2>
        <motion.span
          variants={reduced ? undefined : homeSectionRule}
          className={`mt-3 block h-0.5 w-10 rounded-full bg-brand ${
            centered ? "mx-auto origin-center" : "origin-left"
          }`}
          aria-hidden
        />
        {description ? (
          <motion.p
            variants={reduced ? undefined : homeSectionTitle}
            className={`mt-4 ${descriptionClassName ?? "max-w-[52ch]"} text-sm leading-relaxed text-muted-foreground ${
              centered ? "mx-auto text-balance" : ""
            }`}
          >
            {edit?.editMode && onDescriptionChange ? (
              <HomeEditableText
                value={description}
                onChange={onDescriptionChange}
                multiline
                className={`${descriptionClassName ?? "max-w-[52ch]"} text-sm leading-relaxed text-muted-foreground`}
                label="Mô tả"
              />
            ) : (
              description
            )}
          </motion.p>
        ) : null}
      </div>
      {viewAllHref ? (
        <motion.div
          variants={reduced ? undefined : homeSectionTitle}
          className={`shrink-0 ${centered ? "mt-6 flex justify-center" : ""}`}
        >
          {edit?.editMode && onViewAllHrefChange ? (
            <div className="space-y-1">
              <Link
                href={viewAllHref}
                className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand"
              >
                Xem tất cả
                <ArrowUpRight size={16} strokeWidth={2} />
              </Link>
              <HomeEditableText
                value={viewAllHref}
                onChange={onViewAllHrefChange}
                className="text-xs text-muted-foreground"
                label="Link xem tất cả"
              />
            </div>
          ) : (
            <Link
              href={viewAllHref}
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition hover:text-brand-dark focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              Xem tất cả
              <ArrowUpRight
                size={16}
                strokeWidth={2}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          )}
        </motion.div>
      ) : null}
    </motion.div>
  );
}
