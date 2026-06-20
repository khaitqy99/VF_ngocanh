"use client";

import Link from "next/link";
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
  { icon: Users, value: "10.000+", label: "Khách hàng tin tưởng lựa chọn" },
  { icon: Car, value: "15.000+", label: "Xe đã bàn giao trên toàn quốc" },
] as const;

const MILESTONES = [
  {
    year: "2019",
    title: "Khởi đầu",
    desc: "Thành lập công ty, bắt đầu hành trình cùng thương hiệu VinFast.",
    image: IMAGES.showroom,
  },
  {
    year: "2020",
    title: "Trở thành đại lý",
    desc: "Chính thức trở thành đại lý ủy quyền của VinFast.",
    image: IMAGES.community,
  },
  {
    year: "2021",
    title: "Mở rộng hệ thống",
    desc: "Khai trương thêm nhiều showroom và xưởng dịch vụ trên toàn quốc.",
    image: IMAGES.chargingStations,
  },
  {
    year: "2022 - 2023",
    title: "Tăng trưởng bứt phá",
    desc: "Doanh số tăng trưởng ấn tượng, mở rộng hệ sinh thái sản phẩm và dịch vụ.",
    image: IMAGES.vfMpv7,
  },
  {
    year: "2024 - Nay",
    title: "Vững bước tương lai",
    desc: "Không ngừng nâng cao chất lượng dịch vụ, đồng hành cùng tương lai xanh.",
    image: IMAGES.vf9Suv,
  },
] as const;

const WHY_CHOOSE = [
  {
    icon: Award,
    title: "Đại lý ủy quyền chính thức",
    desc: "Cam kết sản phẩm chính hãng, giá tốt, chính sách minh bạch.",
  },
  {
    icon: Users,
    title: "Đội ngũ chuyên nghiệp",
    desc: "Nhân viên được đào tạo bài bản, tận tâm và giàu kinh nghiệm.",
  },
  {
    icon: Wrench,
    title: "Dịch vụ toàn diện",
    desc: "Cung cấp đầy đủ từ tư vấn, bán hàng đến hậu mãi và phụ kiện chính hãng.",
  },
  {
    icon: Cpu,
    title: "Công nghệ hiện đại",
    desc: "Hệ thống showroom, xưởng dịch vụ đạt chuẩn VinFast toàn cầu.",
  },
  {
    icon: Headphones,
    title: "Hỗ trợ tận tâm",
    desc: "Luôn đồng hành và hỗ trợ khách hàng 24/7.",
  },
] as const;

const CORE_VALUES = [
  "Khách hàng là trung tâm",
  "Chính trực - Minh bạch",
  "Chất lượng - Chuyên nghiệp",
  "Đổi mới - Sáng tạo",
  "Phát triển bền vững",
] as const;

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <BreadcrumbBar />
        <HeroSection />
        <MissionSection />
        <TimelineSection />
        <WhyChooseSection />
        <CtaBanner />
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  );
}

