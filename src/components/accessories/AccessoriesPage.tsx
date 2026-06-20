"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Shield,
  Wrench,
  Package,
  Award,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Phone,
  Check,
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
  ACCESSORIES,
  ACCESSORIES_PER_PAGE,
  ACCESSORY_IMAGES,
  ACCESSORY_PRICE_MAX,
  ACCESSORY_PRICE_MIN,
  CATEGORY_OPTIONS,
  VEHICLE_OPTIONS,
  formatPrice,
  getCategoryLabel,
  getVehicleLabels,
  type AccessoryCategory,
  type AccessoryProduct,
  type VehicleModel,
} from "@/lib/accessories";

const HERO_FEATURES = [
  { icon: Shield, text: "100% chính hãng", sub: "Bảo hành VinFast" },
  { icon: Wrench, text: "Lắp đặt tại showroom", sub: "Kỹ thuật viên chuyên nghiệp" },
  { icon: Package, text: "Giao hàng toàn quốc", sub: "Nhanh chóng, an toàn" },
] as const;

const WHY_OFFICIAL = [
  {
    icon: Award,
    title: "Chất lượng đảm bảo",
    desc: "Phụ kiện chính hãng VinFast, đạt tiêu chuẩn kỹ thuật nghiêm ngặt.",
  },
  {
    icon: Shield,
    title: "Bảo hành rõ ràng",
    desc: "Chính sách bảo hành minh bạch, hỗ trợ đổi trả theo quy định.",
  },
  {
    icon: Wrench,
    title: "Lắp đặt chuyên nghiệp",
    desc: "Đội ngũ kỹ thuật được đào tạo bài bản, lắp đặt đúng quy trình.",
  },
  {
    icon: Sparkles,
    title: "Tương thích hoàn hảo",
    desc: "Thiết kế riêng cho từng dòng xe, đảm bảo vừa khít và an toàn.",
  },
] as const;

const INSTALL_STEPS = [
  {
    step: "01",
    title: "Tư vấn & chọn phụ kiện",
    desc: "Nhân viên tư vấn phụ kiện phù hợp với dòng xe và nhu cầu sử dụng.",
  },
  {
    step: "02",
    title: "Báo giá & đặt hàng",
    desc: "Báo giá minh bạch, hỗ trợ thanh toán linh hoạt tại showroom hoặc online.",
  },
  {
    step: "03",
    title: "Lắp đặt chuyên nghiệp",
    desc: "Kỹ thuật viên lắp đặt tại xưởng dịch vụ theo tiêu chuẩn VinFast.",
  },
  {
    step: "04",
    title: "Bàn giao & bảo hành",
    desc: "Kiểm tra chất lượng, kích hoạt bảo hành và hướng dẫn sử dụng.",
  },
] as const;

const FAQ = [
  {
    q: "Phụ kiện chính hãng có khác gì phụ kiện bên thứ ba?",
    a: "Phụ kiện chính hãng VinFast được thiết kế riêng cho từng dòng xe, đảm bảo tương thích, an toàn và được bảo hành chính thức tại hệ thống đại lý.",
  },
  {
    q: "Tôi có thể lắp đặt phụ kiện khi mua xe mới không?",
    a: "Có. VF Ngọc Anh hỗ trợ lắp đặt phụ kiện ngay khi bàn giao xe hoặc bất cứ lúc nào tại xưởng dịch vụ.",
  },
  {
    q: "Thời gian bảo hành phụ kiện là bao lâu?",
    a: "Tùy loại phụ kiện, thời gian bảo hành từ 6 tháng đến 24 tháng. Chi tiết được in trên phiếu bảo hành kèm theo sản phẩm.",
  },
  {
    q: "Có giao hàng phụ kiện tận nơi không?",
    a: "Có. Chúng tôi hỗ trợ giao hàng toàn quốc. Phụ kiện cần lắp đặt sẽ được lắp tại showroom gần nhất hoặc tại nhà (theo khu vực).",
  },
] as const;

