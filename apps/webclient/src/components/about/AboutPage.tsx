"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Target,
  Eye,
  Gem,
  Check,
  ChevronRight,
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
import { homeSectionRule, homeSectionTitle } from "@/lib/home-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useSectionReveal } from "@/hooks/use-section-reveal";
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
      animate="visible"
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
  const { ref, reduced, initial, animate } = useSectionReveal(aboutViewport);

  return (
    <section className="section-y overflow-hidden border-b border-slate-200/60 bg-white">
      <div className="container-vf">
        <AboutSectionHeader eyebrow="Lịch sử vàng son" title="Hành trình phát triển chói sáng" />

        {/* Mobile / tablet: timeline dọc — không cần cuộn ngang */}
        <div className="relative mt-8 md:mt-10 lg:hidden" ref={ref}>
          <div
            className="absolute top-3 bottom-3 left-4 w-px bg-gradient-to-b from-brand/20 via-brand/50 to-brand/20"
            aria-hidden
          />
          <ol className="space-y-6 sm:space-y-8">
            {MILESTONES.map((m, index) => (
              <motion.li
                key={m.year}
                custom={index}
                initial={initial}
                animate={animate}
                viewport={aboutViewport}
                variants={reduced ? undefined : aboutTimelineCard}
                className="relative pl-11 sm:pl-12"
              >
                <div
                  className="absolute top-5 left-0 z-10 flex size-8 items-center justify-center rounded-full border-2 border-brand bg-white shadow-sm sm:size-9"
                  aria-hidden
                >
                  <div className="size-2.5 rounded-full bg-brand" />
                </div>

                <article className="overflow-hidden rounded-2xl border border-slate-200 bg-surface-muted shadow-soft">
                  <div className="aspect-[16/9] overflow-hidden bg-white sm:aspect-[2/1]">
                    <img
                      src={m.image}
                      alt={m.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4 sm:p-5">
                    <span className="inline-block rounded-full bg-brand/10 px-2.5 py-0.5 text-[11px] font-extrabold tracking-wider text-brand">
                      {m.year}
                    </span>
                    <h3 className="mt-2 text-sm font-black leading-snug text-brand-dark sm:text-base">
                      {m.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-500 sm:text-sm">
                      {m.desc}
                    </p>
                  </div>
                </article>
              </motion.li>
            ))}
          </ol>
        </div>

        {/* Desktop: timeline ngang 5 cột */}
        <div className="relative mt-12 hidden lg:block">
          <motion.div
            initial={initial}
            animate={animate}
            viewport={aboutViewport}
            variants={reduced ? undefined : aboutTimelineLine}
            className="absolute top-5 right-10 left-10 h-0.5 origin-left bg-slate-200"
            aria-hidden
          />

          <div className="grid grid-cols-5 gap-4 xl:gap-5">
            {MILESTONES.map((m, index) => (
              <motion.article
                key={m.year}
                custom={index}
                initial={initial}
                animate={animate}
                viewport={aboutViewport}
                variants={reduced ? undefined : aboutTimelineCard}
                className="group flex flex-col"
              >
                <div className="relative z-10 mb-5 flex flex-col items-center">
                  <motion.div
                    variants={reduced ? undefined : aboutTimelineDot}
                    className="flex size-10 items-center justify-center rounded-full border-2 border-brand bg-white shadow-sm transition-shadow group-hover:shadow-md"
                  >
                    <div className="size-3 rounded-full bg-brand" />
                  </motion.div>
                  <span className="mt-2 text-xs font-black tracking-wider text-brand">
                    {m.year}
                  </span>
                </div>

                <motion.div
                  whileHover={reduced ? undefined : { y: -4, transition: { duration: 0.25 } }}
                  className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-surface-muted shadow-soft transition-shadow duration-300 hover:shadow-md"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-white">
                    <img
                      src={m.image}
                      alt={m.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-4 xl:p-5">
                    <h3 className="text-xs font-black uppercase leading-snug tracking-wide text-brand-dark xl:text-sm">
                      {m.title}
                    </h3>
                    <p className="mt-2 flex-1 text-[11px] leading-relaxed text-slate-500 xl:text-xs">
                      {m.desc}
                    </p>
                  </div>
                </motion.div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyChooseSection() {
  const { ref, reduced, initial, animate } = useSectionReveal(aboutViewport);

  return (
    <section className="section-y bg-surface-muted">
      <div className="container-vf">
        <AboutSectionHeader eyebrow="Trải nghiệm khác biệt" title="Vì sao lựa chọn VF Ngọc Anh?" />

        <div className="mt-10 grid items-center gap-10 lg:grid-cols-2 lg:gap-14" ref={ref}>
          <motion.div
            initial={initial}
            animate={animate}
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
                initial={initial}
                animate={animate}
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
