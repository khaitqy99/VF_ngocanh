"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Target,
  Eye,
  Gem,
  Check,
  ChevronRight,
  ChevronLeft,
  Award,
  Users,
  Wrench,
  Cpu,
  Headphones,
  Car,
  Sparkles,
  Phone,
} from "lucide-react";

import Header from "@/components/site/Header";
import FloatingButtons from "@/components/site/FloatingButtons";
import ShowroomLocationSection from "@/components/site/ShowroomLocationSection";
import { type DealershipContact } from "@/lib/dealership";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { MotionLinkButton } from "@/components/motion/MotionButton";
import { StaggerGrid, StaggerItem } from "@/components/motion";
import { IMAGES } from "@/lib/images";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { PageEditorialHero } from "@/components/shared/PageEditorialHero";
import { HOTLINE, HOTLINE_TEL } from "@/lib/contact";
import {
  aboutBreadcrumb,
  aboutHeroKenBurns,
  aboutHeroLine,
  aboutHeroStagger,
  aboutMissionCard,
  aboutMissionIcon,
  aboutSectionEyebrow,
  aboutSectionHeader,
  aboutStatItem,
  aboutStatStagger,
  aboutTimelineCard,
  aboutTimelineDot,
  aboutTimelineLine,
  aboutViewport,
  aboutWhyImage,
  aboutWhyItem,
} from "@/lib/about-motion";
import { homeNavBtn, homeSectionRule, homeSectionTitle } from "@/lib/home-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import {
  FeatureCarouselSection,
  type FeatureCarouselSlide,
} from "@/components/shared/FeatureCarouselSection";

const STATS = [
  { icon: Award, value: "5+", label: "Năm kinh nghiệm đồng hành cùng VinFast" },
  { icon: Users, value: "10.000+", label: "Khách hàng tin tưởng lựa chọn sản phẩm" },
  { icon: Car, value: "15.000+", label: "Xe điện thông minh đã bàn giao toàn quốc" },
] as const;

const MILESTONES = [
  {
    year: "2019",
    title: "Đặt Nền Móng Khởi Đầu",
    desc: "Thành lập VF Ngọc Anh, chính thức bắt tay cùng VinFast trên hành trình khai phá thị trường xe điện Việt Nam đầy tiềm năng.",
    image: IMAGES.aboutShowroomBanner,
  },
  {
    year: "2020",
    title: "Đạt chuẩn Đại Lý Ủy Quyền 3S",
    desc: "Chính thức được VinFast công nhận là đại lý ủy quyền 3S tiêu chuẩn toàn cầu, bao gồm Bán hàng, Dịch vụ và Phụ tùng chính hãng.",
    image: IMAGES.community,
  },
  {
    year: "2021",
    title: "Mở Rộng Hệ Thống Trạm Sạc",
    desc: "Phối hợp cùng hãng đầu tư mở rộng hạ tầng mạng lưới trạm sạc công suất cao quanh khu vực, tăng khả năng tiếp cận cho khách hàng.",
    image: IMAGES.chargingStations,
  },
  {
    year: "2022 - 2023",
    title: "Tăng Trưởng Bứt Phá Doanh Số",
    desc: "Nằm trong TOP các đại lý có doanh số bàn giao xe điện (VF e34, VF 8, VF 9) dẫn đầu miền Bắc, được khách hàng tin yêu tuyệt đối.",
    image: IMAGES.vfMpv7,
  },
  {
    year: "2024 - Nay",
    title: "Vững Bước Kỷ Nguyên Di Chuyển Xanh",
    desc: "Hoàn thiện hệ sinh thái xanh toàn diện gồm xe ô tô điện, xe máy điện, bộ sạc treo tường thông minh tại nhà và giải pháp lưu trữ ESS.",
    image: IMAGES.newsletterBg,
  },
] as const;

