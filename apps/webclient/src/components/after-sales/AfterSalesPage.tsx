"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast, Toaster } from "sonner";

import { useModalMotion } from "@/hooks/use-modal-motion";
import { formatLeadMessage, submitLead, SubmitLeadError } from "@/lib/submit-lead";
import {
  Wrench,
  Shield,
  Truck,
  Package,
  Stethoscope,
  Clock,
  Check,
  ChevronRight,
  ChevronDown,
  Phone,
  Calendar,
  MapPin,
  Users,
  Cpu,
  Award,
  Car,
  Bike,
  Battery,
  ShieldAlert,
  HelpCircle,
  FileText,
  User,
  CheckCircle2,
  Mail,
  SlidersHorizontal,
} from "lucide-react";

import FloatingButtons from "@/components/site/FloatingButtons";
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
import { AFTER_SALES_HERO_BANNERS, IMAGES, type HeroBannerSlide } from "@/lib/images";
import { HOTLINE, HOTLINE_TEL, SHOWROOM_EMAIL } from "@/lib/contact";
import type { AfterSalesPageContent } from "@/lib/cms/static-pages";
import { DEFAULT_AFTER_SALES_CONTENT } from "@/lib/cms/static-page-defaults";
import { useStaticPageAdminEdit } from "@/components/admin-edit/static-page/StaticPageAdminEditContext";
import { StaticEditableFaqBlock } from "@/components/admin-edit/static-page/StaticEditableFaqBlock";
import { StaticEditableText } from "@/components/admin-edit/static-page/StaticEditableText";
import { StaticEditablePageMarketingHero } from "@/components/admin-edit/static-page/StaticEditablePageMarketingHero";
import { FadeIn, StaggerGrid, StaggerItem } from "@/components/motion";

const SERVICE_ICONS = [Wrench, Stethoscope, Shield, Truck, Package, Cpu] as const;
const WARRANTY_ICONS = [Car, Bike, Battery] as const;

const HERO_FEATURES = [
  { icon: Wrench, text: "Bảo dưỡng định kỳ", sub: "Quy trình chuẩn hãng, kiểm tra pin LFP" },
  { icon: Stethoscope, text: "Sửa chữa chính hãng", sub: "Máy chẩn đoán điện tử thế hệ mới" },
  { icon: Shield, text: "Bảo hành xe mới", sub: "Ô tô lên tới 10 năm / 200.000 km" },
] as const;

const PROCESS_STEPS = [
  {
    step: "01",
    title: "Đặt lịch trực tuyến",
    desc: "Đặt hẹn nhanh chóng qua website hoặc Hotline, chủ động lựa chọn khung giờ và kỹ thuật viên đón tiếp.",
  },
  {
    step: "02",
    title: "Tiếp đón & Kiểm tra",
    desc: "Cố vấn dịch vụ tiếp đón, kiểm tra tình trạng xe tổng thể và ghi nhận chi tiết các yêu cầu của chủ xe.",
  },
  {
    step: "03",
    title: "Chẩn đoán & Báo giá",
    desc: "Sử dụng thiết bị chuyên dụng quét lỗi hộp đen OBD, lập bảng báo giá minh bạch gửi khách hàng phê duyệt.",
  },
  {
    step: "04",
    title: "Tiến hành sửa chữa",
    desc: "Kỹ thuật viên chuyên nghiệp thực hiện bảo dưỡng/sửa chữa bằng công nghệ chuẩn VinFast và linh kiện chính hãng.",
  },
  {
    step: "05",
    title: "Nghiệm thu & Bàn giao",
    desc: "Kiểm tra chất lượng kỹ thuật nghiêm ngặt cuối cùng, rửa xe làm sạch miễn phí và bàn giao sổ bảo hành.",
  },
] as const;

const MAINTENANCE_INTERVALS = [
  {
    type: "Dòng Ô tô điện VinFast",
    intervals: [
      { km: "12.000 km / 12 tháng", desc: "Bảo dưỡng cấp nhỏ" },
      { km: "24.000 km / 24 tháng", desc: "Bảo dưỡng cấp trung bình" },
      { km: "48.000 km / 48 tháng", desc: "Bảo dưỡng cấp lớn" },
    ],
  },
  {
    type: "Dòng Xe máy điện VinFast",
    intervals: [
      { km: "1.000 km / 3 tháng", desc: "Bảo dưỡng lần đầu" },
      { km: "5.000 km / 6 tháng", desc: "Bảo dưỡng định kỳ cấp 1" },
      { km: "10.000 km / 12 tháng", desc: "Bảo dưỡng định kỳ cấp 2" },
    ],
  },
] as const;

