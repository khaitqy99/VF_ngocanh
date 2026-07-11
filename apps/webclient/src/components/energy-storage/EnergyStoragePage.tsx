"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast, Toaster } from "sonner";

import { useModalMotion } from "@/hooks/use-modal-motion";
import {
  Battery,
  Zap,
  Sun,
  Shield,
  Leaf,
  Cpu,
  Check,
  ChevronRight,
  ChevronDown,
  Phone,
  Calendar,
  MapPin,
  Building2,
  Home,
  Factory,
  BarChart3,
  Recycle,
  Award,
  Users,
  Headphones,
  CheckCircle2,
  Sliders,
  Sparkles,
  Info,
  X,
  Mail,
  ZapOff,
} from "lucide-react";

import Header from "@/components/site/Header";
import FloatingButtons from "@/components/site/FloatingButtons";
import { PageEditorialHero } from "@/components/shared/PageEditorialHero";
import { PageCtaSection, pageCtaGhost, pageCtaPrimary } from "@/components/shared/PageCtaSection";
import { FaqBlock } from "@/components/shared/FaqBlock";
import { SectionHeader } from "@/components/shared/SectionHeader";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { IMAGES } from "@/lib/images";
import {
  ENERGY_STATS,
  ENERGY_SOLUTIONS,
  ENERGY_BENEFITS,
  ENERGY_APPLICATIONS,
  ENERGY_SPECS,
  INSTALLATION_STEPS,
  ENERGY_FAQS,
} from "@/lib/energy-storage";
import { HOTLINE, HOTLINE_TEL } from "@/lib/contact";
import type { EnergyPageContent } from "@/lib/cms/static-pages";
import { getDefaultStaticPageContent } from "@/lib/cms/static-pages";
import { useStaticPageAdminEdit } from "@/components/admin-edit/static-page/StaticPageAdminEditContext";
import { StaticEditableFaqBlock } from "@/components/admin-edit/static-page/StaticEditableFaqBlock";
import {
  StaticEditableText,
  StaticEditImageButton,
} from "@/components/admin-edit/static-page/StaticEditableText";

const SOLUTION_ICONS = {
  residential: Home,
  commercial: Building2,
  industrial: Factory,
} as const;

const BENEFIT_ICONS = [BarChart3, Leaf, Shield, Battery, Zap, Cpu] as const;

const APPLICATION_ICONS = [Sun, Zap, Battery, Shield] as const;

// Cost Calculator Constants
const ELECTRICAL_TIERS = [
  { name: "Khung giờ bình thường (AC)", rate: 1685 },
  { name: "Khung giờ thấp điểm (Đêm)", rate: 1044 },
  { name: "Khung giờ cao điểm (Peak)", rate: 3076 },
];

