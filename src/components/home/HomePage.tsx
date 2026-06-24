"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Check, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import FloatingButtons from "@/components/site/FloatingButtons";
import { AccessoryProductCard } from "@/components/accessories/AccessoryProductCard";
import {
  CatalogGrid,
  CatalogGridItem,
  FadeIn,
  RevealImage,
  StaggerGrid,
  StaggerItem,
} from "@/components/motion";
import { ACCESSORIES } from "@/lib/accessories";
import { HERO_BANNERS, IMAGES } from "@/lib/images";
import { springSnappy } from "@/lib/motion";
import { FeatureCarouselSection, FeatureSpec } from "@/components/shared/FeatureCarouselSection";
import { ShowroomBookingModal } from "@/components/shared/ShowroomBookingModal";
import type { VinFastHomeSlide } from "@/lib/vinfast-home";
import { VINFAST_FEATURED_CARS, VINFAST_FEATURED_SCOOTERS } from "@/lib/vinfast-home";
import { Toaster } from "sonner";

const featureCopy = "relative z-10 w-full min-w-0";
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

const SCOOTER_BOOKING_SERVICES = [
  "Đặt mua ngay",
  "Đăng ký lái thử",
  "Nhận báo giá",
  "Tư vấn trả góp",
];

export default function HomePage() {
  const [bookingSlide, setBookingSlide] = useState<VinFastHomeSlide | null>(null);
  const [bookingKind, setBookingKind] = useState<"car" | "scooter">("car");

  const openDepositModal = (slide: VinFastHomeSlide, kind: "car" | "scooter") => {
    setBookingKind(kind);
    setBookingSlide(slide);
  };

  return (
    <div className="min-h-screen bg-white">
      <Toaster position="top-center" richColors />
      <Header />
      <main>
        <h1 className="sr-only">VF Ngọc Anh — Đại lý ủy quyền chính thức VinFast Cà Mau</h1>
        <Hero />
        <FeaturedVehicle onDeposit={(slide) => openDepositModal(slide, "car")} />
        <ScooterSection onDeposit={(slide) => openDepositModal(slide, "scooter")} />
        <Accessories />
        <ChargingEcosystem />
        <WarrantyService />
        <BrandStory />
        <ShowroomCommunity />
        <Newsletter />
      </main>
      <Footer />
      <FloatingButtons />
      <ShowroomBookingModal
        open={bookingSlide !== null}
        onClose={() => setBookingSlide(null)}
        vehicleName={bookingSlide?.title ?? ""}
        vehicleImage={bookingSlide?.image ?? ""}
        service={bookingKind === "scooter" ? "Đặt mua ngay" : "Đặt cọc ngay"}
        serviceOptions={bookingKind === "scooter" ? SCOOTER_BOOKING_SERVICES : undefined}
      />
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
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === idx ? "z-[1] opacity-100" : "pointer-events-none opacity-0"
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
        <button
          type="button"
          onClick={() => setIdx((i) => (i - 1 + HERO_BANNERS.length) % HERO_BANNERS.length)}
          className={`absolute top-1/2 left-3 z-10 -translate-y-1/2 md:left-5 ${carouselNavBtnSize}`}
          aria-label="Previous"
        >
          <ChevronLeft size={18} strokeWidth={1.75} />
        </button>
        <button
          type="button"
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
              type="button"
              onClick={() => setIdx(i)}
              className="p-1"
              aria-label={`Slide ${i + 1}`}
            >
              <span
                className={`block h-1.5 rounded-full transition-all duration-300 ${
                  i === idx ? "w-6 bg-brand" : "w-1.5 bg-slate-300"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedVehicle({ onDeposit }: { onDeposit: (slide: VinFastHomeSlide) => void }) {
  return (
    <FeatureCarouselSection
      slides={VINFAST_FEATURED_CARS}
      imageSide="left"
      imageAspect="2544/1500"
      onPrimaryClick={onDeposit}
    />
  );
}

function ScooterSection({ onDeposit }: { onDeposit: (slide: VinFastHomeSlide) => void }) {
  return (
    <FeatureCarouselSection
      slides={VINFAST_FEATURED_SCOOTERS}
      imageSide="right"
      imageAspect="2544/1500"
      onPrimaryClick={onDeposit}
    />
  );
}

const HOME_FEATURED_ACCESSORY_IDS = [
  "vinfastvf3scalecarmodels",
  "eep30000011",
  "eep71061000",
  "acs20000013",
] as const;

const HOME_FEATURED_ACCESSORIES = HOME_FEATURED_ACCESSORY_IDS.map(
  (id) => ACCESSORIES.find((product) => product.id === id)!,
).filter(Boolean);

function SectionHeader({ title, viewAllHref }: { title: string; viewAllHref?: string }) {
  return (
    <FadeIn
      blur
      className="relative mb-8 flex flex-col items-center gap-3 sm:mb-10 lg:min-h-10 lg:justify-center"
    >
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
    </FadeIn>
  );
}

function Accessories() {
  return (
    <section className="section-y bg-white">
      <div className="container-vf">
        <SectionHeader title="PHỤ KIỆN CHÍNH HÃNG" viewAllHref="/phu-kien" />
        <CatalogGrid className="grid grid-cols-2 items-stretch gap-3 sm:gap-6 lg:grid-cols-4">
          {HOME_FEATURED_ACCESSORIES.map((product, index) => (
            <CatalogGridItem key={product.id} index={index}>
              <AccessoryProductCard product={product} />
            </CatalogGridItem>
          ))}
        </CatalogGrid>
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
    <motion.a
      href={href}
      whileHover={{ y: -5, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={springSnappy}
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
    </motion.a>
  );
}

function ChargingEcosystem() {
  const [leftTiles, portableTile] = [CHARGING_TILES.slice(0, 2), CHARGING_TILES[2]];

  return (
    <section className="section-y bg-white">
      <div className="container-vf">
        <SectionHeader title="PIN & TRẠM SẠC" />

        <div className="grid gap-4 lg:grid-cols-2 lg:items-stretch lg:gap-5">
          <StaggerGrid className="flex flex-col gap-4 lg:gap-5">
            {leftTiles.map((item) => (
              <StaggerItem key={item.title}>
                <ChargingCard {...item} />
              </StaggerItem>
            ))}
          </StaggerGrid>

          <FadeIn
            direction="right"
            className="relative min-h-[320px] sm:min-h-[360px] lg:min-h-0 lg:h-full"
          >
            <ChargingCard {...portableTile} />
          </FadeIn>
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
            <FadeIn direction="left" className={`${featureCopy} lg:overflow-hidden`}>
              <h2 className={warrantyTitle}>Bảo hành & Dịch vụ</h2>
              <p className={warrantySubtitle}>
                VinFast đã đầu tư nghiêm túc và bài bản để phát triển hệ thống Showroom, Nhà phân
                phối và xưởng dịch vụ rộng khắp, đáp ứng tối đa nhu cầu của Khách hàng.
              </p>
              <div className={warrantySpecGrid}>
                <FeatureSpec feature dense value="63+" label="Tỉnh thành" />
                <FeatureSpec feature dense value="Toàn quốc" label="Phủ sóng dịch vụ" />
                <FeatureSpec feature dense value="Chính hãng" label="Phụ tùng & bảo dưỡng" />
                <FeatureSpec feature dense value="24/7" label="Hỗ trợ khách hàng" highlight />
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
            </FadeIn>
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
        <RevealImage className="relative min-h-[480px] rounded-xl shadow-card sm:min-h-[500px] lg:h-[560px]">
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
        </RevealImage>
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
      <StaggerGrid className="container-vf grid gap-4 sm:grid-cols-2 sm:gap-5">
        {cards.map((card) => (
          <StaggerItem key={card.title}>
            <motion.a
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
              whileHover={{ y: -5, scale: 1.01 }}
              transition={springSnappy}
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
            </motion.a>
          </StaggerItem>
        ))}
      </StaggerGrid>
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
        <FadeIn blur className="mx-auto max-w-[668px] text-center">
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
        </FadeIn>
      </div>
    </section>
  );
}
