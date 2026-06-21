"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  MessageCircle,
  GitCompareArrows,
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
  User,
  ArrowRight,
  X,
  ZoomIn,
  Calendar,
  Calculator,
  Percent,
  Info,
  Phone,
  Sparkles,
  ChevronDown,
  FileDown,
  Share2,
} from "lucide-react";

import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import FloatingButtons from "@/components/site/FloatingButtons";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
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

const TABS = [
  { id: "tong-quan", label: "Tổng quan" },
  { id: "ngoai-that", label: "Ngoại thất" },
  { id: "thiet-ke", label: "Thiết kế" },
  { id: "cong-nghe", label: "Công nghệ" },
  { id: "van-hanh", label: "Vận hành" },
  { id: "an-toan", label: "An toàn" },
  { id: "thong-so", label: "Thông số" },
  { id: "phu-kien", label: "Phụ kiện" },
  { id: "tai-chinh", label: "Tài chính" },
  { id: "danh-gia", label: "Đánh giá" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const SERVICE_BAR = [
  { icon: Shield, title: "Bảo hành chính hãng", sub: "Lên tới 5 năm hoặc 30.000 km" },
  { icon: Headphones, title: "Cứu hộ 24/7", sub: "Hỗ trợ mọi lúc, mọi nơi" },
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

const sectionHeading = "text-xl font-black tracking-tight text-brand-dark sm:text-2xl md:text-3xl";

type Props = { detail: ScooterDetail };

export default function ScooterDetailPage({ detail }: Props) {
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(
    detail.variants[Math.min(1, detail.variants.length - 1)]?.id ?? detail.variants[0].id,
  );
  const [selectedColor, setSelectedColor] = useState(detail.colors[0]?.id ?? "color-0");
  const [batteryMode, setBatteryMode] = useState<"rent" | "purchase">("rent");
  const [activeTab, setActiveTab] = useState<TabId>("tong-quan");
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingService, setBookingService] = useState("Đăng ký lái thử");
  const [bookingForm, setBookingForm] = useState({ name: "", phone: "", email: "" });
  const [bookingSubmitted, setBookingSubmitted] = useState(false);

  const [estimatorLocation, setEstimatorLocation] = useState("camau");
  const [estimatorTab, setEstimatorTab] = useState<"rolling" | "installment">("rolling");
  const [downPaymentPct, setDownPaymentPct] = useState(30);
  const [loanTermYears, setLoanTermYears] = useState(5);
  const [interestRate, setInterestRate] = useState(5.9);

  const sectionRefs = useRef<Partial<Record<TabId, HTMLElement | null>>>({});
  const navRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);

  const variant = detail.variants.find((v) => v.id === selectedVariant) ?? detail.variants[0];
  const selectedColorObj = detail.colors.find((c) => c.id === selectedColor) ?? detail.colors[0];
  const related = getRelatedScooters(detail.id);

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

  const scrollToSection = useCallback((id: TabId) => {
    setActiveTab(id);
    isScrollingRef.current = true;
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => {
      isScrollingRef.current = false;
    }, 800);
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    TABS.forEach(({ id }) => {
      const el = sectionRefs.current[id];
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !isScrollingRef.current) {
            setActiveTab(id);
          }
        },
        { rootMargin: "-40% 0px -50% 0px", threshold: 0 },
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const prevImage = () => setActiveImage((i) => (i === 0 ? detail.gallery.length - 1 : i - 1));
  const nextImage = () => setActiveImage((i) => (i === detail.gallery.length - 1 ? 0 : i + 1));

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
    <div className="min-h-screen bg-white pb-20 lg:pb-0">
      <Header />
      <Toaster position="top-center" richColors />
      <main>
        <BreadcrumbBar scooterName={detail.name} variantName={variant.name} />

        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-slate-50 to-white">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,87,255,0.06),transparent_60%)]" />
          <div className="container-vf relative py-8 md:py-12">
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
              {/* Gallery */}
              <div className="lg:col-span-7">
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  {detail.badges.map((badge) => (
                    <span
                      key={badge}
                      className="inline-flex items-center gap-1 rounded-full border border-brand/20 bg-brand/5 px-3 py-1 text-[10px] font-bold text-brand"
                    >
                      <Sparkles className="size-3" />
                      {badge}
                    </span>
                  ))}
                  {detail.isNew && (
                    <span className="rounded-full bg-emerald-500 px-3 py-1 text-[10px] font-bold text-white">
                      MỚI
                    </span>
                  )}
                  {detail.isBestSeller && (
                    <span className="rounded-full bg-accent-yellow px-3 py-1 text-[10px] font-bold text-brand-dark">
                      BÁN CHẠY
                    </span>
                  )}
                </div>

                <p className="text-xs font-bold tracking-widest text-brand uppercase">
                  VinFast {detail.name}
                </p>
                <h1 className="mt-1 text-2xl font-black tracking-tight text-brand-dark md:text-4xl">
                  {detail.tagline}
                </h1>
                <p className="mt-2 max-w-xl text-sm text-muted-foreground">{detail.slogan}</p>

                <div className="relative mt-6 overflow-hidden rounded-2xl border border-border/50 bg-[#f4f6fa] shadow-card">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={detail.gallery[activeImage]}
                      alt={`${detail.name} - ảnh ${activeImage + 1}`}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setLightboxOpen(true)}
                    className="absolute top-4 right-4 flex items-center gap-1.5 rounded-lg border border-border/60 bg-white/90 px-3 py-1.5 text-[10px] font-bold text-brand-dark shadow-sm backdrop-blur transition hover:bg-white"
                  >
                    <ZoomIn className="size-3.5" /> Phóng to
                  </button>
                  <button
                    type="button"
                    onClick={prevImage}
                    className="absolute top-1/2 left-3 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white shadow-md transition hover:border-brand hover:text-brand"
                    aria-label="Ảnh trước"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={nextImage}
                    className="absolute top-1/2 right-3 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white shadow-md transition hover:border-brand hover:text-brand"
                    aria-label="Ảnh sau"
                  >
                    <ChevronRight size={20} />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-dark/70 px-3 py-1 text-[10px] font-bold text-white backdrop-blur">
                    {activeImage + 1} / {detail.gallery.length}
                  </div>
                </div>

                <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                  {detail.gallery.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveImage(i)}
                      className={`relative size-[72px] shrink-0 overflow-hidden rounded-xl border-2 transition ${
                        activeImage === i
                          ? "border-brand ring-2 ring-brand/20"
                          : "border-border/40 hover:border-border"
                      }`}
                    >
                      <img src={img} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Purchase panel — sticky on desktop */}
              <div className="lg:col-span-5">
                <div className="rounded-2xl border border-border/60 bg-white p-5 shadow-card lg:sticky lg:top-24 lg:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                        Giá niêm yết (chưa pin)
                      </p>
                      <p className="text-3xl font-black text-brand md:text-4xl">
                        {formatPrice(variant.price)}{" "}
                        <span className="text-base font-bold text-muted-foreground">VND</span>
                      </p>
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

                  {/* Quick highlights */}
                  <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-surface p-3">
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

                  {/* Variants */}
                  <div className="mt-6">
                    <p className="mb-3 text-[10px] font-bold tracking-wider text-brand-dark uppercase">
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
                            className={`flex w-full items-center justify-between rounded-xl border-2 px-4 py-3 text-left transition ${
                              selected
                                ? "border-brand bg-brand/5 shadow-sm"
                                : "border-border hover:border-brand/40"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span
                                className={`flex size-5 items-center justify-center rounded-full border-2 ${
                                  selected ? "border-brand bg-brand" : "border-border"
                                }`}
                              >
                                {selected && <Check size={12} className="text-white" />}
                              </span>
                              <span className="text-sm font-semibold text-brand-dark">
                                {v.name}
                              </span>
                            </div>
                            <span className="text-xs font-bold text-muted-foreground">
                              {formatPrice(v.price)} đ
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Colors */}
                  <div className="mt-6">
                    <p className="mb-3 text-[10px] font-bold tracking-wider text-brand-dark uppercase">
                      Chọn màu sắc
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {detail.colors.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          title={c.name}
                          onClick={() => setSelectedColor(c.id)}
                          className={`size-9 rounded-full border-2 transition ${
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
                  <div className="mt-6">
                    <p className="mb-3 text-[10px] font-bold tracking-wider text-brand-dark uppercase">
                      Hình thức pin
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setBatteryMode("rent")}
                        className={`rounded-xl border-2 px-3 py-3 text-left transition ${
                          batteryMode === "rent"
                            ? "border-brand bg-brand/5"
                            : "border-border hover:border-brand/40"
                        }`}
                      >
                        <p className="text-xs font-bold text-brand-dark">Thuê pin</p>
                        <p className="mt-0.5 text-[10px] text-muted-foreground">
                          {formatPrice(detail.rentBatteryPrice)} đ/tháng
                        </p>
                      </button>
                      <button
                        type="button"
                        onClick={() => setBatteryMode("purchase")}
                        className={`rounded-xl border-2 px-3 py-3 text-left transition ${
                          batteryMode === "purchase"
                            ? "border-brand bg-brand/5"
                            : "border-border hover:border-brand/40"
                        }`}
                      >
                        <p className="text-xs font-bold text-brand-dark">Mua pin</p>
                        <p className="mt-0.5 text-[10px] text-muted-foreground">
                          +{formatPrice(detail.batteryPurchasePrice)} đ
                        </p>
                      </button>
                    </div>
                  </div>

                  {/* Estimated rolling cost preview */}
                  <div className="mt-5 rounded-xl border border-brand/20 bg-brand/5 p-4">
                    <p className="text-[10px] font-bold tracking-wider text-brand uppercase">
                      Chi phí lăn bánh dự kiến
                    </p>
                    <p className="mt-1 text-xl font-black text-brand-dark">
                      {formatPrice(rollingCost.totalRolling)}{" "}
                      <span className="text-xs font-semibold text-muted-foreground">VND</span>
                    </p>
                    <button
                      type="button"
                      onClick={() => scrollToSection("tai-chinh")}
                      className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-brand hover:underline"
                    >
                      Xem chi tiết tính toán <ChevronDown className="size-3.5 rotate-[-90deg]" />
                    </button>
                  </div>

                  {/* CTAs */}
                  <div className="mt-6 flex flex-col gap-2.5">
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

                  <div className="mt-5 grid grid-cols-2 gap-2 border-t border-border/50 pt-5">
                    <UtilityLink icon={MapPin} label="Tìm đại lý" href="/gioi-thieu" />
                    <UtilityLink icon={MessageCircle} label="Chat Zalo" href="#" />
                    <UtilityLink icon={GitCompareArrows} label="So sánh xe" href="/xe-may-dien" />
                    <UtilityLink icon={FileDown} label="Tải brochure" href="#" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick specs strip */}
        <section className="border-b border-border/40 bg-brand-dark py-6 text-white">
          <div className="container-vf">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              <SpecItem
                icon={Gauge}
                label="Quãng đường"
                value={`${detail.quickSpecs.range} km`}
                light
              />
              <SpecItem
                icon={Zap}
                label="Tốc độ tối đa"
                value={`${detail.quickSpecs.topSpeed} km/h`}
                light
              />
              <SpecItem
                icon={Bike}
                label="Công suất"
                value={`${detail.quickSpecs.motorPower} W`}
                light
              />
              <SpecItem
                icon={Package}
                label="Cốp xe"
                value={detail.quickSpecs.trunk > 0 ? `${detail.quickSpecs.trunk} lít` : "Móc treo"}
                light
              />
              <SpecItem
                icon={Scale}
                label="Trọng lượng"
                value={`${detail.quickSpecs.weight} kg`}
                light
              />
              <SpecItem
                icon={BatteryCharging}
                label="Thời gian sạc"
                value={detail.quickSpecs.chargingTime.split(" (")[0]}
                light
              />
            </div>
          </div>
        </section>

        {/* Sticky nav */}
        <div
          ref={navRef}
          className="sticky top-[72px] z-40 border-b border-border/40 bg-white/95 shadow-sm backdrop-blur-md"
        >
          <div className="container-vf overflow-x-auto">
            <nav className="flex gap-0" aria-label="Mục nội dung">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => scrollToSection(tab.id)}
                  className={`shrink-0 border-b-2 px-4 py-3.5 text-xs font-semibold whitespace-nowrap transition ${
                    activeTab === tab.id
                      ? "border-brand text-brand"
                      : "border-transparent text-muted-foreground hover:text-brand-dark"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* All content sections */}
        <div className="scroll-mt-36 bg-white">
          <SectionWrap
            id="tong-quan"
            ref={(el) => {
              sectionRefs.current["tong-quan"] = el;
            }}
          >
            <OverviewSection detail={detail} />
          </SectionWrap>

          <SectionWrap
            id="ngoai-that"
            alt
            ref={(el) => {
              sectionRefs.current["ngoai-that"] = el;
            }}
          >
            <ExteriorSection detail={detail} />
          </SectionWrap>

          <SectionWrap
            id="thiet-ke"
            ref={(el) => {
              sectionRefs.current["thiet-ke"] = el;
            }}
          >
            <DesignSection detail={detail} />
          </SectionWrap>

          <SectionWrap
            id="cong-nghe"
            alt
            ref={(el) => {
              sectionRefs.current["cong-nghe"] = el;
            }}
          >
            <TechnologySection detail={detail} />
          </SectionWrap>

          <SectionWrap
            id="van-hanh"
            ref={(el) => {
              sectionRefs.current["van-hanh"] = el;
            }}
          >
            <PerformanceSection detail={detail} />
          </SectionWrap>

          <SectionWrap
            id="an-toan"
            alt
            ref={(el) => {
              sectionRefs.current["an-toan"] = el;
            }}
          >
            <SafetySection detail={detail} />
          </SectionWrap>

          <SectionWrap
            id="thong-so"
            ref={(el) => {
              sectionRefs.current["thong-so"] = el;
            }}
          >
            <SpecsSection detail={detail} />
          </SectionWrap>

          <SectionWrap
            id="phu-kien"
            alt
            ref={(el) => {
              sectionRefs.current["phu-kien"] = el;
            }}
          >
            <AccessoriesSection detail={detail} />
          </SectionWrap>

          <SectionWrap
            id="tai-chinh"
            ref={(el) => {
              sectionRefs.current["tai-chinh"] = el;
            }}
          >
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

          <SectionWrap
            id="danh-gia"
            alt
            ref={(el) => {
              sectionRefs.current["danh-gia"] = el;
            }}
          >
            <ReviewsSection detail={detail} />
          </SectionWrap>
        </div>

        {/* Related products */}
        <section className="border-t border-border/40 bg-surface py-12 md:py-16">
          <div className="container-vf">
            <h2 className={sectionHeading}>Sản phẩm liên quan</h2>
            <p className="mx-auto mt-2 max-w-lg text-center text-sm text-muted-foreground">
              Khám phá thêm các mẫu xe VinFast phù hợp với nhu cầu của bạn
            </p>
            <Carousel opts={{ align: "start", loop: false }} className="mt-8">
              <CarouselContent className="-ml-4">
                {related.map((scooter) => (
                  <CarouselItem
                    key={scooter.id}
                    className="basis-full pl-4 sm:basis-1/2 lg:basis-1/4"
                  >
                    <Link
                      href={`/xe-may-dien/${scooter.id}`}
                      className="group block overflow-hidden rounded-2xl border border-border/60 bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-card"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                          src={scooter.image}
                          alt={scooter.name}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-sm font-black text-brand-dark">{scooter.name}</h3>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">
                          {scooter.subtitle}
                        </p>
                        <p className="mt-2 text-xs font-bold text-brand">
                          Giá từ {formatPrice(scooter.price)} VND
                        </p>
                      </div>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex" />
              <CarouselNext className="hidden sm:flex" />
            </Carousel>
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
        <section className="border-t border-border/40 bg-white py-12">
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
        <section className="bg-brand-dark py-12 text-white">
          <div className="container-vf flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
            <div className="flex-1">
              <h2 className="text-xl font-black md:text-2xl">
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
      <div className="fixed inset-x-0 bottom-0 z-50 flex gap-2 border-t border-border/60 bg-white/95 p-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur-md lg:hidden">
        <button
          type="button"
          onClick={() => openBooking("Đăng ký lái thử")}
          className="flex-1 rounded-xl border-2 border-brand py-3 text-[11px] font-black text-brand"
        >
          LÁI THỬ
        </button>
        <button
          type="button"
          onClick={() => openBooking("Đặt mua ngay")}
          className="flex-1 rounded-xl bg-brand py-3 text-[11px] font-black text-white"
        >
          ĐẶT MUA
        </button>
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
              src={detail.gallery[activeImage]}
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
  children,
  ref,
}: {
  id: TabId;
  alt?: boolean;
  children: React.ReactNode;
  ref?: (el: HTMLElement | null) => void;
}) {
  return (
    <section
      id={id}
      ref={ref}
      className={`scroll-mt-36 py-12 md:py-16 ${alt ? "bg-surface" : "bg-white"}`}
    >
      <div className="container-vf">{children}</div>
    </section>
  );
}

function OverviewSection({ detail }: { detail: ScooterDetail }) {
  return (
    <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
      <div>
        <p className="text-xs font-bold tracking-widest text-brand uppercase">Tổng quan</p>
        <h2 className={`mt-2 ${sectionHeading}`}>{detail.overview.title}</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {detail.overview.subtitle}
        </p>
        <ul className="mt-6 space-y-3">
          {detail.overview.bullets.map((b) => (
            <li key={b} className="flex items-start gap-3 text-sm text-foreground/85">
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-brand/10">
                <Check size={12} className="text-brand" />
              </span>
              {b}
            </li>
          ))}
        </ul>
      </div>
      <div className="overflow-hidden rounded-2xl shadow-card">
        <img
          src={detail.overview.image}
          alt={detail.overview.title}
          className="aspect-[4/3] w-full object-cover"
        />
      </div>
    </div>
  );
}

function ExteriorSection({ detail }: { detail: ScooterDetail }) {
  return (
    <>
      <SectionHeader title="Ngoại thất" subtitle="Thiết kế ấn tượng, khí động học tối ưu" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {detail.exterior.map((item) => (
          <FeatureCard key={item.title} {...item} />
        ))}
      </div>
    </>
  );
}

function InteriorSection({ detail }: { detail: ScooterDetail }) {
  return (
    <>
      <SectionHeader
        title="Thiết kế & Tiện nghi"
        subtitle="Thiết kế ergonomic, tiện dụng cho đô thị"
      />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {detail.design.map((item) => (
          <FeatureCard key={item.title} {...item} />
        ))}
      </div>
    </>
  );
}

function DesignSection({ detail }: { detail: ScooterDetail }) {
  return <InteriorSection detail={detail} />;
}

function TechnologySection({ detail }: { detail: ScooterDetail }) {
  return (
    <>
      <SectionHeader
        title="Công nghệ thông minh"
        subtitle="Hệ sinh thái kết nối toàn diện"
        center
      />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {detail.technology.map((tech) => {
          const Icon = TECH_ICONS[tech.icon];
          return (
            <div
              key={tech.title}
              className="group rounded-2xl border border-border/60 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-card"
            >
              <div className="flex size-11 items-center justify-center rounded-xl border border-brand/20 bg-brand/5 transition group-hover:bg-brand group-hover:text-white">
                <Icon className="size-5 text-brand group-hover:text-white" strokeWidth={1.5} />
              </div>
              <h3 className="mt-4 text-sm font-bold text-brand-dark">{tech.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{tech.desc}</p>
            </div>
          );
        })}
      </div>
    </>
  );
}

function PerformanceSection({ detail }: { detail: ScooterDetail }) {
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

function SafetySection({ detail }: { detail: ScooterDetail }) {
  return (
    <>
      <SectionHeader title={detail.safety.title} subtitle={detail.safety.subtitle} center />
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {detail.safety.highlights.map((h) => (
          <span
            key={h}
            className="rounded-full border border-brand/30 bg-brand/5 px-4 py-1.5 text-xs font-semibold text-brand"
          >
            {h}
          </span>
        ))}
      </div>
      <div className="mt-8 grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="grid gap-3 sm:grid-cols-2">
          {detail.safety.features.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-border/60 bg-white p-4 shadow-soft"
            >
              <div className="flex items-start gap-2.5">
                <Shield className="mt-0.5 size-4 shrink-0 text-brand" strokeWidth={1.5} />
                <div>
                  <h3 className="text-sm font-bold text-brand-dark">{f.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{f.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="overflow-hidden rounded-2xl shadow-card">
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

function SpecsSection({ detail }: { detail: ScooterDetail }) {
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

function AccessoriesSection({ detail }: { detail: ScooterDetail }) {
  return (
    <>
      <SectionHeader title="Phụ kiện chính hãng" subtitle="Nâng tầm trải nghiệm lái xe" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {detail.accessories.map((acc) => (
          <div
            key={acc.name}
            className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-card"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <img src={acc.image} alt={acc.name} className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-1 flex-col p-4">
              <h3 className="text-sm font-bold text-brand-dark">{acc.name}</h3>
              <p className="mt-2 text-sm font-black text-brand">{formatPrice(acc.price)} VND</p>
              <Link
                href="/phu-kien"
                className="mt-auto pt-4 text-xs font-semibold text-brand hover:underline"
              >
                Xem phụ kiện →
              </Link>
            </div>
          </div>
        ))}
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
          <div className="border-b border-border/50 p-6 lg:col-span-5 lg:border-r lg:border-b-0">
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
                  <SelectTrigger className="text-xs">
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
          <div className="bg-surface p-6 lg:col-span-7">
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
              <p className="mt-1 text-2xl font-black text-brand md:text-3xl">
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
  return (
    <>
      <SectionHeader
        title="Đánh giá khách hàng"
        subtitle="Trải nghiệm thực tế từ cộng đồng"
        center
      />
      <div className="mx-auto mt-6 flex max-w-xs flex-col items-center rounded-2xl border border-border/60 bg-white p-6 shadow-soft">
        <p className="text-5xl font-black text-brand-dark">
          {detail.reviews.averageRating.toFixed(1)}
        </p>
        <StarRating rating={detail.reviews.averageRating} size={18} />
        <p className="mt-2 text-xs text-muted-foreground">
          Dựa trên {detail.reviews.totalReviews} đánh giá
        </p>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {detail.reviews.items.map((review) => (
          <div
            key={`${review.name}-${review.date}`}
            className="rounded-2xl border border-border/60 bg-white p-5 shadow-soft"
          >
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand/10">
                <User className="size-5 text-brand" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-bold text-brand-dark">{review.name}</p>
                  <p className="text-[10px] text-muted-foreground">{review.date}</p>
                </div>
                {review.variant && (
                  <p className="text-[10px] font-semibold text-brand">{review.variant}</p>
                )}
                <StarRating rating={review.rating} size={12} className="mt-1" />
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {review.content}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ─── Shared UI atoms ─── */

function BreadcrumbBar({ scooterName, variantName }: { scooterName: string; variantName: string }) {
  return (
    <div className="border-b border-border/40 bg-white">
      <div className="container-vf py-3">
        <Breadcrumb>
          <BreadcrumbList>
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
              <BreadcrumbPage className="text-xs text-muted-foreground">
                {scooterName}
              </BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
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

function UtilityLink({
  icon: Icon,
  label,
  href,
}: {
  icon: React.ElementType;
  label: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[11px] font-semibold text-muted-foreground transition hover:bg-surface hover:text-brand"
    >
      <Icon size={14} className="text-brand" />
      {label}
    </Link>
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
      className={`flex items-center justify-between font-semibold ${
        indent ? "border-l-2 border-border pl-3" : ""
      } ${highlight ? "text-emerald-600" : "text-slate-600"}`}
    >
      <span>{label}</span>
      <span className={highlight ? "font-bold" : "font-bold text-slate-800"}>{value} VNĐ</span>
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
    <div className="group overflow-hidden rounded-2xl border border-border/60 bg-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-card">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="text-sm font-bold text-brand-dark">{title}</h3>
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}