export default function EnergyStoragePage({
  content = getDefaultStaticPageContent("energy"),
}: {
  content?: EnergyPageContent;
}) {
  const modalMotion = useModalMotion();
  const [isConsultOpen, setIsConsultOpen] = useState(false);
  const [isConsultSuccess, setIsConsultSuccess] = useState(false);

  // Consulting Form State
  const [consultForm, setConsultForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    solutionType: "residential",
    monthlyBill: "under-5m",
    solarStatus: "none",
    note: "",
  });

  // Saving calculator state
  const [calcBill, setCalcBill] = useState(3000000); // VNĐ/tháng
  const [calcSolar, setCalcSolar] = useState(false); // Có điện mặt trời không
  const [calcCapacity, setCalcCapacity] = useState(10); // kWh pin lưu trữ chọn

  // Dynamic saving estimation calculation
  const calcResults = useMemo(() => {
    // Basic saving estimation model for LFP Energy Storage
    let monthlySavingPct = 0.25; // 25% average saving from Peak Shaving/shifting alone
    if (calcSolar) {
      monthlySavingPct += 0.35; // Solar + Battery saves up to 60% of bills
    }

    const monthlySaving = Math.round(calcBill * monthlySavingPct);
    const yearlySaving = monthlySaving * 12;
    const systemCost = calcCapacity * 12000000 + (calcSolar ? 15000000 : 5000000); // Rough estimated setup cost
    const paybackYears = parseFloat((systemCost / yearlySaving).toFixed(1));

    return {
      monthlySaving,
      yearlySaving,
      paybackYears: paybackYears > 15 ? 15 : paybackYears,
      reducedCo2: Math.round((yearlySaving / 3500) * 0.85), // kg CO2 reduced approx
    };
  }, [calcBill, calcSolar, calcCapacity]);

  const handleConsultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultForm.name || !consultForm.phone) {
      toast.error("Vui lòng điền Họ tên và Số điện thoại liên hệ");
      return;
    }
    setIsConsultSuccess(true);
    toast.success("Đăng ký tư vấn giải pháp lưu trữ năng lượng thành công!");
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground antialiased font-sans">
      <Toaster position="top-right" richColors />
      <Header />

      <main>
        {/* Navigation Breadcrumb */}
        <BreadcrumbBar />

        {/* Hero Section Banner with premium animations */}
        <HeroSection content={content} onScrollToBooking={() => setIsConsultOpen(true)} />

        {/* Dynamic Navigation Sticky Bar */}
        <section className="sticky top-14 z-20 border-b border-slate-100 bg-white py-4 shadow-sm">
          <div className="container-vf flex flex-col gap-4">
            <div className="text-xs font-black tracking-wider text-brand-dark uppercase">
              Hệ sinh thái lưu trữ năng lượng VinFast BESS
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
              <button
                onClick={() =>
                  document
                    .getElementById("saving-calculator")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-xs font-extrabold tracking-wider text-white shadow-md transition-all hover:bg-blue-600 sm:w-auto"
              >
                <Sliders className="size-4 animate-pulse text-accent-yellow" /> DỰ TOÁN TIẾT KIỆM
                ĐIỆN
              </button>
              <button
                onClick={() => setIsConsultOpen(true)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-dark px-5 py-2.5 text-xs font-extrabold tracking-wider text-white shadow-md transition-all hover:bg-brand sm:w-auto"
              >
                <Calendar className="size-4 text-brand" /> ĐĂNG KÝ KHẢO SÁT 3D
              </button>
            </div>
          </div>
        </section>

        {/* ESS Concept Intro */}
        <IntroSection />

        {/* Interactive Saving & Payback Estimator Calculator */}
        <section
          id="saving-calculator"
          className="section-y relative overflow-hidden border-b border-border/60 bg-background text-slate-800"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,87,255,0.06),transparent)] pointer-events-none" />

          <div className="container-vf relative z-10">
            <SectionHeader
              align="centered"
              eyebrow="Năng lượng tương lai"
              title="Dự toán hiệu quả đầu tư & tiết kiệm"
              description="Nhập số tiền điện tiêu thụ trung bình hàng tháng của bạn để tính toán ngay khả năng tiết kiệm chi phí, giảm phát thải carbon CO2 và thời gian hoàn vốn đầu tư hệ thống pin lưu trữ ESS."
            />

            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl max-w-5xl mx-auto grid lg:grid-cols-12">
              {/* Inputs Control Side */}
              <div className="lg:col-span-7 p-6 md:p-8 bg-white space-y-6">
                <h3 className="text-sm font-black border-b border-slate-100 pb-3 flex items-center gap-2 text-brand-dark uppercase">
                  <Sliders className="size-4 text-brand" /> Nhập thông số điện tiêu thụ
                </h3>

                {/* Bill slider input */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-slate-500 uppercase text-[10px]">
                      Tiền điện trung bình hàng tháng
                    </span>
                    <span className="text-brand text-xs font-black">
                      {new Intl.NumberFormat("vi-VN").format(calcBill)} VNĐ
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1000000}
                    max={20000000}
                    step={500000}
                    value={calcBill}
                    onChange={(e) => setCalcBill(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 font-semibold mt-1">
                    <span>1.000.000đ</span>
                    <span>10.000.000đ</span>
                    <span>20.000.000đ</span>
                  </div>
                </div>

                {/* Solar setup status toggler */}
                <div className="bg-surface-muted border border-slate-100 p-4 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-brand/10 text-brand rounded-lg">
                      <Sun className="size-5" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-brand-dark uppercase">
                        Kết hợp điện mặt trời mái nhà
                      </p>
                      <p className="text-[10px] text-slate-400 font-semibold">
                        Tận dụng lưu trữ năng lượng xanh miễn phí
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCalcSolar(!calcSolar)}
                    className={`w-14 h-7 rounded-full p-1 transition-all ${calcSolar ? "bg-brand" : "bg-slate-200"}`}
                  >
                    <div
                      className={`size-5 rounded-full bg-white transition-all shadow ${calcSolar ? "translate-x-7" : "translate-x-0"}`}
                    />
                  </button>
                </div>

                {/* Battery capacity selected */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">
                    Cấu hình pin lưu trữ ESS đề xuất
                  </label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {[5, 10, 15, 20].map((cap) => (
                      <button
                        key={cap}
                        type="button"
                        onClick={() => setCalcCapacity(cap)}
                        className={`py-3 px-2 rounded-xl text-center border text-xs font-black transition-all ${
                          calcCapacity === cap
                            ? "border-brand bg-brand/10 text-brand shadow-md"
                            : "border-slate-200 bg-surface-muted text-slate-500 hover:text-brand-dark hover:bg-slate-100"
                        }`}
                      >
                        {cap} kWh
                      </button>
                    ))}
                  </div>
                  <span className="block text-[10px] text-slate-400 mt-2 font-semibold">
                    * Dung lượng sạc/xả khả dụng thiết kế LFP hiệu năng tối đa 95%.
                  </span>
                </div>
              </div>

              {/* Estimate Saving Results Side */}
              <div className="lg:col-span-5 p-6 md:p-8 bg-surface-muted border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-black border-b border-slate-200 pb-3 text-brand-dark uppercase flex items-center gap-2">
                    <BarChart3 className="size-4 text-brand" /> Phân tích hiệu quả
                  </h3>

                  <div className="mt-8 space-y-5">
                    {/* Monthly Saving Block */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 relative group overflow-hidden shadow-sm">
                      <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">
                        Tiết kiệm dự kiến mỗi tháng
                      </p>
                      <p className="text-2xl md:text-3xl font-black text-brand mt-1.5">
                        {new Intl.NumberFormat("vi-VN").format(calcResults.monthlySaving)} VNĐ
                      </p>
                      <p className="text-[10px] text-slate-400 font-semibold mt-1">
                        Cắt giảm đến {calcSolar ? "60%" : "25%"} tiền điện giờ cao điểm tối đa
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {/* Yearly Savings Block */}
                      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <p className="text-[11px] text-slate-500 font-extrabold uppercase">
                          Tiết kiệm / năm
                        </p>
                        <p className="text-base font-black text-brand-dark mt-1">
                          {new Intl.NumberFormat("vi-VN").format(calcResults.yearlySaving)}đ
                        </p>
                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                          Giá trị kinh tế lũy kế
                        </p>
                      </div>

                      {/* Payback period Block */}
                      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <p className="text-[11px] text-slate-500 font-extrabold uppercase">
                          Thời gian hoàn vốn
                        </p>
                        <p className="text-base font-black text-brand mt-1">
                          ~ {calcResults.paybackYears} năm
                        </p>
                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                          Trục kỳ thu hồi đầu tư
                        </p>
                      </div>
                    </div>

                    {/* CO2 block */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                      <div>
                        <p className="text-[11px] text-slate-500 font-extrabold uppercase">
                          Giảm phát thải khí nhà kính
                        </p>
                        <p className="text-base font-black text-brand mt-1">
                          ~ {calcResults.reducedCo2} kg CO2 / năm
                        </p>
                      </div>
                      <div className="bg-brand/10 p-2 rounded-lg text-brand">
                        <Recycle className="size-5" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-200">
                  <div className="flex items-start gap-2 text-[10px] text-slate-500 font-semibold leading-relaxed">
                    <Info className="size-4 text-brand shrink-0" />
                    <span>
                      Lưu ý: Kết quả trên dựa trên mô hình thuật toán cạo đỉnh giờ cao điểm (Peak
                      Shaving) và tối ưu nguồn sạc giá điện bậc thang của điện lực EVN.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Solutions Grid Section */}
        <SolutionsSection content={content} />

        {/* Benefits Section */}
        <BenefitsSection content={content} />

        {/* Applications Section */}
        <ApplicationsSection content={content} />

        {/* Product Specs Detail Table */}
        <SpecsSection content={content} />

        {/* Installation 4-Steps Process */}
        <ProcessSection content={content} />

        {/* Why choose energy storage solution at VF Ngoc Anh */}
        <WhyChooseSection />

        {/* FAQ Area */}
        <FaqSection content={content} />

        {/* CTA Section map info */}
        <CtaBanner />
      </main>

      {/* Slide-out Panel Booking Consult Form */}
      <AnimatePresence>
        {isConsultOpen && (
          <motion.div
            {...modalMotion.overlay}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end"
          >
            <motion.div
              {...modalMotion.drawer}
              className="bg-white border-l border-slate-200 text-slate-800 w-full max-w-md h-full flex flex-col justify-between"
            >
              {/* Modal header */}
              <div className="bg-brand-dark p-5 border-b border-slate-200 flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-brand-light font-extrabold uppercase tracking-wider">
                    Đại lý ủy quyền 3S
                  </p>
                  <h3 className="text-base font-black uppercase text-white mt-0.5 flex items-center gap-2">
                    <Sparkles className="size-4 text-accent-yellow animate-pulse" /> Đăng ký khảo
                    sát 3D BESS
                  </h3>
                </div>
                <button
                  onClick={() => setIsConsultOpen(false)}
                  className="text-white/80 hover:text-white p-1 rounded-lg border border-white/20 bg-white/10"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-4">
                <AnimatePresence mode="wait">
                  {isConsultSuccess ? (
                    <motion.div {...modalMotion.step} className="text-center py-12 space-y-5">
                      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-brand/10 text-brand border border-brand/20">
                        <Check className="size-7" strokeWidth={3} />
                      </div>
                      <div>
                        <h4 className="text-lg font-black uppercase text-brand-dark">
                          Yêu cầu đã được tiếp nhận
                        </h4>
                        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                          Cảm ơn quý khách{" "}
                          <strong className="text-slate-700">{consultForm.name}</strong>. Đội ngũ kỹ
                          sư cơ điện của VinFast Ngọc Anh Cà Mau sẽ gọi điện xác nhận trong vòng 10
                          phút để lên phương án thiết kế hệ thống và cử người trực tiếp đến khảo sát
                          hạ tầng điện miễn phí tại nhà cho quý khách.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setIsConsultOpen(false);
                          setIsConsultSuccess(false);
                        }}
                        className="bg-brand hover:bg-blue-600 text-white font-bold text-xs tracking-wider py-2.5 px-6 rounded-lg transition-all"
                      >
                        ĐỒNG Ý & ĐÓNG
                      </button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleConsultSubmit} className="space-y-4">
                      {/* Short guide card */}
                      <div className="bg-surface-muted border border-slate-200 p-4 rounded-xl flex items-start gap-2.5">
                        <Info className="size-4.5 text-brand shrink-0 mt-0.5" />
                        <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                          Chương trình khảo sát 3D hoàn toàn miễn phí của VinFast Ngọc Anh Cà Mau
                          bao gồm đo đạc công suất sạc khả dụng, kiểm tra chất lượng cáp điện gia
                          đình và mô phỏng lắp đặt thẩm mỹ.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                            Họ tên của bạn *
                          </label>
                          <input
                            type="text"
                            required
                            value={consultForm.name}
                            onChange={(e) =>
                              setConsultForm({ ...consultForm, name: e.target.value })
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
                            value={consultForm.phone}
                            onChange={(e) =>
                              setConsultForm({ ...consultForm, phone: e.target.value })
                            }
                            placeholder="09xx xxx xxx"
                            className="w-full bg-surface-muted border border-slate-200 px-3 py-2 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand text-slate-800 focus:bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          Địa chỉ thi công lắp đặt *
                        </label>
                        <input
                          type="text"
                          required
                          value={consultForm.address}
                          onChange={(e) =>
                            setConsultForm({ ...consultForm, address: e.target.value })
                          }
                          placeholder="Địa chỉ số nhà, quận huyện, tỉnh thành..."
                          className="w-full bg-surface-muted border border-slate-200 px-3 py-2 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand text-slate-800 focus:bg-white"
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                            Phân khúc giải pháp
                          </label>
                          <select
                            value={consultForm.solutionType}
                            onChange={(e) =>
                              setConsultForm({ ...consultForm, solutionType: e.target.value })
                            }
                            className="w-full bg-surface-muted border border-slate-200 px-3 py-2.5 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand focus:bg-white"
                          >
                            <option value="residential">Hộ gia đình (5-20 kWh)</option>
                            <option value="commercial">Thương mại (50-500 kWh)</option>
                            <option value="industrial">Công nghiệp (&gt;500 kWh)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                            Tiền điện hàng tháng
                          </label>
                          <select
                            value={consultForm.monthlyBill}
                            onChange={(e) =>
                              setConsultForm({ ...consultForm, monthlyBill: e.target.value })
                            }
                            className="w-full bg-surface-muted border border-slate-200 px-3 py-2.5 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand focus:bg-white"
                          >
                            <option value="under-5m">Dưới 5 Triệu VNĐ</option>
                            <option value="5m-15m">Từ 5 - 15 Triệu VNĐ</option>
                            <option value="15m-30m">Từ 15 - 30 Triệu VNĐ</option>
                            <option value="above-30m">Trên 30 Triệu VNĐ</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          Tình trạng hệ thống điện mặt trời
                        </label>
                        <select
                          value={consultForm.solarStatus}
                          onChange={(e) =>
                            setConsultForm({ ...consultForm, solarStatus: e.target.value })
                          }
                          className="w-full bg-surface-muted border border-slate-200 px-3 py-2.5 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand focus:bg-white"
                        >
                          <option value="none">Chưa lắp đặt</option>
                          <option value="installed">Đã lắp đặt (Muốn đấu nối pin ESS)</option>
                          <option value="planning">Đang lên kế hoạch lắp đặt trọn gói</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          Mô tả hiện trạng hoặc yêu cầu thêm
                        </label>
                        <textarea
                          value={consultForm.note}
                          onChange={(e) => setConsultForm({ ...consultForm, note: e.target.value })}
                          placeholder="Mô tả cụ thể nhu cầu lưu trữ (ví dụ: Cần nguồn dự phòng cho thang máy khi mất điện, phục vụ sạc đồng thời 2 xe VF 8...)"
                          rows={2.5}
                          className="w-full bg-surface-muted border border-slate-200 px-3 py-2 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand text-slate-800 resize-none focus:bg-white"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-brand hover:bg-blue-600 text-white font-extrabold text-xs tracking-wider py-3.5 rounded-xl transition-all shadow-md mt-2 flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="size-4" /> ĐĂNG KÝ GỬI KHẢO SÁT 3D
                      </button>
                    </form>
                  )}
                </AnimatePresence>
              </div>

              {/* Modal footer */}
              <div className="bg-surface-muted p-4 border-t border-slate-200 text-center text-[10px] text-slate-500 font-semibold uppercase">
                Tổng đài chăm sóc năng lượng: {HOTLINE}
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
                Hệ thống lưu trữ năng lượng
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
  onScrollToBooking,
}: {
  content: EnergyPageContent;
  onScrollToBooking: () => void;
}) {
  const edit = useStaticPageAdminEdit();
  const hero = content.hero ?? getDefaultStaticPageContent("energy").hero;
  const stats = (content.stats ?? ENERGY_STATS.map(({ value, label }) => ({ value, label }))).map(
    (stat, index) => ({
      icon: Battery,
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
          className="text-white/60 text-xs"
          multiline
        />
      ),
    }),
  );

  return (
    <div className="relative">
      <StaticEditImageButton imagePath="hero.image" />
      <PageEditorialHero
        imageSrc={hero?.image ?? IMAGES.chargingStations}
        imageAlt="Hệ thống lưu trữ năng lượng VinFast"
        eyebrow={
          <StaticEditableText
            value={hero?.eyebrow ?? ""}
            onChange={(value) => edit?.updateField("hero.eyebrow", value)}
            className="text-white"
          />
        }
        title={
          <StaticEditableText
            value={hero?.title ?? ""}
            onChange={(value) => edit?.updateField("hero.title", value)}
            className="text-white"
          />
        }
        titleAccent=""
        description={
          <StaticEditableText
            value={hero?.subtitle ?? ""}
            onChange={(value) => edit?.updateField("hero.subtitle", value)}
            className="text-white/75"
            multiline
          />
        }
        actions={
          <>
            <button
              type="button"
              onClick={onScrollToBooking}
              className="home-cta-primary inline-flex items-center gap-1.5 rounded-full px-7 py-3.5 text-sm font-semibold text-white"
            >
              <Calendar className="size-4" /> ĐĂNG KÝ TƯ VẤN KHẢO SÁT
            </button>
            <a
              href={HOTLINE_TEL}
              className="home-cta-ghost inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md"
            >
              <Phone className="size-4 text-accent-yellow" /> HOTLINE: {HOTLINE}
            </a>
          </>
        }
        stats={stats}
      />
    </div>
  );
}

