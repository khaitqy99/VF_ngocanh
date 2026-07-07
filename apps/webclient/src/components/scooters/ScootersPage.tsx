"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast, Toaster } from "sonner";
import {
  Shield,
  MapPin,
  Wallet,
  Zap,
  ChevronDown,
  ChevronLeft,
  RotateCcw,
  Cpu,
  ShieldCheck,
  Leaf,
  ChevronRight,
  Calculator,
  Calendar,
  Info,
  X,
  Check,
  Phone,
  Clock,
  Plus,
  Percent,
  Bike,
} from "lucide-react";

import { ScooterCatalogCard } from "@/components/scooters/ScooterCatalogCard";
import {
  EstimatorMotionShell,
  EstimatorTotalFooter,
  ScootersBreadcrumbBar,
  ScootersCatalogListHeader,
  ScootersEmptyState,
  ScootersPromoBanners,
  ScootersSearchBar,
  ScootersSectionHeader,
  ScootersWhyVinFastSection,
} from "@/components/scooters/ScootersAnimatedSections";
import { PageMarketingHero } from "@/components/shared/PageMarketingHero";
import { CatalogGrid, CatalogGridItem, FadeIn } from "@/components/motion";
import { Checkbox } from "@/components/ui/checkbox";
import Header from "@/components/site/Header";
import { SHOWROOM_BOOKING_LABEL } from "@/lib/dealership";
import FloatingButtons from "@/components/site/FloatingButtons";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SCOOTER_HERO_BANNERS, type HeroBannerSlide } from "@/lib/images";
import {
  SCOOTERS_PER_PAGE,
  formatPrice,
  PRICE_MAX,
  PRICE_MIN,
  RANGE_OPTIONS,
  SPEED_OPTIONS,
  TYPE_OPTIONS,
  type ScooterModel,
  type ScooterType,
  type RangeBucket,
  type SpeedBucket,
} from "@/lib/scooters";
import { HOTLINE, HOTLINE_TEL } from "@/lib/contact";
import { carsBookingStep, carsEstimatorPanel } from "@/lib/cars-motion";
import { useModalMotion } from "@/hooks/use-modal-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const HERO_FEATURES = [
  { icon: Shield, text: "Bảo hành chính hãng", sub: "Lên tới 5 năm hoặc 30.000km" },
  { icon: MapPin, text: "Dịch vụ toàn diện", sub: "Cứu hộ 24/7 & trạm sạc toàn quốc" },
  { icon: Wallet, text: "Hỗ trợ tài chính", sub: "Trả góp lãi suất 0% siêu linh hoạt" },
] as const;

const WHY_VINFAST = [
  {
    icon: Cpu,
    title: "Công nghệ thông minh",
    desc: "Kết nối thông minh qua App VinFast Scooter, định vị GPS chống trộm, chẩn đoán lỗi xe tự động và nâng cấp phần mềm FOTA.",
  },
  {
    icon: Zap,
    title: "Hiệu suất đột phá",
    desc: "Động cơ điện in-wheel mạnh mẽ hoặc Mid-motor truyền động dây đai, tăng tốc bốc như xe xăng, vận hành êm ái tuyệt đối.",
  },
  {
    icon: ShieldCheck,
    title: "An toàn & Chống nước",
    desc: "Đèn full-LED siêu sáng, phanh đĩa ABS cao cấp. Đạt chuẩn chống nước IP67 cao nhất, tự tin vượt lụt ngập sâu tới 0.5 mét.",
  },
  {
    icon: Leaf,
    title: "Siêu tiết kiệm & Thân thiện",
    desc: "Chi phí sạc điện siêu rẻ (chỉ bằng 1/10 chi phí xăng). Không khí thải, không tiếng ồn, gìn giữ môi trường đô thị xanh.",
  },
] as const;

type SortKey = "newest" | "price-asc" | "price-desc" | "range-desc" | "speed-desc";

type Filters = {
  types: Set<ScooterType | "all">;
  priceRange: [number, number];
  ranges: Set<RangeBucket>;
  speeds: Set<SpeedBucket>;
};

const defaultFilters = (): Filters => ({
  types: new Set(["all"]),
  priceRange: [PRICE_MIN, PRICE_MAX],
  ranges: new Set(),
  speeds: new Set(),
});

// Cities and Provinces for Scooter Rolling Cost
const PROVINCES = [
  { id: "hanoi", name: "Hà Nội (Lệ phí biển 2 - 4 triệu)", rate: 0.05, maxPlate: 4_000_000 },
  { id: "hcm", name: "TP. Hồ Chí Minh (Lệ phí biển 2 - 4 triệu)", rate: 0.05, maxPlate: 4_000_000 },
  {
    id: "other",
    name: "Tỉnh/Thành phố khác (Lệ phí biển 100K - 800K)",
    rate: 0.02,
    maxPlate: 800_000,
  },
];

