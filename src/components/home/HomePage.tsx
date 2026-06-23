"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Users, Check, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import FloatingButtons from "@/components/site/FloatingButtons";
import { AccessoryProductCard } from "@/components/accessories/AccessoryProductCard";
import { ACCESSORIES } from "@/lib/accessories";
import { HERO_BANNERS, IMAGES } from "@/lib/images";
import {
  VINFAST_FEATURED_CARS,
  VINFAST_FEATURED_SCOOTERS,
  type VinFastHomeSlide,
} from "@/lib/vinfast-home";

const featureCopy = "relative z-10 w-full min-w-0";
const featureTitle =
  "text-2xl font-black tracking-tight text-brand-dark sm:text-3xl lg:text-2xl lg:leading-tight xl:text-[1.75rem] 2xl:text-4xl";
const featureSubtitle = "mt-2 text-sm text-muted-foreground lg:mt-1.5 xl:text-[15px]";
const featureSpecGrid =
  "mt-6 grid grid-cols-2 gap-x-4 gap-y-5 sm:gap-x-8 sm:gap-y-6 lg:mt-5 lg:gap-x-6 lg:gap-y-4 xl:mt-6 xl:grid-cols-4 xl:gap-x-8 2xl:mt-7 2xl:gap-x-10";
const featureActions = "mt-6 grid grid-cols-2 gap-2 sm:gap-3 lg:mt-5 xl:mt-6 2xl:mt-8";
const featurePanel =
  "relative flex flex-col justify-center px-5 py-8 sm:px-8 lg:absolute lg:inset-y-0 lg:w-1/2 lg:px-10 lg:py-0 xl:px-16";

const warrantyTitle =
  "text-2xl font-black tracking-tight text-brand-dark sm:text-3xl lg:text-xl lg:leading-tight xl:text-2xl 2xl:text-4xl";
const warrantySubtitle =
  "mt-2 text-sm leading-relaxed text-muted-foreground lg:mt-1.5 lg:text-xs lg:leading-relaxed xl:text-sm 2xl:text-[15px]";
const warrantySpecGrid =
  "mt-5 grid grid-cols-2 gap-x-3 gap-y-3 sm:mt-6 sm:gap-x-6 sm:gap-y-4 lg:mt-4 lg:gap-x-4 lg:gap-y-2.5 xl:mt-5 xl:grid-cols-4 xl:gap-x-6 2xl:mt-6 2xl:gap-x-8";
const warrantyActions = "mt-5 grid grid-cols-2 gap-2 sm:mt-6 sm:gap-3 lg:mt-4 xl:mt-5 2xl:mt-7";
const warrantyPanel =
  "relative flex flex-col justify-center px-5 py-8 sm:px-8 lg:w-1/2 lg:px-10 lg:py-10 xl:px-14 xl:py-12";
const warrantyBtn =
  "w-full rounded-md px-2.5 py-2 text-center text-[10px] font-semibold tracking-wide transition active:scale-[0.98] sm:px-4 sm:text-[11px] lg:px-3.5 lg:py-1.5 lg:text-[10px] xl:px-4 xl:py-2 xl:text-[11px] 2xl:px-5 2xl:py-2.5 2xl:text-[12px]";

const sectionHeading =
  "text-center text-lg font-black leading-tight tracking-tight text-balance text-brand-dark sm:text-xl sm:leading-tight md:text-2xl md:leading-tight lg:text-[1.75rem] xl:text-3xl";

type FeatureSlide = VinFastHomeSlide;

const FEATURED_VEHICLE_SLIDES: FeatureSlide[] = VINFAST_FEATURED_CARS;
const SCOOTER_SLIDES: FeatureSlide[] = VINFAST_FEATURED_SCOOTERS;

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <h1 className="sr-only">VF Ngọc Anh — Đại lý ủy quyền chính thức VinFast Cà Mau</h1>
        <Hero />
        <FeaturedVehicle />
        <ScooterSection />
        <Accessories />
        <ChargingEcosystem />
        <WarrantyService />
        <BrandStory />
        <ShowroomCommunity />
        <Newsletter />
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  );
}

