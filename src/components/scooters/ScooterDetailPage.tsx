"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast, Toaster } from "sonner";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Gauge,
  Zap,
  Timer,
  Wind,
  BatteryCharging,
  Package,
  Scale,
  Bike,
  MapPin,
  Shield,
  Headphones,
  Wallet,
  Mic,
  Download,
  Smartphone,
  Monitor,
  Navigation,
  Settings2,
  Battery,
  Star,
  ArrowRight,
  X,
  ZoomIn,
  Calendar,
  Calculator,
  Percent,
  Info,
  Phone,
  ChevronDown,
  Share2,
} from "lucide-react";

import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import FloatingButtons from "@/components/site/FloatingButtons";
import { ScooterCatalogCard } from "@/components/scooters/ScooterCatalogCard";
import { AccessoryProductCard } from "@/components/accessories/AccessoryProductCard";
import { getScooterDetailAccessories } from "@/lib/accessories";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type ScooterDetail,
  formatPrice,
  getRelatedScooters,
  type TechFeature,
} from "@/lib/scooter-details";
import { HOTLINE, HOTLINE_TEL } from "@/lib/contact";
import {
  detailBreadcrumb,
  detailGalleryImage,
  detailHeroCol,
  detailHeroStagger,
  detailPricePulse,
  detailRelatedCard,
  detailServiceItem,
  detailThumbDot,
  detailViewport,
} from "@/lib/detail-motion";
import { modalVariants, overlayVariants } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { PdpSectionNav } from "@/components/shared/PdpSectionNav";
import { PdpHeroHeader } from "@/components/shared/PdpHeroHeader";
import { PdpSection } from "@/components/shared/PdpSectionShell";
import {
  PdpQuickSpecBar,
  PdpSectionTitle,
  PdpSplitOverview,
  PdpImageFeatureGrid,
  PdpTechIconGrid,
  PdpPerformanceShowcase,
  PdpSafetyShowcase,
  PdpChargingShowcase,
  buildScooterPerformanceMetrics,
  DEFAULT_CHARGING_SOLUTIONS,
  expandGalleryToGrid,
} from "@/components/shared/PdpContentBlocks";
import { IMAGES } from "@/lib/images";

type SectionId =
  | "tong-quan"
  | "ngoai-that"
  | "thiet-ke"
  | "cong-nghe"
  | "van-hanh"
  | "an-toan"
  | "pin-sac"
  | "thong-so"
  | "phu-kien"
  | "tai-chinh"
  | "danh-gia";

const SERVICE_BAR = [
  { icon: Shield, title: "Bảo hành chính hãng", sub: "Lên tới 5 năm hoặc 30.000 km" },
  { icon: Headphones, title: "Cứu hộ 24/7", sub: HOTLINE },
  { icon: MapPin, title: "Showroom Cà Mau", sub: "Tư vấn & giao xe tận nơi" },
  { icon: Wallet, title: "Hỗ trợ tài chính", sub: "Trả góp 0%, lãi suất thấp" },
] as const;

const PROVINCES = [
  { id: "camau", name: "Cà Mau & tỉnh khác", rate: 0.02 },
  { id: "hanoi", name: "Hà Nội (Lệ phí biển 2–4 triệu)", rate: 0.05 },
  { id: "hcm", name: "TP. HCM (Lệ phí biển 2–4 triệu)", rate: 0.05 },
  { id: "other", name: "Tỉnh/Thành phố khác", rate: 0.02 },
] as const;

const TECH_ICONS: Record<TechFeature["icon"], React.ElementType> = {
  voice: Mic,
  fota: Download,
  app: Smartphone,
  gps: Navigation,
  screen: Monitor,
  drive: Settings2,
  battery: Battery,
};

const sectionHeading = "text-xl font-black tracking-tight text-brand-dark sm:text-2xl lg:text-3xl";

type Props = { detail: ScooterDetail };

