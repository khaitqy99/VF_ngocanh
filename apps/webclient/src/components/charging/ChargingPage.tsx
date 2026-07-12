"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast, Toaster } from "sonner";

import { useModalMotion } from "@/hooks/use-modal-motion";
import {
  Battery,
  BatteryCharging,
  ChevronRight,
  ChevronDown,
  Clock,
  MapPin,
  Shield,
  Zap,
  Gauge,
  Leaf,
  Headphones,
  Check,
  CheckCircle2,
  Phone,
  X,
  Award,
  Bike,
  Car,
  ShoppingCart,
  Info,
  Sliders,
  Calendar,
  Search,
} from "lucide-react";

import FloatingButtons from "@/components/site/FloatingButtons";
import { PageStatsBar } from "@/components/shared/PageStatsBar";
import { PageCtaSection, pageCtaGhost, pageCtaPrimary } from "@/components/shared/PageCtaSection";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { FaqBlock } from "@/components/shared/FaqBlock";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { CHARGING_HERO_BANNERS, type HeroBannerSlide } from "@/lib/images";
import { vfCard } from "@/lib/typography";
import {
  BATTERY_HIGHLIGHTS,
  CATEGORY_OPTIONS,
  CHARGING_FAQ,
  CHARGING_IMAGES,
  CHARGING_PRODUCTS,
  CHARGING_STEPS,
  NETWORK_STATS,
  STATION_TYPES,
  WHY_CHARGING,
  formatPrice,
  type ChargingProductCategory,
} from "@/lib/charging";
import { HOTLINE, HOTLINE_TEL } from "@/lib/contact";
import type { ChargingPageContent } from "@/lib/cms/static-pages";
import { getDefaultStaticPageContent } from "@/lib/cms/static-pages";
import { useStaticPageAdminEdit } from "@/components/admin-edit/static-page/StaticPageAdminEditContext";
import { StaticEditableFaqBlock } from "@/components/admin-edit/static-page/StaticEditableFaqBlock";
import {
  StaticEditableText,
  StaticEditImageButton,
} from "@/components/admin-edit/static-page/StaticEditableText";
import { StaticEditablePageMarketingHero } from "@/components/admin-edit/static-page/StaticEditablePageMarketingHero";
import { FadeIn, StaggerGrid, StaggerItem } from "@/components/motion";

const HERO_FEATURES = [
  { icon: MapPin, text: "150.000+ cổng sạc", sub: "Phủ sóng khắp 63 tỉnh thành" },
  { icon: Zap, text: "Sạc siêu nhanh DC", sub: "10% lên 70% trong 24 phút" },
  { icon: Shield, text: "Pin LFP thế hệ mới", sub: "Kháng nước IP68, bảo hành tới 8 năm" },
] as const;

// Cars dataset for charging calculator
const CALCULATOR_CARS = [
  { id: "vf3", name: "VinFast VF 3", capacity: 18.64, range: 215, maxDcPower: 30, onBoardAc: 3.3 },
  { id: "vf5", name: "VinFast VF 5", capacity: 37.23, range: 326, maxDcPower: 60, onBoardAc: 6.6 },
  { id: "vfe34", name: "VinFast VF e34", capacity: 42, range: 318, maxDcPower: 60, onBoardAc: 6.6 },
  { id: "vf6", name: "VinFast VF 6", capacity: 59.6, range: 399, maxDcPower: 90, onBoardAc: 11 },
  { id: "vf7", name: "VinFast VF 7", capacity: 75.3, range: 431, maxDcPower: 150, onBoardAc: 11 },
  { id: "vf8", name: "VinFast VF 8", capacity: 87.7, range: 471, maxDcPower: 150, onBoardAc: 11 },
  { id: "vf9", name: "VinFast VF 9", capacity: 123, range: 626, maxDcPower: 150, onBoardAc: 11 },
];

const CHARGERS = [
  {
    id: "ac-home",
    name: "Sạc AC Tại Nhà (7.4 kW)",
    power: 7.4,
    isDc: false,
    pricePerKwh: 2500,
    label: "Tự thanh toán tiền điện gia đình",
  },
  {
    id: "ac-public",
    name: "Sạc AC Công Cộng (11 kW)",
    power: 11,
    isDc: false,
    pricePerKwh: 3858,
    label: "Đơn giá trạm sạc công cộng",
  },
  {
    id: "dc-fast-30",
    name: "Sạc DC Nhanh (30 kW)",
    power: 30,
    isDc: true,
    pricePerKwh: 3858,
    label: "Trạm sạc nhanh công cộng",
  },
  {
    id: "dc-fast-60",
    name: "Sạc DC Nhanh (60 kW)",
    power: 60,
    isDc: true,
    pricePerKwh: 3858,
    label: "Trạm sạc nhanh công cộng",
  },
  {
    id: "dc-super-fast",
    name: "Sạc DC Siêu Nhanh (150-250 kW)",
    power: 150,
    isDc: true,
    pricePerKwh: 3858,
    label: "Trạm sạc siêu nhanh quốc lộ/đại lộ",
  },
];

