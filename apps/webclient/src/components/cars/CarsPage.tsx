"use client";

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
  X,
  Check,
  Percent,
  Info,
} from "lucide-react";

import { CarCatalogCard } from "@/components/cars/CarCatalogCard";
import {
  CarsBreadcrumbBar,
  CarsCatalogListHeader,
  CarsEmptyState,
  CarsPromoBanners,
  CarsSearchBar,
  CarsSectionHeader,
  CarsWhyVinFastSection,
  EstimatorMotionShell,
  EstimatorTotalFooter,
} from "@/components/cars/CarsAnimatedSections";
import { FilterCheck, FilterGroup } from "@/components/catalog/FilterControls";
import { PageMarketingHero } from "@/components/shared/PageMarketingHero";
import { CatalogGrid, CatalogGridItem, FadeIn } from "@/components/motion";
import { SHOWROOM_BOOKING_LABEL } from "@/lib/dealership";
import FloatingButtons from "@/components/site/FloatingButtons";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CAR_HERO_BANNERS, type HeroBannerSlide } from "@/lib/images";
import {
  CARS_PER_PAGE,
  DRIVE_OPTIONS,
  formatPrice,
  PRICE_MAX,
  PRICE_MIN,
  RANGE_OPTIONS,
  SEGMENT_OPTIONS,
  SEAT_OPTIONS,
  type CarModel,
  type CarSegment,
  type DriveType,
  type RangeBucket,
} from "@/lib/cars";
import { HOTLINE, HOTLINE_TEL } from "@/lib/contact";
import { carsBookingStep, carsEstimatorPanel } from "@/lib/cars-motion";
import { useModalMotion } from "@/hooks/use-modal-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const HERO_FEATURES = [
  { icon: Shield, text: "Bảo hành chính hãng", sub: "Lên tới 10 năm hoặc 200.000km" },
  { icon: MapPin, text: "Dịch vụ toàn diện", sub: "Xưởng dịch vụ & cứu hộ 24/7" },
  { icon: Wallet, text: "Hỗ trợ tài chính", sub: "Vay 80%, trả góp lãi suất thấp" },
] as const;

const WHY_VINFAST = [
  {
    icon: Cpu,
    title: "Công nghệ thông minh",
    desc: "Hệ thống hỗ trợ lái nâng cao ADAS, Trợ lý ảo tiếng Việt thông minh, điều khiển bằng giọng nói đa vùng miền.",
  },
  {
    icon: Zap,
    title: "Hiệu suất mạnh mẽ",
    desc: "Động cơ điện vượt trội, mô-men xoắn tức thời mang lại trải nghiệm tăng tốc thể thao, êm ái tuyệt đối.",
  },
  {
    icon: ShieldCheck,
    title: "An toàn vượt trội",
    desc: "Đạt tiêu chuẩn an toàn cao nhất của ASEAN NCAP, EURO NCAP với hệ thống khung gầm cứng vững và 11 túi khí.",
  },
  {
    icon: Leaf,
    title: "Thân thiện môi trường",
    desc: "0% khí thải, không tiếng ồn. Tiên phong xây dựng hệ sinh thái giao thông xanh bền vững tại Việt Nam.",
  },
] as const;

type SortKey = "newest" | "price-asc" | "price-desc" | "range-desc" | "power-desc";

type Filters = {
  segments: Set<CarSegment | "all">;
  priceRange: [number, number];
  seats: Set<number>;
  ranges: Set<RangeBucket>;
  drives: Set<DriveType>;
};

const defaultFilters = (): Filters => ({
  segments: new Set(["all"]),
  priceRange: [PRICE_MIN, PRICE_MAX],
  seats: new Set(),
  ranges: new Set(),
  drives: new Set(),
});

// Cities and Provinces for Rolling Cost Estimator
const PROVINCES = [
  { id: "hanoi", name: "Hà Nội (Phí biển 20tr)", plateFee: 20_000_000 },
  { id: "hcm", name: "TP. Hồ Chí Minh (Phí biển 20tr)", plateFee: 20_000_000 },
  { id: "other", name: "Tỉnh/Thành phố khác (Phí biển 1tr)", plateFee: 1_000_000 },
];