const WHY_CHOOSE = [
  {
    icon: Award,
    title: "Showroom & Xưởng dịch vụ 3S đạt chuẩn quốc tế",
    desc: "Xưởng dịch vụ 3S tại Cà Mau sở hữu đầy đủ trang thiết bị chuẩn kỹ thuật nghiêm ngặt nhất của VinFast toàn cầu.",
  },
  {
    icon: Users,
    title: "Đội ngũ kỹ thuật viên tay nghề cao",
    desc: "100% kỹ thuật viên được đào tạo chuyên sâu bởi các chuyên gia công nghệ nước ngoài và sở hữu chứng chỉ tay nghề bậc cao của hãng.",
  },
  {
    icon: Package,
    title: "Cam kết linh kiện chính hãng 100%",
    desc: "Tuyệt đối không sử dụng hàng giả, hàng nhái trôi nổi. Phụ tùng thay thế luôn có tem nhãn, mã vạch và được bảo hành chính thức.",
  },
  {
    icon: Shield,
    title: "Chi phí minh bạch, chế độ đãi ngộ vượt trội",
    desc: "Toàn bộ bảng giá tiền công và phụ tùng đều được hiển thị trực tiếp trên hệ thống màn hình tiếp đón, không phát sinh bất kỳ phụ phí ẩn nào.",
  },
] as const;

