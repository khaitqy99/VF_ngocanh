"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Target,
  Eye,
  Gem,
  Check,
  ChevronRight,
  ChevronLeft,
  Award,
  Users,
  Wrench,
  Cpu,
  Headphones,
  Calendar,
  Car,
  Building2,
  Sparkles,
  MapPin,
  Clock,
  Phone,
  Mail,
  Shield,
  ThumbsUp,
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
  { icon: Award, value: "5+", label: "Năm kinh nghiệm đồng hành cùng VinFast" },
  { icon: Users, value: "10.000+", label: "Khách hàng tin tưởng lựa chọn sản phẩm" },
  { icon: Car, value: "15.000+", label: "Xe điện thông minh đã bàn giao toàn quốc" },
] as const;

const MILESTONES = [
  {
    year: "2019",
    title: "Đặt Nền Móng Khởi Đầu",
    desc: "Thành lập VF Ngọc Anh, chính thức bắt tay cùng VinFast trên hành trình khai phá thị trường xe điện Việt Nam đầy tiềm năng.",
    image: IMAGES.showroom,
  },
  {
    year: "2020",
    title: "Đạt chuẩn Đại Lý Ủy Quyền 3S",
    desc: "Chính thức được VinFast công nhận là đại lý ủy quyền 3S tiêu chuẩn toàn cầu, bao gồm Bán hàng, Dịch vụ và Phụ tùng chính hãng.",
    image: IMAGES.community,
  },
  {
    year: "2021",
    title: "Mở Rộng Hệ Thống Trạm Sạc",
    desc: "Phối hợp cùng hãng đầu tư mở rộng hạ tầng mạng lưới trạm sạc công suất cao quanh khu vực, tăng khả năng tiếp cận cho khách hàng.",
    image: IMAGES.chargingStations,
  },
  {
    year: "2022 - 2023",
    title: "Tăng Trưởng Bứt Phá Doanh Số",
    desc: "Nằm trong TOP các đại lý có doanh số bàn giao xe điện (VF e34, VF 8, VF 9) dẫn đầu miền Bắc, được khách hàng tin yêu tuyệt đối.",
    image: IMAGES.vfMpv7,
  },
  {
    year: "2024 - Nay",
    title: "Vững Bước Kỷ Nguyên Di Chuyển Xanh",
    desc: "Hoàn thiện hệ sinh thái xanh toàn diện gồm xe ô tô điện, xe máy điện, bộ sạc treo tường thông minh tại nhà và giải pháp lưu trữ ESS.",
    image: IMAGES.vf9Suv,
  },
] as const;

const WHY_CHOOSE = [
  {
    icon: Award,
    title: "Đại lý ủy quyền 3S chính thức của VinFast",
    desc: "Đảm bảo phân phối xe ô tô điện, xe máy điện, phụ tùng và tháp pin lưu trữ ESS chính hãng 100%, bảo hành chuẩn mực toàn cầu.",
  },
  {
    icon: Users,
    title: "Đội ngũ cố vấn và kỹ thuật viên cao cấp",
    desc: "Nhân viên được đào tạo khắt khe theo giáo trình chuẩn hóa từ chuyên gia công nghệ quốc tế của VinFast, am hiểu kỹ thuật chuyên sâu.",
  },
  {
    icon: Wrench,
    title: "Dịch vụ hậu mãi 3S khép kín hoàn hảo",
    desc: "Hệ thống xưởng dịch vụ quy mô lớn, đầu tư cầu nâng và thiết bị chẩn đoán điện tử thế hệ mới, hỗ trợ bảo dưỡng sạc pin khẩn cấp 24/7.",
  },
  {
    icon: Cpu,
    title: "Hạ tầng Showroom & Công nghệ hiện đại",
    desc: "Không gian trưng bày đạt chuẩn nhận diện 3S mới của VinFast, nâng cao trải nghiệm mua sắm số hóa trực quan cho khách hàng.",
  },
  {
    icon: Headphones,
    title: "Chăm sóc khách hàng trọn vòng đời xe",
    desc: "Cam kết đồng hành trọn vẹn từ khâu lái thử, hỗ trợ thủ tục trả góp 0%, làm hồ sơ đăng ký ra biển đến bảo dưỡng định kỳ lâu dài.",
  },
] as const;

