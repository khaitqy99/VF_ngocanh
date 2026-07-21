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
import type { AboutPageContent } from "@/lib/cms/static-pages";
import { DEFAULT_ABOUT_CONTENT } from "@/lib/cms/static-page-defaults";
import { useStaticPageAdminEdit } from "@/components/admin-edit/static-page/StaticPageAdminEditContext";
import {
  StaticEditableText,
  StaticEditImageButton,
  StaticEditHeroBannerControls,
} from "@/components/admin-edit/static-page/StaticEditableText";
import { cn } from "@/lib/utils";

const STAT_ICONS = [Award, Users, Car] as const;
const WHY_ICONS = [Award, Users, Wrench, Cpu, Headphones] as const;

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

export default function AboutPage({
  contact,
  content = DEFAULT_ABOUT_CONTENT,
}: {
  contact: DealershipContact;
  content?: AboutPageContent;
}) {
  return (
    <div className="relative min-h-screen bg-background font-sans text-foreground antialiased">
      <main>
        <BreadcrumbBar />
        <HeroSection content={content} />
        <MissionSection content={content} />
        <TimelineSection content={content} />
        <WhyChooseSection content={content} />
        <ShowroomLocationSection className="section-y bg-surface-muted" contact={contact} />
        <CtaBanner />
      </main>
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
                Về showroom VinFast Ngọc Anh Cà Mau
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

function HeroSection({ content }: { content: AboutPageContent }) {
  const edit = useStaticPageAdminEdit();
  const hero = content.hero ?? DEFAULT_ABOUT_CONTENT.hero!;
  const stats = (content.stats ?? DEFAULT_ABOUT_CONTENT.stats ?? []).map((stat, index) => ({
    icon: STAT_ICONS[index] ?? Award,
    value: (
      <StaticEditableText
        value={stat.value}
        onChange={(value) => edit?.updateField(`stats.${index}.value`, value)}
        className="text-brand-dark font-black"
      />
    ),
    label: (
      <StaticEditableText
        value={stat.label}
        onChange={(value) => edit?.updateField(`stats.${index}.label`, value)}
        className="text-muted-foreground text-xs"
        multiline
      />
    ),
  }));

  return (
    <div className="relative">
      <PageEditorialHero
        imageSrc={hero.image ?? IMAGES.aboutShowroomBanner}
        imageAlt={
          hero.imageAlt ??
          DEFAULT_ABOUT_CONTENT.hero?.imageAlt ??
          "Showroom VinFast Ngọc Anh Cà Mau"
        }
        imagePosition={hero.imagePosition ?? DEFAULT_ABOUT_CONTENT.hero?.imagePosition ?? "center"}
        bannerControls={
          <StaticEditHeroBannerControls
            imagePath="hero.image"
            imageAlt={hero.imageAlt ?? DEFAULT_ABOUT_CONTENT.hero?.imageAlt ?? ""}
            imageAltPath="hero.imageAlt"
            imagePosition={
              hero.imagePosition ?? DEFAULT_ABOUT_CONTENT.hero?.imagePosition ?? "center"
            }
            imagePositionPath="hero.imagePosition"
          />
        }
        eyebrow={
          <StaticEditableText
            value={hero.eyebrow ?? ""}
            onChange={(value) => edit?.updateField("hero.eyebrow", value)}
            className="text-brand"
          />
        }
        title={
          <StaticEditableText
            value={hero.title ?? ""}
            onChange={(value) => edit?.updateField("hero.title", value)}
            className="text-brand-dark"
          />
        }
        titleAccent={
          <StaticEditableText
            value={hero.subtitle ?? ""}
            onChange={(value) => edit?.updateField("hero.subtitle", value)}
            className="text-brand"
          />
        }
        description={
          <StaticEditableText
            value={hero.description ?? DEFAULT_ABOUT_CONTENT.hero?.description ?? ""}
            onChange={(value) => edit?.updateField("hero.description", value)}
            className="text-muted-foreground"
            multiline
          />
        }
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
              className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-white px-7 py-3.5 text-sm font-semibold text-brand-dark shadow-sm transition hover:border-brand/30 hover:bg-surface-muted"
            >
              <Phone className="size-4 text-brand" /> ĐƯỜNG DÂY NÓNG: {HOTLINE}
            </MotionLinkButton>
          </>
        }
        stats={stats}
        separateContentSection
      />
    </div>
  );
}

function MissionSection({ content }: { content: AboutPageContent }) {
  const edit = useStaticPageAdminEdit();
  const mission = content.mission ?? DEFAULT_ABOUT_CONTENT.mission;
  const vision = content.vision ?? DEFAULT_ABOUT_CONTENT.vision;

  return (
    <section className="section-y border-b border-slate-200/60 bg-surface-muted">
      <div className="container-vf">
        <AboutSectionHeader
          eyebrow="Kim chỉ nam hoạt động"
          title="Sứ mệnh — tầm nhìn — giá trị cốt lõi"
        />

        <StaggerGrid className="grid gap-6 md:grid-cols-3">
          <StaggerItem variant="home" index={0}>
            <MissionCard
              variant="statement"
              icon={Target}
              eyebrow="Định hướng thương hiệu"
              title={
                <StaticEditableText
                  value={mission?.title ?? "SỨ MỆNH CỐT LÕI"}
                  onChange={(value) => edit?.updateField("mission.title", value)}
                />
              }
            >
              <StaticEditableText
                value={mission?.content ?? ""}
                onChange={(value) => edit?.updateField("mission.content", value)}
                multiline
              />
            </MissionCard>
          </StaggerItem>

          <StaggerItem variant="home" index={1}>
            <MissionCard variant="list" icon={Gem} title="GIÁ TRỊ CỐT LÕI">
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

          <StaggerItem variant="home" index={2}>
            <MissionCard
              variant="statement"
              icon={Eye}
              eyebrow="Mục tiêu dài hạn"
              title={
                <StaticEditableText
                  value={vision?.title ?? "TẦM NHÌN CHIẾN LƯỢC"}
                  onChange={(value) => edit?.updateField("vision.title", value)}
                />
              }
            >
              <StaticEditableText
                value={vision?.content ?? ""}
                onChange={(value) => edit?.updateField("vision.content", value)}
                multiline
              />
            </MissionCard>
          </StaggerItem>
        </StaggerGrid>
      </div>
    </section>
  );
}

function MissionCard({
  icon: Icon,
  title,
  children,
  variant = "list",
  eyebrow,
}: {
  icon: typeof Target;
  title: React.ReactNode;
  children: React.ReactNode;
  variant?: "statement" | "list";
  eyebrow?: string;
}) {
  const reduced = useReducedMotion();
  const isStatement = variant === "statement";

  return (
    <motion.div
      initial="rest"
      whileHover={reduced ? undefined : "hover"}
      variants={reduced ? undefined : aboutMissionCard}
      className={cn(
        "page-section-card group relative flex h-full flex-col overflow-hidden transition-shadow duration-300 hover:shadow-card",
        isStatement ? "p-7 text-left sm:p-8" : "items-center p-8 text-center",
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-brand via-brand/70 to-brand/20"
      />

      {isStatement ? (
        <>
          <div className="flex items-center gap-3.5">
            <motion.div
              variants={reduced ? undefined : aboutMissionIcon}
              className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-brand/20 bg-brand/5 text-brand shadow-sm transition-colors duration-300 group-hover:bg-brand group-hover:text-white"
            >
              <Icon className="size-6" strokeWidth={1.5} />
            </motion.div>
            <div className="min-w-0">
              {eyebrow ? (
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand">
                  {eyebrow}
                </p>
              ) : null}
              <h3 className="mt-1 text-xs font-black uppercase tracking-widest text-brand-dark">
                {title}
              </h3>
            </div>
          </div>

          <blockquote className="relative mt-6 flex flex-1 flex-col justify-center border-l-2 border-brand/25 pl-4">
            <span
              aria-hidden
              className="pointer-events-none absolute -top-3 left-3 select-none text-5xl font-black leading-none text-brand/15"
            >
              “
            </span>
            <p className="relative text-[13px] font-semibold leading-relaxed text-slate-600">
              {children}
            </p>
          </blockquote>
        </>
      ) : (
        <>
          <motion.div
            variants={reduced ? undefined : aboutMissionIcon}
            className="flex size-14 items-center justify-center rounded-xl border border-brand/20 bg-brand/5 text-brand shadow-sm transition-colors duration-300 group-hover:bg-brand group-hover:text-white"
          >
            <Icon className="size-7" strokeWidth={1.5} />
          </motion.div>
          <h3 className="mt-6 text-xs font-black uppercase tracking-widest text-brand-dark">
            {title}
          </h3>
          {children}
        </>
      )}
    </motion.div>
  );
}

function TimelineSection({ content }: { content: AboutPageContent }) {
  const edit = useStaticPageAdminEdit();
  const milestones = content.milestones ?? DEFAULT_ABOUT_CONTENT.milestones ?? [];
  const { ref, reduced, initial, animate } = useSectionReveal(aboutViewport);

  return (
    <section ref={ref} className="section-y overflow-hidden border-b border-slate-200/60 bg-white">
      <div className="container-vf">
        <AboutSectionHeader eyebrow="Lịch sử vàng son" title="Hành trình phát triển chói sáng" />

        {/* Mobile / tablet: timeline dọc — không cần cuộn ngang */}
        <div className="relative mt-8 md:mt-10 lg:hidden">
          <div
            className="absolute top-3 bottom-3 left-4 w-px bg-gradient-to-b from-brand/20 via-brand/50 to-brand/20"
            aria-hidden
          />
          <ol className="space-y-6 sm:space-y-8">
            {milestones.map((m, index) => (
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
                  <div className="aspect-[16/9] overflow-hidden bg-white sm:aspect-[2/1] relative">
                    <StaticEditImageButton imagePath={`milestones.${index}.image`} />
                    <img
                      src={m.image}
                      alt={m.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4 sm:p-5">
                    <span className="inline-block rounded-full bg-brand/10 px-2.5 py-0.5 text-[11px] font-extrabold tracking-wider text-brand">
                      <StaticEditableText
                        value={m.year}
                        onChange={(value) => edit?.updateField(`milestones.${index}.year`, value)}
                      />
                    </span>
                    <h3 className="mt-2 text-sm font-black leading-snug text-brand-dark sm:text-base">
                      <StaticEditableText
                        value={m.title}
                        onChange={(value) => edit?.updateField(`milestones.${index}.title`, value)}
                      />
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-500 sm:text-sm">
                      <StaticEditableText
                        value={m.desc}
                        onChange={(value) => edit?.updateField(`milestones.${index}.desc`, value)}
                        multiline
                      />
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
            {milestones.map((m, index) => (
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
                    <StaticEditableText
                      value={m.year}
                      onChange={(value) => edit?.updateField(`milestones.${index}.year`, value)}
                    />
                  </span>
                </div>

                <motion.div
                  whileHover={reduced ? undefined : { y: -4, transition: { duration: 0.25 } }}
                  className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-surface-muted shadow-soft transition-shadow duration-300 hover:shadow-md"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-white relative">
                    <StaticEditImageButton imagePath={`milestones.${index}.image`} />
                    <img
                      src={m.image}
                      alt={m.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-4 xl:p-5">
                    <h3 className="text-xs font-black uppercase leading-snug tracking-wide text-brand-dark xl:text-sm">
                      <StaticEditableText
                        value={m.title}
                        onChange={(value) => edit?.updateField(`milestones.${index}.title`, value)}
                      />
                    </h3>
                    <p className="mt-2 flex-1 text-[11px] leading-relaxed text-slate-500 xl:text-xs">
                      <StaticEditableText
                        value={m.desc}
                        onChange={(value) => edit?.updateField(`milestones.${index}.desc`, value)}
                        multiline
                      />
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

function WhyChooseSection({ content }: { content: AboutPageContent }) {
  const edit = useStaticPageAdminEdit();
  const whyChoose = content.whyChoose ?? DEFAULT_ABOUT_CONTENT.whyChoose ?? [];
  const { ref, reduced, initial, animate } = useSectionReveal(aboutViewport);

  return (
    <section className="section-y bg-surface-muted">
      <div className="container-vf">
        <AboutSectionHeader
          eyebrow="Trải nghiệm khác biệt"
          title="Vì sao lựa chọn VinFast Ngọc Anh Cà Mau?"
        />

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
              alt="Showroom VinFast Ngọc Anh Cà Mau"
              className="h-full w-full object-cover object-center"
              loading="lazy"
              whileHover={reduced ? undefined : { scale: 1.05 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            />
          </motion.div>

          <ul className="space-y-6">
            {whyChoose.map(({ title, desc }, index) => {
              const Icon = WHY_ICONS[index] ?? Award;
              return (
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
                      <StaticEditableText
                        value={title}
                        onChange={(value) => edit?.updateField(`whyChoose.${index}.title`, value)}
                      />
                    </h3>
                    <p className="mt-1.5 text-xs font-semibold leading-relaxed text-slate-400">
                      <StaticEditableText
                        value={desc}
                        onChange={(value) => edit?.updateField(`whyChoose.${index}.desc`, value)}
                        multiline
                      />
                    </p>
                  </div>
                </motion.li>
              );
            })}
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
