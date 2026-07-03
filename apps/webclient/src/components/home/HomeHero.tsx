"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { type HeroBannerSlide } from "@/lib/images";
import { homeHeroDot, homeHeroDotTransition, homeHeroSlide, homeNavBtn } from "@/lib/home-motion";

const carouselNavBtn =
  "flex items-center justify-center rounded-full border border-slate-200/80 bg-white/70 text-slate-500 shadow-sm backdrop-blur-sm transition-colors hover:border-brand/30 hover:bg-white hover:text-brand";
const carouselNavBtnSize = `${carouselNavBtn} h-8 w-8 md:h-9 md:w-9`;

export function HomeHero({ banners }: { banners: HeroBannerSlide[] }) {
  const HERO_BANNERS = banners;
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
    goTo((idx - 1 + HERO_BANNERS.length) % HERO_BANNERS.length);
  }, [goTo, idx]);

  const goNext = useCallback(() => {
    goTo((idx + 1) % HERO_BANNERS.length);
  }, [goTo, idx]);

  useEffect(() => {
    if (reduced) return;
    const t = setInterval(() => {
      setIdx((current) => {
        setDirection(1);
        return (current + 1) % HERO_BANNERS.length;
      });
    }, 5500);
    return () => clearInterval(t);
  }, [reduced]);

  return (
    <section className="relative w-full overflow-hidden bg-white">
      <div className="relative aspect-[5/8] w-full lg:aspect-video">
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
                  className="absolute inset-0 z-[1]"
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
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10"
                  />
                </motion.div>
              ),
          )}
        </AnimatePresence>

        <motion.button
          type="button"
          onClick={goPrev}
          initial="rest"
          whileHover={reduced ? undefined : "hover"}
          whileTap={reduced ? undefined : "tap"}
          variants={homeNavBtn}
          className={`absolute top-1/2 left-3 z-10 -translate-y-1/2 md:left-5 ${carouselNavBtnSize}`}
          aria-label="Previous"
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
          aria-label="Next"
        >
          <ChevronRight size={18} strokeWidth={1.75} />
        </motion.button>

        <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 md:bottom-4">
          {HERO_BANNERS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              className="p-1"
              aria-label={`Slide ${i + 1}`}
              aria-current={i === idx}
            >
              <motion.span
                className="block h-1.5 rounded-full bg-brand"
                animate={i === idx ? homeHeroDot.active : homeHeroDot.inactive}
                transition={homeHeroDotTransition}
                style={{ backgroundColor: i === idx ? undefined : "rgb(203 213 225)" }}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