export default function CarsPage({
  cars: CARS,
  heroBanners: CAR_HERO_BANNERS,
  embedded = false,
  adminEdit = false,
}: {
  cars: CarModel[];
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
  const [bookingCar, setBookingCar] = useState<CarModel | null>(null);
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
  const [estimatorCarId, setEstimatorCarId] = useState<string>("vf3");
  const [estimatorLocation, setEstimatorLocation] = useState<string>("other");
  const [includeInsurance, setIncludeInsurance] = useState<boolean>(true);

  // Installment Calculator State
  const [downPaymentPct, setDownPaymentPct] = useState<number>(30);
  const [loanTermYears, setLoanTermYears] = useState<number>(5);
  const [interestRate, setInterestRate] = useState<number>(5.9);
  const [estimatorTab, setEstimatorTab] = useState<"rolling" | "installment">("rolling");

  // Filter cars based on sidebar filters + segment tab + search query
  const filteredCars = useMemo(() => {
    if (adminEdit) return CARS;

    const isDefaultPriceRange =
      filters.priceRange[0] === PRICE_MIN && filters.priceRange[1] === PRICE_MAX;

    let result = CARS.filter((car) => {
      // 1. Sidebar filters
      const segmentOk =
        filters.segments.has("all") ||
        filters.segments.size === 0 ||
        filters.segments.has(car.segment);
      const priceOk =
        isDefaultPriceRange ||
        (car.price >= filters.priceRange[0] && car.price <= filters.priceRange[1]);
      const seatsOk = filters.seats.size === 0 || filters.seats.has(car.seats);
      const rangeOk = filters.ranges.size === 0 || filters.ranges.has(car.rangeBucket);
      const driveOk = filters.drives.size === 0 || filters.drives.has(car.drive);

      // 2. Quick segment tab
      let tabOk = true;
      if (segmentTab === "urban") {
        tabOk = car.segment === "suv-nho" || car.id === "vf5";
      } else if (segmentTab === "family") {
        tabOk = car.segment === "suv-c" || car.segment === "suv-d" || car.segment === "mpv";
      } else if (segmentTab === "luxury") {
        tabOk = car.segment === "suv-e";
      }

      // 3. Search query
      const searchOk =
        searchQuery === "" ||
        car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.subtitle.toLowerCase().includes(searchQuery.toLowerCase());

      return segmentOk && priceOk && seatsOk && rangeOk && driveOk && tabOk && searchOk;
    });

    // Sorting
    if (sort === "price-asc") result = [...result].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") result = [...result].sort((a, b) => b.price - a.price);
    if (sort === "range-desc") result = [...result].sort((a, b) => b.range - a.range);
    if (sort === "power-desc") result = [...result].sort((a, b) => b.power - a.power);
    return result;
  }, [CARS, adminEdit, filters, sort, segmentTab, searchQuery]);

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
  const openBooking = (car: CarModel) => {
    setBookingCar(car);
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
    toast.success("Gửi yêu cầu thành công!");
  };

  const selectedEstimatorCar = useMemo(() => {
    return CARS.find((c) => c.id === estimatorCarId) || CARS[0];
  }, [estimatorCarId, CARS]);

  // Rolling Cost Calculation
  const rollingCostResult = useMemo(() => {
    const car = selectedEstimatorCar;
    const basePrice = car.price;

    // Taxes & Fees in Vietnam
    const registrationTax = 0; // 0% for Electric Vehicles
    const province = PROVINCES.find((p) => p.id === estimatorLocation) || PROVINCES[0];
    const plateFee = province.plateFee;
    const inspectionFee = 340_000;
    const roadMaintenanceFee = 1_560_000; // 1 year

    // Civil Liability Insurance based on Seats
    let civilInsurance = 480_700; // Default for <= 5 seats
    if (car.seats === 7) civilInsurance = 873_400;
    if (car.seats === 2) civilInsurance = 288_000;

    // Optional physical damage insurance (~1.1% of base price)
    const physicalInsurance = includeInsurance ? Math.round(basePrice * 0.011) : 0;

    const totalRolling =
      basePrice +
      registrationTax +
      plateFee +
      inspectionFee +
      roadMaintenanceFee +
      civilInsurance +
      physicalInsurance;

    return {
      basePrice,
      registrationTax,
      plateFee,
      inspectionFee,
      roadMaintenanceFee,
      civilInsurance,
      physicalInsurance,
      totalRolling,
    };
  }, [selectedEstimatorCar, estimatorLocation, includeInsurance]);

  // Installment Calculator Calculation
  const installmentResult = useMemo(() => {
    const totalCost = rollingCostResult.totalRolling;
    const loanAmount = Math.round((totalCost * downPaymentPct) / 100);
    const upfrontAmount = totalCost - loanAmount;

    const months = loanTermYears * 12;
    const monthlyRate = interestRate / 100 / 12;

    // Amortization (Principal + Interest on remaining balance) - first month
    const firstMonthPrincipal = Math.round(loanAmount / months);
    const firstMonthInterest = Math.round(loanAmount * monthlyRate);
    const firstMonthTotal = firstMonthPrincipal + firstMonthInterest;

    // Estimated average monthly payment
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
        .getElementById("car-catalog-grid")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 350);
    return () => window.clearTimeout(timer);
  }, [adminEdit, embedded]);

  return (
    <div className="relative min-h-screen overflow-x-clip bg-background font-sans text-foreground">
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
      <main>
        {!embedded && <CarsBreadcrumbBar />}

        {!embedded && !adminEdit ? (
          <HeroSection
            onExplore={() => {
              document.getElementById("car-catalog-grid")?.scrollIntoView({ behavior: "smooth" });
            }}
          />
        ) : null}

        {!adminEdit ? (
          <CarsSearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        ) : null}

        {/* Main Catalog Explorer Section */}
        <section className="section-y bg-white">
          <div className="container-vf">
            <button
              type="button"
              onClick={() => setMobileFilters(!mobileFilters)}
              className={`page-section-card mb-6 flex w-full items-center justify-between px-5 py-4 text-sm font-bold text-brand-dark hover:bg-surface-muted/50 lg:hidden ${adminEdit ? "hidden" : ""}`}
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
                  className={`${mobileFilters ? "block" : "hidden"} w-full max-h-[min(70vh,640px)] shrink-0 overflow-y-auto overscroll-contain lg:block lg:w-[260px] lg:max-h-none lg:overflow-visible lg:sticky lg:top-[140px] lg:z-10 lg:self-start`}
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
                <CarsCatalogListHeader count={filteredCars.length} sort={sort} setSort={setSort} />

                {filteredCars.length === 0 ? (
                  <CarsEmptyState onClear={clearFilters} />
                ) : (
                  <CatalogGrid
                    id="car-catalog-grid"
                    className="grid grid-cols-2 items-stretch gap-3 sm:gap-6 lg:grid-cols-3"
                  >
                    {filteredCars.map((car, index) => (
                      <CatalogGridItem key={car.id} index={index}>
                        <CarCatalogCard
                          car={car}
                          adminEdit={adminEdit}
                          onBookDrive={() => openBooking(car)}
                          onEstimatePrice={() => {
                            setEstimatorCarId(car.id);
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

        {/* Dynamic & Gorgeous Rolling Cost & Installment Loan Estimator */}
        {!adminEdit ? (
          <section
            id="estimator-tool"
            className="section-y relative border-b border-border/60 bg-background text-slate-800"
          >
            <div className="container-vf relative z-10">
              <CarsSectionHeader
                eyebrow="Công cụ mua xe"
                title="DỰ TOÁN CHI PHÍ & TRẢ GÓP"
                description="Tính toán chi phí lăn bánh chính xác tùy thuộc vào tỉnh thành và dự toán kế hoạch trả góp ngân hàng tối ưu nhất."
              />

              <EstimatorMotionShell>
                <div className="page-showcase-shell mx-auto grid max-w-5xl overflow-hidden rounded-[1.75rem] lg:grid-cols-12">
                  {/* Left Settings Panel */}
                  <div className="lg:col-span-5 p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-slate-200 bg-white">
                    <h3 className="text-sm font-black tracking-wide border-b border-slate-100 pb-4 text-brand-dark uppercase flex items-center gap-2">
                      <Calculator className="size-4 text-brand" /> Cấu hình dự toán
                    </h3>

                    {/* Select Car */}
                    <div className="mt-6">
                      <label className="block text-[10px] font-bold tracking-wider text-slate-500 uppercase mb-2">
                        Chọn mẫu xe VinFast
                      </label>
                      <Select value={estimatorCarId} onValueChange={(v) => setEstimatorCarId(v)}>
                        <SelectTrigger className="w-full bg-surface-muted border-slate-200 text-slate-800 font-bold h-11 text-xs focus:bg-white focus:ring-1 focus:ring-brand">
                          <SelectValue placeholder="Chọn xe" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-slate-200 text-slate-800">
                          {CARS.map((c) => (
                            <SelectItem
                              key={c.id}
                              value={c.id}
                              className="focus:bg-slate-100 font-medium"
                            >
                              {c.name} — {formatPrice(c.price)} VNĐ
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Tab switch inside estimator settings */}
                    <div className="grid grid-cols-2 mt-6 bg-surface-muted p-1 rounded-lg border border-slate-200">
                      <button
                        onClick={() => setEstimatorTab("rolling")}
                        className={`rounded-md py-2 text-xs font-bold transition-colors ${
                          estimatorTab === "rolling"
                            ? "bg-brand text-white"
                            : "text-slate-500 hover:text-brand-dark"
                        }`}
                      >
                        Giá Lăn Bánh
                      </button>
                      <button
                        onClick={() => setEstimatorTab("installment")}
                        className={`rounded-md py-2 text-xs font-bold transition-colors ${
                          estimatorTab === "installment"
                            ? "bg-brand text-white"
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
                            <SelectValue placeholder="Chọn Tỉnh/Thành" />
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
                      {estimatorTab === "rolling" ? (
                        <div className="pt-2">
                          <label className="flex items-center gap-3 cursor-pointer">
                            <Checkbox
                              id="insurance"
                              checked={includeInsurance}
                              onCheckedChange={(checked) => setIncludeInsurance(!!checked)}
                              className="border-slate-300 text-brand"
                            />
                            <span className="text-xs text-slate-600 font-semibold select-none">
                              Bao gồm Bảo hiểm vật chất xe (Tùy chọn ~1.1%)
                            </span>
                          </label>
                        </div>
                      ) : (
                        <div className="space-y-4 pt-2">
                          {/* Downpayment % slider */}
                          <div>
                            <div className="flex justify-between text-xs font-bold mb-2">
                              <span className="text-slate-500">Tỷ lệ vay mua xe</span>
                              <span className="text-brand">{downPaymentPct}% giá trị</span>
                            </div>
                            <Slider
                              min={10}
                              max={85}
                              step={5}
                              value={[downPaymentPct]}
                              onValueChange={(v) => setDownPaymentPct(v[0])}
                              className="py-1"
                            />
                            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                              <span>Vay tối thiểu 10%</span>
                              <span>Vay tối đa 85%</span>
                            </div>
                          </div>

                          {/* Loan term slider */}
                          <div>
                            <div className="flex justify-between text-xs font-bold mb-2">
                              <span className="text-slate-500">Thời hạn vay vốn</span>
                              <span className="text-brand">
                                {loanTermYears} năm ({loanTermYears * 12} tháng)
                              </span>
                            </div>
                            <Slider
                              min={1}
                              max={8}
                              step={1}
                              value={[loanTermYears]}
                              onValueChange={(v) => setLoanTermYears(v[0])}
                              className="py-1"
                            />
                            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                              <span>1 năm</span>
                              <span>8 năm</span>
                            </div>
                          </div>

                          {/* Interest Rate */}
                          <div>
                            <div className="flex justify-between text-xs font-bold mb-2">
                              <span className="text-slate-500">Lãi suất ưu đãi hàng năm</span>
                              <span className="text-brand">{interestRate}% / năm</span>
                            </div>
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                              {[5.9, 6.9, 7.9].map((rate) => (
                                <button
                                  key={rate}
                                  onClick={() => setInterestRate(rate)}
                                  className={`py-1 rounded text-xs font-bold border transition-all ${
                                    interestRate === rate
                                      ? "border-brand bg-brand/10 text-brand"
                                      : "border-slate-200 bg-surface-muted text-slate-500 hover:text-brand-dark hover:bg-slate-100"
                                  }`}
                                >
                                  {rate}% (Gói cố định)
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Results Panel */}
                  <div className="lg:col-span-7 flex flex-col justify-between bg-surface-muted p-6 md:p-8">
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
                              label="Giá niêm yết của xe"
                              value={`${formatPrice(selectedEstimatorCar.price)} đ`}
                            />
                            <EstimatorCostRow
                              label={
                                <span className="flex flex-wrap items-center gap-1.5">
                                  Lệ phí trước bạ
                                  <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[9px] font-extrabold uppercase text-emerald-600">
                                    Miễn phí 0%
                                  </span>
                                </span>
                              }
                              value="0 đ"
                              valueClassName="text-emerald-600"
                            />
                            <EstimatorCostRow
                              label="Phí đăng ký biển số xe điện"
                              value={`${formatPrice(rollingCostResult.plateFee)} đ`}
                            />
                            <EstimatorCostRow
                              label="Phí bảo trì đường bộ (12 tháng)"
                              value={`${formatPrice(rollingCostResult.roadMaintenanceFee)} đ`}
                            />
                            <EstimatorCostRow
                              label="Phí đăng kiểm xe mới"
                              value={`${formatPrice(rollingCostResult.inspectionFee)} đ`}
                            />
                            <EstimatorCostRow
                              label="Bảo hiểm TNDS bắt buộc"
                              value={`${formatPrice(rollingCostResult.civilInsurance)} đ`}
                            />
                            {includeInsurance && (
                              <EstimatorCostRow
                                label="Bảo hiểm vật chất thân vỏ (~1.1%)"
                                value={`${formatPrice(rollingCostResult.physicalInsurance)} đ`}
                              />
                            )}
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
                                Số tiền cần vay ({downPaymentPct}%)
                              </p>
                              <p className="mt-1 text-lg font-black tabular-nums text-brand">
                                {formatPrice(installmentResult.loanAmount)} đ
                              </p>
                            </div>
                            <div className="page-section-card p-4">
                              <p className="text-[10px] font-bold uppercase text-slate-500">
                                Số tiền trả trước ({100 - downPaymentPct}%)
                              </p>
                              <p className="mt-1 text-lg font-black tabular-nums text-slate-800">
                                {formatPrice(installmentResult.upfrontAmount)} đ
                              </p>
                            </div>
                          </div>

                          <EstimatorCostList>
                            <EstimatorCostRow
                              label="Tổng chi phí lăn bánh làm cơ sở"
                              value={`${formatPrice(rollingCostResult.totalRolling)} đ`}
                            />
                            <EstimatorCostRow
                              label="Thời hạn vay trả góp"
                              value={`${loanTermYears * 12} tháng`}
                            />
                            <EstimatorCostRow
                              label="Gốc thanh toán hàng tháng"
                              value={`${formatPrice(installmentResult.firstMonthPrincipal)} đ`}
                            />
                            <EstimatorCostRow
                              label="Lãi thanh toán tháng đầu"
                              value={`${formatPrice(installmentResult.firstMonthInterest)} đ`}
                            />
                          </EstimatorCostList>

                          <p className="mt-3 flex items-start gap-2 rounded-lg border border-brand/15 bg-brand/5 px-3 py-2.5 text-[10px] leading-relaxed text-slate-600">
                            <Info className="mt-0.5 size-3.5 shrink-0 text-brand" />
                            Dư nợ giảm dần — tiền lãi và gốc sẽ giảm qua các tháng tiếp theo.
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <EstimatorTotalFooter
                      estimatorTab={estimatorTab}
                      rollingTotal={rollingCostResult.totalRolling}
                      firstMonthTotal={installmentResult.firstMonthTotal}
                      avgMonthly={installmentResult.avgMonthlyPayment}
                      onBook={() => openBooking(selectedEstimatorCar)}
                    />
                  </div>
                </div>
              </EstimatorMotionShell>
            </div>
          </section>
        ) : null}

        {!adminEdit ? (
          <>
            <CarsPromoBanners />
            <CarsWhyVinFastSection items={WHY_VINFAST} />
          </>
        ) : null}
      </main>

      {!embedded && <FloatingButtons />}

      {/* RENDER MODAL: Comprehensive Booking Appointment Scheduler */}
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
                  <h3 className="text-base font-black">LIÊN HỆ & ĐẶT LỊCH HẸN SHOWROOM</h3>
                  <p className="text-xs text-brand-light opacity-85 mt-1">
                    Trải nghiệm dịch vụ chuyên nghiệp tại Showroom VinFast Ngọc Anh Cà Mau
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
                    1. CHỌN DÒNG XE
                  </span>
                  <ChevronRight className="size-3" />
                  <span
                    className={`${bookingStep === 2 ? "text-brand" : bookingStep > 2 ? "text-slate-700" : ""}`}
                  >
                    2. THÔNG TIN CÁ NHÂN
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
                        Vui lòng chọn dòng xe bạn đang quan tâm và dịch vụ yêu cầu:
                      </p>

                      {/* Car Selector visual list */}
                      <div className="grid grid-cols-2 gap-3 max-h-[180px] overflow-y-auto border border-slate-100 p-2 rounded-xl bg-surface-muted">
                        {CARS.map((car) => (
                          <button
                            key={car.id}
                            type="button"
                            onClick={() => setBookingCar(car)}
                            className={`flex items-center gap-3 p-2.5 rounded-lg border text-left transition-all ${
                              bookingCar?.id === car.id
                                ? "border-brand bg-brand/5 ring-1 ring-brand font-bold"
                                : "border-slate-200 bg-white hover:bg-surface-muted"
                            }`}
                          >
                            <img src={car.image} alt={car.name} className="size-8 object-contain" />
                            <span className="text-xs">{car.name}</span>
                          </button>
                        ))}
                      </div>

                      {/* Service Options */}
                      <div>
                        <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                          Bạn đang cần tư vấn dịch vụ gì?
                        </span>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                          {["Đăng ký lái thử", "Nhận báo giá", "Tư vấn trả góp"].map((svc) => (
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
                          disabled={!bookingCar}
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
                        Chúng tôi cần một số thông tin liên hệ để gửi lịch hẹn và tài liệu xe:
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
                        Đặt lịch hẹn mong muốn tại Showroom để được phục vụ tốt nhất:
                      </p>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">
                          Địa điểm làm việc
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
                            Ngày hẹn (Dự kiến) *
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
                          placeholder="Tôi muốn được lái thử phiên bản cao cấp Plus, tư vấn trả góp vay ngân hàng và cứu hộ 24/7..."
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
                          tưởng showroom VinFast Ngọc Anh Cà Mau. Tư vấn viên sẽ liên hệ lại với quý
                          khách trong vòng 15 phút qua{" "}
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
                          <span className="text-slate-800 font-bold">{bookingCar?.name}</span>
                        </div>
                        <div className="flex justify-between text-slate-500">
                          <span>Dịch vụ yêu cầu:</span>
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
                          Quay lại Trang sản phẩm
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
      banners={CAR_HERO_BANNERS}
      title="Tương lai di chuyển"
      titleAccent="thông minh, bền vững"
      description="Showroom VinFast Ngọc Anh Cà Mau mang đến các dòng SUV điện đột phá, công nghệ an toàn hàng đầu, bảo hành tới 10 năm và chính sách trả góp siêu ưu đãi."
      primaryCta={{ label: "KHÁM PHÁ CATALOG XE", onClick: onExplore }}
      secondaryCta={{ label: `HOTLINE: ${HOTLINE}`, href: HOTLINE_TEL }}
      highlights={[
        { value: "13+", label: "Dòng ô tô điện" },
        { value: "10 năm", label: "Bảo hành chính hãng" },
        { value: "ADAS", label: "Công nghệ tự lái" },
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
  const toggleSegment = (value: CarSegment | "all") => {
    setFilters((prev) => {
      const next = new Set(prev.segments);
      if (value === "all") return { ...prev, segments: new Set(["all"]) };
      next.delete("all");
      if (next.has(value)) next.delete(value);
      else next.add(value);
      if (next.size === 0) next.add("all");
      return { ...prev, segments: next };
    });
  };

  const toggleSet = <T,>(key: "seats" | "ranges" | "drives", value: T) => {
    setFilters((prev) => {
      const next = new Set(prev[key] as Set<T>);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return { ...prev, [key]: next };
    });
  };

  return (
    <div className="page-section-card max-h-[min(70vh,640px)] overflow-y-auto p-5 lg:max-h-[calc(100vh-10rem)] lg:overflow-y-auto">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
        <h3 className="text-xs font-black tracking-wider text-brand-dark flex items-center gap-2">
          <SlidersIcon className="size-4 text-brand" /> BỘ LỌC TÌM KIẾM
        </h3>
      </div>

      <FilterGroup title="DÒNG SẢN PHẨM">
        {SEGMENT_OPTIONS.map(({ value, label }) => (
          <FilterCheck
            key={value}
            id={`seg-${value}`}
            label={label}
            checked={filters.segments.has(value)}
            onChange={() => toggleSegment(value)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="TẦM GIÁ DỰ KIẾN">
        <Slider
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={20_000_000}
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

      <FilterGroup title="SỐ CHỖ NGỒI" defaultOpen={false}>
        {SEAT_OPTIONS.map((n) => (
          <FilterCheck
            key={n}
            id={`seat-${n}`}
            label={`${n} chỗ ngồi`}
            checked={filters.seats.has(n)}
            onChange={() => toggleSet("seats", n)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="QUÃNG ĐƯỜNG DI CHUYỂN" defaultOpen={false}>
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

      <FilterGroup title="HỆ THỐNG DẪN ĐỘNG" defaultOpen={false}>
        {DRIVE_OPTIONS.map(({ value, label }) => (
          <FilterCheck
            key={value}
            id={`drive-${value}`}
            label={label}
            checked={filters.drives.has(value)}
            onChange={() => toggleSet("drives", value)}
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