export default function AfterSalesPage({
  heroBanners: AFTER_SALES_HERO_BANNERS,
  content = DEFAULT_AFTER_SALES_CONTENT,
}: {
  heroBanners: HeroBannerSlide[];
  content?: AfterSalesPageContent;
}) {
  const modalMotion = useModalMotion();
  // Booking Service State
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    name: "",
    phone: "",
    licensePlate: "",
    vehicleModel: "vf3",
    serviceType: "Bảo dưỡng định kỳ",
    date: "",
    time: "08:30",
    note: "",
  });

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.name || !bookingForm.phone) {
      toast.error("Vui lòng điền Họ tên và Số điện thoại liên hệ");
      return;
    }

    setBookingSubmitting(true);
    try {
      await submitLead({
        fullName: bookingForm.name.trim(),
        phone: bookingForm.phone.trim(),
        type: "service",
        service: bookingForm.serviceType,
        vehicleInterest: bookingForm.vehicleModel,
        message: formatLeadMessage({
          "Dịch vụ": bookingForm.serviceType,
          "Biển số": bookingForm.licensePlate,
          Xe: bookingForm.vehicleModel,
          "Lịch hẹn": bookingForm.date ? `${bookingForm.time} ngày ${bookingForm.date}` : undefined,
          "Ghi chú": bookingForm.note,
        }),
      });
      setIsSubmitSuccess(true);
      toast.success("Đặt lịch bảo dưỡng thành công!");
    } catch (error) {
      toast.error(error instanceof SubmitLeadError ? error.message : "Gửi thất bại");
    } finally {
      setBookingSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground antialiased font-sans">
      <Toaster position="top-right" richColors />
      <main>
        {/* Path navigation */}
        <BreadcrumbBar />

        {/* Hero Section Banner */}
        <HeroSection
          content={content}
          heroBanners={AFTER_SALES_HERO_BANNERS}
          onScrollToBooking={() => {
            document.getElementById("service-booking-form")?.scrollIntoView({ behavior: "smooth" });
          }}
        />

        {/* 6 Core Services Grids */}
        <ServicesSection content={content} />

        {/* Detailed Warranty Grid with high-contrast badge */}
        <WarrantySection content={content} />

        {/* Progressive 5-Step Process Section */}
        <ProcessSection />

        {/* Maintenance Intervals Schedule Cards */}
        <MaintenanceSection />

        {/* Interactive Booking Appointment Form */}
        <section
          id="service-booking-form"
          className="section-y overflow-hidden relative border-y border-slate-200 bg-white text-slate-800"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,87,255,0.06),transparent)] pointer-events-none" />

          <div className="container-vf relative z-10">
            <SectionHeader
              align="centered"
              eyebrow="Dịch vụ thông minh"
              title="Đăng ký đặt lịch hẹn bảo dưỡng"
              description="Tiết kiệm 100% thời gian chờ đợi tại xưởng. Đăng ký trước lịch hẹn dịch vụ bảo dưỡng định kỳ, sửa chữa hệ thống pin hoặc cập nhật phần mềm xe để được cố vấn đón tiếp chu đáo nhất."
            />

            <FadeIn delay={0.12}>
              <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl max-w-4xl mx-auto grid md:grid-cols-12">
                {/* Form Guidance Side */}
                <div className="md:col-span-5 p-6 md:p-8 bg-surface-muted border-b md:border-b-0 md:border-r border-slate-200 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-black tracking-wide border-b border-slate-200 pb-4 text-brand-dark uppercase flex items-center gap-2">
                      <ShieldAlert className="size-4 text-brand" /> Cam kết dịch vụ 3S
                    </h3>
                    <ul className="mt-6 space-y-4 text-xs font-bold text-slate-600">
                      <li className="flex items-start gap-2.5">
                        <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                        Cố vấn tiếp đón ngay tại phòng chờ VIP khi đến đúng giờ hẹn.
                      </li>
                      <li className="flex items-start gap-2.5">
                        <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                        Rửa xe, hút bụi làm sạch nội thất hoàn toàn miễn phí trước khi giao trả.
                      </li>
                      <li className="flex items-start gap-2.5">
                        <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                        Sử dụng máy quét lỗi chuyên dụng kiểm tra hệ thống pin miễn phí.
                      </li>
                      <li className="flex items-start gap-2.5">
                        <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                        Lưu trữ thông tin lịch sử sửa chữa bảo trì điện tử suốt trọn đời xe.
                      </li>
                    </ul>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-200 text-xs text-slate-500 font-semibold space-y-2">
                    <p className="flex items-center gap-2">
                      <MapPin className="size-4 text-brand" /> Showroom VinFast Ngọc Anh Cà Mau
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock className="size-4 text-brand" /> Giờ làm việc: Sáng 8:00 - 12:00 |
                      Chiều 13:00 - 17:00
                    </p>
                  </div>
                </div>

                {/* Form Inputs Side */}
                <div className="md:col-span-7 p-6 md:p-8 bg-white">
                  <AnimatePresence mode="wait">
                    {isSubmitSuccess ? (
                      <motion.div {...modalMotion.step} className="py-10 text-center space-y-5">
                        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 border border-emerald-200">
                          <Check className="size-8" strokeWidth={2.5} />
                        </div>
                        <div>
                          <h4 className="text-lg font-black text-brand-dark uppercase">
                            Đặt lịch hẹn thành công!
                          </h4>
                          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                            Cảm ơn quý khách{" "}
                            <strong className="text-slate-700">{bookingForm.name}</strong> đã đăng
                            ký lịch hẹn dịch vụ tại VinFast Ngọc Anh Cà Mau. Cố vấn kỹ thuật của
                            chúng tôi sẽ gọi điện xác nhận chính xác ngày giờ hẹn và chuẩn bị linh
                            kiện thay thế phục vụ quý khách trong 10 phút.
                          </p>
                        </div>

                        <div className="border border-slate-200 rounded-xl p-4 bg-surface-muted text-left text-xs font-semibold space-y-2.5 max-w-sm mx-auto">
                          <div className="flex justify-between border-b border-slate-100 pb-2">
                            <span className="text-slate-400">Khách hàng:</span>
                            <span className="text-slate-800">
                              {bookingForm.name} - {bookingForm.phone}
                            </span>
                          </div>
                          <div className="flex justify-between border-b border-slate-100 pb-2">
                            <span className="text-slate-400">Biển số / Mẫu xe:</span>
                            <span className="text-slate-800 uppercase">
                              {bookingForm.licensePlate
                                ? `${bookingForm.licensePlate} (${bookingForm.vehicleModel})`
                                : `${bookingForm.vehicleModel}`}
                            </span>
                          </div>
                          <div className="flex justify-between border-b border-slate-100 pb-2">
                            <span className="text-slate-400">Loại dịch vụ:</span>
                            <span className="text-brand font-bold">{bookingForm.serviceType}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Thời gian hẹn:</span>
                            <span className="text-slate-800">
                              {bookingForm.time} ngày {bookingForm.date}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setIsSubmitSuccess(false);
                            setBookingForm({
                              name: "",
                              phone: "",
                              licensePlate: "",
                              vehicleModel: "vf3",
                              serviceType: "Bảo dưỡng định kỳ",
                              date: "",
                              time: "08:30",
                              note: "",
                            });
                          }}
                          className="bg-brand hover:bg-blue-600 text-white font-bold text-xs tracking-wider px-6 py-2.5 rounded-lg transition-all"
                        >
                          ĐẶT LỊCH XE KHÁC
                        </button>
                      </motion.div>
                    ) : (
                      <form onSubmit={handleBookingSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">
                              Họ và tên khách hàng *
                            </label>
                            <input
                              type="text"
                              required
                              value={bookingForm.name}
                              onChange={(e) =>
                                setBookingForm({ ...bookingForm, name: e.target.value })
                              }
                              placeholder="Nguyễn Văn A"
                              className="w-full bg-surface-muted border border-slate-200 px-3.5 py-2 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand text-slate-800 focus:bg-white"
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
                              className="w-full bg-surface-muted border border-slate-200 px-3.5 py-2 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand text-slate-800 focus:bg-white"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">
                              Dòng xe sở hữu
                            </label>
                            <select
                              value={bookingForm.vehicleModel}
                              onChange={(e) =>
                                setBookingForm({ ...bookingForm, vehicleModel: e.target.value })
                              }
                              className="w-full bg-surface-muted border border-slate-200 px-3.5 py-2.5 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand focus:bg-white"
                            >
                              <option value="vf3">VinFast VF 3</option>
                              <option value="vf5">VinFast VF 5</option>
                              <option value="vf6">VinFast VF 6</option>
                              <option value="vf7">VinFast VF 7</option>
                              <option value="vf8">VinFast VF 8</option>
                              <option value="vf9">VinFast VF 9</option>
                              <option value="vfe34">VinFast VF e34</option>
                              <option value="scooter">Xe máy điện VinFast</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">
                              Biển kiểm soát xe (Tùy chọn)
                            </label>
                            <input
                              type="text"
                              value={bookingForm.licensePlate}
                              onChange={(e) =>
                                setBookingForm({ ...bookingForm, licensePlate: e.target.value })
                              }
                              placeholder="vd: 29A-123.45"
                              className="w-full bg-surface-muted border border-slate-200 px-3.5 py-2 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand text-slate-800 focus:bg-white"
                            />
                          </div>
                        </div>

                        <div>
                          <span className="block text-[10px] font-bold text-slate-500 uppercase mb-2">
                            Loại yêu cầu dịch vụ
                          </span>
                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                            {["Bảo dưỡng định kỳ", "Sửa chữa điện tử", "Sơn sấy vỏ xe"].map(
                              (svc) => (
                                <button
                                  key={svc}
                                  type="button"
                                  onClick={() =>
                                    setBookingForm({ ...bookingForm, serviceType: svc })
                                  }
                                  className={`py-2.5 px-2 text-center rounded-lg border text-[11px] font-extrabold transition-all uppercase sm:px-1 sm:py-2 sm:text-[10px] ${
                                    bookingForm.serviceType === svc
                                      ? "border-brand bg-brand/10 text-brand shadow-md"
                                      : "border-slate-200 bg-surface-muted text-slate-500 hover:text-brand-dark hover:bg-slate-100"
                                  }`}
                                >
                                  {svc}
                                </button>
                              ),
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">
                              Ngày hẹn bảo dưỡng *
                            </label>
                            <input
                              type="date"
                              required
                              value={bookingForm.date}
                              onChange={(e) =>
                                setBookingForm({ ...bookingForm, date: e.target.value })
                              }
                              className="w-full bg-surface-muted border border-slate-200 px-3.5 py-2 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand text-slate-800"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">
                              Giờ đến xưởng mong muốn
                            </label>
                            <select
                              value={bookingForm.time}
                              onChange={(e) =>
                                setBookingForm({ ...bookingForm, time: e.target.value })
                              }
                              className="w-full bg-surface-muted border border-slate-200 px-3.5 py-2.5 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand focus:bg-white"
                            >
                              <option value="08:00">08:00 (Sáng)</option>
                              <option value="08:30">08:30 (Sáng)</option>
                              <option value="09:00">09:00 (Sáng)</option>
                              <option value="10:00">10:00 (Sáng)</option>
                              <option value="11:00">11:00 (Sáng)</option>
                              <option value="13:30">13:30 (Chiều)</option>
                              <option value="14:00">14:00 (Chiều)</option>
                              <option value="15:00">15:00 (Chiều)</option>
                              <option value="16:00">16:00 (Chiều)</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">
                            Mô tả hiện trạng xe hoặc yêu cầu khác
                          </label>
                          <textarea
                            value={bookingForm.note}
                            onChange={(e) =>
                              setBookingForm({ ...bookingForm, note: e.target.value })
                            }
                            placeholder="Mô tả hiện trạng xe (ví dụ: Xe bị xước cản trước cần sơn dặm, sạc pin không vào điện, cần dán thêm thảm lót sàn...)"
                            rows={2}
                            className="w-full bg-surface-muted border border-slate-200 px-3.5 py-2 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand text-slate-800 resize-none focus:bg-white"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={bookingSubmitting}
                          className="w-full bg-brand hover:bg-blue-600 text-white font-extrabold text-xs tracking-wider py-3.5 rounded-xl transition-all shadow-md mt-4 flex items-center justify-center gap-2 disabled:opacity-60"
                        >
                          <Calendar className="size-4" />{" "}
                          {bookingSubmitting ? "Đang gửi..." : "GỬI YÊU CẦU ĐẶT HẸN DỊCH VỤ"}
                        </button>
                      </form>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Why choose after sales service */}
        <WhyChooseSection />

        {/* FAQ Accordion list */}
        <FaqSection content={content} />

        {/* CTA Section and Map detail */}
        <CtaBanner />
      </main>

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
                Dịch vụ hậu mãi chính hãng
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
  onScrollToBooking,
}: {
  content: AfterSalesPageContent;
  heroBanners: HeroBannerSlide[];
  onScrollToBooking: () => void;
}) {
  return (
    <StaticEditablePageMarketingHero
      banners={heroBanners}
      hero={content.hero}
      defaultHero={DEFAULT_AFTER_SALES_CONTENT.hero!}
      features={[...HERO_FEATURES]}
      primaryCta={{ label: "ĐẶT LỊCH HẸN TRỰC TUYẾN", onClick: onScrollToBooking }}
      secondaryCta={{ label: `HOTLINE CỨU HỘ: ${HOTLINE}`, href: HOTLINE_TEL }}
      showControls={heroBanners.length > 1}
    />
  );
}

function ServicesSection({ content }: { content: AfterSalesPageContent }) {
  const edit = useStaticPageAdminEdit();
  const services = content.services ?? DEFAULT_AFTER_SALES_CONTENT.services ?? [];

  return (
    <section className="bg-surface-muted section-y">
      <div className="container-vf">
        <SectionHeader
          align="centered"
          eyebrow="Danh mục dịch vụ"
          title="Hệ thống dịch vụ hậu mãi toàn diện"
        />

        <StaggerGrid className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map(({ title, desc, items }, index) => {
            const Icon = SERVICE_ICONS[index] ?? Wrench;
            return (
              <StaggerItem key={title} index={index}>
                <div className="page-section-card flex h-full flex-col p-7 transition-all duration-300 hover:shadow-card hover:-translate-y-1 group">
                  <div className="flex size-12 items-center justify-center rounded-xl border border-brand/20 bg-brand/5 text-brand group-hover:bg-brand group-hover:text-white transition-all duration-300">
                    <Icon className="size-6" strokeWidth={1.5} />
                  </div>
                  <h3 className="mt-5 text-sm font-black tracking-wide text-brand-dark uppercase">
                    <StaticEditableText
                      value={title}
                      onChange={(value) => edit?.updateField(`services.${index}.title`, value)}
                    />
                  </h3>
                  <p className="mt-3 text-xs leading-relaxed text-slate-400 font-semibold line-clamp-3 min-h-[50px]">
                    <StaticEditableText
                      value={desc}
                      onChange={(value) => edit?.updateField(`services.${index}.desc`, value)}
                      multiline
                    />
                  </p>
                  <ul className="mt-5 space-y-2 flex-1 border-t border-slate-100 pt-4">
                    {items.map((item, itemIndex) => (
                      <li
                        key={item}
                        className="flex items-center gap-2 text-[11px] text-slate-600 font-bold"
                      >
                        <Check size={13} className="shrink-0 text-brand" strokeWidth={3} />
                        <StaticEditableText
                          value={item}
                          onChange={(value) =>
                            edit?.updateField(`services.${index}.items.${itemIndex}`, value)
                          }
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerGrid>
      </div>
    </section>
  );
}

function WarrantySection({ content }: { content: AfterSalesPageContent }) {
  const edit = useStaticPageAdminEdit();
  const warranty = content.warranty ?? DEFAULT_AFTER_SALES_CONTENT.warranty ?? [];

  return (
    <section className="bg-white section-y border-b border-slate-200">
      <div className="container-vf">
        <SectionHeader
          align="centered"
          eyebrow="Quyền lợi chủ xe"
          title="Chính sách bảo hành chính hãng"
        />

        <StaggerGrid className="grid gap-6 md:grid-cols-3">
          {warranty.map(({ title, highlight, items }, index) => {
            const Icon = WARRANTY_ICONS[index] ?? Car;
            return (
              <StaggerItem key={title} index={index}>
                <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-surface-muted p-6 md:p-8 shadow-soft transition-all duration-300 hover:shadow-card hover:-translate-y-1">
                  <div className="flex items-center gap-4">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-brand/20 bg-white text-brand shadow-sm">
                      <Icon className="size-6" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-brand-dark uppercase">
                        <StaticEditableText
                          value={title}
                          onChange={(value) => edit?.updateField(`warranty.${index}.title`, value)}
                        />
                      </h3>
                      <p className="text-xs font-black text-brand mt-0.5 uppercase tracking-wide">
                        <StaticEditableText
                          value={highlight}
                          onChange={(value) =>
                            edit?.updateField(`warranty.${index}.highlight`, value)
                          }
                        />
                      </p>
                    </div>
                  </div>
                  <ul className="mt-6 space-y-3 border-t border-slate-200/60 pt-5">
                    {items.map((item, itemIndex) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-xs leading-relaxed text-slate-500 font-semibold"
                      >
                        <Check size={14} className="shrink-0 mt-0.5 text-brand" strokeWidth={3} />
                        <StaticEditableText
                          value={item}
                          onChange={(value) =>
                            edit?.updateField(`warranty.${index}.items.${itemIndex}`, value)
                          }
                          multiline
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerGrid>

        <p className="mt-8 text-center text-[10px] text-slate-400 font-extrabold uppercase">
          * Chi tiết thời hạn bảo hành thực tế áp dụng dựa trên sổ bảo hành số hóa đi kèm xe của
          VinFast.
        </p>
      </div>
    </section>
  );
}

function ProcessSection() {
  return (
    <section className="bg-surface-muted section-y overflow-hidden border-b border-slate-200">
      <div className="container-vf">
        <SectionHeader
          align="centered"
          eyebrow="Quy trình chuẩn mực"
          title="5 bước thực hiện dịch vụ khép kín"
        />

        <div className="relative">
          <div className="absolute top-[22px] right-12 left-12 hidden h-[2px] bg-slate-200 lg:block" />
          <StaggerGrid className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {PROCESS_STEPS.map(({ step, title, desc }, index) => (
              <StaggerItem key={step} index={index}>
                <div className="relative flex flex-col items-center text-center">
                  <div className="relative z-10 mb-4 flex size-11 items-center justify-center rounded-full border-2 border-brand bg-white">
                    <span className="text-xs font-black text-brand">{step}</span>
                  </div>
                  <div className="page-section-card w-full p-5 h-full transition-shadow duration-300 hover:shadow-md">
                    <h3 className="text-xs font-black text-brand-dark uppercase">{title}</h3>
                    <p className="mt-2 text-[11px] leading-relaxed text-slate-400 font-semibold mt-2.5">
                      {desc}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </div>
    </section>
  );
}

function MaintenanceSection() {
  return (
    <section className="bg-white section-y">
      <div className="container-vf">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <FadeIn
            direction="left"
            className="overflow-hidden rounded-2xl shadow-card relative group aspect-[4/3] w-full border border-slate-200 bg-slate-100"
          >
            <img
              src={IMAGES.community}
              alt="Bảo dưỡng xe VinFast"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </FadeIn>
          <FadeIn direction="right" delay={0.08}>
            <SectionHeader
              align="editorial"
              eyebrow="Mốc thời gian quy định"
              title="Mốc bảo dưỡng định kỳ quan trọng"
              description="Khác với xe động cơ xăng, xe ô tô điện và xe máy điện VinFast có kết cấu tối giản và đồng bộ cao, giúp giảm thiểu tối đa các hạng mục bảo dưỡng thông thường và tiết kiệm tới 60% chi phí vận hành bảo trì."
              className="mb-6 lg:mb-8"
            />

            <div className="mt-8 space-y-6">
              {MAINTENANCE_INTERVALS.map(({ type, intervals }) => (
                <div
                  key={type}
                  className="rounded-2xl border border-slate-200 bg-surface-muted p-5"
                >
                  <h3 className="text-xs font-black text-brand-dark uppercase tracking-wider">
                    {type}
                  </h3>
                  <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    {intervals.map((item) => (
                      <div
                        key={item.km}
                        className="rounded-xl border border-brand/20 bg-white p-3 flex flex-col justify-between items-center text-center shadow-sm"
                      >
                        <span className="text-[11px] font-black text-brand">{item.km}</span>
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase mt-1.5">
                          {item.desc}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50/50 p-4 flex items-start gap-2.5">
              <HelpCircle className="size-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed text-amber-900/80 font-semibold">
                <strong>Lưu ý kỹ thuật:</strong> Để bảo đảm tính hiệu lực cho hệ thống bảo hành pin
                LFP thế hệ mới, quý khách vui lòng chấp hành đưa xe đi bảo dưỡng đúng hạn km chỉ
                định hoặc mốc thời gian (Tùy điều kiện nào đến trước).
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

function WhyChooseSection() {
  return (
    <section className="bg-surface-muted section-y border-t border-slate-200">
      <div className="container-vf">
        <SectionHeader
          align="centered"
          eyebrow="Trải nghiệm vượt trội"
          title="Vì sao lựa chọn VinFast Ngọc Anh Cà Mau?"
        />

        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <StaggerGrid className="space-y-6 order-2 lg:order-1">
            {WHY_CHOOSE.map(({ icon: Icon, title, desc }, index) => (
              <StaggerItem key={title} index={index}>
                <div className="flex gap-4 items-start bg-white border border-slate-200 p-5 rounded-2xl shadow-soft">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                    <Icon className="size-5.5 text-brand" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-brand-dark uppercase tracking-wider">
                      {title}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-400 font-semibold">
                      {desc}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
          <FadeIn
            direction="right"
            delay={0.1}
            className="relative flex items-center justify-center overflow-hidden rounded-2xl bg-white aspect-[4/3] w-full border border-slate-200 shadow-soft order-1 lg:order-2 group"
          >
            <div className="absolute inset-0 bg-brand-dark/10 group-hover:bg-brand-dark/20 z-10 transition-colors pointer-events-none" />
            <img
              src={IMAGES.chargingStations}
              alt="Hệ thống dịch vụ VinFast"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

function FaqSection({ content }: { content: AfterSalesPageContent }) {
  const edit = useStaticPageAdminEdit();
  const faq = content.faq ?? DEFAULT_AFTER_SALES_CONTENT.faq ?? [];

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

function CtaBanner() {
  return (
    <PageCtaSection
      title="Cần hỗ trợ dịch vụ bảo dưỡng?"
      description="Trung tâm Chăm sóc khách hàng của đại lý VinFast Ngọc Anh Cà Mau túc trực phục vụ quý túc trực phục vụ quý khách 24/7/365. Hãy gọi ngay cho chúng tôi nếu quý khách cần hỗ trợ cứu hộ khẩn cấp!"
    >
      <a href={HOTLINE_TEL} className={pageCtaPrimary}>
        <Phone className="size-4 text-accent-yellow" /> HOTLINE CỨU HỘ: {HOTLINE}
      </a>
      <button
        type="button"
        onClick={() => {
          document.getElementById("service-booking-form")?.scrollIntoView({ behavior: "smooth" });
        }}
        className={pageCtaGhost}
      >
        ĐẶT HẸN KỸ THUẬT VIÊN
      </button>
    </PageCtaSection>
  );
}
