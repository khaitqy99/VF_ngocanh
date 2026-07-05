"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import {
  HeroBannerHeightSpacer,
  HeroBannerSlideImages,
} from "@/components/shared/HeroBannerSlideMedia";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { homeHeroDot, homeHeroDotTransition, homeHeroSlide, homeNavBtn } from "@/lib/home-motion";
import type { HeroBannerSlide } from "@/lib/images";

const carouselNavBtnSize = "glass-nav h-9 w-9 md:h-10 md:w-10";
const carouselNavBtnSizeLight = "glass-nav-light h-8 w-8 md:h-9 md:w-9";

export function PromoBannerCarousel({
  banners,
  autoPlayMs = 5500,
  showControls = true,
  className = "",
  aspectLayout = false,
  variant = "default",
}: {
  banners: HeroBannerSlide[];
  autoPlayMs?: number;
  showControls?: boolean;
  className?: string;
  /** @deprecated Chiều cao banner theo ảnh thật; prop giữ để tương thích API cũ */
  aspectLayout?: boolean;
  /** cinematic — gradient, Ken Burns, counter như homepage */
  variant?: "default" | "cinematic";
}) {
  const reduced = useReducedMotion();
  const [idx, setIdx] = useState(0);
  const [direction, setDirection] = useState(0);
  const cinematic = variant === "cinematic";
  const intrinsicLayout = cinematic || aspectLayout;
  const activeSlide = banners[idx];

  const goTo = useCallback((next: number) => {
    setIdx((current) => {
      setDirection(next > current ? 1 : -1);
      return next;
    });
  }, []);

  const goPrev = useCallback(() => {
    goTo((idx - 1 + banners.length) % banners.length);
  }, [banners.length, goTo, idx]);

  const goNext = useCallback(() => {
    goTo((idx + 1) % banners.length);
  }, [banners.length, goTo, idx]);

  useEffect(() => {
    if (reduced || banners.length <= 1) return;
    const t = setInterval(() => {
      setIdx((current) => {
        setDirection(1);
        return (current + 1) % banners.length;
      });
    }, autoPlayMs);
    return () => clearInterval(t);
  }, [autoPlayMs, banners.length, reduced]);

  if (!banners.length) return null;

  const slideTotal = String(banners.length).padStart(2, "0");
  const slideCurrent = String(idx + 1).padStart(2, "0");
  const progress = ((idx + 1) / banners.length) * 100;

  const rootClass = intrinsicLayout
    ? `relative w-full overflow-hidden ${className}`
    : `absolute inset-0 overflow-hidden ${className}`;

  const navBtn = cinematic
    ? carouselNavBtnSize
    : aspectLayout
      ? carouselNavBtnSizeLight
      : carouselNavBtnSize;

  return (
    <div className={rootClass}>
      {intrinsicLayout && activeSlide ? <HeroBannerHeightSpacer slide={activeSlide} /> : null}

      <div className={intrinsicLayout ? "absolute inset-0 overflow-hidden" : "contents"}>
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          {banners.map(
            (slide, i) =>
              i === idx && (
                <motion.div
                  key={slide.desktop}
                  custom={direction}
                  variants={reduced ? undefined : homeHeroSlide}
                  initial={reduced ? false : "enter"}
                  animate={reduced ? undefined : "center"}
                  exit={reduced ? undefined : "exit"}
                  className="absolute inset-0"
                >
                  <motion.div
                    className="absolute inset-0 overflow-hidden"
                    initial={reduced || !cinematic ? false : { scale: 1.06 }}
                    animate={reduced || !cinematic ? undefined : { scale: 1 }}
                    transition={{ duration: 8, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <HeroBannerSlideImages slide={slide} priority={i === 0} variant="cover" />
                  </motion.div>
                  {cinematic ? (
                    <>
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(11,31,91,0.55)_0%,transparent_22%,transparent_68%,rgba(11,31,91,0.65)_100%)]"
                      />
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,rgba(11,31,91,0.35)_0%,transparent_42%)]"
                      />
                    </>
                  ) : null}
                </motion.div>
              ),
          )}
        </AnimatePresence>
      </div>

      {showControls && banners.length > 1 && (
        <>
          <motion.button
            type="button"
            onClick={goPrev}
            initial="rest"
            whileHover={reduced ? undefined : "hover"}
            whileTap={reduced ? undefined : "tap"}
            variants={homeNavBtn}
            className={`absolute top-1/2 left-3 z-10 -translate-y-1/2 md:left-5 ${navBtn}`}
            aria-label="Banner trước"
          >
            <ChevronLeft size={18} strokeWidth={1.75} />
          </motion.button>
          <motion.button
            type="button"
            onClick={goNext}
            initial="rest"
            whileHover={reduced ? undefined : "hover"}
            whileTap={reduced ? undefined : "tap"}
            variants={homeNavBtn}
            className={`absolute top-1/2 right-3 z-10 -translate-y-1/2 md:right-5 ${navBtn}`}
            aria-label="Banner sau"
          >
            <ChevronRight size={18} strokeWidth={1.75} />
          </motion.button>
          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 md:bottom-5">
            {banners.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                className={`rounded-full p-1.5 focus-visible:outline-2 focus-visible:outline-offset-2 ${cinematic ? "focus-visible:outline-white" : ""}`}
                aria-label={`Banner ${i + 1}`}
                aria-current={i === idx}
              >
                <motion.span
                  className={`block h-1 rounded-full ${cinematic || !aspectLayout ? "bg-white" : "bg-brand"}`}
                  animate={i === idx ? homeHeroDot.active : homeHeroDot.inactive}
                  transition={homeHeroDotTransition}
                  style={{
                    backgroundColor:
                      i === idx
                        ? undefined
                        : cinematic || !aspectLayout
                          ? "rgba(255,255,255,0.32)"
                          : aspectLayout
                            ? "rgb(203 213 225)"
                            : "rgba(255,255,255,0.5)",
                  }}
                />
              </button>
            ))}
          </div>
          {cinematic && (
            <div className="absolute right-4 bottom-6 z-10 hidden flex-col items-end gap-3 md:flex md:right-8 md:bottom-8">
              <p
                className="font-mono text-[11px] tracking-[0.22em] text-white/75 tabular-nums"
                aria-live="polite"
              >
                <span className="text-white">{slideCurrent}</span>
                <span className="mx-1.5 text-white/40">/</span>
                <span>{slideTotal}</span>
              </p>
              <div className="h-px w-24 overflow-hidden rounded-full bg-white/20">
                <motion.div
                  className="h-full origin-left rounded-full bg-accent-yellow"
                  animate={{ scaleX: progress / 100 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
