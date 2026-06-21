"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast, Toaster } from "sonner";
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
  Sparkles,
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
import { IMAGES } from "@/lib/images";

const STATS = [
  { icon: MapPin, value: "63+", label: "Tỉnh thành phủ sóng dịch vụ ủy quyền" },
  { icon: Users, value: "500+", label: "Kỹ thuật viên cao cấp đạt chứng nhận từ hãng" },
  { icon: Clock, value: "24/7/365", label: "Cứu hộ, cứu trợ sạc pin & hỗ trợ khẩn cấp" },
] as const;

const SERVICES = [
  {
    icon: Wrench,
    title: "Bảo dưỡng định kỳ",
    desc: "Quy trình chăm sóc, bảo dưỡng định kỳ khép kín theo tiêu chuẩn hãng, đảm bảo xế yêu luôn vận hành êm ái, kéo dài tuổi thọ hệ thống pin Lithium.",
    items: [
      "Kiểm tra sức khỏe tổng thể pin LFP",
      "Vệ sinh, bảo dưỡng hệ thống phanh tái sinh",
      "Kiểm tra chất lỏng làm mát & bôi trơn pin",
      "Quét lỗi phần mềm bằng máy chuyên dụng",
    ],
  },
  {
    icon: Stethoscope,
    title: "Sửa chữa chính hãng",
    desc: "Xưởng dịch vụ quy mô lớn được trang bị cầu nâng hiện đại, máy cân chỉnh thước lái laser và các thiết bị chẩn đoán điện tử thế hệ mới nhất.",
    items: [
      "Chẩn đoán và xử lý lỗi hệ thống điện tử",
      "Sửa chữa, đồng sơn công nghệ cao sấy hồng ngoại",
      "Cân chỉnh thước lái, hệ thống treo & khung gầm",
      "Sửa chữa, phục hồi hệ thống pin truyền động",
    ],
  },
  {
    icon: Shield,
    title: "Bảo hành xe mới",
    desc: "Chính sách bảo hành dài hạn nhất thị trường Việt Nam dành cho cả xe ô tô và xe máy điện, giúp quý khách hoàn toàn an tâm trên mọi cung đường.",
    items: [
      "Bảo hành ô tô lên tới 10 năm/200.000 km",
      "Bảo hành xe máy điện lên tới 5 năm",
      "Hệ thống cập nhật thông tin bảo hành trực tuyến",
      "Cam kết bảo hành phụ tùng thay thế chính hãng",
    ],
  },
  {
    icon: Truck,
    title: "Cứu hộ 24/7 khẩn cấp",
    desc: "Tổng đài cứu hộ túc trực ngày đêm, sẵn sàng điều động xe kéo sạc pin lưu động hoặc hỗ trợ kỹ thuật tại chỗ bất cứ khi nào quý khách cần.",
    items: [
      "Hotline cứu hộ khẩn cấp 24/7/365",
      "Kéo xe về xưởng dịch vụ gần nhất an toàn",
      "Dịch vụ sạc pin lưu động Mobile Charging",
      "Cung cấp xe thay thế tạm thời cho khách hàng VIP",
    ],
  },
  {
    icon: Package,
    title: "Phụ tùng chính hãng",
    desc: "Cam kết cung cấp 100% phụ tùng, linh kiện chính hãng VinFast sản xuất dưới sự giám sát nghiêm ngặt của đội ngũ chuyên gia quốc tế.",
    items: [
      "Linh kiện đồng bộ chuẩn kích thước 3D",
      "Chính sách bảo hành riêng cho phụ tùng thay thế",
      "Kho linh kiện dồi dào, sẵn sàng cung ứng ngay",
      "Giá bán niêm yết công khai, minh bạch toàn hệ thống",
    ],
  },
  {
    icon: Cpu,
    title: "Cập nhật phần mềm FOTA",
    desc: "Công nghệ cập nhật phần mềm không dây từ xa FOTA liên tục tối ưu hóa thuật toán quản lý pin BMS, hệ thống ADAS và sửa lỗi vận hành.",
    items: [
      "Tự động tải bản cập nhật qua SIM 4G",
      "Nâng cấp tính năng tự lái ADAS liên tục",
      "Tối ưu hóa tầm vận hành, tiết kiệm năng lượng",
      "Hỗ trợ cài đặt trực tiếp tại xưởng dịch vụ",
    ],
  },
] as const;

