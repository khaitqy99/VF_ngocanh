"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Check,
  RotateCcw,
  Search,
  TrendingUp,
  Wallet,
  X,
  type LucideIcon,
} from "lucide-react";

import { Calendar } from "lucide-react";

import { MotionButton, MotionLinkButton } from "@/components/motion/MotionButton";
import { StaggerItem } from "@/components/motion";
import { formatPrice } from "@/lib/cars";
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
import { CAR_IMAGES } from "@/lib/cars";
import {
  carsBreadcrumb,
  carsEmptyState,
  carsEstimatorBlock,
  carsListHeader,
  carsPromoCard,
  carsPromoImage,
  carsSearchBar,
  carsTotalReveal,
  carsViewport,
  carsWhyIcon,
} from "@/lib/cars-motion";
import { aboutSectionEyebrow, aboutSectionHeader } from "@/lib/about-motion";
import { homeSectionRule, homeSectionTitle } from "@/lib/home-motion";
import { HOTLINE_TEL } from "@/lib/contact";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const sectionHeading =
  "text-center text-xl font-black leading-tight tracking-tight text-brand-dark sm:text-2xl md:text-3xl lg:text-4xl";

type SortKey = "newest" | "price-asc" | "price-desc" | "range-desc" | "power-desc";

export function CarsBreadcrumbBar() {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={reduced ? false : "hidden"}
      animate={reduced ? undefined : "visible"}
      variants={reduced ? undefined : carsBreadcrumb}
      className="border-b border-slate-200 bg-white"
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
                Danh mục Ô tô điện
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </motion.div>
  );
}

export function CarsSearchBar({
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
      animate={reduced ? undefined : "visible"}
      variants={reduced ? undefined : carsSearchBar}
      className="border-b border-slate-100 bg-white py-4 lg:sticky lg:top-14 lg:z-20"
    >
      <div className="container-vf flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xs font-black uppercase tracking-wider text-brand-dark">
          TÌM KIẾM DÒNG XE Ô TÔ ĐIỆN
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm xe (vd: VF 3, VF 8...)"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-xs font-medium text-slate-800 transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand"
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

export function CarsSectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={reduced ? false : "hidden"}
      whileInView={reduced ? undefined : "visible"}
      viewport={carsViewport}
      variants={reduced ? undefined : aboutSectionHeader}
      className="mx-auto mb-12 max-w-2xl text-center"
    >
      <motion.span
        variants={reduced ? undefined : aboutSectionEyebrow}
        className="inline-block rounded-full border border-brand/20 bg-brand/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-brand"
      >
        {eyebrow}
      </motion.span>
      <motion.h2
        variants={reduced ? undefined : homeSectionTitle}
        className={`${sectionHeading} mt-4`}
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          variants={reduced ? undefined : homeSectionRule}
          className="mt-3 text-xs leading-relaxed text-slate-500 md:text-sm"
        >
          {description}
        </motion.p>
      )}
      <motion.div
        variants={reduced ? undefined : homeSectionRule}
        className="mx-auto mt-4 h-1 w-16 origin-center rounded bg-brand"
        aria-hidden
      />
    </motion.div>
  );
}

