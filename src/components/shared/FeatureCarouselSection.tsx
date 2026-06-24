"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";

import type { VinFastHomeSlide } from "@/lib/vinfast-home";

export type FeatureCarouselSlide = VinFastHomeSlide & {
  description?: string;
};

const carouselNavBtn =
  "flex items-center justify-center rounded-full border border-slate-200/80 bg-white/70 text-slate-500 shadow-sm transition hover:border-brand/30 hover:bg-white hover:text-brand active:scale-95";
const carouselNavBtnSize = `${carouselNavBtn} h-8 w-8 md:h-9 md:w-9`;

const featureCopy = "relative z-10 w-full min-w-0";
const featureTitle =
  "text-2xl font-black tracking-tight text-brand-dark sm:text-3xl lg:text-2xl lg:leading-tight xl:text-[1.75rem] 2xl:text-4xl";
const featureSubtitle = "mt-2 text-sm text-muted-foreground lg:mt-1.5 xl:text-[15px]";
const featureDescription = "mt-3 max-w-lg text-xs leading-relaxed text-muted-foreground md:text-sm";
const featureSpecGrid =
  "mt-6 grid grid-cols-2 gap-x-4 gap-y-5 sm:gap-x-8 sm:gap-y-6 lg:mt-5 lg:gap-x-6 lg:gap-y-4 xl:mt-6 xl:grid-cols-4 xl:gap-x-8 2xl:mt-7 2xl:gap-x-10";
const featureActions = "mt-6 grid grid-cols-2 gap-2 sm:gap-3 lg:mt-5 xl:mt-6 2xl:mt-8";
const featurePanel =
  "relative flex flex-col justify-center px-5 py-8 sm:px-8 lg:absolute lg:inset-y-0 lg:w-1/2 lg:px-10 lg:py-0 xl:px-16";
const featureBtn =
  "w-full rounded-md px-2.5 py-2 text-center text-[10px] font-semibold tracking-wide transition active:scale-[0.98] sm:px-4 sm:text-[11px] lg:px-3.5 lg:py-1.5 lg:text-[10px] xl:px-4 xl:py-2 xl:text-[11px] 2xl:px-5 2xl:py-2.5 2xl:text-[12px]";

const LIST_PRICE_LABEL = "Giá niêm yết";
const LIST_PRICE_NOTE = "(Chưa bao gồm khuyến mãi hàng tháng)";

function isListPriceSpec(label: string, value: string) {
  return /giá\s*(bán\s*)?từ/i.test(label) || /VNĐ/i.test(value);
}