const CORE_VALUES = [
  "Khách hàng là trọng tâm cốt lõi",
  "Chính trực - Trung thực - Minh bạch chi phí",
  "Chuyên nghiệp - Đẳng cấp chuẩn quốc tế",
  "Đổi mới sáng tạo - Làm chủ công nghệ",
  "Kiên định đồng hành xây dựng tương lai xanh",
] as const;

const sectionHeading =
  "text-center text-xl font-black leading-tight tracking-tight text-brand-dark sm:text-2xl md:text-3xl lg:text-4xl";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased font-sans">
      <Header />

      <main>
        {/* Navigation path */}
        <BreadcrumbBar />

        {/* Hero Section Banner */}
        <HeroSection />

        {/* Mission, Vision & Core values cards */}
        <MissionSection />

        {/* Detailed Timeline Slider */}
        <TimelineSection />

        {/* Why choose showroom VF Ngoc Anh */}
        <WhyChooseSection />

        {/* Action call to register test drive or contact */}
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
                Về showroom VF Ngọc Anh
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="page-hero relative flex items-center overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0">
        <img
          src={IMAGES.showroom}
          alt="Showroom VF Ngọc Anh"
          className="h-full w-full object-cover opacity-80 filter blur-[1px]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/60 lg:bg-gradient-to-r lg:from-black/80 lg:via-black/40 lg:to-transparent" />
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
              <Sparkles className="size-3.5 text-accent-yellow animate-pulse" /> ĐẠI LÝ ỦY QUYỀN
              CHÍNH THỨC VINFAST
            </div>
            <h1 className="mt-4 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
              SHOWROOM VF NGỌC ANH <br />
              <span className="bg-gradient-to-r from-brand via-blue-400 to-emerald-400 bg-clip-text text-transparent italic">
                ĐỒNG HÀNH CÙNG TƯƠNG LAI XANH
              </span>
            </h1>
            <p className="mt-4 text-xs md:text-sm leading-relaxed text-slate-300 font-medium">
              Tọa lạc tại vị trí đắc địa Long Biên, VF Ngọc Anh tự hào là mảnh ghép chiến lược trong
              mạng lưới đại lý 3S ủy quyền chính thức của VinFast Việt Nam. Chúng tôi cam kết mang
              tới cho hàng vạn gia đình Việt những chiếc ô tô điện, xe máy điện thông minh đỉnh cao
              đi kèm dịch vụ bảo dưỡng, phụ tùng chính hãng vượt trội.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/oto"
                className="bg-brand hover:bg-blue-600 text-white font-extrabold text-xs tracking-wider px-6 py-3.5 rounded-xl shadow-lg transition-all flex items-center gap-1.5 uppercase"
              >
                Khám phá dòng xe <ChevronRight className="size-4" />
              </Link>
              <a
                href="tel:1900232389"
                className="bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs tracking-wider px-6 py-3.5 rounded-xl transition-all flex items-center gap-2 border border-white/10"
              >
                <Phone className="size-4 text-accent-yellow" /> ĐƯỜNG DÂY NÓNG: 1900 2323 89
              </a>
            </div>

            {/* Real stats figures */}
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