export function CarsCatalogListHeader({
  count,
  sort,
  setSort,
}: {
  count: number;
  sort: SortKey;
  setSort: (v: SortKey) => void;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={reduced ? false : "hidden"}
      whileInView={reduced ? undefined : "visible"}
      viewport={carsViewport}
      variants={reduced ? undefined : carsListHeader}
      className="mb-6 flex flex-wrap items-center justify-between gap-4"
    >
      <div>
        <h2 className="flex items-center gap-2 text-base font-black uppercase tracking-wide text-brand-dark">
          <TrendingUp className="size-4 text-brand" />
          DANH SÁCH Ô TÔ ĐIỆN
        </h2>
        <p className="mt-1 text-xs font-bold text-slate-400">
          Đang hiển thị {count} dòng sản phẩm thông minh
        </p>
      </div>

      <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
        <SelectTrigger className="h-10 w-full border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:ring-brand sm:w-[200px]">
          <SelectValue placeholder="Sắp xếp" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Sắp xếp: Mới nhất</SelectItem>
          <SelectItem value="price-asc">Giá: Thấp đến cao</SelectItem>
          <SelectItem value="price-desc">Giá: Cao đến thấp</SelectItem>
          <SelectItem value="range-desc">Quãng đường: Xa nhất</SelectItem>
          <SelectItem value="power-desc">Công suất: Mạnh nhất</SelectItem>
        </SelectContent>
      </Select>
    </motion.div>
  );
}

export function CarsEmptyState({ onClear }: { onClear: () => void }) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={reduced ? false : "hidden"}
      animate={reduced ? undefined : "visible"}
      variants={reduced ? undefined : carsEmptyState}
      className="rounded-2xl border-2 border-dashed border-slate-200 bg-white py-20 text-center shadow-sm"
    >
      <AlertCircle className="mx-auto mb-4 size-12 text-slate-300" />
      <p className="text-sm font-black text-brand-dark">Không tìm thấy mẫu xe phù hợp</p>
      <p className="mt-2 text-xs text-slate-400">
        Vui lòng thay đổi tiêu chí bộ lọc của bạn hoặc làm mới bộ lọc.
      </p>
      <button
        type="button"
        onClick={onClear}
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-xs font-bold text-white shadow-soft transition-all hover:bg-brand-dark"
      >
        <RotateCcw className="size-3" /> Xóa bộ lọc & Tìm lại
      </button>
    </motion.div>
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
        className="group rounded-2xl border border-slate-200 bg-white p-4 text-center sm:p-6"
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