export default function ScootersPage({
  scooters: SCOOTERS,
  heroBanners: SCOOTER_HERO_BANNERS,
  embedded = false,
  adminEdit = false,
}: {
  scooters: ScooterModel[];
  heroBanners: HeroBannerSlide[];
  embedded?: boolean;
  adminEdit?: boolean;
}) {
  const reduced = useReducedMotion();
  const modalMotion = useModalMotion();
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [sort, setSort] = useState<SortKey>("newest");
  const [mobileFilters, setMobileFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [segmentTab, setSegmentTab] = useState<string>("all");

  // Booking Modal State
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingScooter, setBookingScooter] = useState<ScooterModel | null>(null);
  const [bookingStep, setBookingStep] = useState(1);
  const [bookingStepDir, setBookingStepDir] = useState(1);
  const [bookingForm, setBookingForm] = useState({
    name: "",
    phone: "",
    email: "",
    service: "Đăng ký lái thử",
    showroom: SHOWROOM_BOOKING_LABEL,
    date: "",
    time: "09:00",
    note: "",
    contactMethod: "Phone",
  });

  // Rolling Cost Estimator State
  const [estimatorScooterId, setEstimatorScooterId] = useState<string>("evo");
  const [estimatorLocation, setEstimatorLocation] = useState<string>("other");

  // Installment Calculator State
  const [downPaymentPct, setDownPaymentPct] = useState<number>(30);
  const [loanTermYears, setLoanTermYears] = useState<number>(2); // Typically 1-2 years for scooters
  const [interestRate, setInterestRate] = useState<number>(0); // Promo 0% is common
  const [estimatorTab, setEstimatorTab] = useState<"rolling" | "installment">("rolling");

  // Filter scooters based on sidebar filters + segment tab + search query
  const filteredScooters = useMemo(() => {
    let result = SCOOTERS.filter((scooter) => {
      // 1. Sidebar filters
      const typeOk =
        filters.types.has("all") || filters.types.size === 0 || filters.types.has(scooter.type);
      const priceOk =
        scooter.price >= filters.priceRange[0] && scooter.price <= filters.priceRange[1];
      const rangeOk = filters.ranges.size === 0 || filters.ranges.has(scooter.rangeBucket);
      const speedOk = filters.speeds.size === 0 || filters.speeds.has(scooter.speedBucket);

      // 2. Quick segment tab
      let tabOk = true;
      if (segmentTab === "student") {
        tabOk = scooter.type === "xe-dap-dien" || scooter.id === "evo-lite-neo";
      } else if (segmentTab === "urban") {
        tabOk = scooter.type === "xe-co-ban" || scooter.id === "feliz-2025";
      } else if (segmentTab === "luxury") {
        tabOk = scooter.type === "xe-ga-cao-cap" || scooter.id === "vero-x";
      }

      // 3. Search query
      const searchOk =
        searchQuery === "" ||
        scooter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scooter.subtitle.toLowerCase().includes(searchQuery.toLowerCase());

      return typeOk && priceOk && rangeOk && speedOk && tabOk && searchOk;
    });

    // Sorting
    if (sort === "price-asc") result = [...result].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") result = [...result].sort((a, b) => b.price - a.price);
    if (sort === "range-desc") result = [...result].sort((a, b) => b.range - a.range);
    if (sort === "speed-desc") result = [...result].sort((a, b) => b.topSpeed - a.topSpeed);
    return result;
  }, [filters, sort, segmentTab, searchQuery]);

  const clearFilters = () => {
    setFilters(defaultFilters());
    setSearchQuery("");
    setSegmentTab("all");
    toast.success("Đã thiết lập lại tất cả bộ lọc");
  };

  const goBookingStep = (step: number) => {
    setBookingStepDir(step > bookingStep ? 1 : -1);
    setBookingStep(step);
  };

  // Trigger Booking Modal
  const openBooking = (scooter: ScooterModel) => {
    setBookingScooter(scooter);
    setBookingStep(1);
    setIsBookingOpen(true);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.name || !bookingForm.phone) {
      toast.error("Vui lòng nhập đầy đủ Họ tên và Số điện thoại");
      return;
    }
    // Advance to success step
    setBookingStep(4);
    toast.success("Gửi yêu cầu đặt lịch/mua xe thành công!");
  };

  const selectedEstimatorScooter = useMemo(() => {
    return SCOOTERS.find((s) => s.id === estimatorScooterId) || SCOOTERS[0];
  }, [estimatorScooterId]);

  // Rolling Cost Calculation for Scooter
  const rollingCostResult = useMemo(() => {
    const scooter = selectedEstimatorScooter;
    const basePrice = scooter.price;

    // Vietnam Motorcycle Registration fee
    const province = PROVINCES.find((p) => p.id === estimatorLocation) || PROVINCES[0];
    const registrationTax = Math.round(basePrice * province.rate);

    // Plate Fee (Calculated based on price range in HN/HCM)
    let plateFee = 100_000;
    if (province.id === "hanoi" || province.id === "hcm") {
      if (basePrice < 15_000_000) plateFee = 1_000_000;
      else if (basePrice <= 40_000_000) plateFee = 2_000_000;
      else plateFee = 4_000_000;
    } else {
      // Provinces
      if (basePrice < 15_000_000) plateFee = 150_000;
      else if (basePrice <= 40_000_000) plateFee = 400_000;
      else plateFee = 800_000;
    }

    const inspectionFee = 100_000; // soft fee for registration support
    const civilInsurance = 66_000; // Standard compulsory civil liability insurance for under 50cc or over 50cc scooters

    const totalRolling = basePrice + registrationTax + plateFee + inspectionFee + civilInsurance;

    return {
      basePrice,
      registrationTax,
      plateFee,
      inspectionFee,
      civilInsurance,
      totalRolling,
    };
  }, [selectedEstimatorScooter, estimatorLocation]);

  // Installment Calculator Calculation
  const installmentResult = useMemo(() => {
    const totalCost = rollingCostResult.totalRolling;
    const loanAmount = Math.round((totalCost * downPaymentPct) / 100);
    const upfrontAmount = totalCost - loanAmount;

    const months = loanTermYears * 12;
    const monthlyRate = interestRate / 100 / 12;

    // Amortization (Principal + Interest)
    const firstMonthPrincipal = Math.round(loanAmount / months);
    const firstMonthInterest = Math.round(loanAmount * monthlyRate);
    const firstMonthTotal = firstMonthPrincipal + firstMonthInterest;

    let totalPaid = 0;
    let tempLoan = loanAmount;
    for (let m = 0; m < months; m++) {
      const interest = tempLoan * monthlyRate;
      totalPaid += firstMonthPrincipal + interest;
      tempLoan -= firstMonthPrincipal;
    }
    const avgMonthlyPayment = Math.round(totalPaid / months);

    return {
      loanAmount,
      upfrontAmount,
      firstMonthPrincipal,
      firstMonthInterest,
      firstMonthTotal,
      avgMonthlyPayment,
    };
  }, [rollingCostResult, downPaymentPct, loanTermYears, interestRate]);

  useEffect(() => {
    if (!adminEdit || !embedded) return;
    const timer = window.setTimeout(() => {
      document
        .getElementById("scooter-catalog-grid")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 350);
    return () => window.clearTimeout(timer);
  }, [adminEdit, embedded]);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background font-sans text-foreground">
      <Toaster position="top-right" richColors />
      {embedded ? (
        <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-xs font-medium text-amber-900">
          {adminEdit
            ? "Chế độ sửa thẻ catalog — chỉnh từng card rồi bấm Lưu thẻ"
            : "Chế độ xem trước — giao diện giống trang danh mục trên website"}
        </div>
      ) : null}
      {adminEdit ? (
        <div className="sticky top-0 z-30 border-b border-brand/30 bg-brand-dark px-4 py-2.5 text-white shadow-lg">
          <p className="container-vf text-center text-xs font-semibold">
            Sửa thẻ catalog trực tiếp — tên, giá, thông số, nhãn & ảnh trên từng card
          </p>
        </div>
      ) : null}
      {!embedded && <Header />}

      <main>
        {!embedded && <ScootersBreadcrumbBar />}

        {!embedded && !adminEdit ? (
          <HeroSection
            onExplore={() => {
              document
                .getElementById("scooter-catalog-grid")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          />
        ) : null}

        {!adminEdit ? (
          <ScootersSearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        ) : null}

        {/* Main Catalog Explorer Section */}
        <section className="section-y bg-white">
          <div className="container-vf">
            <button
              type="button"
              onClick={() => setMobileFilters(!mobileFilters)}
              className={`page-section-card mb-6 flex w-full items-center justify-between px-5 py-4 text-sm font-bold text-brand-dark shadow-sm hover:bg-surface-muted/50 lg:hidden ${adminEdit ? "hidden" : ""}`}
            >
              <span className="flex items-center gap-2">
                <SlidersIcon className="size-4 text-brand" /> Bộ lọc nâng cao
              </span>
              <ChevronDown
                className={`size-4 transition-transform duration-300 ${mobileFilters ? "rotate-180" : ""}`}
              />
            </button>

            <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
              {!adminEdit ? (
                <aside
                  className={`${mobileFilters ? "block" : "hidden"} w-full max-h-[min(70vh,640px)] shrink-0 overflow-y-auto overscroll-contain lg:block lg:max-h-[80vh] lg:w-[260px] lg:sticky lg:top-[150px] lg:z-10 lg:overflow-y-auto`}
                >
                  <FadeIn direction="left">
                    <FilterSidebar
                      filters={filters}
                      setFilters={setFilters}
                      onClear={clearFilters}
                    />
                  </FadeIn>
                </aside>
              ) : null}

              {/* Grid content and pagination */}
              <div className="min-w-0 flex-1">
                <ScootersCatalogListHeader
                  count={filteredScooters.length}
                  sort={sort}
                  setSort={setSort}
                  segmentTab={segmentTab}
                />

                {filteredScooters.length === 0 ? (
                  <ScootersEmptyState onClear={clearFilters} />
                ) : (
                  <CatalogGrid
                    id="scooter-catalog-grid"
                    className="grid grid-cols-2 items-stretch gap-3 sm:gap-6 lg:grid-cols-3"
                  >
                    {filteredScooters.map((scooter, index) => (
                      <CatalogGridItem key={scooter.id} index={index}>
                        <ScooterCatalogCard
                          scooter={scooter}
                          adminEdit={adminEdit}
                          onBookDrive={() => openBooking(scooter)}
                          onEstimatePrice={() => {
                            setEstimatorScooterId(scooter.id);
                            document
                              .getElementById("estimator-tool")
                              ?.scrollIntoView({ behavior: "smooth" });
                          }}
                        />
                      </CatalogGridItem>
                    ))}
                  </CatalogGrid>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic & Gorgeous Rolling Cost & Installment Loan Estimator for Scooters */}
        {!adminEdit ? (
          <section
            id="estimator-tool"
            className="section-y overflow-hidden relative border-b border-border/60 bg-background text-slate-800"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,87,255,0.06),transparent)] pointer-events-none" />

            <div className="container-vf relative z-10">
              <ScootersSectionHeader
                eyebrow="Công cụ tính toán"
                title="DỰ TOÁN CHI PHÍ & TRẢ GÓP XE MÁY"
                description="Tính toán chi phí lăn bánh chính xác bao gồm lệ phí trước bạ xe máy điện, lệ phí cấp biển số theo quy định mới, và dự toán kế hoạch mua xe trả góp 0% lãi suất."
              />

              <EstimatorMotionShell>
                <div className="page-showcase-shell mx-auto grid max-w-5xl overflow-hidden rounded-[1.75rem] shadow-xl lg:grid-cols-12">
                  {/* Left Settings Panel */}
                  <div className="lg:col-span-5 p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-slate-200 bg-white">
                    <h3 className="text-sm font-black tracking-wide border-b border-slate-100 pb-4 text-brand-dark uppercase flex items-center gap-2">
                      <Calculator className="size-4 text-brand" /> Cấu hình dự toán
                    </h3>

                    {/* Select Scooter */}
                    <div className="mt-6">
                      <label className="block text-[10px] font-bold tracking-wider text-slate-500 uppercase mb-2">
                        Chọn dòng xe máy điện
                      </label>
                      <Select
                        value={estimatorScooterId}
                        onValueChange={(v) => setEstimatorScooterId(v)}
                      >
                        <SelectTrigger className="w-full bg-surface-muted border-slate-200 text-slate-800 font-bold h-11 text-xs focus:bg-white focus:ring-1 focus:ring-brand">
                          <SelectValue placeholder="Chọn xe" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-slate-200 text-slate-800">
                          {SCOOTERS.map((s) => (
                            <SelectItem
                              key={s.id}
                              value={s.id}
                              className="focus:bg-slate-100 font-medium"
                            >
                              {s.name} — {formatPrice(s.price)} VNĐ
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Tab switch inside estimator settings */}
                    <div className="grid grid-cols-2 mt-6 bg-surface-muted p-1 rounded-lg border border-slate-200">
                      <button
                        onClick={() => setEstimatorTab("rolling")}
                        className={`py-2 text-xs font-bold rounded-md transition-all ${
                          estimatorTab === "rolling"
                            ? "bg-brand text-white shadow-md"
                            : "text-slate-500 hover:text-brand-dark"
                        }`}
                      >
                        Giá Lăn Bánh
                      </button>
                      <button
                        onClick={() => setEstimatorTab("installment")}
                        className={`py-2 text-xs font-bold rounded-md transition-all ${
                          estimatorTab === "installment"
                            ? "bg-brand text-white shadow-md"
                            : "text-slate-500 hover:text-brand-dark"
                        }`}
                      >
                        Phương Án Trả Góp
                      </button>
                    </div>

                    {/* Common options for both tabs */}
                    <div className="mt-6 space-y-4">
                      {/* Province Selection */}
                      <div>
                        <label className="block text-[10px] font-bold tracking-wider text-slate-500 uppercase mb-2">
                          Hộ khẩu đăng ký biển số
                        </label>
                        <Select
                          value={estimatorLocation}
                          onValueChange={(v) => setEstimatorLocation(v)}
                        >
                          <SelectTrigger className="w-full bg-surface-muted border-slate-200 text-slate-800 font-medium h-11 text-xs focus:bg-white focus:ring-1 focus:ring-brand">
                            <SelectValue placeholder="Chọn Khu Vực" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border-slate-200 text-slate-800">
                            {PROVINCES.map((p) => (
                              <SelectItem
                                key={p.id}
                                value={p.id}
                                className="focus:bg-slate-100 font-medium"
                              >
                                {p.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Additional options based on selected tab */}
                      {estimatorTab === "installment" && (
                        <div className="space-y-4 pt-2">
                          {/* Downpayment % slider */}
                          <div>
                            <div className="flex justify-between text-xs font-bold mb-2">
                              <span className="text-slate-500">Trả trước</span>
                              <span className="text-brand">{100 - downPaymentPct}% giá trị</span>
                            </div>
                            <Slider
                              min={20}
                              max={80}
                              step={10}
                              value={[100 - downPaymentPct]}
                              onValueChange={(v) => setDownPaymentPct(100 - v[0])}
                              className="py-1"
                            />
                            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                              <span>Trả trước tối thiểu 20%</span>
                              <span>Trả trước tối đa 80%</span>
                            </div>
                          </div>

                          {/* Loan term slider */}
                          <div>
                            <div className="flex justify-between text-xs font-bold mb-2">
                              <span className="text-slate-500">Thời gian trả góp</span>
                              <span className="text-brand">
                                {loanTermYears} năm ({loanTermYears * 12} tháng)
                              </span>
                            </div>
                            <Slider
                              min={1}
                              max={3}
                              step={1}
                              value={[loanTermYears]}
                              onValueChange={(v) => setLoanTermYears(v[0])}
                              className="py-1"
                            />
                            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                              <span>1 năm (12 tháng)</span>
                              <span>3 năm (36 tháng)</span>
                            </div>
                          </div>

                          {/* Interest Rate */}
                          <div>
                            <div className="flex justify-between text-xs font-bold mb-2">
                              <span className="text-slate-500">Lãi suất trả góp</span>
                              <span className="text-brand">{interestRate}% / năm</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              {[0, 4.9].map((rate) => (
                                <button
                                  key={rate}
                                  onClick={() => setInterestRate(rate)}
                                  className={`py-1 rounded text-xs font-bold border transition-all ${
                                    interestRate === rate
                                      ? "border-brand bg-brand/10 text-brand"
                                      : "border-slate-200 bg-surface-muted text-slate-500 hover:text-brand-dark hover:bg-slate-100"
                                  }`}
                                >
                                  {rate}% {rate === 0 ? "(Gói ưu đãi 0%)" : "(Gói tiêu chuẩn)"}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Results Panel */}
                  <div className="flex flex-col justify-between bg-surface-muted p-6 md:p-8 lg:col-span-7">
                    <AnimatePresence mode="wait" custom={estimatorTab}>
                      {estimatorTab === "rolling" ? (
                        <motion.div
                          key="rolling"
                          custom="rolling"
                          variants={reduced ? undefined : carsEstimatorPanel}
                          initial={reduced ? false : "enter"}
                          animate="center"
                          exit={reduced ? undefined : "exit"}
                        >
                          <h3 className="text-sm font-black tracking-wide border-b border-slate-200 pb-4 text-brand-dark uppercase flex items-center gap-2 mb-6">
                            <Calculator className="size-4 text-brand" /> Chi phí lăn bánh chi tiết
                          </h3>

                          <EstimatorCostList>
                            <EstimatorCostRow
                              label="Giá niêm yết của xe máy"
                              value={`${formatPrice(selectedEstimatorScooter.price)} đ`}
                            />
                            <EstimatorCostRow
                              label="Lệ phí trước bạ xe máy điện"
                              value={`${formatPrice(rollingCostResult.registrationTax)} đ`}
                            />
                            <EstimatorCostRow
                              label="Lệ phí cấp biển số theo giá trị xe"
                              value={`${formatPrice(rollingCostResult.plateFee)} đ`}
                            />
                            <EstimatorCostRow
                              label="Bảo hiểm TNDS bắt buộc (xe máy)"
                              value={`${formatPrice(rollingCostResult.civilInsurance)} đ`}
                            />
                            <EstimatorCostRow
                              label="Phí dịch vụ đăng ký biển số"
                              value={`${formatPrice(rollingCostResult.inspectionFee)} đ`}
                            />
                          </EstimatorCostList>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="installment"
                          custom="installment"
                          variants={reduced ? undefined : carsEstimatorPanel}
                          initial={reduced ? false : "enter"}
                          animate="center"
                          exit={reduced ? undefined : "exit"}
                        >
                          <h3 className="text-sm font-black tracking-wide border-b border-slate-200 pb-4 text-brand-dark uppercase flex items-center gap-2 mb-6">
                            <Percent className="size-4 text-brand" /> Phương án tài chính mua xe
                          </h3>

                          <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div className="page-section-card p-4">
                              <p className="text-[10px] font-bold uppercase text-slate-500">
                                Số tiền trả góp ({downPaymentPct}%)
                              </p>
                              <p className="mt-1 text-lg font-black tabular-nums text-brand">
                                {formatPrice(installmentResult.loanAmount)} đ
                              </p>
                            </div>
                            <div className="page-section-card p-4">
                              <p className="text-[10px] font-bold uppercase text-slate-500">
                                Số tiền thanh toán trước ({100 - downPaymentPct}%)
                              </p>
                              <p className="mt-1 text-lg font-black tabular-nums text-slate-800">
                                {formatPrice(installmentResult.upfrontAmount)} đ
                              </p>
                            </div>
                          </div>

                          <EstimatorCostList>
                            <EstimatorCostRow
                              label="Tổng giá trị lăn bánh xe máy"
                              value={`${formatPrice(rollingCostResult.totalRolling)} đ`}
                            />
                            <EstimatorCostRow
                              label="Thời hạn trả góp"
                              value={`${loanTermYears * 12} tháng`}
                            />
                            <EstimatorCostRow
                              label="Gốc thanh toán hàng tháng"
                              value={`${formatPrice(installmentResult.firstMonthPrincipal)} đ`}
                            />
                            <EstimatorCostRow
                              label="Lãi thanh toán hàng tháng"
                              value={`${formatPrice(installmentResult.firstMonthInterest)} đ`}
                            />
                          </EstimatorCostList>

                          <p className="mt-3 flex items-start gap-2 rounded-lg border border-brand/15 bg-brand/5 px-3 py-2.5 text-[10px] leading-relaxed text-slate-600">
                            <Info className="mt-0.5 size-3.5 shrink-0 text-brand" />
                            Duyệt hồ sơ nhanh qua CCCD gắn chip — thủ tục gọn trong khoảng 10 phút.
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <EstimatorTotalFooter
                      estimatorTab={estimatorTab}
                      rollingTotal={rollingCostResult.totalRolling}
                      firstMonthTotal={installmentResult.firstMonthTotal}
                      avgMonthly={installmentResult.avgMonthlyPayment}
                      onBook={() => openBooking(selectedEstimatorScooter)}
                    />
                  </div>
                </div>
              </EstimatorMotionShell>
            </div>
          </section>
        ) : null}

        {!adminEdit ? (
          <>
            <ScootersPromoBanners />
            <ScootersWhyVinFastSection items={WHY_VINFAST} />
          </>
        ) : null}
      </main>

      {!embedded && <FloatingButtons />}

      {/* RENDER MODAL: Comprehensive Booking Appointment Scheduler for Scooters */}
      <AnimatePresence>
        {isBookingOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            {...modalMotion.overlay}
            onClick={() => setIsBookingOpen(false)}
          >
            <motion.div
              {...modalMotion.panel}
              onClick={(e) => e.stopPropagation()}
              className="flex w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white text-slate-800 shadow-2xl"
            >
              {/* Modal Header */}
              <div className="bg-brand-dark text-white p-5 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black">LIÊN HỆ & ĐẶT MUA XE MÁY ĐIỆN</h3>
                  <p className="text-xs text-brand-light opacity-85 mt-1">
                    Mua sắm an tâm tại Showroom VinFast Ngọc Anh Cà Mau
                  </p>
                </div>
                <button
                  onClick={() => setIsBookingOpen(false)}
                  className="p-1 rounded-lg hover:bg-white/10 transition-all text-white/80 hover:text-white"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Steps Indicator */}
              {bookingStep < 4 && (
                <div className="bg-surface-muted border-b border-slate-100 px-6 py-3 flex justify-between items-center text-[10px] font-bold text-slate-400">
                  <span
                    className={`${bookingStep === 1 ? "text-brand" : bookingStep > 1 ? "text-slate-700" : ""}`}
                  >
                    1. CHỌN XE MÁY
                  </span>
                  <ChevronRight className="size-3" />
                  <span
                    className={`${bookingStep === 2 ? "text-brand" : bookingStep > 2 ? "text-slate-700" : ""}`}
                  >
                    2. THÔNG TIN KHÁCH HÀNG
                  </span>
                  <ChevronRight className="size-3" />
                  <span className={`${bookingStep === 3 ? "text-brand" : ""}`}>
                    3. ĐẶT LỊCH & HOÀN TẤT
                  </span>
                </div>
              )}

              {/* Form Content */}
              <form
                onSubmit={handleBookingSubmit}
                className="flex-1 overflow-y-auto p-6 max-h-[75vh]"
              >
                <AnimatePresence mode="wait" custom={bookingStepDir}>
                  {bookingStep === 1 && (
                    <motion.div
                      key="step-1"
                      custom={bookingStepDir}
                      variants={reduced ? undefined : carsBookingStep}
                      initial={reduced ? false : "enter"}
                      animate="center"
                      exit={reduced ? undefined : "exit"}
                      className="space-y-4"
                    >
                      <p className="text-xs font-bold text-slate-500 mb-2">
                        Vui lòng chọn dòng xe máy điện bạn đang quan tâm và dịch vụ yêu cầu:
                      </p>

                      {/* Scooter Selector visual list */}
                      <div className="grid grid-cols-2 gap-3 max-h-[180px] overflow-y-auto border border-slate-100 p-2 rounded-xl bg-surface-muted">
                        {SCOOTERS.map((scooter) => (
                          <button
                            key={scooter.id}
                            type="button"
                            onClick={() => setBookingScooter(scooter)}
                            className={`flex items-center gap-3 p-2.5 rounded-lg border text-left transition-all ${
                              bookingScooter?.id === scooter.id
                                ? "border-brand bg-brand/5 ring-1 ring-brand font-bold"
                                : "border-slate-200 bg-white hover:bg-surface-muted"
                            }`}
                          >
                            <img
                              src={scooter.image}
                              alt={scooter.name}
                              className="size-8 object-contain"
                            />
                            <span className="text-xs">{scooter.name}</span>
                          </button>
                        ))}
                      </div>

                      {/* Service Options */}
                      <div>
                        <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                          Bạn cần tư vấn dịch vụ gì?
                        </span>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                          {["Đăng ký lái thử", "Nhận báo giá", "Hỗ trợ trả góp 0%"].map((svc) => (
                            <button
                              key={svc}
                              type="button"
                              onClick={() => setBookingForm({ ...bookingForm, service: svc })}
                              className={`py-2 px-1 text-center rounded-lg border text-[11px] font-bold transition-all ${
                                bookingForm.service === svc
                                  ? "border-brand bg-brand/5 text-brand font-black"
                                  : "border-slate-200 text-slate-600 hover:bg-surface-muted"
                              }`}
                            >
                              {svc}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-end pt-4 border-t border-slate-100 mt-6">
                        <button
                          type="button"
                          onClick={() => goBookingStep(2)}
                          disabled={!bookingScooter}
                          className="bg-brand hover:bg-blue-600 text-white font-bold text-xs tracking-wider px-5 py-2.5 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                        >
                          Tiếp theo <ChevronRight className="size-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {bookingStep === 2 && (
                    <motion.div
                      key="step-2"
                      custom={bookingStepDir}
                      variants={reduced ? undefined : carsBookingStep}
                      initial={reduced ? false : "enter"}
                      animate="center"
                      exit={reduced ? undefined : "exit"}
                      className="space-y-4"
                    >
                      <p className="text-xs font-bold text-slate-500">
                        Chúng tôi cần một số thông tin liên hệ để gửi lịch hẹn và hỗ trợ làm hồ sơ
                        xe:
                      </p>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">
                          Họ và tên quý khách *
                        </label>
                        <input
                          type="text"
                          required
                          value={bookingForm.name}
                          onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                          placeholder="Nguyễn Văn A"
                          className="w-full bg-surface-muted border border-slate-200 px-4 py-2.5 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-brand text-slate-800 focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">
                          Số điện thoại liên hệ *
                        </label>
                        <input
                          type="tel"
                          required
                          value={bookingForm.phone}
                          onChange={(e) =>
                            setBookingForm({ ...bookingForm, phone: e.target.value })
                          }
                          placeholder="09xx xxx xxx"
                          className="w-full bg-surface-muted border border-slate-200 px-4 py-2.5 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-brand text-slate-800 focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">
                          Địa chỉ Email (Tùy chọn)
                        </label>
                        <input
                          type="email"
                          value={bookingForm.email}
                          onChange={(e) =>
                            setBookingForm({ ...bookingForm, email: e.target.value })
                          }
                          placeholder="email@example.com"
                          className="w-full bg-surface-muted border border-slate-200 px-4 py-2.5 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-brand text-slate-800 focus:bg-white"
                        />
                      </div>

                      <div>
                        <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                          Hình thức liên hệ ưu tiên
                        </span>
                        <div className="flex gap-4">
                          {[
                            { id: "Phone", label: "Gọi điện" },
                            { id: "Zalo", label: "Chat Zalo" },
                            { id: "Email", label: "Gửi Email" },
                          ].map((m) => (
                            <label
                              key={m.id}
                              className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 font-semibold select-none"
                            >
                              <input
                                type="radio"
                                name="contact"
                                checked={bookingForm.contactMethod === m.id}
                                onChange={() =>
                                  setBookingForm({ ...bookingForm, contactMethod: m.id })
                                }
                                className="text-brand accent-brand scale-110"
                              />
                              {m.label}
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between pt-4 border-t border-slate-100 mt-6">
                        <button
                          type="button"
                          onClick={() => goBookingStep(1)}
                          className="border border-slate-200 text-slate-500 font-semibold text-xs px-5 py-2.5 rounded-lg hover:bg-surface-muted"
                        >
                          Quay lại
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (!bookingForm.name || !bookingForm.phone) {
                              toast.error("Vui lòng nhập đầy đủ thông tin bắt buộc");
                              return;
                            }
                            goBookingStep(3);
                          }}
                          className="bg-brand hover:bg-blue-600 text-white font-bold text-xs tracking-wider px-5 py-2.5 rounded-lg"
                        >
                          Tiếp theo
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {bookingStep === 3 && (
                    <motion.div
                      key="step-3"
                      custom={bookingStepDir}
                      variants={reduced ? undefined : carsBookingStep}
                      initial={reduced ? false : "enter"}
                      animate="center"
                      exit={reduced ? undefined : "exit"}
                      className="space-y-4"
                    >
                      <p className="text-xs font-bold text-slate-500">
                        Đặt lịch hẹn mong muốn tại Showroom để được đón tiếp chu đáo nhất:
                      </p>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">
                          Showroom làm việc
                        </label>
                        <input
                          type="text"
                          disabled
                          value={bookingForm.showroom}
                          className="w-full bg-slate-100 border border-slate-200 px-4 py-2.5 rounded-lg text-xs font-bold text-slate-500 cursor-not-allowed"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">
                            Ngày đến showroom *
                          </label>
                          <input
                            type="date"
                            required
                            value={bookingForm.date}
                            onChange={(e) =>
                              setBookingForm({ ...bookingForm, date: e.target.value })
                            }
                            className="w-full bg-surface-muted border border-slate-200 px-4 py-2.5 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-brand text-slate-800 focus:bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">
                            Giờ hẹn mong muốn
                          </label>
                          <select
                            value={bookingForm.time}
                            onChange={(e) =>
                              setBookingForm({ ...bookingForm, time: e.target.value })
                            }
                            className="w-full bg-surface-muted border border-slate-200 px-4 py-2.5 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-brand text-slate-800 focus:bg-white"
                          >
                            {[
                              "08:00",
                              "09:00",
                              "10:00",
                              "11:00",
                              "14:00",
                              "15:00",
                              "16:00",
                              "17:00",
                            ].map((t) => (
                              <option key={t} value={t}>
                                {t}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">
                          Yêu cầu / Ghi chú thêm
                        </label>
                        <textarea
                          value={bookingForm.note}
                          onChange={(e) => setBookingForm({ ...bookingForm, note: e.target.value })}
                          placeholder="Tôi muốn đăng ký mua xe trả góp 0%, tư vấn màu sơn đỏ mận hợp mệnh..."
                          rows={3}
                          className="w-full bg-surface-muted border border-slate-200 px-4 py-2.5 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-brand text-slate-800 focus:bg-white"
                        />
                      </div>

                      <div className="flex justify-between pt-4 border-t border-slate-100 mt-6">
                        <button
                          type="button"
                          onClick={() => goBookingStep(2)}
                          className="border border-slate-200 text-slate-500 font-semibold text-xs px-5 py-2.5 rounded-lg hover:bg-surface-muted"
                        >
                          Quay lại
                        </button>
                        <button
                          type="submit"
                          className="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs tracking-wider px-6 py-2.5 rounded-lg flex items-center gap-1.5 shadow-md"
                        >
                          <Check className="size-4" /> Hoàn tất đăng ký
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {bookingStep === 4 && (
                    <motion.div
                      key="step-4"
                      custom={bookingStepDir}
                      variants={reduced ? undefined : carsBookingStep}
                      initial={reduced ? false : "enter"}
                      animate="center"
                      exit={reduced ? undefined : "exit"}
                      className="space-y-4 py-6 text-center"
                    >
                      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 border border-emerald-200">
                        <Check className="size-8" strokeWidth={2.5} />
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-slate-900">ĐĂNG KÝ THÀNH CÔNG!</h4>
                        <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
                          Cảm ơn quý khách{" "}
                          <strong className="text-slate-800">{bookingForm.name}</strong> đã tin
                          tưởng showroom VinFast Ngọc Anh Cà Mau. Chuyên viên tư vấn xe máy điện sẽ liên hệ trực
                          tiếp hỗ trợ quý khách trong vòng 10 phút qua{" "}
                          <strong className="text-slate-800">
                            {bookingForm.contactMethod === "Phone"
                              ? "Số điện thoại"
                              : bookingForm.contactMethod}
                          </strong>
                          .
                        </p>
                      </div>

                      <div className="bg-surface-muted rounded-xl p-4 border border-slate-100 text-left text-xs font-semibold space-y-2 max-w-sm mx-auto">
                        <div className="flex justify-between text-slate-500">
                          <span>Mẫu xe đăng ký:</span>
                          <span className="text-slate-800 font-bold">{bookingScooter?.name}</span>
                        </div>
                        <div className="flex justify-between text-slate-500">
                          <span>Nhu cầu tư vấn:</span>
                          <span className="text-slate-800 font-bold">{bookingForm.service}</span>
                        </div>
                        <div className="flex justify-between text-slate-500">
                          <span>Lịch hẹn đề xuất:</span>
                          <span className="text-slate-800 font-bold">
                            {bookingForm.date
                              ? `${bookingForm.time} ngày ${bookingForm.date}`
                              : "Chờ xếp lịch"}
                          </span>
                        </div>
                      </div>

                      <div className="pt-4">
                        <button
                          type="button"
                          onClick={() => {
                            setIsBookingOpen(false);
                            setBookingForm({
                              name: "",
                              phone: "",
                              email: "",
                              service: "Đăng ký lái thử",
                              showroom: SHOWROOM_BOOKING_LABEL,
                              date: "",
                              time: "09:00",
                              note: "",
                              contactMethod: "Phone",
                            });
                          }}
                          className="bg-brand hover:bg-blue-600 text-white font-bold text-xs tracking-wider px-6 py-2.5 rounded-lg"
                        >
                          Quay lại Danh sách xe
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EstimatorCostList({ children }: { children: React.ReactNode }) {
  return (
    <ul className="page-section-card divide-y divide-slate-100 overflow-hidden">{children}</ul>
  );
}

function EstimatorCostRow({
  label,
  value,
  valueClassName = "text-brand-dark",
  sub = false,
}: {
  label: React.ReactNode;
  value: string;
  valueClassName?: string;
  sub?: boolean;
}) {
  return (
    <li
      className={`flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4 ${
        sub ? "bg-surface-muted" : ""
      }`}
    >
      <span className="min-w-0 text-[11px] leading-snug text-slate-600 sm:text-xs">{label}</span>
      <span className={`shrink-0 text-sm font-black tabular-nums sm:text-right ${valueClassName}`}>
        {value}
      </span>
    </li>
  );
}

function SlidersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="4" y1="21" y2="14" />
      <line x1="4" x2="4" y1="10" y2="3" />
      <line x1="12" x2="12" y1="21" y2="12" />
      <line x1="12" x2="12" y1="8" y2="3" />
      <line x1="20" x2="20" y1="21" y2="16" />
      <line x1="20" x2="20" y1="12" y2="3" />
      <line x1="2" x2="6" y1="14" y2="14" />
      <line x1="10" x2="14" y1="8" y2="8" />
      <line x1="18" x2="22" y1="16" y2="16" />
    </svg>
  );
}

function HeroSection({ onExplore }: { onExplore: () => void }) {
  return (
    <PageMarketingHero
      banners={SCOOTER_HERO_BANNERS}
      title="Thời thượng, bứt phá"
      titleAccent="công nghệ tương lai"
      description="Sở hữu xe máy điện VinFast với pin LFP siêu bền, quãng đường lên tới 200 km/sạc, chống nước IP67 và chính sách trả góp 0% lãi suất tại VinFast Ngọc Anh Cà Mau."
      primaryCta={{ label: "KHÁM PHÁ CATALOG XE MÁY", onClick: onExplore }}
      secondaryCta={{ label: `GỌI TƯ VẤN: ${HOTLINE}`, href: HOTLINE_TEL }}
      highlights={[
        { value: "15+", label: "Dòng xe máy điện" },
        { value: "LFP", label: "Pin bền bỉ" },
        { value: "0%", label: "Trả góp lãi suất" },
      ]}
      features={[...HERO_FEATURES]}
    />
  );
}

function FilterSidebar({
  filters,
  setFilters,
  onClear,
}: {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  onClear: () => void;
}) {
  const toggleType = (value: ScooterType | "all") => {
    setFilters((prev) => {
      const next = new Set(prev.types);
      if (value === "all") return { ...prev, types: new Set(["all"]) };
      next.delete("all");
      if (next.has(value)) next.delete(value);
      else next.add(value);
      if (next.size === 0) next.add("all");
      return { ...prev, types: next };
    });
  };

  const toggleSet = <T,>(key: "ranges" | "speeds", value: T) => {
    setFilters((prev) => {
      const next = new Set(prev[key] as Set<T>);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return { ...prev, [key]: next };
    });
  };

  return (
    <div className="page-section-card p-5 lg:max-h-[80vh] lg:overflow-y-auto">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
        <h3 className="text-xs font-black tracking-wider text-brand-dark flex items-center gap-2">
          <SlidersIcon className="size-4 text-brand" /> BỘ LỌC TÌM KIẾM
        </h3>
      </div>

      <FilterGroup title="DÒNG XE MÁY">
        {TYPE_OPTIONS.map(({ value, label }) => (
          <FilterCheck
            key={value}
            id={`type-${value}`}
            label={label}
            checked={filters.types.has(value)}
            onChange={() => toggleType(value)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="TẦM GIÁ MONG MUỐN">
        <Slider
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={1_000_000}
          value={filters.priceRange}
          onValueChange={(v) =>
            setFilters((prev) => ({ ...prev, priceRange: v as [number, number] }))
          }
          className="mt-4"
        />
        <div className="mt-3 flex items-center justify-between gap-1 text-[10px] text-slate-500 font-extrabold">
          <span className="rounded border border-slate-200 bg-surface-muted px-2 py-1">
            {formatPrice(filters.priceRange[0])} đ
          </span>
          <span className="rounded border border-slate-200 bg-surface-muted px-2 py-1">
            {formatPrice(filters.priceRange[1])} đ
          </span>
        </div>
      </FilterGroup>

      <FilterGroup title="QUÃNG ĐƯỜNG / SẠC">
        {RANGE_OPTIONS.map(({ value, label }) => (
          <FilterCheck
            key={value}
            id={`range-${value}`}
            label={label}
            checked={filters.ranges.has(value)}
            onChange={() => toggleSet("ranges", value)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="TỐC ĐỘ TỐI ĐA">
        {SPEED_OPTIONS.map(({ value, label }) => (
          <FilterCheck
            key={value}
            id={`speed-${value}`}
            label={label}
            checked={filters.speeds.has(value)}
            onChange={() => toggleSet("speeds", value)}
          />
        ))}
      </FilterGroup>

      <button
        type="button"
        onClick={onClear}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-200 py-3 text-xs font-extrabold text-slate-500 transition-all hover:border-red-400 hover:text-red-500 hover:bg-red-50/50"
      >
        <RotateCcw size={14} />
        THIẾT LẬP LẠI
      </button>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-4 border-t border-slate-100 pt-4 first:mt-0 first:border-t-0 first:pt-0">
      <p className="mb-2.5 text-[10px] font-black tracking-wider text-slate-400 uppercase">
        {title}
      </p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function FilterCheck({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-center gap-2.5 text-slate-600 hover:text-slate-800 py-0.5 select-none font-semibold text-xs"
    >
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={onChange}
        className="size-4 border-slate-300 text-brand"
      />
      <span>{label}</span>
    </label>
  );
}

function CatalogPagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const btnBase =
    "inline-flex h-9 min-w-9 items-center justify-center rounded-md border text-xs font-semibold transition disabled:pointer-events-none disabled:opacity-40";
  const btnIdle =
    "border-slate-200 bg-white text-brand-dark shadow-sm hover:border-brand hover:text-brand";
  const btnActive = "border-brand bg-brand text-white shadow-sm";

  return (
    <nav aria-label="Phân trang" className="mt-8 flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className={`${btnBase} ${btnIdle} gap-1 px-3`}
      >
        <ChevronLeft size={14} />
        Trước
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onPageChange(p)}
          aria-current={p === page ? "page" : undefined}
          className={`${btnBase} px-3 ${p === page ? btnActive : btnIdle}`}
        >
          {p}
        </button>
      ))}

      <button
        type="button"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className={`${btnBase} ${btnIdle} gap-1 px-3`}
      >
        Sau
        <ChevronRight size={14} />
      </button>
    </nav>
  );
}
