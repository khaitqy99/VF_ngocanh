"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { vfSlideTitle, vfSectionHeadingLeft } from "@/lib/typography";

export type PdpCarouselSlide = {
  title: string;
  description: string;
  image: string;
  imageAlt?: string;
};

const navBtn =
  "flex size-9 items-center justify-center rounded-full border border-white/20 bg-white/90 text-slate-600 shadow-md backdrop-blur transition hover:border-brand/40 hover:text-brand md:size-10";

export function PdpFeatureCarousel({
  slides,
  imageSide = "right",
  lead,
  eyebrow,
  sectionTitle,
  variant = "light",
}: {
  slides: PdpCarouselSlide[];
  imageSide?: "left" | "right";
  lead?: string;
  eyebrow?: string;
  sectionTitle?: string;
  variant?: "light" | "dark" | "warm";
}) {
  const [idx, setIdx] = useState(0);

  const galleryMode = useMemo(() => {
    if (!slides.length) return true;
    const titles = new Set(slides.map((s) => s.title.trim()));
    return titles.size <= 1;
  }, [slides]);

  if (!slides.length) return null;

  const prev = () => setIdx((i) => (i - 1 + slides.length) % slides.length);
  const next = () => setIdx((i) => (i + 1) % slides.length);
  const slide = slides[idx];

  const bg =
    variant === "dark"
      ? "bg-gradient-to-br from-[#0a1628] via-[#0f1f3d] to-[#0a1628] text-white"
      : variant === "warm"
        ? "bg-gradient-to-br from-amber-50/80 via-white to-orange-50/40"
        : "bg-gradient-to-br from-[#f4f6fa] via-[#f8f9fc] to-white";

  const textMuted = variant === "dark" ? "text-white/70" : "text-muted-foreground";
  const titleColor = variant === "dark" ? "text-white" : "text-brand-dark";

  const imagePanel = (
    <div className="relative min-h-[280px] w-full lg:min-h-[420px] lg:flex-1">
      <div className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/10] lg:absolute lg:inset-0 lg:aspect-auto">
        {slides.map((s, i) => (
          <img
            key={`${s.image}-${i}`}
            src={s.image}
            alt={s.imageAlt ?? s.title}
            className={`absolute inset-0 h-full w-full object-contain p-4 transition-all duration-700 sm:p-8 lg:p-10 ${
              i === idx ? "scale-100 opacity-100" : "pointer-events-none scale-[0.98] opacity-0"
            }`}
          />
        ))}
        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className={`absolute top-1/2 left-3 z-10 -translate-y-1/2 ${navBtn}`}
              aria-label="Slide trước"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={next}
              className={`absolute top-1/2 right-3 z-10 -translate-y-1/2 ${navBtn}`}
              aria-label="Slide sau"
            >
              <ChevronRight size={20} />
            </button>
            <div className="absolute bottom-4 left-4 rounded-full bg-black/50 px-3 py-1 text-[11px] font-bold tracking-wider text-white backdrop-blur">
              {String(idx + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
            </div>
          </>
        )}
      </div>
    </div>
  );

  const featureList = !galleryMode && slides.length > 1 && (
    <ul className="mt-6 space-y-1">
      {slides.map((s, i) => (
        <li key={`${s.title}-${i}`}>
          <button
            type="button"
            onClick={() => setIdx(i)}
            className={`w-full rounded-xl px-4 py-3 text-left transition ${
              i === idx
                ? variant === "dark"
                  ? "bg-white/10 ring-1 ring-white/20"
                  : "bg-white shadow-soft ring-1 ring-brand/15"
                : variant === "dark"
                  ? "hover:bg-white/5"
                  : "hover:bg-white/60"
            }`}
          >
            <p
              className={`text-sm font-bold ${i === idx ? titleColor : variant === "dark" ? "text-white/80" : "text-brand-dark/80"}`}
            >
              {s.title}
            </p>
            {i === idx && (
              <p className={`mt-1 text-xs leading-relaxed ${textMuted}`}>{s.description}</p>
            )}
          </button>
        </li>
      ))}
    </ul>
  );

  const thumbStrip = galleryMode && slides.length > 1 && (
    <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {slides.map((s, i) => (
        <button
          key={`thumb-${s.image}-${i}`}
          type="button"
          onClick={() => setIdx(i)}
          className={`relative size-16 shrink-0 overflow-hidden rounded-lg border-2 transition sm:size-20 ${
            i === idx
              ? "border-brand ring-2 ring-brand/25"
              : "border-transparent opacity-70 hover:opacity-100"
          }`}
        >
          <img src={s.image} alt="" className="h-full w-full object-cover bg-white p-0.5" />
        </button>
      ))}
    </div>
  );

  const textPanel = (
    <div className="flex flex-col justify-center lg:w-[44%] lg:shrink-0 lg:py-8">
      {eyebrow && (
        <p className="text-[11px] font-bold tracking-[0.2em] text-brand uppercase">{eyebrow}</p>
      )}
      {(sectionTitle || (galleryMode && slide.title)) && (
        <h3 className={`mt-2 ${vfSectionHeadingLeft} lg:leading-tight ${titleColor}`}>
          {sectionTitle ?? slide.title}
        </h3>
      )}
      {(lead || (galleryMode && slide.description)) && (
        <p className={`mt-4 text-sm leading-relaxed sm:text-[15px] ${textMuted}`}>
          {lead ?? slide.description}
        </p>
      )}
      {!galleryMode && !featureList && (
        <>
          <h3 className={`mt-4 ${vfSlideTitle} ${titleColor}`}>{slide.title}</h3>
          <p className={`mt-3 text-sm leading-relaxed ${textMuted}`}>{slide.description}</p>
        </>
      )}
      {featureList}
      {thumbStrip}
    </div>
  );

  return (
    <div className={`overflow-hidden rounded-3xl ${bg}`}>
      <div
        className={`flex flex-col gap-6 p-5 sm:p-8 lg:gap-0 lg:p-0 ${
          imageSide === "left" ? "lg:flex-row-reverse" : "lg:flex-row"
        }`}
      >
        <div className="lg:flex lg:flex-1 lg:items-stretch">{imagePanel}</div>
        <div className="lg:flex lg:w-[44%] lg:shrink-0 lg:items-center lg:px-10 lg:py-12 xl:px-14">
          {textPanel}
        </div>
      </div>
    </div>
  );
}
