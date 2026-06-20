"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Shield,
  MapPin,
  Wallet,
  Users,
  Gauge,
  Zap,
  ChevronDown,
  ChevronLeft,
  RotateCcw,
  Cpu,
  ShieldCheck,
  Leaf,
  ChevronRight,
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
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CAR_IMAGES,
  CARS,
  CARS_PER_PAGE,
  DRIVE_OPTIONS,
  formatPrice,
  PRICE_MAX,
  PRICE_MIN,
  RANGE_OPTIONS,
  SEGMENT_OPTIONS,
  SEAT_OPTIONS,
  type CarSegment,
  type DriveType,
  type RangeBucket,
} from "@/lib/cars";

const HERO_FEATURES = [
  { icon: Shield, text: "Bảo hành chính hãng", sub: "Lên tới 10 năm" },
  { icon: MapPin, text: "Dịch vụ toàn diện", sub: "Mạng lưới rộng khắp" },
  { icon: Wallet, text: "Hỗ trợ tài chính", sub: "Trả góp linh hoạt" },
] as const;

const WHY_VINFAST = [
  {
    icon: Cpu,
    title: "Công nghệ thông minh",
    desc: "Hệ thống ADAS, màn hình cảm ứng và kết nối thông minh trên mọi hành trình.",
  },
  {
    icon: Zap,
    title: "Hiệu suất mạnh mẽ",
    desc: "Động cơ điện mạnh mẽ, tăng tốc nhanh và vận hành êm ái, tiết kiệm năng lượng.",
  },
  {
    icon: ShieldCheck,
    title: "An toàn vượt trội",
    desc: "Đạt chuẩn an toàn quốc tế với hệ thống hỗ trợ lái tiên tiến và khung xe vững chắc.",
  },
  {
    icon: Leaf,
    title: "Thân thiện môi trường",
    desc: "Không khí thải, giảm tiếng ồn và góp phần kiến tạo tương lai di chuyển bền vững.",
  },
] as const;

const sectionHeading =
  "text-center text-lg font-black leading-tight tracking-tight text-balance text-brand-dark sm:text-xl md:text-2xl lg:text-[1.75rem]";

type SortKey = "newest" | "price-asc" | "price-desc";

type Filters = {
  segments: Set<CarSegment | "all">;
  priceRange: [number, number];
  seats: Set<number>;
  ranges: Set<RangeBucket>;
  drives: Set<DriveType>;
};

const defaultFilters = (): Filters => ({
  segments: new Set(["all"]),
  priceRange: [PRICE_MIN, PRICE_MAX],
  seats: new Set(),
  ranges: new Set(),
  drives: new Set(),
});

