"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import {
  homeCarouselImage,
  homeCarouselText,
  homeNavBtn,
  homeSpecItem,
  homeSpecStagger,
  homeViewport,
} from "@/lib/home-motion";
import type { VinFastHomeSlide } from "@/lib/vinfast-home";
import { vfCardTitle, vfSectionHeadingLeft } from "@/lib/typography";

export type FeatureCarouselSlide = VinFastHomeSlide & {
  description?: string;
};

const carouselNavBtnSize = "glass-nav-light h-8 w-8 md:h-9 md:w-9";

const featureCopy = "relative z-10 w-full min-w-0";
const featureTitle = vfSectionHeadingLeft;
const featureSubtitle = "mt-2 text-sm text-muted-foreground lg:mt-1.5 xl:text-[15px]";
const featureDescription = "mt-3 max-w-lg text-xs leading-relaxed text-muted-foreground md:text-sm";
const featureSpecGrid =
  "mt-6 grid grid-cols-2 gap-x-4 gap-y-5 sm:gap-x-8 sm:gap-y-6 lg:mt-5 lg:gap-x-6 lg:gap-y-4 xl:mt-6 xl:grid-cols-4 xl:gap-x-8 2xl:mt-7 2xl:gap-x-10";
const featureActions = "mt-6 flex items-stretch gap-2 sm:gap-3 lg:mt-5 xl:mt-6 2xl:mt-8";
const featureActionItem = "flex min-w-0 flex-1";
const featurePanel =
  "relative flex flex-col justify-center px-5 py-8 sm:px-8 lg:absolute lg:inset-y-0 lg:w-1/2 lg:px-10 lg:py-0 xl:px-16";
const featureBtn =
  "flex h-full min-h-[2.75rem] w-full items-center justify-center rounded-md px-2.5 py-2 text-center text-[11px] font-semibold leading-none tracking-wide transition active:scale-[0.98] sm:min-h-[2.625rem] sm:px-4 sm:text-[11px] lg:min-h-[2.25rem] lg:px-3.5 lg:py-1.5 lg:text-[10px] xl:min-h-[2.5rem] xl:px-4 xl:py-2 xl:text-[11px] 2xl:min-h-[2.75rem] 2xl:px-5 2xl:py-2.5 2xl:text-[12px]";

function isPriceSpec(label: string, value: string) {
  return /giá/i.test(label) || /VNĐ/i.test(value);
}