function MissionSection() {
  return (
    <section className="bg-slate-50 section-y border-b border-slate-200/60">
      <div className="container-vf">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <span className="text-brand font-extrabold text-xs tracking-widest uppercase">
            Kim chỉ nam hoạt động
          </span>
          <h2 className={sectionHeading + " mt-2"}>SỨ MỆNH - TẦM NHÌN - GIÁ TRỊ CỐT LÕI</h2>
          <div className="h-1 w-16 bg-brand mx-auto mt-4 rounded" />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Mission card */}
          <div className="flex flex-col items-center text-center rounded-2xl border border-slate-200 bg-white p-8 shadow-soft transition-all duration-300 hover:shadow-card hover:-translate-y-1 group">
            <div className="flex size-14 items-center justify-center rounded-xl border border-brand/20 bg-brand/5 text-brand group-hover:bg-brand group-hover:text-white transition-all duration-300 shadow-sm">
              <Target className="size-7" strokeWidth={1.5} />
            </div>
            <h3 className="mt-6 text-xs font-black tracking-widest text-brand-dark uppercase">
              SỨ MỆNH CỐT LÕI
            </h3>
            <p className="mt-4 text-xs leading-relaxed text-slate-400 font-semibold">
              Xây dựng chiếc cầu nối vững chắc đưa các giải pháp di chuyển xanh, xe điện thông minh
              thân thiện môi trường của VinFast tới tay mỗi người dân Việt Nam, kiến tạo lối sống
              văn minh, bền vững.
            </p>
          </div>

          {/* Vision card */}
          <div className="flex flex-col items-center text-center rounded-2xl border border-slate-200 bg-white p-8 shadow-soft transition-all duration-300 hover:shadow-card hover:-translate-y-1 group">
            <div className="flex size-14 items-center justify-center rounded-xl border border-brand/20 bg-brand/5 text-brand group-hover:bg-brand group-hover:text-white transition-all duration-300 shadow-sm">
              <Eye className="size-7" strokeWidth={1.5} />
            </div>
            <h3 className="mt-6 text-xs font-black tracking-widest text-brand-dark uppercase">
              TẦM NHÌN CHIẾN LƯỢC
            </h3>
            <p className="mt-4 text-xs leading-relaxed text-slate-400 font-semibold">
              Trở thành biểu tượng showroom 3S dẫn đầu cả nước về quy mô doanh số lẫn chỉ số hài
              lòng của khách hàng (CSI), là địa chỉ tin cậy hàng đầu khi nhắc đến thương hiệu xe
              điện VinFast.
            </p>
          </div>

          {/* Core Values card */}
          <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-8 shadow-soft transition-all duration-300 hover:shadow-card hover:-translate-y-1 group">
            <div className="flex size-14 items-center justify-center rounded-xl border border-brand/20 bg-brand/5 text-brand group-hover:bg-brand group-hover:text-white transition-all duration-300 shadow-sm">
              <Gem className="size-7" strokeWidth={1.5} />
            </div>
            <h3 className="mt-6 text-xs font-black tracking-widest text-brand-dark uppercase text-center">
              GIÁ TRỊ CỐT LÕI
            </h3>
            <ul className="mt-5 space-y-3.5 w-full border-t border-slate-100 pt-4">
              {CORE_VALUES.map((v) => (
                <li
                  key={v}
                  className="flex items-center gap-2.5 text-[11px] text-slate-500 font-bold"
                >
                  <Check size={14} className="shrink-0 text-brand" strokeWidth={3} />
                  <span>{v}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function TimelineSection() {
  const scrollBy = (dir: "prev" | "next") => {
    const el = document.getElementById("about-timeline");
    if (!el) return;
    const amount = el.clientWidth * 0.85;
    el.scrollBy({ left: dir === "next" ? amount : -amount, behavior: "smooth" });
  };

  return (
    <section className="bg-white section-y overflow-hidden border-b border-slate-200/60">
      <div className="container-vf">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <span className="text-brand font-extrabold text-xs tracking-widest uppercase">
            Lịch sử vàng son
          </span>
          <h2 className={sectionHeading + " mt-2"}>HÀNH TRÌNH PHÁT TRIỂN CHÓI SÁNG</h2>
          <div className="h-1 w-16 bg-brand mx-auto mt-4 rounded" />
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="absolute top-[18px] right-8 left-8 hidden h-[2px] bg-slate-200 lg:block" />

          <div
            id="about-timeline"
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 lg:grid lg:grid-cols-5 lg:gap-5 lg:overflow-visible lg:pb-0 scrollbar-none"
          >
            {MILESTONES.map((m) => (
              <div key={m.year} className="w-[85%] shrink-0 snap-center sm:w-[48%] lg:w-full">
                <div className="relative flex flex-col items-center">
                  {/* Timeline Dot */}
                  <div className="relative z-10 mb-4 flex size-9 items-center justify-center rounded-full border border-brand bg-white shadow-sm">
                    <div className="size-2.5 rounded-full bg-brand" />
                  </div>

                  {/* Card Content */}
                  <div className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-soft flex flex-col items-center text-center h-full transition-shadow duration-300 hover:shadow-md">
                    <span className="text-sm font-black text-brand tracking-wider">{m.year}</span>
                    <h3 className="mt-1 text-xs font-black text-brand-dark uppercase tracking-wide min-h-[32px] flex items-center justify-center">
                      {m.title}
                    </h3>
                    <p className="mt-2.5 min-h-[55px] text-[11px] leading-relaxed text-slate-400 font-semibold">
                      {m.desc}
                    </p>
                    <div className="mt-4 w-full overflow-hidden rounded-xl aspect-[16/10] border border-slate-200 bg-white">
                      <img
                        src={m.image}
                        alt={m.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons for Mobile/Tablet */}
          <button
            type="button"
            onClick={() => scrollBy("prev")}
            className="absolute top-1/2 -left-2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-brand-dark shadow-md border border-slate-200 transition hover:text-brand lg:hidden"
            aria-label="Mốc trước"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => scrollBy("next")}
            className="absolute top-1/2 -right-2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-brand-dark shadow-md border border-slate-200 transition hover:text-brand lg:-right-4 lg:hidden"
            aria-label="Mốc tiếp"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}

function WhyChooseSection() {
  return (
    <section className="bg-slate-50 section-y">
      <div className="container-vf">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <span className="text-brand font-extrabold text-xs tracking-widest uppercase">
            Trải nghiệm khác biệt
          </span>
          <h2 className={sectionHeading + " mt-2"}>VÌ SAO LỰA CHỌN VF NGỌC ANH?</h2>
          <div className="h-1 w-16 bg-brand mx-auto mt-4 rounded" />
        </div>

        <div className="mt-10 grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="relative flex items-center justify-center overflow-hidden rounded-2xl bg-slate-100 aspect-[4/3] w-full border border-slate-200 shadow-soft group">
            {/* Dynamic diagonal blue background overlay */}
            <div className="absolute inset-0 bg-brand-dark/5 group-hover:bg-brand-dark/15 transition-all duration-300 pointer-events-none z-10" />
            <img
              src={IMAGES.vf9Suv}
              alt="VinFast SUV"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>
          <ul className="space-y-6">
            {WHY_CHOOSE.map(({ icon: Icon, title, desc }) => (
              <li
                key={title}
                className="flex gap-4 items-start bg-white p-5 rounded-2xl border border-slate-200 shadow-soft"
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
        </div>
      </div>
    </section>
  );
}

function CtaBanner() {
  return (
    <section className="relative overflow-hidden bg-brand-dark section-y text-white">
      {/* Background neon effect overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,87,255,0.15),transparent)] pointer-events-none" />

      <div className="container-vf relative z-10 text-center lg:text-left">
        <div className="grid items-center gap-8 lg:grid-cols-12">
          <div className="text-white lg:col-span-7">
            <h2 className="text-2xl font-black leading-tight tracking-tight sm:text-3xl md:text-4xl uppercase text-white">
              SẴN SÀNG TRẢI NGHIỆM
              <span className="block mt-1 text-brand">KỶ NGUYÊN DI CHUYỂN XANH?</span>
            </h2>
            <p className="mt-4 max-w-xl text-xs md:text-sm leading-relaxed text-slate-300 font-medium mx-auto lg:mx-0">
              Hãy đăng ký lái thử trực tuyến ngay hôm nay để trực tiếp cảm nhận sức mạnh, sự êm ái
              và các công nghệ ADAS tự lái thông minh tiên phong từ các dòng ô tô điện VinFast thế
              hệ mới.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <Link
                href="/oto"
                className="inline-flex items-center gap-2 rounded-xl bg-brand hover:bg-blue-600 px-6 py-3.5 text-xs font-black tracking-wider text-white shadow-md transition-all uppercase"
              >
                Khám phá dòng xe <ChevronRight className="size-4" />
              </Link>
              <a
                href="tel:1900232389"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 text-xs font-black tracking-wider text-white transition-all hover:bg-white/20"
              >
                <Phone className="size-4 text-accent-yellow" /> GỌI 1900 2323 89
              </a>
            </div>
          </div>
          <div className="hidden justify-end lg:flex lg:col-span-5">
            <img
              src={IMAGES.vfMpv7}
              alt="Dòng xe VinFast"
              className="max-h-[220px] w-auto object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.4)]"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