export default function ChargingPage({
  heroBanners: CHARGING_HERO_BANNERS,
  content = getDefaultStaticPageContent("charging"),
}: {
  heroBanners: HeroBannerSlide[];
  content?: ChargingPageContent;
}) {
  const modalMotion = useModalMotion();
  const [category, setCategory] = useState<ChargingProductCategory | "all">("all");

  // Interactive Product Inquiry State
  const chargingProducts = content.products ?? CHARGING_PRODUCTS;

  const products = useMemo(() => {
    if (category === "all") return chargingProducts;
    return chargingProducts.filter((p) => p.category === category);
  }, [category, chargingProducts]);

  const [selectedProduct, setSelectedProduct] = useState<(typeof chargingProducts)[0] | null>(null);
  const [isInquirySuccess, setIsInquirySuccess] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    carModel: "vf3",
    receiveType: "showroom",
    note: "",
  });

  // Charging Simulator State
  const [simCarId, setSimCarId] = useState("vf5");
  const [simChargerId, setSimChargerId] = useState("ac-home");
  const [simCurrentPct, setSimCurrentPct] = useState(20);
  const [simTargetPct, setSimTargetPct] = useState(80);

  const activeCar = useMemo(() => {
    return CALCULATOR_CARS.find((c) => c.id === simCarId) || CALCULATOR_CARS[0];
  }, [simCarId]);

  const activeCharger = useMemo(() => {
    return CHARGERS.find((ch) => ch.id === simChargerId) || CHARGERS[0];
  }, [simChargerId]);

  // Charging Simulator Calculation
  const simResult = useMemo(() => {
    if (simCurrentPct >= simTargetPct) {
      return { timeStr: "0 phút", cost: 0, kwh: 0, rangeGained: 0 };
    }

    const totalKwhNeeded = (activeCar.capacity * (simTargetPct - simCurrentPct)) / 100;
    const rangeGained = Math.round((activeCar.range * (simTargetPct - simCurrentPct)) / 100);
    const cost = Math.round(totalKwhNeeded * activeCharger.pricePerKwh);

    let totalHours = 0;
    const chargingPower = activeCharger.isDc
      ? Math.min(activeCharger.power, activeCar.maxDcPower)
      : Math.min(activeCharger.power, activeCar.onBoardAc);

    if (activeCharger.isDc) {
      if (simCurrentPct < 80) {
        const targetPctPhase1 = Math.min(simTargetPct, 80);
        const kwhPhase1 = (activeCar.capacity * (targetPctPhase1 - simCurrentPct)) / 100;
        totalHours += kwhPhase1 / (chargingPower * 0.9); // 90% efficiency
      }
      if (simTargetPct > 80) {
        const startPctPhase2 = Math.max(simCurrentPct, 80);
        const kwhPhase2 = (activeCar.capacity * (simTargetPct - startPctPhase2)) / 100;
        const slowPower = Math.min(chargingPower, 15); // DC drops above 80%
        totalHours += kwhPhase2 / (slowPower * 0.85); // 85% efficiency
      }
    } else {
      totalHours = totalKwhNeeded / (chargingPower * 0.92); // AC has 92% efficiency
    }

    const totalMinutes = Math.round(totalHours * 60);
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    const timeStr = hours > 0 ? `${hours} giờ ${mins} phút` : `${mins} phút`;

    return {
      timeStr,
      cost,
      kwh: parseFloat(totalKwhNeeded.toFixed(2)),
      rangeGained,
    };
  }, [simCurrentPct, simTargetPct, activeCar, activeCharger]);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryForm.name || !inquiryForm.phone) {
      toast.error("Vui lòng nhập Họ tên và Số điện thoại liên hệ");
      return;
    }
    setIsInquirySuccess(true);
    toast.success("Gửi yêu cầu thành công! Cố vấn sẽ liên hệ lại ngay.");
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground antialiased font-sans">
      <Toaster position="top-right" richColors />
      <main>
        {/* Navigation bar */}
        <BreadcrumbBar />

        {/* Hero Section Banner */}
        <HeroSection
          content={content}
          heroBanners={CHARGING_HERO_BANNERS}
          onScrollToSection={(id) => {
            document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
          }}
        />

        {/* Stats Grid Bar */}
        <StatsBar
          stats={content.stats ?? NETWORK_STATS.map(({ value, label }) => ({ value, label }))}
        />

        {/* Interactive Charging Time & Cost Simulator */}
        <section
          id="charging-simulator"
          className="section-y relative overflow-hidden border-b border-border/60 bg-background text-slate-800"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,87,255,0.06),transparent)] pointer-events-none" />

          <div className="container-vf relative z-10">
            <SectionHeader
              align="centered"
              eyebrow="Phòng lab công nghệ"
              title="Bộ dự toán thời gian & chi phí sạc"
              description="Mô phỏng thực tế thời gian nạp pin và chi phí dự kiến cho từng dòng xe điện VinFast tương ứng với các loại bộ sạc gia đình hoặc trạm sạc công cộng hiện nay."
            />

            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl max-w-5xl mx-auto grid lg:grid-cols-12">
              {/* Configuration Panel Side */}
              <div className="lg:col-span-7 p-6 md:p-8 bg-white space-y-6">
                <h3 className="text-sm font-black border-b border-slate-100 pb-3 flex items-center gap-2 text-brand-dark uppercase">
                  <Sliders className="size-4 text-brand" /> Cài đặt thông số xe & sạc
                </h3>

                {/* Step 1: Select Car */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">
                    1. Chọn dòng xe của bạn
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {CALCULATOR_CARS.map((car) => (
                      <button
                        key={car.id}
                        type="button"
                        onClick={() => setSimCarId(car.id)}
                        className={`py-2.5 px-2 rounded-xl text-center border text-[11px] font-black transition-all ${
                          simCarId === car.id
                            ? "border-brand bg-brand/10 text-brand shadow-md"
                            : "border-slate-200 bg-surface-muted text-slate-500 hover:text-brand-dark hover:bg-slate-100"
                        }`}
                      >
                        {car.name.replace("VinFast ", "")}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 2: Select Charger Type */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">
                    2. Chọn chuẩn bộ sạc sử dụng
                  </label>
                  <div className="space-y-2">
                    {CHARGERS.map((ch) => (
                      <button
                        key={ch.id}
                        type="button"
                        onClick={() => setSimChargerId(ch.id)}
                        className={`w-full text-left p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                          simChargerId === ch.id
                            ? "border-brand bg-brand/10 text-brand"
                            : "border-slate-200 bg-surface-muted text-slate-500 hover:text-brand-dark hover:bg-slate-100"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg ${ch.isDc ? "bg-red-500/10 text-red-500" : "bg-emerald-500/10 text-emerald-500"}`}
                          >
                            <Zap className="size-4" />
                          </div>
                          <div>
                            <p className="text-xs font-black text-brand-dark">{ch.name}</p>
                            <p className="text-[10px] text-slate-400 font-semibold">{ch.label}</p>
                          </div>
                        </div>
                        <span className="text-xs font-black text-brand bg-brand/10 px-2.5 py-1 rounded-lg">
                          {ch.power} kW
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 3: Battery sliders */}
                <div className="space-y-4 pt-2">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-500 uppercase text-[10px]">
                        Dung lượng pin hiện tại
                      </span>
                      <span className="text-brand text-xs font-extrabold">{simCurrentPct}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={95}
                      step={5}
                      value={simCurrentPct}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setSimCurrentPct(val);
                        if (val >= simTargetPct) setSimTargetPct(Math.min(100, val + 5));
                      }}
                      className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-500 uppercase text-[10px]">
                        Mức pin sạc đích mong muốn
                      </span>
                      <span className="text-emerald-500 text-xs font-extrabold">
                        {simTargetPct}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={5}
                      max={100}
                      step={5}
                      value={simTargetPct}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setSimTargetPct(val);
                        if (val <= simCurrentPct) setSimCurrentPct(Math.max(0, val - 5));
                      }}
                      className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Simulation Result Presentation Side */}
              <div className="lg:col-span-5 p-6 md:p-8 bg-surface-muted border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-black border-b border-slate-200 pb-3 text-brand-dark uppercase flex items-center gap-2">
                    <Gauge className="size-4 text-brand" /> Kết quả dự toán
                  </h3>

                  <div className="mt-8 space-y-6">
                    {/* Time block */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 relative group overflow-hidden shadow-sm">
                      <div className="absolute right-0 top-0 translate-x-2 -translate-y-2 text-brand/5 group-hover:text-brand/10 transition-colors">
                        <Clock className="size-24" />
                      </div>
                      <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">
                        Thời gian sạc dự kiến
                      </p>
                      <p className="text-2xl md:text-3xl font-black text-brand-dark mt-1.5">
                        {simResult.timeStr}
                      </p>
                      <p className="text-[10px] text-slate-400 font-semibold mt-1">
                        Dự toán thực tế đã bù hao tổn sạc và đường cong dòng điện
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {/* Cost Block */}
                      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <p className="text-[11px] text-slate-500 font-extrabold uppercase">
                          Chi phí ước tính
                        </p>
                        <p className="text-base font-black text-emerald-500 mt-1">
                          {formatPrice(simResult.cost)}
                        </p>
                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                          Xấp xỉ {activeCharger.pricePerKwh}đ/kWh
                        </p>
                      </div>

                      {/* Energy Block */}
                      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <p className="text-[11px] text-slate-500 font-extrabold uppercase">
                          Điện năng nạp thêm
                        </p>
                        <p className="text-base font-black text-brand mt-1">{simResult.kwh} kWh</p>
                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                          Dung lượng thực nạp
                        </p>
                      </div>
                    </div>

                    {/* Range Gained Block */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                      <div>
                        <p className="text-[11px] text-slate-500 font-extrabold uppercase">
                          Quãng đường tăng thêm
                        </p>
                        <p className="text-lg font-black text-brand-dark mt-1">
                          ~ {simResult.rangeGained} km
                        </p>
                      </div>
                      <div className="bg-brand/10 p-2 rounded-lg text-brand">
                        <Gauge className="size-5" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-200">
                  <div className="flex items-start gap-2 text-[10px] text-slate-500 font-semibold leading-relaxed">
                    <Info className="size-4 text-brand shrink-0" />
                    <span>
                      Lưu ý: Thời gian sạc thực tế phụ thuộc lớn vào nhiệt độ bên ngoài, nhiệt độ
                      pin và công suất sạc khả dụng của trụ sạc tại hiện trường.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Comprehensive Ecosystem Intro */}
        <EcosystemSection />

        {/* Charging Stations specifications */}
        <StationTypesSection content={content} />

        {/* Battery technology and safety features */}
        <BatterySection />

        {/* Products Grid Section with dynamic categories filter */}
        <ProductsSection
          category={category}
          setCategory={setCategory}
          products={products}
          allProducts={chargingProducts}
          onOrderProduct={(product) => {
            setSelectedProduct(product);
            setInquiryForm({
              ...inquiryForm,
              note: `Tôi cần tư vấn đặt hàng thiết bị: ${product.name}`,
            });
            setIsInquirySuccess(false);
          }}
        />

        {/* 4 steps to charging at public station */}
        <GuideSection content={content} />

        {/* Application Integration Section */}
        <AppSection />

        {/* Why choose charging ecosystem of VinFast */}
        <WhySection content={content} />

        {/* FAQ Area with clean accordion details */}
        <FaqSection faq={content.faq ?? CHARGING_FAQ.map(({ q, a }) => ({ q, a }))} />

        {/* CTA and showroom contact info */}
        <CtaSection />
      </main>

      {/* Dynamic Product Order & Booking Consulting Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            {...modalMotion.overlay}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              {...modalMotion.panel}
              className="bg-white text-slate-800 rounded-3xl border border-slate-200 max-w-lg w-full overflow-hidden shadow-2xl"
            >
              {/* Modal Header */}
              <div className="bg-brand-dark p-5 border-b border-slate-200 flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-brand-light font-black uppercase tracking-wider">
                    Đăng ký tư vấn thiết bị sạc
                  </p>
                  <h3 className="text-sm font-black text-white uppercase mt-0.5">
                    {selectedProduct.name}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="text-white/80 hover:text-white p-1 rounded-lg border border-white/20 bg-white/10"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                <AnimatePresence mode="wait">
                  {isInquirySuccess ? (
                    <motion.div {...modalMotion.step} className="text-center py-8 space-y-4">
                      <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 border border-emerald-200">
                        <Check className="size-6" strokeWidth={3} />
                      </div>
                      <div>
                        <h4 className="text-base font-black uppercase text-brand-dark">
                          Gửi thông tin thành công
                        </h4>
                        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                          Cảm ơn quý khách{" "}
                          <strong className="text-slate-700">{inquiryForm.name}</strong>. Cố vấn
                          dịch vụ của VinFast Ngọc Anh Cà Mau sẽ sớm liên hệ tới số điện thoại{" "}
                          <strong className="text-slate-700">{inquiryForm.phone}</strong> để tiến
                          hành khảo sát đường điện và bàn giao thiết bị trong vòng 12-24 giờ.
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedProduct(null)}
                        className="bg-brand hover:bg-blue-600 text-white text-xs font-bold py-2.5 px-6 rounded-lg transition-all"
                      >
                        ĐÓNG CỬA SỔ
                      </button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleInquirySubmit} className="space-y-4">
                      {/* Product Overview Summary */}
                      <div className="flex items-center gap-3 bg-surface-muted border border-slate-200 rounded-xl p-3.5">
                        <div className="relative size-14 bg-white rounded-lg overflow-hidden shrink-0 border border-slate-200">
                          <Image
                            src={selectedProduct.image}
                            alt={selectedProduct.name}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-800">
                            {selectedProduct.name}
                          </p>
                          <p className="text-xs font-black text-brand mt-0.5">
                            {formatPrice(selectedProduct.price)}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                            Họ tên của bạn *
                          </label>
                          <input
                            type="text"
                            required
                            value={inquiryForm.name}
                            onChange={(e) =>
                              setInquiryForm({ ...inquiryForm, name: e.target.value })
                            }
                            placeholder="Nguyễn Văn A"
                            className="w-full bg-surface-muted border border-slate-200 px-3 py-2 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand text-slate-800 focus:bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                            Số điện thoại *
                          </label>
                          <input
                            type="tel"
                            required
                            value={inquiryForm.phone}
                            onChange={(e) =>
                              setInquiryForm({ ...inquiryForm, phone: e.target.value })
                            }
                            placeholder="09xx xxx xxx"
                            className="w-full bg-surface-muted border border-slate-200 px-3 py-2 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand text-slate-800 focus:bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          Địa chỉ nhận hàng / Khảo sát thi công
                        </label>
                        <input
                          type="text"
                          value={inquiryForm.address}
                          onChange={(e) =>
                            setInquiryForm({ ...inquiryForm, address: e.target.value })
                          }
                          placeholder="Nhập địa chỉ nhà riêng của bạn..."
                          className="w-full bg-surface-muted border border-slate-200 px-3 py-2 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand text-slate-800 focus:bg-white"
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                            Dòng xe điện sở hữu
                          </label>
                          <select
                            value={inquiryForm.carModel}
                            onChange={(e) =>
                              setInquiryForm({ ...inquiryForm, carModel: e.target.value })
                            }
                            className="w-full bg-surface-muted border border-slate-200 px-3 py-2.5 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand focus:bg-white"
                          >
                            <option value="vf3">VinFast VF 3</option>
                            <option value="vf5">VinFast VF 5</option>
                            <option value="vf6">VinFast VF 6</option>
                            <option value="vf7">VinFast VF 7</option>
                            <option value="vf8">VinFast VF 8</option>
                            <option value="vf9">VinFast VF 9</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                            Hình thức nhận hàng
                          </label>
                          <select
                            value={inquiryForm.receiveType}
                            onChange={(e) =>
                              setInquiryForm({ ...inquiryForm, receiveType: e.target.value })
                            }
                            className="w-full bg-surface-muted border border-slate-200 px-3 py-2.5 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand focus:bg-white"
                          >
                            <option value="showroom">Nhận tại showroom (Lắp đặt miễn phí)</option>
                            <option value="home">Giao hàng tận nhà (Tự lắp đặt)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          Yêu cầu khảo sát hoặc lưu ý thêm
                        </label>
                        <textarea
                          value={inquiryForm.note}
                          onChange={(e) => setInquiryForm({ ...inquiryForm, note: e.target.value })}
                          rows={2}
                          className="w-full bg-surface-muted border border-slate-200 px-3 py-2 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand text-slate-800 resize-none focus:bg-white"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-brand hover:bg-blue-600 text-white font-extrabold text-xs tracking-wider py-3 rounded-xl transition-all shadow-md mt-2 flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="size-4" /> GỬI YÊU CẦU ĐẶT HẸN TƯ VẤN
                      </button>
                    </form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <FloatingButtons />
    </div>
  );
}