const sectionHeading =
  "text-center text-lg font-black leading-tight tracking-tight text-balance text-brand-dark sm:text-xl md:text-2xl lg:text-[1.75rem]";

type SortKey = "popular" | "price-asc" | "price-desc" | "name";

type Filters = {
  categories: Set<AccessoryCategory>;
  vehicles: Set<VehicleModel>;
  priceRange: [number, number];
  inStockOnly: boolean;
};

const defaultFilters = (): Filters => ({
  categories: new Set(),
  vehicles: new Set(),
  priceRange: [ACCESSORY_PRICE_MIN, ACCESSORY_PRICE_MAX],
  inStockOnly: false,
});

export default function AccessoriesPage() {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [sort, setSort] = useState<SortKey>("popular");
  const [mobileFilters, setMobileFilters] = useState(false);

  const filteredProducts = useMemo(() => {
    let result = ACCESSORIES.filter((item) => {
      const categoryOk = filters.categories.size === 0 || filters.categories.has(item.category);
      const vehicleOk =
        filters.vehicles.size === 0 ||
        item.vehicles.includes("all") ||
        [...filters.vehicles].some((v) => item.vehicles.includes(v));
      const priceOk = item.price >= filters.priceRange[0] && item.price <= filters.priceRange[1];
      const stockOk = !filters.inStockOnly || item.inStock;
      return categoryOk && vehicleOk && priceOk && stockOk;
    });

    if (sort === "price-asc") result = [...result].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") result = [...result].sort((a, b) => b.price - a.price);
    if (sort === "name") result = [...result].sort((a, b) => a.name.localeCompare(b.name, "vi"));
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
          products={filteredProducts}
          onClear={clearFilters}
          mobileFilters={mobileFilters}
          setMobileFilters={setMobileFilters}
        />
        <InstallProcessSection />
        <PromoBanners />
        <WhyOfficialSection />
        <FaqSection />
        <ContactCta />
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
                Phụ kiện xe
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
          src={ACCESSORY_IMAGES.hero}
          alt="Phụ kiện chính hãng VinFast"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-white/30" />
      </div>
      <div className="container-vf relative z-10 py-10 md:py-14 lg:py-16">
        <p className="text-xs font-bold tracking-[0.15em] text-brand uppercase">
          Phụ kiện chính hãng
        </p>
        <h1 className="mt-2 max-w-xl text-2xl font-black leading-tight tracking-tight text-brand-dark sm:text-3xl lg:text-4xl">
          NÂNG TẦM TRẢI NGHIỆM <span className="text-brand">CÙNG VINFAST</span>
        </h1>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
          Khám phá bộ sưu tập phụ kiện chính hãng VinFast — từ nội thất cao cấp, thiết bị sạc đến
          giải pháp an toàn, giúp xe của bạn hoàn thiện và tiện nghi hơn.
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
  products,
  onClear,
  mobileFilters,
  setMobileFilters,
}: {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  sort: SortKey;
  setSort: (v: SortKey) => void;
  products: AccessoryProduct[];
  onClear: () => void;
  mobileFilters: boolean;
  setMobileFilters: (v: boolean) => void;
}) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(products.length / ACCESSORIES_PER_PAGE));
  const paginatedProducts = products.slice(
    (page - 1) * ACCESSORIES_PER_PAGE,
    page * ACCESSORIES_PER_PAGE,
  );

  useEffect(() => {
    setPage(1);
  }, [products]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const goToPage = (next: number) => {
    setPage(next);
    document
      .getElementById("accessory-catalog-grid")
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
                <h2 className="text-sm font-black tracking-wide text-brand-dark">
                  TẤT CẢ PHỤ KIỆN
                </h2>
                <p className="text-xs text-muted-foreground">{products.length} sản phẩm</p>
              </div>
              <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
                <SelectTrigger className="h-9 w-[180px] border-border bg-white text-xs">
                  <SelectValue placeholder="Sắp xếp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Phổ biến nhất</SelectItem>
                  <SelectItem value="price-asc">Giá thấp → cao</SelectItem>
                  <SelectItem value="price-desc">Giá cao → thấp</SelectItem>
                  <SelectItem value="name">Tên A → Z</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {products.length === 0 ? (
              <div className="rounded-xl border border-border/60 bg-white p-10 text-center shadow-soft">
                <p className="text-sm font-semibold text-brand-dark">
                  Không tìm thấy phụ kiện phù hợp
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Thử điều chỉnh bộ lọc hoặc xóa bộ lọc để xem thêm sản phẩm.
                </p>
                <button
                  type="button"
                  onClick={onClear}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-md border border-brand px-4 py-2 text-xs font-semibold text-brand hover:bg-brand/5"
                >
                  <RotateCcw size={14} />
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              <>
                <div
                  id="accessory-catalog-grid"
                  className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
                >
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                {totalPages > 1 && (
                  <Pagination page={page} totalPages={totalPages} onPageChange={goToPage} />
                )}
              </>
            )}
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
  const toggleCategory = (value: AccessoryCategory) => {
    setFilters((prev) => {
      const next = new Set(prev.categories);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return { ...prev, categories: next };
    });
  };

  const toggleVehicle = (value: VehicleModel) => {
    if (value === "all") return;
    setFilters((prev) => {
      const next = new Set(prev.vehicles);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return { ...prev, vehicles: next };
    });
  };

  return (
    <div className="rounded-xl border border-border/60 bg-white p-5 shadow-soft">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-xs font-black tracking-wide text-brand-dark">BỘ LỌC</h3>
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand hover:underline"
        >
          <RotateCcw size={12} />
          Xóa lọc
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <p className="mb-3 text-[11px] font-bold tracking-wide text-brand-dark uppercase">
            Danh mục
          </p>
          <div className="space-y-2.5">
            {CATEGORY_OPTIONS.map(({ value, label }) => (
              <label key={value} className="flex cursor-pointer items-center gap-2.5">
                <Checkbox
                  checked={filters.categories.has(value)}
                  onCheckedChange={() => toggleCategory(value)}
                />
                <span className="text-xs text-foreground/85">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-3 text-[11px] font-bold tracking-wide text-brand-dark uppercase">
            Dòng xe
          </p>
          <div className="space-y-2.5">
            {VEHICLE_OPTIONS.filter((v) => v.value !== "all").map(({ value, label }) => (
              <label key={value} className="flex cursor-pointer items-center gap-2.5">
                <Checkbox
                  checked={filters.vehicles.has(value)}
                  onCheckedChange={() => toggleVehicle(value)}
                />
                <span className="text-xs text-foreground/85">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-3 text-[11px] font-bold tracking-wide text-brand-dark uppercase">
            Khoảng giá
          </p>
          <Slider
            min={ACCESSORY_PRICE_MIN}
            max={ACCESSORY_PRICE_MAX}
            step={100_000}
            value={filters.priceRange}
            onValueChange={(v) =>
              setFilters((prev) => ({ ...prev, priceRange: v as [number, number] }))
            }
            className="mb-3"
          />
          <div className="flex justify-between text-[11px] text-muted-foreground">
            <span>{formatPrice(filters.priceRange[0])} đ</span>
            <span>{formatPrice(filters.priceRange[1])} đ</span>
          </div>
        </div>

        <label className="flex cursor-pointer items-center gap-2.5 border-t border-border/50 pt-4">
          <Checkbox
            checked={filters.inStockOnly}
            onCheckedChange={(checked) =>
              setFilters((prev) => ({ ...prev, inStockOnly: checked === true }))
            }
          />
          <span className="text-xs text-foreground/85">Chỉ hiện sản phẩm còn hàng</span>
        </label>
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: AccessoryProduct }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-border/60 bg-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-card">
      <div className="relative flex aspect-square w-full shrink-0 items-center justify-center bg-[#f4f6fa] p-4">
        {product.badge && (
          <span className="absolute top-3 left-3 rounded-md bg-brand px-2 py-0.5 text-[10px] font-bold text-white">
            {product.badge}
          </span>
        )}
        {!product.inStock && (
          <span className="absolute top-3 right-3 rounded-md bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
            Hết hàng
          </span>
        )}
        <img
          src={product.image}
          alt={product.name}
          className="max-h-full max-w-full object-contain transition duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-[10px] font-semibold tracking-wide text-brand uppercase">
          {getCategoryLabel(product.category)}
        </p>
        <h3 className="mt-1 line-clamp-2 min-h-[38px] text-sm font-bold leading-snug text-brand-dark">
          {product.name}
        </h3>
        <p className="mt-1.5 line-clamp-2 min-h-[32px] text-[11px] leading-snug text-muted-foreground">
          {product.description}
        </p>
        <p className="mt-2 text-[10px] text-muted-foreground">
          Tương thích: {getVehicleLabels(product.vehicles)}
        </p>
        <p className="mt-3 text-sm font-black text-brand">{formatPrice(product.price)} VND</p>
        <div className="mt-auto flex gap-2 pt-4">
          <button
            type="button"
            disabled={!product.inStock}
            className="flex flex-1 items-center justify-center rounded-md border border-brand bg-white py-2 text-[10px] font-semibold tracking-wide text-brand transition hover:bg-brand/5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            TƯ VẤN NGAY
          </button>
          <button
            type="button"
            disabled={!product.inStock}
            className="flex flex-1 items-center justify-center rounded-md bg-brand py-2 text-[10px] font-semibold tracking-wide text-white transition hover:bg-[#0046cc] disabled:cursor-not-allowed disabled:opacity-50"
          >
            ĐẶT MUA
          </button>
        </div>
      </div>
    </article>
  );
}

function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const btnBase =
    "inline-flex h-8 min-w-8 items-center justify-center rounded-md text-xs font-semibold transition";
  const btnActive = "bg-brand text-white";
  const btnIdle =
    "border border-border bg-white text-brand-dark hover:bg-surface disabled:opacity-40";

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

function InstallProcessSection() {
  return (
    <section className="bg-white py-12 md:py-14">
      <div className="container-vf">
        <h2 className={sectionHeading}>QUY TRÌNH MUA & LẮP ĐẶT</h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-xs leading-relaxed text-muted-foreground">
          Quy trình 4 bước đơn giản, minh bạch — từ tư vấn đến bàn giao phụ kiện tại VF Ngọc Anh.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {INSTALL_STEPS.map(({ step, title, desc }) => (
            <div
              key={step}
              className="relative rounded-xl border border-border/60 bg-surface p-5 shadow-soft"
            >
              <span className="text-2xl font-black text-brand/20">{step}</span>
              <h3 className="mt-2 text-sm font-bold text-brand-dark">{title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PromoBanners() {
  return (
    <section className="bg-surface py-10 md:py-12">
      <div className="container-vf grid gap-4 md:grid-cols-2 md:gap-5">
        <div className="relative overflow-hidden rounded-xl shadow-card">
          <img
            src={ACCESSORY_IMAGES.promoInstall}
            alt="Lắp đặt phụ kiện tại showroom"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/90 via-brand-dark/75 to-brand-dark/40" />
          <div className="relative z-10 p-6 text-white md:p-8">
            <p className="text-[10px] font-bold tracking-wider text-white/70 uppercase">
              Dịch vụ lắp đặt
            </p>
            <h3 className="mt-2 text-lg font-black leading-tight md:text-xl">
              LẮP ĐẶT MIỄN PHÍ TẠI SHOWROOM
            </h3>
            <p className="mt-2 max-w-xs text-xs leading-relaxed text-white/80">
              Mua phụ kiện từ 2.000.000 VND được miễn phí lắp đặt tại xưởng dịch vụ VF Ngọc Anh.
            </p>
            <button
              type="button"
              className="mt-5 rounded-md bg-brand px-5 py-2.5 text-[11px] font-semibold tracking-wide text-white hover:bg-[#0046cc]"
            >
              LIÊN HỆ TƯ VẤN
            </button>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl border border-brand/10 bg-gradient-to-br from-[#e8f0ff] via-[#f0f5ff] to-white shadow-soft">
          <div className="absolute top-4 right-4 opacity-20">
            <Shield className="size-24 text-brand" strokeWidth={1} />
          </div>
          <div className="relative z-10 p-6 md:p-8">
            <p className="text-[10px] font-bold tracking-wider text-brand uppercase">
              Chính sách bảo hành
            </p>
            <h3 className="mt-2 text-lg font-black leading-tight text-brand-dark md:text-xl">
              BẢO HÀNH CHÍNH HÃNG VINFAST
            </h3>
            <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <ChevronRight size={14} className="mt-0.5 shrink-0 text-brand" />
                Bảo hành từ 6–24 tháng tùy loại phụ kiện
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight size={14} className="mt-0.5 shrink-0 text-brand" />
                Đổi mới 1 đổi 1 trong 7 ngày nếu lỗi sản xuất
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight size={14} className="mt-0.5 shrink-0 text-brand" />
                Hỗ trợ bảo hành tại toàn bộ hệ thống đại lý VinFast
              </li>
            </ul>
            <button
              type="button"
              className="mt-5 rounded-md border border-brand bg-white px-5 py-2.5 text-[11px] font-semibold tracking-wide text-brand transition hover:bg-brand/5"
            >
              XEM CHI TIẾT
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyOfficialSection() {
  return (
    <section className="bg-white py-14 md:py-16 lg:py-20">
      <div className="container-vf">
        <h2 className={sectionHeading}>VÌ SAO NÊN CHỌN PHỤ KIỆN CHÍNH HÃNG?</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {WHY_OFFICIAL.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-xl border border-brand/20 bg-surface">
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

function FaqSection() {
  return (
    <section className="bg-surface py-12 md:py-14">
      <div className="container-vf">
        <h2 className={sectionHeading}>CÂU HỎI THƯỜNG GẶP</h2>
        <div className="mx-auto mt-8 max-w-3xl divide-y divide-border/60 rounded-xl border border-border/60 bg-white shadow-soft">
          {FAQ.map(({ q, a }) => (
            <details key={q} className="group px-5 py-4 md:px-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-brand-dark marker:content-none">
                {q}
                <ChevronDown className="size-4 shrink-0 text-brand transition group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactCta() {
  return (
    <section className="border-t border-border/40 bg-brand-dark py-12 md:py-14">
      <div className="container-vf flex flex-col items-center text-center">
        <h2 className="text-xl font-black tracking-tight text-white sm:text-2xl">
          CẦN TƯ VẤN PHỤ KIỆN?
        </h2>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/75">
          Đội ngũ VF Ngọc Anh sẵn sàng tư vấn phụ kiện phù hợp với dòng xe và nhu cầu sử dụng của
          bạn.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <a
            href="tel:1900232389"
            className="inline-flex items-center gap-2 rounded-md bg-brand px-6 py-3 text-xs font-semibold tracking-wide text-white transition hover:bg-[#0046cc]"
          >
            <Phone size={16} />
            1900 2323 89
          </a>
          <Link
            href="/oto"
            className="inline-flex items-center gap-2 rounded-md border border-white/30 bg-white/10 px-6 py-3 text-xs font-semibold tracking-wide text-white transition hover:bg-white/20"
          >
            <Check size={16} />
            XEM DÒNG XE
          </Link>
        </div>
      </div>
    </section>
  );
}
