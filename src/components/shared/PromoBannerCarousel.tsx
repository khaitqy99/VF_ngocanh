"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { HeroBannerSlide } from "@/lib/images";

const carouselNavBtnDark =
  "flex items-center justify-center rounded-full border border-white/30 bg-black/30 text-white shadow-sm backdrop-blur-sm transition hover:bg-black/50 active:scale-95";
const carouselNavBtnLight =
  "flex items-center justify-center rounded-full border border-slate-200/80 bg-white/70 text-slate-500 shadow-sm transition hover:border-brand/30 hover:bg-white hover:text-brand active:scale-95";
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
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % banners.length), autoPlayMs);
    return () => clearInterval(t);
  }, [banners.length, autoPlayMs]);

  if (!banners.length) return null;

  const rootClass = aspectLayout
    ? `relative w-full aspect-[5/8] lg:aspect-video overflow-hidden ${className}`
    : `absolute inset-0 ${className}`;

  const navBtn = aspectLayout ? carouselNavBtnLight : carouselNavBtnDark;

  return (
    <div className={rootClass}>
      {banners.map((slide, i) => (
        <div
          key={slide.desktop}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === idx ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={i !== idx}
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
        </div>
      ))}

      {showControls && banners.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => setIdx((i) => (i - 1 + banners.length) % banners.length)}
            className={`absolute top-1/2 left-3 z-10 -translate-y-1/2 md:left-5 ${navBtn} ${carouselNavBtnSize}`}
            aria-label="Banner trước"
          >
            <ChevronLeft size={18} strokeWidth={1.75} />
          </button>
          <button
            type="button"
            onClick={() => setIdx((i) => (i + 1) % banners.length)}
            className={`absolute top-1/2 right-3 z-10 -translate-y-1/2 md:right-5 ${navBtn} ${carouselNavBtnSize}`}
            aria-label="Banner sau"
          >
            <ChevronRight size={18} strokeWidth={1.75} />
          </button>
          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 md:bottom-4">
            {banners.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIdx(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === idx
                    ? `w-5 ${aspectLayout ? "bg-brand" : "bg-white"}`
                    : `w-1.5 ${aspectLayout ? "bg-slate-300" : "bg-white/50"}`
                }`}
                aria-label={`Banner ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