const WARRANTY_POLICIES = [
  {
    icon: Car,
    title: "Ô tô điện VinFast",
    highlight: "Bảo hành đỉnh cấp 10 năm",
    items: [
      "Bảo hành xe: 10 năm hoặc 200.000 km tùy điều kiện nào đến trước.",
      "Bảo hành pin Lithium: 8 - 10 năm không giới hạn số km (tùy theo model).",
      "Hỗ trợ sạc pin lưu động Mobile Charging tại chỗ 24/7 cực nhanh.",
      "Chính sách cam kết mua lại xe điện đã qua sử dụng sau 5 năm.",
    ],
  },
  {
    icon: Bike,
    title: "Xe máy điện VinFast",
    highlight: "Bảo hành tới 5 năm",
    items: [
      "Bảo hành xe: 3 - 5 năm hoặc 30.000 - 50.000 km tùy dòng xe máy.",
      "Bảo hành pin LFP: 3 năm, hỗ trợ đổi trả nếu dung lượng pin hao hụt dưới 70%.",
      "Bảo dưỡng định kỳ miễn phí công tại toàn bộ xưởng dịch vụ đại lý.",
      "Cứu hộ khẩn cấp xe máy điện trên mọi cung đường nội đô.",
    ],
  },
  {
    icon: Battery,
    title: "Gói thuê pin ưu đãi",
    highlight: "An tâm trọn vòng đời",
    items: [
      "VinFast chịu hoàn toàn rủi ro về chất lượng pin trong suốt quá trình thuê.",
      "Thay thế/Sửa chữa pin hoàn toàn miễn phí khi dung lượng tối đa dưới 70%.",
      "Chi phí thuê pin cực rẻ, tiết kiệm chi phí vận hành hơn so với xe xăng.",
      "Hỗ trợ đổi pin nhanh chóng tại hệ thống xưởng ủy quyền.",
    ],
  },
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
    desc: "Hạ tầng xưởng dịch vụ quy mô lớn tại Long Biên, sở hữu đầy đủ trang thiết bị chuẩn kỹ thuật nghiêm ngặt nhất của VinFast toàn cầu.",
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

const FAQS = [
  {
    q: "Làm sao để đặt lịch bảo dưỡng trực tuyến nhanh nhất tại VF Ngọc Anh?",
    a: "Quý khách có thể sử dụng biểu mẫu Đăng ký đặt hẹn dịch vụ ở ngay phía dưới trang web này, gọi trực tiếp tới Hotline chăm sóc khách hàng 1900 2323 89, hoặc đặt qua ứng dụng di động VinFast Club. Sau khi gửi thông tin, cố vấn dịch vụ sẽ gọi điện xác nhận lịch hẹn trong 10 phút.",
  },
  {
    q: "Chi phí bảo dưỡng định kỳ của ô tô điện VinFast khoảng bao nhiêu?",
    a: "Do động cơ điện có cấu tạo tối giản hơn rất nhiều so với xe xăng (không có bugi, lọc dầu, xích cam...), chi phí bảo dưỡng định kỳ của ô tô điện VinFast cực kỳ tiết kiệm, thường chỉ bằng khoảng 30% - 40% so với xe xăng cùng phân khúc. Mức phí bảo dưỡng trung bình ở cấp nhỏ (12.000 km) dao động từ 1 - 2 triệu VNĐ.",
  },
  {
    q: "Hệ thống cứu hộ pin lưu động Mobile Charging hoạt động ra sao?",
    a: "Khi xe của quý khách cạn kiệt pin giữa đường hoặc gặp sự cố nguồn điện, chỉ cần gọi Hotline 1900 2323 89. Đội cứu hộ Mobile Charging chuyên dụng của chúng tôi sẽ di chuyển tới hiện trường và cung cấp dịch vụ sạc pin nhanh khẩn cấp (cho phép xe chạy tiếp khoảng 30 - 50 km) với mức chi phí vô cùng hỗ trợ.",
  },
  {
    q: "Sửa chữa xe tại gara ngoài có làm mất hiệu lực bảo hành chính hãng không?",
    a: "Có rủi ro lớn. Theo chính sách của hãng, nếu quý khách thực hiện sửa chữa các bộ phận liên quan đến hệ thống pin, phần mềm, hoặc động cơ tại các cơ sở không được VinFast ủy quyền và gây ra hư hỏng, VinFast có quyền từ chối bảo hành đối với các bộ phận đó. Quý khách nên mang xe đến xưởng 3S của VF Ngọc Anh để đảm bảo tối đa quyền lợi.",
  },
  {
    q: "Làm thế nào để tôi kiểm tra thời hạn bảo hành còn lại của xe?",
    a: "Thời hạn bảo hành và lịch sử bảo dưỡng của xe được số hóa và đồng bộ trực tiếp lên hệ thống máy chủ của VinFast. Quý khách có thể tự tra cứu trên ứng dụng VinFast hoặc cung cấp số khung xe (VIN) cho cố vấn dịch vụ tại xưởng của VF Ngọc Anh để được hỗ trợ kiểm tra trực tuyến trong 2 phút.",
  },
] as const;

const sectionHeading =
  "text-center text-xl font-black leading-tight tracking-tight text-brand-dark sm:text-2xl md:text-3xl lg:text-4xl";

export default function AfterSalesPage() {
  // Booking Service State
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
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

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.name || !bookingForm.phone) {
      toast.error("Vui lòng điền Họ tên và Số điện thoại liên hệ");
      return;
    }
    setIsSubmitSuccess(true);
    toast.success("Đặt lịch bảo dưỡng thành công!");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased font-sans">
      <Toaster position="top-right" richColors />
      <Header />

      <main>
        {/* Path navigation */}
        <BreadcrumbBar />

        {/* Hero Section Banner */}
        <HeroSection
          onScrollToBooking={() => {
            document.getElementById("service-booking-form")?.scrollIntoView({ behavior: "smooth" });
          }}
        />

        {/* Dynamic Search / Quick Navigation Header */}
        <section className="bg-white border-b border-slate-100 py-4 sticky top-[72px] z-20 shadow-sm">
          <div className="container-vf flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-xs font-black text-brand-dark uppercase tracking-wider">
              Hệ thống chăm sóc hậu mãi VinFast
            </div>
            <div className="flex items-center gap-3">
              <a
                href="tel:1900232389"
                className="bg-brand hover:bg-blue-600 text-white font-extrabold text-xs tracking-wider px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <Phone className="size-4 text-accent-yellow" /> CỨU HỘ KHẨN CẤP: 1900 2323 89
              </a>
              <button
                onClick={() => {
                  document
                    .getElementById("service-booking-form")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="bg-brand-dark hover:bg-brand text-white font-extrabold text-xs tracking-wider px-5 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2"
              >
                <Calendar className="size-4 text-brand" /> ĐẶT HẸN TRỰC TUYẾN
              </button>
            </div>
          </div>
        </section>

        {/* 6 Core Services Grids */}
        <ServicesSection />

        {/* Detailed Warranty Grid with high-contrast badge */}
        <WarrantySection />

        {/* Progressive 5-Step Process Section */}
        <ProcessSection />

        {/* Maintenance Intervals Schedule Cards */}
        <MaintenanceSection />

        {/* Interactive Booking Appointment Form */}
        <section
          id="service-booking-form"
          className="bg-white text-slate-800 py-16 md:py-20 overflow-hidden relative border-y border-slate-200"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,87,255,0.06),transparent)] pointer-events-none" />

          <div className="container-vf relative z-10">
            <div className="max-w-2xl mx-auto text-center mb-12">
              <span className="bg-brand/10 text-brand px-4 py-1.5 rounded-full text-xs font-extrabold tracking-widest uppercase border border-brand/20">
                Dịch vụ thông minh
              </span>
              <h2 className="text-2xl font-black mt-4 tracking-tight md:text-3xl lg:text-4xl text-brand-dark">
                ĐĂNG KÝ ĐẶT LỊCH HẸN BẢO DƯỠNG
              </h2>
              <p className="text-slate-500 text-xs md:text-sm mt-3 leading-relaxed">
                Tiết kiệm 100% thời gian chờ đợi tại xưởng. Đăng ký trước lịch hẹn dịch vụ bảo dưỡng
                định kỳ, sửa chữa hệ thống pin hoặc cập nhật phần mềm xe để được cố vấn đón tiếp chu
                đáo nhất.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl max-w-4xl mx-auto grid md:grid-cols-12">
              {/* Form Guidance Side */}
              <div className="md:col-span-5 p-6 md:p-8 bg-slate-50 border-b md:border-b-0 md:border-r border-slate-200 flex flex-col justify-between">
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
                    <MapPin className="size-4 text-brand" /> Số 123 Nguyễn Văn Linh, Long Biên, Hà
                    Nội
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="size-4 text-brand" /> Giờ làm việc: Sáng 8:00 - 12:00 | Chiều
                    13:00 - 17:00
                  </p>
                </div>
              </div>

              {/* Form Inputs Side */}
              <div className="md:col-span-7 p-6 md:p-8 bg-white">
                <AnimatePresence mode="wait">
                  {isSubmitSuccess ? (
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.95, opacity: 0 }}
                      className="py-10 text-center space-y-5"
                    >
                      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 border border-emerald-200">
                        <Check className="size-8" strokeWidth={2.5} />
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-brand-dark uppercase">
                          Đặt lịch hẹn thành công!
                        </h4>
                        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                          Cảm ơn quý khách{" "}
                          <strong className="text-slate-700">{bookingForm.name}</strong> đã đăng ký
                          lịch hẹn dịch vụ tại VF Ngọc Anh. Cố vấn kỹ thuật của chúng tôi sẽ gọi
                          điện xác nhận chính xác ngày giờ hẹn và chuẩn bị linh kiện thay thế phục
                          vụ quý khách trong 10 phút.
                        </p>
                      </div>

                      <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 text-left text-xs font-semibold space-y-2.5 max-w-sm mx-auto">
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
                      <div className="grid grid-cols-2 gap-3">
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
                            className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand text-slate-800 focus:bg-white"
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
                            className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand text-slate-800 focus:bg-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">
                            Dòng xe sở hữu
                          </label>
                          <select
                            value={bookingForm.vehicleModel}
                            onChange={(e) =>
                              setBookingForm({ ...bookingForm, vehicleModel: e.target.value })
                            }
                            className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand focus:bg-white"
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
                            className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand text-slate-800 focus:bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <span className="block text-[10px] font-bold text-slate-500 uppercase mb-2">
                          Loại yêu cầu dịch vụ
                        </span>
                        <div className="grid grid-cols-3 gap-2">
                          {["Bảo dưỡng định kỳ", "Sửa chữa điện tử", "Sơn sấy vỏ xe"].map((svc) => (
                            <button
                              key={svc}
                              type="button"
                              onClick={() => setBookingForm({ ...bookingForm, serviceType: svc })}
                              className={`py-2 px-1 text-center rounded-lg border text-[10px] font-extrabold transition-all uppercase ${
                                bookingForm.serviceType === svc
                                  ? "border-brand bg-brand/10 text-brand shadow-md"
                                  : "border-slate-200 bg-slate-50 text-slate-500 hover:text-brand-dark hover:bg-slate-100"
                              }`}
                            >
                              {svc}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
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
                            className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand text-slate-800"
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
                            className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand focus:bg-white"
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
                          onChange={(e) => setBookingForm({ ...bookingForm, note: e.target.value })}
                          placeholder="Mô tả hiện trạng xe (ví dụ: Xe bị xước cản trước cần sơn dặm, sạc pin không vào điện, cần dán thêm thảm lót sàn...)"
                          rows={2}
                          className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand text-slate-800 resize-none focus:bg-white"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-brand hover:bg-blue-600 text-white font-extrabold text-xs tracking-wider py-3.5 rounded-xl transition-all shadow-md mt-4 flex items-center justify-center gap-2"
                      >
                        <Calendar className="size-4" /> GỬI YÊU CẦU ĐẶT HẸN DỊCH VỤ
                      </button>
                    </form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>

        {/* Why choose after sales service */}
        <WhyChooseSection />

        {/* FAQ Accordion list */}
        <FaqSection />

        {/* CTA Section and Map detail */}
        <CtaBanner />
      </main>

      <Footer />
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
                Dịch vụ hậu mãi chính hãng
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
    <section className="bg-slate-950 py-16 md:py-24 text-white overflow-hidden relative min-h-[480px] flex items-center">
      <div className="absolute inset-0">
        <img
          src={IMAGES.showroom}
          alt="Xưởng dịch vụ VF Ngọc Anh"
          className="h-full w-full object-cover opacity-80 filter blur-[1px]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      </div>

      <div className="container-vf relative z-10 text-white">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center"
          >
            <div className="inline-flex items-center gap-2 bg-brand/10 border border-brand/20 text-brand px-3.5 py-1 rounded-full text-[10px] font-extrabold tracking-widest uppercase">
              <Sparkles className="size-3.5 text-accent-yellow animate-pulse" /> DỊCH VỤ 3S ỦY QUYỀN
              CHÍNH THỨC VINFAST
            </div>
            <h1 className="mt-4 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
              CHĂM SÓC XE TOÀN DIỆN <br />
              <span className="bg-gradient-to-r from-brand via-blue-400 to-emerald-400 bg-clip-text text-transparent italic">
                AN TÂM BỨT PHÁ
              </span>
            </h1>
            <p className="mt-4 text-xs md:text-sm leading-relaxed text-slate-300 font-medium">
              Trung tâm dịch vụ ủy quyền chính thức của VinFast tại VF Ngọc Anh được trang bị máy
              móc hiện đại bậc nhất, phân phối linh kiện chính hãng 100%, bảo hành xe dài hạn tới 10
              năm và hệ thống cứu hộ cứu trợ pin lưu động túc trực khẩn cấp 24/7.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={onScrollToBooking}
                className="bg-brand hover:bg-blue-600 text-white font-extrabold text-xs tracking-wider px-6 py-3.5 rounded-xl shadow-lg transition-all flex items-center gap-1.5"
              >
                <Calendar className="size-4 text-accent-yellow" /> ĐẶT LỊCH HẸN TRỰC TUYẾN
              </button>
              <a
                href="tel:1900232389"
                className="bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs tracking-wider px-6 py-3.5 rounded-xl transition-all flex items-center gap-2 border border-white/10"
              >
                <Phone className="size-4 text-accent-yellow" /> HOTLINE CỨU HỘ: 1900 2323 89
              </a>
            </div>

            {/* Core figures Stats */}
            <div className="mt-10 grid gap-6 sm:grid-cols-3 pt-6 border-t border-white/10">
              {STATS.map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-brand/20 bg-brand/10 text-brand">
                    <Icon className="size-5 text-brand" strokeWidth={1.5} />
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

function ServicesSection() {
  return (
    <section className="bg-slate-50 py-16 md:py-20">
      <div className="container-vf">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <span className="text-brand font-extrabold text-xs tracking-widest uppercase">
            Danh mục dịch vụ
          </span>
          <h2 className={sectionHeading + " mt-2"}>HỆ THỐNG DỊCH VỤ HẬU MÃI TOÀN DIỆN</h2>
          <div className="h-1 w-16 bg-brand mx-auto mt-4 rounded" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map(({ icon: Icon, title, desc, items }) => (
            <div
              key={title}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-7 shadow-soft transition-all duration-300 hover:shadow-card hover:-translate-y-1 group"
            >
              <div className="flex size-12 items-center justify-center rounded-xl border border-brand/20 bg-brand/5 text-brand group-hover:bg-brand group-hover:text-white transition-all duration-300">
                <Icon className="size-6" strokeWidth={1.5} />
              </div>
              <h3 className="mt-5 text-sm font-black tracking-wide text-brand-dark uppercase">
                {title}
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-slate-400 font-semibold line-clamp-3 min-h-[50px]">
                {desc}
              </p>
              <ul className="mt-5 space-y-2 flex-1 border-t border-slate-100 pt-4">
                {items.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-[11px] text-slate-600 font-bold"
                  >
                    <Check size={13} className="shrink-0 text-brand" strokeWidth={3} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WarrantySection() {
  return (
    <section className="bg-white py-16 md:py-20 border-b border-slate-200">
      <div className="container-vf">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <span className="text-brand font-extrabold text-xs tracking-widest uppercase">
            Quyền lợi chủ xe
          </span>
          <h2 className={sectionHeading + " mt-2"}>CHÍNH SÁCH BẢO HÀNH CHÍNH HÃNG</h2>
          <div className="h-1 w-16 bg-brand mx-auto mt-4 rounded" />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {WARRANTY_POLICIES.map(({ icon: Icon, title, highlight, items }) => (
            <div
              key={title}
              className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-6 md:p-8 shadow-soft transition-all duration-300 hover:shadow-card hover:-translate-y-1"
            >
              <div className="flex items-center gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-brand/20 bg-white text-brand shadow-sm">
                  <Icon className="size-6" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-brand-dark uppercase">{title}</h3>
                  <p className="text-xs font-black text-brand mt-0.5 uppercase tracking-wide">
                    {highlight}
                  </p>
                </div>
              </div>
              <ul className="mt-6 space-y-3 border-t border-slate-200/60 pt-5">
                {items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-xs leading-relaxed text-slate-500 font-semibold"
                  >
                    <Check size={14} className="shrink-0 mt-0.5 text-brand" strokeWidth={3} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

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
    <section className="bg-slate-50 py-16 md:py-20 overflow-hidden border-b border-slate-200">
      <div className="container-vf">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <span className="text-brand font-extrabold text-xs tracking-widest uppercase">
            Quy trình chuẩn mực
          </span>
          <h2 className={sectionHeading + " mt-2"}>5 BƯỚC THỰC HIỆN DỊCH VỤ KHÉP KÍN</h2>
          <div className="h-1 w-16 bg-brand mx-auto mt-4 rounded" />
        </div>

        <div className="relative">
          <div className="absolute top-[22px] right-12 left-12 hidden h-[2px] bg-slate-200 lg:block" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {PROCESS_STEPS.map(({ step, title, desc }) => (
              <div key={step} className="relative flex flex-col items-center text-center">
                <div className="relative z-10 mb-4 flex size-11 items-center justify-center rounded-full border-2 border-brand bg-white">
                  <span className="text-xs font-black text-brand">{step}</span>
                </div>
                <div className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-soft h-full transition-shadow duration-300 hover:shadow-md">
                  <h3 className="text-xs font-black text-brand-dark uppercase">{title}</h3>
                  <p className="mt-2 text-[11px] leading-relaxed text-slate-400 font-semibold mt-2.5">
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

function MaintenanceSection() {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="container-vf">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="overflow-hidden rounded-2xl shadow-card relative group aspect-[4/3] w-full border border-slate-200 bg-slate-100">
            <img
              src={IMAGES.community}
              alt="Bảo dưỡng xe VinFast"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>
          <div>
            <span className="text-brand font-extrabold text-xs tracking-widest uppercase">
              Mốc thời gian quy định
            </span>
            <h2 className="text-xl font-black mt-2 tracking-wide text-brand-dark sm:text-2xl md:text-3xl uppercase">
              MỐC BẢO DƯỠNG ĐỊNH KỲ QUAN TRỌNG
            </h2>
            <div className="mt-3 h-1 w-16 bg-brand rounded" />
            <p className="mt-4 text-xs md:text-sm leading-relaxed text-slate-400 font-semibold">
              Khác với xe động cơ xăng, xe ô tô điện và xe máy điện VinFast có kết cấu tối giản và
              đồng bộ cao, giúp giảm thiểu tối đa các hạng mục bảo dưỡng thông thường và tiết kiệm
              tới 60% chi phí vận hành bảo trì.
            </p>

            <div className="mt-8 space-y-6">
              {MAINTENANCE_INTERVALS.map(({ type, intervals }) => (
                <div key={type} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
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
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyChooseSection() {
  return (
    <section className="bg-slate-50 py-16 md:py-20 border-t border-slate-200">
      <div className="container-vf">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <span className="text-brand font-extrabold text-xs tracking-widest uppercase">
            Trải nghiệm vượt trội
          </span>
          <h2 className={sectionHeading + " mt-2"}>VÌ SAO LỰA CHỌN VF NGỌC ANH?</h2>
          <div className="h-1 w-16 bg-brand mx-auto mt-4 rounded" />
        </div>

        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <ul className="space-y-6 order-2 lg:order-1">
            {WHY_CHOOSE.map(({ icon: Icon, title, desc }) => (
              <li
                key={title}
                className="flex gap-4 items-start bg-white border border-slate-200 p-5 rounded-2xl shadow-soft"
              >
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
              </li>
            ))}
          </ul>
          <div className="relative flex items-center justify-center overflow-hidden rounded-2xl bg-white aspect-[4/3] w-full border border-slate-200 shadow-soft order-1 lg:order-2 group">
            <div className="absolute inset-0 bg-brand-dark/10 group-hover:bg-brand-dark/20 z-10 transition-colors pointer-events-none" />
            <img
              src={IMAGES.chargingStations}
              alt="Hệ thống dịch vụ VinFast"
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
    <section className="bg-white py-16 md:py-20 border-b border-slate-200">
      <div className="container-vf max-w-3xl">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <span className="text-brand font-extrabold text-xs tracking-widest uppercase">
            Cố vấn giải đáp
          </span>
          <h2 className={sectionHeading + " mt-2"}>CÂU HỎI THƯỜNG GẶP</h2>
          <div className="h-1 w-16 bg-brand mx-auto mt-4 rounded" />
        </div>

        <div className="space-y-3">
          {FAQS.map(({ q, a }, index) => {
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
    <section className="relative overflow-hidden bg-brand-dark py-16 md:py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,87,255,0.15),transparent)] pointer-events-none" />
      <div className="container-vf relative z-10">
        <div className="grid items-center gap-8 lg:grid-cols-12">
          <div className="text-white lg:col-span-7 text-center lg:text-left">
            <h2 className="text-2xl font-black leading-tight tracking-tight sm:text-3xl md:text-4xl uppercase text-white">
              Cần hỗ trợ dịch vụ bảo dưỡng?
            </h2>
            <p className="mt-4 max-w-xl text-xs md:text-sm leading-relaxed text-slate-300 font-medium">
              Trung tâm Chăm sóc khách hàng của đại lý VF Ngọc Anh tại Nguyễn Văn Linh, Long Biên
              túc trực phục vụ quý khách 24/7/365. Hãy gọi ngay cho chúng tôi nếu quý khách cần hỗ
              trợ cứu hộ khẩn cấp!
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <a
                href="tel:1900232389"
                className="inline-flex items-center gap-2 rounded-xl bg-brand hover:bg-blue-600 px-6 py-3.5 text-xs font-black tracking-wider text-white shadow-md transition-all"
              >
                <Phone className="size-4 text-accent-yellow" /> HOTLINE CỨU HỘ: 1900 2323 89
              </a>
              <button
                onClick={() => {
                  document
                    .getElementById("service-booking-form")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 text-xs font-black tracking-wider text-white transition-all hover:bg-white/20"
              >
                ĐẶT HẸN KỸ THUẬT VIÊN
              </button>
            </div>

            <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-6 text-xs text-slate-400 font-semibold">
              <span className="flex items-center gap-2">
                <MapPin className="size-4 text-brand" />
                Số 123 Nguyễn Văn Linh, Long Biên, Hà Nội
              </span>
              <span className="flex items-center gap-2">
                <Mail className="size-4 text-brand" />
                ngocanh@vinfast.vn
              </span>
            </div>
          </div>
          <div className="hidden justify-end lg:flex lg:col-span-5">
            <img
              src={IMAGES.vf9Suv}
              alt="VinFast VF 9"
              className="max-h-[220px] w-auto object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.4)]"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
