"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast, Toaster } from "sonner";
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
  Search,
  ShoppingCart,
  X,
  Info,
  SlidersHorizontal,
  Plus,
  Trash2,
  Calendar,
  TrendingUp,
} from "lucide-react";

import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import FloatingButtons from "@/components/site/FloatingButtons";
import { AccessoryProductCard } from "@/components/accessories/AccessoryProductCard";
import { CatalogGrid, CatalogGridItem } from "@/components/motion";
import { CatalogHeroIntro } from "@/components/shared/CatalogHeroIntro";
import { PromoBannerCarousel } from "@/components/shared/PromoBannerCarousel";
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
import { ACCESSORY_HERO_BANNERS } from "@/lib/images";
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
import { HOTLINE, HOTLINE_TEL } from "@/lib/contact";

const HERO_FEATURES = [
  { icon: Shield, text: "100% chính hãng", sub: "Bảo hành VinFast từ 6-24 tháng" },
  { icon: Wrench, text: "Lắp đặt chuyên nghiệp", sub: "Thực hiện bởi kỹ thuật viên hãng" },
  { icon: Package, text: "Giao hàng toàn quốc", sub: "Ship COD nhanh chóng, an toàn" },
] as const;

const WHY_OFFICIAL = [
  {
    icon: Award,
    title: "Chất lượng đảm bảo",
    desc: "Sản phẩm được chế tạo từ chất liệu cao cấp, vượt qua các bài kiểm thử khắt khe về độ bền và an toàn của hãng.",
  },
  {
    icon: Shield,
    title: "Bảo hành rõ ràng",
    desc: "Chính sách bảo hành minh bạch tại xưởng dịch vụ VF Ngọc Anh, hỗ trợ đổi mới 1-đổi-1 trong 7 ngày nếu có lỗi từ nhà sản xuất.",
  },
  {
    icon: Wrench,
    title: "Lắp đặt chuyên nghiệp",
    desc: "Miễn phí công lắp đặt cho hóa đơn phụ kiện từ 2 triệu VNĐ tại trung tâm dịch vụ kỹ thuật Long Biên.",
  },
  {
    icon: Sparkles,
    title: "Tương thích hoàn hảo",
    desc: "Thiết kế chuẩn xác 100% theo thông số kỹ thuật 3D của từng dòng xe VinFast, không độ chế ảnh hưởng tới bảo hành xe.",
  },
] as const;

const INSTALL_STEPS = [
  {
    step: "01",
    title: "Chọn phụ kiện",
    desc: "Khám phá danh mục phụ kiện phong phú, lọc chuẩn theo dòng xe bạn đang sở hữu.",
  },
  {
    step: "02",
    title: "Gửi yêu cầu tư vấn",
    desc: "Thêm phụ kiện vào giỏ tư vấn nhanh và gửi yêu cầu, chuyên viên liên hệ ngay trong 10 phút.",
  },
  {
    step: "03",
    title: "Đặt hẹn lắp đặt",
    desc: "Hẹn ngày giờ lắp đặt thuận tiện nhất cho bạn tại xưởng dịch vụ ủy quyền của VF Ngọc Anh.",
  },
  {
    step: "04",
    title: "Bàn giao & Bảo hành",
    desc: "Nghiệm thu lắp đặt, hướng dẫn vận hành kỹ thuật và kích hoạt hệ thống bảo hành chính hãng.",
  },
] as const;

