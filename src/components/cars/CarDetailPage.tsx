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
  MapPin,
  Shield,
  Headphones,
  Wallet,
  Mic,
  Download,
  Smartphone,
  Radar,
  Monitor,
  KeyRound,
  Navigation,
  Settings2,
  Battery,
  Star,
  ArrowRight,
  X,
  ZoomIn,
  Users,
  Calendar,
  Calculator,
  Percent,
  Info,
  Phone,
  Sparkles,
  ChevronDown,
  Share2,
} from "lucide-react";

import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import FloatingButtons from "@/components/site/FloatingButtons";
import { CarCatalogCard } from "@/components/cars/CarCatalogCard";
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
import { AccessoryProductCard } from "@/components/accessories/AccessoryProductCard";
import { getCarDetailAccessories } from "@/lib/accessories";
import { type CarDetail, formatPrice, getRelatedCars, type TechFeature } from "@/lib/car-details";

type SectionId =
  | "tong-quan"
  | "ngoai-that"
  | "noi-that"
  | "cong-nghe"
  | "van-hanh"
  | "an-toan"
  | "thong-so"
  | "phu-kien"
  | "tai-chinh"
  | "danh-gia";

const SERVICE_BAR = [
  { icon: Shield, title: "Bảo hành chính hãng", sub: "Lên tới 10 năm hoặc 200.000 km" },
  { icon: Headphones, title: "Cứu hộ 24/7", sub: "Hỗ trợ mọi lúc, mọi nơi" },
  { icon: MapPin, title: "Showroom Cà Mau", sub: "Tư vấn & giao xe tận nơi" },
  { icon: Wallet, title: "Hỗ trợ tài chính", sub: "Vay 80%, trả góp lãi suất thấp" },
] as const;

const PROVINCES = [
  { id: "camau", name: "Cà Mau (Phí biển ~1 triệu)", plateFee: 1_000_000 },
  { id: "hanoi", name: "Hà Nội (Phí biển 20 triệu)", plateFee: 20_000_000 },
  { id: "hcm", name: "TP. Hồ Chí Minh (Phí biển 20 triệu)", plateFee: 20_000_000 },
  { id: "other", name: "Tỉnh/Thành phố khác (Phí biển 1 triệu)", plateFee: 1_000_000 },
] as const;

const TECH_ICONS: Record<TechFeature["icon"], React.ElementType> = {
  voice: Mic,
  fota: Download,
  app: Smartphone,
  adas: Radar,
  screen: Monitor,
  keyless: KeyRound,
  nav: Navigation,
  drive: Settings2,
  battery: Battery,
};

const sectionHeading = "text-xl font-black tracking-tight text-brand-dark sm:text-2xl lg:text-3xl";

type Props = { detail: CarDetail };

