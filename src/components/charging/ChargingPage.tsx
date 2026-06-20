"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Battery,
  BatteryCharging,
  ChevronRight,
  Clock,
  MapPin,
  Shield,
  Smartphone,
  Zap,
  Gauge,
  Leaf,
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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

const HERO_FEATURES = [
  { icon: MapPin, text: "150.000+ cổng sạc", sub: "Phủ sóng 63 tỉnh thành" },
  { icon: Zap, text: "Sạc siêu nhanh DC", sub: "10–70% trong 24 phút" },
  { icon: Shield, text: "Pin LFP an toàn", sub: "Bảo hành lên tới 8 năm" },
] as const;

const sectionHeading =
  "text-center text-lg font-black leading-tight tracking-tight text-balance text-brand-dark sm:text-xl md:text-2xl lg:text-[1.75rem]";

export default function ChargingPage() {
  const [category, setCategory] = useState<ChargingProductCategory | "all">("all");

  const products = useMemo(() => {
    if (category === "all") return CHARGING_PRODUCTS;
    return CHARGING_PRODUCTS.filter((p) => p.category === category);
  }, [category]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <BreadcrumbBar />
        <HeroSection />
        <StatsBar />
        <EcosystemSection />
        <StationTypesSection />
        <BatterySection />
        <ProductsSection category={category} setCategory={setCategory} products={products} />
        <GuideSection />
        <AppSection />
        <WhySection />
        <FaqSection />
        <CtaSection />
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
                Pin và trạm sạc
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
    <section className="relative overflow-hidden bg-[#e8ecf2]">
      <div className="absolute inset-0">
        <img
          src={CHARGING_IMAGES.hero}
          alt="Hệ thống trạm sạc VinFast"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-white/30" />
      </div>
      <div className="container-vf relative z-10 py-10 md:py-14 lg:py-16">
        <p className="text-xs font-bold tracking-[0.15em] text-brand uppercase">Pin & Trạm sạc</p>
        <h1 className="mt-2 max-w-2xl text-2xl font-black leading-tight tracking-tight text-brand-dark sm:text-3xl lg:text-4xl">
          HỆ SINH THÁI SẠC <span className="text-brand">TOÀN DIỆN, THÔNG MINH</span>
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
          VinFast xây dựng mạng lưới trạm sạc lớn nhất Việt Nam cùng công nghệ pin LFP an toàn —
          giúp bạn di chuyển xanh mọi lúc, mọi nơi với sự tiện lợi tối đa.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3 sm:gap-6">
          {HERO_FEATURES.map(({ icon: Icon, text, sub }) => (
            <div key={text} className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-brand/20 bg-white/80">
                <Icon className="size-4 text-brand" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-xs font-bold text-brand-dark">{text}</p>
                <p className="text-[11px] text-muted-foreground">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsBar() {
  return (
    <section className="border-b border-border/40 bg-brand-dark py-8 md:py-10">
      <div className="container-vf">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
          {NETWORK_STATS.map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-black text-white md:text-3xl">{value}</p>
              <p className="mt-1 text-[11px] text-white/70 md:text-xs">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function EcosystemSection() {
  const tiles = [
    {
      img: CHARGING_IMAGES.stations,
      title: "Hệ thống trạm sạc toàn quốc",
      sub: "Phủ sóng 63 tỉnh thành — luôn có trạm sạc gần bạn",
    },
    {
      img: CHARGING_IMAGES.scooter,
      title: "Giải pháp di chuyển xanh",
      sub: "Ô tô, xe máy điện — một hệ sinh thái sạc thống nhất",
    },
  ] as const;

  return (
    <section className="section-y bg-white">
      <div className="container-vf">
        <h2 className={sectionHeading}>HỆ SINH THÁI PIN & SẠC VINFAST</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-muted-foreground">
          Từ trạm sạc công cộng, sạc tại nhà đến thiết bị di động — VinFast mang đến trải nghiệm sạc
          liền mạch cho mọi nhu cầu di chuyển.
        </p>
        <div className="mt-8 grid gap-4 lg:grid-cols-2 lg:gap-5">
          {tiles.map((item) => (
            <div
              key={item.title}
              className="group relative overflow-hidden rounded-xl shadow-soft transition hover:-translate-y-0.5 hover:shadow-card"
            >
              <div className="relative aspect-[21/9] w-full bg-[#e8ecf2] sm:aspect-[2.2/1]">
                <img
                  src={item.img}
                  alt={item.title}
                  className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/5" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5">
                  <h3 className="text-base font-bold md:text-lg">{item.title}</h3>
                  <p className="mt-0.5 text-xs opacity-90 sm:text-sm">{item.sub}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StationTypesSection() {
  return (
    <section className="section-y bg-surface">
      <div className="container-vf">
        <h2 className={sectionHeading}>CÁC LOẠI TRẠM SẠC</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-muted-foreground">
          Lựa chọn hình thức sạc phù hợp với nhu cầu — từ sạc nhanh trên đường dài đến sạc tiện lợi
          tại nhà.
        </p>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {STATION_TYPES.map((station) => (
            <article
              key={station.id}
              className="flex flex-col overflow-hidden rounded-xl border border-border/60 bg-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-card"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[#e8ecf2]">
                <img
                  src={station.image}
                  alt={station.title}
                  className="h-full w-full object-cover transition duration-500 hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-base font-bold text-brand-dark">{station.title}</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand/10 px-2.5 py-0.5 text-[11px] font-semibold text-brand">
                    <Gauge className="size-3" />
                    {station.power}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand-dark/10 px-2.5 py-0.5 text-[11px] font-semibold text-brand-dark">
                    <Clock className="size-3" />
                    {station.time}
                  </span>
                </div>
                <p className="mt-3 flex-1 text-xs leading-relaxed text-muted-foreground">
                  {station.desc}
                </p>
                <ul className="mt-4 space-y-1.5 border-t border-border/40 pt-4">
                  {station.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-[11px] text-foreground/80">
                      <ChevronRight className="mt-0.5 size-3 shrink-0 text-brand" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function BatterySection() {
  return (
    <section className="section-y bg-white">
      <div className="container-vf">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <p className="text-xs font-bold tracking-[0.15em] text-brand uppercase">
              Công nghệ pin
            </p>
            <h2 className="mt-2 text-2xl font-black leading-tight text-brand-dark md:text-3xl">
              PIN LFP — AN TOÀN, BỀN BỈ, QUÃNG ĐƯỜNG DÀI
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              VinFast trang bị pin Lithium Iron Phosphate (LFP) trên các dòng xe điện — công nghệ
              pin được đánh giá cao về độ an toàn, tuổi thọ và hiệu suất trong điều kiện khí hậu
              nhiệt đới.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {BATTERY_HIGHLIGHTS.map(({ title, desc }) => (
                <div key={title} className="rounded-lg border border-border/60 bg-surface p-4">
                  <div className="mb-2 flex size-8 items-center justify-center rounded-lg bg-brand/10">
                    <Battery className="size-4 text-brand" />
                  </div>
                  <h3 className="text-sm font-bold text-brand-dark">{title}</h3>
                  <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative overflow-hidden rounded-xl shadow-card">
            <img
              src={CHARGING_IMAGES.stations}
              alt="Công nghệ pin VinFast"
              className="aspect-[4/3] w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-dark/90 to-transparent p-6">
              <div className="flex items-center gap-3 text-white">
                <BatteryCharging className="size-8 shrink-0" />
                <div>
                  <p className="text-sm font-bold">Bảo hành pin chính hãng</p>
                  <p className="text-xs text-white/80">Lên tới 8 năm hoặc 160.000 km</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductsSection({
  category,
  setCategory,
  products,
}: {
  category: ChargingProductCategory | "all";
  setCategory: (v: ChargingProductCategory | "all") => void;
  products: typeof CHARGING_PRODUCTS;
}) {
  const tabs: { value: ChargingProductCategory | "all"; label: string }[] = [
    { value: "all", label: "Tất cả" },
    ...CATEGORY_OPTIONS,
  ];

  return (
    <section id="san-pham-sac" className="section-y bg-surface">
      <div className="container-vf">
        <h2 className={sectionHeading}>THIẾT BỊ & DỊCH VỤ SẠC</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-muted-foreground">
          Bộ sạc tại nhà, sạc di động và phụ kiện chính hãng — lắp đặt và bảo hành tại VF Ngọc Anh.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {tabs.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setCategory(value)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                category === value
                  ? "bg-brand text-white shadow-sm"
                  : "border border-border bg-white text-foreground/80 hover:border-brand/40 hover:text-brand"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <article
              key={product.id}
              className="flex flex-col overflow-hidden rounded-xl border border-border/60 bg-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-card"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[#e8ecf2]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                {product.badge && (
                  <span className="absolute left-3 top-3 rounded-md bg-brand px-2 py-0.5 text-[10px] font-bold text-white">
                    {product.badge}
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h3 className="text-sm font-bold text-brand-dark">{product.name}</h3>
                <p className="mt-1 flex-1 text-[11px] leading-relaxed text-muted-foreground">
                  {product.description}
                </p>
                <ul className="mt-3 space-y-1">
                  {product.specs.map((spec) => (
                    <li
                      key={spec}
                      className="flex items-center gap-1.5 text-[10px] text-foreground/70"
                    >
                      <span className="size-1 shrink-0 rounded-full bg-brand" />
                      {spec}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-sm font-bold text-brand">{formatPrice(product.price)}</p>
                <button
                  type="button"
                  className="mt-3 w-full rounded-md border border-brand/30 py-2 text-xs font-semibold text-brand transition hover:bg-brand hover:text-white"
                >
                  Tư vấn & đặt mua
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function GuideSection() {
  return (
    <section className="section-y bg-white">
      <div className="container-vf">
        <h2 className={sectionHeading}>HƯỚNG DẪN SẠC XE ĐIỆN</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-muted-foreground">
          4 bước đơn giản để sạc xe VinFast tại trạm công cộng — nhanh chóng, tiện lợi và an toàn.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CHARGING_STEPS.map(({ step, title, desc }) => (
            <div
              key={step}
              className="relative rounded-xl border border-border/60 bg-surface p-5 shadow-soft"
            >
              <span className="text-3xl font-black text-brand/20">{step}</span>
              <h3 className="mt-2 text-sm font-bold text-brand-dark">{title}</h3>
              <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AppSection() {
  return (
    <section className="section-y bg-brand-dark">
      <div className="container-vf">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="text-white">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">
              <Smartphone className="size-3.5" />
              App VinFast
            </div>
            <h2 className="text-2xl font-black leading-tight md:text-3xl">
              QUẢN LÝ PIN & TRẠM SẠC TRÊN ĐIỆN THOẠI
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/75">
              Tìm trạm sạc gần nhất, đặt lịch sạc, theo dõi tiến trình và thanh toán — tất cả trong
              một ứng dụng. App VinFast còn hỗ trợ giám sát trạng thái pin, lịch sử sạc và cảnh báo
              bảo dưỡng.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Bản đồ trạm sạc realtime — trạng thái cổng, công suất, giá",
                "Đặt lịch sạc trước — không lo hết chỗ",
                "Theo dõi % pin và thời gian sạc còn lại",
                "Thanh toán tự động qua ví VinFast",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-xs text-white/85">
                  <ChevronRight className="mt-0.5 size-3.5 shrink-0 text-accent-yellow" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative overflow-hidden rounded-xl shadow-card">
            <img
              src={CHARGING_IMAGES.promoApp}
              alt="App VinFast quản lý sạc"
              className="aspect-[4/3] w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function WhySection() {
  const icons = [MapPin, Zap, Leaf, Headphones] as const;

  return (
    <section className="section-y bg-surface">
      <div className="container-vf">
        <h2 className={sectionHeading}>VÌ SAO CHỌN HỆ SINH THÁI SẠC VINFAST</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {WHY_CHARGING.map(({ title, desc }, i) => {
            const Icon = icons[i] ?? Zap;
            return (
              <div
                key={title}
                className="rounded-xl border border-border/60 bg-white p-5 text-center shadow-soft"
              >
                <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-brand/10">
                  <Icon className="size-5 text-brand" strokeWidth={1.5} />
                </div>
                <h3 className="text-sm font-bold text-brand-dark">{title}</h3>
                <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">{desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section className="section-y bg-white">
      <div className="container-vf max-w-3xl">
        <h2 className={sectionHeading}>CÂU HỎI THƯỜNG GẶP</h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-sm text-muted-foreground">
          Giải đáp thắc mắc phổ biến về pin, trạm sạc và dịch vụ sạc tại VF Ngọc Anh.
        </p>
        <Accordion type="single" collapsible className="mt-8">
          {CHARGING_FAQ.map(({ q, a }, i) => (
            <AccordionItem key={q} value={`faq-${i}`}>
              <AccordionTrigger className="text-left text-sm font-semibold text-brand-dark hover:no-underline">
                {q}
              </AccordionTrigger>
              <AccordionContent className="text-xs leading-relaxed text-muted-foreground">
                {a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="border-t border-border/40 bg-gradient-to-br from-[#f0f3f8] via-white to-[#f6f8fb] py-12 md:py-16">
      <div className="container-vf text-center">
        <h2 className="text-xl font-black text-brand-dark md:text-2xl">
          Cần tư vấn pin, trạm sạc hoặc lắp đặt tại nhà?
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
          Đội ngũ VF Ngọc Anh sẵn sàng hỗ trợ khảo sát, báo giá và lắp đặt bộ sạc chính hãng — liên
          hệ ngay hôm nay.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <a
            href="tel:1900232389"
            className="inline-flex items-center gap-2 rounded-md bg-brand px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0046cc]"
          >
            <Headphones className="size-4" />
            Hotline 1900 2323 89
          </a>
          <Link
            href="/gioi-thieu"
            className="inline-flex items-center gap-2 rounded-md border border-brand/30 px-6 py-3 text-sm font-semibold text-brand transition hover:bg-brand/5"
          >
            Tìm showroom gần bạn
            <ChevronRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
