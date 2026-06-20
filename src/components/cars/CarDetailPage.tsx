"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Gauge,
  Zap,
  Timer,
  Wind,
  BatteryCharging,
  MapPin,
  MessageCircle,
  GitCompareArrows,
  Shield,
  Headphones,
  Wallet,
  Mic,
  Download,
  Smartphone,
  Radar,
  Monitor,
  KeyRound,
  Navigation,
  Settings2,
  Battery,
  Star,
  User,
  ArrowRight,
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
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { type CarDetail, formatPrice, getRelatedCars, type TechFeature } from "@/lib/car-details";

const TABS = [
  { id: "tong-quan", label: "Tổng quan" },
  { id: "ngoai-that", label: "Ngoại thất" },
  { id: "noi-that", label: "Nội thất" },
  { id: "cong-nghe", label: "Công nghệ" },
  { id: "van-hanh", label: "Vận hành" },
  { id: "an-toan", label: "An toàn" },
  { id: "thong-so", label: "Thông số kỹ thuật" },
  { id: "phu-kien", label: "Phụ kiện" },
  { id: "danh-gia", label: "Đánh giá" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const SERVICE_BAR = [
  { icon: Shield, title: "Bảo hành chính hãng", sub: "Lên tới 10 năm" },
  { icon: Headphones, title: "Cứu hộ 24/7", sub: "Hỗ trợ mọi lúc" },
  { icon: MapPin, title: "Mạng lưới rộng", sub: "Showroom toàn quốc" },
  { icon: Wallet, title: "Hỗ trợ tài chính", sub: "Trả góp linh hoạt" },
] as const;

const TECH_ICONS: Record<TechFeature["icon"], React.ElementType> = {
  voice: Mic,
  fota: Download,
  app: Smartphone,
  adas: Radar,
  screen: Monitor,
  keyless: KeyRound,
  nav: Navigation,
  drive: Settings2,
  battery: Battery,
};

type Props = { detail: CarDetail };

export default function CarDetailPage({ detail }: Props) {
  const [activeImage, setActiveImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(
    detail.variants[Math.min(1, detail.variants.length - 1)]?.id ?? detail.variants[0].id,
  );
  const [selectedColor, setSelectedColor] = useState(detail.colors[0]?.id ?? "white");
  const [activeTab, setActiveTab] = useState<TabId>("tong-quan");
  const tabContentRef = useRef<HTMLDivElement>(null);

  const variant = detail.variants.find((v) => v.id === selectedVariant) ?? detail.variants[0];
  const related = getRelatedCars(detail.id);

  const handleTabChange = (id: TabId) => {
    setActiveTab(id);
    tabContentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const prevImage = () => setActiveImage((i) => (i === 0 ? detail.gallery.length - 1 : i - 1));
  const nextImage = () => setActiveImage((i) => (i === detail.gallery.length - 1 ? 0 : i + 1));

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <BreadcrumbBar carName={detail.name} variantName={variant.name} />

        {/* Hero */}
        <section className="border-b border-border/40 bg-white py-8 md:py-10">
          <div className="container-vf">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
              {/* Gallery */}
              <div>
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  {detail.badges.map((badge) => (
                    <span
                      key={badge}
                      className="rounded-full border border-brand/20 bg-brand/5 px-3 py-1 text-[10px] font-semibold text-brand"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
                <h1 className="text-2xl font-black tracking-tight text-brand-dark md:text-3xl">
                  {detail.tagline}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">{detail.slogan}</p>

                <div className="relative mt-5 overflow-hidden rounded-xl bg-[#f4f6fa]">
                  <div className="flex aspect-[16/10] items-center justify-center p-6">
                    <img
                      src={detail.gallery[activeImage]}
                      alt={detail.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={prevImage}
                    className="absolute top-1/2 left-3 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white shadow-sm transition hover:border-brand hover:text-brand"
                    aria-label="Ảnh trước"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={nextImage}
                    className="absolute top-1/2 right-3 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white shadow-sm transition hover:border-brand hover:text-brand"
                    aria-label="Ảnh sau"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>

                <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                  {detail.gallery.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveImage(i)}
                      className={`flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border-2 bg-[#f4f6fa] p-1 transition ${
                        activeImage === i
                          ? "border-brand"
                          : "border-transparent hover:border-border"
                      }`}
                    >
                      <img src={img} alt="" className="max-h-full max-w-full object-contain" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Purchase panel */}
              <div className="lg:pt-8">
                <p className="text-3xl font-black text-brand-dark md:text-4xl">
                  {formatPrice(variant.price)}{" "}
                  <span className="text-lg font-bold text-muted-foreground">VND</span>
                </p>

                <div className="mt-6">
                  <p className="mb-3 text-xs font-bold tracking-wider text-brand-dark">
                    CHỌN PHIÊN BẢN
                  </p>
                  <div className="space-y-2">
                    {detail.variants.map((v) => {
                      const selected = selectedVariant === v.id;
                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => setSelectedVariant(v.id)}
                          className={`flex w-full items-center justify-between rounded-lg border-2 px-4 py-3 text-left transition ${
                            selected
                              ? "border-brand bg-brand/5"
                              : "border-border hover:border-brand/40"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`flex size-5 items-center justify-center rounded-full border-2 ${
                                selected ? "border-brand bg-brand" : "border-border"
                              }`}
                            >
                              {selected && <Check size={12} className="text-white" />}
                            </span>
                            <span className="text-sm font-semibold text-brand-dark">{v.name}</span>
                          </div>
                          <span className="text-xs font-bold text-muted-foreground">
                            {formatPrice(v.price)} VND
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-6">
                  <p className="mb-3 text-xs font-bold tracking-wider text-brand-dark">
                    CHỌN MÀU SẮC
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {detail.colors.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        title={c.name}
                        onClick={() => setSelectedColor(c.id)}
                        className={`size-8 rounded-full border-2 transition ${
                          selectedColor === c.id
                            ? "border-brand ring-2 ring-brand/30"
                            : "border-border hover:border-brand/50"
                        }`}
                        style={{ backgroundColor: c.hex }}
                        aria-label={c.name}
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {detail.colors.find((c) => c.id === selectedColor)?.name}
                  </p>
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    className="flex-1 rounded-md bg-brand py-3.5 text-xs font-bold tracking-wide text-white transition hover:bg-[#0046cc]"
                  >
                    ĐẶT CỌC NGAY
                  </button>
                  <button
                    type="button"
                    className="flex-1 rounded-md border-2 border-brand bg-white py-3.5 text-xs font-bold tracking-wide text-brand transition hover:bg-brand/5"
                  >
                    ĐĂNG KÝ LÁI THỬ
                  </button>
                </div>

                <div className="mt-6 flex flex-wrap gap-4 border-t border-border/50 pt-6">
                  <UtilityLink icon={MapPin} label="Tìm đại lý gần bạn" />
                  <UtilityLink icon={MessageCircle} label="Tư vấn qua Zalo" />
                  <UtilityLink icon={GitCompareArrows} label="So sánh phiên bản" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick specs */}
        <section className="border-b border-border/40 bg-surface py-5">
          <div className="container-vf">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              <SpecItem icon={Gauge} label="Quãng đường" value={`${detail.quickSpecs.range} km`} />
              <SpecItem
                icon={Zap}
                label="Công suất tối đa"
                value={`${detail.quickSpecs.power} kW`}
              />
              <SpecItem icon={Wind} label="Mô-men xoắn" value={`${detail.quickSpecs.torque} Nm`} />
              <SpecItem
                icon={Timer}
                label="Tăng tốc 0–100"
                value={detail.quickSpecs.acceleration}
              />
              <SpecItem
                icon={Gauge}
                label="Tốc độ tối đa"
                value={`${detail.quickSpecs.topSpeed} km/h`}
              />
              <SpecItem
                icon={BatteryCharging}
                label="Sạc nhanh"
                value={detail.quickSpecs.fastCharge}
              />
            </div>
          </div>
        </section>

        {/* Sticky tabs */}
        <div className="sticky top-[72px] z-40 border-b border-border/40 bg-white shadow-sm">
          <div className="container-vf overflow-x-auto">
            <nav className="flex gap-0" aria-label="Mục nội dung" role="tablist">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  aria-controls={`tabpanel-${tab.id}`}
                  onClick={() => handleTabChange(tab.id)}
                  className={`shrink-0 border-b-2 px-4 py-3.5 text-xs font-semibold whitespace-nowrap transition ${
                    activeTab === tab.id
                      ? "border-brand text-brand"
                      : "border-transparent text-muted-foreground hover:text-brand-dark"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab content — chỉ hiện nội dung tab đang chọn */}
        <div
          ref={tabContentRef}
          className="scroll-mt-36 bg-white py-12 md:py-16"
          role="tabpanel"
          id={`tabpanel-${activeTab}`}
          aria-labelledby={activeTab}
        >
          <div className="container-vf">
            <TabContent detail={detail} activeTab={activeTab} />
          </div>
        </div>

        {/* Related products */}
        <section className="border-t border-border/40 bg-surface py-12 md:py-16">
          <div className="container-vf">
            <SectionHeading title="SẢN PHẨM LIÊN QUAN" />
            <Carousel opts={{ align: "start", loop: false }} className="mt-8">
              <CarouselContent className="-ml-4">
                {related.map((car) => (
                  <CarouselItem key={car.id} className="basis-full pl-4 sm:basis-1/2 lg:basis-1/4">
                    <Link
                      href={`/oto/${car.id}`}
                      className="group block overflow-hidden rounded-xl border border-border/60 bg-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-card"
                    >
                      <div className="flex aspect-[4/3] items-center justify-center bg-[#f4f6fa] p-4">
                        <img
                          src={car.image}
                          alt={car.name}
                          className="max-h-full max-w-full object-contain transition group-hover:scale-105"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-sm font-black text-brand-dark">{car.name}</h3>
                        <p className="mt-1 text-xs font-bold text-brand">
                          Giá từ {formatPrice(car.price)} VND
                        </p>
                      </div>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex" />
              <CarouselNext className="hidden sm:flex" />
            </Carousel>
            <div className="mt-8 text-center">
              <Link
                href="/oto"
                className="inline-flex rounded-md border border-brand bg-white px-6 py-2.5 text-xs font-bold tracking-wide text-brand transition hover:bg-brand/5"
              >
                XEM TẤT CẢ XE Ô TÔ
              </Link>
            </div>
          </div>
        </section>

        {/* Service bar */}
        <section className="border-t border-border/40 bg-white py-10">
          <div className="container-vf">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {SERVICE_BAR.map(({ icon: Icon, title, sub }) => (
                <div key={title} className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-brand/20 bg-brand/5">
                    <Icon className="size-5 text-brand" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-brand-dark">{title}</p>
                    <p className="text-[11px] text-muted-foreground">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  );
}

function TabContent({ detail, activeTab }: { detail: CarDetail; activeTab: TabId }) {
  switch (activeTab) {
    case "tong-quan":
      return (
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <h2 className="text-xl font-black text-brand-dark md:text-2xl">
              {detail.overview.title}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">{detail.overview.subtitle}</p>
            <ul className="mt-6 space-y-3">
              {detail.overview.bullets.map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-sm text-foreground/85">
                  <Check size={16} className="mt-0.5 shrink-0 text-brand" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div className="overflow-hidden rounded-xl shadow-card">
            <img
              src={detail.overview.image}
              alt={detail.overview.title}
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        </div>
      );

    case "ngoai-that":
      return (
        <>
          <SectionHeader title="NGOẠI THẤT" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {detail.exterior.map((item) => (
              <FeatureCard key={item.title} {...item} />
            ))}
          </div>
        </>
      );

    case "noi-that":
      return (
        <>
          <SectionHeader title="NỘI THẤT" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {detail.interior.map((item) => (
              <FeatureCard key={item.title} {...item} />
            ))}
          </div>
        </>
      );

    case "cong-nghe":
      return (
        <>
          <SectionHeading title="CÔNG NGHỆ THÔNG MINH VƯỢT TRỘI" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {detail.technology.map((tech) => {
              const Icon = TECH_ICONS[tech.icon];
              return (
                <div
                  key={tech.title}
                  className="rounded-xl border border-border/60 bg-surface p-5 shadow-soft"
                >
                  <div className="flex size-10 items-center justify-center rounded-lg border border-brand/20 bg-brand/5">
                    <Icon className="size-5 text-brand" strokeWidth={1.5} />
                  </div>
                  <h3 className="mt-4 text-sm font-bold text-brand-dark">{tech.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    {tech.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </>
      );

    case "van-hanh":
      return (
        <>
          <SectionHeading title={detail.performance.title} />
          <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-muted-foreground">
            {detail.performance.subtitle}
          </p>
          <div className="mt-8 grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="overflow-hidden rounded-xl shadow-card">
              <img
                src={detail.performance.image}
                alt={detail.performance.title}
                className="aspect-[4/3] w-full bg-[#f4f6fa] object-contain p-6"
              />
            </div>
            <div className="space-y-4">
              {detail.performance.features.map((f) => (
                <div
                  key={f.title}
                  className="rounded-xl border border-border/60 bg-surface p-4 shadow-soft"
                >
                  <h3 className="text-sm font-bold text-brand-dark">{f.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {detail.performance.driveModes.map((mode) => (
              <div
                key={mode.name}
                className="rounded-xl border border-brand/20 bg-brand/5 p-4 text-center"
              >
                <p className="text-sm font-black text-brand">{mode.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{mode.desc}</p>
              </div>
            ))}
          </div>
        </>
      );

    case "an-toan":
      return (
        <>
          <SectionHeading title={detail.safety.title} />
          <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-muted-foreground">
            {detail.safety.subtitle}
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {detail.safety.highlights.map((h) => (
              <span
                key={h}
                className="rounded-full border border-brand/30 bg-brand/5 px-4 py-1.5 text-xs font-semibold text-brand"
              >
                {h}
              </span>
            ))}
          </div>
          <div className="mt-8 grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="grid gap-3 sm:grid-cols-2">
              {detail.safety.features.map((f) => (
                <div
                  key={f.title}
                  className="rounded-xl border border-border/60 bg-surface p-4 shadow-soft"
                >
                  <div className="flex items-start gap-2.5">
                    <Shield className="mt-0.5 size-4 shrink-0 text-brand" strokeWidth={1.5} />
                    <div>
                      <h3 className="text-sm font-bold text-brand-dark">{f.title}</h3>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{f.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="overflow-hidden rounded-xl shadow-card">
              <img
                src={detail.safety.image}
                alt={detail.safety.title}
                className="aspect-[4/3] w-full bg-[#f4f6fa] object-contain p-6"
              />
            </div>
          </div>
        </>
      );

    case "thong-so":
      return (
        <>
          <SectionHeading title="THÔNG SỐ KỸ THUẬT" />
          <div className="mt-8 space-y-6">
            {detail.specGroups.map((group) => (
              <div
                key={group.category}
                className="overflow-hidden rounded-xl border border-border/60 bg-white shadow-soft"
              >
                <div className="border-b border-border/50 bg-surface px-5 py-3">
                  <h3 className="text-sm font-black text-brand-dark">{group.category}</h3>
                </div>
                <div className="divide-y divide-border/40">
                  {group.items.map((item) => (
                    <div
                      key={item.label}
                      className="flex flex-col gap-1 px-5 py-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <span className="text-xs text-muted-foreground">{item.label}</span>
                      <span className="text-xs font-semibold text-brand-dark">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      );

    case "phu-kien":
      return (
        <>
          <SectionHeader title="PHỤ KIỆN CHÍNH HÃNG" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {detail.accessories.map((acc) => (
              <div
                key={acc.name}
                className="card-feature flex flex-col bg-white transition hover:-translate-y-0.5 hover:shadow-card"
              >
                <div className="flex aspect-[16/10] items-center justify-center bg-[#f4f6fa] p-4">
                  <img
                    src={acc.image}
                    alt={acc.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="text-sm font-bold text-brand-dark">{acc.name}</h3>
                  <p className="mt-2 text-sm font-black text-brand">{formatPrice(acc.price)} VND</p>
                  <button
                    type="button"
                    className="mt-auto pt-4 text-xs font-semibold text-brand hover:underline"
                  >
                    Tìm hiểu thêm
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      );

    case "danh-gia":
      return (
        <>
          <SectionHeading title="ĐÁNH GIÁ KHÁCH HÀNG" />
          <div className="mx-auto mt-6 flex max-w-xs flex-col items-center rounded-xl border border-border/60 bg-surface p-6 shadow-soft">
            <p className="text-4xl font-black text-brand-dark">
              {detail.reviews.averageRating.toFixed(1)}
            </p>
            <StarRating rating={detail.reviews.averageRating} size={18} />
            <p className="mt-2 text-xs text-muted-foreground">
              Dựa trên {detail.reviews.totalReviews} đánh giá
            </p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {detail.reviews.items.map((review) => (
              <div
                key={`${review.name}-${review.date}`}
                className="rounded-xl border border-border/60 bg-surface p-5 shadow-soft"
              >
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand/10">
                    <User className="size-5 text-brand" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-bold text-brand-dark">{review.name}</p>
                      <p className="text-[10px] text-muted-foreground">{review.date}</p>
                    </div>
                    {review.variant && <p className="text-[10px] text-brand">{review.variant}</p>}
                    <StarRating rating={review.rating} size={12} className="mt-1" />
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      {review.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      );

    default:
      return null;
  }
}

function BreadcrumbBar({ carName, variantName }: { carName: string; variantName: string }) {
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
              <BreadcrumbLink asChild>
                <Link href="/oto" className="text-xs text-muted-foreground hover:text-brand">
                  Ô tô
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-xs text-muted-foreground">{carName}</BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-xs font-medium text-foreground">
                {variantName}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
}

function SpecItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="text-center">
      <Icon className="mx-auto size-5 text-brand" strokeWidth={1.5} />
      <p className="mt-2 text-[10px] text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-xs font-bold text-brand-dark">{value}</p>
    </div>
  );
}

function UtilityLink({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <button
      type="button"
      className="flex items-center gap-2 text-xs text-muted-foreground transition hover:text-brand"
    >
      <Icon size={14} className="text-brand" />
      {label}
    </button>
  );
}

function SectionHeading({ title }: { title: string }) {
  return (
    <h2 className="text-center text-lg font-black tracking-tight text-brand-dark md:text-xl">
      {title}
    </h2>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <h2 className="text-lg font-black tracking-tight text-brand-dark md:text-xl">{title}</h2>
      <button
        type="button"
        className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-brand hover:gap-1.5"
      >
        Xem tất cả <ArrowRight size={14} />
      </button>
    </div>
  );
}

function StarRating({
  rating,
  size = 14,
  className = "",
}: {
  rating: number;
  size?: number;
  className?: string;
}) {
  return (
    <div className={`flex gap-0.5 ${className}`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={size}
          className={
            i < Math.round(rating) ? "fill-accent-yellow text-accent-yellow" : "text-border"
          }
        />
      ))}
    </div>
  );
}

function FeatureCard({ title, desc, image }: { title: string; desc: string; image: string }) {
  return (
    <div className="card-feature bg-white">
      <div className="flex aspect-[4/3] items-center justify-center bg-[#f4f6fa] p-3">
        <img src={image} alt={title} className="max-h-full max-w-full object-contain" />
      </div>
      <div className="p-4">
        <h3 className="text-sm font-bold text-brand-dark">{title}</h3>
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}
