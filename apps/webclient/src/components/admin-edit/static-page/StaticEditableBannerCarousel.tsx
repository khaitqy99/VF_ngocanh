"use client";

import { ChevronLeft, ChevronRight, GripVertical, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import {
  HeroBannerHeightSpacer,
  HeroBannerSlideImages,
} from "@/components/shared/HeroBannerSlideMedia";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { HeroBannerSlide } from "@/lib/images";
import { homeHeroDot, homeHeroDotTransition, homeHeroSlide, homeNavBtn } from "@/lib/home-motion";
import { MOTION_INSTANT, MOTION_VISIBLE } from "@/lib/motion-safe";
import { moveListItem } from "@/components/admin-edit/home/HomeEditListControls";
import { useStaticPageAdminEdit } from "@/components/admin-edit/static-page/StaticPageAdminEditContext";
import { StaticEditableText } from "@/components/admin-edit/static-page/StaticEditableText";
import { staticEditSectionClass } from "@/components/admin-edit/static-page/static-edit-section";

const carouselNavBtnSize = "glass-nav h-9 w-9 md:h-10 md:w-10";

function mapBannerToSlide(banner: {
  desktop: string;
  mobile: string;
  alt: string;
}): HeroBannerSlide {
  return {
    desktop: banner.desktop,
    mobile: banner.mobile || banner.desktop,
    alt: banner.alt,
  };
}

export function StaticEditableBannerCarousel({ banners }: { banners: HeroBannerSlide[] }) {
  const edit = useStaticPageAdminEdit();
  const reduced = useReducedMotion();
  const [idx, setIdx] = useState(0);
  const [direction, setDirection] = useState(0);
  const [dragBannerIndex, setDragBannerIndex] = useState<number | null>(null);
  const [dragBannerOver, setDragBannerOver] = useState<number | null>(null);

  const editableBanners = edit?.editMode
    ? edit.draft.banners.map(mapBannerToSlide)
    : banners.filter((slide) => slide.desktop);
  const HERO_BANNERS = edit?.editMode ? editableBanners : editableBanners;
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
    if (reduced || edit?.editMode) return;
    if (HERO_BANNERS.length <= 1) return;
    const t = setInterval(() => {
      setIdx((current) => {
        setDirection(1);
        return (current + 1) % HERO_BANNERS.length;
      });
    }, 5500);
    return () => clearInterval(t);
  }, [reduced, edit?.editMode, HERO_BANNERS.length]);

  useEffect(() => {
    if (idx >= HERO_BANNERS.length) {
      setIdx(Math.max(0, HERO_BANNERS.length - 1));
    }
  }, [idx, HERO_BANNERS.length]);

  const slideTotal = String(Math.max(HERO_BANNERS.length, 1)).padStart(2, "0");
  const slideCurrent = String(Math.min(idx + 1, Math.max(HERO_BANNERS.length, 1))).padStart(2, "0");

  if (!HERO_BANNERS.length) {
    if (!edit?.editMode) return null;
    return (
      <section
        className={`relative w-full overflow-hidden bg-brand-dark ${staticEditSectionClass()}`}
      >
        <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 p-8 text-center text-white">
          <p className="text-sm font-semibold text-white/80">
            Chưa có banner — thêm slide đầu tiên
          </p>
          <button
            type="button"
            onClick={() => {
              edit.setBanners([{ desktop: "", mobile: "", alt: "", sortOrder: 0 }]);
              setIdx(0);
            }}
            className="inline-flex items-center gap-1 rounded-md border border-white/30 bg-white/10 px-3 py-2 text-xs font-bold text-white"
          >
            <Plus className="h-3.5 w-3.5" />
            Thêm banner
          </button>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`relative w-full overflow-hidden bg-brand-dark ${edit?.editMode ? staticEditSectionClass() : ""}`}
    >
      {edit?.editMode ? (
        <div className="absolute inset-x-0 top-0 z-30 border-b border-white/15 bg-brand-dark/80 px-4 py-2 text-center text-[11px] font-medium text-white backdrop-blur-sm">
          Đang chỉnh banner {slideCurrent}/{slideTotal} — carousel tạm dừng, dùng{" "}
          <span className="font-bold text-accent-yellow">mũi tên</span> hoặc{" "}
          <span className="font-bold text-accent-yellow">chấm tròn</span> bên dưới để chọn slide
        </div>
      ) : null}
      <div className="relative w-full">
        {activeSlide && (activeSlide.desktop || edit?.editMode) ? (
          edit?.editMode && !edit.draft.banners[idx]?.desktop ? (
            <div className="min-h-[220px] w-full bg-slate-800" aria-hidden />
          ) : (
            <HeroBannerHeightSpacer slide={activeSlide} />
          )
        ) : null}

        <div className="absolute inset-0 overflow-hidden">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            {HERO_BANNERS.map(
              (slide, i) =>
                i === idx && (
                  <motion.div
                    key={`${slide.desktop}-${i}`}
                    custom={direction}
                    variants={
                      reduced
                        ? { enter: MOTION_VISIBLE, center: MOTION_VISIBLE, exit: MOTION_VISIBLE }
                        : homeHeroSlide
                    }
                    initial={reduced ? false : "enter"}
                    animate="center"
                    exit={reduced ? undefined : "exit"}
                    transition={reduced ? MOTION_INSTANT : undefined}
                    className="absolute inset-0"
                  >
                    {edit?.editMode && !edit.draft.banners[i]?.desktop ? (
                      <div className="absolute inset-0 flex min-h-[220px] items-center justify-center bg-slate-800 text-center text-sm font-semibold text-white/70">
                        Chưa có ảnh banner — bấm &quot;Đổi ảnh desktop&quot; bên dưới
                      </div>
                    ) : (
                      <HeroBannerSlideImages slide={slide} priority={i === 0} variant="cover" />
                    )}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(11,31,91,0.35)_0%,transparent_28%,transparent_62%,rgba(11,31,91,0.55)_100%)]"
                    />
                    {edit?.editMode && edit.draft.banners[idx] ? (
                      <div className="absolute inset-x-0 bottom-0 z-20 space-y-2 bg-gradient-to-t from-brand-dark/90 via-brand-dark/70 to-transparent p-4 pt-10 sm:p-6">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => edit.requestImage(`banners.${idx}.desktop`)}
                            className="rounded bg-brand px-2 py-1 text-[10px] font-bold text-white hover:bg-[#0046cc]"
                          >
                            Đổi ảnh desktop
                          </button>
                          <button
                            type="button"
                            onClick={() => edit.requestImage(`banners.${idx}.mobile`)}
                            className="rounded bg-brand px-2 py-1 text-[10px] font-bold text-white hover:bg-[#0046cc]"
                          >
                            Đổi ảnh mobile
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const nextBanners = [
                                ...edit.draft.banners,
                                {
                                  desktop: "",
                                  mobile: "",
                                  alt: "",
                                  sortOrder: edit.draft.banners.length,
                                },
                              ];
                              edit.setBanners(nextBanners);
                              setIdx(nextBanners.length - 1);
                            }}
                            className="inline-flex items-center gap-1 rounded-md border border-white/30 bg-white/10 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-sm"
                          >
                            <Plus className="h-3 w-3" />
                            Thêm banner
                          </button>
                          {edit.draft.banners.length > 1 ? (
                            <button
                              type="button"
                              onClick={() => {
                                const nextBanners = edit.draft.banners.filter(
                                  (_, bannerIndex) => bannerIndex !== idx,
                                );
                                edit.setBanners(nextBanners);
                                setIdx((current) =>
                                  Math.min(current, Math.max(0, nextBanners.length - 1)),
                                );
                              }}
                              className="inline-flex items-center gap-1 rounded-md border border-red-300/50 bg-red-500/20 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-sm"
                            >
                              <Trash2 className="h-3 w-3" />
                              Xóa banner
                            </button>
                          ) : null}
                        </div>
                        <StaticEditableText
                          value={edit.draft.banners[idx]?.alt ?? ""}
                          onChange={(alt) => edit.updateBanner(idx, { alt })}
                          className="text-xs text-white/90"
                          label="Mô tả ảnh (alt)"
                        />
                      </div>
                    ) : null}
                  </motion.div>
                ),
            )}
          </AnimatePresence>
        </div>

        {HERO_BANNERS.length > 1 ? (
          <>
            <motion.button
              type="button"
              onClick={goPrev}
              initial="rest"
              whileHover={reduced ? undefined : "hover"}
              whileTap={reduced ? undefined : "tap"}
              variants={homeNavBtn}
              className={`absolute top-1/2 left-3 ${edit?.editMode ? "z-40" : "z-10"} -translate-y-1/2 md:left-5 ${carouselNavBtnSize}`}
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
              className={`absolute top-1/2 right-3 ${edit?.editMode ? "z-40" : "z-10"} -translate-y-1/2 md:right-5 ${carouselNavBtnSize}`}
              aria-label="Banner sau"
            >
              <ChevronRight size={18} strokeWidth={1.75} />
            </motion.button>
          </>
        ) : null}

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

        {HERO_BANNERS.length > 1 ? (
          <div
            className={`absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 md:bottom-5 ${edit?.editMode ? "z-40" : "z-10"}`}
          >
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
        ) : null}
      </div>

      {edit?.editMode && edit.draft.banners.length > 1 ? (
        <div className="border-t border-white/10 bg-brand-dark px-4 py-3">
          <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-wide text-white/70">
            Kéo thả để sắp xếp thứ tự banner
          </p>
          <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-2">
            {edit.draft.banners.map((banner, bannerIndex) => (
              <button
                key={`${banner.id ?? banner.desktop}-${bannerIndex}`}
                type="button"
                draggable
                onClick={() => goTo(bannerIndex)}
                onDragStart={() => setDragBannerIndex(bannerIndex)}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragBannerOver(bannerIndex);
                }}
                onDragEnd={() => {
                  if (
                    dragBannerIndex != null &&
                    dragBannerOver != null &&
                    dragBannerIndex !== dragBannerOver
                  ) {
                    const next = moveListItem(edit.draft.banners, dragBannerIndex, dragBannerOver);
                    edit.setBanners(next);
                    setIdx(dragBannerOver);
                  }
                  setDragBannerIndex(null);
                  setDragBannerOver(null);
                }}
                className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[10px] font-semibold text-white ${
                  idx === bannerIndex
                    ? "border-accent-yellow bg-white/15"
                    : "border-white/20 bg-white/5"
                }`}
              >
                <GripVertical className="size-3 opacity-70" />
                {bannerIndex + 1}. {banner.alt.slice(0, 24) || "Banner"}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