const FAQ = [
  {
    q: "Phụ kiện chính hãng VinFast có gì khác biệt so với phụ kiện trôi nổi bên ngoài?",
    a: "Phụ kiện chính hãng được thiết kế nguyên bản dựa trên bản vẽ kỹ thuật của xe VinFast, sử dụng chất liệu cao cấp chống cháy, chống nước, đảm bảo tương thích tuyệt đối mà không cần đấu nối dây điện phức tạp gây ảnh hưởng tới chế độ bảo hành xe mới.",
  },
  {
    q: "Tôi có thể mua phụ kiện tự lắp đặt tại nhà hay bắt buộc phải ra Showroom?",
    a: "Với các phụ kiện đơn giản như thảm lót sàn, gối tựa đầu, ô che nắng, mô hình xe... bạn có thể tự lắp dễ dàng và showroom hỗ trợ ship COD tận nhà. Với các phụ kiện liên quan đến điện, công nghệ sạc hoặc camera, chúng tôi khuyên bạn nên lắp đặt miễn phí tại xưởng dịch vụ VF Ngọc Anh để đảm bảo chuẩn kỹ thuật.",
  },
  {
    q: "Chính sách bảo hành dành cho phụ kiện chính hãng như thế nào?",
    a: "Toàn bộ phụ kiện chính hãng VinFast phân phối bởi VF Ngọc Anh đều được bảo hành từ 6 đến 24 tháng (tùy dòng sản phẩm). Thông tin bảo hành được cập nhật trực tuyến trên hệ thống đại lý toàn quốc.",
  },
  {
    q: "Thời gian giao hàng phụ kiện mất bao lâu?",
    a: "Showroom hỗ trợ giao hàng toàn quốc nhanh chóng. Khu vực nội thành Hà Nội giao nhanh trong 2 - 4 giờ, các tỉnh thành khác nhận hàng từ 2 - 4 ngày làm việc.",
  },
] as const;

