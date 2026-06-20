"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, Users, Check, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import FloatingButtons from "@/components/site/FloatingButtons";
import { IMAGES } from "@/lib/images";

const HERO_SLIDES = [IMAGES.heroBanner, IMAGES.heroBanner, IMAGES.heroBanner];

const featureCopy = "relative z-10 w-full min-w-0";
const featureTitle =
  "text-2xl font-black tracking-tight text-brand-dark sm:text-3xl md:text-xl md:leading-tight lg:text-2xl xl:text-[1.75rem] 2xl:text-4xl";
const featureSubtitle =
  "mt-2 text-sm text-muted-foreground md:mt-1 md:text-xs lg:mt-1.5 lg:text-sm xl:text-[15px]";
const featureSpecGrid =
  "mt-6 grid grid-cols-2 gap-x-4 gap-y-5 sm:gap-x-8 sm:gap-y-6 md:mt-3 md:gap-x-3 md:gap-y-2.5 lg:mt-5 lg:gap-x-6 lg:gap-y-4 xl:mt-6 xl:grid-cols-4 xl:gap-x-8 2xl:mt-7 2xl:gap-x-10";
const featureActions = "mt-6 flex flex-wrap gap-2 sm:gap-3 md:mt-3 lg:mt-5 xl:mt-6 2xl:mt-8";
const featurePanel =
  "relative flex flex-col justify-center px-5 py-8 sm:px-8 md:absolute md:inset-y-0 md:w-1/2 md:px-8 md:py-0 lg:px-12 xl:px-16";

const warrantyTitle =
  "text-2xl font-black tracking-tight text-brand-dark sm:text-3xl md:text-lg md:leading-tight lg:text-xl xl:text-2xl 2xl:text-4xl";
const warrantySubtitle =
  "mt-2 text-sm leading-relaxed text-muted-foreground md:mt-0.5 md:text-[9px] md:leading-[1.35] md:line-clamp-2 lg:mt-1.5 lg:line-clamp-none lg:text-xs lg:leading-relaxed xl:text-sm 2xl:text-[15px]";
const warrantySpecGrid =
  "mt-5 grid grid-cols-2 gap-x-3 gap-y-3 sm:mt-6 sm:gap-x-6 sm:gap-y-4 md:mt-2 md:gap-x-2 md:gap-y-1 lg:mt-4 lg:gap-x-4 lg:gap-y-2.5 xl:mt-5 xl:grid-cols-4 xl:gap-x-6 2xl:mt-6 2xl:gap-x-8";
const warrantyActions =
  "mt-5 flex flex-wrap gap-2 sm:mt-6 sm:gap-3 md:mt-2 lg:mt-4 xl:mt-5 2xl:mt-7";
const warrantyBtn =
  "rounded-md px-4 py-2 text-[11px] font-semibold tracking-wide transition active:scale-[0.98] md:px-2.5 md:py-1 md:text-[9px] lg:px-3.5 lg:py-1.5 lg:text-[10px] xl:px-4 xl:py-2 xl:text-[11px] 2xl:px-5 2xl:py-2.5 2xl:text-[12px]";

const sectionHeading =
  "text-center text-lg font-black leading-tight tracking-tight text-balance text-brand-dark sm:text-xl sm:leading-tight md:text-2xl md:leading-tight lg:text-[1.75rem] xl:text-3xl";

type FeatureSlideSpec = {
  value: string;
  label: string;
  highlight?: boolean;
  seats?: boolean;
};

type FeatureSlide = {
  title: string;
  subtitle?: string;
  image: string;
  imageAlt: string;
  imageClass: string;
  specs: FeatureSlideSpec[];
  primaryCta: string;
  secondaryCta: string;
};

const FEATURED_VEHICLE_SLIDES: FeatureSlide[] = [
  {
    title: "VF MPV 7",
    subtitle: "Không gian rộng rãi - Công nghệ đột phá",
    image: IMAGES.vfMpv7,
    imageAlt: "VF MPV 7",
    imageClass: "h-full w-full object-contain object-left",
    specs: [
      { value: "7", label: "chỗ ngồi", seats: true },
      { value: "535 km", label: "Quãng đường (WLTP)" },
      { value: "460 Nm", label: "Mô-men xoắn" },
      { value: "704.342.000 VND", label: "Giá bán từ", highlight: true },
    ],
    primaryCta: "KHÁM PHÁ NGAY",
    secondaryCta: "ĐẶT LỊCH LÁI THỬ",
  },
  {
    title: "VinFast VF 9",
    subtitle: "SUV điện cao cấp - An toàn vượt trội",
    image: IMAGES.vf9Suv,
    imageAlt: "VinFast VF 9",
    imageClass: "h-full w-full object-contain object-right",
    specs: [
      { value: "7", label: "chỗ ngồi", seats: true },
      { value: "540 km", label: "Quãng đường (WLTP)" },
      { value: "620 Nm", label: "Mô-men xoắn" },
      { value: "1.169.000.000 VND", label: "Giá bán từ", highlight: true },
    ],
    primaryCta: "KHÁM PHÁ NGAY",
    secondaryCta: "ĐẶT LỊCH LÁI THỬ",
  },
];