export default function ScooterDetailPage({ detail }: Props) {
  const router = useRouter();
  const reduced = useReducedMotion();
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(
    detail.variants[Math.min(1, detail.variants.length - 1)]?.id ?? detail.variants[0].id,
  );
  const [selectedColor, setSelectedColor] = useState(detail.colors[0]?.id ?? "color-0");
  const [batteryMode, setBatteryMode] = useState<"rent" | "purchase">("rent");
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingService, setBookingService] = useState("Đăng ký lái thử");
  const [bookingForm, setBookingForm] = useState({ name: "", phone: "", email: "" });
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);
  const thumbStripRef = useRef<HTMLDivElement>(null);

  const [estimatorLocation, setEstimatorLocation] = useState("camau");
  const [estimatorTab, setEstimatorTab] = useState<"rolling" | "installment">("rolling");
  const [downPaymentPct, setDownPaymentPct] = useState(30);
  const [loanTermYears, setLoanTermYears] = useState(5);
  const [interestRate, setInterestRate] = useState(5.9);

  const variant = detail.variants.find((v) => v.id === selectedVariant) ?? detail.variants[0];
  const selectedColorObj = detail.colors.find((c) => c.id === selectedColor) ?? detail.colors[0];
  const related = getRelatedScooters(detail.id);

  const sectionNavItems = useMemo(
    () => [
      { id: "tong-quan" as const, label: "Tổng quan" },
      { id: "ngoai-that" as const, label: "Ngoại thất" },
      { id: "thiet-ke" as const, label: "Thiết kế" },
      { id: "cong-nghe" as const, label: "Công nghệ" },
      { id: "van-hanh" as const, label: "Vận hành" },
      { id: "an-toan" as const, label: "An toàn" },
      { id: "pin-sac" as const, label: "Pin & Sạc" },
      { id: "thong-so" as const, label: "Thông số" },
      { id: "phu-kien" as const, label: "Phụ kiện" },
      { id: "tai-chinh" as const, label: "Tài chính" },
    ],
    [],
  );

  const quickSpecItems = useMemo(
    () => [
      { icon: Gauge, label: "Quãng đường", value: `${detail.quickSpecs.range} km` },
      { icon: Zap, label: "Tốc độ tối đa", value: `${detail.quickSpecs.topSpeed} km/h` },
      { icon: Bike, label: "Công suất", value: `${detail.quickSpecs.motorPower} W` },
      {
        icon: Package,
        label: "Cốp xe",
        value: detail.quickSpecs.trunk > 0 ? `${detail.quickSpecs.trunk} lít` : "Móc treo",
      },
      { icon: Scale, label: "Trọng lượng", value: `${detail.quickSpecs.weight} kg` },
      {
        icon: BatteryCharging,
        label: "Thời gian sạc",
        value: detail.quickSpecs.chargingTime.split(" (")[0],
      },
    ],
    [detail.quickSpecs],
  );

  const basePrice =
    batteryMode === "purchase" ? variant.price + detail.batteryPurchasePrice : variant.price;

  const rollingCost = useMemo(() => {
    const province = PROVINCES.find((p) => p.id === estimatorLocation) ?? PROVINCES[0];
    const registrationTax = Math.round(basePrice * province.rate);

    let plateFee = 150_000;
    if (province.id === "hanoi" || province.id === "hcm") {
      if (basePrice < 15_000_000) plateFee = 1_000_000;
      else if (basePrice <= 40_000_000) plateFee = 2_000_000;
      else plateFee = 4_000_000;
    } else if (basePrice < 15_000_000) plateFee = 150_000;
    else if (basePrice <= 40_000_000) plateFee = 400_000;
    else plateFee = 800_000;

    const inspectionFee = 100_000;
    const civilInsurance = 66_000;
    const totalRolling = basePrice + registrationTax + plateFee + inspectionFee + civilInsurance;

    return { registrationTax, plateFee, inspectionFee, civilInsurance, totalRolling };
  }, [basePrice, estimatorLocation]);

  const installment = useMemo(() => {
    const totalCost = rollingCost.totalRolling;
    const loanAmount = Math.round((totalCost * downPaymentPct) / 100);
    const upfrontAmount = totalCost - loanAmount;
    const monthlyRate = interestRate / 100 / 12;
    const months = loanTermYears * 12;
    const firstMonthInterest = Math.round(loanAmount * monthlyRate);
    const firstMonthPrincipal = Math.round(loanAmount / months);
    const firstMonthTotal = firstMonthInterest + firstMonthPrincipal;
    let totalPaid = 0;
    let tempLoan = loanAmount;
    for (let m = 0; m < months; m++) {
      const interest = tempLoan * monthlyRate;
      totalPaid += firstMonthPrincipal + interest;
      tempLoan -= firstMonthPrincipal;
    }
    const avgMonthlyPayment = Math.round(totalPaid / months);
    return {
      upfrontAmount,
      loanAmount,
      firstMonthInterest,
      firstMonthPrincipal,
      firstMonthTotal,
      avgMonthlyPayment,
    };
  }, [rollingCost.totalRolling, downPaymentPct, loanTermYears, interestRate]);

  const scrollToSection = useCallback((id: SectionId) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const prevImage = () => setActiveImage((i) => (i === 0 ? detail.gallery.length - 1 : i - 1));
  const nextImage = () => setActiveImage((i) => (i === detail.gallery.length - 1 ? 0 : i + 1));

  const scrollThumbs = useCallback((direction: -1 | 1) => {
    const el = thumbStripRef.current;
    if (!el) return;
    const thumb = el.querySelector<HTMLElement>("button");
    const step = thumb ? thumb.offsetWidth + 8 : 80;
    el.scrollBy({ left: direction * step * 3, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const el = thumbStripRef.current;
    const active = el?.children[activeImage] as HTMLElement | undefined;
    active?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [activeImage]);

  const openBooking = (service: string) => {
    setBookingService(service);
    setBookingSubmitted(false);
    setBookingOpen(true);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.name || !bookingForm.phone) {
      toast.error("Vui lòng nhập họ tên và số điện thoại");
      return;
    }
    setBookingSubmitted(true);
    toast.success("Gửi yêu cầu thành công! Chúng tôi sẽ liên hệ sớm nhất.");
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-white pb-28 lg:pb-0">
      <Header />
      <Toaster position="top-center" richColors />
      <main>
        <BreadcrumbBar scooterName={detail.name} variantName={variant.name} reduced={reduced} />

        <PdpHeroHeader
          tagline={detail.tagline}
          name={detail.name}
          slogan={detail.slogan}
          badges={detail.badges}
          isNew={detail.isNew}
          isBestSeller={detail.isBestSeller}
        />

        {/* Hero */}
        <section className="relative overflow-x-hidden border-b border-border/40 bg-white">
          <div className="container-vf relative w-full min-w-0 py-6 sm:py-8 lg:py-10">
            <div className="grid w-full min-w-0 gap-6 lg:grid-cols-12 lg:gap-10">
              {/* Gallery */}
              <motion.div
                className="min-w-0 w-full lg:col-span-7"
                variants={reduced ? undefined : detailHeroStagger}
                initial={reduced ? false : "hidden"}
                animate={reduced ? undefined : "visible"}
              >
                <div className="relative w-full max-w-full overflow-hidden rounded-3xl bg-[#eef2f8] shadow-card ring-1 ring-border/40">
                  <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[16/10]">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={activeImage}
                        src={detail.gallery[activeImage]}
                        alt={`${detail.name} - ${selectedColorObj?.name ?? "ảnh"} ${activeImage + 1}`}
                        className="absolute inset-0 h-full w-full object-contain p-2 sm:p-4"
                        variants={reduced ? undefined : detailGalleryImage}
                        initial={reduced ? false : "enter"}
                        animate={reduced ? undefined : "center"}
                        exit={reduced ? undefined : "exit"}
                      />
                    </AnimatePresence>
                  </div>
                  <button
                    type="button"
                    onClick={() => setLightboxOpen(true)}
                    className="absolute top-3 right-3 flex items-center gap-1 rounded-lg border border-border/60 bg-white/90 px-2.5 py-1 text-[10px] font-bold text-brand-dark shadow-sm backdrop-blur transition hover:bg-white sm:top-4 sm:right-4 sm:gap-1.5 sm:px-3 sm:py-1.5"
                  >
                    <ZoomIn className="size-3.5" /> Phóng to
                  </button>
                  <button
                    type="button"
                    onClick={prevImage}
                    className="absolute top-1/2 left-2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white shadow-md transition hover:border-brand hover:text-brand sm:left-3 sm:size-10"
                    aria-label="Ảnh trước"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={nextImage}
                    className="absolute top-1/2 right-2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white shadow-md transition hover:border-brand hover:text-brand sm:right-3 sm:size-10"
                    aria-label="Ảnh sau"
                  >
                    <ChevronRight size={20} />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-dark/70 px-3 py-1 text-[10px] font-bold text-white backdrop-blur">
                    {activeImage + 1} / {detail.gallery.length}
                  </div>
                </div>

                <div className="relative mt-3">
                  <button
                    type="button"
                    onClick={() => scrollThumbs(-1)}
                    className="absolute top-1/2 left-0 z-10 flex size-7 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white shadow-md transition hover:border-brand hover:text-brand sm:size-8"
                    aria-label="Cuộn ảnh trước"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <div
                    ref={thumbStripRef}
                    className="flex gap-2 overflow-x-auto scroll-smooth px-9 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:px-10 [&::-webkit-scrollbar]:hidden"
                  >
                    {detail.gallery.map((img, i) => (
                      <motion.button
                        key={i}
                        type="button"
                        onClick={() => setActiveImage(i)}
                        animate={reduced ? undefined : activeImage === i ? "active" : "inactive"}
                        variants={reduced ? undefined : detailThumbDot}
                        className={`relative size-14 shrink-0 overflow-hidden rounded-lg border-2 sm:size-[72px] sm:rounded-xl ${
                          activeImage === i
                            ? "border-brand ring-2 ring-brand/20"
                            : "border-border/40 hover:border-border"
                        }`}
                      >
                        <img
                          src={img}
                          alt=""
                          className="h-full w-full object-contain bg-[#f4f6fa] p-0.5"
                        />
                      </motion.button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => scrollThumbs(1)}
                    className="absolute top-1/2 right-0 z-10 flex size-7 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white shadow-md transition hover:border-brand hover:text-brand sm:size-8"
                    aria-label="Cuộn ảnh sau"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>

                <PdpQuickSpecBar specs={quickSpecItems} embedded />
              </motion.div>

              {/* Purchase panel — sticky on desktop */}
              <motion.div
                className="min-w-0 w-full lg:col-span-5"
                variants={reduced ? undefined : detailHeroCol}
                initial={reduced ? false : "hidden"}
                animate={reduced ? undefined : "visible"}
              >
                <div className="box-border w-full min-w-0 max-w-full rounded-3xl border border-border/50 bg-white p-4 shadow-card ring-1 ring-black/[0.03] sm:p-5 lg:sticky lg:top-[8.75rem] lg:p-6">
                  <div className="flex items-start justify-between gap-2 sm:gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-semibold text-muted-foreground sm:text-[10px] sm:font-bold sm:uppercase sm:tracking-wider">
                        Giá bán từ (chưa pin)
                      </p>
                      <div className="mt-0.5">
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={selectedVariant}
                            variants={reduced ? undefined : detailPricePulse}
                            initial={reduced ? false : "hidden"}
                            animate={reduced ? undefined : "visible"}
                            className="block break-all text-lg font-black tabular-nums leading-tight text-brand sm:inline sm:break-normal sm:text-2xl lg:text-4xl"
                          >
                            {formatPrice(variant.price)}
                          </motion.span>
                        </AnimatePresence>
                        <span className="mt-0.5 block text-xs font-bold text-muted-foreground sm:mt-0 sm:ml-1.5 sm:inline sm:text-base">
                          VND
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => toast.info("Chức năng chia sẻ sẽ sớm có mặt")}
                      className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition hover:border-brand hover:text-brand"
                      aria-label="Chia sẻ"
                    >
                      <Share2 className="size-4" />
                    </button>
                  </div>

                  {/* Quick highlights — desktop only */}
                  <div className="mt-4 hidden grid-cols-3 gap-2 rounded-xl bg-surface p-3 lg:grid">
                    <HighlightStat
                      icon={Gauge}
                      value={`${detail.quickSpecs.range} km`}
                      label="Quãng đường"
                    />
                    <HighlightStat
                      icon={Zap}
                      value={`${detail.quickSpecs.topSpeed}`}
                      label="km/h tối đa"
                    />
                    <HighlightStat
                      icon={Package}
                      value={
                        detail.quickSpecs.trunk > 0 ? `${detail.quickSpecs.trunk}L` : "Móc treo"
                      }
                      label="Cốp xe"
                    />
                  </div>

                  {/* Mobile config toggle */}
                  <button
                    type="button"
                    onClick={() => setConfigOpen((o) => !o)}
                    className="mt-4 flex w-full items-center justify-between gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-left transition hover:border-brand/40 lg:hidden"
                    aria-expanded={configOpen}
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-brand-dark">Cấu hình xe</p>
                      <p className="mt-0.5 truncate text-[11px] font-medium text-muted-foreground">
                        {variant.name} · {selectedColorObj?.name} ·{" "}
                        {batteryMode === "rent" ? "Thuê pin" : "Mua pin"}
                      </p>
                    </div>
                    <ChevronDown
                      className={`size-4 shrink-0 text-muted-foreground transition ${configOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  <div
                    className={`mt-4 space-y-4 ${configOpen ? "block" : "hidden"} lg:mt-6 lg:block lg:space-y-6`}
                  >
                    {/* Variants */}
                    <div>
                      <p className="mb-2.5 text-[11px] font-semibold text-brand-dark sm:mb-3 sm:text-[10px] sm:font-bold sm:uppercase sm:tracking-wider">
                        Chọn phiên bản
                      </p>
                      <div className="space-y-2">
                        {detail.variants.map((v) => {
                          const selected = selectedVariant === v.id;
                          return (
                            <button
                              key={v.id}
                              type="button"
                              onClick={() => setSelectedVariant(v.id)}
                              className={`flex w-full flex-col gap-1 rounded-xl border-2 px-3 py-2.5 text-left transition lg:flex-row lg:items-center lg:justify-between lg:px-4 lg:py-3 ${
                                selected
                                  ? "border-brand bg-brand/5 shadow-sm"
                                  : "border-border hover:border-brand/40"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span
                                  className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${
                                    selected ? "border-brand bg-brand" : "border-border"
                                  }`}
                                >
                                  {selected && <Check size={12} className="text-white" />}
                                </span>
                                <span className="text-sm font-semibold text-brand-dark">
                                  {v.name}
                                </span>
                              </div>
                              <span className="pl-8 text-xs font-bold tabular-nums text-muted-foreground lg:pl-0">
                                {formatPrice(v.price)} đ
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Colors */}
                    <div>
                      <p className="mb-2.5 text-[11px] font-semibold text-brand-dark sm:mb-3 sm:text-[10px] sm:font-bold sm:uppercase sm:tracking-wider">
                        Chọn màu sắc
                      </p>
                      <div className="flex flex-wrap gap-2.5 sm:gap-3">
                        {detail.colors.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            title={c.name}
                            onClick={() => setSelectedColor(c.id)}
                            className={`size-8 rounded-full border-2 transition sm:size-9 ${
                              selectedColor === c.id
                                ? "border-brand ring-2 ring-brand/30 ring-offset-2"
                                : "border-border hover:border-brand/50"
                            }`}
                            style={{ backgroundColor: c.hex }}
                            aria-label={c.name}
                          />
                        ))}
                      </div>
                      <p className="mt-2 text-xs font-medium text-muted-foreground">
                        {selectedColorObj?.name}
                      </p>
                    </div>

                    {/* Battery mode */}
                    <div>
                      <p className="mb-2.5 text-[11px] font-semibold text-brand-dark sm:mb-3 sm:text-[10px] sm:font-bold sm:uppercase sm:tracking-wider">
                        Hình thức pin
                      </p>
                      <div className="flex flex-col gap-2 sm:grid sm:grid-cols-2">
                        <button
                          type="button"
                          onClick={() => setBatteryMode("rent")}
                          className={`rounded-xl border-2 px-3 py-2.5 text-left transition sm:py-3 ${
                            batteryMode === "rent"
                              ? "border-brand bg-brand/5"
                              : "border-border hover:border-brand/40"
                          }`}
                        >
                          <p className="text-xs font-bold text-brand-dark">Thuê pin</p>
                          <p className="mt-0.5 text-[11px] tabular-nums text-muted-foreground sm:text-[10px]">
                            {formatPrice(detail.rentBatteryPrice)} đ/tháng
                          </p>
                        </button>
                        <button
                          type="button"
                          onClick={() => setBatteryMode("purchase")}
                          className={`rounded-xl border-2 px-3 py-2.5 text-left transition sm:py-3 ${
                            batteryMode === "purchase"
                              ? "border-brand bg-brand/5"
                              : "border-border hover:border-brand/40"
                          }`}
                        >
                          <p className="text-xs font-bold text-brand-dark">Mua pin</p>
                          <p className="mt-0.5 text-[11px] tabular-nums text-muted-foreground sm:text-[10px]">
                            +{formatPrice(detail.batteryPurchasePrice)} đ
                          </p>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Estimated rolling cost preview */}
                  <div className="mt-4 w-full min-w-0 rounded-xl border border-brand/20 bg-brand/5 p-3 sm:mt-5 sm:p-4">
                    <p className="text-[11px] font-semibold text-brand sm:text-[10px] sm:font-bold sm:uppercase sm:tracking-wider">
                      Chi phí lăn bánh dự kiến
                    </p>
                    <div className="mt-1">
                      <span className="block break-all text-base font-black tabular-nums leading-tight text-brand-dark sm:inline sm:break-normal sm:text-xl">
                        {formatPrice(rollingCost.totalRolling)}
                      </span>
                      <span className="mt-0.5 block text-xs font-semibold text-muted-foreground sm:mt-0 sm:ml-1.5 sm:inline">
                        VND
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => scrollToSection("tai-chinh")}
                      className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-brand hover:underline"
                    >
                      Xem chi tiết tính toán <ChevronDown className="size-3.5 rotate-[-90deg]" />
                    </button>
                  </div>

                  {/* CTAs */}
                  <div className="mt-6 hidden flex-col gap-2.5 lg:flex">
                    <button
                      type="button"
                      onClick={() => openBooking("Đặt mua ngay")}
                      className="w-full rounded-xl bg-brand py-3.5 text-xs font-black tracking-wide text-white shadow-lg transition hover:bg-[#0046cc]"
                    >
                      ĐẶT MUA NGAY
                    </button>
                    <button
                      type="button"
                      onClick={() => openBooking("Đăng ký lái thử")}
                      className="w-full rounded-xl border-2 border-brand bg-white py-3.5 text-xs font-black tracking-wide text-brand transition hover:bg-brand/5"
                    >
                      ĐĂNG KÝ LÁI THỬ
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <PdpSectionNav items={sectionNavItems} />

        {/* All content sections */}
        <div className="bg-white">
          <SectionWrap id="tong-quan">
            <OverviewSection detail={detail} />
          </SectionWrap>

          <SectionWrap id="ngoai-that" alt>
            <ExteriorSection detail={detail} />
          </SectionWrap>

          <SectionWrap id="thiet-ke">
            <DesignSection detail={detail} />
          </SectionWrap>

          <SectionWrap id="cong-nghe" alt>
            <TechnologySection detail={detail} />
          </SectionWrap>

          <SectionWrap id="van-hanh" alt>
            <PerformanceSection detail={detail} />
          </SectionWrap>

          <SectionWrap id="an-toan">
            <SafetySection detail={detail} />
          </SectionWrap>

          <SectionWrap id="pin-sac" alt>
            <ChargingSection detail={detail} />
          </SectionWrap>

          <SectionWrap id="thong-so">
            <SpecsSection detail={detail} />
          </SectionWrap>

          <SectionWrap id="phu-kien" alt>
            <AccessoriesSection detail={detail} />
          </SectionWrap>

          <SectionWrap id="tai-chinh">
            <FinanceSection
              detail={detail}
              variant={variant}
              batteryMode={batteryMode}
              setBatteryMode={setBatteryMode}
              estimatorLocation={estimatorLocation}
              setEstimatorLocation={setEstimatorLocation}
              estimatorTab={estimatorTab}
              setEstimatorTab={setEstimatorTab}
              downPaymentPct={downPaymentPct}
              setDownPaymentPct={setDownPaymentPct}
              loanTermYears={loanTermYears}
              setLoanTermYears={setLoanTermYears}
              interestRate={interestRate}
              setInterestRate={setInterestRate}
              rollingCost={rollingCost}
              installment={installment}
              onBook={() => openBooking("Nhận báo giá")}
            />
          </SectionWrap>

          <SectionWrap id="danh-gia" alt>
            <ReviewsSection detail={detail} />
          </SectionWrap>
        </div>

        {/* Related products */}
        <section className="section-y border-t border-border/40 bg-surface">
          <div className="container-vf">
            <h2 className={sectionHeading}>Sản phẩm liên quan</h2>
            <p className="mx-auto mt-2 max-w-lg text-center text-sm text-muted-foreground">
              Khám phá thêm các mẫu xe VinFast phù hợp với nhu cầu của bạn
            </p>
            <motion.div
              className="mt-8 grid grid-cols-2 items-stretch gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5"
              initial={reduced ? false : "hidden"}
              whileInView={reduced ? undefined : "visible"}
              viewport={detailViewport}
              variants={reduced ? undefined : { hidden: {}, visible: {} }}
            >
              {related.map((scooter, i) => (
                <motion.div
                  key={scooter.id}
                  custom={i}
                  variants={reduced ? undefined : detailRelatedCard}
                  className="h-full"
                >
                  <ScooterCatalogCard
                    scooter={scooter}
                    onBookDrive={() => openBooking(`Đặt mua ${scooter.name}`)}
                    onEstimatePrice={() => router.push(`/xe-may-dien/${scooter.id}#tai-chinh`)}
                  />
                </motion.div>
              ))}
            </motion.div>
            <div className="mt-8 text-center">
              <Link
                href="/xe-may-dien"
                className="inline-flex items-center gap-2 rounded-xl border border-brand bg-white px-6 py-3 text-xs font-bold tracking-wide text-brand transition hover:bg-brand/5"
              >
                Xem tất cả xe máy điện <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Service bar */}
        <section className="section-y border-t border-border/40 bg-white">
          <div className="container-vf">
            <motion.div
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
              initial={reduced ? false : "hidden"}
              whileInView={reduced ? undefined : "visible"}
              viewport={detailViewport}
              variants={reduced ? undefined : { hidden: {}, visible: {} }}
            >
              {SERVICE_BAR.map(({ icon: Icon, title, sub }, i) => (
                <motion.div
                  key={title}
                  custom={i}
                  variants={reduced ? undefined : detailServiceItem}
                  className="flex items-center gap-4 rounded-2xl border border-border/50 bg-surface p-4 transition hover:shadow-soft"
                >
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-brand/20 bg-brand/5">
                    <Icon className="size-5 text-brand" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-brand-dark">{title}</p>
                    <p className="text-[11px] text-muted-foreground">{sub}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Showroom CTA */}
        <section className="section-y bg-brand-dark text-white">
          <div className="container-vf flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
            <div className="flex-1">
              <h2 className="text-xl font-black sm:text-2xl">
                Trải nghiệm {detail.name} tại showroom
              </h2>
              <p className="mt-2 text-sm text-white/75">
                VF Ngọc Anh Cà Mau — Đại lý ủy quyền chính thức VinFast. Tư vấn tận tâm, giao xe
                nhanh chóng.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={HOTLINE_TEL}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-xs font-black text-brand-dark transition hover:bg-white/90"
              >
                <Phone className="size-4" /> Gọi {HOTLINE}
              </a>
              <button
                type="button"
                onClick={() => openBooking("Đăng ký lái thử")}
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/30 px-6 py-3 text-xs font-black text-white transition hover:bg-white/10"
              >
                <Calendar className="size-4" /> Đặt lịch lái thử
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingButtons />

      {/* Mobile sticky bar */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border/60 bg-white lg:hidden">
        <div className="flex items-center gap-2 p-3">
          <div className="min-w-0 shrink">
            <p className="text-[9px] font-bold tracking-wider text-muted-foreground uppercase">
              Giá từ
            </p>
            <p className="truncate text-sm font-black text-brand">{formatPrice(variant.price)} đ</p>
          </div>
          <button
            type="button"
            onClick={() => openBooking("Đăng ký lái thử")}
            className="flex-1 rounded-xl border-2 border-brand py-2.5 text-[11px] font-black text-brand"
          >
            LÁI THỬ
          </button>
          <button
            type="button"
            onClick={() => openBooking("Đặt mua ngay")}
            className="flex-1 rounded-xl bg-brand py-2.5 text-[11px] font-black text-white"
          >
            ĐẶT MUA
          </button>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={overlayVariants}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            >
              <X className="size-5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute top-1/2 left-4 flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white"
            >
              <ChevronLeft className="size-6" />
            </button>
            <motion.img
              key={activeImage}
              src={detail.gallery[activeImage]}
              alt={detail.name}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={modalVariants}
              className="max-h-[85vh] max-w-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute top-1/2 right-4 flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white"
            >
              <ChevronRight className="size-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking modal */}
      <AnimatePresence>
        {bookingOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={overlayVariants}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={() => setBookingOpen(false)}
          >
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={modalVariants}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[90vh] w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between bg-brand-dark p-5 text-white">
                <div>
                  <h3 className="text-sm font-black">{bookingService.toUpperCase()}</h3>
                  <p className="mt-1 text-[11px] text-white/75">
                    {variant.name} · {selectedColorObj?.name}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setBookingOpen(false)}
                  className="rounded-lg p-1 hover:bg-white/10"
                >
                  <X className="size-5" />
                </button>
              </div>

              {bookingSubmitted ? (
                <div className="p-8 text-center">
                  <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100">
                    <Check className="size-8 text-emerald-600" />
                  </div>
                  <h4 className="mt-4 text-lg font-black text-brand-dark">
                    Gửi yêu cầu thành công!
                  </h4>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Cảm ơn {bookingForm.name}. Chúng tôi sẽ liên hệ qua {bookingForm.phone} trong
                    vòng 24 giờ.
                  </p>
                  <button
                    type="button"
                    onClick={() => setBookingOpen(false)}
                    className="mt-6 rounded-xl bg-brand px-6 py-3 text-xs font-bold text-white"
                  >
                    Đóng
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-4 p-6">
                  <div className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3">
                    <div className="size-14 shrink-0 overflow-hidden rounded-lg">
                      <img
                        src={detail.image}
                        alt={detail.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-brand-dark">{detail.name}</p>
                      <p className="text-xs text-muted-foreground">{variant.name}</p>
                      <p className="text-xs font-bold text-brand">
                        {formatPrice(variant.price)} VND
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {["Đăng ký lái thử", "Đặt mua ngay", "Nhận báo giá", "Tư vấn trả góp"].map(
                      (svc) => (
                        <button
                          key={svc}
                          type="button"
                          onClick={() => setBookingService(svc)}
                          className={`rounded-lg border px-3 py-1.5 text-[11px] font-bold transition ${
                            bookingService === svc
                              ? "border-brand bg-brand/5 text-brand"
                              : "border-border text-muted-foreground hover:border-brand/40"
                          }`}
                        >
                          {svc}
                        </button>
                      ),
                    )}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold text-muted-foreground uppercase">
                      Họ và tên *
                    </label>
                    <input
                      required
                      value={bookingForm.name}
                      onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                      placeholder="Nguyễn Văn A"
                      className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold text-muted-foreground uppercase">
                      Số điện thoại *
                    </label>
                    <input
                      required
                      type="tel"
                      value={bookingForm.phone}
                      onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                      placeholder="09xx xxx xxx"
                      className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold text-muted-foreground uppercase">
                      Email (tùy chọn)
                    </label>
                    <input
                      type="email"
                      value={bookingForm.email}
                      onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                      placeholder="email@example.com"
                      className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-brand py-3.5 text-xs font-black tracking-wide text-white transition hover:bg-[#0046cc]"
                  >
                    GỬI YÊU CẦU
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Section wrappers & content ─── */

function SectionWrap({
  id,
  alt,
  dark,
  children,
}: {
  id: SectionId;
  alt?: boolean;
  dark?: boolean;
  children: React.ReactNode;
}) {
  const variant = dark ? "dark" : alt ? "muted" : "default";
  return (
    <PdpSection id={id} variant={variant}>
      {children}
    </PdpSection>
  );
}

const EXTERIOR_GRID_LABELS = [
  "Đầu xe ấn tượng",
  "Thân xe thon gọn",
  "Đuôi xe tinh tế",
  "Chi tiết thiết kế",
];

const DESIGN_GRID_LABELS = [
  "Không gian ngồi",
  "Cốp & tiện ích",
  "Bảng đồng hồ",
  "Chi tiết tiện nghi",
];

function OverviewSection({ detail }: { detail: ScooterDetail }) {
  const overviewImage = detail.overview.image || detail.gallery[0] || detail.image;

  return (
    <PdpSplitOverview
      eyebrow="Tổng quan"
      title={detail.overview.title}
      description={detail.overview.subtitle}
      bullets={detail.overview.bullets}
      image={overviewImage}
      imageAlt={detail.overview.title}
    />
  );
}

function ExteriorSection({ detail }: { detail: ScooterDetail }) {
  const items = expandGalleryToGrid(detail.exterior, EXTERIOR_GRID_LABELS);

  return (
    <>
      <PdpSectionTitle
        title="Ngoại thất"
        subtitle="Thiết kế ấn tượng, khí động học tối ưu"
        actionHref="#thong-so"
      />
      <PdpImageFeatureGrid items={items} />
    </>
  );
}

function DesignSection({ detail }: { detail: ScooterDetail }) {
  return (
    <>
      <PdpSectionTitle
        title="Thiết kế & Tiện nghi"
        subtitle="Thiết kế ergonomic, tiện dụng cho đô thị"
        actionHref="#thong-so"
      />
      <PdpImageFeatureGrid items={expandGalleryToGrid(detail.design, DESIGN_GRID_LABELS)} />
    </>
  );
}

function TechnologySection({ detail }: { detail: ScooterDetail }) {
  const items = detail.technology.map((item) => ({
    icon: TECH_ICONS[item.icon],
    title: item.title,
    desc: item.desc,
  }));

  return (
    <>
      <PdpSectionTitle title="Công nghệ thông minh" subtitle="Hệ sinh thái kết nối toàn diện" />
      <PdpTechIconGrid items={items} />
    </>
  );
}

function PerformanceSection({ detail }: { detail: ScooterDetail }) {
  const perfImage =
    detail.performance.image !== detail.image
      ? detail.performance.image
      : (detail.gallery[2] ?? detail.gallery[0] ?? detail.image);

  return (
    <>
      <PdpSectionTitle title={detail.performance.title} subtitle={detail.performance.subtitle} />
      <PdpPerformanceShowcase
        lead={detail.performance.subtitle}
        image={perfImage}
        imageAlt={detail.performance.title}
        metrics={buildScooterPerformanceMetrics(detail.quickSpecs)}
        driveModes={detail.performance.driveModes}
      />
    </>
  );
}

function safetyIconFor(title: string): React.ElementType {
  const t = title.toLowerCase();
  if (/đèn|led/i.test(t)) return Monitor;
  if (/phanh|abs/i.test(t)) return Shield;
  if (/va chạm|cảnh báo/i.test(t)) return Shield;
  if (/khóa|gps|chống trộm/i.test(t)) return Navigation;
  if (/khung|nước|ip67/i.test(t)) return Shield;
  return Shield;
}

function SafetySection({ detail }: { detail: ScooterDetail }) {
  const safetyImage =
    detail.safety.image !== detail.image
      ? detail.safety.image
      : (detail.gallery[1] ?? detail.gallery[0] ?? detail.image);

  const items = detail.safety.features.map((f) => ({
    icon: safetyIconFor(f.title),
    title: f.title,
    desc: f.desc,
  }));

  return (
    <>
      <PdpSectionTitle title={detail.safety.title} subtitle={detail.safety.subtitle} />
      <PdpSafetyShowcase
        title={detail.safety.title}
        subtitle={detail.safety.subtitle}
        image={safetyImage}
        imageAlt={detail.safety.title}
        highlights={detail.safety.highlights}
        features={items}
      />
    </>
  );
}

function ChargingSection({ detail }: { detail: ScooterDetail }) {
  const heroImage = detail.gallery[0] ?? detail.image;
  const solutions = DEFAULT_CHARGING_SOLUTIONS({
    station: IMAGES.chargingStations,
    home: IMAGES.chargingScooter,
    portable: IMAGES.portableCharger,
  });

  return (
    <PdpChargingShowcase
      title="Pin & Sạc"
      description={`Pin ${detail.batteryType} — sạc đầy trong ${detail.quickSpecs.chargingTime}. Hỗ trợ sạc tại nhà và trạm V-Green trên toàn quốc.`}
      heroImage={heroImage}
      solutions={solutions}
    />
  );
}

function SpecsSection({ detail }: { detail: ScooterDetail }) {
  const [expanded, setExpanded] = useState<string | null>(detail.specGroups[0]?.category ?? null);

  return (
    <>
      <PdpSectionTitle title="Thông số kỹ thuật" subtitle="Thông tin chi tiết đầy đủ" />
      <div className="mx-auto mt-8 max-w-3xl space-y-3 lg:mt-10">
        {detail.specGroups.map((group) => {
          const isOpen = expanded === group.category;
          return (
            <div
              key={group.category}
              className="overflow-hidden rounded-2xl border border-border/60 bg-white shadow-soft"
            >
              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : group.category)}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
              >
                <h3 className="text-sm font-black text-brand-dark">{group.category}</h3>
                <ChevronDown
                  className={`size-4 text-muted-foreground transition ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="divide-y divide-border/40 border-t border-border/40">
                      {group.items.map((item) => (
                        <div
                          key={item.label}
                          className="flex flex-col gap-1 px-5 py-3 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <span className="text-xs text-muted-foreground">{item.label}</span>
                          <span className="text-xs font-semibold text-brand-dark sm:text-right">
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </>
  );
}

function AccessoriesSection({ detail: _detail }: { detail: ScooterDetail }) {
  const products = useMemo(() => getScooterDetailAccessories(), []);

  return (
    <>
      <PdpSectionTitle title="Phụ kiện chính hãng" subtitle="Nâng tầm trải nghiệm lái xe" />
      <div className="mt-8 grid grid-cols-2 items-stretch gap-3 sm:gap-6 lg:grid-cols-4">
        {products.map((product) => (
          <AccessoryProductCard key={product.id} product={product} />
        ))}
      </div>
      <div className="mt-8 text-center">
        <Link
          href="/phu-kien"
          className="inline-flex items-center gap-2 rounded-xl border border-brand bg-white px-6 py-3 text-xs font-bold tracking-wide text-brand transition hover:bg-brand/5"
        >
          Xem tất cả phụ kiện <ArrowRight className="size-4" />
        </Link>
      </div>
    </>
  );
}

type FinanceProps = {
  detail: ScooterDetail;
  variant: { name: string; price: number };
  batteryMode: "rent" | "purchase";
  setBatteryMode: (v: "rent" | "purchase") => void;
  estimatorLocation: string;
  setEstimatorLocation: (v: string) => void;
  estimatorTab: "rolling" | "installment";
  setEstimatorTab: (v: "rolling" | "installment") => void;
  downPaymentPct: number;
  setDownPaymentPct: (v: number) => void;
  loanTermYears: number;
  setLoanTermYears: (v: number) => void;
  interestRate: number;
  setInterestRate: (v: number) => void;
  rollingCost: {
    registrationTax: number;
    plateFee: number;
    inspectionFee: number;
    civilInsurance: number;
    totalRolling: number;
  };
  installment: {
    upfrontAmount: number;
    loanAmount: number;
    firstMonthInterest: number;
    firstMonthPrincipal: number;
    firstMonthTotal: number;
    avgMonthlyPayment: number;
  };
  onBook: () => void;
};

function FinanceSection({
  detail,
  variant,
  batteryMode,
  setBatteryMode,
  estimatorLocation,
  setEstimatorLocation,
  estimatorTab,
  setEstimatorTab,
  downPaymentPct,
  setDownPaymentPct,
  loanTermYears,
  setLoanTermYears,
  interestRate,
  setInterestRate,
  rollingCost,
  installment,
  onBook,
}: FinanceProps) {
  return (
    <>
      <SectionHeader
        title="Tài chính & Chi phí lăn bánh"
        subtitle={`Tính toán chi phí cho ${variant.name}`}
        center
      />

      <div className="mt-8 overflow-hidden rounded-2xl border border-border/60 bg-white shadow-card">
        <div className="grid lg:grid-cols-12">
          {/* Settings */}
          <div className="border-b border-border/50 p-4 sm:p-6 lg:col-span-5 lg:border-r lg:border-b-0">
            <div className="mb-5 flex rounded-xl border border-border bg-surface p-1">
              <button
                type="button"
                onClick={() => setEstimatorTab("rolling")}
                className={`flex-1 rounded-lg py-2 text-[11px] font-bold transition ${
                  estimatorTab === "rolling"
                    ? "bg-brand text-white shadow"
                    : "text-muted-foreground"
                }`}
              >
                <Calculator className="mr-1 inline size-3.5" /> Lăn bánh
              </button>
              <button
                type="button"
                onClick={() => setEstimatorTab("installment")}
                className={`flex-1 rounded-lg py-2 text-[11px] font-bold transition ${
                  estimatorTab === "installment"
                    ? "bg-brand text-white shadow"
                    : "text-muted-foreground"
                }`}
              >
                <Percent className="mr-1 inline size-3.5" /> Trả góp
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="mb-2 text-[10px] font-bold text-muted-foreground uppercase">
                  Hình thức pin
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setBatteryMode("rent")}
                    className={`rounded-lg border py-2 text-[11px] font-bold ${
                      batteryMode === "rent"
                        ? "border-brand bg-brand/5 text-brand"
                        : "border-border"
                    }`}
                  >
                    Thuê pin
                  </button>
                  <button
                    type="button"
                    onClick={() => setBatteryMode("purchase")}
                    className={`rounded-lg border py-2 text-[11px] font-bold ${
                      batteryMode === "purchase"
                        ? "border-brand bg-brand/5 text-brand"
                        : "border-border"
                    }`}
                  >
                    Mua pin (+{formatPrice(detail.batteryPurchasePrice)}đ)
                  </button>
                </div>
              </div>

              <div>
                <p className="mb-2 text-[10px] font-bold text-muted-foreground uppercase">
                  Khu vực đăng ký
                </p>
                <Select value={estimatorLocation} onValueChange={setEstimatorLocation}>
                  <SelectTrigger className="w-full text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PROVINCES.map((p) => (
                      <SelectItem key={p.id} value={p.id} className="text-xs">
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <label className="flex cursor-pointer items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  Chi phí đăng ký xe máy điện theo quy định từng tỉnh/thành
                </span>
              </label>

              {estimatorTab === "installment" && (
                <>
                  <div>
                    <div className="mb-2 flex justify-between text-[10px] font-bold text-muted-foreground uppercase">
                      <span>Tỷ lệ vay ({downPaymentPct}%)</span>
                      <span className="text-brand">{formatPrice(installment.loanAmount)} đ</span>
                    </div>
                    <Slider
                      value={[downPaymentPct]}
                      onValueChange={([v]) => setDownPaymentPct(v)}
                      min={20}
                      max={80}
                      step={5}
                    />
                  </div>
                  <div>
                    <p className="mb-2 text-[10px] font-bold text-muted-foreground uppercase">
                      Thời hạn vay
                    </p>
                    <div className="flex gap-2">
                      {[3, 5, 7].map((y) => (
                        <button
                          key={y}
                          type="button"
                          onClick={() => setLoanTermYears(y)}
                          className={`flex-1 rounded-lg border py-2 text-[11px] font-bold ${
                            loanTermYears === y
                              ? "border-brand bg-brand/5 text-brand"
                              : "border-border"
                          }`}
                        >
                          {y} năm
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 text-[10px] font-bold text-muted-foreground uppercase">
                      Lãi suất ưu đãi
                    </p>
                    <div className="flex gap-2">
                      {[5.9, 6.9, 7.9].map((rate) => (
                        <button
                          key={rate}
                          type="button"
                          onClick={() => setInterestRate(rate)}
                          className={`flex-1 rounded-lg border py-2 text-[11px] font-bold ${
                            interestRate === rate
                              ? "border-brand bg-brand/5 text-brand"
                              : "border-border"
                          }`}
                        >
                          {rate}%
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Results */}
          <div className="bg-surface p-4 sm:p-6 lg:col-span-7">
            {estimatorTab === "rolling" ? (
              <div className="space-y-3 text-xs">
                <CostRow label="Giá xe (chưa pin)" value={formatPrice(variant.price)} />
                {batteryMode === "purchase" && (
                  <CostRow
                    label="Mua đứt pin"
                    value={`+ ${formatPrice(detail.batteryPurchasePrice)}`}
                    indent
                  />
                )}
                <CostRow label="Lệ phí trước bạ" value={formatPrice(rollingCost.registrationTax)} />
                <CostRow label="Phí đăng ký biển số" value={formatPrice(rollingCost.plateFee)} />
                <CostRow
                  label="Phí hỗ trợ đăng kiểm"
                  value={formatPrice(rollingCost.inspectionFee)}
                />
                <CostRow
                  label="Bảo hiểm TNDS bắt buộc"
                  value={formatPrice(rollingCost.civilInsurance)}
                />
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-border bg-white p-4">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">
                      Số tiền vay
                    </p>
                    <p className="mt-1 text-lg font-black text-brand">
                      {formatPrice(installment.loanAmount)} đ
                    </p>
                  </div>
                  <div className="rounded-xl border border-border bg-white p-4">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">
                      Trả trước
                    </p>
                    <p className="mt-1 text-lg font-black text-brand-dark">
                      {formatPrice(installment.upfrontAmount)} đ
                    </p>
                  </div>
                </div>
                <CostRow
                  label="Tổng chi phí lăn bánh"
                  value={formatPrice(rollingCost.totalRolling)}
                />
                <CostRow label="Thời hạn vay" value={`${loanTermYears * 12} tháng`} />
                <CostRow
                  label="Gốc tháng đầu"
                  value={formatPrice(installment.firstMonthPrincipal)}
                />
                <CostRow
                  label="Lãi tháng đầu"
                  value={formatPrice(installment.firstMonthInterest)}
                />
                <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <Info className="size-3.5 text-brand" /> Dư nợ giảm dần theo từng tháng
                </p>
              </div>
            )}

            <div className="mt-6 border-t border-border/50 pt-6">
              <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                {estimatorTab === "rolling"
                  ? "Tổng chi phí lăn bánh dự kiến"
                  : "Thanh toán tháng đầu (ước tính)"}
              </p>
              <p className="mt-1 text-xl font-black text-brand sm:text-2xl lg:text-3xl">
                {estimatorTab === "rolling"
                  ? `${formatPrice(rollingCost.totalRolling)} VND`
                  : `${formatPrice(installment.firstMonthTotal)} VND/tháng`}
              </p>
              {estimatorTab === "installment" && (
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Trung bình ~{formatPrice(installment.avgMonthlyPayment)} đ/tháng
                </p>
              )}
              <button
                type="button"
                onClick={onBook}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3.5 text-xs font-black text-white transition hover:bg-[#0046cc] sm:w-auto sm:px-8"
              >
                <Calendar className="size-4" /> NHẬN BÁO GIÁ CHI TIẾT
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function ReviewsSection({ detail }: { detail: ScooterDetail }) {
  const rating = detail.reviews.averageRating;
  const ratingPct = (rating / 5) * 100;

  return (
    <>
      <SectionHeader
        title="Đánh giá khách hàng"
        subtitle="Trải nghiệm thực tế từ cộng đồng"
        center
      />

      <div className="mx-auto mt-8 max-w-5xl">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,240px)_1fr] lg:gap-10">
          <aside className="flex flex-col items-center rounded-2xl border border-border/60 bg-surface/40 px-6 py-8 text-center lg:sticky lg:top-24 lg:items-start lg:self-start lg:py-10 lg:text-left">
            <p className="text-5xl font-black leading-none tabular-nums text-brand-dark">
              {rating.toFixed(1)}
            </p>
            <StarRating
              rating={rating}
              size={16}
              className="mt-3 justify-center lg:justify-start"
            />
            <div className="mt-4 h-1.5 w-full max-w-[180px] overflow-hidden rounded-full bg-border/50">
              <div
                className="h-full rounded-full bg-brand transition-all"
                style={{ width: `${ratingPct}%` }}
              />
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Dựa trên{" "}
              <span className="font-semibold text-brand-dark">{detail.reviews.totalReviews}</span>{" "}
              đánh giá
            </p>
            <p className="mt-5 hidden text-xs leading-relaxed text-muted-foreground lg:block">
              Phản hồi từ khách hàng đã trải nghiệm và mua xe tại VF Ngọc Anh Cà Mau.
            </p>
          </aside>

          <div className="grid gap-4 sm:grid-cols-2">
            {detail.reviews.items.map((review) => (
              <article
                key={`${review.name}-${review.date}`}
                className="flex flex-col rounded-2xl border border-border/60 p-5"
              >
                <StarRating rating={review.rating} size={12} />
                <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-foreground/85">
                  &ldquo;{review.content}&rdquo;
                </blockquote>
                <footer className="mt-4 flex items-center gap-3 border-t border-border/40 pt-4">
                  <div
                    className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand/10 text-xs font-black text-brand"
                    aria-hidden
                  >
                    {review.name.trim().charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-brand-dark">{review.name}</p>
                    <p className="truncate text-[10px] text-muted-foreground">
                      {[review.variant, review.date].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                </footer>
              </article>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── Shared UI atoms ─── */

function BreadcrumbBar({
  scooterName,
  variantName,
  reduced,
}: {
  scooterName: string;
  variantName: string;
  reduced: boolean;
}) {
  return (
    <motion.div
      className="border-b border-border/40 bg-white"
      initial={reduced ? false : "hidden"}
      animate={reduced ? undefined : "visible"}
      variants={reduced ? undefined : detailBreadcrumb}
    >
      <div className="container-vf overflow-x-auto py-2.5 sm:py-3 scrollbar-none">
        <Breadcrumb>
          <BreadcrumbList className="flex-nowrap">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/" className="text-xs text-muted-foreground hover:text-brand">
                  Trang chủ
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  href="/xe-may-dien"
                  className="text-xs text-muted-foreground hover:text-brand"
                >
                  Xe máy điện
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="max-w-[120px] truncate text-xs text-muted-foreground sm:max-w-none">
                {scooterName}
              </BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden sm:block" />
            <BreadcrumbItem className="hidden sm:block">
              <BreadcrumbPage className="text-xs font-medium text-foreground">
                {variantName}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </motion.div>
  );
}

function HighlightStat({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ElementType;
  value: string;
  label: string;
}) {
  return (
    <div className="text-center">
      <Icon className="mx-auto size-4 text-brand" strokeWidth={1.5} />
      <p className="mt-1 text-sm font-black text-brand-dark">{value}</p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}

function SpecItem({
  icon: Icon,
  label,
  value,
  light,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  light?: boolean;
}) {
  return (
    <div className="text-center">
      <Icon
        className={`mx-auto size-5 ${light ? "text-white/80" : "text-brand"}`}
        strokeWidth={1.5}
      />
      <p className={`mt-2 text-[10px] ${light ? "text-white/60" : "text-muted-foreground"}`}>
        {label}
      </p>
      <p className={`mt-0.5 text-xs font-bold ${light ? "text-white" : "text-brand-dark"}`}>
        {value}
      </p>
    </div>
  );
}

function SectionHeader({
  title,
  subtitle,
  center,
}: {
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "text-center" : ""}>
      <h2 className={sectionHeading}>{title}</h2>
      {subtitle && (
        <p className={`mt-2 text-sm text-muted-foreground ${center ? "mx-auto max-w-xl" : ""}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

function CostRow({
  label,
  value,
  indent,
  highlight,
}: {
  label: string;
  value: string;
  indent?: boolean;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex flex-col gap-1 text-xs font-semibold sm:flex-row sm:items-center sm:justify-between ${
        indent ? "border-l-2 border-border pl-3" : ""
      } ${highlight ? "text-emerald-600" : "text-slate-600"}`}
    >
      <span className="min-w-0">{label}</span>
      <span className={`shrink-0 ${highlight ? "font-bold" : "font-bold text-slate-800"}`}>
        {value} VNĐ
      </span>
    </div>
  );
}

function StarRating({
  rating,
  size = 14,
  className = "",
}: {
  rating: number;
  size?: number;
  className?: string;
}) {
  return (
    <div className={`flex gap-0.5 ${className}`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={size}
          className={
            i < Math.round(rating) ? "fill-accent-yellow text-accent-yellow" : "text-border"
          }
        />
      ))}
    </div>
  );
}