export default function CarsPage() {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [sort, setSort] = useState<SortKey>("newest");
  const [mobileFilters, setMobileFilters] = useState(false);

  const filteredCars = useMemo(() => {
    let result = CARS.filter((car) => {
      const segmentOk =
        filters.segments.has("all") ||
        filters.segments.size === 0 ||
        filters.segments.has(car.segment);
      const priceOk = car.price >= filters.priceRange[0] && car.price <= filters.priceRange[1];
      const seatsOk = filters.seats.size === 0 || filters.seats.has(car.seats);
      const rangeOk = filters.ranges.size === 0 || filters.ranges.has(car.rangeBucket);
      const driveOk = filters.drives.size === 0 || filters.drives.has(car.drive);
      return segmentOk && priceOk && seatsOk && rangeOk && driveOk;
    });

    if (sort === "price-asc") result = [...result].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") result = [...result].sort((a, b) => b.price - a.price);
    return result;
  }, [filters, sort]);

  const clearFilters = () => setFilters(defaultFilters());

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <BreadcrumbBar />
        <HeroSection />
        <CatalogSection
          filters={filters}
          setFilters={setFilters}
          sort={sort}
          setSort={setSort}
          cars={filteredCars}
          onClear={clearFilters}
          mobileFilters={mobileFilters}
          setMobileFilters={setMobileFilters}
        />
        <PromoBanners />
        <WhyVinFastSection />
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
              <BreadcrumbPage className="text-xs font-medium text-foreground">Ô tô</BreadcrumbPage>
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
        <img src={CAR_IMAGES.hero} alt="Ô tô VinFast" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-white/20" />
      </div>
      <div className="container-vf relative z-10 py-10 md:py-14 lg:py-16">
        <p className="text-xs font-bold tracking-[0.15em] text-brand uppercase">Ô tô VinFast</p>
        <h1 className="mt-2 max-w-xl text-2xl font-black leading-tight tracking-tight text-brand-dark sm:text-3xl lg:text-4xl">
          TƯƠNG LAI DI CHUYỂN <span className="text-brand">THÔNG MINH, BỀN VỮNG</span>
        </h1>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
          Khám phá đa dạng dòng xe điện thông minh của VinFast — từ SUV nhỏ gọn đến SUV cao cấp, đáp
          ứng mọi nhu cầu di chuyển hiện đại.
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

function CatalogSection({
  filters,
  setFilters,
  sort,
  setSort,
  cars,
  onClear,
  mobileFilters,
  setMobileFilters,
}: {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  sort: SortKey;
  setSort: (v: SortKey) => void;
  cars: typeof CARS;
  onClear: () => void;
  mobileFilters: boolean;
  setMobileFilters: (v: boolean) => void;
}) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(cars.length / CARS_PER_PAGE));
  const paginatedCars = cars.slice((page - 1) * CARS_PER_PAGE, page * CARS_PER_PAGE);

  useEffect(() => {
    setPage(1);
  }, [cars]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const goToPage = (next: number) => {
    setPage(next);
    document
      .getElementById("car-catalog-grid")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="bg-surface py-10 md:py-12 lg:py-14">
      <div className="container-vf">
        <button
          type="button"
          onClick={() => setMobileFilters(!mobileFilters)}
          className="mb-4 flex w-full items-center justify-between rounded-lg border border-border bg-white px-4 py-3 text-sm font-semibold text-brand-dark lg:hidden"
        >
          Bộ lọc sản phẩm
          <ChevronDown className={`size-4 transition ${mobileFilters ? "rotate-180" : ""}`} />
        </button>

        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          <aside
            className={`${mobileFilters ? "block" : "hidden"} w-full shrink-0 lg:block lg:w-[240px] lg:self-start`}
          >
            <FilterSidebar filters={filters} setFilters={setFilters} onClear={onClear} />
          </aside>

          <div className="min-w-0 flex-1">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-black tracking-wide text-brand-dark">TẤT CẢ DÒNG XE</h2>
                <p className="text-xs text-muted-foreground">{cars.length} mẫu xe</p>
              </div>
              <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
                <SelectTrigger className="h-9 w-[180px] border-border bg-white text-xs">
                  <SelectValue placeholder="Sắp xếp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Sắp xếp: Mới nhất</SelectItem>
                  <SelectItem value="price-asc">Giá: Thấp đến cao</SelectItem>
                  <SelectItem value="price-desc">Giá: Cao đến thấp</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {cars.length === 0 ? (
              <div className="rounded-xl border border-border bg-white py-16 text-center">
                <p className="text-sm font-medium text-brand-dark">Không tìm thấy mẫu xe phù hợp</p>
                <button
                  type="button"
                  onClick={onClear}
                  className="mt-3 text-xs font-semibold text-brand hover:underline"
                >
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              <div
                id="car-catalog-grid"
                className="grid items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-3"
              >
                {paginatedCars.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            )}

            <CatalogPagination page={page} totalPages={totalPages} onPageChange={goToPage} />
          </div>
        </div>
      </div>
    </section>
  );
}

function FilterSidebar({
  filters,
  setFilters,
  onClear,
}: {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  onClear: () => void;
}) {
  const toggleSegment = (value: CarSegment | "all") => {
    setFilters((prev) => {
      const next = new Set(prev.segments);
      if (value === "all") return { ...prev, segments: new Set(["all"]) };
      next.delete("all");
      if (next.has(value)) next.delete(value);
      else next.add(value);
      if (next.size === 0) next.add("all");
      return { ...prev, segments: next };
    });
  };

  const toggleSet = <T,>(key: "seats" | "ranges" | "drives", value: T) => {
    setFilters((prev) => {
      const next = new Set(prev[key] as Set<T>);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return { ...prev, [key]: next };
    });
  };

  return (
    <div className="rounded-xl border border-border/60 bg-white p-5 shadow-soft lg:sticky lg:top-20 lg:z-10 lg:max-h-[calc(100vh-5.5rem)] lg:overflow-y-auto">
      <h3 className="text-xs font-black tracking-wider text-brand-dark">BỘ LỌC SẢN PHẨM</h3>

      <FilterGroup title="PHÂN KHÚC">
        {SEGMENT_OPTIONS.map(({ value, label }) => (
          <FilterCheck
            key={value}
            id={`seg-${value}`}
            label={label}
            checked={filters.segments.has(value)}
            onChange={() => toggleSegment(value)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="TẦM GIÁ">
        <Slider
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={10_000_000}
          value={filters.priceRange}
          onValueChange={(v) =>
            setFilters((prev) => ({ ...prev, priceRange: v as [number, number] }))
          }
          className="mt-3"
        />
        <div className="mt-3 flex items-center justify-between gap-2 text-[10px] text-muted-foreground">
          <span className="rounded border border-border px-2 py-1">
            {formatPrice(filters.priceRange[0])} đ
          </span>
          <span className="rounded border border-border px-2 py-1">
            {formatPrice(filters.priceRange[1])} đ
          </span>
        </div>
      </FilterGroup>

      <FilterGroup title="SỐ CHỖ NGỒI">
        {SEAT_OPTIONS.map((n) => (
          <FilterCheck
            key={n}
            id={`seat-${n}`}
            label={`${n} chỗ`}
            checked={filters.seats.has(n)}
            onChange={() => toggleSet("seats", n)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="QUÃNG ĐƯỜNG (WLTP)">
        {RANGE_OPTIONS.map(({ value, label }) => (
          <FilterCheck
            key={value}
            id={`range-${value}`}
            label={label}
            checked={filters.ranges.has(value)}
            onChange={() => toggleSet("ranges", value)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="DẪN ĐỘNG">
        {DRIVE_OPTIONS.map(({ value, label }) => (
          <FilterCheck
            key={value}
            id={`drive-${value}`}
            label={label}
            checked={filters.drives.has(value)}
            onChange={() => toggleSet("drives", value)}
          />
        ))}
      </FilterGroup>

      <button
        type="button"
        onClick={onClear}
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-md border border-border py-2.5 text-xs font-semibold text-muted-foreground transition hover:border-brand hover:text-brand"
      >
        <RotateCcw size={13} />
        XÓA BỘ LỌC
      </button>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5 border-t border-border/50 pt-5 first:mt-4 first:border-t-0 first:pt-0">
      <p className="mb-3 text-[10px] font-bold tracking-wider text-brand-dark">{title}</p>
      <div className="space-y-2.5">{children}</div>
    </div>
  );
}

function FilterCheck({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-center gap-2.5">
      <Checkbox id={id} checked={checked} onCheckedChange={onChange} />
      <span className="text-xs text-foreground/85">{label}</span>
    </label>
  );
}

function CatalogPagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const btnBase =
    "inline-flex h-9 min-w-9 items-center justify-center rounded-md border text-xs font-semibold transition disabled:pointer-events-none disabled:opacity-40";
  const btnIdle =
    "border-border bg-white text-brand-dark shadow-sm hover:border-brand hover:text-brand";
  const btnActive = "border-brand bg-brand text-white shadow-sm";

  return (
    <nav aria-label="Phân trang" className="mt-8 flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className={`${btnBase} ${btnIdle} gap-1 px-3`}
      >
        <ChevronLeft size={14} />
        Trước
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onPageChange(p)}
          aria-current={p === page ? "page" : undefined}
          className={`${btnBase} px-3 ${p === page ? btnActive : btnIdle}`}
        >
          {p}
        </button>
      ))}

      <button
        type="button"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className={`${btnBase} ${btnIdle} gap-1 px-3`}
      >
        Sau
        <ChevronRight size={14} />
      </button>
    </nav>
  );
}

function CarCard({ car }: { car: (typeof CARS)[number] }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-border/60 bg-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-card">
      <div className="flex aspect-[4/3] w-full shrink-0 items-center justify-center bg-[#f4f6fa] p-4">
        <img
          src={car.image}
          alt={car.name}
          className="max-h-full max-w-full object-contain"
          loading="lazy"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-base font-black text-brand-dark">{car.name}</h3>
        <p className="mt-0.5 min-h-[34px] text-[11px] leading-snug text-muted-foreground">
          {car.subtitle}
        </p>

        <div className="mt-3 flex min-h-[18px] flex-wrap gap-x-3 gap-y-1 text-[10px] text-muted-foreground">
          <span className="inline-flex items-center gap-1 whitespace-nowrap">
            <Users size={12} className="text-brand" />
            {car.seats} chỗ
          </span>
          <span className="inline-flex items-center gap-1 whitespace-nowrap">
            <Gauge size={12} className="text-brand" />
            {car.range} km
          </span>
          <span className="inline-flex items-center gap-1 whitespace-nowrap">
            <Zap size={12} className="text-brand" />
            {car.power} Hp
          </span>
        </div>

        <p className="mt-3 min-h-[40px] text-sm font-black leading-snug text-brand-dark">
          Giá từ {formatPrice(car.price)} VNĐ
        </p>

        <div className="mt-auto flex gap-2 pt-4">
          <Link
            href={`/oto/${car.id}`}
            className="flex flex-1 items-center justify-center rounded-md border border-brand bg-white py-2 text-[10px] font-semibold tracking-wide text-brand transition hover:bg-brand/5"
          >
            XEM CHI TIẾT
          </Link>
          <button
            type="button"
            className="flex-1 rounded-md bg-brand py-2 text-[10px] font-semibold tracking-wide text-white transition hover:bg-[#0046cc]"
          >
            ĐĂNG KÝ LÁI THỬ
          </button>
        </div>
      </div>
    </article>
  );
}

function PromoBanners() {
  return (
    <section className="bg-white py-10 md:py-12">
      <div className="container-vf grid gap-4 md:grid-cols-2 md:gap-5">
        <div className="relative overflow-hidden rounded-xl shadow-card">
          <img
            src={CAR_IMAGES.promoTestDrive}
            alt="Đăng ký lái thử"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/90 via-brand-dark/75 to-brand-dark/40" />
          <div className="relative z-10 p-6 text-white md:p-8">
            <p className="text-[10px] font-bold tracking-wider text-white/70 uppercase">
              Trải nghiệm xe VinFast
            </p>
            <h3 className="mt-2 text-lg font-black leading-tight md:text-xl">
              ĐĂNG KÝ LÁI THỬ NGAY
            </h3>
            <p className="mt-2 max-w-xs text-xs leading-relaxed text-white/80">
              Trải nghiệm trực tiếp các dòng xe điện VinFast tại showroom VF Ngọc Anh.
            </p>
            <button
              type="button"
              className="mt-5 rounded-md bg-brand px-5 py-2.5 text-[11px] font-semibold tracking-wide text-white hover:bg-[#0046cc]"
            >
              ĐĂNG KÝ LÁI THỬ
            </button>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl border border-brand/10 bg-gradient-to-br from-[#e8f0ff] via-[#f0f5ff] to-white shadow-soft">
          <div className="absolute top-4 right-4 opacity-20">
            <Wallet className="size-24 text-brand" strokeWidth={1} />
          </div>
          <div className="relative z-10 p-6 md:p-8">
            <p className="text-[10px] font-bold tracking-wider text-brand uppercase">
              Ưu đãi hấp dẫn
            </p>
            <h3 className="mt-2 text-lg font-black leading-tight text-brand-dark md:text-xl">
              HỖ TRỢ TÀI CHÍNH LINH HOẠT
            </h3>
            <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <ChevronRight size={14} className="mt-0.5 shrink-0 text-brand" />
                Hỗ trợ vay lên tới 80% giá trị xe
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight size={14} className="mt-0.5 shrink-0 text-brand" />
                Lãi suất ưu đãi từ 5,9%/năm
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight size={14} className="mt-0.5 shrink-0 text-brand" />
                Thủ tục đơn giản, giải ngân nhanh
              </li>
            </ul>
            <button
              type="button"
              className="mt-5 rounded-md border border-brand bg-white px-5 py-2.5 text-[11px] font-semibold tracking-wide text-brand transition hover:bg-brand/5"
            >
              TÌM HIỂU THÊM
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyVinFastSection() {
  return (
    <section className="bg-surface py-14 md:py-16 lg:py-20">
      <div className="container-vf">
        <h2 className={sectionHeading}>VÌ SAO NÊN CHỌN Ô TÔ ĐIỆN VINFAST?</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {WHY_VINFAST.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-xl border border-brand/20 bg-white">
                <Icon className="size-6 text-brand" strokeWidth={1.5} />
              </div>
              <h3 className="mt-4 text-sm font-bold text-brand-dark">{title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