const WHY_CHOOSE = [
  {
    icon: Award,
    title: "Đại lý ủy quyền 3S chính thức của VinFast",
    desc: "Đảm bảo phân phối xe ô tô điện, xe máy điện, phụ tùng và tháp pin lưu trữ ESS chính hãng 100%, bảo hành chuẩn mực toàn cầu.",
  },
  {
    icon: Users,
    title: "Đội ngũ cố vấn và kỹ thuật viên cao cấp",
    desc: "Nhân viên được đào tạo khắt khe theo giáo trình chuẩn hóa từ chuyên gia công nghệ quốc tế của VinFast, am hiểu kỹ thuật chuyên sâu.",
  },
  {
    icon: Wrench,
    title: "Dịch vụ hậu mãi 3S khép kín hoàn hảo",
    desc: "Hệ thống xưởng dịch vụ quy mô lớn, đầu tư cầu nâng và thiết bị chẩn đoán điện tử thế hệ mới, hỗ trợ bảo dưỡng sạc pin khẩn cấp 24/7.",
  },
  {
    icon: Cpu,
    title: "Hạ tầng Showroom & Công nghệ hiện đại",
    desc: "Không gian trưng bày đạt chuẩn nhận diện 3S mới của VinFast, nâng cao trải nghiệm mua sắm số hóa trực quan cho khách hàng.",
  },
  {
    icon: Headphones,
    title: "Chăm sóc khách hàng trọn vòng đời xe",
    desc: "Cam kết đồng hành trọn vẹn từ khâu lái thử, hỗ trợ thủ tục trả góp 0%, làm hồ sơ đăng ký ra biển đến bảo dưỡng định kỳ lâu dài.",
  },
] as const;

const CORE_VALUES = [
  "Khách hàng là trọng tâm cốt lõi",
  "Chính trực - Trung thực - Minh bạch chi phí",
  "Chuyên nghiệp - Đẳng cấp chuẩn quốc tế",
  "Đổi mới sáng tạo - Làm chủ công nghệ",
  "Kiên định đồng hành xây dựng tương lai xanh",
] as const;

const ABOUT_CTA_SLIDES: FeatureCarouselSlide[] = [
  {
    title: "Sẵn sàng trải nghiệm",
    subtitle: "Kỷ nguyên di chuyển xanh?",
    description:
      "Hãy đăng ký lái thử trực tuyến ngay hôm nay để trực tiếp cảm nhận sức mạnh, sự êm ái và các công nghệ ADAS tự lái thông minh tiên phong từ các dòng ô tô điện VinFast thế hệ mới.",
    image: "/images/vinfast/cars/vf9.webp",
    imageAlt: "VF 9",
    imageClass: "h-full w-full object-contain object-left",
    specs: [
      { value: "3S", label: "Đại lý ủy quyền" },
      { value: "Cà Mau", label: "Showroom & xưởng dịch vụ" },
      { value: "24/7", label: "Hỗ trợ khách hàng" },
      { value: HOTLINE, label: "Hotline cứu hộ", highlight: true },
    ],
    primaryCta: "KHÁM PHÁ NGAY",
    secondaryCta: "ĐẶT LỊCH LÁI THỬ",
    href: "/oto",
    detailHref: HOTLINE_TEL,
  },
];

export default function AboutPage({ contact }: { contact: DealershipContact }) {
  return (
    <div className="relative min-h-screen bg-background font-sans text-foreground antialiased">
      <Header />

      <main>
        <BreadcrumbBar />
        <HeroSection />
        <MissionSection />
        <TimelineSection />
        <WhyChooseSection />
        <ShowroomLocationSection className="section-y bg-surface-muted" contact={contact} />
        <CtaBanner />
      </main>

      <FloatingButtons />
    </div>
  );
}

function BreadcrumbBar() {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={reduced ? false : "hidden"}
      animate={reduced ? undefined : "visible"}
      variants={reduced ? undefined : aboutBreadcrumb}
      className="border-b border-border/60 bg-background"
    >
      <div className="container-vf py-3.5">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  href="/"
                  className="text-xs font-bold text-slate-500 transition-colors hover:text-brand"
                >
                  Trang chủ
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-xs font-extrabold text-brand-dark">
                Về showroom VF Ngọc Anh
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </motion.div>
  );
}

function AboutSectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return <SectionHeader align="centered" eyebrow={eyebrow} title={title} className="mb-12" />;
}

function HeroSection() {
  return (
    <PageEditorialHero
      imageSrc={IMAGES.aboutShowroomBanner}
      imageAlt="Showroom VinFast Ngọc Anh - Cà Mau"
      eyebrow="ĐẠI LÝ ỦY QUYỀN CHÍNH THỨC VINFAST"
      title={
        <>
          SHOWROOM VF NGỌC ANH <br />
        </>
      }
      titleAccent="CÀ MAU — ĐỒNG HÀNH CÙNG TƯƠNG LAI XANH"
      description="Tọa lạc tại Cà Mau, VF Ngọc Anh tự hào là đại lý ủy quyền 3S chính thức của VinFast Việt Nam. Chúng tôi cam kết mang tới cho khách hàng miền Tây những chiếc ô tô điện, xe máy điện thông minh đỉnh cao đi kèm dịch vụ bảo dưỡng, phụ tùng chính hãng vượt trội."
      actions={
        <>
          <MotionLinkButton
            href="/oto"
            className="home-cta-primary inline-flex items-center gap-1.5 rounded-full px-7 py-3.5 text-sm font-semibold text-white"
          >
            Khám phá dòng xe <ChevronRight className="size-4" />
          </MotionLinkButton>
          <MotionLinkButton
            href={HOTLINE_TEL}
            className="home-cta-ghost inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md"
          >
            <Phone className="size-4 text-accent-yellow" /> ĐƯỜNG DÂY NÓNG: {HOTLINE}
          </MotionLinkButton>
        </>
      }
      stats={STATS.map(({ icon, value, label }) => ({ icon, value, label }))}
    />
  );
}

