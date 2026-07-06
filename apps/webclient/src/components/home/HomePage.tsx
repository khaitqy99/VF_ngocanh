"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

import Header from "@/components/site/Header";
import FaqSection from "@/components/site/FaqSection";
import ShowroomLocationSection from "@/components/site/ShowroomLocationSection";
import FloatingButtons from "@/components/site/FloatingButtons";
import { type DealershipContact } from "@/lib/dealership";
import { AccessoryProductCard } from "@/components/accessories/AccessoryProductCard";
import { CatalogGrid, CatalogGridItem, FadeIn, StaggerItem } from "@/components/motion";
import { MotionButton, MotionLinkButton } from "@/components/motion/MotionButton";
import type { AccessoryProduct } from "@/lib/accessories";
import { IMAGES, type HeroBannerSlide } from "@/lib/images";
import {
  homeBrandClip,
  homeBrandLine,
  homeNewsletterBlock,
  homeNewsletterChild,
  homeViewport,
} from "@/lib/home-motion";
import { FeatureCarouselSection, FeatureSpec } from "@/components/shared/FeatureCarouselSection";
import { ShowroomBookingModal } from "@/components/shared/ShowroomBookingModal";
import type { VinFastHomeSlide } from "@/lib/vinfast-home";
import { vfCardTitle, vfSectionHeadingLeft, vfSlideTitle } from "@/lib/typography";
import { useSectionReveal } from "@/hooks/use-section-reveal";
import { Toaster } from "sonner";

import { HomeHero } from "./HomeHero";
import { HomeOverlayCard } from "./HomeOverlayCard";
import { HomeSectionHeader } from "./HomeSectionHeader";

const featureCopy = "relative z-10 w-full min-w-0";
const warrantyTitle = vfSectionHeadingLeft;
const warrantySubtitle =
  "mt-2 text-sm leading-relaxed text-muted-foreground lg:mt-1.5 lg:text-xs lg:leading-relaxed xl:text-sm 2xl:text-[15px]";
const warrantySpecGrid =
  "mt-5 grid grid-cols-2 gap-x-3 gap-y-3 sm:mt-6 sm:gap-x-6 sm:gap-y-4 lg:mt-4 lg:gap-x-4 lg:gap-y-2.5 xl:mt-5 xl:grid-cols-4 xl:gap-x-6 2xl:mt-6 2xl:gap-x-8";
const warrantyActions = "mt-5 grid grid-cols-2 gap-2 sm:mt-6 sm:gap-3 lg:mt-4 xl:mt-5 2xl:mt-7";
const warrantyPanel =
  "relative flex flex-col justify-center px-5 py-8 sm:px-8 lg:w-1/2 lg:px-10 lg:py-10 xl:px-14 xl:py-12";
const warrantyBtn =
  "w-full rounded-md px-2.5 py-2 text-center text-[10px] font-semibold tracking-wide transition active:scale-[0.98] sm:px-4 sm:text-[11px] lg:px-3.5 lg:py-1.5 lg:text-[10px] xl:px-4 xl:py-2 xl:text-[11px] 2xl:px-5 2xl:py-2.5 2xl:text-[12px]";

const SCOOTER_BOOKING_SERVICES = [
  "Đặt mua ngay",
  "Đăng ký lái thử",
  "Nhận báo giá",
  "Tư vấn trả góp",
];