export function FeatureCarouselSection({
  slides,
  imageSide,
  imageAspect,
  onPrimaryClick,
}: {
  slides: FeatureCarouselSlide[];
  imageSide: "left" | "right";
  imageAspect: "2544/1500" | "2/1";
  /** Mở modal / xử lý nút chính (vd. ĐẶT CỌC) thay vì điều hướng */
  onPrimaryClick?: (slide: FeatureCarouselSlide) => void;
}) {
  const reduced = useReducedMotion();
  const [idx, setIdx] = useState(0);
  const [direction, setDirection] = useState(0);

  const goTo = useCallback(
    (next: number) => {
      setDirection(next > idx ? 1 : -1);
      setIdx(next);
    },
    [idx],
  );

  const goPrev = () => goTo((idx - 1 + slides.length) % slides.length);
  const goNext = () => goTo((idx + 1) % slides.length);

  const aspectClass =
    imageAspect === "2544/1500" ? "aspect-[2544/1500] w-full" : "aspect-[2/1] w-full";
  const imageWrapClass = `relative ${aspectClass} overflow-hidden bg-surface-muted ${
    imageSide === "left" ? "lg:w-1/2" : "lg:ml-auto lg:w-1/2"
  }`;

  const textPanelClass =
    imageSide === "left" ? `${featurePanel} lg:right-0` : `${featurePanel} lg:left-0`;
  const imageFadeEdge =
    imageSide === "left"
      ? "pointer-events-none absolute inset-y-0 right-0 z-[1] hidden w-28 bg-gradient-to-r from-transparent via-[var(--surface-muted)]/70 to-[var(--surface-muted)] lg:block lg:w-40 xl:w-52"
      : "pointer-events-none absolute inset-y-0 left-0 z-[1] hidden w-28 bg-gradient-to-l from-transparent via-[var(--surface-muted)]/70 to-[var(--surface-muted)] lg:block lg:w-40 xl:w-52";
  const textFadeEdge =
    imageSide === "left"
      ? "pointer-events-none absolute inset-y-0 left-0 z-[1] hidden w-16 bg-gradient-to-l from-transparent to-[var(--surface-muted)]/80 lg:block lg:w-24 xl:w-32"
      : "pointer-events-none absolute inset-y-0 right-0 z-[1] hidden w-16 bg-gradient-to-r from-transparent to-[var(--surface-muted)]/80 lg:block lg:w-24 xl:w-32";
  const featureImageInset = "absolute inset-5 sm:inset-7 md:inset-8 lg:inset-10 xl:inset-12";
  const defaultImageClass = `h-full w-full object-contain ${
    imageSide === "left" ? "object-left" : "object-right"
  }`;

  const activeSlide = slides[idx];

  return (
    <motion.section
      className="relative w-full overflow-hidden bg-white"
      initial={reduced ? false : { opacity: 0, y: 40 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={homeViewport}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="relative w-full home-feature-surface">
        <div className="relative z-10">
          <div className={imageWrapClass}>
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              {activeSlide && (
                <motion.div
                  key={`img-${activeSlide.image}`}
                  custom={direction}
                  variants={reduced ? undefined : homeCarouselImage}
                  initial={reduced ? false : "enter"}
                  animate={reduced ? undefined : "center"}
                  exit={reduced ? undefined : "exit"}
                  className="absolute inset-0 z-[1]"
                >
                  <div className={featureImageInset}>
                    <img
                      src={activeSlide.image}
                      alt={activeSlide.imageAlt}
                      className={activeSlide.imageClass ?? defaultImageClass}
                    />
                  </div>
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-10 bg-gradient-to-t from-[var(--surface-muted)] to-transparent lg:hidden"
                  />
                  <div aria-hidden className={imageFadeEdge} />
                </motion.div>
              )}
            </AnimatePresence>
            {slides.length > 1 && (
              <CarouselArrows reduced={reduced} onImage onPrev={goPrev} onNext={goNext} />
            )}
          </div>

          <div className="relative grid lg:absolute lg:inset-0">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              {activeSlide && (
                <motion.div
                  key={`text-${activeSlide.title}`}
                  custom={direction}
                  variants={reduced ? undefined : homeCarouselText}
                  initial={reduced ? false : "enter"}
                  animate={reduced ? undefined : "center"}
                  exit={reduced ? undefined : "exit"}
                  className="col-start-1 row-start-1 z-[1] lg:absolute lg:inset-0"
                >
                  <div className={textPanelClass}>
                    <div aria-hidden className={textFadeEdge} />
                    <div className={featureCopy}>
                      <h2 className={featureTitle}>{activeSlide.title}</h2>
                      {activeSlide.subtitle && (
                        <p className={featureSubtitle}>{activeSlide.subtitle}</p>
                      )}
                      {activeSlide.description && (
                        <p className={featureDescription}>{activeSlide.description}</p>
                      )}
                      <motion.div
                        className={featureSpecGrid}
                        variants={reduced ? undefined : homeSpecStagger}
                        initial={reduced ? false : "hidden"}
                        animate={reduced ? undefined : "visible"}
                      >
                        {(() => {
                          const priceSpec = activeSlide.specs.find((spec) =>
                            isPriceSpec(spec.label, spec.value),
                          );
                          const otherSpecs = activeSlide.specs.filter(
                            (spec) => !isPriceSpec(spec.label, spec.value),
                          );

                          return (
                            <>
                              {otherSpecs.map((spec) => (
                                <motion.div
                                  key={`${spec.value}-${spec.label}`}
                                  variants={reduced ? undefined : homeSpecItem}
                                >
                                  <FeatureSpec
                                    feature
                                    icon={
                                      spec.seats ? (
                                        <Users className="size-4 shrink-0 text-brand lg:size-3.5 xl:size-4" />
                                      ) : undefined
                                    }
                                    value={spec.value}
                                    label={spec.label}
                                    highlight={spec.highlight}
                                  />
                                </motion.div>
                              ))}
                              {priceSpec && (
                                <motion.div
                                  variants={reduced ? undefined : homeSpecItem}
                                  className={
                                    otherSpecs.length <= 2 ? "col-span-2 xl:col-span-1" : undefined
                                  }
                                >
                                  <FeaturePriceBlock
                                    feature
                                    label={priceSpec.label}
                                    value={priceSpec.value}
                                    listPrice={priceSpec.listPrice}
                                  />
                                </motion.div>
                              )}
                            </>
                          );
                        })()}
                      </motion.div>
                      <motion.div
                        className={featureActions}
                        variants={reduced ? undefined : homeSpecStagger}
                        initial={reduced ? false : "hidden"}
                        animate={reduced ? undefined : "visible"}
                      >
                        <motion.div
                          variants={reduced ? undefined : homeSpecItem}
                          className={featureActionItem}
                        >
                          <FeatureCta
                            variant="primary"
                            feature
                            href={onPrimaryClick ? undefined : activeSlide.href}
                            onClick={onPrimaryClick ? () => onPrimaryClick(activeSlide) : undefined}
                          >
                            {activeSlide.primaryCta}
                          </FeatureCta>
                        </motion.div>
                        <motion.div
                          variants={reduced ? undefined : homeSpecItem}
                          className={featureActionItem}
                        >
                          <FeatureCta href={activeSlide.href} variant="outline" feature>
                            {activeSlide.secondaryCta}
                          </FeatureCta>
                        </motion.div>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

export function FeaturePriceBlock({
  label,
  value,
  listPrice,
  feature,
  className,
}: {
  label: string;
  value: string;
  listPrice?: string;
  feature?: boolean;
  className?: string;
}) {
  return (
    <div className={feature ? `min-w-0 ${className ?? ""}` : className}>
      <div className="flex flex-col items-center text-center">
        <p
          className={
            feature
              ? "text-[11px] leading-snug text-muted-foreground lg:text-[10px] xl:text-[11px]"
              : "text-[11px] text-muted-foreground"
          }
        >
          {label}
        </p>
        <p
          className={
            feature
              ? "mt-0.5 break-words text-sm font-bold tracking-tight text-brand-dark sm:whitespace-nowrap sm:text-base lg:text-sm xl:text-base 2xl:text-lg"
              : `mt-0.5 ${vfCardTitle} tracking-tight lg:text-lg`
          }
        >
          {value}
        </p>
        {listPrice && (
          <p
            className={
              feature
                ? "mt-0.5 break-words text-xs text-muted-foreground line-through sm:whitespace-nowrap lg:text-[11px]"
                : "mt-0.5 text-xs text-muted-foreground line-through"
            }
          >
            {listPrice}
          </p>
        )}
      </div>
    </div>
  );
}

export function FeatureSpec({
  icon,
  value,
  label,
  highlight,
  feature,
  dense,
  className,
}: {
  icon?: React.ReactNode;
  value: string;
  label: string;
  highlight?: boolean;
  feature?: boolean;
  dense?: boolean;
  className?: string;
}) {
  return (
    <div className={feature ? `min-w-0 ${className ?? ""}` : className}>
      <div
        className={`flex min-w-0 items-baseline gap-1 font-bold ${highlight ? "text-brand" : "text-brand-dark"}`}
      >
        {icon && <span className="text-brand">{icon}</span>}
        <span
          className={
            feature
              ? dense
                ? `text-sm tracking-tight sm:text-base lg:text-xs lg:leading-tight xl:text-sm 2xl:text-lg ${highlight ? "whitespace-nowrap" : "break-words"}`
                : `text-sm tracking-tight sm:text-base lg:text-sm lg:leading-snug xl:text-base 2xl:text-lg ${highlight ? "whitespace-nowrap" : "break-words"}`
              : "text-base tracking-tight lg:text-lg"
          }
        >
          {value}
        </span>
      </div>
      <p
        className={
          feature
            ? dense
              ? "mt-0.5 text-[11px] leading-snug text-muted-foreground lg:text-[10px] xl:text-[11px]"
              : "mt-0.5 text-[11px] leading-snug text-muted-foreground lg:text-[10px] xl:text-[11px]"
            : "mt-0.5 text-[11px] text-muted-foreground"
        }
      >
        {label}
      </p>
    </div>
  );
}

function FeatureCta({
  href,
  onClick,
  variant,
  feature,
  children,
}: {
  href?: string;
  onClick?: () => void;
  variant: "primary" | "outline";
  feature?: boolean;
  children: React.ReactNode;
}) {
  const className =
    variant === "primary"
      ? feature
        ? `${featureBtn} bg-brand text-white shadow-sm hover:bg-[#0046cc]`
        : "rounded-md bg-brand px-5 py-2.5 text-[12px] font-semibold tracking-wide text-white shadow-sm transition hover:bg-[#0046cc] active:scale-[0.98]"
      : feature
        ? `${featureBtn} border border-brand bg-white text-brand hover:bg-brand/5`
        : "rounded-md border border-brand bg-white px-5 py-2.5 text-[12px] font-semibold tracking-wide text-brand transition hover:bg-brand/5 active:scale-[0.98]";

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className}>
        {children}
      </button>
    );
  }

  if (!href) {
    return (
      <button type="button" className={className}>
        {children}
      </button>
    );
  }

  if (href.startsWith("http") || href.startsWith("tel:")) {
    return (
      <a
        href={href}
        className={className}
        {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

function CarouselArrows({
  onImage,
  onPrev,
  onNext,
  reduced = false,
}: {
  onImage?: boolean;
  onPrev: () => void;
  onNext: () => void;
  reduced?: boolean;
}) {
  const pos = onImage ? "left-2 sm:left-3" : "left-2 lg:left-3";
  const posR = onImage ? "right-2 sm:right-3" : "right-2 lg:right-3";

  return (
    <>
      <motion.button
        type="button"
        onClick={onPrev}
        initial="rest"
        whileHover={reduced ? undefined : "hover"}
        whileTap={reduced ? undefined : "tap"}
        variants={homeNavBtn}
        className={`absolute top-1/2 z-20 -translate-y-1/2 ${carouselNavBtnSize} ${pos}`}
        aria-label="Slide trước"
      >
        <ChevronLeft size={18} strokeWidth={1.75} />
      </motion.button>
      <motion.button
        type="button"
        onClick={onNext}
        initial="rest"
        whileHover={reduced ? undefined : "hover"}
        whileTap={reduced ? undefined : "tap"}
        variants={homeNavBtn}
        className={`absolute top-1/2 z-20 -translate-y-1/2 ${carouselNavBtnSize} ${posR}`}
        aria-label="Slide sau"
      >
        <ChevronRight size={18} strokeWidth={1.75} />
      </motion.button>
    </>
  );
}