function IntroSection() {
  return (
    <section className="section-y bg-white">
      <div className="container-vf">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="relative overflow-hidden rounded-2xl shadow-card order-2 lg:order-1 aspect-[4/3] w-full border border-slate-200">
            <Image
              src={IMAGES.herioGreen}
              alt="Năng lượng xanh VinFast"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
          <div className="order-1 lg:order-2">
            <SectionHeader
              align="editorial"
              eyebrow="Công nghệ tiên phong"
              title="Lưu trữ năng lượng ESS là gì?"
              description="Hệ thống lưu trữ năng lượng ESS (Energy Storage System) là giải pháp tổ hợp pin công nghệ cao cho phép tích lũy điện năng thừa từ lưới điện vào giờ thấp điểm, hoặc từ nguồn điện tái tạo tự cung mặt trời để xả điện cấp nguồn khi có sự cố."
              className="mb-6 lg:mb-8"
            />
            <p className="text-sm leading-relaxed text-muted-foreground">
              VinFast tự hào đi đầu khi thương mại hóa các tháp pin LFP thông minh đạt chuẩn kháng
              bụi kháng nước, đồng bộ chuẩn 3D hóa dữ liệu đám mây giúp bạn quản lý tài sản điện
              năng an toàn tuyệt đối.
            </p>
            <ul className="mt-6 space-y-3 border-t border-slate-100 pt-5">
              {[
                "Cắt giảm tức thì hóa đơn tiền điện nhờ cơ chế sạc đêm xả ngày.",
                "Giải pháp dự phòng hoàn hảo khi lưới điện khu vực quá tải (mất điện).",
                "Tích hợp kết nối các bộ sạc ô tô điện treo tường công suất cao tại nhà.",
                "Quản lý số hóa dòng điện sạc, sức khỏe pin ESS qua App thông minh.",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-xs leading-relaxed text-slate-500 font-bold"
                >
                  <Check size={14} className="shrink-0 mt-0.5 text-brand" strokeWidth={3} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function SolutionsSection({ content }: { content: EnergyPageContent }) {
  const edit = useStaticPageAdminEdit();
  const solutions = content.solutions ?? ENERGY_SOLUTIONS;

  return (
    <section id="giai-phap" className="section-y bg-surface-muted border-y border-slate-200/60">
      <div className="container-vf">
        <SectionHeader
          align="centered"
          eyebrow="Phân khúc sản phẩm"
          title="Giải pháp lưu trữ theo quy mô"
          description="Từ tháp pin lưu trữ dân dụng tinh gọn cho biệt thự hộ gia đình, đến các container pin MWh phục vụ nhà máy và lưới điện khu công nghiệp."
        />

        <div className="grid gap-6 md:grid-cols-3">
          {solutions.map(({ id, title, subtitle, capacity, desc, features, idealFor }, index) => {
            const Icon = SOLUTION_ICONS[id as keyof typeof SOLUTION_ICONS];
            return (
              <div
                key={id}
                className="page-section-card flex flex-col p-7 transition-all duration-300 hover:shadow-card hover:-translate-y-1 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex size-12 items-center justify-center rounded-xl border border-brand/20 bg-brand/5 text-brand group-hover:bg-brand group-hover:text-white transition-all duration-300">
                    <Icon className="size-6" strokeWidth={1.5} />
                  </div>
                  <span className="rounded-lg border border-brand/20 bg-brand/5 px-3 py-1 text-[10px] font-black text-brand">
                    <StaticEditableText
                      value={capacity}
                      onChange={(value) => edit?.updateField(`solutions.${index}.capacity`, value)}
                    />
                  </span>
                </div>
                <p className="mt-5 text-[10px] font-black tracking-wider text-brand uppercase">
                  <StaticEditableText
                    value={subtitle}
                    onChange={(value) => edit?.updateField(`solutions.${index}.subtitle`, value)}
                  />
                </p>
                <h3 className="mt-1 text-sm font-black tracking-wide text-brand-dark uppercase">
                  <StaticEditableText
                    value={title}
                    onChange={(value) => edit?.updateField(`solutions.${index}.title`, value)}
                  />
                </h3>
                <p className="mt-3 text-xs leading-relaxed text-slate-400 font-semibold">
                  <StaticEditableText
                    value={desc}
                    onChange={(value) => edit?.updateField(`solutions.${index}.desc`, value)}
                    multiline
                  />
                </p>
                <ul className="mt-5 space-y-2 flex-1 border-t border-slate-100 pt-4">
                  {features.map((item, featureIndex) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-[11px] text-slate-600 font-bold"
                    >
                      <Check size={13} className="shrink-0 text-brand" strokeWidth={3} />
                      <StaticEditableText
                        value={item}
                        onChange={(value) =>
                          edit?.updateField(`solutions.${index}.features.${featureIndex}`, value)
                        }
                      />
                    </li>
                  ))}
                </ul>
                <div className="mt-5 rounded-xl bg-surface-muted border border-slate-100 px-4 py-3">
                  <p className="text-[10px] font-black text-brand-dark uppercase tracking-wide">
                    Đặc thù phù hợp:
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-400 font-bold">
                    <StaticEditableText
                      value={idealFor}
                      onChange={(value) => edit?.updateField(`solutions.${index}.idealFor`, value)}
                      multiline
                    />
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function BenefitsSection({ content }: { content: EnergyPageContent }) {
  const edit = useStaticPageAdminEdit();
  const benefits = content.benefits ?? ENERGY_BENEFITS;

  return (
    <section className="section-y bg-white">
      <div className="container-vf">
        <SectionHeader
          align="centered"
          eyebrow="Lý do đầu tư"
          title="Lợi ích kinh tế & vận hành vượt trội"
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map(({ title, desc }, index) => {
            const Icon = BENEFIT_ICONS[index] ?? BarChart3;
            return (
              <div
                key={title}
                className="flex gap-4 rounded-2xl border border-slate-200 bg-surface-muted p-6 shadow-soft hover:-translate-y-1 transition-all duration-300 hover:shadow-md"
              >
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <Icon className="size-5.5 text-brand" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-xs font-black text-brand-dark uppercase tracking-wider">
                    <StaticEditableText
                      value={title}
                      onChange={(value) => edit?.updateField(`benefits.${index}.title`, value)}
                    />
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-400 font-semibold">
                    <StaticEditableText
                      value={desc}
                      onChange={(value) => edit?.updateField(`benefits.${index}.desc`, value)}
                      multiline
                    />
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ApplicationsSection({ content }: { content: EnergyPageContent }) {
  const edit = useStaticPageAdminEdit();
  const applications = content.applications ?? ENERGY_APPLICATIONS;

  return (
    <section className="section-y bg-surface-muted border-y border-slate-200/60">
      <div className="container-vf">
        <SectionHeader
          align="centered"
          eyebrow="Kịch bản thực tế"
          title="Ứng dụng hệ thống pin ESS"
        />

        <div className="grid gap-6 md:grid-cols-2">
          {applications.map(({ title, desc, benefits }, index) => {
            const Icon = APPLICATION_ICONS[index] ?? Sun;
            return (
              <div
                key={title}
                className="page-section-card flex flex-col p-7 hover:shadow-card transition-all duration-300"
              >
                <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                    <Icon className="size-6 text-brand" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xs font-black text-brand-dark uppercase tracking-wider">
                    <StaticEditableText
                      value={title}
                      onChange={(value) => edit?.updateField(`applications.${index}.title`, value)}
                    />
                  </h3>
                </div>
                <p className="mt-4 text-xs leading-relaxed text-slate-400 font-semibold flex-1">
                  <StaticEditableText
                    value={desc}
                    onChange={(value) => edit?.updateField(`applications.${index}.desc`, value)}
                    multiline
                  />
                </p>
                <div className="mt-5 flex flex-wrap gap-2 pt-4 border-t border-slate-100">
                  {benefits.map((benefit, benefitIndex) => (
                    <span
                      key={benefit}
                      className="rounded-lg border border-brand/25 bg-brand/5 px-3 py-1 text-[10px] font-black text-brand uppercase tracking-wide"
                    >
                      <StaticEditableText
                        value={benefit}
                        onChange={(value) =>
                          edit?.updateField(`applications.${index}.benefits.${benefitIndex}`, value)
                        }
                      />
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function SpecsSection({ content }: { content: EnergyPageContent }) {
  const edit = useStaticPageAdminEdit();
  const specs = content.specs ?? ENERGY_SPECS;

  return (
    <section className="section-y bg-white">
      <div className="container-vf">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <SectionHeader
              align="editorial"
              eyebrow="Đặc tính thiết bị"
              title="Bảng thông số kỹ thuật lõi"
              description="Hệ thống ESS được chế tạo theo tiêu chuẩn nghiêm ngặt nhất của VinFast toàn cầu, sử dụng các cell pin chất lượng loại A, đạt các chứng chỉ an toàn chống bụi nước và chống ăn mòn hóa học cao."
              className="mb-6 lg:mb-8"
            />

            <div className="mt-8 page-section-card overflow-hidden">
              <table className="w-full text-left">
                <tbody>
                  {specs.map(({ label, value }, i) => (
                    <tr key={label} className={i % 2 === 0 ? "bg-white" : "bg-surface-muted/50"}>
                      <td className="px-5 py-3.5 text-xs font-black text-brand-dark w-[45%] uppercase tracking-wide">
                        <StaticEditableText
                          value={label}
                          onChange={(v) => edit?.updateField(`specs.${i}.label`, v)}
                        />
                      </td>
                      <td className="px-5 py-3.5 text-xs text-slate-500 font-semibold">
                        <StaticEditableText
                          value={value}
                          onChange={(v) => edit?.updateField(`specs.${i}.value`, v)}
                          multiline
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl shadow-card aspect-[4/3] border border-slate-200 group bg-slate-100">
            <Image
              src={IMAGES.community}
              alt="Hệ sinh thái năng lượng VinFast"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function ProcessSection({ content }: { content: EnergyPageContent }) {
  const edit = useStaticPageAdminEdit();
  const steps = content.steps ?? INSTALLATION_STEPS;

  return (
    <section className="section-y bg-surface-muted border-y border-slate-200/60 overflow-hidden">
      <div className="container-vf">
        <SectionHeader
          align="centered"
          eyebrow="Bàn giao chìa khóa trao tay"
          title="4 bước triển khai ESS chuyên nghiệp"
        />

        <div className="relative">
          <div className="absolute top-[22px] right-12 left-12 hidden h-[2px] bg-slate-200 lg:block" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(({ step, title, desc }, index) => (
              <div key={step} className="relative flex flex-col items-center text-center">
                <div className="relative z-10 mb-4 flex size-11 items-center justify-center rounded-full border-2 border-brand bg-white">
                  <span className="text-xs font-black text-brand">
                    <StaticEditableText
                      value={step}
                      onChange={(value) => edit?.updateField(`steps.${index}.step`, value)}
                    />
                  </span>
                </div>
                <div className="page-section-card w-full p-5 h-full transition-shadow duration-300 hover:shadow-md">
                  <h3 className="text-xs font-black text-brand-dark uppercase">
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyChooseSection() {
  const items = [
    {
      icon: Award,
      title: "Nhà phân phối ủy quyền chính thức 3S",
      desc: "VinFast Ngọc Anh Cà Mau cam kết phân phối 100% dòng pin lưu trữ ESS chính hãng, chế độ bảo hành chuẩn hãng lâu dài và giá thành minh bạch nhất.",
    },
    {
      icon: Users,
      title: "Đội ngũ kỹ sư cơ điện tay nghề cao",
      desc: "Sở hữu đội ngũ kỹ sư đạt đầy đủ chứng chỉ thi công điện mặt trời và pin ESS công nghiệp sấy hồng ngoại từ VinFast và đối tác ngoại.",
    },
    {
      icon: Cpu,
      title: "Giải pháp tích hợp độc quyền",
      desc: "Tự hào là đơn vị duy nhất đấu nối hoàn chỉnh tủ pin BESS đồng bộ vào bộ sạc treo tường xe điện và hệ mặt trời không phát sinh độ trễ.",
    },
    {
      icon: Headphones,
      title: "Hệ thống giám sát đám mây 24/7",
      desc: "Cố vấn kỹ thuật túc trực giám sát sức khỏe pin từ xa qua cổng IoT, nhanh chóng giải quyết sự cố mất điện lưới khẩn cấp.",
    },
  ] as const;

  return (
    <section className="section-y bg-white border-b border-slate-200">
      <div className="container-vf">
        <SectionHeader
          align="centered"
          eyebrow="Năng lực đại lý"
          title="Vì sao chọn dịch vụ tại VinFast Ngọc Anh Cà Mau?"
        />

        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <ul className="space-y-6 order-2 lg:order-1">
            {items.map(({ icon: Icon, title, desc }) => (
              <li
                key={title}
                className="flex gap-4 items-start bg-surface-muted border border-slate-200 p-5 rounded-2xl shadow-soft"
              >
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <Icon className="size-5.5 text-brand" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-xs font-black text-brand-dark uppercase tracking-wider">
                    {title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-400 font-semibold">
                    {desc}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <div className="relative flex items-center justify-center overflow-hidden rounded-2xl bg-white aspect-[4/3] w-full border border-slate-200 shadow-soft order-1 lg:order-2 group">
            <div className="absolute inset-0 bg-brand-dark/10 group-hover:bg-brand-dark/20 z-10 transition-colors pointer-events-none" />
            <Image
              src={IMAGES.showroom}
              alt="VinFast Ngọc Anh Cà Mau — Đại lý VinFast"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function FaqSection({ content }: { content: EnergyPageContent }) {
  const edit = useStaticPageAdminEdit();
  const faq = content.faq ?? ENERGY_FAQS.map(({ q, a }) => ({ q, a }));

  if (edit?.editMode) {
    return (
      <StaticEditableFaqBlock
        items={faq}
        eyebrow="Cố vấn giải đáp"
        title="Câu hỏi thường gặp"
        className="section-y border-b border-slate-200 bg-surface-muted"
      />
    );
  }

  return (
    <FaqBlock
      items={faq.map(({ q, a }) => ({ question: q, answer: a }))}
      eyebrow="Cố vấn giải đáp"
      title="Câu hỏi thường gặp"
      className="section-y border-b border-slate-200 bg-surface-muted"
    />
  );
}

function CtaBanner() {
  return (
    <PageCtaSection
      title="Sẵn sàng chuyển đổi năng lượng xanh?"
      description="Hãy liên hệ với đội ngũ kỹ sư cơ điện của đại lý VinFast Ngọc Anh Cà Mau ngay hôm nay để nhận báo giá ưu đãi độc quyền, hỗ trợ hồ sơ kết nối điện lực EVN và khảo sát hạ tầng hoàn toàn miễn phí."
    >
      <a href={HOTLINE_TEL} className={pageCtaPrimary}>
        <Phone className="size-4 text-accent-yellow" /> TƯ VẤN HOTLINE: {HOTLINE}
      </a>
      <Link href="/gioi-thieu" className={pageCtaGhost}>
        TÌM SHOWROOM TRỰC THUỘC
        <ChevronRight className="size-4 text-accent-yellow" />
      </Link>
    </PageCtaSection>
  );
}