export function CarsPromoBanners() {
  const reduced = useReducedMotion();

  return (
    <section className="section-y border-y border-slate-100 bg-white">
      <div className="container-vf grid gap-6 sm:grid-cols-2">
        <StaggerItem variant="home" index={0}>
          <motion.div
            initial="rest"
            whileHover={reduced ? undefined : "hover"}
            variants={reduced ? undefined : carsPromoCard}
            className="group relative flex min-h-[220px] overflow-hidden rounded-2xl border border-slate-100"
          >
            <motion.img
              src={CAR_IMAGES.promoTestDrive}
              alt="Showroom VF Ngọc Anh Cà Mau — Đăng ký lái thử"
              className="absolute inset-0 h-full w-full object-cover object-[65%_center] sm:object-right"
              variants={reduced ? undefined : carsPromoImage}
            />
            <div className="absolute inset-0 bg-brand-dark/75 sm:bg-gradient-to-r sm:from-brand-dark/95 sm:via-brand-dark/80 sm:to-transparent" />
            <div className="relative z-10 flex max-w-sm flex-col justify-center p-6 text-white md:p-8">
              <span className="mb-3 self-start rounded bg-accent-yellow px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-slate-900">
                Hot Showroom
              </span>
              <h3 className="text-xl font-black uppercase leading-tight">
                Đăng ký lái thử ngay hôm nay
              </h3>
              <p className="mt-2 text-xs font-medium leading-relaxed text-slate-300">
                Trải nghiệm thực tế các dòng xe điện thông minh hoàn toàn miễn phí tại Showroom
                VinFast Ngọc Anh. Quà tặng check-in hấp dẫn.
              </p>
              <MotionLinkButton
                href={HOTLINE_TEL}
                className="mt-5 self-center rounded-lg bg-brand px-5 py-2.5 text-center text-[11px] font-extrabold tracking-wider text-white hover:bg-blue-600"
              >
                GỌI ĐĂNG KÝ NGAY
              </MotionLinkButton>
            </div>
          </motion.div>
        </StaggerItem>

        <StaggerItem variant="home" index={1}>
          <motion.div
            initial="rest"
            whileHover={reduced ? undefined : "hover"}
            variants={reduced ? undefined : carsPromoCard}
            className="relative flex min-h-[220px] flex-col justify-center overflow-hidden rounded-2xl border border-brand/10 bg-slate-50 p-6 md:p-8"
          >
            <div className="absolute top-4 right-4 hidden opacity-10 sm:block">
              <Wallet className="size-24 text-brand" strokeWidth={1} />
            </div>
            <div className="relative z-10">
              <span className="mb-3 inline-block rounded border border-brand/10 bg-brand/20 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-brand">
                Hỗ trợ tài chính
              </span>
              <h3 className="text-xl font-black uppercase leading-tight text-brand-dark">
                Hỗ trợ trả góp linh hoạt lãi suất thấp
              </h3>
              <ul className="mt-4 space-y-2 text-xs font-semibold text-slate-600">
                {[
                  "Tỷ lệ duyệt hồ sơ 99%, liên kết tất cả ngân hàng lớn.",
                  "Ưu đãi lãi suất đột phá chỉ từ 5,9%/năm cố định.",
                  "Thủ tục chỉ cần CCCD, giải ngân thần tốc trong ngày.",
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

export function CarsWhyVinFastSection({
  items,
}: {
  items: readonly { icon: LucideIcon; title: string; desc: string }[];
}) {
  return (
    <section className="section-y border-b border-slate-200 bg-white">
      <div className="container-vf">
        <CarsSectionHeader
          eyebrow="Tiêu chí xanh toàn cầu"
          title="VÌ SAO NÊN CHỌN Ô TÔ ĐIỆN VINFAST?"
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

export function EstimatorMotionShell({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={carsViewport}
      variants={carsEstimatorBlock}
    >
      {children}
    </motion.div>
  );
}

export function EstimatorTotalFooter({
  estimatorTab,
  rollingTotal,
  firstMonthTotal,
  avgMonthly,
  onBook,
}: {
  estimatorTab: "rolling" | "installment";
  rollingTotal: number;
  firstMonthTotal: number;
  avgMonthly: number;
  onBook: () => void;
}) {
  const reduced = useReducedMotion();
  const totalKey =
    estimatorTab === "rolling" ? `rolling-${rollingTotal}` : `installment-${firstMonthTotal}`;

  return (
    <div className="mt-8 border-t border-slate-200 pt-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <motion.div
          key={totalKey}
          initial={reduced ? false : "hidden"}
          animate={reduced ? undefined : "visible"}
          variants={reduced ? undefined : carsTotalReveal}
        >
          {estimatorTab === "rolling" ? (
            <>
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                TỔNG CHI PHÍ LĂN BÁNH DỰ KIẾN
              </p>
              <p className="mt-1 text-2xl font-black text-brand md:text-3xl">
                {formatPrice(rollingTotal)}{" "}
                <span className="text-sm font-semibold text-slate-500">VNĐ</span>
              </p>
            </>
          ) : (
            <>
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                THANH TOÁN THÁNG ĐẦU (ƯỚC TÍNH)
              </p>
              <p className="mt-1 text-2xl font-black text-brand md:text-3xl">
                {formatPrice(firstMonthTotal)}{" "}
                <span className="text-sm font-semibold text-slate-500">VNĐ/Tháng</span>
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                Trung bình chi trả hàng tháng: ~{formatPrice(avgMonthly)} đ
              </p>
            </>
          )}
        </motion.div>

        <MotionButton
          type="button"
          onClick={onBook}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-6 py-4 text-xs font-extrabold tracking-wider text-white shadow-lg hover:bg-blue-600 sm:w-auto"
        >
          <Calendar className="size-4" /> ĐĂNG KÝ NHẬN ƯU ĐÃI NGAY
        </MotionButton>
      </div>
    </div>
  );
}
