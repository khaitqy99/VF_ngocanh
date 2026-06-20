"use client";

import Link from "next/link";
import { useState } from "react";
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
import {
  ENERGY_STATS,
  ENERGY_SOLUTIONS,
  ENERGY_BENEFITS,
  ENERGY_APPLICATIONS,
  ENERGY_SPECS,
  INSTALLATION_STEPS,
  ENERGY_FAQS,
} from "@/lib/energy-storage";

const SOLUTION_ICONS = {
  residential: Home,
  commercial: Building2,
  industrial: Factory,
} as const;

const BENEFIT_ICONS = [BarChart3, Leaf, Shield, Battery, Zap, Cpu] as const;

const APPLICATION_ICONS = [Sun, Zap, Battery, Shield] as const;

export default function EnergyStoragePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <BreadcrumbBar />
        <HeroSection />
        <IntroSection />
        <SolutionsSection />
        <BenefitsSection />
        <ApplicationsSection />
        <SpecsSection />
        <ProcessSection />
        <WhyChooseSection />
        <FaqSection />
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
                Lưu trữ năng lượng
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
              Lưu trữ năng lượng
            </p>
            <h1 className="mt-3 text-3xl font-black leading-tight tracking-tight text-brand-dark sm:text-4xl lg:text-[2.75rem]">
              NĂNG LƯỢNG
              <span className="block mt-1 italic text-[#0057ff]">THÔNG MINH &</span>
              <span className="block mt-1 italic text-[#0057ff]">BỀN VỮNG</span>
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-[15px]">
              Giải pháp lưu trữ năng lượng VinFast — công nghệ pin LFP tiên tiến, tích hợp hệ sinh
              thái V-Green. Tiết kiệm chi phí, dự phòng điện và hướng tới tương lai xanh cùng VF
              Ngọc Anh.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="tel:1900232389"
                className="inline-flex items-center gap-2 rounded-md bg-[#0057ff] px-6 py-3 text-xs font-bold tracking-wider text-white shadow-lg shadow-blue-600/20 transition-all duration-300 hover:bg-blue-600 hover:scale-105 uppercase"
              >
                <Phone className="size-4" />
                Tư vấn miễn phí
              </a>
              <a
                href="#giai-phap"
                className="inline-flex items-center gap-2 rounded-md border border-brand bg-white px-6 py-3 text-xs font-bold tracking-wider text-brand transition-all duration-300 hover:bg-brand/5 uppercase"
              >
                <Calendar className="size-4" />
                Xem giải pháp
              </a>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {ENERGY_STATS.map(({ value, label }) => (
                <div key={label} className="flex items-start gap-3.5">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-full border border-[#0057ff]/20 bg-[#0057ff]/5 text-[#0057ff]">
                    <Battery className="size-5.5" strokeWidth={1.5} />
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
                src={IMAGES.chargingStations}
                alt="Hệ thống lưu trữ năng lượng VinFast"
                className="aspect-[4/3] h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function IntroSection() {
  return (
    <section className="bg-surface py-14 md:py-16 lg:py-20">
      <div className="container-vf">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="overflow-hidden rounded-2xl shadow-card order-2 lg:order-1">
            <img
              src={IMAGES.herioGreen}
              alt="Năng lượng xanh VinFast"
              className="aspect-[4/3] w-full object-cover transition-transform duration-500 hover:scale-105"
              loading="lazy"
            />
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-xl font-black tracking-wide text-brand-dark sm:text-2xl md:text-3xl">
              LƯU TRỮ NĂNG LƯỢNG LÀ GÌ?
            </h2>
            <div className="mt-2 h-0.5 w-16 bg-[#0057ff]" />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground font-medium">
              Hệ thống lưu trữ năng lượng (ESS — Energy Storage System) là giải pháp pin công nghệ
              cao, cho phép tích lũy điện năng từ lưới điện hoặc nguồn tái tạo (mặt trời, gió) để sử
              dụng khi cần thiết.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground font-medium">
              VinFast áp dụng công nghệ pin LFP — cùng nền tảng công nghệ trên dòng xe điện — mang
              đến giải pháp lưu trữ an toàn, bền vững và tích hợp liền mạch với hệ sinh thái
              V-Green, trạm sạc và xe điện.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Giảm hóa đơn tiền điện bằng cách sử dụng pin ngoài giờ cao điểm",
                "Dự phòng điện khi mất điện lưới, bảo vệ thiết bị quan trọng",
                "Tích hợp điện mặt trời và trạm sạc xe điện tại nhà",
                "Giám sát và quản lý năng lượng thông minh qua ứng dụng",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-xs leading-relaxed text-muted-foreground font-medium"
                >
                  <Check size={14} className="shrink-0 mt-0.5 text-[#0057ff]" strokeWidth={3} />
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
    <section id="giai-phap" className="bg-white py-14 md:py-16 lg:py-20">
      <div className="container-vf">
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-center text-xl font-black tracking-wide text-brand-dark sm:text-2xl md:text-3xl">
            GIẢI PHÁP THEO QUY MÔ
          </h2>
          <div className="mt-2 h-0.5 w-16 bg-[#0057ff]" />
          <p className="mt-4 max-w-2xl text-center text-sm text-muted-foreground font-medium">
            Từ hộ gia đình đến khu công nghiệp — VinFast có giải pháp lưu trữ năng lượng phù hợp mọi
            nhu cầu
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {ENERGY_SOLUTIONS.map(({ id, title, subtitle, capacity, desc, features, idealFor }) => {
            const Icon = SOLUTION_ICONS[id as keyof typeof SOLUTION_ICONS];
            return (
              <div
                key={id}
                className="flex flex-col rounded-2xl border border-border/40 bg-white p-7 shadow-soft transition-all duration-300 hover:shadow-card hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="flex size-12 items-center justify-center rounded-full border border-[#0057ff]/20 bg-[#0057ff]/5 text-[#0057ff]">
                    <Icon className="size-6" strokeWidth={1.5} />
                  </div>
                  <span className="rounded-full border border-[#0057ff]/20 bg-[#0057ff]/5 px-3 py-1 text-[10px] font-bold text-[#0057ff]">
                    {capacity}
                  </span>
                </div>
                <p className="mt-5 text-[10px] font-bold tracking-wider text-[#0057ff] uppercase">
                  {subtitle}
                </p>
                <h3 className="mt-1 text-sm font-black tracking-wide text-brand-dark uppercase">
                  {title}
                </h3>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground font-medium">
                  {desc}
                </p>
                <ul className="mt-5 space-y-2 flex-1">
                  {features.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-xs text-muted-foreground font-medium"
                    >
                      <Check size={13} className="shrink-0 text-[#0057ff]" strokeWidth={3} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 rounded-lg bg-surface px-3.5 py-2.5">
                  <p className="text-[10px] font-bold text-brand-dark">Phù hợp cho:</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground font-medium">{idealFor}</p>
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
    <section className="bg-surface py-14 md:py-16 lg:py-20">
      <div className="container-vf">
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-center text-xl font-black tracking-wide text-brand-dark sm:text-2xl md:text-3xl">
            LỢI ÍCH VƯỢT TRỘI
          </h2>
          <div className="mt-2 h-0.5 w-16 bg-[#0057ff]" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ENERGY_BENEFITS.map(({ title, desc }, index) => {
            const Icon = BENEFIT_ICONS[index];
            return (
              <div
                key={title}
                className="flex gap-4 rounded-2xl border border-border/40 bg-white p-6 shadow-soft transition-all duration-300 hover:shadow-card"
              >
                <div className="flex size-11 shrink-0 items-center justify-center rounded-full border border-[#0057ff]/20 bg-[#0057ff]/5 text-[#0057ff]">
                  <Icon className="size-5" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-brand-dark">{title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground font-medium">
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
    <section className="bg-white py-14 md:py-16 lg:py-20">
      <div className="container-vf">
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-center text-xl font-black tracking-wide text-brand-dark sm:text-2xl md:text-3xl">
            ỨNG DỤNG THỰC TẾ
          </h2>
          <div className="mt-2 h-0.5 w-16 bg-[#0057ff]" />
          <p className="mt-4 max-w-2xl text-center text-sm text-muted-foreground font-medium">
            Đa dạng kịch bản sử dụng trong hệ sinh thái năng lượng xanh VinFast
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {ENERGY_APPLICATIONS.map(({ title, desc, benefits }, index) => {
            const Icon = APPLICATION_ICONS[index];
            return (
              <div
                key={title}
                className="flex flex-col rounded-2xl border border-border/40 bg-white p-7 shadow-soft transition-all duration-300 hover:shadow-card hover:-translate-y-1"
              >
                <div className="flex items-center gap-4">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-[#0057ff]/20 bg-[#0057ff]/5 text-[#0057ff]">
                    <Icon className="size-6" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-sm font-black text-brand-dark uppercase">{title}</h3>
                </div>
                <p className="mt-4 text-xs leading-relaxed text-muted-foreground font-medium">
                  {desc}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {benefits.map((b) => (
                    <span
                      key={b}
                      className="rounded-full border border-[#0057ff]/20 bg-[#0057ff]/5 px-3 py-1 text-[10px] font-semibold text-[#0057ff]"
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
    <section className="bg-surface py-14 md:py-16 lg:py-20">
      <div className="container-vf">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <h2 className="text-xl font-black tracking-wide text-brand-dark sm:text-2xl md:text-3xl">
              THÔNG SỐ KỸ THUẬT
            </h2>
            <div className="mt-2 h-0.5 w-16 bg-[#0057ff]" />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground font-medium">
              Công nghệ pin LFP tiên tiến — tiêu chuẩn an toàn và hiệu suất cao, được VinFast ứng
              dụng trên toàn bộ hệ sinh thái sản phẩm.
            </p>

            <div className="mt-8 rounded-2xl border border-border/40 bg-white overflow-hidden shadow-soft">
              <table className="w-full text-left">
                <tbody>
                  {ENERGY_SPECS.map(({ label, value }, i) => (
                    <tr key={label} className={i % 2 === 0 ? "bg-white" : "bg-surface/60"}>
                      <td className="px-5 py-3.5 text-xs font-semibold text-brand-dark w-[45%]">
                        {label}
                      </td>
                      <td className="px-5 py-3.5 text-xs text-muted-foreground font-medium">
                        {value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-[11px] text-muted-foreground font-medium">
              * Thông số cụ thể có thể khác nhau tùy model và cấu hình. Liên hệ VF Ngọc Anh để nhận
              tài liệu kỹ thuật chi tiết.
            </p>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-2xl shadow-card">
              <img
                src={IMAGES.community}
                alt="Hệ sinh thái năng lượng VinFast"
                className="aspect-[4/3] w-full object-cover transition-transform duration-500 hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 rounded-xl border border-border/40 bg-white p-4 shadow-card sm:-bottom-6 sm:-left-6">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-[#0057ff]/10 text-[#0057ff]">
                  <Recycle className="size-5" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-xs font-black text-brand-dark">Thân thiện môi trường</p>
                  <p className="text-[10px] text-muted-foreground font-medium">
                    Giảm phát thải CO₂
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProcessSection() {
  return (
    <section className="bg-white py-14 md:py-16 lg:py-20 overflow-hidden">
      <div className="container-vf">
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-center text-xl font-black tracking-wide text-brand-dark sm:text-2xl md:text-3xl">
            QUY TRÌNH TRIỂN KHAI
          </h2>
          <div className="mt-2 h-0.5 w-16 bg-[#0057ff]" />
          <p className="mt-4 max-w-2xl text-center text-sm text-muted-foreground font-medium">
            4 bước chuyên nghiệp — từ tư vấn đến vận hành và bảo trì lâu dài
          </p>
        </div>

        <div className="relative">
          <div className="absolute top-[22px] right-8 left-8 hidden h-[2px] bg-gray-200 lg:block" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {INSTALLATION_STEPS.map(({ step, title, desc }) => (
              <div key={step} className="relative flex flex-col items-center text-center">
                <div className="relative z-10 mb-4 flex size-11 items-center justify-center rounded-full border-2 border-[#0057ff] bg-white">
                  <span className="text-xs font-black text-[#0057ff]">{step}</span>
                </div>
                <div className="w-full rounded-2xl border border-border/40 bg-white p-5 shadow-soft h-full transition-shadow duration-300 hover:shadow-md">
                  <h3 className="text-sm font-bold text-brand-dark">{title}</h3>
                  <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground font-medium">
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
      title: "Đại lý ủy quyền chính thức",
      desc: "Sản phẩm và dịch vụ chính hãng VinFast, chính sách minh bạch, bảo hành toàn diện.",
    },
    {
      icon: Users,
      title: "Đội ngũ kỹ thuật chuyên nghiệp",
      desc: "Kỹ sư được đào tạo bài bản, có kinh nghiệm triển khai hệ thống năng lượng quy mô lớn.",
    },
    {
      icon: Cpu,
      title: "Giải pháp tích hợp toàn diện",
      desc: "Kết nối liền mạch pin lưu trữ, điện mặt trời, trạm sạc và xe điện trong một hệ sinh thái.",
    },
    {
      icon: Headphones,
      title: "Hỗ trợ 24/7",
      desc: "Giám sát từ xa, bảo trì định kỳ và hotline kỹ thuật sẵn sàng mọi lúc.",
    },
  ] as const;

  return (
    <section className="bg-surface py-14 md:py-16 lg:py-20">
      <div className="container-vf">
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-center text-xl font-black tracking-wide text-brand-dark sm:text-2xl md:text-3xl">
            VÌ SAO CHỌN VF NGỌC ANH?
          </h2>
          <div className="mt-2 h-0.5 w-16 bg-[#0057ff]" />
        </div>

        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <ul className="space-y-6 order-2 lg:order-1">
            {items.map(({ icon: Icon, title, desc }) => (
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
          <div className="relative flex items-center justify-center overflow-hidden rounded-2xl bg-white aspect-[4/3] w-full border border-border/40 shadow-soft order-1 lg:order-2">
            <div
              className="absolute inset-0 bg-[#0057ff]"
              style={{ clipPath: "polygon(68% 0, 100% 0, 100% 100%, 45% 100%)" }}
            />
            <img
              src={IMAGES.showroom}
              alt="VF Ngọc Anh — Đại lý VinFast"
              className="relative z-10 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
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
    <section className="bg-white py-14 md:py-16 lg:py-20">
      <div className="container-vf max-w-3xl">
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-center text-xl font-black tracking-wide text-brand-dark sm:text-2xl md:text-3xl">
            CÂU HỎI THƯỜNG GẶP
          </h2>
          <div className="mt-2 h-0.5 w-16 bg-[#0057ff]" />
        </div>

        <div className="space-y-3">
          {ENERGY_FAQS.map(({ q, a }, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={q}
                className="rounded-xl border border-border/40 bg-white overflow-hidden shadow-soft"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-surface/50"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-bold text-brand-dark">{q}</span>
                  <ChevronDown
                    className={`size-5 shrink-0 text-[#0057ff] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isOpen && (
                  <div className="border-t border-border/40 px-5 py-4">
                    <p className="text-xs leading-relaxed text-muted-foreground font-medium">{a}</p>
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
    <section className="relative overflow-hidden bg-[#071330] py-14 md:py-16 lg:py-20">
      <div
        className="absolute inset-0 opacity-20 bg-cover bg-center"
        style={{ backgroundImage: `url(${IMAGES.heroBanner})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#071330] via-[#071330]/90 to-[#071330]/40" />

      <div className="container-vf relative z-10">
        <div className="grid items-center gap-8 lg:grid-cols-12">
          <div className="text-white lg:col-span-7">
            <h2 className="text-2xl font-black leading-tight tracking-tight sm:text-3xl md:text-4xl uppercase">
              SẴN SÀNG CHUYỂN ĐỔI
              <span className="block mt-1 text-[#0057ff]">NĂNG LƯỢNG XANH?</span>
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-300 font-medium">
              Liên hệ VF Ngọc Anh ngay hôm nay để được tư vấn miễn phí, khảo sát hiện trường và nhận
              báo giá giải pháp lưu trữ năng lượng phù hợp nhất.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="tel:1900232389"
                className="inline-flex items-center gap-2 rounded-md bg-[#0057ff] px-8 py-3.5 text-xs font-bold tracking-wider text-white shadow-lg shadow-blue-600/20 transition-all duration-300 hover:bg-blue-600 hover:shadow-blue-600/30 hover:scale-105 uppercase"
              >
                <Phone className="size-4" />
                Gọi 1900 2323 89
                <ChevronRight className="size-4" />
              </a>
              <Link
                href="/gioi-thieu"
                className="inline-flex items-center gap-2 rounded-md border border-white/30 bg-white/5 px-8 py-3.5 text-xs font-bold tracking-wider text-white transition-all duration-300 hover:bg-white/10 uppercase"
              >
                Liên hệ showroom
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-6 text-xs text-gray-400 font-medium">
              <span className="flex items-center gap-2">
                <MapPin className="size-4 text-[#0057ff]" />
                Số 123 Nguyễn Văn Linh, Long Biên, Hà Nội
              </span>
              <span className="flex items-center gap-2">
                <Battery className="size-4 text-[#0057ff]" />
                Tư vấn & khảo sát miễn phí
              </span>
            </div>
          </div>
          <div className="hidden justify-end lg:flex lg:col-span-5">
            <img
              src={IMAGES.portableCharger}
              alt="Giải pháp năng lượng VinFast"
              className="max-h-[240px] w-auto rounded-xl object-cover drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)]"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
