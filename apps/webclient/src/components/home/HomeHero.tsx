"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import {
  HeroBannerHeightSpacer,
  HeroBannerSlideImages,
} from "@/components/shared/HeroBannerSlideMedia";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { type HeroBannerSlide } from "@/lib/images";
import { homeHeroDot, homeHeroDotTransition, homeHeroSlide, homeNavBtn } from "@/lib/home-motion";

const carouselNavBtnSize = "glass-nav h-9 w-9 md:h-10 md:w-10";

export function HomeHero({ banners }: { banners: HeroBannerSlide[] }) {
  const HERO_BANNERS = banners;
  const reduced = useReducedMotion();
  const [idx, setIdx] = useState(0);
  const [direction, setDirection] = useState(0);
  const activeSlide = HERO_BANNERS[idx];

  const goTo = useCallback((next: number) => {
    setIdx((current) => {
      setDirection(next > current ? 1 : -1);
      return next;
    });
  }, []);

  const goPrev = useCallback(() => {
    goTo((idx - 1 + HERO_BANNERS.length) % HERO_BANNERS.length);
  }, [goTo, idx, HERO_BANNERS.length]);

  const goNext = useCallback(() => {
    goTo((idx + 1) % HERO_BANNERS.length);
  }, [goTo, idx, HERO_BANNERS.length]);

  useEffect(() => {
    if (reduced) return;
    const t = setInterval(() => {
      setIdx((current) => {
        setDirection(1);
        return (current + 1) % HERO_BANNERS.length;
      });
    }, 5500);
    return () => clearInterval(t);
  }, [reduced, HERO_BANNERS.length]);

  const slideTotal = String(HERO_BANNERS.length).padStart(2, "0");
  const slideCurrent = String(idx + 1).padStart(2, "0");

  return (
    <section className="relative w-full overflow-hidden bg-brand-dark">
      <div className="relative w-full">
        {activeSlide ? <HeroBannerHeightSpacer slide={activeSlide} /> : null}

        <div className="absolute inset-0 overflow-hidden">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            {HERO_BANNERS.map(
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
                    <HeroBannerSlideImages slide={slide} priority={i === 0} variant="cover" />
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(11,31,91,0.35)_0%,transparent_28%,transparent_62%,rgba(11,31,91,0.55)_100%)]"
                    />
                  </motion.div>
                ),
            )}
          </AnimatePresence>
        </div>

        <motion.button
          type="button"
          onClick={goPrev}
          initial="rest"
          whileHover={reduced ? undefined : "hover"}
          whileTap={reduced ? undefined : "tap"}
          variants={homeNavBtn}
          className={`absolute top-1/2 left-3 z-10 -translate-y-1/2 md:left-5 ${carouselNavBtnSize}`}
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
          className={`absolute top-1/2 right-3 z-10 -translate-y-1/2 md:right-5 ${carouselNavBtnSize}`}
          aria-label="Banner sau"
        >
          <ChevronRight size={18} strokeWidth={1.75} />
        </motion.button>

        <div className="absolute right-4 bottom-4 z-10 hidden items-end gap-3 md:flex md:right-6 md:bottom-6">
          <p
            className="font-mono text-[11px] tracking-[0.2em] text-white/80 tabular-nums"
            aria-live="polite"
          >
            <span className="text-white">{slideCurrent}</span>
            <span className="mx-1 text-white/45">/</span>
            <span>{slideTotal}</span>
          </p>
        </div>

        <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 md:bottom-5">
          {HERO_BANNERS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              className="rounded-full p-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              aria-label={`Slide ${i + 1}`}
              aria-current={i === idx}
            >
              <motion.span
                className="block h-1 rounded-full bg-white"
                animate={i === idx ? homeHeroDot.active : homeHeroDot.inactive}
                transition={homeHeroDotTransition}
                style={{ backgroundColor: i === idx ? undefined : "rgba(255,255,255,0.38)" }}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