function MissionCard({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Target;
  title: string;
  children: React.ReactNode;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial="rest"
      whileHover={reduced ? undefined : "hover"}
      variants={reduced ? undefined : aboutMissionCard}
      className="page-section-card group flex h-full flex-col items-center p-8 text-center transition-shadow duration-300 hover:shadow-card"
    >
      <motion.div
        variants={reduced ? undefined : aboutMissionIcon}
        className="flex size-14 items-center justify-center rounded-xl border border-brand/20 bg-brand/5 text-brand shadow-sm transition-colors duration-300 group-hover:bg-brand group-hover:text-white"
      >
        <Icon className="size-7" strokeWidth={1.5} />
      </motion.div>
      <h3 className="mt-6 text-xs font-black uppercase tracking-widest text-brand-dark">{title}</h3>
      {children}
    </motion.div>
  );
}

function MissionSection() {
  return (
    <section className="section-y border-b border-slate-200/60 bg-surface-muted">
      <div className="container-vf">
        <AboutSectionHeader
          eyebrow="Kim chỉ nam hoạt động"
          title="Sứ mệnh — tầm nhìn — giá trị cốt lõi"
        />

        <StaggerGrid className="grid gap-6 md:grid-cols-3">
          <StaggerItem variant="home" index={0}>
            <MissionCard icon={Target} title="SỨ MỆNH CỐT LÕI">
              <p className="mt-4 text-xs font-semibold leading-relaxed text-slate-400">
                Xây dựng chiếc cầu nối vững chắc đưa các giải pháp di chuyển xanh, xe điện thông
                minh thân thiện môi trường của VinFast tới tay mỗi người dân Việt Nam, kiến tạo lối
                sống văn minh, bền vững.
              </p>
            </MissionCard>
          </StaggerItem>

          <StaggerItem variant="home" index={1}>
            <MissionCard icon={Eye} title="TẦM NHÌN CHIẾN LƯỢC">
              <p className="mt-4 text-xs font-semibold leading-relaxed text-slate-400">
                Trở thành biểu tượng showroom 3S dẫn đầu cả nước về quy mô doanh số lẫn chỉ số hài
                lòng của khách hàng (CSI), là địa chỉ tin cậy hàng đầu khi nhắc đến thương hiệu xe
                điện VinFast.
              </p>
            </MissionCard>
          </StaggerItem>

          <StaggerItem variant="home" index={2}>
            <MissionCard icon={Gem} title="GIÁ TRỊ CỐT LÕI">
              <ul className="mt-5 w-full space-y-3.5 border-t border-slate-100 pt-4">
                {CORE_VALUES.map((v) => (
                  <li
                    key={v}
                    className="flex items-center gap-2.5 text-[11px] font-bold text-slate-500"
                  >
                    <Check size={14} className="shrink-0 text-brand" strokeWidth={3} />
                    <span>{v}</span>
                  </li>
                ))}
              </ul>
            </MissionCard>
          </StaggerItem>
        </StaggerGrid>
      </div>
    </section>
  );
}

