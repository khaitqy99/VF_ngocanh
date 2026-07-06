"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, RotateCcw, Search, TrendingUp, Wallet, X, type LucideIcon } from "lucide-react";

import { MotionLinkButton } from "@/components/motion/MotionButton";
import { StaggerItem } from "@/components/motion";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SCOOTER_IMAGES, formatPrice } from "@/lib/scooters";
import {
  carsBreadcrumb,
  carsEmptyState,
  carsListHeader,
  carsPromoCard,
  carsPromoImage,
  carsSearchBar,
  carsWhyIcon,
} from "@/lib/cars-motion";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { HOTLINE_TEL } from "@/lib/contact";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useSectionReveal } from "@/hooks/use-section-reveal";

export {
  CarsEmptyState as ScootersEmptyState,
  CarsSectionHeader as ScootersSectionHeader,
  EstimatorMotionShell,
  EstimatorTotalFooter,
} from "@/components/cars/CarsAnimatedSections";
import { vfPanelTitle } from "@/lib/typography";

type SortKey = "newest" | "price-asc" | "price-desc" | "range-desc" | "speed-desc";

function listTitle(segmentTab: string) {
  if (segmentTab === "student") return "XE ĐIỆN HỌC ĐƯỜNG";
  if (segmentTab === "urban") return "DÒNG XE PHỔ THÔNG";
  if (segmentTab === "premium") return "XE GA CAO CẤP FLAGSHIP";
  return "DANH SÁCH SẢN PHẨM";
}

export function ScootersBreadcrumbBar() {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={reduced ? false : "hidden"}
      animate="visible"
      variants={reduced ? undefined : carsBreadcrumb}
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
                Danh mục Xe máy điện
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </motion.div>
  );
}

export function ScootersSearchBar({
  searchQuery,
  setSearchQuery,
}: {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.section
      initial={reduced ? false : "hidden"}
      animate="visible"
      variants={reduced ? undefined : carsSearchBar}
      className="border-b border-slate-100 bg-white py-4 lg:sticky lg:top-14 lg:z-20"
    >
      <div className="container-vf flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xs font-black uppercase tracking-wider text-brand-dark">
          TÌM KIẾM DÒNG XE MÁY ĐIỆN
        </div>
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm tên xe ga, xe máy điện..."
            className="w-full rounded-lg border border-slate-200 bg-surface-muted py-2 pl-10 pr-4 text-xs font-medium text-slate-800 transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>
    </motion.section>
  );
}

export function ScootersCatalogListHeader({
  count,
  sort,
  setSort,
  segmentTab,
}: {
  count: number;
  sort: SortKey;
  setSort: (v: SortKey) => void;
  segmentTab: string;
}) {
  const { ref, reduced, initial, animate } = useSectionReveal({ once: true, amount: 0.15 });

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={animate}
      variants={reduced ? undefined : carsListHeader}
      className="mb-6 flex flex-wrap items-center justify-between gap-4"
    >
      <div>
        <h2 className="flex items-center gap-2 text-base font-black uppercase tracking-wide text-brand-dark">
          <TrendingUp className="size-4 text-brand" />
          {listTitle(segmentTab)}
        </h2>
        <p className="mt-1 text-xs font-bold text-slate-400">
          Đang hiển thị {count} xe máy điện thông minh
        </p>
      </div>
      <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
        <SelectTrigger className="h-10 w-full border-slate-200 bg-white text-xs font-semibold text-slate-700 shadow-sm focus:ring-brand sm:w-[200px]">
          <SelectValue placeholder="Sắp xếp" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Sắp xếp: Mới nhất</SelectItem>
          <SelectItem value="price-asc">Giá: Thấp đến cao</SelectItem>
          <SelectItem value="price-desc">Giá: Cao đến thấp</SelectItem>
          <SelectItem value="range-desc">Quãng đường: Xa nhất</SelectItem>
          <SelectItem value="speed-desc">Tốc độ: Cao nhất</SelectItem>
        </SelectContent>
      </Select>
    </motion.div>
  );
}