const SCOOTER_SLIDES: FeatureSlide[] = [
  {
    title: "Di chuyển xanh - Phong cách mới",
    image: IMAGES.evoScooter,
    imageAlt: "EVO scooter",
    imageClass: "absolute inset-0 h-full w-full object-cover object-right",
    specs: [
      { value: "45 km", label: "Quãng đường" },
      { value: "70 km/h", label: "Vận tốc tối đa" },
      { value: "Cốp 22L", label: "Dung tích" },
      { value: "18.135.000 VND", label: "Giá từ", highlight: true },
    ],
    primaryCta: "MUA NGAY",
    secondaryCta: "XEM CHI TIẾT",
  },
  {
    title: "Herio Green",
    subtitle: "Xe điện thông minh - Di chuyển bền vững",
    image: IMAGES.chargingScooter,
    imageAlt: "Giải pháp sạc xe máy điện",
    imageClass: "absolute inset-0 h-full w-full object-cover object-right",
    specs: [
      { value: "59 km", label: "Quãng đường" },
      { value: "45 km/h", label: "Vận tốc tối đa" },
      { value: "Cốp 18L", label: "Dung tích" },
      { value: "22.500.000 VND", label: "Giá từ", highlight: true },
    ],
    primaryCta: "MUA NGAY",
    secondaryCta: "XEM CHI TIẾT",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
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

function Hero() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % HERO_SLIDES.length), 5500);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-white">
      <div className="relative w-full aspect-[1842/854] min-h-[180px] sm:min-h-[220px]">
        {HERO_SLIDES.map((src, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-700 ${i === idx ? "opacity-100" : "opacity-0"}`}
          >
            <img src={src} alt="VinFast promotion" className="h-full w-full object-contain" />
          </div>
        ))}
        <button
          onClick={() => setIdx((i) => (i - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
          className="absolute top-1/2 left-3 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-brand-dark shadow-md backdrop-blur hover:bg-white md:left-5"
          aria-label="Previous"
        >
          <ChevronLeft size={22} />
        </button>
        <button
          onClick={() => setIdx((i) => (i + 1) % HERO_SLIDES.length)}
          className="absolute top-1/2 right-3 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-brand-dark shadow-md backdrop-blur hover:bg-white md:right-5"
          aria-label="Next"
        >
          <ChevronRight size={22} />
        </button>
        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2 md:bottom-5">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`h-2 rounded-full transition-all ${i === idx ? "w-6 bg-white" : "w-2 bg-white/50"}`}
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
  imageAspect: "1835/857" | "2/1";
}) {
  const [idx, setIdx] = useState(0);
  const prev = () => setIdx((i) => (i - 1 + slides.length) % slides.length);
  const next = () => setIdx((i) => (i + 1) % slides.length);

  const aspectClass = imageAspect === "1835/857" ? "aspect-[1835/857]" : "aspect-[2/1]";
  const imageWrapClass = `relative ${aspectClass} w-full overflow-hidden bg-[#f4f6fa] ${
    imageSide === "left" ? "md:w-1/2" : "md:ml-auto md:w-1/2"
  }`;

  const textPanelClass =
    imageSide === "left" ? `${featurePanel} md:right-0` : `${featurePanel} md:left-0`;
  const imageFadeEdge =
    imageSide === "left"
      ? "pointer-events-none absolute inset-y-0 right-0 z-[1] hidden w-28 bg-gradient-to-r from-transparent via-[#f8f9fc]/70 to-[#f8f9fc] md:block md:w-40 lg:w-52"
      : "pointer-events-none absolute inset-y-0 left-0 z-[1] hidden w-28 bg-gradient-to-l from-transparent via-[#f8f9fc]/70 to-[#f8f9fc] md:block md:w-40 lg:w-52";
  const textFadeEdge =
    imageSide === "left"
      ? "pointer-events-none absolute inset-y-0 left-0 z-[1] hidden w-16 bg-gradient-to-l from-transparent to-[#f8f9fc]/80 md:block md:w-24 lg:w-32"
      : "pointer-events-none absolute inset-y-0 right-0 z-[1] hidden w-16 bg-gradient-to-r from-transparent to-[#f8f9fc]/80 md:block md:w-24 lg:w-32";

  return (
    <section className="relative w-full overflow-hidden bg-white">
      <div className="relative w-full bg-gradient-to-br from-[#f4f6fa] via-[#f8f9fc] to-white">
        {slides.length > 1 && <CarouselArrows edge onPrev={prev} onNext={next} />}

        <div className="relative z-10">
          {slides.map((slide, i) => (
            <div
              key={slide.title}
              className={`transition-opacity duration-500 ${
                i === idx
                  ? "relative opacity-100"
                  : "pointer-events-none absolute inset-0 opacity-0"
              }`}
              aria-hidden={i !== idx}
            >
              <div className={imageWrapClass}>
                <img src={slide.image} alt={slide.imageAlt} className={slide.imageClass} />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-10 bg-gradient-to-t from-[#f8f9fc] to-transparent md:hidden"
                />
                <div aria-hidden className={imageFadeEdge} />
              </div>

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
                            <Users className="size-4 shrink-0 text-brand md:size-3.5 lg:size-4" />
                          ) : undefined
                        }
                        value={spec.value}
                        label={spec.label}
                        highlight={spec.highlight}
                      />
                    ))}
                  </div>
                  <div className={featureActions}>
                    <PrimaryBtn feature>{slide.primaryCta}</PrimaryBtn>
                    <OutlineBtn feature>{slide.secondaryCta}</OutlineBtn>
                  </div>
                </div>
              </div>
            </div>
          ))}
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
      imageAspect="1835/857"
    />
  );
}

function ScooterSection() {
  return <FeatureCarouselSection slides={SCOOTER_SLIDES} imageSide="right" imageAspect="2/1" />;
}

const ACCESSORIES = [
  { img: IMAGES.accModel, name: "Mô hình xe VinFast VF 3", price: "220.000 VND" },
  { img: IMAGES.accCharger, name: "Bộ sạc treo tường 7,4kW", price: "11.900.000 VND" },
  { img: IMAGES.accMat, name: "Thảm lót sàn All-in-One", price: "1.490.000 VND" },
  { img: IMAGES.accUmbrella, name: "Ô che nắng", price: "400.000 VND" },
];

function SectionHeader({ title, viewAllHref }: { title: string; viewAllHref?: string }) {
  return (
    <div className="relative mb-8 flex flex-col items-center gap-3 sm:mb-10 md:min-h-10 md:justify-center">
      <h2 className={`${sectionHeading} w-full px-2 sm:px-4 md:px-20 lg:px-24`}>{title}</h2>
      {viewAllHref ? (
        <Link
          href={viewAllHref}
          className="shrink-0 text-xs font-semibold text-brand hover:underline sm:text-sm md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2"
        >
          Xem tất cả
        </Link>
      ) : (
        <a
          href="#"
          className="shrink-0 text-xs font-semibold text-brand hover:underline sm:text-sm md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2"
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
        <div className="grid grid-cols-2 gap-4 md:gap-5 lg:grid-cols-4">
          {ACCESSORIES.map((a) => (
            <div
              key={a.name}
              className="group rounded-xl border border-border/50 bg-white p-3.5 transition hover:-translate-y-0.5 hover:shadow-card md:p-4"
            >
              <div className="flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-[#f5f6f9]">
                <img
                  src={a.img}
                  alt={a.name}
                  className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <h3 className="mt-3 line-clamp-2 min-h-[38px] text-[13px] font-medium leading-snug text-foreground/90">
                {a.name}
              </h3>
              <p className="mt-1 text-sm font-bold text-brand">{a.price}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const CHARGING_TILES = [
  {
    img: IMAGES.chargingStations,
    title: "Hệ thống trạm sạc toàn quốc",
    sub: "Phủ sóng 63 tỉnh thành",
    href: "/pin-va-tram-sac",
  },
  {
    img: IMAGES.chargingScooter,
    title: "Giải pháp di chuyển xanh",
    sub: "An toàn - Tiện lợi - Thông minh",
    href: "/pin-va-tram-sac",
  },
] as const;

function ChargingEcosystem() {
  return (
    <section className="section-y bg-white">
      <div className="container-vf">
        <SectionHeader title="PIN & TRẠM SẠC" />

        <div className="grid gap-4 lg:grid-cols-2 lg:gap-5">
          <div className="flex flex-col gap-4 lg:gap-5">
            {CHARGING_TILES.map((item) => (
              <a
                key={item.title}
                href={item.href}
                className="group relative block overflow-hidden rounded-xl shadow-soft transition hover:-translate-y-0.5 hover:shadow-card"
              >
                <div className="relative aspect-[21/9] w-full bg-[#e8ecf2] sm:aspect-[2.2/1]">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/5" />
                  <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5">
                    <h3 className="text-base font-bold md:text-lg">{item.title}</h3>
                    <p className="mt-0.5 text-xs opacity-90 sm:text-sm">{item.sub}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>

          <div className="flex flex-col overflow-hidden rounded-xl border border-border/60 bg-gradient-to-br from-[#f0f3f8] via-[#f6f8fb] to-white shadow-soft lg:min-h-full">
            <div className="relative z-10 p-6 md:p-8 lg:p-10">
              <h3 className="text-xl font-bold text-brand-dark md:text-2xl">
                Thiết bị sạc di động
              </h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground md:text-[15px]">
                Nhỏ gọn, dễ dàng mang theo, phù hợp cho mọi hành trình. Sạc nhanh - An toàn - Thông
                minh.
              </p>
              <a
                href="/pin-va-tram-sac#san-pham-sac"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition hover:gap-2"
              >
                XEM CHI TIẾT <ArrowRight size={14} />
              </a>
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 -bottom-px h-14 bg-gradient-to-b from-transparent via-[#f6f8fb]/60 to-[#f6f8fb]"
              />
            </div>
            <div className="relative min-h-[240px] flex-1 overflow-hidden bg-[#eef1f6] sm:min-h-[280px] lg:min-h-[320px]">
              <img
                src={IMAGES.portableCharger}
                alt="Portable charger"
                className="absolute inset-0 h-full w-full object-cover object-center transition duration-500 hover:scale-105"
                loading="lazy"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-20 bg-gradient-to-b from-[#f6f8fb] via-[#f6f8fb]/70 to-transparent"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-10 bg-gradient-to-r from-[#f0f3f8]/90 to-transparent sm:w-14"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-10 bg-gradient-to-l from-white/80 to-transparent sm:w-14"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-12 bg-gradient-to-t from-[#eef1f6] to-transparent"
              />
            </div>
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
          <div className="relative aspect-[1835/857] w-full overflow-hidden bg-[#f4f6fa] md:ml-auto md:w-1/2">
            <img
              src={IMAGES.vf9Suv}
              alt="VinFast VF 9"
              className="h-full w-full object-contain object-right"
              loading="lazy"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-10 bg-gradient-to-t from-[#f8f9fc] to-transparent md:hidden"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 z-[1] hidden w-28 bg-gradient-to-l from-transparent via-[#f8f9fc]/70 to-[#f8f9fc] md:block md:w-40 lg:w-52"
            />
          </div>

          <div className={`${featurePanel} md:left-0 md:px-6 lg:px-10 xl:px-14`}>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 z-[1] hidden w-16 bg-gradient-to-r from-transparent to-[#f8f9fc]/80 md:block md:w-24 lg:w-32"
            />
            <div className={`${featureCopy} md:overflow-hidden`}>
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
                  className={`${warrantyBtn} inline-flex bg-brand text-white shadow-sm hover:bg-[#0046cc]`}
                >
                  ĐẶT LỊCH BẢO DƯỠNG
                </a>
                <a
                  href="https://vinfastauto.com/vn_vi/dich-vu-hau-mai/bao-hanh-va-bao-duong"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${warrantyBtn} inline-flex border border-brand bg-white text-brand hover:bg-brand/5`}
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
    <section className="bg-white py-16 md:py-20 lg:py-24">
      <div className="container-vf">
        <div className="relative min-h-[360px] overflow-hidden rounded-xl shadow-card sm:min-h-[400px] md:h-[400px] lg:h-[420px]">
          <img
            src={IMAGES.brandStory}
            alt="Brand story"
            className="absolute inset-0 h-full w-full object-contain object-center md:object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/55" />
          <div className="absolute inset-0 grid items-center gap-8 px-6 py-8 sm:px-8 sm:py-10 md:grid-cols-2 md:gap-12 md:px-12 md:py-12 lg:gap-14 lg:px-14">
            <div className="text-white">
              <p className="text-2xl leading-[1.2] font-black italic md:text-3xl lg:text-4xl">
                MÃNH LIỆT
                <br />
                TINH THẦN
                <br />
                <span className="text-[#FF2A2A]">Việt Nam</span>
              </p>
            </div>
            <div className="text-white">
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
              <button className="mt-6 rounded-md bg-brand px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#0046cc] md:mt-8">
                TÌM HIỂU THÊM
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ShowroomCommunity() {
  return (
    <section className="bg-white pb-20">
      <div className="container-vf grid gap-4 md:grid-cols-2 md:gap-5">
        {[
          {
            img: IMAGES.showroom,
            title: "Showroom VF Ngọc Anh",
            sub: "Trải nghiệm thực tế các dòng xe VinFast",
          },
          {
            img: IMAGES.community,
            title: "Cộng đồng VinFast Toàn cầu",
            sub: "Kết nối - Chia sẻ - Lan tỏa giá trị",
          },
        ].map((c) => (
          <div
            key={c.title}
            className="group relative h-[220px] overflow-hidden rounded-xl shadow-soft sm:h-[240px] md:h-[260px]"
          >
            <img
              src={c.img}
              alt={c.title}
              className="absolute inset-0 h-full w-full object-cover object-center transition duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white md:bottom-5 md:left-5">
              <h3 className="text-base font-bold md:text-lg">{c.title}</h3>
              <p className="mt-0.5 text-xs opacity-90">{c.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");

  return (
    <section className="bg-brand-dark">
      <div className="container-vf py-14 text-center text-white md:py-16 lg:py-20">
        <h2 className="text-2xl font-black tracking-tight md:text-[1.75rem]">
          Đăng ký nhận thông tin
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-white/85">
          Nhận ngay những thông tin mới nhất từ VinFast Ngọc Anh
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setEmail("");
          }}
          className="mx-auto mt-7 flex max-w-lg overflow-hidden rounded-md bg-white p-1 shadow-lg"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email của bạn"
            className="flex-1 bg-transparent px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            className="shrink-0 rounded-sm bg-brand px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0046cc]"
          >
            GỬI
          </button>
        </form>
        <p className="mt-3 text-[11px] text-white/70">
          Cam kết bảo mật thông tin. Có thể hủy nhận tin bất kỳ lúc nào.
        </p>
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
                ? "break-words text-sm tracking-tight sm:text-base md:text-[10px] md:leading-tight lg:text-xs xl:text-sm 2xl:text-lg"
                : "break-words text-sm tracking-tight sm:text-base md:text-xs md:leading-snug lg:text-sm xl:text-base 2xl:text-lg"
              : "text-base tracking-tight md:text-lg"
          }
        >
          {value}
        </span>
      </div>
      <p
        className={
          feature
            ? dense
              ? "mt-0.5 text-[10px] leading-snug text-muted-foreground md:text-[8px] md:leading-tight lg:text-[9px] xl:text-[10px] 2xl:text-[11px]"
              : "mt-0.5 text-[10px] leading-snug text-muted-foreground md:text-[9px] lg:text-[10px] xl:text-[11px]"
            : "mt-0.5 text-[11px] text-muted-foreground"
        }
      >
        {label}
      </p>
    </div>
  );
}

const featureBtn =
  "rounded-md px-4 py-2 text-[11px] font-semibold tracking-wide transition active:scale-[0.98] md:px-3 md:py-1.5 md:text-[10px] lg:px-4 lg:py-2 lg:text-[11px] xl:px-5 xl:py-2.5 xl:text-[12px]";

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
  onPrev,
  onNext,
}: {
  edge?: boolean;
  onPrev: () => void;
  onNext: () => void;
}) {
  const pos = edge ? "left-3 md:left-6 lg:left-10" : "left-2 md:left-3";
  const posR = edge ? "right-3 md:right-6 lg:right-10" : "right-2 md:right-3";

  return (
    <>
      <button
        type="button"
        onClick={onPrev}
        className={`absolute top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-brand-dark shadow-md transition hover:text-brand ${pos}`}
        aria-label="Slide trước"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        type="button"
        onClick={onNext}
        className={`absolute top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-brand-dark shadow-md transition hover:text-brand ${posR}`}
        aria-label="Slide sau"
      >
        <ChevronRight size={18} />
      </button>
    </>
  );
}
