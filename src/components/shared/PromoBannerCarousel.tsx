"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { homeHeroDot, homeHeroDotTransition, homeHeroSlide, homeNavBtn } from "@/lib/home-motion";
import type { HeroBannerSlide } from "@/lib/images";

const carouselNavBtnDark =
  "flex items-center justify-center rounded-full border border-white/30 bg-black/30 text-white shadow-sm backdrop-blur-sm transition hover:bg-black/50";
const carouselNavBtnLight =
  "flex items-center justify-center rounded-full border border-slate-200/80 bg-white/70 text-slate-500 shadow-sm backdrop-blur-sm transition-colors hover:border-brand/30 hover:bg-white hover:text-brand";
const carouselNavBtnSize = "h-8 w-8 md:h-9 md:w-9";

export function PromoBannerCarousel({
  banners,
  autoPlayMs = 5500,
  showControls = true,
  className = "",
  aspectLayout = false,
}: {
  banners: HeroBannerSlide[];
  autoPlayMs?: number;
  showControls?: boolean;
  className?: string;
  /** Giữ tỷ lệ banner như trang chủ: 5/8 mobile, 16/9 desktop */
  aspectLayout?: boolean;
}) {
  const reduced = useReducedMotion();
  const [idx, setIdx] = useState(0);
  const [direction, setDirection] = useState(0);

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

  const rootClass = aspectLayout
    ? `relative w-full aspect-[5/8] lg:aspect-video overflow-hidden ${className}`
    : `absolute inset-0 overflow-hidden ${className}`;

  const navBtn = aspectLayout ? carouselNavBtnLight : carouselNavBtnDark;

  return (
    <div className={rootClass}>
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
                <Image
                  src={slide.mobile}
                  alt={slide.alt}
                  fill
                  priority={i === 0}
                  sizes="100vw"
                  className="object-cover lg:hidden"
                />
                <Image
                  src={slide.desktop}
                  alt={slide.alt}
                  fill
                  priority={i === 0}
                  sizes="100vw"
                  className="hidden object-cover lg:block"
                />
              </motion.div>
            ),
        )}
      </AnimatePresence>

      {showControls && banners.length > 1 && (
        <>
          <motion.button
            type="button"
            onClick={goPrev}
            initial="rest"
            whileHover={reduced ? undefined : "hover"}
            whileTap={reduced ? undefined : "tap"}
            variants={homeNavBtn}
            className={`absolute top-1/2 left-3 z-10 -translate-y-1/2 md:left-5 ${navBtn} ${carouselNavBtnSize}`}
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
            className={`absolute top-1/2 right-3 z-10 -translate-y-1/2 md:right-5 ${navBtn} ${carouselNavBtnSize}`}
            aria-label="Banner sau"
          >
            <ChevronRight size={18} strokeWidth={1.75} />
          </motion.button>
          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 md:bottom-4">
            {banners.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                className="p-1"
                aria-label={`Banner ${i + 1}`}
                aria-current={i === idx}
              >
                <motion.span
                  className={`block h-1.5 rounded-full ${aspectLayout ? "bg-brand" : "bg-white"}`}
                  animate={i === idx ? homeHeroDot.active : homeHeroDot.inactive}
                  transition={homeHeroDotTransition}
                  style={{
                    backgroundColor:
                      i === idx
                        ? undefined
                        : aspectLayout
                          ? "rgb(203 213 225)"
                          : "rgba(255,255,255,0.5)",
                  }}
                />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