export function ScootersPromoBanners() {
  const reduced = useReducedMotion();

  return (
    <section className="section-y border-y border-slate-100 bg-white">
      <div className="container-vf grid gap-6 sm:grid-cols-2">
        <StaggerItem variant="home" index={0}>
          <motion.div
            initial="rest"
            whileHover={reduced ? undefined : "hover"}
            variants={reduced ? undefined : carsPromoCard}
            className="group relative flex min-h-[220px] overflow-hidden rounded-2xl border border-slate-100 shadow-md"
          >
            <motion.img
              src={SCOOTER_IMAGES.promoTestDrive}
              alt="Xe máy điện VinFast — Trải nghiệm lái thử tại Showroom VF Ngọc Anh"
              className="absolute inset-0 h-full w-full object-cover object-right"
              variants={reduced ? undefined : carsPromoImage}
            />
            <div className="absolute inset-0 bg-brand-dark/75 sm:bg-gradient-to-r sm:from-brand-dark/90 sm:via-brand-dark/65 sm:to-transparent" />
            <div className="relative z-10 flex max-w-sm flex-col justify-center p-6 text-white md:p-8">
              <span className="mb-3 self-start rounded bg-accent-yellow px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-slate-900">
                Lái thử miễn phí
              </span>
              <h3 className={`${vfPanelTitle} text-white`}>Hành trình xanh — Lái thử ngay</h3>
              <p className="mt-2 text-xs font-medium leading-relaxed text-slate-300">
                Trải nghiệm khả năng tăng tốc mượt mà, công nghệ định vị thông minh của xe máy điện
                VinFast tại Showroom VF Ngọc Anh hoàn toàn miễn phí.
              </p>
              <MotionLinkButton
                href={HOTLINE_TEL}
                className="home-cta-primary mt-5 self-center rounded-full px-5 py-2.5 text-center text-[11px] font-semibold tracking-wide text-white transition hover:bg-[#0046cc]"
              >
                LIÊN HỆ SHOWROOM NGAY
              </MotionLinkButton>
            </div>
          </motion.div>
        </StaggerItem>

        <StaggerItem variant="home" index={1}>
          <motion.div
            initial="rest"
            whileHover={reduced ? undefined : "hover"}
            variants={reduced ? undefined : carsPromoCard}
            className="relative flex min-h-[220px] flex-col justify-center overflow-hidden rounded-2xl border border-brand/10 bg-gradient-to-br from-blue-50/70 via-indigo-50/30 to-white p-6 shadow-soft md:p-8"
          >
            <div className="absolute top-4 right-4 opacity-15">
              <Wallet className="size-24 text-brand" strokeWidth={1} />
            </div>
            <div className="relative z-10">
              <span className="mb-3 inline-block rounded border border-brand/10 bg-brand/20 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-brand">
                Chính sách trả góp
              </span>
              <h3 className={`${vfPanelTitle} text-brand-dark`}>
                Trả góp 0% lãi suất — Không lo tài chính
              </h3>
              <ul className="mt-4 space-y-2 text-xs font-semibold text-slate-600">
                {[
                  "Lãi suất ưu đãi đặc biệt 0% trong suốt thời gian trả góp.",
                  "Thủ tục đơn giản chỉ với CCCD, duyệt hồ sơ nhanh chóng.",
                  "Hỗ trợ trả góp linh hoạt qua tất cả ngân hàng lớn.",
                ].map((line) => (
                  <li key={line} className="flex items-start gap-2">
                    <Check size={14} className="mt-0.5 shrink-0 text-emerald-500" strokeWidth={3} />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
              <MotionLinkButton
                href={HOTLINE_TEL}
                className="mx-auto mt-5 block w-fit rounded-lg border border-brand bg-white px-5 py-2.5 text-center text-[11px] font-extrabold tracking-wider text-brand transition-all hover:bg-brand hover:text-white"
              >
                GỌI TƯ VẤN TRẢ GÓP
              </MotionLinkButton>
            </div>
          </motion.div>
        </StaggerItem>
      </div>
    </section>
  );
}

function WhyCard({
  icon: Icon,
  title,
  desc,
  index,
}: {
  icon: LucideIcon;
  title: string;
  desc: string;
  index: number;
}) {
  const reduced = useReducedMotion();

  return (
    <StaggerItem variant="home" index={index}>
      <motion.div
        initial="rest"
        whileHover={reduced ? undefined : "hover"}
        variants={reduced ? undefined : carsPromoCard}
        className="page-section-card group p-4 text-center sm:p-6"
      >
        <motion.div
          variants={reduced ? undefined : carsWhyIcon}
          className="mx-auto flex size-10 items-center justify-center rounded-xl border border-brand/20 bg-brand/10 text-brand sm:size-12"
        >
          <Icon className="size-5 text-brand sm:size-6" strokeWidth={1.5} />
        </motion.div>
        <h3 className="mt-3 text-[11px] font-black uppercase text-brand-dark sm:mt-4 sm:text-sm">
          {title}
        </h3>
        <p className="mt-1.5 text-[10px] font-medium leading-relaxed text-slate-400 sm:mt-2 sm:text-xs">
          {desc}
        </p>
      </motion.div>
    </StaggerItem>
  );
}

export function ScootersWhyVinFastSection({
  items,
}: {
  items: readonly { icon: LucideIcon; title: string; desc: string }[];
}) {
  return (
    <section className="section-y border-b border-border/60 bg-background">
      <div className="container-vf">
        <SectionHeader
          align="centered"
          eyebrow="Tiêu chí xanh đô thị"
          title="Vì sao chọn xe máy điện VinFast?"
          className="mb-12"
        />
        <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-8">
          {items.map((item, index) => (
            <WhyCard key={item.title} {...item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