function BreadcrumbBar() {
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
              <BreadcrumbPage className="text-xs font-medium text-foreground">
                Giới thiệu
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
    <section className="bg-white py-12 md:py-16 lg:py-20 overflow-hidden">
      <div className="container-vf">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="flex flex-col justify-center">
            <p className="text-xs font-bold tracking-[0.15em] text-[#0057ff] uppercase">
              Về chúng tôi
            </p>
            <h1 className="mt-3 text-3xl font-black leading-tight tracking-tight text-brand-dark sm:text-4xl lg:text-[2.75rem]">
              VF NGỌC ANH
              <span className="block mt-1 italic text-[#0057ff]">ĐỒNG HÀNH CÙNG</span>
              <span className="block mt-1 italic text-[#0057ff]">TƯƠNG LAI XANH</span>
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-[15px]">
              VF Ngọc Anh tự hào là đại lý ủy quyền chính thức của VinFast tại Việt Nam, mang đến
              cho khách hàng những sản phẩm ô tô, xe máy điện chất lượng cao cùng dịch vụ chuyên
              nghiệp, tận tâm.
            </p>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {STATS.map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex items-start gap-3.5">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-full border border-[#0057ff]/20 bg-[#0057ff]/5 text-[#0057ff]">
                    <Icon className="size-5.5" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-xl font-black text-[#0057ff]">{value}</p>
                    <p className="text-[11px] leading-snug text-muted-foreground font-medium mt-0.5">
                      {label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative flex justify-end">
            <div className="overflow-hidden rounded-2xl shadow-card w-full lg:max-w-[540px]">
              <img
                src={IMAGES.showroom}
                alt="Showroom VF Ngọc Anh"
                className="aspect-[4/3] h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MissionSection() {
  return (
    <section className="bg-surface py-14 md:py-16 lg:py-20">
      <div className="container-vf">
        <h2 className="text-center text-xl font-black tracking-wide text-brand-dark sm:text-2xl md:text-3xl">
          SỨ MỆNH - TẦM NHÌN - GIÁ TRỊ CỐT LÕI
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="flex flex-col items-center text-center rounded-2xl border border-border/40 bg-white p-8 shadow-soft transition-all duration-300 hover:shadow-card hover:-translate-y-1">
            <div className="flex size-14 items-center justify-center rounded-full border border-[#0057ff]/20 bg-[#0057ff]/5 text-[#0057ff]">
              <Target className="size-7" strokeWidth={1.5} />
            </div>
            <h3 className="mt-6 text-sm font-black tracking-wider text-brand-dark uppercase">
              SỨ MỆNH
            </h3>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground font-medium">
              Mang đến cho khách hàng những sản phẩm và dịch vụ tốt nhất, góp phần thúc đẩy cuộc
              cách mạng di chuyển xanh và bền vững tại Việt Nam.
            </p>
          </div>

          <div className="flex flex-col items-center text-center rounded-2xl border border-border/40 bg-white p-8 shadow-soft transition-all duration-300 hover:shadow-card hover:-translate-y-1">
            <div className="flex size-14 items-center justify-center rounded-full border border-[#0057ff]/20 bg-[#0057ff]/5 text-[#0057ff]">
              <Eye className="size-7" strokeWidth={1.5} />
            </div>
            <h3 className="mt-6 text-sm font-black tracking-wider text-brand-dark uppercase">
              TẦM NHÌN
            </h3>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground font-medium">
              Trở thành đại lý ủy quyền hàng đầu của VinFast, tiên phong trong việc cung cấp các
              giải pháp di chuyển xanh toàn diện và hiện đại.
            </p>
          </div>

          <div className="flex flex-col items-center rounded-2xl border border-border/40 bg-white p-8 shadow-soft transition-all duration-300 hover:shadow-card hover:-translate-y-1">
            <div className="flex size-14 items-center justify-center rounded-full border border-[#0057ff]/20 bg-[#0057ff]/5 text-[#0057ff]">
              <Gem className="size-7" strokeWidth={1.5} />
            </div>
            <h3 className="mt-6 text-sm font-black tracking-wider text-brand-dark uppercase text-center">
              GIÁ TRỊ CỐT LÕI
            </h3>
            <ul className="mt-6 space-y-3 w-fit">
              {CORE_VALUES.map((v) => (
                <li
                  key={v}
                  className="flex items-center gap-2.5 text-xs text-muted-foreground font-medium"
                >
                  <Check size={14} className="shrink-0 text-[#0057ff]" strokeWidth={3} />
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
    <section className="bg-white py-14 md:py-16 lg:py-20 overflow-hidden">
      <div className="container-vf">
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-center text-xl font-black tracking-wide text-brand-dark sm:text-2xl md:text-3xl">
            HÀNH TRÌNH PHÁT TRIỂN
          </h2>
          <div className="mt-2 h-0.5 w-16 bg-[#0057ff]" />
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="absolute top-[18px] right-8 left-8 hidden h-[2px] bg-gray-200 md:block" />

          <div
            id="about-timeline"
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-5 md:gap-5 md:overflow-visible md:pb-0"
          >
            {MILESTONES.map((m) => (
              <div key={m.year} className="w-[85%] shrink-0 snap-center sm:w-[48%] md:w-full">
                <div className="relative flex flex-col items-center">
                  {/* Timeline Dot */}
                  <div className="relative z-10 mb-4 flex size-9 items-center justify-center rounded-full border border-[#0057ff] bg-white">
                    <div className="size-2.5 rounded-full bg-[#0057ff]" />
                  </div>

                  {/* Card Content */}
                  <div className="w-full rounded-2xl border border-border/40 bg-white p-5 shadow-soft flex flex-col items-center text-center h-full transition-shadow duration-300 hover:shadow-md">
                    <span className="text-sm font-black text-[#0057ff]">{m.year}</span>
                    <h3 className="mt-1 text-sm font-bold text-brand-dark">{m.title}</h3>
                    <p className="mt-2 min-h-[44px] text-[11px] leading-relaxed text-muted-foreground font-medium">
                      {m.desc}
                    </p>
                    <div className="mt-4 w-full overflow-hidden rounded-xl">
                      <img
                        src={m.image}
                        alt={m.title}
                        className="aspect-[16/10] w-full object-cover transition-transform duration-500 hover:scale-105"
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
            className="absolute top-1/2 -left-2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-brand-dark shadow-md transition hover:text-brand md:hidden"
            aria-label="Mốc trước"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => scrollBy("next")}
            className="absolute top-1/2 -right-2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-brand-dark shadow-md transition hover:text-brand md:-right-4"
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
    <section className="bg-surface py-14 md:py-16 lg:py-20">
      <div className="container-vf">
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-center text-xl font-black tracking-wide text-brand-dark sm:text-2xl md:text-3xl">
            VÌ SAO CHỌN VF NGỌC ANH?
          </h2>
          <div className="mt-2 h-0.5 w-16 bg-[#0057ff]" />
        </div>

        <div className="mt-10 grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="relative flex items-center justify-center overflow-hidden rounded-2xl bg-white aspect-[4/3] w-full border border-border/40 shadow-soft">
            {/* Dynamic diagonal blue background */}
            <div
              className="absolute inset-0 bg-[#0057ff]"
              style={{ clipPath: "polygon(0 0, 32% 0, 0 100%)" }}
            />
            {/* Floating outline VinFast V logo */}
            <div className="absolute right-[10%] top-[12%] opacity-10 text-brand-dark">
              <svg viewBox="0 0 100 80" className="h-44 w-44" fill="currentColor">
                <path d="M0 0 L36 0 L50 32 L64 0 L100 0 L50 75 Z" />
              </svg>
            </div>
            <img
              src={IMAGES.vf9Suv}
              alt="VinFast SUV"
              className="relative z-10 w-[88%] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.2)] transition-transform duration-500 hover:scale-[1.03]"
              loading="lazy"
            />
          </div>
          <ul className="space-y-6">
            {WHY_CHOOSE.map(({ icon: Icon, title, desc }) => (
              <li key={title} className="flex gap-4 items-start">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-full border border-[#0057ff]/20 bg-[#0057ff]/5 text-[#0057ff]">
                  <Icon className="size-5" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-brand-dark">{title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground font-medium">
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
    <section className="relative overflow-hidden bg-[#071330] py-14 md:py-16 lg:py-20">
      {/* Background neon effect overlay */}
      <div
        className="absolute inset-0 opacity-20 bg-cover bg-center"
        style={{
          backgroundImage: `url(${IMAGES.heroBanner})`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#071330] via-[#071330]/90 to-[#071330]/40" />

      <div className="container-vf relative z-10">
        <div className="grid items-center gap-8 lg:grid-cols-12">
          <div className="text-white lg:col-span-7">
            <h2 className="text-2xl font-black leading-tight tracking-tight sm:text-3xl md:text-4xl uppercase">
              SẴN SÀNG TRẢI NGHIỆM
              <span className="block mt-1 text-[#0057ff]">TƯƠNG LAI DI CHUYỂN XANH?</span>
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-300 font-medium">
              Đăng ký lái thử ngay hôm nay để cảm nhận sự khác biệt từ các dòng xe ô tô và xe máy
              điện VinFast.
            </p>
            <button className="mt-8 rounded-md bg-[#0057ff] px-8 py-3.5 text-xs font-bold tracking-wider text-white shadow-lg shadow-blue-600/20 transition-all duration-300 hover:bg-blue-600 hover:shadow-blue-600/30 hover:scale-105 uppercase">
              ĐĂNG KÝ LÁI THỬ NGAY
            </button>
          </div>
          <div className="hidden justify-end lg:flex lg:col-span-5">
            <img
              src={IMAGES.vfMpv7}
              alt="Dòng xe VinFast"
              className="max-h-[240px] w-auto object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)]"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