export function FeatureCarouselSection({
  slides,
  imageSide,
  imageAspect,
}: {
  slides: FeatureCarouselSlide[];
  imageSide: "left" | "right";
  imageAspect: "2544/1500" | "2/1";
}) {
  const [idx, setIdx] = useState(0);

  const goPrev = () => setIdx((i) => (i - 1 + slides.length) % slides.length);
  const goNext = () => setIdx((i) => (i + 1) % slides.length);

  const aspectClass =
    imageAspect === "2544/1500" ? "aspect-[2544/1500] w-full" : "aspect-[2/1] w-full";
  const imageWrapClass = `relative ${aspectClass} overflow-hidden bg-[#f4f6fa] ${
    imageSide === "left" ? "lg:w-1/2" : "lg:ml-auto lg:w-1/2"
  }`;

  const textPanelClass =
    imageSide === "left" ? `${featurePanel} lg:right-0` : `${featurePanel} lg:left-0`;
  const imageFadeEdge =
    imageSide === "left"
      ? "pointer-events-none absolute inset-y-0 right-0 z-[1] hidden w-28 bg-gradient-to-r from-transparent via-[#f8f9fc]/70 to-[#f8f9fc] lg:block lg:w-40 xl:w-52"
      : "pointer-events-none absolute inset-y-0 left-0 z-[1] hidden w-28 bg-gradient-to-l from-transparent via-[#f8f9fc]/70 to-[#f8f9fc] lg:block lg:w-40 xl:w-52";
  const textFadeEdge =
    imageSide === "left"
      ? "pointer-events-none absolute inset-y-0 left-0 z-[1] hidden w-16 bg-gradient-to-l from-transparent to-[#f8f9fc]/80 lg:block lg:w-24 xl:w-32"
      : "pointer-events-none absolute inset-y-0 right-0 z-[1] hidden w-16 bg-gradient-to-r from-transparent to-[#f8f9fc]/80 lg:block lg:w-24 xl:w-32";
  const featureImageInset = "absolute inset-5 sm:inset-7 md:inset-8 lg:inset-10 xl:inset-12";
  const defaultImageClass = `h-full w-full object-contain ${
    imageSide === "left" ? "object-left" : "object-right"
  }`;

  return (
    <section className="relative w-full overflow-hidden bg-white">
      <div className="relative w-full bg-gradient-to-br from-[#f4f6fa] via-[#f8f9fc] to-white">
        <div className="relative z-10">
          <div className={imageWrapClass}>
            {slides.map((s, i) => (
              <div
                key={`img-${s.image}`}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  i === idx ? "z-[1] opacity-100" : "pointer-events-none opacity-0"
                }`}
                aria-hidden={i !== idx}
              >
                <div className={featureImageInset}>
                  <img
                    src={s.image}
                    alt={s.imageAlt}
                    className={s.imageClass ?? defaultImageClass}
                  />
                </div>
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-10 bg-gradient-to-t from-[#f8f9fc] to-transparent lg:hidden"
                />
                <div aria-hidden className={imageFadeEdge} />
              </div>
            ))}
            {slides.length > 1 && <CarouselArrows onImage onPrev={goPrev} onNext={goNext} />}
          </div>

          <div className="relative grid lg:absolute lg:inset-0">
            {slides.map((s, i) => (
              <div
                key={`text-${s.title}`}
                className={`col-start-1 row-start-1 transition-opacity duration-700 lg:absolute lg:inset-0 ${
                  i === idx ? "z-[1] opacity-100" : "pointer-events-none opacity-0"
                }`}
                aria-hidden={i !== idx}
              >
                <div className={textPanelClass}>
                  <div aria-hidden className={textFadeEdge} />
                  <div className={featureCopy}>
                    <h2 className={featureTitle}>{s.title}</h2>
                    {s.subtitle && <p className={featureSubtitle}>{s.subtitle}</p>}
                    {s.description && <p className={featureDescription}>{s.description}</p>}
                    <div className={featureSpecGrid}>
                      {s.specs.map((spec) => {
                        const listPrice = isListPriceSpec(spec.label, spec.value);
                        return (
                          <FeatureSpec
                            key={`${spec.value}-${spec.label}`}
                            feature
                            className={
                              listPrice && s.specs.length <= 3
                                ? "col-span-2 xl:col-span-2"
                                : undefined
                            }
                            icon={
                              spec.seats ? (
                                <Users className="size-4 shrink-0 text-brand lg:size-3.5 xl:size-4" />
                              ) : undefined
                            }
                            value={spec.value}
                            label={spec.label}
                            highlight={spec.highlight}
                          />
                        );
                      })}
                    </div>
                    <div className={featureActions}>
                      {(() => {
                        const depositFirst = s.primaryCta === "ĐẶT CỌC";
                        const primaryHref = depositFirst ? (s.detailHref ?? s.href) : s.href;
                        const secondaryHref = depositFirst ? s.href : (s.detailHref ?? s.href);

                        return (
                          <>
                            <FeatureCta href={primaryHref} variant="primary" feature>
                              {s.primaryCta}
                            </FeatureCta>
                            <FeatureCta href={secondaryHref} variant="outline" feature>
                              {s.secondaryCta}
                            </FeatureCta>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
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
  const listPrice = isListPriceSpec(label, value);
  const displayLabel = listPrice ? LIST_PRICE_LABEL : label;

  return (
    <div className={feature ? `min-w-0 ${className ?? ""}` : className}>
      <div
        className={`flex min-w-0 items-baseline gap-1 font-bold ${highlight || listPrice ? "text-brand" : "text-brand-dark"}`}
      >
        {icon && <span className="text-brand">{icon}</span>}
        <span
          className={
            feature
              ? dense
                ? `text-sm tracking-tight sm:text-base lg:text-xs lg:leading-tight xl:text-sm 2xl:text-lg ${highlight || listPrice ? "whitespace-nowrap" : "break-words"}`
                : `text-sm tracking-tight sm:text-base lg:text-sm lg:leading-snug xl:text-base 2xl:text-lg ${highlight || listPrice ? "whitespace-nowrap" : "break-words"}`
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
        {displayLabel}
      </p>
      {listPrice && (
        <p className="mt-0.5 whitespace-nowrap text-[10px] leading-snug text-muted-foreground/80">
          {LIST_PRICE_NOTE}
        </p>
      )}
    </div>
  );
}

function FeatureCta({
  href,
  variant,
  feature,
  children,
}: {
  href?: string;
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
}: {
  onImage?: boolean;
  onPrev: () => void;
  onNext: () => void;
}) {
  const pos = onImage ? "left-2 sm:left-3" : "left-2 lg:left-3";
  const posR = onImage ? "right-2 sm:right-3" : "right-2 lg:right-3";

  return (
    <>
      <button
        type="button"
        onClick={onPrev}
        className={`absolute top-1/2 z-20 -translate-y-1/2 ${carouselNavBtnSize} ${pos}`}
        aria-label="Slide trước"
      >
        <ChevronLeft size={18} strokeWidth={1.75} />
      </button>
      <button
        type="button"
        onClick={onNext}
        className={`absolute top-1/2 z-20 -translate-y-1/2 ${carouselNavBtnSize} ${posR}`}
        aria-label="Slide sau"
      >
        <ChevronRight size={18} strokeWidth={1.75} />
      </button>
    </>
  );
}