function BreadcrumbBar() {
  return (
    <div className="border-b border-border/60 bg-background">
      <div className="container-vf py-3.5">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  href="/"
                  className="text-xs font-bold text-slate-500 hover:text-brand transition-colors"
                >
                  Trang chủ
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-xs font-extrabold text-brand-dark">
                Pin và trạm sạc chính hãng
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
}

function HeroSection({
  content,
  heroBanners,
  onScrollToSection,
}: {
  content: ChargingPageContent;
  heroBanners: HeroBannerSlide[];
  onScrollToSection: (id: string) => void;
}) {
  const defaultHero = getDefaultStaticPageContent("charging").hero!;

  return (
    <StaticEditablePageMarketingHero
      banners={heroBanners}
      hero={content.hero}
      defaultHero={defaultHero}
      features={[...HERO_FEATURES]}
      primaryCta={{
        label: "DỰ TOÁN THỜI GIAN SẠC",
        onClick: () => onScrollToSection("charging-simulator"),
      }}
      secondaryCta={{
        label: "XEM THIẾT BỊ SẠC GIA ĐÌNH",
        href: "#san-pham-sac",
      }}
      showControls={heroBanners.length > 1}
    />
  );
}

function StatsBar({ stats }: { stats: { value: string; label: string }[] }) {
  const edit = useStaticPageAdminEdit();
  const items = stats.map((stat, index) => ({
    value: (
      <StaticEditableText
        value={stat.value}
        onChange={(value) => edit?.updateField(`stats.${index}.value`, value)}
        className="text-white font-bold"
      />
    ),
    label: (
      <StaticEditableText
        value={stat.label}
        onChange={(value) => edit?.updateField(`stats.${index}.label`, value)}
        className="text-white/55 text-[11px]"
        multiline
      />
    ),
  }));

  return <PageStatsBar items={items} />;
}

function EcosystemSection() {
  const tiles = [
    {
      img: CHARGING_IMAGES.stations,
      title: "Hạng Mục Trạm Sạc Công Cộng Khổng Lồ",
      sub: "Hơn 2.500 trạm sạc phân bổ đều trên toàn bộ tuyến quốc lộ, cao tốc, bãi đỗ xe và các khu đô thị lớn.",
    },
    {
      img: CHARGING_IMAGES.scooter,
      title: "Hệ Sinh Thái Sạc Đa Dạng Thống Nhất",
      sub: "Bảo dưỡng đồng bộ, cắm sạc liền mạch cho mọi dòng ô tô điện VinFast lẫn các phương tiện xe máy điện thông minh.",
    },
  ] as const;

  return (
    <section className="section-y bg-white">
      <div className="container-vf">
        <SectionHeader
          align="centered"
          eyebrow="Hạ tầng năng lượng"
          title="Hệ sinh thái pin & sạc đồng bộ"
          description="Từ trạm sạc công cộng công suất cực lớn dọc dải đất hình chữ S, đến các bộ sạc treo tường tiện ích lắp đặt tại tư gia riêng của quý khách."
        />

        <StaggerGrid className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          {tiles.map((item, index) => (
            <StaggerItem key={item.title} index={index}>
              <div className="group relative overflow-hidden rounded-2xl shadow-soft border border-slate-200">
                <div className="relative aspect-[21/9] w-full bg-[#e8ecf2] sm:aspect-[2.2/1]">
                  <Image
                    src={item.img}
                    alt={item.title}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover object-center transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 text-white md:p-6">
                    <h3 className="text-sm md:text-base font-black uppercase text-white tracking-wide">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-[11px] md:text-xs text-slate-300 font-medium leading-relaxed max-w-lg">
                      {item.sub}
                    </p>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}

function StationTypesSection({ content }: { content: ChargingPageContent }) {
  const edit = useStaticPageAdminEdit();
  const stationTypes = content.stationTypes ?? STATION_TYPES;

  return (
    <section className="section-y bg-surface-muted border-y border-slate-200/60">
      <div className="container-vf">
        <SectionHeader
          align="centered"
          eyebrow="Phân loại thiết bị"
          title="Các loại trụ sạc tiêu chuẩn"
        />

        <StaggerGrid className="grid gap-6 md:grid-cols-3">
          {stationTypes.map((station, index) => (
            <StaggerItem key={station.id} index={index}>
              <article
                className={`flex h-full flex-col overflow-hidden ${vfCard} transition hover:-translate-y-1 hover:shadow-card group`}
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <StaticEditImageButton imagePath={`stationTypes.${index}.image`} />
                  <Image
                    src={station.image}
                    alt={station.title}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-sm font-black text-brand-dark uppercase tracking-wider">
                    <StaticEditableText
                      value={station.title}
                      onChange={(value) => edit?.updateField(`stationTypes.${index}.title`, value)}
                    />
                  </h3>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1 rounded-lg bg-brand/10 px-2.5 py-1 text-[10px] font-black text-brand">
                      <Gauge className="size-3 text-brand" />
                      <StaticEditableText
                        value={station.power}
                        onChange={(value) =>
                          edit?.updateField(`stationTypes.${index}.power`, value)
                        }
                      />
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-lg bg-brand-dark/10 px-2.5 py-1 text-[10px] font-black text-brand-dark">
                      <Clock className="size-3 text-brand" />
                      <StaticEditableText
                        value={station.time}
                        onChange={(value) => edit?.updateField(`stationTypes.${index}.time`, value)}
                      />
                    </span>
                  </div>
                  <p className="mt-3.5 flex-1 text-xs leading-relaxed text-slate-400 font-semibold">
                    <StaticEditableText
                      value={station.desc}
                      onChange={(value) => edit?.updateField(`stationTypes.${index}.desc`, value)}
                      multiline
                    />
                  </p>
                  <ul className="mt-4 space-y-1.5 border-t border-slate-100 pt-4">
                    {station.features.map((feature, featureIndex) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-[11px] text-slate-500 font-bold"
                      >
                        <ChevronRight className="mt-0.5 size-3.5 shrink-0 text-brand" />
                        <StaticEditableText
                          value={feature}
                          onChange={(value) =>
                            edit?.updateField(
                              `stationTypes.${index}.features.${featureIndex}`,
                              value,
                            )
                          }
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}

function BatterySection() {
  return (
    <section className="section-y bg-white">
      <div className="container-vf">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <FadeIn direction="left">
            <SectionHeader
              align="editorial"
              eyebrow="Công nghệ lõi"
              title="Pin LFP — an toàn tuyệt đối, bền bỉ đường dài"
              description="VinFast trang bị pin Lithium Iron Phosphate (LFP) thế hệ mới trên các phân khúc xe điện. Đây là công nghệ pin được đánh giá cao bậc nhất thế giới nhờ đặc tính hóa học cực kỳ ổn định nhiệt, loại bỏ triệt để rủi ro cháy nổ và chịu đựng tốt khí hậu nhiệt đới gió mùa tại Việt Nam."
              className="mb-6 lg:mb-8"
            />
            <StaggerGrid className="mt-6 grid gap-4 sm:grid-cols-2">
              {BATTERY_HIGHLIGHTS.map(({ title, desc }, index) => (
                <StaggerItem key={title} index={index}>
                  <div className="rounded-xl border border-slate-200 bg-surface-muted p-4 shadow-sm">
                    <div className="mb-2.5 flex size-8 items-center justify-center rounded-lg bg-brand/10">
                      <Battery className="size-4.5 text-brand" />
                    </div>
                    <h3 className="text-xs font-black text-brand-dark uppercase tracking-wider">
                      {title}
                    </h3>
                    <p className="mt-1 text-[11px] leading-relaxed text-slate-400 font-semibold">
                      {desc}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGrid>
          </FadeIn>
          <FadeIn
            direction="right"
            delay={0.1}
            className="relative overflow-hidden rounded-2xl shadow-card aspect-[4/3] border border-slate-200 group bg-slate-100"
          >
            <Image
              src={CHARGING_IMAGES.stations}
              alt="Công nghệ pin VinFast"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-dark/95 via-brand-dark/40 to-transparent p-6 text-white">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-brand rounded-xl">
                  <BatteryCharging className="size-6 text-accent-yellow animate-bounce" />
                </div>
                <div>
                  <p className="text-xs font-black text-white uppercase tracking-wider">
                    Chính sách bảo hành pin đỉnh cấp
                  </p>
                  <p className="text-sm font-black text-brand mt-0.5">
                    LÊN TỚI 8 - 10 NĂM KHÔNG GIỚI HẠN KM
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

function ProductsSection({
  category,
  setCategory,
  products,
  allProducts,
  onOrderProduct,
}: {
  category: ChargingProductCategory | "all";
  setCategory: (v: ChargingProductCategory | "all") => void;
  products: typeof CHARGING_PRODUCTS;
  allProducts: typeof CHARGING_PRODUCTS;
  onOrderProduct: (product: (typeof CHARGING_PRODUCTS)[0]) => void;
}) {
  const edit = useStaticPageAdminEdit();
  const tabs: { value: ChargingProductCategory | "all"; label: string }[] = [
    { value: "all", label: "Tất cả thiết bị" },
    ...CATEGORY_OPTIONS,
  ];

  return (
    <section id="san-pham-sac" className="section-y bg-surface-muted border-t border-slate-200/60">
      <div id="bo-sac-tieu-chuan" className="container-vf">
        <SectionHeader
          align="centered"
          eyebrow="Gian hàng công nghệ"
          title="Thiết bị sạc gia đình & phụ kiện"
          description="Danh mục các bộ sạc treo tường tại nhà công suất cao, bộ sạc di động và dây cáp sạc mở rộng chính hãng đang được ủy quyền phân phối & lắp đặt tại showroom VinFast Ngọc Anh Cà Mau."
        />

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {tabs.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setCategory(value)}
              className={`rounded-xl px-5 py-2 text-xs font-black tracking-wider uppercase transition-all duration-300 ${
                category === value
                  ? "bg-brand text-white shadow-md shadow-brand/20"
                  : "border border-slate-200 bg-white text-slate-500 hover:border-brand/40 hover:text-brand"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <StaggerGrid className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => {
            const productIndex = allProducts.findIndex((item) => item.id === product.id);
            return (
              <StaggerItem key={product.id} index={index}>
                <article className="page-section-card flex h-full flex-col overflow-hidden transition-all duration-300 hover:shadow-card hover:-translate-y-1 group">
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 border-b border-slate-100">
                    {productIndex >= 0 ? (
                      <StaticEditImageButton imagePath={`products.${productIndex}.image`} />
                    ) : null}
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {product.badge ? (
                      <span className="absolute left-3.5 top-3.5 rounded-lg bg-brand px-3 py-1 text-[10px] font-black uppercase text-white shadow-md">
                        {productIndex >= 0 ? (
                          <StaticEditableText
                            value={product.badge}
                            onChange={(value) =>
                              edit?.updateField(`products.${productIndex}.badge`, value)
                            }
                          />
                        ) : (
                          product.badge
                        )}
                      </span>
                    ) : null}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-sm font-black text-brand-dark uppercase tracking-wider">
                      {productIndex >= 0 ? (
                        <StaticEditableText
                          value={product.name}
                          onChange={(value) =>
                            edit?.updateField(`products.${productIndex}.name`, value)
                          }
                        />
                      ) : (
                        product.name
                      )}
                    </h3>
                    <p className="mt-2 flex-1 text-xs leading-relaxed text-slate-400 font-semibold line-clamp-3">
                      {productIndex >= 0 ? (
                        <StaticEditableText
                          value={product.description}
                          onChange={(value) =>
                            edit?.updateField(`products.${productIndex}.description`, value)
                          }
                          multiline
                        />
                      ) : (
                        product.description
                      )}
                    </p>
                    <ul className="mt-4 space-y-1.5 border-t border-slate-100 pt-4">
                      {product.specs.map((spec, specIndex) => (
                        <li
                          key={spec}
                          className="flex items-center gap-2 text-[11px] text-slate-500 font-bold"
                        >
                          <span className="size-1.5 shrink-0 rounded-full bg-brand" />
                          {productIndex >= 0 ? (
                            <StaticEditableText
                              value={spec}
                              onChange={(value) =>
                                edit?.updateField(
                                  `products.${productIndex}.specs.${specIndex}`,
                                  value,
                                )
                              }
                            />
                          ) : (
                            spec
                          )}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                      <p className="text-sm font-black text-brand uppercase">
                        {productIndex >= 0 ? (
                          <StaticEditableText
                            value={formatPrice(product.price)}
                            onChange={(value) => {
                              const digits = value.replace(/\D/g, "");
                              edit?.updateField(
                                `products.${productIndex}.price`,
                                digits ? Number(digits) : 0,
                              );
                            }}
                          />
                        ) : (
                          formatPrice(product.price)
                        )}
                      </p>
                      <button
                        type="button"
                        onClick={() => onOrderProduct(product)}
                        className="home-cta-primary rounded-full px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-white transition hover:bg-[#0046cc] shadow-md"
                      >
                        Tư vấn & đặt mua
                      </button>
                    </div>
                  </div>
                </article>
              </StaggerItem>
            );
          })}
        </StaggerGrid>
      </div>
    </section>
  );
}

function GuideSection({ content }: { content: ChargingPageContent }) {
  const edit = useStaticPageAdminEdit();
  const steps = content.steps ?? CHARGING_STEPS;

  return (
    <section className="section-y bg-white">
      <div className="container-vf">
        <SectionHeader
          align="centered"
          eyebrow="Cẩm nang vận hành"
          title="Hướng dẫn sạc xe trạm công cộng"
          description="Quy trình 4 bước đơn giản, thuận tiện bậc nhất thế giới để sạc nhanh ô tô/xe máy điện VinFast tại bất kỳ trạm sạc nào trên lãnh thổ Việt Nam."
        />

        <StaggerGrid className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ step, title, desc }, index) => (
            <StaggerItem key={step} index={index}>
              <div className="relative rounded-2xl border border-slate-200 bg-surface-muted p-6 shadow-soft transition-all duration-300 hover:shadow-md">
                <span className="text-3xl font-black text-brand/20 tracking-wider">
                  <StaticEditableText
                    value={step}
                    onChange={(value) => edit?.updateField(`steps.${index}.step`, value)}
                  />
                </span>
                <h3 className="mt-3 text-xs font-black text-brand-dark uppercase tracking-wider">
                  <StaticEditableText
                    value={title}
                    onChange={(value) => edit?.updateField(`steps.${index}.title`, value)}
                  />
                </h3>
                <p className="mt-2 text-[11px] leading-relaxed text-slate-400 font-semibold">
                  <StaticEditableText
                    value={desc}
                    onChange={(value) => edit?.updateField(`steps.${index}.desc`, value)}
                    multiline
                  />
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}

function AppSection() {
  return (
    <section className="section-y bg-white text-slate-800 relative overflow-hidden border-b border-slate-200">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,87,255,0.06),transparent)] pointer-events-none" />
      <div className="container-vf relative z-10">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <FadeIn direction="left">
            <SectionHeader
              align="editorial"
              eyebrow="App VinFast Club thông minh"
              title="Quản lý trạm sạc trực tuyến trên smartphone"
              description="Tìm kiếm trạm sạc gần nhất, đặt chỗ cổng sạc trước, theo dõi chi tiết % nạp pin theo thời gian thực và thanh toán hóa đơn điện tử tự động qua ví liên kết — tất cả tích hợp tinh gọn trong một ứng dụng duy nhất."
              className="mb-6 lg:mb-8"
            />
            <ul className="mt-6 space-y-3">
              {[
                "Bản đồ số hóa định vị trạm sạc realtime cực kỳ chính xác.",
                "Hỗ trợ đặt lịch sạc giữ chỗ trước 15 phút chống lãng phí thời gian.",
                "Nhận thông báo tự động đẩy về điện thoại khi xe đã sạc đầy.",
                "Thanh toán thông minh không tiền mặt qua ATM/Credit/MoMo/Ví điện tử.",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-xs text-slate-600 font-semibold leading-relaxed"
                >
                  <ChevronRight className="mt-0.5 size-4 shrink-0 text-brand" />
                  {item}
                </li>
              ))}
            </ul>
          </FadeIn>
          <FadeIn
            direction="right"
            delay={0.1}
            className="relative overflow-hidden rounded-2xl shadow-card aspect-[4/3] border border-slate-200 bg-surface-muted"
          >
            <Image
              src={CHARGING_IMAGES.promoApp}
              alt="App VinFast quản lý sạc"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

function WhySection({ content }: { content: ChargingPageContent }) {
  const edit = useStaticPageAdminEdit();
  const whyCharging = content.whyCharging ?? WHY_CHARGING;
  const icons = [MapPin, Zap, Leaf, Headphones] as const;

  return (
    <section className="section-y bg-surface-muted border-b border-slate-200/60">
      <div className="container-vf">
        <SectionHeader
          align="centered"
          eyebrow="Thế mạnh vượt trội"
          title="Ưu thế hệ sinh thái sạc VinFast"
        />

        <StaggerGrid className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {whyCharging.map(({ title, desc }, i) => {
            const Icon = icons[i] ?? Zap;
            return (
              <StaggerItem key={title} index={i}>
                <div className="page-section-card p-6 text-center hover:-translate-y-1 transition-all duration-300 hover:shadow-md">
                  <div className="mx-auto mb-3.5 flex size-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
                    <Icon className="size-5.5 text-brand" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xs font-black text-brand-dark uppercase tracking-wider">
                    <StaticEditableText
                      value={title}
                      onChange={(value) => edit?.updateField(`whyCharging.${i}.title`, value)}
                    />
                  </h3>
                  <p className="mt-2 text-[11px] leading-relaxed text-slate-400 font-semibold">
                    <StaticEditableText
                      value={desc}
                      onChange={(value) => edit?.updateField(`whyCharging.${i}.desc`, value)}
                      multiline
                    />
                  </p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerGrid>
      </div>
    </section>
  );
}

function FaqSection({ faq }: { faq: { q: string; a: string }[] }) {
  const edit = useStaticPageAdminEdit();

  if (edit?.editMode) {
    return (
      <StaticEditableFaqBlock
        items={faq}
        eyebrow="Cố vấn giải đáp"
        title="Câu hỏi thường gặp"
        className="section-y border-b border-border/60 bg-background"
      />
    );
  }

  return (
    <FaqBlock
      items={faq.map(({ q, a }) => ({ question: q, answer: a }))}
      eyebrow="Cố vấn giải đáp"
      title="Câu hỏi thường gặp"
      className="section-y border-b border-border/60 bg-background"
    />
  );
}

function CtaSection() {
  return (
    <PageCtaSection
      title="Cần tư vấn pin, trạm sạc hoặc lắp đặt tại nhà?"
      description="Showroom VinFast Ngọc Anh Cà Mau phân phối chính hãng bộ sạc tại nhà 7,4kW, hỗ trợ khảo sát đường điện và lắp đặt bàn giao tận tư gia của quý khách. Hãy liên hệ với chúng tôi để được đón tiếp tận tâm!"
    >
      <a href={HOTLINE_TEL} className={pageCtaPrimary}>
        <Phone className="size-4 text-accent-yellow" /> HOTLINE CỨU HỘ: {HOTLINE}
      </a>
      <Link href="/gioi-thieu" className={pageCtaGhost}>
        TÌM SHOWROOM VINFAST NGỌC ANH CÀ MAU
        <ChevronRight className="size-4 text-accent-yellow" />
      </Link>
    </PageCtaSection>
  );
}