function TimelineSection() {
  const reduced = useReducedMotion();

  const scrollBy = (dir: "prev" | "next") => {
    const el = document.getElementById("about-timeline");
    if (!el) return;
    const amount = el.clientWidth * 0.85;
    el.scrollBy({ left: dir === "next" ? amount : -amount, behavior: "smooth" });
  };

  return (
    <section className="section-y overflow-hidden border-b border-slate-200/60 bg-white">
      <div className="container-vf">
        <AboutSectionHeader eyebrow="Lịch sử vàng son" title="Hành trình phát triển chói sáng" />

        <div className="relative">
          <motion.div
            initial={reduced ? false : "hidden"}
            whileInView={reduced ? undefined : "visible"}
            viewport={aboutViewport}
            variants={reduced ? undefined : aboutTimelineLine}
            className="absolute top-[18px] right-8 left-8 hidden h-[2px] origin-left bg-slate-200 lg:block"
            aria-hidden
          />

          <div
            id="about-timeline"
            className="scrollbar-none flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 lg:grid lg:grid-cols-5 lg:gap-5 lg:overflow-visible lg:pb-0"
          >
            {MILESTONES.map((m, index) => (
              <motion.div
                key={m.year}
                custom={index}
                initial={reduced ? false : "hidden"}
                whileInView={reduced ? undefined : "visible"}
                viewport={aboutViewport}
                variants={reduced ? undefined : aboutTimelineCard}
                className="w-[85%] shrink-0 snap-center sm:w-[48%] lg:w-full"
              >
                <div className="relative flex flex-col items-center">
                  <motion.div
                    variants={reduced ? undefined : aboutTimelineDot}
                    className="relative z-10 mb-4 flex size-9 items-center justify-center rounded-full border border-brand bg-white shadow-sm"
                  >
                    <div className="size-2.5 rounded-full bg-brand" />
                  </motion.div>

                  <motion.div
                    whileHover={reduced ? undefined : { y: -4, transition: { duration: 0.25 } }}
                    className="flex h-full w-full flex-col items-center rounded-2xl border border-slate-200 bg-surface-muted p-5 text-center shadow-soft transition-shadow duration-300 hover:shadow-md"
                  >
                    <span className="text-sm font-black tracking-wider text-brand">{m.year}</span>
                    <h3 className="mt-1 flex min-h-[32px] items-center justify-center text-xs font-black uppercase tracking-wide text-brand-dark">
                      {m.title}
                    </h3>
                    <p className="mt-2.5 min-h-[55px] text-[11px] font-semibold leading-relaxed text-slate-400">
                      {m.desc}
                    </p>
                    <div className="mt-4 aspect-[16/10] w-full overflow-hidden rounded-xl border border-slate-200 bg-white">
                      <motion.img
                        src={m.image}
                        alt={m.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        whileHover={reduced ? undefined : { scale: 1.06 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.button
            type="button"
            onClick={() => scrollBy("prev")}
            initial="rest"
            whileHover={reduced ? undefined : "hover"}
            whileTap={reduced ? undefined : "tap"}
            variants={homeNavBtn}
            className="absolute top-1/2 -left-2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-brand-dark shadow-md transition hover:text-brand lg:hidden"
            aria-label="Mốc trước"
          >
            <ChevronLeft size={18} />
          </motion.button>
          <motion.button
            type="button"
            onClick={() => scrollBy("next")}
            initial="rest"
            whileHover={reduced ? undefined : "hover"}
            whileTap={reduced ? undefined : "tap"}
            variants={homeNavBtn}
            className="absolute top-1/2 -right-2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-brand-dark shadow-md transition hover:text-brand lg:-right-4 lg:hidden"
            aria-label="Mốc tiếp"
          >
            <ChevronRight size={18} />
          </motion.button>
        </div>
      </div>
    </section>
  );
}

function WhyChooseSection() {
  const reduced = useReducedMotion();

  return (
    <section className="section-y bg-surface-muted">
      <div className="container-vf">
        <AboutSectionHeader eyebrow="Trải nghiệm khác biệt" title="Vì sao lựa chọn VF Ngọc Anh?" />

        <div className="mt-10 grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <motion.div
            initial={reduced ? false : "hidden"}
            whileInView={reduced ? undefined : "visible"}
            viewport={aboutViewport}
            variants={reduced ? undefined : aboutWhyImage}
            className="group relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-soft"
          >
            <div className="pointer-events-none absolute inset-0 z-10 bg-brand-dark/5 transition-all duration-300 group-hover:bg-brand-dark/15" />
            <motion.img
              src={IMAGES.aboutShowroomBanner}
              alt="Showroom VinFast Ngọc Anh - Cà Mau"
              className="h-full w-full object-cover object-center"
              loading="lazy"
              whileHover={reduced ? undefined : { scale: 1.05 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            />
          </motion.div>

          <ul className="space-y-6">
            {WHY_CHOOSE.map(({ icon: Icon, title, desc }, index) => (
              <motion.li
                key={title}
                custom={index}
                initial={reduced ? false : "hidden"}
                whileInView={reduced ? undefined : "visible"}
                viewport={aboutViewport}
                variants={reduced ? undefined : aboutWhyItem}
                whileHover={reduced ? undefined : { x: 4, transition: { duration: 0.2 } }}
                className="page-section-card flex list-none items-start gap-4 p-5"
              >
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <Icon className="size-5.5 text-brand" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-brand-dark">
                    {title}
                  </h3>
                  <p className="mt-1.5 text-xs font-semibold leading-relaxed text-slate-400">
                    {desc}
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function CtaBanner() {
  return (
    <FeatureCarouselSection slides={ABOUT_CTA_SLIDES} imageSide="left" imageAspect="2544/1500" />
  );
}