const carouselNavBtn =
  "flex items-center justify-center rounded-full border border-slate-200/80 bg-white/70 text-slate-500 shadow-sm transition hover:border-brand/30 hover:bg-white hover:text-brand active:scale-95";
const carouselNavBtnSize = `${carouselNavBtn} h-8 w-8 md:h-9 md:w-9`;

function Hero() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % HERO_BANNERS.length), 5500);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-white">
      <div className="relative w-full aspect-[5/8] lg:aspect-video">
        {HERO_BANNERS.map((slide, i) => (
          <div
            key={slide.desktop}
            className={`absolute inset-0 transition-opacity duration-700 ${i === idx ? "opacity-100" : "opacity-0"}`}
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
        <button
          onClick={() => setIdx((i) => (i - 1 + HERO_BANNERS.length) % HERO_BANNERS.length)}
          className={`absolute top-1/2 left-3 z-10 -translate-y-1/2 md:left-5 ${carouselNavBtnSize}`}
          aria-label="Previous"
        >
          <ChevronLeft size={18} strokeWidth={1.75} />
        </button>
        <button
          onClick={() => setIdx((i) => (i + 1) % HERO_BANNERS.length)}
          className={`absolute top-1/2 right-3 z-10 -translate-y-1/2 md:right-5 ${carouselNavBtnSize}`}
          aria-label="Next"
        >
          <ChevronRight size={18} strokeWidth={1.75} />
        </button>
        <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 md:bottom-4">
          {HERO_BANNERS.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === idx ? "w-5 bg-brand" : "w-1.5 bg-slate-300"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCarouselSection({
  slides,
  imageSide,
  imageAspect,
}: {
  slides: FeatureSlide[];
  imageSide: "left" | "right";
  imageAspect: "2544/1500" | "2/1";
}) {
  const [idx, setIdx] = useState(0);
  const prev = () => setIdx((i) => (i - 1 + slides.length) % slides.length);
  const next = () => setIdx((i) => (i + 1) % slides.length);

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
  const featureImageClass = `h-full w-full object-contain ${
    imageSide === "left" ? "object-left" : "object-right"
  }`;

  return (
    <section className="relative w-full overflow-hidden bg-white">
      <div className="relative w-full bg-gradient-to-br from-[#f4f6fa] via-[#f8f9fc] to-white">
        <div className="relative z-10">
          <div className={imageWrapClass}>
            {slides.map((slide, i) => (
              <div
                key={`${slide.title}-image`}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  i === idx ? "z-[1] opacity-100" : "pointer-events-none opacity-0"
                }`}
                aria-hidden={i !== idx}
              >
                <div className={featureImageInset}>
                  <img src={slide.image} alt={slide.imageAlt} className={featureImageClass} />
                </div>
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-10 bg-gradient-to-t from-[#f8f9fc] to-transparent lg:hidden"
                />
                <div aria-hidden className={imageFadeEdge} />
              </div>
            ))}
            {slides.length > 1 && <CarouselArrows onImage onPrev={prev} onNext={next} />}
          </div>

          <div className="relative grid lg:absolute lg:inset-0">
            {slides.map((slide, i) => (
              <div
                key={slide.title}
                className={`col-start-1 row-start-1 transition-opacity duration-500 lg:absolute lg:inset-0 ${
                  i === idx ? "z-[1] opacity-100" : "pointer-events-none z-0 opacity-0"
                }`}
                aria-hidden={i !== idx}
              >
                <div className={textPanelClass}>
                  <div aria-hidden className={textFadeEdge} />
                  <div className={featureCopy}>
                    <h2 className={featureTitle}>{slide.title}</h2>
                    {slide.subtitle && <p className={featureSubtitle}>{slide.subtitle}</p>}
                    <div className={featureSpecGrid}>
                      {slide.specs.map((spec) => (
                        <Spec
                          key={`${spec.value}-${spec.label}`}
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
                      ))}
                    </div>
                    <div className={featureActions}>
                      <FeatureCta href={slide.href} variant="primary" feature>
                        {slide.primaryCta}
                      </FeatureCta>
                      <FeatureCta href={slide.detailHref ?? slide.href} variant="outline" feature>
                        {slide.secondaryCta}
                      </FeatureCta>
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

function FeaturedVehicle() {
  return (
    <FeatureCarouselSection
      slides={FEATURED_VEHICLE_SLIDES}
      imageSide="left"
      imageAspect="2544/1500"
    />
  );
}

function ScooterSection() {
  return (
    <FeatureCarouselSection slides={SCOOTER_SLIDES} imageSide="right" imageAspect="2544/1500" />
  );
}

const HOME_FEATURED_ACCESSORY_IDS = [
  "mo-hinh-vf3",
  "bo-sac-treo-tuong",
  "vf7-tam-che-pin-cao-ap",
  "o-golf-2-tang",
] as const;

const HOME_FEATURED_ACCESSORIES = HOME_FEATURED_ACCESSORY_IDS.map(
  (id) => ACCESSORIES.find((product) => product.id === id)!,
).filter(Boolean);

function SectionHeader({ title, viewAllHref }: { title: string; viewAllHref?: string }) {
  return (
    <div className="relative mb-8 flex flex-col items-center gap-3 sm:mb-10 lg:min-h-10 lg:justify-center">
      <h2 className={`${sectionHeading} w-full px-2 sm:px-4 lg:px-20 xl:px-24`}>{title}</h2>
      {viewAllHref ? (
        <Link
          href={viewAllHref}
          className="shrink-0 text-xs font-semibold text-brand hover:underline sm:text-sm lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2"
        >
          Xem tất cả
        </Link>
      ) : (
        <a
          href="#"
          className="shrink-0 text-xs font-semibold text-brand hover:underline sm:text-sm lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2"
        >
          Xem tất cả
        </a>
      )}
    </div>
  );
}

function Accessories() {
  return (
    <section className="section-y bg-white">
      <div className="container-vf">
        <SectionHeader title="PHỤ KIỆN CHÍNH HÃNG" viewAllHref="/phu-kien" />
        <div className="grid grid-cols-2 items-stretch gap-3 sm:gap-6 lg:grid-cols-4">
          {HOME_FEATURED_ACCESSORIES.map((product) => (
            <AccessoryProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

const CHARGING_DESC =
  "Với phương châm luôn đặt lợi ích Khách hàng lên hàng đầu, VinFast áp dụng chính sách cho thuê pin độc đáo, ưu việt và khác biệt với tất cả các mô hình cho thuê pin từ trước tới nay trên thế giới.";

const CHARGING_TILES = [
  {
    img: IMAGES.chargingStations,
    title: "Pin & Trạm sạc ô tô điện",
    desc: CHARGING_DESC,
    href: "/pin-va-tram-sac",
    aspect: "aspect-[21/9] sm:aspect-[2.2/1]",
    theme: "dark",
  },
  {
    img: IMAGES.chargingScooter,
    title: "Pin & Trạm sạc xe máy điện",
    desc: CHARGING_DESC,
    href: "/pin-va-tram-sac",
    aspect: "aspect-[21/9] sm:aspect-[2.2/1]",
    theme: "dark",
  },
  {
    img: IMAGES.portableCharger,
    title: "Thiết bị sạc di động",
    desc: "VinFast cung cấp đa dạng giải pháp sạc để đáp ứng nhu cầu sử dụng của khách hàng một cách thuận tiện nhất.",
    href: "/pin-va-tram-sac#san-pham-sac",
    aspect: "min-h-[320px] h-full sm:min-h-[360px] lg:min-h-full",
    theme: "light",
  },
] as const;

const chargingOverlayDark =
  "absolute inset-x-0 bottom-0 w-full translate-y-[65%] bg-[linear-gradient(359deg,#000_0.54%,rgba(0,0,0,0)_98.5%)] p-[30px] text-white transition-transform duration-500 ease-in-out group-hover:translate-y-0";

const chargingOverlayLight =
  "absolute inset-x-0 bottom-0 w-full translate-y-[65%] bg-[linear-gradient(359deg,#f7f9f9_0.54%,rgba(247,249,249,0)_98.5%)] p-[30px] text-[#3c3c3c] transition-transform duration-500 ease-in-out group-hover:translate-y-0";

function ChargingCard({
  img,
  title,
  desc,
  href,
  aspect,
  theme = "dark",
}: (typeof CHARGING_TILES)[number]) {
  const overlay = theme === "light" ? chargingOverlayLight : chargingOverlayDark;
  const fillHeight = aspect.includes("min-h");

  return (
    <a
      href={href}
      className={`group relative block overflow-hidden rounded-xl shadow-soft transition hover:shadow-card ${
        fillHeight ? "h-full" : ""
      }`}
    >
      <div className={`relative w-full overflow-hidden bg-[#e8ecf2] ${aspect}`}>
        <img
          src={img}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover object-center transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className={overlay}>
          <h3 className="text-base font-bold md:text-lg">{title}</h3>
          <p className="pt-4 text-xs leading-relaxed opacity-90 sm:text-sm">{desc}</p>
          <span
            className={`mt-0 block pt-4 text-xs font-bold uppercase tracking-[0.075em] ${
              theme === "light" ? "text-brand" : ""
            }`}
          >
            Xem chi tiết
          </span>
        </div>
      </div>
    </a>
  );
}

function ChargingEcosystem() {
  const [leftTiles, portableTile] = [CHARGING_TILES.slice(0, 2), CHARGING_TILES[2]];

  return (
    <section className="section-y bg-white">
      <div className="container-vf">
        <SectionHeader title="PIN & TRẠM SẠC" />

        <div className="grid gap-4 lg:grid-cols-2 lg:items-stretch lg:gap-5">
          <div className="flex flex-col gap-4 lg:gap-5">
            {leftTiles.map((item) => (
              <ChargingCard key={item.title} {...item} />
            ))}
          </div>

          <div className="relative min-h-[320px] sm:min-h-[360px] lg:min-h-0 lg:h-full">
            <ChargingCard {...portableTile} />
          </div>
        </div>
      </div>
    </section>
  );
}

function WarrantyService() {
  return (
    <section id="block-service" className="relative w-full overflow-hidden bg-white">
      <div className="relative w-full bg-gradient-to-br from-[#f4f6fa] via-[#f8f9fc] to-white">
        <div className="relative z-10">
          <div className="relative aspect-[2544/1065] w-full overflow-hidden bg-[#f4f6fa] lg:absolute lg:inset-y-0 lg:right-0 lg:aspect-auto lg:w-1/2">
            <img
              src={IMAGES.warrantyService}
              alt="Bảo hành và dịch vụ VinFast"
              className="h-full w-full object-cover object-right"
              loading="lazy"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-10 bg-gradient-to-t from-[#f8f9fc] to-transparent lg:hidden"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 z-[1] hidden w-28 bg-gradient-to-l from-transparent via-[#f8f9fc]/70 to-[#f8f9fc] lg:block lg:w-40 xl:w-52"
            />
          </div>

          <div className={warrantyPanel}>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 z-[1] hidden w-16 bg-gradient-to-r from-transparent to-[#f8f9fc]/80 lg:block lg:w-24 xl:w-32"
            />
            <div className={`${featureCopy} lg:overflow-hidden`}>
              <h2 className={warrantyTitle}>Bảo hành & Dịch vụ</h2>
              <p className={warrantySubtitle}>
                VinFast đã đầu tư nghiêm túc và bài bản để phát triển hệ thống Showroom, Nhà phân
                phối và xưởng dịch vụ rộng khắp, đáp ứng tối đa nhu cầu của Khách hàng.
              </p>
              <div className={warrantySpecGrid}>
                <Spec feature dense value="63+" label="Tỉnh thành" />
                <Spec feature dense value="Toàn quốc" label="Phủ sóng dịch vụ" />
                <Spec feature dense value="Chính hãng" label="Phụ tùng & bảo dưỡng" />
                <Spec feature dense value="24/7" label="Hỗ trợ khách hàng" highlight />
              </div>
              <div className={warrantyActions}>
                <a
                  href="https://vinfastauto.com/vn_vi/dat-lich-dich-vu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${warrantyBtn} bg-brand text-white shadow-sm hover:bg-[#0046cc]`}
                >
                  ĐẶT LỊCH BẢO DƯỠNG
                </a>
                <a
                  href="https://vinfastauto.com/vn_vi/dich-vu-hau-mai/bao-hanh-va-bao-duong"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${warrantyBtn} border border-brand bg-white text-brand hover:bg-brand/5`}
                >
                  CHÍNH SÁCH
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BrandStory() {
  return (
    <section className="bg-white py-12 sm:py-16 lg:py-24">
      <div className="container-vf">
        <div className="relative min-h-[480px] overflow-hidden rounded-xl shadow-card sm:min-h-[500px] lg:h-[560px]">
          <img
            src={IMAGES.brandStory}
            alt="VinFast - Vì một Việt Nam mạnh mẽ"
            className="absolute inset-0 h-full w-full object-cover object-center"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-[linear-gradient(270deg,rgba(22,22,0,0.8)_8.43%,rgba(22,22,0,0)_100%)]" />
          <div className="absolute inset-0 flex items-center px-5 py-8 sm:px-8 sm:py-10 lg:px-14 lg:py-12">
            <div className="ml-auto max-w-xl text-white lg:max-w-md xl:max-w-lg">
              <h3 className="text-lg font-bold md:text-xl">VinFast - Vì một Việt Nam mạnh mẽ</h3>
              <p className="mt-2 text-sm opacity-90 md:mt-2.5">Tự hào thương hiệu Việt</p>
              <ul className="mt-5 space-y-3 text-sm md:mt-6 md:space-y-3.5">
                {[
                  "Công nghệ đẳng cấp thế giới",
                  "Sản xuất tại Việt Nam - Chuỗi giá trị nội địa",
                  "Vì tương lai xanh - Bền vững",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2.5">
                    <Check size={16} className="mt-0.5 shrink-0 text-[#FFD500]" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex justify-center md:mt-8">
                <button className="rounded-md bg-brand px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#0046cc]">
                  TÌM HIỂU THÊM
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const aftersalesOverlay =
  "absolute inset-x-0 bottom-0 translate-y-[40%] bg-[linear-gradient(359deg,#000_0.54%,rgba(0,0,0,0)_98.5%)] p-[30px] text-white transition-transform duration-500 ease-in-out group-hover:translate-y-0";

function ShowroomCommunity() {
  const cards = [
    {
      img: IMAGES.showroom,
      title: "Showroom & Trạm sạc",
      cta: "TÌM HIỂU THÊM",
      href: "https://vinfastauto.com/vn_vi/tim-kiem-showroom-tram-sac",
      external: true,
    },
    {
      img: IMAGES.community,
      title: "Cộng đồng VinFast Toàn cầu",
      cta: "TÌM HIỂU THÊM",
      href: "https://vinfast.vn",
      external: true,
      nofollow: true,
    },
  ] as const;

  return (
    <section className="bg-white pb-12 sm:pb-16 lg:pb-20">
      <div className="container-vf grid gap-4 sm:grid-cols-2 sm:gap-5">
        {cards.map((card) => (
          <a
            key={card.title}
            href={card.href}
            {...(card.external
              ? {
                  target: "_blank",
                  rel:
                    "nofollow" in card && card.nofollow
                      ? "nofollow noopener noreferrer"
                      : "noopener noreferrer",
                }
              : {})}
            className="group relative block h-[280px] overflow-hidden rounded-xl shadow-soft sm:h-[320px] md:h-[354px]"
          >
            <img
              src={card.img}
              alt={card.title}
              className="absolute inset-0 h-full w-full object-cover object-center transition duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className={aftersalesOverlay}>
              <h3 className="text-base font-bold md:text-lg">{card.title}</h3>
              <span className="mt-4 inline-block text-xs font-bold uppercase tracking-[0.075em]">
                {card.cta}
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");

  return (
    <section
      id="block-join-the-charge"
      className="mt-16 bg-cover bg-center bg-no-repeat py-24 md:mt-24 md:bg-[position:-112px_50%]"
      style={{ backgroundImage: `url(${IMAGES.newsletterBg})` }}
    >
      <div className="container-vf">
        <div className="mx-auto max-w-[668px] text-center">
          <p className="text-2xl font-semibold leading-9 text-white">Đăng ký nhận thông tin</p>
          <p className="mt-4 text-lg leading-[27px] text-white">
            Đăng ký nhận thông tin chương trình khuyến mãi, dịch vụ VinFast.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setEmail("");
            }}
            className="mt-4"
          >
            <div className="relative rounded-[3px] bg-white md:h-12">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn"
                className="block h-12 w-full bg-white px-4 text-base font-semibold text-[#495057] outline-none placeholder:font-normal placeholder:text-[#495057]/70 md:pr-[200px]"
              />
              <button
                type="submit"
                className="mt-2.5 h-12 w-full bg-[#1464f4] text-xs font-bold leading-[15px] text-white transition hover:bg-[#1258d9] md:absolute md:right-0 md:top-1/2 md:mt-0 md:w-[200px] md:-translate-y-1/2"
              >
                Đăng ký
              </button>
            </div>
          </form>
          <p className="mt-4 text-xs leading-[18px] text-white">
            Bằng cách đăng ký, Quý khách xác nhận đã đọc, hiểu và đồng ý với{" "}
            <a
              href="https://vinfastauto.com/vn_vi/dieu-khoan-phap-ly"
              target="_blank"
              rel="noopener noreferrer"
              className="whitespace-nowrap hover:underline"
            >
              Chính sách Quyền riêng tư
            </a>{" "}
            của VinFast.
          </p>
        </div>
      </div>
    </section>
  );
}

function Spec({
  icon,
  value,
  label,
  highlight,
  feature,
  dense,
}: {
  icon?: React.ReactNode;
  value: string;
  label: string;
  highlight?: boolean;
  feature?: boolean;
  dense?: boolean;
}) {
  return (
    <div className={feature ? "min-w-0" : undefined}>
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

const featureBtn =
  "w-full rounded-md px-2.5 py-2 text-center text-[10px] font-semibold tracking-wide transition active:scale-[0.98] sm:px-4 sm:text-[11px] lg:px-3.5 lg:py-1.5 lg:text-[10px] xl:px-4 xl:py-2 xl:text-[11px] 2xl:px-5 2xl:py-2.5 2xl:text-[12px]";

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
    return <button className={className}>{children}</button>;
  }

  const isExternal = href.startsWith("http");
  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
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

function PrimaryBtn({ children, feature }: { children: React.ReactNode; feature?: boolean }) {
  return (
    <button
      className={
        feature
          ? `${featureBtn} bg-brand text-white shadow-sm hover:bg-[#0046cc]`
          : "rounded-md bg-brand px-5 py-2.5 text-[12px] font-semibold tracking-wide text-white shadow-sm transition hover:bg-[#0046cc] active:scale-[0.98]"
      }
    >
      {children}
    </button>
  );
}

function OutlineBtn({ children, feature }: { children: React.ReactNode; feature?: boolean }) {
  return (
    <button
      className={
        feature
          ? `${featureBtn} border border-brand bg-white text-brand hover:bg-brand/5`
          : "rounded-md border border-brand bg-white px-5 py-2.5 text-[12px] font-semibold tracking-wide text-brand transition hover:bg-brand/5 active:scale-[0.98]"
      }
    >
      {children}
    </button>
  );
}

function CarouselArrows({
  edge,
  onImage,
  onPrev,
  onNext,
}: {
  edge?: boolean;
  onImage?: boolean;
  onPrev: () => void;
  onNext: () => void;
}) {
  const pos = onImage
    ? "left-2 sm:left-3"
    : edge
      ? "left-3 lg:left-6 xl:left-10"
      : "left-2 lg:left-3";
  const posR = onImage
    ? "right-2 sm:right-3"
    : edge
      ? "right-3 lg:right-6 xl:right-10"
      : "right-2 lg:right-3";

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
