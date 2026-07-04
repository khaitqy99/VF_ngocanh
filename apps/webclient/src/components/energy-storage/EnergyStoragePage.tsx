"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast, Toaster } from "sonner";
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
import { vfCtaHeading, vfSectionHeading, vfSectionHeadingLeft } from "@/lib/typography";

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

export default function EnergyStoragePage() {
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
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased font-sans">
      <Toaster position="top-right" richColors />
      <Header />

      <main>
        {/* Navigation Breadcrumb */}
        <BreadcrumbBar />

        {/* Hero Section Banner with premium animations */}
        <HeroSection onScrollToBooking={() => setIsConsultOpen(true)} />

        {/* Dynamic Navigation Sticky Bar */}
        <section className="bg-white border-b border-slate-100 py-4 sticky top-14 z-20 shadow-sm">
          <div className="container-vf flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-xs font-black text-brand-dark uppercase tracking-wider">
              Hệ sinh thái lưu trữ năng lượng VinFast BESS
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  document
                    .getElementById("saving-calculator")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="bg-brand hover:bg-blue-600 text-white font-extrabold text-xs tracking-wider px-5 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2"
              >
                <Sliders className="size-4 text-accent-yellow animate-pulse" /> DỰ TOÁN TIẾT KIỆM
                ĐIỆN
              </button>
              <button
                onClick={() => setIsConsultOpen(true)}
                className="bg-brand-dark hover:bg-brand text-white font-extrabold text-xs tracking-wider px-5 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2"
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
          className="section-y relative overflow-hidden border-b border-slate-200 bg-white text-slate-800"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,87,255,0.06),transparent)] pointer-events-none" />

          <div className="container-vf relative z-10">
            <div className="max-w-2xl mx-auto text-center mb-12">
              <span className="bg-brand/10 text-brand px-4 py-1.5 rounded-full text-[10px] font-extrabold tracking-widest uppercase border border-brand/20">
                Năng lượng tương lai
              </span>
              <h2 className={`${vfSectionHeadingLeft} mt-4 uppercase`}>
                DỰ TOÁN HIỆU QUẢ ĐẦU TƯ & TIẾT KIỆM
              </h2>
              <p className="text-slate-500 text-xs md:text-sm mt-3 leading-relaxed">
                Nhập số tiền điện tiêu thụ trung bình hàng tháng của bạn để tính toán ngay khả năng
                tiết kiệm chi phí, giảm phát thải carbon CO2 và thời gian hoàn vốn đầu tư hệ thống
                pin lưu trữ ESS.
              </p>
            </div>

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
                  <div className="flex justify-between text-[9px] text-slate-400 font-semibold mt-1">
                    <span>1.000.000đ</span>
                    <span>10.000.000đ</span>
                    <span>20.000.000đ</span>
                  </div>
                </div>

                {/* Solar setup status toggler */}
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-center justify-between">
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
                  <div className="grid grid-cols-4 gap-2">
                    {[5, 10, 15, 20].map((cap) => (
                      <button
                        key={cap}
                        type="button"
                        onClick={() => setCalcCapacity(cap)}
                        className={`py-3 px-2 rounded-xl text-center border text-xs font-black transition-all ${
                          calcCapacity === cap
                            ? "border-brand bg-brand/10 text-brand shadow-md"
                            : "border-slate-200 bg-slate-50 text-slate-500 hover:text-brand-dark hover:bg-slate-100"
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
              <div className="lg:col-span-5 p-6 md:p-8 bg-slate-50 border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col justify-between">
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

                    <div className="grid grid-cols-2 gap-3">
                      {/* Yearly Savings Block */}
                      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <p className="text-[9px] text-slate-500 font-extrabold uppercase">
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
                        <p className="text-[9px] text-slate-500 font-extrabold uppercase">
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
                        <p className="text-[9px] text-slate-500 font-extrabold uppercase">
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
        <SolutionsSection />

        {/* Benefits Section */}
        <BenefitsSection />

        {/* Applications Section */}
        <ApplicationsSection />

        {/* Product Specs Detail Table */}
        <SpecsSection />

        {/* Installation 4-Steps Process */}
        <ProcessSection />

        {/* Why choose energy storage solution at VF Ngoc Anh */}
        <WhyChooseSection />

        {/* FAQ Area */}
        <FaqSection />

        {/* CTA Section map info */}
        <CtaBanner />
      </main>

      {/* Slide-out Panel Booking Consult Form */}
      <AnimatePresence>
        {isConsultOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end"
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 200 }}
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
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-center py-12 space-y-5"
                    >
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
                          sư cơ điện của VF Ngọc Anh sẽ gọi điện xác nhận trong vòng 10 phút để lên
                          phương án thiết kế hệ thống và cử người trực tiếp đến khảo sát hạ tầng
                          điện miễn phí tại nhà cho quý khách.
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
                      <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-start gap-2.5">
                        <Info className="size-4.5 text-brand shrink-0 mt-0.5" />
                        <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                          Chương trình khảo sát 3D hoàn toàn miễn phí của VF Ngọc Anh bao gồm đo đạc
                          công suất sạc khả dụng, kiểm tra chất lượng cáp điện gia đình và mô phỏng
                          lắp đặt thẩm mỹ.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
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
                            className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand text-slate-800 focus:bg-white"
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
                            className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand text-slate-800 focus:bg-white"
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
                          className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand text-slate-800 focus:bg-white"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                            Phân khúc giải pháp
                          </label>
                          <select
                            value={consultForm.solutionType}
                            onChange={(e) =>
                              setConsultForm({ ...consultForm, solutionType: e.target.value })
                            }
                            className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand focus:bg-white"
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
                            className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand focus:bg-white"
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
                          className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand focus:bg-white"
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
                          className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand text-slate-800 resize-none focus:bg-white"
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
              <div className="bg-slate-50 p-4 border-t border-slate-200 text-center text-[10px] text-slate-500 font-semibold uppercase">
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
    <div className="border-b border-slate-200 bg-white">
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

function HeroSection({ onScrollToBooking }: { onScrollToBooking: () => void }) {
  return (
    <section className="page-hero relative flex items-center overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0">
        <img
          src={IMAGES.chargingStations}
          alt="Hệ thống lưu trữ năng lượng VinFast"
          className="h-full w-full object-cover opacity-80 filter blur-[1px]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/60 lg:bg-gradient-to-r lg:from-black/80 lg:via-black/40 lg:to-transparent" />
      </div>

      <div className="container-vf relative z-10">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center"
          >
            <div className="inline-flex items-center gap-2 bg-brand/10 border border-brand/20 text-brand px-3.5 py-1 rounded-full text-[10px] font-extrabold tracking-widest uppercase">
              <Sparkles className="size-3.5 text-accent-yellow animate-pulse" /> GIẢI PHÁP PIN LƯU
              TRỮ ESS QUY MÔ TOÀN CẦU
            </div>
            <h1 className="mt-4 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
              NĂNG LƯỢNG THÔNG MINH <br />
              <span className="bg-gradient-to-r from-brand via-teal-400 to-blue-400 bg-clip-text text-transparent italic">
                BÊN VỮNG TƯƠNG LAI
              </span>
            </h1>
            <p className="mt-4 text-xs md:text-sm leading-relaxed text-slate-300 font-medium">
              VinFast ESS áp dụng công nghệ pin Lithium Iron Phosphate (LFP) siêu an toàn chịu nhiệt
              — mở ra kỷ nguyên mới về tự chủ nguồn điện cho hộ gia đình và tối ưu hóa hệ thống lưới
              điện công nghiệp sấy hồng ngoại sạc xe điện.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={onScrollToBooking}
                className="bg-brand hover:bg-blue-600 text-white font-extrabold text-xs tracking-wider px-6 py-3.5 rounded-xl shadow-lg transition-all flex items-center gap-1.5"
              >
                <Calendar className="size-4" /> ĐĂNG KÝ TƯ VẤN KHẢO SÁT
              </button>
              <a
                href={HOTLINE_TEL}
                className="bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs tracking-wider px-6 py-3.5 rounded-xl transition-all flex items-center gap-2 border border-white/10"
              >
                <Phone className="size-4 text-accent-yellow" /> HOTLINE: {HOTLINE}
              </a>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-3 pt-6 border-t border-white/10">
              {ENERGY_STATS.map(({ value, label }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-brand/20 bg-brand/10 text-brand">
                    <Battery className="size-5 text-brand" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-base font-black text-white">{value}</p>
                    <p className="text-[10px] leading-snug text-slate-400 font-bold mt-0.5 uppercase tracking-wide">
                      {label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function IntroSection() {
  return (
    <section className="section-y bg-white">
      <div className="container-vf">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="overflow-hidden rounded-2xl shadow-card order-2 lg:order-1 aspect-[4/3] w-full border border-slate-200">
            <img
              src={IMAGES.herioGreen}
              alt="Năng lượng xanh VinFast"
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              loading="lazy"
            />
          </div>
          <div className="order-1 lg:order-2">
            <span className="text-brand font-extrabold text-xs tracking-widest uppercase">
              Công nghệ tiên phong
            </span>
            <h2 className={`${vfSectionHeadingLeft} mt-2 uppercase`}>
              LƯU TRỮ NĂNG LƯỢNG ESS LÀ GÌ?
            </h2>
            <div className="mt-3 h-1 w-16 bg-brand rounded" />
            <p className="mt-4 text-xs md:text-sm leading-relaxed text-slate-400 font-semibold">
              Hệ thống lưu trữ năng lượng ESS (Energy Storage System) là giải pháp tổ hợp pin công
              nghệ cao cho phép tích lũy điện năng thừa từ lưới điện vào giờ thấp điểm, hoặc từ
              nguồn điện tái tạo tự cung mặt trời để xả điện cấp nguồn khi có sự cố.
            </p>
            <p className="mt-4 text-xs md:text-sm leading-relaxed text-slate-400 font-semibold">
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

function SolutionsSection() {
  return (
    <section id="giai-phap" className="section-y bg-slate-50 border-y border-slate-200/60">
      <div className="container-vf">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <span className="text-brand font-extrabold text-xs tracking-widest uppercase">
            Phân khúc sản phẩm
          </span>
          <h2 className={vfSectionHeading + " mt-2"}>GIẢI PHÁP LƯU TRỮ THEO QUY MÔ</h2>
          <div className="h-1 w-16 bg-brand mx-auto mt-4 rounded" />
          <p className="mt-4 text-xs md:text-sm text-slate-400 font-semibold leading-relaxed">
            Từ tháp pin lưu trữ dân dụng tinh gọn cho biệt thự hộ gia đình, đến các container pin
            MWh phục vụ nhà máy và lưới điện khu công nghiệp.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {ENERGY_SOLUTIONS.map(({ id, title, subtitle, capacity, desc, features, idealFor }) => {
            const Icon = SOLUTION_ICONS[id as keyof typeof SOLUTION_ICONS];
            return (
              <div
                key={id}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-7 shadow-soft transition-all duration-300 hover:shadow-card hover:-translate-y-1 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex size-12 items-center justify-center rounded-xl border border-brand/20 bg-brand/5 text-brand group-hover:bg-brand group-hover:text-white transition-all duration-300">
                    <Icon className="size-6" strokeWidth={1.5} />
                  </div>
                  <span className="rounded-lg border border-brand/20 bg-brand/5 px-3 py-1 text-[10px] font-black text-brand">
                    {capacity}
                  </span>
                </div>
                <p className="mt-5 text-[10px] font-black tracking-wider text-brand uppercase">
                  {subtitle}
                </p>
                <h3 className="mt-1 text-sm font-black tracking-wide text-brand-dark uppercase">
                  {title}
                </h3>
                <p className="mt-3 text-xs leading-relaxed text-slate-400 font-semibold">{desc}</p>
                <ul className="mt-5 space-y-2 flex-1 border-t border-slate-100 pt-4">
                  {features.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-[11px] text-slate-600 font-bold"
                    >
                      <Check size={13} className="shrink-0 text-brand" strokeWidth={3} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 rounded-xl bg-slate-50 border border-slate-100 px-4 py-3">
                  <p className="text-[10px] font-black text-brand-dark uppercase tracking-wide">
                    Đặc thù phù hợp:
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-400 font-bold">{idealFor}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function BenefitsSection() {
  return (
    <section className="section-y bg-white">
      <div className="container-vf">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <span className="text-brand font-extrabold text-xs tracking-widest uppercase">
            Lý do đầu tư
          </span>
          <h2 className={vfSectionHeading + " mt-2"}>LỢI ÍCH KINH TẾ & VẬN HÀNH VƯỢT TRỘI</h2>
          <div className="h-1 w-16 bg-brand mx-auto mt-4 rounded" />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ENERGY_BENEFITS.map(({ title, desc }, index) => {
            const Icon = BENEFIT_ICONS[index];
            return (
              <div
                key={title}
                className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-soft hover:-translate-y-1 transition-all duration-300 hover:shadow-md"
              >
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <Icon className="size-5.5 text-brand" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-xs font-black text-brand-dark uppercase tracking-wider">
                    {title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-400 font-semibold">
                    {desc}
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

function ApplicationsSection() {
  return (
    <section className="section-y bg-slate-50 border-y border-slate-200/60">
      <div className="container-vf">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <span className="text-brand font-extrabold text-xs tracking-widest uppercase">
            Kịch bản thực tế
          </span>
          <h2 className={vfSectionHeading + " mt-2"}>ỨNG DỤNG HỆ THỐNG PIN ESS</h2>
          <div className="h-1 w-16 bg-brand mx-auto mt-4 rounded" />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {ENERGY_APPLICATIONS.map(({ title, desc, benefits }, index) => {
            const Icon = APPLICATION_ICONS[index];
            return (
              <div
                key={title}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-7 shadow-soft hover:shadow-card transition-all duration-300"
              >
                <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                    <Icon className="size-6 text-brand" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xs font-black text-brand-dark uppercase tracking-wider">
                    {title}
                  </h3>
                </div>
                <p className="mt-4 text-xs leading-relaxed text-slate-400 font-semibold flex-1">
                  {desc}
                </p>
                <div className="mt-5 flex flex-wrap gap-2 pt-4 border-t border-slate-100">
                  {benefits.map((b) => (
                    <span
                      key={b}
                      className="rounded-lg border border-brand/25 bg-brand/5 px-3 py-1 text-[10px] font-black text-brand uppercase tracking-wide"
                    >
                      {b}
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

function SpecsSection() {
  return (
    <section className="section-y bg-white">
      <div className="container-vf">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <span className="text-brand font-extrabold text-xs tracking-widest uppercase">
              Đặc tính thiết bị
            </span>
            <h2 className={`${vfSectionHeadingLeft} mt-2 uppercase`}>BẢNG THÔNG SỐ KỸ THUẬT LÕI</h2>
            <div className="mt-3 h-1 w-16 bg-brand rounded" />
            <p className="mt-4 text-xs md:text-sm leading-relaxed text-slate-400 font-semibold">
              Hệ thống ESS được chế tạo theo tiêu chuẩn nghiêm ngặt nhất của VinFast toàn cầu, sử
              dụng các cell pin chất lượng loại A, đạt các chứng chỉ an toàn chống bụi nước và chống
              ăn mòn hóa học cao.
            </p>

            <div className="mt-8 rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-soft">
              <table className="w-full text-left">
                <tbody>
                  {ENERGY_SPECS.map(({ label, value }, i) => (
                    <tr key={label} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                      <td className="px-5 py-3.5 text-xs font-black text-brand-dark w-[45%] uppercase tracking-wide">
                        {label}
                      </td>
                      <td className="px-5 py-3.5 text-xs text-slate-500 font-semibold">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl shadow-card aspect-[4/3] border border-slate-200 group bg-slate-100">
            <img
              src={IMAGES.community}
              alt="Hệ sinh thái năng lượng VinFast"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function ProcessSection() {
  return (
    <section className="section-y bg-slate-50 border-y border-slate-200/60 overflow-hidden">
      <div className="container-vf">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <span className="text-brand font-extrabold text-xs tracking-widest uppercase">
            Bàn giao chìa khóa trao tay
          </span>
          <h2 className={vfSectionHeading + " mt-2"}>4 BƯỚC TRIỂN KHAI ESS CHUYÊN NGHIỆP</h2>
          <div className="h-1 w-16 bg-brand mx-auto mt-4 rounded" />
        </div>

        <div className="relative">
          <div className="absolute top-[22px] right-12 left-12 hidden h-[2px] bg-slate-200 lg:block" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {INSTALLATION_STEPS.map(({ step, title, desc }) => (
              <div key={step} className="relative flex flex-col items-center text-center">
                <div className="relative z-10 mb-4 flex size-11 items-center justify-center rounded-full border-2 border-brand bg-white">
                  <span className="text-xs font-black text-brand">{step}</span>
                </div>
                <div className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-soft h-full transition-shadow duration-300 hover:shadow-md">
                  <h3 className="text-xs font-black text-brand-dark uppercase">{title}</h3>
                  <p className="mt-2 text-[11px] leading-relaxed text-slate-400 font-semibold mt-2">
                    {desc}
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
      desc: "VF Ngọc Anh cam kết phân phối 100% dòng pin lưu trữ ESS chính hãng, chế độ bảo hành chuẩn hãng lâu dài và giá thành minh bạch nhất.",
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
        <div className="max-w-2xl mx-auto text-center mb-12">
          <span className="text-brand font-extrabold text-xs tracking-widest uppercase">
            Năng lực đại lý
          </span>
          <h2 className={vfSectionHeading + " mt-2"}>VÌ SAO CHỌN DỊCH VỤ TẠI VF NGỌC ANH?</h2>
          <div className="h-1 w-16 bg-brand mx-auto mt-4 rounded" />
        </div>

        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <ul className="space-y-6 order-2 lg:order-1">
            {items.map(({ icon: Icon, title, desc }) => (
              <li
                key={title}
                className="flex gap-4 items-start bg-slate-50 border border-slate-200 p-5 rounded-2xl shadow-soft"
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
            <img
              src={IMAGES.showroom}
              alt="VF Ngọc Anh — Đại lý VinFast"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="section-y bg-slate-50 border-b border-slate-200">
      <div className="container-vf max-w-3xl">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <span className="text-brand font-extrabold text-xs tracking-widest uppercase">
            Cố vấn giải đáp
          </span>
          <h2 className={vfSectionHeading + " mt-2"}>CÂU HỎI THƯỜNG GẶP</h2>
          <div className="h-1 w-16 bg-brand mx-auto mt-4 rounded" />
        </div>

        <div className="space-y-3">
          {ENERGY_FAQS.map(({ q, a }, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={q}
                className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-soft transition-all duration-300"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-slate-50/60"
                  aria-expanded={isOpen}
                >
                  <span className="text-xs md:text-sm font-black text-brand-dark uppercase tracking-wide">
                    {q}
                  </span>
                  <ChevronDown
                    className={`size-4 shrink-0 text-brand transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isOpen && (
                  <div className="border-t border-slate-100 px-6 py-4 bg-slate-50/50">
                    <p className="text-xs leading-relaxed text-slate-500 font-semibold">{a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CtaBanner() {
  return (
    <section className="relative overflow-hidden bg-brand-dark section-y">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,87,255,0.15),transparent)] pointer-events-none" />
      <div className="container-vf relative z-10 text-center text-white">
        <h2 className={vfCtaHeading}>SẴN SÀNG CHUYỂN ĐỔI NĂNG LƯỢNG XANH?</h2>
        <p className="mt-4 max-w-xl text-xs md:text-sm leading-relaxed text-slate-300 font-medium mx-auto">
          Hãy liên hệ với đội ngũ kỹ sư cơ điện của đại lý VF Ngọc Anh ngay hôm nay để nhận báo giá
          ưu đãi độc quyền, hỗ trợ hồ sơ kết nối điện lực EVN và khảo sát hạ tầng hoàn toàn miễn
          phí.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href={HOTLINE_TEL}
            className="inline-flex items-center gap-2 rounded-xl bg-brand hover:bg-blue-600 px-6 py-3.5 text-xs font-black tracking-wider text-white shadow-md transition-all"
          >
            <Phone className="size-4 text-accent-yellow" /> TƯ VẤN HOTLINE: {HOTLINE}
          </a>
          <Link
            href="/gioi-thieu"
            className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 text-xs font-black tracking-wider text-white transition-all hover:bg-white/20"
          >
            TÌM SHOWROOM TRỰC THUỘC
            <ChevronRight className="size-4 text-brand" />
          </Link>
        </div>
      </div>
    </section>
  );
}