export default function HomePage({
  heroBanners,
  featuredCars,
  featuredScooters,
  accessories,
  contact,
}: {
  heroBanners: HeroBannerSlide[];
  featuredCars: VinFastHomeSlide[];
  featuredScooters: VinFastHomeSlide[];
  accessories: AccessoryProduct[];
  contact: DealershipContact;
}) {
  const [bookingSlide, setBookingSlide] = useState<VinFastHomeSlide | null>(null);
  const [bookingKind, setBookingKind] = useState<"car" | "scooter">("car");

  const openDepositModal = (slide: VinFastHomeSlide, kind: "car" | "scooter") => {
    setBookingKind(kind);
    setBookingSlide(slide);
  };

  return (
    <div className="relative min-h-screen bg-background">
      <Toaster position="top-center" richColors />
      <Header />
      <main>
        <h1 className="sr-only">VF Ngọc Anh — Đại lý ủy quyền chính thức VinFast Cà Mau</h1>
        <HomeHero banners={heroBanners} />
        <FeaturedVehicle
          slides={featuredCars}
          onDeposit={(slide) => openDepositModal(slide, "car")}
        />
        <ScooterSection
          slides={featuredScooters}
          onDeposit={(slide) => openDepositModal(slide, "scooter")}
        />
        <Accessories products={accessories} />
        <ChargingEcosystem />
        <WarrantyService />
        <BrandStory />
        <ShowroomCommunity />
        <Newsletter />
        <FaqSection />
        <ShowroomLocationSection contact={contact} />
      </main>
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

function FeaturedVehicle({
  slides,
  onDeposit,
}: {
  slides: VinFastHomeSlide[];
  onDeposit: (slide: VinFastHomeSlide) => void;
}) {
  return (
    <FeatureCarouselSection
      slides={slides}
      imageSide="left"
      imageAspect="2544/1500"
      onPrimaryClick={onDeposit}
    />
  );
}

function ScooterSection({
  slides,
  onDeposit,
}: {
  slides: VinFastHomeSlide[];
  onDeposit: (slide: VinFastHomeSlide) => void;
}) {
  return (
    <FeatureCarouselSection
      slides={slides}
      imageSide="right"
      imageAspect="2544/1500"
      onPrimaryClick={onDeposit}
    />
  );
}

function SectionHeader(props: { title: string; eyebrow?: string; viewAllHref?: string }) {
  return <HomeSectionHeader {...props} />;
}

function Accessories({ products }: { products: AccessoryProduct[] }) {
  return (
    <section className="section-y bg-surface-muted">
      <div className="container-vf">
        <SectionHeader eyebrow="VinFast" title="Phụ kiện chính hãng" viewAllHref="/phu-kien" />
        <CatalogGrid className="grid grid-cols-2 items-stretch gap-3 sm:gap-6 lg:grid-cols-4">
          {products.map((product, index) => (
            <CatalogGridItem key={product.id} index={index} inView>
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
    aspect: "lg:aspect-[21/9]",
    theme: "dark" as const,
  },
  {
    img: IMAGES.chargingScooter,
    title: "Pin & Trạm sạc xe máy điện",
    desc: CHARGING_DESC,
    href: "/pin-va-tram-sac",
    aspect: "lg:aspect-[21/9]",
    theme: "dark" as const,
  },
  {
    img: IMAGES.portableCharger,
    title: "Thiết bị sạc di động",
    desc: "VinFast cung cấp đa dạng giải pháp sạc để đáp ứng nhu cầu sử dụng của khách hàng một cách thuận tiện nhất.",
    href: "/pin-va-tram-sac#san-pham-sac",
    aspect: "lg:min-h-full",
    theme: "light" as const,
    imageFit: "contain" as const,
    imageZoom: false,
  },
];

const chargingOverlayDark =
  "absolute inset-x-0 bottom-0 w-full translate-y-0 bg-[linear-gradient(359deg,#000_0.54%,rgba(0,0,0,0)_98.5%)] p-5 text-white transition-transform duration-500 ease-in-out sm:p-[30px] [@media(hover:hover)_and_(pointer:fine)]:translate-y-[65%] [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-y-0";

const chargingOverlayLight =
  "absolute inset-x-0 bottom-0 w-full translate-y-0 bg-[linear-gradient(359deg,#f7f9f9_0.54%,rgba(247,249,249,0)_98.5%)] p-5 text-[#3c3c3c] transition-transform duration-500 ease-in-out sm:p-[30px] [@media(hover:hover)_and_(pointer:fine)]:translate-y-[65%] [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-y-0";

function ChargingCard({ item, index }: { item: (typeof CHARGING_TILES)[number]; index: number }) {
  const overlay = item.theme === "light" ? chargingOverlayLight : chargingOverlayDark;
  const fillHeight = item.aspect.includes("min-h");
  const mobilePanel =
    item.theme === "light"
      ? "border-t border-slate-100 bg-[#f7f9f9] p-5 text-[#3c3c3c]"
      : "border-t border-brand-dark/20 bg-brand-dark p-5 text-white";

  return (
    <StaggerItem variant="home" index={index} className={fillHeight ? "h-full min-h-0" : undefined}>
      <HomeOverlayCard
        href={item.href}
        title={item.title}
        image={item.img}
        imageAlt={item.title}
        overlayClass={overlay}
        aspectClass={item.aspect}
        fillHeight={fillHeight}
        stackOnMobile
        mobilePanelClass={mobilePanel}
        imageFit={item.imageFit ?? "cover"}
        imageZoom={item.imageZoom ?? true}
      >
        <h3 className={`${vfCardTitle} ${item.theme === "light" ? "" : "text-stroke-white"}`}>
          {item.title}
        </h3>
        <p className="pt-3 text-xs leading-relaxed opacity-90 sm:pt-4 sm:text-sm">{item.desc}</p>
        <span
          className={`mt-3 block pt-1 text-xs font-semibold tracking-wide sm:mt-0 sm:pt-4 ${
            item.theme === "light" ? "text-brand" : "text-white/90"
          }`}
        >
          Xem chi tiết →
        </span>
      </HomeOverlayCard>
    </StaggerItem>
  );
}

function ChargingEcosystem() {
  const [leftTiles, portableTile] = [CHARGING_TILES.slice(0, 2), CHARGING_TILES[2]];

  return (
    <section className="section-y bg-white pb-14 sm:pb-16 lg:pb-20">
      <div className="container-vf">
        <SectionHeader eyebrow="Hệ sinh thái" title="Pin & trạm sạc" />

        <div className="grid gap-4 lg:grid-cols-2 lg:items-stretch lg:gap-5">
          <div className="flex flex-col gap-4 lg:gap-5">
            {leftTiles.map((item, index) => (
              <ChargingCard key={item.title} item={item} index={index} />
            ))}
          </div>

          <ChargingCard item={portableTile} index={2} />
        </div>
      </div>
    </section>
  );
}

function WarrantyService() {
  return (
    <section id="block-service" className="relative w-full overflow-hidden bg-white">
      <div className="relative w-full home-feature-surface">
        <div className="relative z-10">
          <FadeIn
            direction="right"
            className="relative aspect-[2544/1065] w-full overflow-hidden bg-surface-muted lg:absolute lg:inset-y-0 lg:right-0 lg:aspect-auto lg:w-1/2"
          >
            <img
              src={IMAGES.warrantyService}
              alt="Bảo hành và dịch vụ VinFast"
              className="h-full w-full object-cover object-right"
              loading="lazy"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-10 bg-gradient-to-t from-[var(--surface-muted)] to-transparent lg:hidden"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 z-[1] hidden w-28 bg-gradient-to-l from-transparent via-[var(--surface-muted)]/70 to-[var(--surface-muted)] lg:block lg:w-40 xl:w-52"
            />
          </FadeIn>

          <div className={warrantyPanel}>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 z-[1] hidden w-16 bg-gradient-to-r from-transparent to-[var(--surface-muted)]/80 lg:block lg:w-24 xl:w-32"
            />
            <FadeIn direction="left" blur className={`${featureCopy} lg:overflow-hidden`}>
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
                  className={`${warrantyBtn} bg-brand text-white shadow-sm transition hover:bg-[#0046cc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand`}
                >
                  Đặt lịch bảo dưỡng
                </a>
                <a
                  href="https://vinfastauto.com/vn_vi/dich-vu-hau-mai/bao-hanh-va-bao-duong"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${warrantyBtn} border border-brand bg-white text-brand transition hover:bg-brand/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand`}
                >
                  Chính sách
                </a>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}

const BRAND_POINTS = [
  "Công nghệ đẳng cấp thế giới",
  "Sản xuất tại Việt Nam - Chuỗi giá trị nội địa",
  "Vì tương lai xanh - Bền vững",
];

function BrandStory() {
  const { ref: sectionRef, reduced, initial, animate } = useSectionReveal(homeViewport);

  const brandCopy = (
    <div className="w-full max-w-xl text-white lg:max-w-md xl:max-w-lg">
      <motion.h3
        custom={0}
        initial={initial}
        animate={animate}
        variants={reduced ? undefined : homeBrandLine}
        className={vfSlideTitle}
      >
        VinFast - Vì một Việt Nam mạnh mẽ
      </motion.h3>
      <motion.p
        custom={1}
        initial={initial}
        animate={animate}
        variants={reduced ? undefined : homeBrandLine}
        className="mt-2 text-sm opacity-90 md:mt-2.5"
      >
        Tự hào thương hiệu Việt
      </motion.p>
      <ul className="mt-5 space-y-3 text-sm md:mt-6 md:space-y-3.5">
        {BRAND_POINTS.map((t, i) => (
          <motion.li
            key={t}
            custom={i + 2}
            initial={initial}
            animate={animate}
            variants={reduced ? undefined : homeBrandLine}
            className="flex items-start gap-2.5"
          >
            <Check size={16} className="mt-0.5 shrink-0 text-[#FFD500]" />
            <span>{t}</span>
          </motion.li>
        ))}
      </ul>
      <motion.div
        custom={5}
        initial={initial}
        animate={animate}
        variants={reduced ? undefined : homeBrandLine}
        className="mt-6 md:mt-8"
      >
        <MotionLinkButton
          href="https://vinfastauto.com/vn_vi"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex rounded-md bg-brand px-5 py-2.5 text-xs font-semibold tracking-wide text-white shadow-[var(--shadow-brand)] transition hover:bg-[#0046cc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Tìm hiểu thêm
        </MotionLinkButton>
      </motion.div>
    </div>
  );

  return (
    <section className="bg-white py-14 sm:py-16 lg:py-24">
      <div className="container-vf">
        <motion.div
          ref={sectionRef}
          initial={initial}
          animate={animate}
          variants={reduced ? undefined : homeBrandClip}
          className="relative flex flex-col overflow-hidden rounded-2xl shadow-[var(--shadow-brand)] ring-1 ring-black/[0.06] lg:block lg:h-[560px]"
        >
          <div className="relative w-full shrink-0 overflow-hidden bg-brand-dark lg:absolute lg:inset-0 lg:h-full">
            <img
              src={IMAGES.brandStory}
              alt="VinFast - Vì một Việt Nam mạnh mẽ"
              className="block h-auto w-full lg:absolute lg:inset-0 lg:h-full lg:object-cover lg:object-center"
              loading="lazy"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(90deg,transparent_0%,rgba(11,31,91,0.2)_48%,rgba(11,31,91,0.88)_88%)] lg:block"
            />
          </div>

          {/* Copy: panel dưới ảnh (mobile) → overlay phải (desktop) */}
          <div className="relative z-10 bg-brand-dark p-5 sm:p-8 lg:absolute lg:inset-0 lg:flex lg:items-center lg:justify-end lg:bg-transparent lg:p-14">
            {brandCopy}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

const showroomCommunityOverlay =
  "absolute inset-x-0 bottom-0 translate-y-0 bg-[linear-gradient(359deg,#000_0.54%,rgba(0,0,0,0)_98.5%)] p-5 text-white transition-transform duration-500 ease-in-out sm:p-[30px] [@media(hover:hover)_and_(pointer:fine)]:translate-y-[40%] [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-y-0";

function ShowroomCommunity() {
  const cards = [
    {
      img: IMAGES.showroom,
      title: "Showroom & trạm sạc",
      cta: "Tìm hiểu thêm",
      href: "https://vinfastauto.com/vn_vi/tim-kiem-showroom-tram-sac",
      external: true,
    },
    {
      img: IMAGES.community,
      title: "Cộng đồng VinFast toàn cầu",
      cta: "Tìm hiểu thêm",
      href: "https://vinfast.vn",
      external: true,
      nofollow: true,
    },
  ] as const;

  return (
    <section className="section-y bg-surface-muted">
      <div className="container-vf">
        <div className="grid items-stretch gap-4 sm:grid-cols-2 sm:gap-5">
          {cards.map((card, index) => (
            <StaggerItem key={card.title} variant="home" index={index} className="w-full">
              <HomeOverlayCard
                href={card.href}
                title={card.title}
                image={card.img}
                imageAlt={card.title}
                overlayClass={showroomCommunityOverlay}
                aspectClass="h-full"
                stackOnMobile
                mobilePanelClass="border-t border-brand-dark/20 bg-brand-dark p-5 text-white"
                heightClass="lg:min-h-[354px]"
                external={card.external}
                rel={
                  "nofollow" in card && card.nofollow
                    ? "nofollow noopener noreferrer"
                    : "noopener noreferrer"
                }
              >
                <h3 className={`${vfCardTitle} text-white lg:text-stroke-white`}>{card.title}</h3>
                <span className="mt-4 inline-block text-xs font-semibold tracking-wide text-white/90">
                  {card.cta} →
                </span>
              </HomeOverlayCard>
            </StaggerItem>
          ))}
        </div>
      </div>
    </section>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");
  const { ref, reduced, initial, animate } = useSectionReveal(homeViewport);

  return (
    <section id="block-join-the-charge" className="relative mt-16 overflow-hidden py-24 md:mt-24">
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center bg-no-repeat md:bg-[position:-112px_50%]"
        style={{ backgroundImage: `url(${IMAGES.newsletterBg})` }}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,31,91,0.72)_0%,rgba(11,31,91,0.55)_100%)]"
      />
      <div className="container-vf relative">
        <motion.div
          ref={ref}
          initial={initial}
          animate={animate}
          variants={reduced ? undefined : homeNewsletterBlock}
          className="mx-auto max-w-[668px] text-center"
        >
          <motion.p
            variants={reduced ? undefined : homeNewsletterChild}
            className="text-balance text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl"
          >
            Đăng ký nhận thông tin
          </motion.p>
          <motion.p
            variants={reduced ? undefined : homeNewsletterChild}
            className="mx-auto mt-4 max-w-[52ch] text-base leading-relaxed text-white/88 sm:text-lg"
          >
            Đăng ký nhận thông tin chương trình khuyến mãi, dịch vụ VinFast.
          </motion.p>
          <motion.form
            variants={reduced ? undefined : homeNewsletterChild}
            onSubmit={(e) => {
              e.preventDefault();
              setEmail("");
            }}
            className="mt-4"
          >
            <div className="relative overflow-hidden rounded-lg bg-white shadow-[var(--shadow-card)] md:h-12">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn"
                className="block h-12 w-full bg-white px-4 text-base font-medium text-foreground outline-none placeholder:font-normal placeholder:text-muted-foreground md:pr-[200px] focus-visible:ring-2 focus-visible:ring-brand/30"
              />
              <MotionButton
                type="submit"
                className="mt-2.5 h-12 w-full bg-brand text-xs font-bold leading-[15px] text-white transition hover:bg-[#0046cc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:absolute md:right-0 md:top-1/2 md:mt-0 md:w-[200px] md:-translate-y-1/2"
              >
                Đăng ký
              </MotionButton>
            </div>
          </motion.form>
          <motion.p
            variants={reduced ? undefined : homeNewsletterChild}
            className="mt-4 text-xs leading-[18px] text-white"
          >
            Bằng cách đăng ký, Quý khách xác nhận đã đọc, hiểu và đồng ý với{" "}
            <a
              href="https://vinfastauto.com/vn_vi/dieu-khoan-phap-ly"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline sm:whitespace-nowrap"
            >
              Chính sách Quyền riêng tư
            </a>{" "}
            của VinFast.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