export default function CarDetailPage({ detail }: Props) {
  const router = useRouter();
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
  const [includeInsurance, setIncludeInsurance] = useState(true);
  const [estimatorTab, setEstimatorTab] = useState<"rolling" | "installment">("rolling");
  const [downPaymentPct, setDownPaymentPct] = useState(30);
  const [loanTermYears, setLoanTermYears] = useState(5);
  const [interestRate, setInterestRate] = useState(5.9);

  const variant = detail.variants.find((v) => v.id === selectedVariant) ?? detail.variants[0];
  const selectedColorObj = detail.colors.find((c) => c.id === selectedColor) ?? detail.colors[0];
  const related = getRelatedCars(detail.id);

  const displayGallery = useMemo(() => {
    const colorImage = selectedColorObj?.image;
    if (!colorImage) return detail.gallery;
    return [colorImage, ...detail.gallery.filter((img) => img !== colorImage)];
  }, [selectedColorObj?.image, detail.gallery]);

  const handleColorSelect = (colorId: string) => {
    setSelectedColor(colorId);
    setActiveImage(0);
  };

  const basePrice =
    batteryMode === "purchase" ? variant.price + detail.batteryPurchasePrice : variant.price;

  const rollingCost = useMemo(() => {
    const province = PROVINCES.find((p) => p.id === estimatorLocation) ?? PROVINCES[0];
    const roadMaintenanceFee = 1_560_000;
    const inspectionFee = 340_000;
    const civilInsurance = 480_000;
    const physicalInsurance = Math.round(basePrice * 0.011);
    const totalRolling =
      basePrice +
      province.plateFee +
      roadMaintenanceFee +
      inspectionFee +
      civilInsurance +
      (includeInsurance ? physicalInsurance : 0);
    return {
      plateFee: province.plateFee,
      roadMaintenanceFee,
      inspectionFee,
      civilInsurance,
      physicalInsurance,
      totalRolling,
    };
  }, [basePrice, estimatorLocation, includeInsurance]);

  const installment = useMemo(() => {
    const upfrontAmount = Math.round(rollingCost.totalRolling * (downPaymentPct / 100));
    const loanAmount = rollingCost.totalRolling - upfrontAmount;
    const monthlyRate = interestRate / 100 / 12;
    const months = loanTermYears * 12;
    const firstMonthInterest = Math.round(loanAmount * monthlyRate);
    const firstMonthPrincipal = Math.round(loanAmount / months);
    const firstMonthTotal = firstMonthInterest + firstMonthPrincipal;
    const avgMonthlyPayment = Math.round((loanAmount + loanAmount * monthlyRate * months) / months);
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

  const prevImage = () => setActiveImage((i) => (i === 0 ? displayGallery.length - 1 : i - 1));
  const nextImage = () => setActiveImage((i) => (i === displayGallery.length - 1 ? 0 : i + 1));

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
        <BreadcrumbBar carName={detail.name} variantName={variant.name} />

        {/* Hero */}
        <section className="relative overflow-x-hidden border-b border-border/40 bg-gradient-to-b from-slate-50 to-white">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,87,255,0.06),transparent_60%)]" />
          <div className="container-vf relative w-full min-w-0 py-6 sm:py-8 lg:py-12">
            <div className="grid w-full min-w-0 gap-6 lg:grid-cols-12 lg:gap-10">
              {/* Gallery */}
              <div className="min-w-0 w-full lg:col-span-7">
                <div className="mb-3 flex flex-wrap items-center gap-1.5 sm:mb-4 sm:gap-2">
                  {detail.badges.map((badge) => (
                    <span
                      key={badge}
                      className="inline-flex max-w-full items-center gap-1 rounded-full border border-brand/20 bg-brand/5 px-2 py-0.5 text-[10px] font-bold text-brand sm:px-3 sm:py-1"
                    >
                      <Sparkles className="size-3 shrink-0" />
                      <span className="truncate">{badge}</span>
                    </span>
                  ))}
                  {detail.isNew && (
                    <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white sm:px-3 sm:py-1">
                      MỚI
                    </span>
                  )}
                  {detail.isBestSeller && (
                    <span className="rounded-full bg-accent-yellow px-2 py-0.5 text-[10px] font-bold text-brand-dark sm:px-3 sm:py-1">
                      BÁN CHẠY
                    </span>
                  )}
                </div>

                <p className="text-[11px] font-bold tracking-widest text-brand uppercase sm:text-xs">
                  VinFast {detail.name}
                </p>
                <h1 className="mt-1 break-words text-xl font-black tracking-tight text-brand-dark sm:text-2xl lg:text-4xl">
                  {detail.tagline}
                </h1>

                <div className="relative mt-4 w-full max-w-full overflow-hidden rounded-xl border border-border/50 bg-[#f4f6fa] shadow-card sm:mt-6 sm:rounded-2xl">
                  <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[16/10]">
                    <img
                      src={displayGallery[activeImage]}
                      alt={`${detail.name} - ${selectedColorObj?.name ?? "ảnh"} ${activeImage + 1}`}
                      className="h-full w-full object-contain p-2 transition-transform duration-300 hover:scale-[1.02] sm:p-4"
                    />
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
                    {activeImage + 1} / {displayGallery.length}
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
                    {displayGallery.map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setActiveImage(i)}
                        className={`relative size-14 shrink-0 overflow-hidden rounded-lg border-2 transition sm:size-[72px] sm:rounded-xl ${
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
                      </button>
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

                {/* Quick specs — lấp cột gallery */}
                <div className="mt-4 rounded-2xl border border-border/60 px-4 py-4 sm:mt-6 sm:px-5 sm:py-5">
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
                    <SpecItem
                      icon={Gauge}
                      label="Quãng đường"
                      value={`${detail.quickSpecs.range} km`}
                    />
                    <SpecItem
                      icon={Zap}
                      label="Công suất"
                      value={`${detail.quickSpecs.power} Hp`}
                    />
                    <SpecItem
                      icon={Wind}
                      label="Mô-men xoắn"
                      value={`${detail.quickSpecs.torque} Nm`}
                    />
                    <SpecItem
                      icon={Timer}
                      label="Tăng tốc 0–100"
                      value={detail.quickSpecs.acceleration}
                    />
                    <SpecItem
                      icon={Gauge}
                      label="Tốc độ tối đa"
                      value={`${detail.quickSpecs.topSpeed} km/h`}
                    />
                    <SpecItem
                      icon={BatteryCharging}
                      label="Sạc nhanh"
                      value={detail.quickSpecs.fastCharge}
                    />
                  </div>
                </div>
              </div>

              {/* Purchase panel — sticky on desktop */}
              <div className="min-w-0 w-full lg:col-span-5">
                <div className="box-border w-full min-w-0 max-w-full rounded-2xl border border-border/60 bg-white p-4 shadow-card sm:p-5 lg:sticky lg:top-24 lg:p-6">
                  <div className="flex items-start justify-between gap-2 sm:gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-semibold text-muted-foreground sm:text-[10px] sm:font-bold sm:uppercase sm:tracking-wider">
                        Giá niêm yết từ
                      </p>
                      <div className="mt-0.5">
                        <span className="block break-all text-lg font-black tabular-nums leading-tight text-brand sm:inline sm:break-normal sm:text-2xl lg:text-4xl">
                          {formatPrice(variant.price)}
                        </span>
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
                    <HighlightStat icon={Users} value={`${detail.seats}`} label="Chỗ ngồi" />
                    <HighlightStat
                      icon={Zap}
                      value={`${detail.quickSpecs.power}`}
                      label="Công suất Hp"
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
                            onClick={() => handleColorSelect(c.id)}
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
                      onClick={() => openBooking("Đặt cọc ngay")}
                      className="w-full rounded-xl bg-brand py-3.5 text-xs font-black tracking-wide text-white shadow-lg transition hover:bg-[#0046cc]"
                    >
                      ĐẶT CỌC NGAY
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
              </div>
            </div>
          </div>
        </section>

        {/* All content sections */}
        <div className="bg-white">
          <SectionWrap id="tong-quan">
            <OverviewSection detail={detail} />
          </SectionWrap>

          <SectionWrap id="ngoai-that" alt>
            <ExteriorSection detail={detail} />
          </SectionWrap>

          <SectionWrap id="noi-that">
            <InteriorSection detail={detail} />
          </SectionWrap>

          <SectionWrap id="cong-nghe" alt>
            <TechnologySection detail={detail} />
          </SectionWrap>

          <SectionWrap id="van-hanh">
            <PerformanceSection detail={detail} />
          </SectionWrap>

          <SectionWrap id="an-toan" alt>
            <SafetySection detail={detail} />
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
              basePrice={basePrice}
              batteryMode={batteryMode}
              setBatteryMode={setBatteryMode}
              estimatorLocation={estimatorLocation}
              setEstimatorLocation={setEstimatorLocation}
              includeInsurance={includeInsurance}
              setIncludeInsurance={setIncludeInsurance}
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
            <div className="mt-8 grid grid-cols-2 items-stretch gap-3 sm:gap-6 xl:grid-cols-3">
              {related.map((car) => (
                <CarCatalogCard
                  key={car.id}
                  car={car}
                  onBookDrive={() => openBooking(`Đăng ký lái thử ${car.name}`)}
                  onEstimatePrice={() => router.push(`/oto/${car.id}#tai-chinh`)}
                />
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link
                href="/oto"
                className="inline-flex items-center gap-2 rounded-xl border border-brand bg-white px-6 py-3 text-xs font-bold tracking-wide text-brand transition hover:bg-brand/5"
              >
                Xem tất cả xe ô tô <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Service bar */}
        <section className="section-y border-t border-border/40 bg-white">
          <div className="container-vf">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {SERVICE_BAR.map(({ icon: Icon, title, sub }) => (
                <div
                  key={title}
                  className="flex items-center gap-4 rounded-2xl border border-border/50 bg-surface p-4 transition hover:shadow-soft"
                >
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-brand/20 bg-brand/5">
                    <Icon className="size-5 text-brand" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-brand-dark">{title}</p>
                    <p className="text-[11px] text-muted-foreground">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
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
                href="tel:19002323"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-xs font-black text-brand-dark transition hover:bg-white/90"
              >
                <Phone className="size-4" /> Gọi 1900 2323
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
            onClick={() => openBooking("Đặt cọc ngay")}
            className="flex-1 rounded-xl bg-brand py-2.5 text-[11px] font-black text-white"
          >
            ĐẶT CỌC
          </button>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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
            <img
              src={displayGallery[activeImage]}
              alt={detail.name}
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
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
                    {["Đăng ký lái thử", "Đặt cọc ngay", "Nhận báo giá", "Tư vấn trả góp"].map(
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
  children,
}: {
  id: SectionId;
  alt?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-20 section-y lg:scroll-mt-24 ${alt ? "bg-surface" : "bg-white"}`}
    >
      <div className="container-vf">{children}</div>
    </section>
  );
}

function OverviewSection({ detail }: { detail: CarDetail }) {
  const highlights = [
    { label: "Quãng đường", value: `${detail.quickSpecs.range} km` },
    { label: "Công suất", value: `${detail.quickSpecs.power} Hp` },
    { label: "Tăng tốc", value: detail.quickSpecs.acceleration },
  ];
  const overviewImage =
    detail.overview.image !== "/images/cars/oto-hero.jpg"
      ? detail.overview.image
      : (detail.gallery[0] ?? detail.overview.image);

  return (
    <>
      <div className="max-w-2xl">
        <p className="text-[11px] font-bold tracking-[0.18em] text-brand uppercase">Tổng quan</p>
        <h2 className={`mt-2 text-left ${sectionHeading}`}>{detail.overview.title}</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {detail.overview.subtitle}
        </p>
      </div>

      <div className="mt-8 grid items-stretch gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="order-1 lg:col-span-7">
          <div className="overflow-hidden rounded-2xl bg-surface/50 p-2 sm:p-3">
            <img
              src={overviewImage}
              alt={detail.overview.title}
              className="aspect-[16/10] w-full rounded-xl object-contain bg-[#f4f6fa] p-2"
            />
          </div>
        </div>

        <div className="order-2 flex flex-col justify-center gap-4 lg:col-span-5 sm:gap-5">
          <dl className="grid grid-cols-3 gap-2 sm:gap-3">
            {highlights.map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-border/60 px-3 py-2.5 text-center sm:px-4 sm:py-3"
              >
                <dt className="text-[10px] font-semibold text-muted-foreground uppercase">
                  {item.label}
                </dt>
                <dd className="mt-0.5 text-sm font-black text-brand-dark">{item.value}</dd>
              </div>
            ))}
          </dl>
          <div className="overflow-hidden rounded-2xl border border-border/60">
            <ul className="divide-y divide-border/50">
              {detail.overview.bullets.map((b) => (
                <li key={b} className="flex items-start gap-3 px-4 py-3.5 sm:px-5 sm:py-4">
                  <Check size={14} className="mt-0.5 shrink-0 text-brand" strokeWidth={2.5} />
                  <span className="text-sm leading-relaxed text-foreground/85">{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

function ExteriorSection({ detail }: { detail: CarDetail }) {
  const lead = detail.exterior[0];
  return (
    <>
      <SectionHeader
        title="Ngoại thất"
        subtitle={lead?.desc?.slice(0, 120) ?? "Thiết kế ấn tượng, khí động học tối ưu"}
      />
      {lead && lead.desc.length > 80 && (
        <p className="mx-auto mt-4 max-w-3xl text-center text-sm leading-relaxed text-muted-foreground">
          {lead.desc}
        </p>
      )}
      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {detail.exterior.map((item) => (
          <FeatureCard key={item.title} {...item} />
        ))}
      </div>
    </>
  );
}

function InteriorSection({ detail }: { detail: CarDetail }) {
  const lead = detail.interior[0];
  return (
    <>
      <SectionHeader
        title="Nội thất"
        subtitle={lead?.desc?.slice(0, 120) ?? "Không gian cabin cao cấp, tiện nghi vượt trội"}
      />
      {lead && lead.desc.length > 80 && (
        <p className="mx-auto mt-4 max-w-3xl text-center text-sm leading-relaxed text-muted-foreground">
          {lead.desc}
        </p>
      )}
      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {detail.interior.map((item) => (
          <FeatureCard key={item.title} {...item} />
        ))}
      </div>
    </>
  );
}

function TechnologySection({ detail }: { detail: CarDetail }) {
  return (
    <>
      <SectionHeader
        title="Công nghệ thông minh"
        subtitle={detail.technologySubtitle ?? "Hệ sinh thái kết nối toàn diện"}
        center
      />
      <div className="mt-6 overflow-hidden rounded-2xl border border-border/60 bg-white sm:mt-8">
        <ul className="divide-y divide-border/50">
          {detail.technology.map((tech) => {
            const Icon = TECH_ICONS[tech.icon];
            return (
              <li key={tech.title} className="flex items-start gap-3.5 px-4 py-3.5 sm:px-5 sm:py-4">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand/5 text-brand">
                  <Icon className="size-4" strokeWidth={1.5} />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-brand-dark">{tech.title}</h3>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                    {tech.desc}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

function PerformanceSection({ detail }: { detail: CarDetail }) {
  return (
    <>
      <SectionHeader
        title={detail.performance.title}
        subtitle={detail.performance.subtitle}
        center
      />
      <div className="mt-8 grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="overflow-hidden rounded-2xl shadow-card">
          <img
            src={detail.performance.image}
            alt={detail.performance.title}
            className="aspect-[4/3] w-full object-cover"
          />
        </div>
        <div className="space-y-3">
          {detail.performance.features.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-border/60 bg-white p-4 shadow-soft"
            >
              <h3 className="text-sm font-bold text-brand-dark">{f.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {detail.performance.driveModes.map((mode) => (
          <div
            key={mode.name}
            className="rounded-2xl border border-brand/20 bg-brand/5 p-5 text-center"
          >
            <p className="text-base font-black text-brand">{mode.name}</p>
            <p className="mt-1.5 text-xs text-muted-foreground">{mode.desc}</p>
          </div>
        ))}
      </div>
    </>
  );
}

function SafetySection({ detail }: { detail: CarDetail }) {
  return (
    <>
      <SectionHeader title={detail.safety.title} subtitle={detail.safety.subtitle} center />
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {detail.safety.highlights.map((h) => (
          <span
            key={h}
            className="rounded-full border border-brand/20 px-3 py-1 text-[11px] font-semibold text-brand"
          >
            {h}
          </span>
        ))}
      </div>
      <div className="mt-6 grid items-start gap-6 sm:mt-8 lg:grid-cols-2 lg:gap-10">
        <ul className="order-2 divide-y divide-border/50 overflow-hidden rounded-2xl border border-border/60 bg-white lg:order-1">
          {detail.safety.features.map((f) => (
            <li key={f.title} className="flex items-start gap-3 px-4 py-3.5 sm:px-5">
              <Shield className="mt-0.5 size-4 shrink-0 text-brand" strokeWidth={1.5} />
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-brand-dark">{f.title}</h3>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="order-1 overflow-hidden rounded-2xl border border-border/60 lg:order-2">
          <img
            src={detail.safety.image}
            alt={detail.safety.title}
            className="aspect-[4/3] w-full object-cover"
          />
        </div>
      </div>
    </>
  );
}

function SpecsSection({ detail }: { detail: CarDetail }) {
  const [expanded, setExpanded] = useState<string | null>(detail.specGroups[0]?.category ?? null);

  return (
    <>
      <SectionHeader title="Thông số kỹ thuật" subtitle="Thông tin chi tiết đầy đủ" center />
      <div className="mx-auto mt-8 max-w-3xl space-y-3">
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
                          <span className="text-xs font-semibold text-brand-dark">
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

function AccessoriesSection({ detail }: { detail: CarDetail }) {
  const products = useMemo(() => getCarDetailAccessories(detail.id), [detail.id]);

  return (
    <>
      <SectionHeader title="Phụ kiện chính hãng" subtitle="Nâng tầm trải nghiệm lái xe" />
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
  detail: CarDetail;
  variant: { name: string; price: number };
  basePrice: number;
  batteryMode: "rent" | "purchase";
  setBatteryMode: (v: "rent" | "purchase") => void;
  estimatorLocation: string;
  setEstimatorLocation: (v: string) => void;
  includeInsurance: boolean;
  setIncludeInsurance: (v: boolean) => void;
  estimatorTab: "rolling" | "installment";
  setEstimatorTab: (v: "rolling" | "installment") => void;
  downPaymentPct: number;
  setDownPaymentPct: (v: number) => void;
  loanTermYears: number;
  setLoanTermYears: (v: number) => void;
  interestRate: number;
  setInterestRate: (v: number) => void;
  rollingCost: {
    plateFee: number;
    roadMaintenanceFee: number;
    inspectionFee: number;
    civilInsurance: number;
    physicalInsurance: number;
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
  basePrice,
  batteryMode,
  setBatteryMode,
  estimatorLocation,
  setEstimatorLocation,
  includeInsurance,
  setIncludeInsurance,
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
                <Checkbox
                  checked={includeInsurance}
                  onCheckedChange={(v) => setIncludeInsurance(!!v)}
                />
                <span className="text-xs text-muted-foreground">
                  Bao gồm bảo hiểm vật chất (~1.1%)
                </span>
              </label>

              {estimatorTab === "installment" && (
                <>
                  <div>
                    <div className="mb-2 flex justify-between text-[10px] font-bold text-muted-foreground uppercase">
                      <span>Trả trước ({downPaymentPct}%)</span>
                      <span className="text-brand">{formatPrice(installment.upfrontAmount)} đ</span>
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
                <CostRow label="Giá niêm yết xe" value={formatPrice(variant.price)} />
                {batteryMode === "purchase" && (
                  <CostRow
                    label="Mua đứt pin"
                    value={`+ ${formatPrice(detail.batteryPurchasePrice)}`}
                    indent
                  />
                )}
                <CostRow label="Lệ phí trước bạ (miễn 0%)" value="0" highlight />
                <CostRow label="Phí đăng ký biển số" value={formatPrice(rollingCost.plateFee)} />
                <CostRow
                  label="Phí bảo trì đường bộ (12 tháng)"
                  value={formatPrice(rollingCost.roadMaintenanceFee)}
                />
                <CostRow label="Phí đăng kiểm" value={formatPrice(rollingCost.inspectionFee)} />
                <CostRow
                  label="Bảo hiểm TNDS bắt buộc"
                  value={formatPrice(rollingCost.civilInsurance)}
                />
                {includeInsurance && (
                  <CostRow
                    label="Bảo hiểm vật chất (~1.1%)"
                    value={formatPrice(rollingCost.physicalInsurance)}
                  />
                )}
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

function ReviewsSection({ detail }: { detail: CarDetail }) {
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

function BreadcrumbBar({ carName, variantName }: { carName: string; variantName: string }) {
  return (
    <div className="border-b border-border/40 bg-white">
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
                <Link href="/oto" className="text-xs text-muted-foreground hover:text-brand">
                  Ô tô
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="max-w-[120px] truncate text-xs text-muted-foreground sm:max-w-none">
                {carName}
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
    </div>
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

function FeatureCard({ title, desc, image }: { title: string; desc: string; image: string }) {
  return (
    <div className="catalog-card rounded-xl border border-border/60 bg-white sm:rounded-2xl">
      <img
        src={image}
        alt={title}
        className="aspect-[4/3] w-full rounded-t-xl bg-slate-100 object-cover sm:rounded-t-2xl"
        loading="lazy"
        decoding="async"
      />
      <div className="p-3 sm:p-4">
        <h3 className="text-xs font-bold text-brand-dark sm:text-sm">{title}</h3>
        <p className="mt-1 text-[10px] leading-relaxed text-muted-foreground sm:mt-1.5 sm:text-xs">
          {desc}
        </p>
      </div>
    </div>
  );
}