const sectionHeading =
  "text-center text-xl font-black leading-tight tracking-tight text-brand-dark sm:text-2xl md:text-3xl lg:text-4xl";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>("all");

  // Interactive Quote Basket State
  const [cart, setCart] = useState<AccessoryProduct[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({
    name: "",
    phone: "",
    address: "",
    deliveryMethod: "showroom", // "showroom" | "home"
    note: "",
  });

  // Load cart from localStorage (if any)
  useEffect(() => {
    const savedCart = localStorage.getItem("vf_accessory_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Save cart helper
  const saveCart = (newCart: AccessoryProduct[]) => {
    setCart(newCart);
    localStorage.setItem("vf_accessory_cart", JSON.stringify(newCart));
  };

  // Add item to cart
  const addToCart = (product: AccessoryProduct) => {
    const exists = cart.find((item) => item.id === product.id);
    if (exists) {
      toast.info(`Sản phẩm ${product.name} đã có trong giỏ tư vấn`);
      setIsCartOpen(true);
      return;
    }
    const updated = [...cart, product];
    saveCart(updated);
    toast.success(`Đã thêm ${product.name} vào giỏ tư vấn thành công!`);
  };

  // Remove item from cart
  const removeFromCart = (productId: string) => {
    const updated = cart.filter((item) => item.id !== productId);
    saveCart(updated);
    toast.info("Đã xóa sản phẩm khỏi giỏ tư vấn");
  };

  // Clear cart
  const clearCart = () => {
    saveCart([]);
  };

  // Handle Checkout/Quote Submission
  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutForm.name || !checkoutForm.phone) {
      toast.error("Vui lòng điền Họ tên và Số điện thoại liên hệ");
      return;
    }
    setIsCheckoutSuccess(true);
    toast.success("Gửi yêu cầu báo giá thành công!");
  };

  // Filter products based on sidebar filters + top tab + search query
  const filteredProducts = useMemo(() => {
    let result = ACCESSORIES.filter((item) => {
      // 1. Sidebar Category Filters
      const categoryOk = filters.categories.size === 0 || filters.categories.has(item.category);

      // 2. Sidebar Vehicle Filters
      const vehicleOk =
        filters.vehicles.size === 0 ||
        item.vehicles.includes("all") ||
        [...filters.vehicles].some((v) => item.vehicles.includes(v));

      // 3. Price Range Slider
      const priceOk = item.price >= filters.priceRange[0] && item.price <= filters.priceRange[1];

      // 4. In Stock Filter
      const stockOk = !filters.inStockOnly || item.inStock;

      // 5. Top Category Tab Filter
      const tabOk = activeCategoryTab === "all" || item.category === activeCategoryTab;

      // 6. Search Bar Query
      const searchOk =
        searchQuery === "" ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());

      return categoryOk && vehicleOk && priceOk && stockOk && tabOk && searchOk;
    });

    // Sorting
    if (sort === "price-asc") result = [...result].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") result = [...result].sort((a, b) => b.price - a.price);
    if (sort === "name") result = [...result].sort((a, b) => a.name.localeCompare(b.name, "vi"));
    return result;
  }, [filters, sort, activeCategoryTab, searchQuery]);

  const clearFilters = () => {
    setFilters(defaultFilters());
    setSearchQuery("");
    setActiveCategoryTab("all");
    toast.success("Đã cài đặt lại tất cả bộ lọc");
  };

  const cartTotalPrice = useMemo(() => {
    return cart.reduce((total, item) => total + item.price, 0);
  }, [cart]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-slate-800 font-sans">
      <Toaster position="top-right" richColors />
      <Header />

      <main>
        {/* Breadcrumb path */}
        <BreadcrumbBar />

        {/* Hero Banner Section */}
        <HeroSection
          onExplore={() => {
            document
              .getElementById("accessory-catalog-grid")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
        />

        {/* Search Dashboard */}
        <section className="border-b border-slate-100 bg-white py-4 lg:sticky lg:top-14 lg:z-20">
          <div className="container-vf flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-xs font-black text-brand-dark uppercase tracking-wider">
              TÌM KIẾM PHỤ KIỆN CHÍNH HÃNG
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm phụ kiện..."
                  className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand focus:bg-white transition-all text-slate-800"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>

              {/* Floating Quote Basket Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative flex shrink-0 items-center gap-2 rounded-lg border border-brand/30 bg-brand-dark px-4 p-2.5 text-white transition-colors hover:bg-brand"
              >
                <ShoppingCart className="size-4" />
                <span className="text-xs font-black hidden sm:inline">GIỎ TƯ VẤN</span>
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white font-black text-[10px] size-5 rounded-full flex items-center justify-center animate-bounce border-2 border-white">
                    {cart.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Main Products Grid & Explorer */}
        <section className="section-y bg-white">
          <div className="container-vf">
            <button
              type="button"
              onClick={() => setMobileFilters(!mobileFilters)}
              className="mb-6 flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm font-bold text-brand-dark hover:bg-slate-50 lg:hidden"
            >
              <span className="flex items-center gap-2">
                <SlidersHorizontal className="size-4 text-brand" /> Bộ lọc sản phẩm
              </span>
              <ChevronDown
                className={`size-4 transition-transform duration-300 ${mobileFilters ? "rotate-180" : ""}`}
              />
            </button>

            <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
              {/* Sidebar filter column */}
              <aside
                className={`${mobileFilters ? "block" : "hidden"} w-full shrink-0 lg:block lg:w-[260px] lg:sticky lg:top-[150px] lg:z-10`}
              >
                <FilterSidebar filters={filters} setFilters={setFilters} onClear={clearFilters} />
              </aside>

              {/* Main catalog results grid */}
              <div className="min-w-0 flex-1">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-base font-black tracking-wide text-brand-dark uppercase flex items-center gap-2">
                      <TrendingUp className="size-4 text-brand" />
                      DANH MỤC PHỤ KIỆN
                    </h2>
                    <p className="text-xs font-bold text-slate-400 mt-1">
                      Đang hiển thị {filteredProducts.length} sản phẩm tương thích chuẩn xác
                    </p>
                  </div>

                  <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
                    <SelectTrigger className="h-10 w-full border-slate-200 bg-white text-xs font-semibold text-slate-700 shadow-sm focus:ring-brand sm:w-[200px]">
                      <SelectValue placeholder="Sắp xếp" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popular">Phổ biến nhất</SelectItem>
                      <SelectItem value="price-asc">Giá: Thấp → Cao</SelectItem>
                      <SelectItem value="price-desc">Giá: Cao → Thấp</SelectItem>
                      <SelectItem value="name">Tên sản phẩm: A → Z</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Empty State */}
                {filteredProducts.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border-2 border-dashed border-slate-200 bg-white py-20 text-center shadow-sm"
                  >
                    <AlertCircleIcon className="size-12 mx-auto text-slate-300 mb-4" />
                    <p className="text-sm font-black text-brand-dark">
                      Không tìm thấy phụ kiện phù hợp
                    </p>
                    <p className="text-xs text-slate-400 mt-2">
                      Vui lòng điều chỉnh tiêu chí lọc hoặc tìm kiếm tên khác.
                    </p>
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-xs font-bold text-white shadow-soft hover:bg-brand-dark transition-all"
                    >
                      <RotateCcw className="size-3" /> Cài đặt lại bộ lọc
                    </button>
                  </motion.div>
                ) : (
                  <CatalogGrid
                    id="accessory-catalog-grid"
                    className="grid grid-cols-2 items-stretch gap-3 sm:gap-6 xl:grid-cols-3"
                  >
                    {filteredProducts.map((product, index) => (
                      <CatalogGridItem key={product.id} index={index}>
                        <AccessoryProductCard product={product} />
                      </CatalogGridItem>
                    ))}
                  </CatalogGrid>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Buying & Installation Process Section */}
        <InstallProcessSection />

        {/* Promotional Offers & Warranty Block */}
        <PromoBanners />

        {/* Why Official Accessories Feature List */}
        <WhyOfficialSection />

        {/* FAQs Accordion */}
        <FaqSection />

        {/* Fast Action CTA */}
        <ContactCta />
      </main>

      <Footer />
      <FloatingButtons />

      {/* INTERACTIVE CART DRAWER: Quote & Consulting Basket */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
            {/* Soft backdrop close trigger */}
            <div className="absolute inset-0" onClick={() => setIsCartOpen(false)} />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col text-slate-800 z-10 border-l border-slate-100"
            >
              {/* Drawer Header */}
              <div className="bg-brand-dark text-white p-5 flex items-center justify-between shadow-md">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="size-5 text-brand" />
                  <h3 className="text-sm font-black uppercase">Giỏ tư vấn phụ kiện</h3>
                  <span className="bg-brand text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {cart.length}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutSuccess(false);
                  }}
                  className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-all"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Cart Core Content */}
              <div className="flex-1 overflow-y-auto p-5">
                {isCheckoutSuccess ? (
                  // Success screen
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-10 space-y-4"
                  >
                    <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 border border-emerald-200">
                      <Check className="size-8" strokeWidth={2.5} />
                    </div>
                    <div>
                      <h4 className="text-base font-black text-slate-900 uppercase">
                        Gửi yêu cầu thành công!
                      </h4>
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                        Cảm ơn quý khách{" "}
                        <strong className="text-slate-800">{checkoutForm.name}</strong> đã quan tâm
                        tới phụ kiện chính hãng tại VF Ngọc Anh. <br />
                        Chuyên viên dịch vụ sẽ gọi điện hoặc nhắn tin tư vấn trực tiếp báo giá chi
                        tiết và xếp lịch hẹn lắp đặt cho quý khách trong vòng 10 phút.
                      </p>
                    </div>

                    <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 text-left text-xs font-semibold space-y-2.5">
                      <div className="flex justify-between border-b border-slate-200/60 pb-2">
                        <span className="text-slate-500">Người liên hệ:</span>
                        <span className="text-slate-800 font-bold">
                          {checkoutForm.name} - {checkoutForm.phone}
                        </span>
                      </div>
                      <div className="space-y-1.5 max-h-[140px] overflow-y-auto">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          Danh sách đăng ký tư vấn:
                        </p>
                        {cart.map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between items-center text-[11px]"
                          >
                            <span className="text-slate-700 font-medium truncate max-w-[240px]">
                              • {item.name}
                            </span>
                            <span className="text-brand font-bold shrink-0">
                              {formatPrice(item.price)} đ
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between border-t border-slate-200 pt-2 text-[11px] font-black text-brand">
                        <span>TỔNG GIÁ TRỊ:</span>
                        <span>{formatPrice(cartTotalPrice)} VNĐ</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        clearCart();
                        setIsCartOpen(false);
                        setIsCheckoutSuccess(false);
                      }}
                      className="w-full bg-brand hover:bg-blue-600 text-white font-bold text-xs tracking-wider py-3 rounded-xl transition-all shadow-md"
                    >
                      QUAY LẠI CỬA HÀNG
                    </button>
                  </motion.div>
                ) : cart.length === 0 ? (
                  // Empty state
                  <div className="text-center py-20 space-y-4">
                    <ShoppingCart className="size-12 text-slate-200 mx-auto" />
                    <p className="text-xs font-bold text-slate-400">
                      Giỏ tư vấn phụ kiện của bạn đang trống.
                    </p>
                    <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                      Vui lòng bấm chọn &ldquo;Thêm vào giỏ&rdquo; trên các sản phẩm phụ kiện chính
                      hãng để gửi yêu cầu báo giá/lắp đặt đồng loạt.
                    </p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="bg-brand/10 hover:bg-brand/20 text-brand font-bold text-xs px-5 py-2.5 rounded-lg transition-all"
                    >
                      TIẾP TỤC KHÁM PHÁ
                    </button>
                  </div>
                ) : (
                  // Listed Items & Submission Form
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Sản phẩm đã chọn ({cart.length})
                        </span>
                        <button
                          onClick={clearCart}
                          className="text-[10px] font-bold text-red-500 hover:underline flex items-center gap-1"
                        >
                          <Trash2 className="size-3" /> Xóa tất cả
                        </button>
                      </div>

                      {/* Basket items list */}
                      <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                        {cart.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200 relative group"
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              className="size-11 rounded-md object-contain bg-white border border-slate-100 p-1 shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <h4 className="text-xs font-bold text-slate-900 truncate pr-4">
                                {item.name}
                              </h4>
                              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                                {getCategoryLabel(item.category)}
                              </p>
                              <p className="text-xs font-black text-brand mt-1">
                                {formatPrice(item.price)} đ
                              </p>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all opacity-80 group-hover:opacity-100"
                              title="Xóa khỏi giỏ"
                            >
                              <X className="size-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Total and incentive notice */}
                      <div className="bg-blue-50 border border-blue-100 rounded-xl p-3.5 flex flex-col gap-1.5 text-xs">
                        <div className="flex justify-between items-center font-bold text-brand-dark">
                          <span>Tổng giá trị phụ kiện:</span>
                          <span className="text-base font-black text-brand">
                            {formatPrice(cartTotalPrice)} VNĐ
                          </span>
                        </div>
                        {cartTotalPrice >= 2_000_000 ? (
                          <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[10px] mt-1">
                            <Check className="size-3.5" strokeWidth={3} /> Đủ điều kiện MIỄN PHÍ
                            công lắp đặt tại Showroom!
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-slate-500 font-semibold text-[10px] mt-1">
                            <Info className="size-3.5 text-brand" /> Mua thêm{" "}
                            {formatPrice(2_000_000 - cartTotalPrice)} đ để được MIỄN PHÍ công lắp
                            đặt.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Consulting Request Form */}
                    <form
                      onSubmit={handleCheckout}
                      className="border-t border-slate-100 pt-5 space-y-4"
                    >
                      <h4 className="text-[10px] font-black text-brand-dark uppercase tracking-widest">
                        Thông tin đăng ký lắp đặt / giao hàng
                      </h4>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          Họ và tên khách hàng *
                        </label>
                        <input
                          type="text"
                          required
                          value={checkoutForm.name}
                          onChange={(e) =>
                            setCheckoutForm({ ...checkoutForm, name: e.target.value })
                          }
                          placeholder="Nguyễn Văn A"
                          className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-brand text-slate-800 focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          Số điện thoại liên hệ *
                        </label>
                        <input
                          type="tel"
                          required
                          value={checkoutForm.phone}
                          onChange={(e) =>
                            setCheckoutForm({ ...checkoutForm, phone: e.target.value })
                          }
                          placeholder="09xx xxx xxx"
                          className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-brand text-slate-800 focus:bg-white"
                        />
                      </div>

                      <div>
                        <span className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">
                          Hình thức nhận hàng
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setCheckoutForm({ ...checkoutForm, deliveryMethod: "showroom" })
                            }
                            className={`py-2 text-center rounded-lg border text-xs font-bold transition-all ${
                              checkoutForm.deliveryMethod === "showroom"
                                ? "border-brand bg-brand/5 text-brand"
                                : "border-slate-200 text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            Lắp đặt tại Showroom
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setCheckoutForm({ ...checkoutForm, deliveryMethod: "home" })
                            }
                            className={`py-2 text-center rounded-lg border text-xs font-bold transition-all ${
                              checkoutForm.deliveryMethod === "home"
                                ? "border-brand bg-brand/5 text-brand"
                                : "border-slate-200 text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            Giao hàng tận nhà (COD)
                          </button>
                        </div>
                      </div>

                      {checkoutForm.deliveryMethod === "home" && (
                        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                            Địa chỉ nhận hàng chi tiết *
                          </label>
                          <input
                            type="text"
                            required
                            value={checkoutForm.address}
                            onChange={(e) =>
                              setCheckoutForm({ ...checkoutForm, address: e.target.value })
                            }
                            placeholder="Số nhà, ngõ/đường, Phường/Xã, Quận/Huyện, Tỉnh thành..."
                            className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-brand text-slate-800 focus:bg-white"
                          />
                        </motion.div>
                      )}

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          Lời nhắn / Yêu cầu thêm (Tùy chọn)
                        </label>
                        <textarea
                          value={checkoutForm.note}
                          onChange={(e) =>
                            setCheckoutForm({ ...checkoutForm, note: e.target.value })
                          }
                          placeholder="Tôi muốn được đặt hẹn lắp vào sáng thứ 7 tuần này, dán thêm phim cách nhiệt..."
                          rows={2}
                          className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-brand text-slate-800 focus:bg-white resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-brand hover:bg-blue-600 text-white font-extrabold text-xs tracking-wider py-3.5 rounded-xl transition-all shadow-md mt-4 flex items-center justify-center gap-2"
                      >
                        <Calendar className="size-4" /> GỬI YÊU CẦU BÁO GIÁ LẮP ĐẶT
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AlertCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </svg>
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
                Phụ kiện chính hãng
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
}

function HeroSection({ onExplore }: { onExplore: () => void }) {
  return (
    <>
      <section className="relative w-full overflow-hidden bg-white">
        <PromoBannerCarousel banners={ACCESSORY_HERO_BANNERS} aspectLayout showControls={false} />
      </section>

      <CatalogHeroIntro
        title="Cá nhân hóa xe sang"
        titleAccent="nâng tầm đẳng cấp"
        description="Nâng cấp xe điện VinFast với phụ kiện nội thất, ngoại thất, sạc pin và an toàn chính hãng — phân phối và lắp đặt tại VF Ngọc Anh."
        primaryCta={{ label: "KHÁM PHÁ PHỤ KIỆN", onClick: onExplore }}
        secondaryCta={{ label: `HOTLINE TƯ VẤN: ${HOTLINE}`, href: HOTLINE_TEL }}
        highlights={[
          { value: `${ACCESSORIES.length}+`, label: "Sản phẩm chính hãng" },
          { value: "6–24", label: "Tháng bảo hành" },
          { value: "3S", label: "Lắp đặt tại xưởng" },
        ]}
        features={[...HERO_FEATURES]}
      />
    </>
  );
}

function InstallProcessSection() {
  return (
    <section className="bg-white section-y border-y border-slate-100">
      <div className="container-vf">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <span className="text-brand font-extrabold text-xs tracking-widest uppercase">
            Cam kết dịch vụ
          </span>
          <h2 className={sectionHeading + " mt-2"}>QUY TRÌNH TƯ VẤN & LẮP ĐẶT PHỤ KIỆN</h2>
          <div className="h-1 w-16 bg-brand mx-auto mt-4 rounded" />
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {INSTALL_STEPS.map(({ step, title, desc }) => (
            <div
              key={step}
              className="relative rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-soft hover:shadow-md transition-all group"
            >
              <span className="text-3xl font-black text-brand/20 group-hover:text-brand transition-colors">
                {step}
              </span>
              <h3 className="mt-3 text-sm font-black text-brand-dark uppercase">{title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-400 font-medium">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PromoBanners() {
  return (
    <section className="bg-slate-50 section-y">
      <div className="container-vf grid gap-6 sm:grid-cols-2">
        <div className="relative overflow-hidden rounded-2xl shadow-md border border-slate-100 flex min-h-[220px]">
          <img
            src={ACCESSORY_IMAGES.promoInstall}
            alt="Lắp đặt phụ kiện tại showroom"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/95 via-brand-dark/80 to-brand-dark/70 lg:bg-gradient-to-r lg:from-brand-dark/95 lg:via-brand-dark/80 lg:to-transparent" />
          <div className="relative z-10 p-6 md:p-8 text-white flex flex-col justify-center max-w-sm">
            <span className="bg-accent-yellow text-slate-900 font-black text-[9px] tracking-wider px-2 py-0.5 rounded uppercase self-start mb-3">
              Ưu đãi lắp đặt
            </span>
            <h3 className="text-xl font-black leading-tight uppercase">
              MIỄN PHÍ HOÀN TOÀN CÔNG LẮP ĐẶT
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-300 font-medium">
              Khách hàng đặt mua combo phụ kiện chính hãng có tổng giá trị hóa đơn từ 2.000.000 VNĐ
              sẽ được miễn phí công lắp đặt 100% tại xưởng dịch vụ kỹ thuật VF Ngọc Anh.
            </p>
            <a
              href={HOTLINE_TEL}
              className="mt-5 bg-brand hover:bg-blue-600 text-white text-[11px] font-extrabold tracking-wider px-5 py-2.5 rounded-lg transition-all text-center self-start shadow-md"
            >
              GỌI ĐẶT LỊCH HẸN NGAY
            </a>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-brand/10 bg-gradient-to-br from-blue-50/70 via-indigo-50/30 to-white shadow-soft p-6 md:p-8 flex flex-col justify-center min-h-[220px]">
          <div className="absolute top-4 right-4 opacity-15">
            <Shield className="size-24 text-brand" strokeWidth={1} />
          </div>
          <div className="relative z-10">
            <span className="bg-brand/20 text-brand font-black text-[9px] tracking-wider px-2 py-0.5 rounded uppercase inline-block mb-3 border border-brand/10">
              Quy chuẩn bảo hành
            </span>
            <h3 className="text-xl font-black leading-tight text-brand-dark uppercase">
              BẢO HÀNH CHÍNH HÃNG 6 - 24 THÁNG
            </h3>
            <ul className="mt-4 space-y-2 text-xs text-slate-600 font-semibold">
              <li className="flex items-start gap-2">
                <Check size={14} className="mt-0.5 shrink-0 text-emerald-500" strokeWidth={3} />
                Áp dụng chính sách bảo hành toàn quốc tại bất kỳ Đại lý ủy quyền VinFast.
              </li>
              <li className="flex items-start gap-2">
                <Check size={14} className="mt-0.5 shrink-0 text-emerald-500" strokeWidth={3} />
                Cam kết đổi mới 1-đổi-1 trong vòng 7 ngày đầu nếu có lỗi kỹ thuật.
              </li>
              <li className="flex items-start gap-2">
                <Check size={14} className="mt-0.5 shrink-0 text-emerald-500" strokeWidth={3} />
                Bảo hành chuẩn chỉ, không độ chế cắt ghép dây gây rủi ro về điện.
              </li>
            </ul>
            <a
              href={HOTLINE_TEL}
              className="mt-5 inline-block border border-brand hover:bg-brand hover:text-white bg-white text-brand text-[11px] font-extrabold tracking-wider px-5 py-2.5 rounded-lg transition-all text-center"
            >
              TRA CỨU Hạn BẢO HÀNH
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyOfficialSection() {
  return (
    <section className="bg-white section-y border-b border-slate-200">
      <div className="container-vf">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <span className="text-brand font-extrabold text-xs tracking-widest uppercase">
            An tâm tuyệt đối
          </span>
          <h2 className={sectionHeading + " mt-2"}>VÌ SAO NÊN CHỌN PHỤ KIỆN CHÍNH HÃNG VINFAST?</h2>
          <div className="h-1 w-16 bg-brand mx-auto mt-4 rounded" />
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {WHY_OFFICIAL.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-white border border-slate-200 p-6 rounded-2xl shadow-soft hover:shadow-md transition-all text-center"
            >
              <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-brand/10 border border-brand/20 text-brand">
                <Icon className="size-6 text-brand" strokeWidth={1.5} />
              </div>
              <h3 className="mt-4 text-sm font-black text-brand-dark uppercase">{title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-400 font-medium">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section className="bg-slate-50 section-y border-b border-slate-200">
      <div className="container-vf">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <span className="text-brand font-extrabold text-xs tracking-widest uppercase">
            Góc giải đáp thắc mắc
          </span>
          <h2 className={sectionHeading + " mt-2"}>CÂU HỎI THƯỜNG GẶP</h2>
          <div className="h-1 w-16 bg-brand mx-auto mt-4 rounded" />
        </div>

        <div className="mx-auto mt-8 max-w-3xl divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white shadow-soft overflow-hidden">
          {FAQ.map(({ q, a }) => (
            <details key={q} className="group px-6 py-5 hover:bg-slate-50/50 transition-all">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold text-brand-dark marker:content-none select-none">
                {q}
                <ChevronDown className="size-4 shrink-0 text-brand transition-transform duration-300 group-open:rotate-180" />
              </summary>
              <p className="mt-3.5 text-xs leading-relaxed text-slate-500 font-medium border-t border-slate-100 pt-3">
                {a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactCta() {
  return (
    <section className="bg-brand-dark section-y relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,87,255,0.15),transparent)] pointer-events-none" />
      <div className="container-vf relative z-10 flex flex-col items-center text-center">
        <h2 className="text-xl font-black tracking-tight text-white sm:text-2xl uppercase">
          Quý khách cần thêm thông tin phụ kiện?
        </h2>
        <p className="mt-3 max-w-lg text-xs md:text-sm leading-relaxed text-slate-300 font-medium">
          Đội ngũ VF Ngọc Anh luôn sẵn sàng phục vụ tư vấn chọn thảm lót, dán phim cách nhiệt, nâng
          cấp camera hành trình chính hãng chuẩn xác nhất cho xế yêu của bạn.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href={HOTLINE_TEL}
            className="inline-flex items-center gap-2 rounded-xl bg-brand hover:bg-blue-600 px-6 py-3.5 text-xs font-black tracking-wider text-white transition-all shadow-md"
          >
            <Phone size={15} />
            HOTLINE: {HOTLINE}
          </a>
          <Link
            href="/oto"
            className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 text-xs font-black tracking-wider text-white transition-all hover:bg-white/20"
          >
            <Check size={15} />
            XEM CATALOG XE Ô TÔ
          </Link>
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
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft lg:max-h-[80vh] lg:overflow-y-auto">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
        <h3 className="text-xs font-black tracking-wider text-brand-dark flex items-center gap-2">
          <SlidersHorizontal className="size-4 text-brand" /> BỘ LỌC TÌM KIẾM
        </h3>
        <button
          type="button"
          onClick={onClear}
          className="text-[10px] font-bold text-brand hover:underline flex items-center gap-1"
        >
          <RotateCcw className="size-3" /> Reset
        </button>
      </div>

      <div className="space-y-5">
        <FilterGroup title="PHÂN LOẠI PHỤ KIỆN">
          {CATEGORY_OPTIONS.map(({ value, label }) => (
            <FilterCheck
              key={value}
              id={`cat-${value}`}
              label={label}
              checked={filters.categories.has(value)}
              onChange={() => toggleCategory(value)}
            />
          ))}
        </FilterGroup>

        <FilterGroup title="DÒNG XE HỖ TRỢ">
          {VEHICLE_OPTIONS.filter((v) => v.value !== "all").map(({ value, label }) => (
            <FilterCheck
              key={value}
              id={`veh-${value}`}
              label={label}
              checked={filters.vehicles.has(value)}
              onChange={() => toggleVehicle(value)}
            />
          ))}
        </FilterGroup>

        <FilterGroup title="KHOẢNG GIÁ ƯU ĐÃI">
          <Slider
            min={ACCESSORY_PRICE_MIN}
            max={ACCESSORY_PRICE_MAX}
            step={100_000}
            value={filters.priceRange}
            onValueChange={(v) =>
              setFilters((prev) => ({ ...prev, priceRange: v as [number, number] }))
            }
            className="mt-4"
          />
          <div className="mt-3 flex items-center justify-between gap-1 text-[10px] text-slate-500 font-extrabold">
            <span className="rounded border border-slate-200 bg-slate-50 px-2 py-1">
              {formatPrice(filters.priceRange[0])} đ
            </span>
            <span className="rounded border border-slate-200 bg-slate-50 px-2 py-1">
              {formatPrice(filters.priceRange[1])} đ
            </span>
          </div>
        </FilterGroup>

        <label className="flex cursor-pointer items-center gap-2.5 border-t border-slate-100 pt-4 select-none">
          <Checkbox
            checked={filters.inStockOnly}
            onCheckedChange={(checked) =>
              setFilters((prev) => ({ ...prev, inStockOnly: checked === true }))
            }
            className="size-4 border-slate-300 text-brand"
          />
          <span className="text-xs text-slate-600 font-semibold hover:text-slate-800">
            Chỉ hiện sản phẩm còn hàng
          </span>
        </label>
      </div>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-4 border-t border-slate-100 pt-4 first:mt-0 first:border-t-0 first:pt-0">
      <p className="mb-2.5 text-[10px] font-black tracking-wider text-slate-400 uppercase">
        {title}
      </p>
      <div className="space-y-2">{children}</div>
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
    <label
      htmlFor={id}
      className="flex cursor-pointer items-center gap-2.5 text-slate-600 hover:text-slate-800 py-0.5 select-none font-semibold text-xs"
    >
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={onChange}
        className="size-4 border-slate-300 text-brand"
      />
      <span>{label}</span>
    </label>
  );
}
