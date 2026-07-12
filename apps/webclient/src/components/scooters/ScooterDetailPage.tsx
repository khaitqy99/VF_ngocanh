"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast, Toaster } from "sonner";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Gauge,
  Zap,
  Timer,
  Wind,
  BatteryCharging,
  Package,
  Scale,
  Bike,
  MapPin,
  Shield,
  Headphones,
  Wallet,
  Mic,
  Download,
  Smartphone,
  Monitor,
  Navigation,
  Settings2,
  Battery,
  Star,
  ArrowRight,
  X,
  ZoomIn,
  Calendar,
  Calculator,
  Percent,
  Info,
  Phone,
  ChevronDown,
  Share2,
} from "lucide-react";

import FloatingButtons from "@/components/site/FloatingButtons";
import { ScooterCatalogCard } from "@/components/scooters/ScooterCatalogCard";
import { AccessoryProductCard } from "@/components/accessories/AccessoryProductCard";
import type { AccessoryProduct } from "@/lib/accessories";
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
  type ScooterDetail,
  formatPrice,
  getRelatedScooters,
  type TechFeature,
} from "@/lib/scooter-details";
import { HOTLINE, HOTLINE_TEL } from "@/lib/contact";
import {
  pdpCtaPrimary,
  pdpCtaSecondary,
  pdpCtaInline,
  pdpCtaInlineLight,
  pdpCtaInlineGhost,
} from "@/components/shared/PageCtaSection";
import { vfCardTitleSm, vfSectionHeadingLeft } from "@/lib/typography";
import { scooterDetailPath } from "@/lib/seo/slugs";
import {
  detailBreadcrumb,
  detailGalleryImage,
  detailHeroCol,
  detailHeroStagger,
  detailPricePulse,
  detailRelatedCard,
  detailServiceItem,
  detailThumbDot,
  detailViewport,
} from "@/lib/detail-motion";
import { useModalMotion } from "@/hooks/use-modal-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useSectionReveal } from "@/hooks/use-section-reveal";
import { PdpSectionNav } from "@/components/shared/PdpSectionNav";
import { useAdminEdit } from "@/components/admin-edit/AdminEditContext";
import { AdminEditToolbar } from "@/components/admin-edit/AdminEditToolbar";
import { EditablePrice, EditableTextBlock } from "@/components/admin-edit/EditableField";
import {
  editableBullets,
  editableHighlights,
  buildQuickSpecBarItems,
  EditableHighlightStat,
  mapEditableMetrics,
  InlineSectionTitle,
  InlineText,
  mapEditableFeatures,
  mapEditableTech,
} from "@/components/admin-edit/EditablePath";
import {
  EditableBulletList,
  EditableFeatureGridSection,
  EditableOverviewImage,
  EditableReviewCards,
  EditableTechGridSection,
  expandFeatureItemsForGrid,
} from "@/components/admin-edit/EditableSections";
import {
  EditableSectionWrap,
  SectionVisibilityProvider,
  filterVisibleNavItems,
  readHiddenSections,
} from "@/components/admin-edit/SectionVisibility";
import { EditableColorPicker } from "@/components/admin-edit/EditableColorPicker";
import { EditableHeroGallery } from "@/components/admin-edit/EditableHeroGallery";
import { EditableImage } from "@/components/admin-edit/EditableImage";
import { EditableListControls } from "@/components/admin-edit/EditableListControls";
import {
  DEFAULT_DRIVE_MODE,
  DEFAULT_SPEC_GROUP,
  DEFAULT_SPEC_ITEM,
} from "@/components/admin-edit/list-defaults";
import { PdpHeroHeader } from "@/components/shared/PdpHeroHeader";
import {
  PdpQuickSpecBar,
  PdpSectionTitle,
  PdpSplitOverview,
  PdpImageFeatureGrid,
  PdpTechIconGrid,
  PdpPerformanceShowcase,
  PdpSafetyShowcase,
  PdpChargingShowcase,
  buildScooterPerformanceMetrics,
  DEFAULT_CHARGING_SOLUTIONS,
  expandGalleryToGrid,
} from "@/components/shared/PdpContentBlocks";
import { IMAGES } from "@/lib/images";

type SectionId =
  | "tong-quan"
  | "ngoai-that"
  | "thiet-ke"
  | "cong-nghe"
  | "van-hanh"
  | "an-toan"
  | "pin-sac"
  | "thong-so"
  | "phu-kien"
  | "tai-chinh"
  | "danh-gia";

const SERVICE_BAR = [
  { icon: Shield, title: "Bảo hành chính hãng", sub: "Lên tới 5 năm hoặc 30.000 km" },
  { icon: Headphones, title: "Cứu hộ 24/7", sub: HOTLINE },
  { icon: MapPin, title: "Showroom Cà Mau", sub: "Tư vấn & giao xe tận nơi" },
  { icon: Wallet, title: "Hỗ trợ tài chính", sub: "Trả góp 0%, lãi suất thấp" },
] as const;

const PROVINCES = [
  { id: "camau", name: "Cà Mau & tỉnh khác", rate: 0.02 },
  { id: "hanoi", name: "Hà Nội (Lệ phí biển 2–4 triệu)", rate: 0.05 },
  { id: "hcm", name: "TP. HCM (Lệ phí biển 2–4 triệu)", rate: 0.05 },
  { id: "other", name: "Tỉnh/Thành phố khác", rate: 0.02 },
] as const;

const TECH_ICONS: Record<TechFeature["icon"], React.ElementType> = {
  voice: Mic,
  fota: Download,
  app: Smartphone,
  gps: Navigation,
  screen: Monitor,
  drive: Settings2,
  battery: Battery,
};

type Props = {
  detail: ScooterDetail;
  embedded?: boolean;
  adminEdit?: boolean;
  detailAccessories?: AccessoryProduct[];
};

export default function ScooterDetailPage({
  detail: initialDetail,
  embedded = false,
  adminEdit = false,
  detailAccessories = [],
}: Props) {
  const edit = useAdminEdit();
  const detail = (edit?.values as ScooterDetail | undefined) ?? initialDetail;
  const router = useRouter();
  const reduced = useReducedMotion();
  const relatedReveal = useSectionReveal(detailViewport);
  const servicesReveal = useSectionReveal(detailViewport);
  const modalMotion = useModalMotion();
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(
    detail.variants[Math.min(1, detail.variants.length - 1)]?.id ?? detail.variants[0].id,
  );
  const [selectedColor, setSelectedColor] = useState(detail.colors[0]?.id ?? "color-0");
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingService, setBookingService] = useState("Đăng ký lái thử");
  const [bookingForm, setBookingForm] = useState({ name: "", phone: "", email: "" });
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);
  const thumbStripRef = useRef<HTMLDivElement>(null);

  const [estimatorLocation, setEstimatorLocation] = useState("camau");
  const [estimatorTab, setEstimatorTab] = useState<"rolling" | "installment">("rolling");
  const [downPaymentPct, setDownPaymentPct] = useState(30);
  const [loanTermYears, setLoanTermYears] = useState(5);
  const [interestRate, setInterestRate] = useState(5.9);

  const variant = detail.variants.find((v) => v.id === selectedVariant) ?? detail.variants[0];
  const selectedColorObj = detail.colors.find((c) => c.id === selectedColor) ?? detail.colors[0];

  const handleColorSelect = useCallback(
    (colorId: string) => {
      setSelectedColor(colorId);
      const colorIndex = detail.colors.findIndex((c) => c.id === colorId);
      if (colorIndex >= 0 && colorIndex < detail.gallery.length) {
        setActiveImage(colorIndex);
      }
    },
    [detail.colors, detail.gallery],
  );

  useEffect(() => {
    if (detail.colors.length && !detail.colors.some((c) => c.id === selectedColor)) {
      setSelectedColor(detail.colors[0].id);
    }
  }, [detail.colors, selectedColor]);
  const related = getRelatedScooters(detail.id);

  const sectionNavItems = useMemo(
    () => [
      { id: "tong-quan" as const, label: "Tổng quan" },
      { id: "ngoai-that" as const, label: "Ngoại thất" },
      { id: "thiet-ke" as const, label: "Thiết kế" },
      { id: "cong-nghe" as const, label: "Công nghệ" },
      { id: "van-hanh" as const, label: "Vận hành" },
      { id: "an-toan" as const, label: "An toàn" },
      { id: "pin-sac" as const, label: "Pin & Sạc" },
      { id: "thong-so" as const, label: "Thông số" },
      { id: "phu-kien" as const, label: "Phụ kiện" },
      { id: "tai-chinh" as const, label: "Tài chính" },
      { id: "danh-gia" as const, label: "Đánh giá" },
    ],
    [],
  );

  const hiddenSections = useMemo(
    () => (adminEdit ? (edit?.hiddenSections ?? []) : readHiddenSections(detail)),
    [adminEdit, edit?.hiddenSections, detail],
  );
  const sectionLabels = useMemo(
    () => Object.fromEntries(sectionNavItems.map((item) => [item.id, item.label])),
    [sectionNavItems],
  );
  const visibleNavItems = useMemo(
    () => (adminEdit ? sectionNavItems : filterVisibleNavItems(sectionNavItems, hiddenSections)),
    [adminEdit, sectionNavItems, hiddenSections],
  );

  const quickSpecItems = useMemo(
    () =>
      buildQuickSpecBarItems(
        [
          {
            icon: Gauge,
            key: "range",
            label: "Quãng đường",
            value: `${detail.quickSpecs.range} km`,
          },
          {
            icon: Zap,
            key: "topSpeed",
            label: "Tốc độ tối đa",
            value: `${detail.quickSpecs.topSpeed} km/h`,
          },
          {
            icon: Bike,
            key: "motorPower",
            label: "Công suất",
            value: `${detail.quickSpecs.motorPower} W`,
          },
          {
            icon: Package,
            key: "trunk",
            label: "Cốp xe",
            value: detail.quickSpecs.trunk > 0 ? `${detail.quickSpecs.trunk} lít` : "Móc treo",
          },
          {
            icon: Scale,
            key: "weight",
            label: "Trọng lượng",
            value: `${detail.quickSpecs.weight} kg`,
          },
          {
            icon: BatteryCharging,
            key: "chargingTime",
            label: "Thời gian sạc",
            value: detail.quickSpecs.chargingTime.split(" (")[0] || "—",
          },
        ],
        adminEdit,
      ),
    [detail.quickSpecs, adminEdit],
  );

  const basePrice = variant.price;

  const rollingCost = useMemo(() => {
    const province = PROVINCES.find((p) => p.id === estimatorLocation) ?? PROVINCES[0];
    const registrationTax = Math.round(basePrice * province.rate);

    let plateFee = 150_000;
    if (province.id === "hanoi" || province.id === "hcm") {
      if (basePrice < 15_000_000) plateFee = 1_000_000;
      else if (basePrice <= 40_000_000) plateFee = 2_000_000;
      else plateFee = 4_000_000;
    } else if (basePrice < 15_000_000) plateFee = 150_000;
    else if (basePrice <= 40_000_000) plateFee = 400_000;
    else plateFee = 800_000;

    const inspectionFee = 100_000;
    const civilInsurance = 66_000;
    const totalRolling = basePrice + registrationTax + plateFee + inspectionFee + civilInsurance;

    return { registrationTax, plateFee, inspectionFee, civilInsurance, totalRolling };
  }, [basePrice, estimatorLocation]);

  const installment = useMemo(() => {
    const totalCost = rollingCost.totalRolling;
    const loanAmount = Math.round((totalCost * downPaymentPct) / 100);
    const upfrontAmount = totalCost - loanAmount;
    const monthlyRate = interestRate / 100 / 12;
    const months = loanTermYears * 12;
    const firstMonthInterest = Math.round(loanAmount * monthlyRate);
    const firstMonthPrincipal = Math.round(loanAmount / months);
    const firstMonthTotal = firstMonthInterest + firstMonthPrincipal;
    let totalPaid = 0;
    let tempLoan = loanAmount;
    for (let m = 0; m < months; m++) {
      const interest = tempLoan * monthlyRate;
      totalPaid += firstMonthPrincipal + interest;
      tempLoan -= firstMonthPrincipal;
    }
    const avgMonthlyPayment = Math.round(totalPaid / months);
    return {
      upfrontAmount,
      loanAmount,
      firstMonthInterest,
      firstMonthPrincipal,
      firstMonthTotal,
      avgMonthlyPayment,
    };
  }, [rollingCost.totalRolling, downPaymentPct, loanTermYears, interestRate]);

  const scrollToSection = useCallback((id: SectionId) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const prevImage = () => setActiveImage((i) => (i === 0 ? detail.gallery.length - 1 : i - 1));
  const nextImage = () => setActiveImage((i) => (i === detail.gallery.length - 1 ? 0 : i + 1));

  const scrollThumbs = useCallback((direction: -1 | 1) => {
    const el = thumbStripRef.current;
    if (!el) return;
    const thumb = el.querySelector<HTMLElement>("button");
    const step = thumb ? thumb.offsetWidth + 8 : 80;
    el.scrollBy({ left: direction * step * 3, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const el = thumbStripRef.current;
    const active = el?.children[activeImage] as HTMLElement | undefined;
    active?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [activeImage]);

  useEffect(() => {
    if (detail.gallery.length && activeImage >= detail.gallery.length) {
      setActiveImage(0);
    }
  }, [detail.gallery.length, activeImage]);

  const openBooking = (service: string) => {
    setBookingService(service);
    setBookingSubmitted(false);
    setBookingOpen(true);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.name || !bookingForm.phone) {
      toast.error("Vui lòng nhập họ tên và số điện thoại");
      return;
    }
    setBookingSubmitted(true);
    toast.success("Gửi yêu cầu thành công! Chúng tôi sẽ liên hệ sớm nhất.");
  };

  return (
    <div
      className={`relative min-h-screen overflow-x-hidden bg-background ${embedded ? "pb-8" : "pb-28 lg:pb-0"}`}
    >
      <Toaster position="top-center" richColors />
      <main>
        {embedded && !adminEdit ? (
          <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-xs font-medium text-amber-900">
            Chế độ xem trước — giao diện giống trang chi tiết trên website
          </div>
        ) : null}
        {adminEdit ? <AdminEditToolbar /> : null}
        <BreadcrumbBar scooterName={detail.name} variantName={variant.name} reduced={reduced} />

        <PdpHeroHeader
          tagline={detail.tagline}
          name={detail.name}
          slogan={detail.slogan}
          badges={detail.badges}
          isNew={detail.isNew}
          isBestSeller={detail.isBestSeller}
          adminEditable={adminEdit}
        />

        {/* Hero */}
        <section className="relative overflow-x-hidden border-b border-border/40 bg-white">
          <div className="container-vf relative w-full min-w-0 py-6 sm:py-8 lg:py-10">
            <div className="grid w-full min-w-0 gap-6 lg:grid-cols-12 lg:gap-10">
              {/* Gallery */}
              <motion.div
                className="min-w-0 w-full lg:col-span-7"
                variants={reduced ? undefined : detailHeroStagger}
                initial={reduced ? false : "hidden"}
                animate="visible"
              >
                <EditableHeroGallery
                  images={detail.gallery}
                  path="gallery"
                  activeImage={activeImage}
                  onActiveChange={setActiveImage}
                  onPrev={prevImage}
                  onNext={nextImage}
                  onZoom={() => setLightboxOpen(true)}
                  adminEditable={adminEdit}
                  fallbackImage={detail.image}
                  altLabel={`${detail.name} - ${selectedColorObj?.name ?? "ảnh"}`}
                  reduced={reduced}
                  thumbStripRef={thumbStripRef}
                  onScrollThumbs={scrollThumbs}
                  footer={<PdpQuickSpecBar specs={quickSpecItems} embedded />}
                />
              </motion.div>

              {/* Purchase panel — sticky on desktop */}
              <motion.div
                className="min-w-0 w-full lg:col-span-5"
                variants={reduced ? undefined : detailHeroCol}
                initial={reduced ? false : "hidden"}
                animate="visible"
              >
                <div className="page-showcase-shell box-border w-full min-w-0 max-w-full rounded-[1.75rem] p-4 sm:p-5 lg:sticky lg:top-[8.75rem] lg:p-6">
                  <div className="flex items-start justify-between gap-2 sm:gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-semibold text-muted-foreground sm:text-[10px] sm:font-bold sm:uppercase sm:tracking-wider">
                        Giá bán từ
                      </p>
                      <div className="mt-0.5">
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={selectedVariant}
                            variants={reduced ? undefined : detailPricePulse}
                            initial={reduced ? false : "hidden"}
                            animate="visible"
                            className="block break-all text-lg font-black tabular-nums leading-tight text-brand sm:inline sm:break-normal sm:text-2xl lg:text-4xl"
                          >
                            {adminEdit && edit?.editMode ? (
                              <EditablePrice
                                value={variant.price}
                                onChange={(p) => edit.update({ price: p, variantId: variant.id })}
                                className="text-lg font-black sm:text-2xl lg:text-4xl"
                              />
                            ) : (
                              formatPrice(variant.price)
                            )}
                          </motion.span>
                        </AnimatePresence>
                        <span className="mt-0.5 block text-xs font-bold text-muted-foreground sm:mt-0 sm:ml-1.5 sm:inline sm:text-base">
                          VND
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => toast.info("Chức năng chia sẻ sẽ sớm có mặt")}
                      className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition hover:border-brand hover:text-brand"
                      aria-label="Chia sẻ"
                    >
                      <Share2 className="size-4" />
                    </button>
                  </div>

                  {/* Quick highlights — desktop only */}
                  <div className="mt-4 hidden grid-cols-3 gap-2 rounded-xl bg-surface p-3 lg:grid">
                    <EditableHighlightStat
                      icon={Gauge}
                      specKey="range"
                      value={`${detail.quickSpecs.range} km`}
                      label="Quãng đường"
                      adminEditable={adminEdit}
                    />
                    <EditableHighlightStat
                      icon={Zap}
                      specKey="topSpeed"
                      value={`${detail.quickSpecs.topSpeed}`}
                      label="km/h tối đa"
                      adminEditable={adminEdit}
                    />
                    <EditableHighlightStat
                      icon={Package}
                      specKey="trunk"
                      value={
                        detail.quickSpecs.trunk > 0 ? `${detail.quickSpecs.trunk}L` : "Móc treo"
                      }
                      label="Cốp xe"
                      adminEditable={adminEdit}
                    />
                  </div>

                  {/* Mobile config toggle */}
                  <button
                    type="button"
                    onClick={() => setConfigOpen((o) => !o)}
                    className="mt-4 flex w-full items-center justify-between gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-left transition hover:border-brand/40 lg:hidden"
                    aria-expanded={configOpen}
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-brand-dark">Cấu hình xe</p>
                      <p className="mt-0.5 truncate text-[11px] font-medium text-muted-foreground">
                        {variant.name} · {selectedColorObj?.name}
                      </p>
                    </div>
                    <ChevronDown
                      className={`size-4 shrink-0 text-muted-foreground transition ${configOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  <div
                    className={`mt-4 space-y-4 ${configOpen ? "block" : "hidden"} lg:mt-6 lg:block lg:space-y-6`}
                  >
                    {/* Variants */}
                    <div>
                      <p className="mb-2.5 text-[11px] font-semibold text-brand-dark sm:mb-3 sm:text-[10px] sm:font-bold sm:uppercase sm:tracking-wider">
                        Chọn phiên bản
                      </p>
                      <div className="space-y-2">
                        {detail.variants.map((v, vi) => {
                          const selected = selectedVariant === v.id;
                          return (
                            <button
                              key={v.id}
                              type="button"
                              onClick={() => setSelectedVariant(v.id)}
                              className={`flex w-full flex-col gap-1 rounded-xl border-2 px-3 py-2.5 text-left transition lg:flex-row lg:items-center lg:justify-between lg:px-4 lg:py-3 ${
                                selected
                                  ? "border-brand bg-brand/5 shadow-sm"
                                  : "border-border hover:border-brand/40"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span
                                  className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${
                                    selected ? "border-brand bg-brand" : "border-border"
                                  }`}
                                >
                                  {selected && <Check size={12} className="text-white" />}
                                </span>
                                <span className="text-sm font-semibold text-brand-dark">
                                  <InlineText
                                    path={`variants.${vi}.name`}
                                    fallback={v.name}
                                    adminEditable={adminEdit}
                                    className="text-sm font-semibold text-brand-dark"
                                  />
                                </span>
                              </div>
                              <span className="pl-8 text-xs font-bold tabular-nums text-muted-foreground lg:pl-0">
                                {adminEdit && edit?.editMode ? (
                                  <EditablePrice
                                    value={v.price}
                                    onChange={(p) => edit.update({ price: p, variantId: v.id })}
                                    className="text-xs font-bold"
                                  />
                                ) : (
                                  <>{formatPrice(v.price)} đ</>
                                )}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Colors */}
                    <div>
                      <p className="mb-2.5 text-[11px] font-semibold text-brand-dark sm:mb-3 sm:text-[10px] sm:font-bold sm:uppercase sm:tracking-wider">
                        Chọn màu sắc
                      </p>
                      <EditableColorPicker
                        colors={detail.colors}
                        adminEditable={adminEdit}
                        selectedColor={selectedColor}
                        onSelectColor={handleColorSelect}
                        selectedColorName={selectedColorObj?.name}
                        withImage={false}
                      />
                    </div>
                  </div>

                  {/* Estimated rolling cost preview */}
                  <div className="mt-4 w-full min-w-0 rounded-xl border border-brand/20 bg-brand/5 p-3 sm:mt-5 sm:p-4">
                    <p className="text-[11px] font-semibold text-brand sm:text-[10px] sm:font-bold sm:uppercase sm:tracking-wider">
                      Chi phí lăn bánh dự kiến
                    </p>
                    <div className="mt-1">
                      <span className="block break-all text-base font-black tabular-nums leading-tight text-brand-dark sm:inline sm:break-normal sm:text-xl">
                        {formatPrice(rollingCost.totalRolling)}
                      </span>
                      <span className="mt-0.5 block text-xs font-semibold text-muted-foreground sm:mt-0 sm:ml-1.5 sm:inline">
                        VND
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => scrollToSection("tai-chinh")}
                      className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-brand hover:underline"
                    >
                      Xem chi tiết tính toán <ChevronDown className="size-3.5 rotate-[-90deg]" />
                    </button>
                  </div>

                  {/* CTAs */}
                  <div className="mt-6 hidden flex-col gap-2.5 lg:flex">
                    <button
                      type="button"
                      onClick={() => openBooking("Đặt mua ngay")}
                      className={pdpCtaPrimary}
                    >
                      ĐẶT MUA NGAY
                    </button>
                    <button
                      type="button"
                      onClick={() => openBooking("Đăng ký lái thử")}
                      className={pdpCtaSecondary}
                    >
                      ĐĂNG KÝ LÁI THỬ
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <SectionVisibilityProvider
          hidden={hiddenSections}
          editMode={adminEdit}
          labels={sectionLabels}
          toggle={edit?.toggleSectionHidden}
        >
          <PdpSectionNav
            items={visibleNavItems}
            hiddenIds={adminEdit ? hiddenSections : undefined}
          />

          {/* All content sections */}
          <div className="bg-white">
            <SectionWrap id="tong-quan">
              <OverviewSection detail={detail} adminEditable={adminEdit} />
            </SectionWrap>

            <SectionWrap id="ngoai-that" alt>
              <ExteriorSection detail={detail} adminEditable={adminEdit} />
            </SectionWrap>

            <SectionWrap id="thiet-ke">
              <DesignSection detail={detail} adminEditable={adminEdit} />
            </SectionWrap>

            <SectionWrap id="cong-nghe" alt>
              <TechnologySection detail={detail} adminEditable={adminEdit} />
            </SectionWrap>

            <SectionWrap id="van-hanh" alt>
              <PerformanceSection detail={detail} adminEditable={adminEdit} />
            </SectionWrap>

            <SectionWrap id="an-toan">
              <SafetySection detail={detail} adminEditable={adminEdit} />
            </SectionWrap>

            <SectionWrap id="pin-sac" alt>
              <ChargingSection detail={detail} adminEditable={adminEdit} />
            </SectionWrap>

            <SectionWrap id="thong-so">
              <SpecsSection detail={detail} adminEditable={adminEdit} />
            </SectionWrap>

            <SectionWrap id="phu-kien" alt>
              <AccessoriesSection
                detail={detail}
                products={detailAccessories}
                adminEditable={adminEdit}
              />
            </SectionWrap>

            <SectionWrap id="tai-chinh">
              <FinanceSection
                detail={detail}
                variant={variant}
                adminEditable={adminEdit}
                estimatorLocation={estimatorLocation}
                setEstimatorLocation={setEstimatorLocation}
                estimatorTab={estimatorTab}
                setEstimatorTab={setEstimatorTab}
                downPaymentPct={downPaymentPct}
                setDownPaymentPct={setDownPaymentPct}
                loanTermYears={loanTermYears}
                setLoanTermYears={setLoanTermYears}
                interestRate={interestRate}
                setInterestRate={setInterestRate}
                rollingCost={rollingCost}
                installment={installment}
                onBook={() => openBooking("Nhận báo giá")}
              />
            </SectionWrap>

            <SectionWrap id="danh-gia" alt>
              <ReviewsSection detail={detail} adminEditable={adminEdit} />
            </SectionWrap>
          </div>
        </SectionVisibilityProvider>

        {/* Related products */}
        <section className="section-y border-t border-border/40 bg-surface">
          <div className="container-vf">
            <InlineSectionTitle
              titlePath="_section.related.title"
              titleFallback="Sản phẩm liên quan"
              subtitlePath="_section.related.subtitle"
              subtitleFallback="Khám phá thêm các mẫu xe VinFast phù hợp với nhu cầu của bạn"
              adminEditable={adminEdit}
            />
            <motion.div
              ref={relatedReveal.ref}
              className="mt-8 grid grid-cols-2 items-stretch gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5"
              initial={relatedReveal.initial}
              animate={relatedReveal.animate}
              variants={reduced ? undefined : { hidden: {}, visible: {} }}
            >
              {related.map((scooter, i) => (
                <motion.div
                  key={scooter.id}
                  custom={i}
                  variants={reduced ? undefined : detailRelatedCard}
                  className="h-full"
                >
                  <ScooterCatalogCard
                    scooter={scooter}
                    onBookDrive={() => openBooking(`Đặt mua ${scooter.name}`)}
                    onEstimatePrice={() => router.push(`${scooterDetailPath(scooter)}#tai-chinh`)}
                  />
                </motion.div>
              ))}
            </motion.div>
            <div className="mt-8 text-center">
              <Link href="/xe-may-dien" className={pdpCtaInline}>
                Xem tất cả xe máy điện <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Service bar */}
        <section className="section-y border-t border-border/40 bg-white">
          <div className="container-vf">
            <motion.div
              ref={servicesReveal.ref}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
              initial={servicesReveal.initial}
              animate={servicesReveal.animate}
              variants={reduced ? undefined : { hidden: {}, visible: {} }}
            >
              {SERVICE_BAR.map(({ icon: Icon, title, sub }, i) => (
                <motion.div
                  key={title}
                  custom={i}
                  variants={reduced ? undefined : detailServiceItem}
                  className="flex items-center gap-4 rounded-2xl border border-border/50 bg-surface p-4 transition hover:shadow-soft"
                >
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-brand/20 bg-brand/5">
                    <Icon className="size-5 text-brand" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-brand-dark">{title}</p>
                    <p className="text-[11px] text-muted-foreground">{sub}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Showroom CTA */}
        <section className="section-y bg-brand-dark text-white">
          <div className="container-vf flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
            <div className="flex-1">
              <h2 className={`${vfSectionHeadingLeft} text-white`}>
                Trải nghiệm {detail.name} tại showroom
              </h2>
              <p className="mt-2 text-sm text-white/75">
                VinFast Ngọc Anh Cà Mau — Đại lý ủy quyền chính thức VinFast. Tư vấn tận tâm, giao
                xe nhanh chóng.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a href={HOTLINE_TEL} className={pdpCtaInlineLight}>
                <Phone className="size-4" /> Gọi {HOTLINE}
              </a>
              <button
                type="button"
                onClick={() => openBooking("Đăng ký lái thử")}
                className={pdpCtaInlineGhost}
              >
                <Calendar className="size-4" /> Đặt lịch lái thử
              </button>
            </div>
          </div>
        </section>
      </main>

      {!embedded ? (
        <>
          <FloatingButtons />

          {/* Mobile sticky bar */}
          <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border/60 bg-white lg:hidden">
            <div className="flex items-center gap-2 p-3">
              <div className="min-w-0 shrink">
                <p className="text-[9px] font-bold tracking-wider text-muted-foreground uppercase">
                  Giá từ
                </p>
                <p className="truncate text-sm font-black text-brand">
                  {formatPrice(variant.price)} đ
                </p>
              </div>
              <button
                type="button"
                onClick={() => openBooking("Đăng ký lái thử")}
                className={`flex-1 ${pdpCtaSecondary} py-2.5 text-[11px]`}
              >
                LÁI THỬ
              </button>
              <button
                type="button"
                onClick={() => openBooking("Đặt mua ngay")}
                className={`flex-1 ${pdpCtaPrimary} py-2.5 text-[11px]`}
              >
                ĐẶT MUA
              </button>
            </div>
          </div>
        </>
      ) : null}

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            {...modalMotion.overlay}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            >
              <X className="size-5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute top-1/2 left-4 flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white"
            >
              <ChevronLeft className="size-6" />
            </button>
            <motion.img
              key={activeImage}
              src={detail.gallery[activeImage]}
              alt={detail.name}
              {...modalMotion.panel}
              className="max-h-[85vh] max-w-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute top-1/2 right-4 flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white"
            >
              <ChevronRight className="size-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking modal */}
      <AnimatePresence>
        {bookingOpen && (
          <motion.div
            {...modalMotion.overlay}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={() => setBookingOpen(false)}
          >
            <motion.div
              {...modalMotion.panel}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[90vh] w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between bg-brand-dark p-5 text-white">
                <div>
                  <h3 className="text-sm font-black">{bookingService.toUpperCase()}</h3>
                  <p className="mt-1 text-[11px] text-white/75">
                    {variant.name} · {selectedColorObj?.name}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setBookingOpen(false)}
                  className="rounded-lg p-1 hover:bg-white/10"
                >
                  <X className="size-5" />
                </button>
              </div>

              {bookingSubmitted ? (
                <div className="p-8 text-center">
                  <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100">
                    <Check className="size-8 text-emerald-600" />
                  </div>
                  <h4 className="mt-4 text-lg font-black text-brand-dark">
                    Gửi yêu cầu thành công!
                  </h4>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Cảm ơn {bookingForm.name}. Chúng tôi sẽ liên hệ qua {bookingForm.phone} trong
                    vòng 24 giờ.
                  </p>
                  <button
                    type="button"
                    onClick={() => setBookingOpen(false)}
                    className={`mt-6 ${pdpCtaPrimary} w-auto px-6 py-3`}
                  >
                    Đóng
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleBookingSubmit}
                  className="max-h-[calc(90vh-5.5rem)] space-y-4 overflow-y-auto overscroll-contain p-6"
                >
                  <div className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3">
                    <div className="size-14 shrink-0 overflow-hidden rounded-lg">
                      <img
                        src={detail.image}
                        alt={detail.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-brand-dark">{detail.name}</p>
                      <p className="text-xs text-muted-foreground">{variant.name}</p>
                      <p className="text-xs font-bold text-brand">
                        {formatPrice(variant.price)} VND
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {["Đăng ký lái thử", "Đặt mua ngay", "Nhận báo giá", "Tư vấn trả góp"].map(
                      (svc) => (
                        <button
                          key={svc}
                          type="button"
                          onClick={() => setBookingService(svc)}
                          className={`rounded-lg border px-3 py-1.5 text-[11px] font-bold transition ${
                            bookingService === svc
                              ? "border-brand bg-brand/5 text-brand"
                              : "border-border text-muted-foreground hover:border-brand/40"
                          }`}
                        >
                          {svc}
                        </button>
                      ),
                    )}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold text-muted-foreground uppercase">
                      Họ và tên *
                    </label>
                    <input
                      required
                      value={bookingForm.name}
                      onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                      placeholder="Nguyễn Văn A"
                      className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold text-muted-foreground uppercase">
                      Số điện thoại *
                    </label>
                    <input
                      required
                      type="tel"
                      value={bookingForm.phone}
                      onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                      placeholder="09xx xxx xxx"
                      className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold text-muted-foreground uppercase">
                      Email (tùy chọn)
                    </label>
                    <input
                      type="email"
                      value={bookingForm.email}
                      onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                      placeholder="email@example.com"
                      className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
                    />
                  </div>

                  <button type="submit" className={pdpCtaPrimary}>
                    GỬI YÊU CẦU
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Section wrappers & content ─── */

function SectionWrap({
  id,
  alt,
  dark,
  children,
}: {
  id: SectionId;
  alt?: boolean;
  dark?: boolean;
  children: React.ReactNode;
}) {
  const variant = dark ? "dark" : alt ? "muted" : "default";
  return (
    <EditableSectionWrap id={id} variant={variant}>
      {children}
    </EditableSectionWrap>
  );
}

const EXTERIOR_GRID_LABELS = [
  "Đầu xe ấn tượng",
  "Thân xe thon gọn",
  "Đuôi xe tinh tế",
  "Chi tiết thiết kế",
];

const DESIGN_GRID_LABELS = [
  "Không gian ngồi",
  "Cốp & tiện ích",
  "Bảng đồng hồ",
  "Chi tiết tiện nghi",
];

function OverviewSection({
  detail,
  adminEditable,
}: {
  detail: ScooterDetail;
  adminEditable?: boolean;
}) {
  const overviewImage = detail.overview.image || detail.gallery[0] || detail.image;

  return (
    <PdpSplitOverview
      eyebrow="Tổng quan"
      title={
        <InlineText
          path="overview.title"
          fallback={detail.overview.title}
          adminEditable={adminEditable}
          label="Tiêu đề tổng quan"
        />
      }
      description={
        <InlineText
          path="overview.subtitle"
          fallback={detail.overview.subtitle}
          adminEditable={adminEditable}
          multiline
          label="Mô tả tổng quan"
        />
      }
      bullets={adminEditable ? [] : detail.overview.bullets}
      bulletsContent={
        adminEditable ? (
          <EditableBulletList
            bullets={detail.overview.bullets}
            path="overview.bullets"
            adminEditable={adminEditable}
          />
        ) : undefined
      }
      image={overviewImage}
      imageSlot={
        adminEditable ? (
          <EditableOverviewImage
            path="overview.image"
            src={overviewImage}
            alt={detail.overview.title}
            adminEditable={adminEditable}
          />
        ) : undefined
      }
      imageAlt={detail.overview.title}
    />
  );
}

function ExteriorSection({
  detail,
  adminEditable,
}: {
  detail: ScooterDetail;
  adminEditable?: boolean;
}) {
  return (
    <>
      <InlineSectionTitle
        titlePath="_section.exterior.title"
        titleFallback="Ngoại thất"
        subtitlePath="_section.exterior.subtitle"
        subtitleFallback="Thiết kế ấn tượng, khí động học tối ưu"
        adminEditable={adminEditable}
      />
      <EditableFeatureGridSection
        path="exterior"
        items={detail.exterior}
        adminEditable={adminEditable}
        fallbackImage={detail.image}
        labels={EXTERIOR_GRID_LABELS}
        expandToGrid={expandFeatureItemsForGrid}
      />
    </>
  );
}

function DesignSection({
  detail,
  adminEditable,
}: {
  detail: ScooterDetail;
  adminEditable?: boolean;
}) {
  return (
    <>
      <InlineSectionTitle
        titlePath="_section.design.title"
        titleFallback="Thiết kế & Tiện nghi"
        subtitlePath="_section.design.subtitle"
        subtitleFallback="Thiết kế ergonomic, tiện dụng cho đô thị"
        adminEditable={adminEditable}
      />
      <EditableFeatureGridSection
        path="design"
        items={detail.design}
        adminEditable={adminEditable}
        fallbackImage={detail.image}
        labels={DESIGN_GRID_LABELS}
        expandToGrid={expandFeatureItemsForGrid}
      />
    </>
  );
}

function TechnologySection({
  detail,
  adminEditable,
}: {
  detail: ScooterDetail;
  adminEditable?: boolean;
}) {
  const base = detail.technology.map((item) => ({
    icon: TECH_ICONS[item.icon],
    iconSvg: item.iconSvg,
    title: item.title,
    desc: item.desc,
  }));

  return (
    <>
      <PdpSectionTitle
        title={
          <InlineText
            path="_section.technology.title"
            fallback="Công nghệ thông minh"
            adminEditable={adminEditable}
            className={vfSectionHeadingLeft}
          />
        }
        subtitle={
          <InlineText
            path="technologySubtitle"
            fallback="Hệ sinh thái kết nối toàn diện"
            adminEditable={adminEditable}
            className="text-sm text-muted-foreground sm:text-[15px]"
            multiline
          />
        }
      />
      {adminEditable ? (
        <EditableTechGridSection path="technology" items={base} adminEditable={adminEditable} />
      ) : (
        <PdpTechIconGrid items={base} />
      )}
    </>
  );
}

function PerformanceSection({
  detail,
  adminEditable,
}: {
  detail: ScooterDetail;
  adminEditable?: boolean;
}) {
  const edit = useAdminEdit();
  const perfImage =
    detail.performance.image !== detail.image
      ? detail.performance.image
      : (detail.gallery[2] ?? detail.gallery[0] ?? detail.image);

  const driveModes = detail.performance.driveModes.map((mode, i) => ({
    name: (
      <InlineText
        path={`performance.driveModes.${i}.name`}
        fallback={mode.name}
        adminEditable={adminEditable}
        className="text-xs font-black text-brand"
      />
    ),
    desc: (
      <InlineText
        path={`performance.driveModes.${i}.desc`}
        fallback={mode.desc}
        adminEditable={adminEditable}
        className="text-[10px] leading-snug text-muted-foreground"
        multiline
      />
    ),
    editSlot:
      adminEditable && edit?.editMode ? (
        <EditableListControls
          path="performance.driveModes"
          index={i}
          minItems={1}
          adminEditable
          label="chế độ"
          onAdd={() => undefined}
        />
      ) : undefined,
  }));

  return (
    <>
      <PdpSectionTitle
        title={
          <InlineText
            path="performance.title"
            fallback={detail.performance.title}
            adminEditable={adminEditable}
            className={vfSectionHeadingLeft}
          />
        }
        subtitle={
          <InlineText
            path="performance.subtitle"
            fallback={detail.performance.subtitle}
            adminEditable={adminEditable}
            className="text-sm text-muted-foreground sm:text-[15px]"
            multiline
          />
        }
      />
      <PdpPerformanceShowcase
        lead={
          <InlineText
            path="performance.subtitle"
            fallback={detail.performance.subtitle}
            adminEditable={adminEditable}
            className="text-base leading-relaxed text-muted-foreground sm:text-[15px]"
            multiline
          />
        }
        image={perfImage}
        imageSlot={
          adminEditable ? (
            <EditableImage
              path="performance.image"
              src={perfImage}
              adminEditable={adminEditable}
              pickOnFab
              className="absolute inset-0 h-full w-full"
              imgClassName="absolute inset-0 h-full w-full object-cover object-center"
            />
          ) : undefined
        }
        imageAlt={detail.performance.title}
        metrics={mapEditableMetrics(
          buildScooterPerformanceMetrics(detail.quickSpecs),
          "_perfMetrics",
          adminEditable,
        )}
        driveModes={driveModes}
      />
      {adminEditable && edit?.editMode ? (
        <EditableListControls
          path="performance.driveModes"
          adminEditable
          label="chế độ lái"
          onAdd={() => edit.addListItem("performance.driveModes", DEFAULT_DRIVE_MODE())}
        />
      ) : null}
    </>
  );
}

function safetyIconFor(title: string): React.ElementType {
  const t = title.toLowerCase();
  if (/đèn|led/i.test(t)) return Monitor;
  if (/phanh|abs/i.test(t)) return Shield;
  if (/va chạm|cảnh báo/i.test(t)) return Shield;
  if (/khóa|gps|chống trộm/i.test(t)) return Navigation;
  if (/khung|nước|ip67/i.test(t)) return Shield;
  return Shield;
}

function SafetySection({
  detail,
  adminEditable,
}: {
  detail: ScooterDetail;
  adminEditable?: boolean;
}) {
  const safetyImage =
    detail.safety.image !== detail.image
      ? detail.safety.image
      : (detail.gallery[1] ?? detail.gallery[0] ?? detail.image);

  const base = detail.safety.features.map((f) => ({
    icon: safetyIconFor(f.title),
    title: f.title,
    desc: f.desc,
  }));

  const titleNode = (
    <InlineText
      path="safety.title"
      fallback={detail.safety.title}
      adminEditable={adminEditable}
      className={vfSectionHeadingLeft}
    />
  );
  const subtitleNode = (
    <InlineText
      path="safety.subtitle"
      fallback={detail.safety.subtitle}
      adminEditable={adminEditable}
      className="text-sm text-muted-foreground sm:text-[15px]"
      multiline
    />
  );

  return (
    <>
      <PdpSectionTitle title={titleNode} subtitle={subtitleNode} />
      <PdpSafetyShowcase
        title={titleNode}
        subtitle={subtitleNode}
        image={safetyImage}
        imageSlot={
          adminEditable ? (
            <EditableImage
              path="safety.image"
              src={safetyImage}
              adminEditable={adminEditable}
              pickOnFab
              className="absolute inset-0 h-full w-full"
              imgClassName="absolute inset-0 h-full w-full object-cover"
            />
          ) : undefined
        }
        imageAlt={detail.safety.title}
        highlights={editableHighlights(
          detail.safety.highlights,
          "safety.highlights",
          adminEditable,
        )}
        features={adminEditable ? undefined : base}
        featuresSlot={
          adminEditable ? (
            <EditableTechGridSection
              path="safety.features"
              items={base}
              adminEditable={adminEditable}
            />
          ) : undefined
        }
      />
    </>
  );
}

function ChargingSection({
  detail,
  adminEditable,
}: {
  detail: ScooterDetail;
  adminEditable?: boolean;
}) {
  const edit = useAdminEdit();
  const heroImage = detail.gallery[0] ?? detail.image;
  const defaultDesc = `Pin ${detail.batteryType} — sạc đầy trong ${detail.quickSpecs.chargingTime}. Hỗ trợ sạc tại nhà và trạm V-Green trên toàn quốc.`;
  const solutions = DEFAULT_CHARGING_SOLUTIONS({
    station: IMAGES.chargingStations,
    home: IMAGES.chargingScooter,
    portable: IMAGES.portableCharger,
  });

  const solutionItems = solutions.map((s, i) => ({
    title: adminEditable ? (
      <InlineText
        path={`_chargingSolutions.${i}.title`}
        fallback={typeof s.title === "string" ? s.title : ""}
        adminEditable={adminEditable}
        className={vfCardTitleSm}
      />
    ) : (
      s.title
    ),
    desc: adminEditable ? (
      <InlineText
        path={`_chargingSolutions.${i}.desc`}
        fallback={typeof s.desc === "string" ? s.desc : ""}
        adminEditable={adminEditable}
        className="text-xs leading-relaxed text-muted-foreground sm:text-sm"
        multiline
      />
    ) : (
      s.desc
    ),
    image: s.image,
    imageSlot:
      adminEditable && edit?.editMode ? (
        <EditableImage
          path={`_chargingSolutions.${i}.image`}
          src={s.image}
          adminEditable={adminEditable}
          className="h-full w-full"
          imgClassName="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
      ) : undefined,
    editSlot:
      adminEditable && edit?.editMode ? (
        <EditableListControls
          path="_chargingSolutions"
          index={i}
          minItems={1}
          adminEditable
          label="giải pháp"
          onAdd={() => undefined}
        />
      ) : undefined,
  }));

  return (
    <>
      <PdpChargingShowcase
        title={
          <InlineText
            path="_section.charging.title"
            fallback="Pin & Sạc"
            adminEditable={adminEditable}
            className={vfSectionHeadingLeft}
          />
        }
        description={
          <InlineText
            path="_section.charging.desc"
            fallback={defaultDesc}
            adminEditable={adminEditable}
            className="text-sm text-muted-foreground sm:text-[15px]"
            multiline
          />
        }
        heroImage={heroImage}
        heroImageSlot={
          adminEditable ? (
            <EditableImage
              path="gallery.0"
              src={heroImage}
              adminEditable={adminEditable}
              className="aspect-[16/9] w-full"
              imgClassName="aspect-[16/9] w-full object-cover"
            />
          ) : undefined
        }
        solutions={solutionItems}
      />
      {adminEditable && edit?.editMode ? (
        <EditableListControls
          path="_chargingSolutions"
          adminEditable
          label="giải pháp sạc"
          onAdd={() =>
            edit.addListItem("_chargingSolutions", {
              title: "Giải pháp mới",
              desc: "Mô tả giải pháp sạc...",
              image: heroImage,
            })
          }
        />
      ) : null}
    </>
  );
}

function SpecsSection({
  detail,
  adminEditable,
}: {
  detail: ScooterDetail;
  adminEditable?: boolean;
}) {
  const edit = useAdminEdit();
  const [expanded, setExpanded] = useState<string | null>(detail.specGroups[0]?.category ?? null);

  return (
    <>
      <InlineSectionTitle
        titlePath="_section.specs.title"
        titleFallback="Thông số kỹ thuật"
        subtitlePath="_section.specs.subtitle"
        subtitleFallback="Thông tin chi tiết đầy đủ"
        adminEditable={adminEditable}
      />
      <div className="mx-auto mt-8 max-w-3xl space-y-3 lg:mt-10">
        {detail.specGroups.map((group, gi) => {
          const isOpen = expanded === group.category;
          return (
            <div
              key={`spec-group-${gi}`}
              className="relative overflow-hidden rounded-2xl border border-border/60 bg-white shadow-soft"
            >
              {adminEditable && edit?.editMode ? (
                <EditableListControls
                  path="specGroups"
                  index={gi}
                  minItems={1}
                  adminEditable
                  label="nhóm thông số"
                  onAdd={() => undefined}
                />
              ) : null}
              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : group.category)}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
              >
                <h3 className="text-sm font-black text-brand-dark">
                  <InlineText
                    path={`specGroups.${gi}.category`}
                    fallback={group.category}
                    adminEditable={adminEditable}
                    className="text-sm font-black text-brand-dark"
                  />
                </h3>
                <ChevronDown
                  className={`size-4 text-muted-foreground transition ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="divide-y divide-border/40 border-t border-border/40">
                      {group.items.map((item, ii) => (
                        <div
                          key={`spec-${gi}-${ii}`}
                          className="relative flex flex-col gap-1 px-5 py-3 sm:flex-row sm:items-center sm:justify-between"
                        >
                          {adminEditable && edit?.editMode ? (
                            <EditableListControls
                              path={`specGroups.${gi}.items`}
                              index={ii}
                              minItems={1}
                              adminEditable
                              label="thông số"
                              onAdd={() => undefined}
                            />
                          ) : null}
                          <span className="text-xs text-muted-foreground">
                            <InlineText
                              path={`specGroups.${gi}.items.${ii}.label`}
                              fallback={item.label}
                              adminEditable={adminEditable}
                              className="text-xs text-muted-foreground"
                            />
                          </span>
                          <span className="text-xs font-semibold text-brand-dark sm:text-right">
                            <InlineText
                              path={`specGroups.${gi}.items.${ii}.value`}
                              fallback={item.value}
                              adminEditable={adminEditable}
                              className="text-xs font-semibold text-brand-dark"
                            />
                          </span>
                        </div>
                      ))}
                      {adminEditable && edit?.editMode ? (
                        <div className="px-5 py-3">
                          <EditableListControls
                            path={`specGroups.${gi}.items`}
                            adminEditable
                            label="thông số"
                            onAdd={() =>
                              edit.addListItem(`specGroups.${gi}.items`, DEFAULT_SPEC_ITEM())
                            }
                          />
                        </div>
                      ) : null}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
      {adminEditable && edit?.editMode ? (
        <EditableListControls
          path="specGroups"
          adminEditable
          label="nhóm thông số"
          onAdd={() => edit.addListItem("specGroups", DEFAULT_SPEC_GROUP())}
        />
      ) : null}
    </>
  );
}

function AccessoriesSection({
  detail: _detail,
  products,
  adminEditable,
}: {
  detail: ScooterDetail;
  products: AccessoryProduct[];
  adminEditable?: boolean;
}) {
  return (
    <>
      <InlineSectionTitle
        titlePath="_section.accessories.title"
        titleFallback="Phụ kiện chính hãng"
        subtitlePath="_section.accessories.subtitle"
        subtitleFallback="Nâng tầm trải nghiệm lái xe"
        adminEditable={adminEditable}
      />
      <div className="mt-8 grid grid-cols-2 items-stretch gap-3 sm:gap-6 lg:grid-cols-4">
        {products.slice(0, 4).map((product) => (
          <AccessoryProductCard key={product.id} product={product} compact />
        ))}
      </div>
      <div className="mt-8 text-center">
        <Link
          href="/phu-kien"
          className="inline-flex items-center gap-2 rounded-xl border border-brand bg-white px-6 py-3 text-xs font-bold tracking-wide text-brand transition hover:bg-brand/5"
        >
          Xem tất cả phụ kiện <ArrowRight className="size-4" />
        </Link>
      </div>
    </>
  );
}

type FinanceProps = {
  detail: ScooterDetail;
  variant: { name: string; price: number };
  adminEditable?: boolean;
  estimatorLocation: string;
  setEstimatorLocation: (v: string) => void;
  estimatorTab: "rolling" | "installment";
  setEstimatorTab: (v: "rolling" | "installment") => void;
  downPaymentPct: number;
  setDownPaymentPct: (v: number) => void;
  loanTermYears: number;
  setLoanTermYears: (v: number) => void;
  interestRate: number;
  setInterestRate: (v: number) => void;
  rollingCost: {
    registrationTax: number;
    plateFee: number;
    inspectionFee: number;
    civilInsurance: number;
    totalRolling: number;
  };
  installment: {
    upfrontAmount: number;
    loanAmount: number;
    firstMonthInterest: number;
    firstMonthPrincipal: number;
    firstMonthTotal: number;
    avgMonthlyPayment: number;
  };
  onBook: () => void;
};

function FinanceSection({
  detail,
  variant,
  adminEditable,
  estimatorLocation,
  setEstimatorLocation,
  estimatorTab,
  setEstimatorTab,
  downPaymentPct,
  setDownPaymentPct,
  loanTermYears,
  setLoanTermYears,
  interestRate,
  setInterestRate,
  rollingCost,
  installment,
  onBook,
}: FinanceProps) {
  return (
    <>
      <div className="mx-auto max-w-3xl text-center">
        <InlineSectionTitle
          titlePath="_section.finance.title"
          titleFallback="Tài chính & Chi phí lăn bánh"
          subtitlePath="_section.finance.subtitle"
          subtitleFallback={`Tính toán chi phí cho ${variant.name}`}
          adminEditable={adminEditable}
        />
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-border/60 bg-white shadow-card">
        <div className="grid lg:grid-cols-12">
          {/* Settings */}
          <div className="border-b border-border/50 p-4 sm:p-6 lg:col-span-5 lg:border-r lg:border-b-0">
            <div className="mb-5 flex rounded-xl border border-border bg-surface p-1">
              <button
                type="button"
                onClick={() => setEstimatorTab("rolling")}
                className={`flex-1 rounded-lg py-2 text-[11px] font-bold transition ${
                  estimatorTab === "rolling"
                    ? "bg-brand text-white shadow"
                    : "text-muted-foreground"
                }`}
              >
                <Calculator className="mr-1 inline size-3.5" /> Lăn bánh
              </button>
              <button
                type="button"
                onClick={() => setEstimatorTab("installment")}
                className={`flex-1 rounded-lg py-2 text-[11px] font-bold transition ${
                  estimatorTab === "installment"
                    ? "bg-brand text-white shadow"
                    : "text-muted-foreground"
                }`}
              >
                <Percent className="mr-1 inline size-3.5" /> Trả góp
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="mb-2 text-[10px] font-bold text-muted-foreground uppercase">
                  Khu vực đăng ký
                </p>
                <Select value={estimatorLocation} onValueChange={setEstimatorLocation}>
                  <SelectTrigger className="w-full text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PROVINCES.map((p) => (
                      <SelectItem key={p.id} value={p.id} className="text-xs">
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <label className="flex cursor-pointer items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  Chi phí đăng ký xe máy điện theo quy định từng tỉnh/thành
                </span>
              </label>

              {estimatorTab === "installment" && (
                <>
                  <div>
                    <div className="mb-2 flex justify-between text-[10px] font-bold text-muted-foreground uppercase">
                      <span>Tỷ lệ vay ({downPaymentPct}%)</span>
                      <span className="text-brand">{formatPrice(installment.loanAmount)} đ</span>
                    </div>
                    <Slider
                      value={[downPaymentPct]}
                      onValueChange={([v]) => setDownPaymentPct(v)}
                      min={20}
                      max={80}
                      step={5}
                    />
                  </div>
                  <div>
                    <p className="mb-2 text-[10px] font-bold text-muted-foreground uppercase">
                      Thời hạn vay
                    </p>
                    <div className="flex gap-2">
                      {[3, 5, 7].map((y) => (
                        <button
                          key={y}
                          type="button"
                          onClick={() => setLoanTermYears(y)}
                          className={`flex-1 rounded-lg border py-2 text-[11px] font-bold ${
                            loanTermYears === y
                              ? "border-brand bg-brand/5 text-brand"
                              : "border-border"
                          }`}
                        >
                          {y} năm
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 text-[10px] font-bold text-muted-foreground uppercase">
                      Lãi suất ưu đãi
                    </p>
                    <div className="flex gap-2">
                      {[5.9, 6.9, 7.9].map((rate) => (
                        <button
                          key={rate}
                          type="button"
                          onClick={() => setInterestRate(rate)}
                          className={`flex-1 rounded-lg border py-2 text-[11px] font-bold ${
                            interestRate === rate
                              ? "border-brand bg-brand/5 text-brand"
                              : "border-border"
                          }`}
                        >
                          {rate}%
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Results */}
          <div className="bg-surface p-4 sm:p-6 lg:col-span-7">
            {estimatorTab === "rolling" ? (
              <div className="space-y-3 text-xs">
                <CostRow label="Giá bán xe (đã bao gồm pin)" value={formatPrice(variant.price)} />
                <CostRow label="Lệ phí trước bạ" value={formatPrice(rollingCost.registrationTax)} />
                <CostRow label="Phí đăng ký biển số" value={formatPrice(rollingCost.plateFee)} />
                <CostRow
                  label="Phí hỗ trợ đăng kiểm"
                  value={formatPrice(rollingCost.inspectionFee)}
                />
                <CostRow
                  label="Bảo hiểm TNDS bắt buộc"
                  value={formatPrice(rollingCost.civilInsurance)}
                />
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="page-section-card p-4">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">
                      Số tiền vay
                    </p>
                    <p className="mt-1 text-lg font-black text-brand">
                      {formatPrice(installment.loanAmount)} đ
                    </p>
                  </div>
                  <div className="page-section-card p-4">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">
                      Trả trước
                    </p>
                    <p className="mt-1 text-lg font-black text-brand-dark">
                      {formatPrice(installment.upfrontAmount)} đ
                    </p>
                  </div>
                </div>
                <CostRow
                  label="Tổng chi phí lăn bánh"
                  value={formatPrice(rollingCost.totalRolling)}
                />
                <CostRow label="Thời hạn vay" value={`${loanTermYears * 12} tháng`} />
                <CostRow
                  label="Gốc tháng đầu"
                  value={formatPrice(installment.firstMonthPrincipal)}
                />
                <CostRow
                  label="Lãi tháng đầu"
                  value={formatPrice(installment.firstMonthInterest)}
                />
                <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <Info className="size-3.5 text-brand" /> Dư nợ giảm dần theo từng tháng
                </p>
              </div>
            )}

            <div className="mt-6 border-t border-border/50 pt-6">
              <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                {estimatorTab === "rolling"
                  ? "Tổng chi phí lăn bánh dự kiến"
                  : "Thanh toán tháng đầu (ước tính)"}
              </p>
              <p className="mt-1 text-xl font-black text-brand sm:text-2xl lg:text-3xl">
                {estimatorTab === "rolling"
                  ? `${formatPrice(rollingCost.totalRolling)} VND`
                  : `${formatPrice(installment.firstMonthTotal)} VND/tháng`}
              </p>
              {estimatorTab === "installment" && (
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Trung bình ~{formatPrice(installment.avgMonthlyPayment)} đ/tháng
                </p>
              )}
              <button
                type="button"
                onClick={onBook}
                className={`mt-4 ${pdpCtaPrimary} sm:w-auto sm:px-8`}
              >
                <Calendar className="size-4" /> NHẬN BÁO GIÁ CHI TIẾT
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function ReviewsSection({
  detail,
  adminEditable,
}: {
  detail: ScooterDetail;
  adminEditable?: boolean;
}) {
  const rating = detail.reviews.averageRating;
  const ratingPct = (rating / 5) * 100;

  return (
    <>
      <div className="mx-auto max-w-3xl text-center">
        <InlineSectionTitle
          titlePath="_section.reviews.title"
          titleFallback="Đánh giá khách hàng"
          subtitlePath="_section.reviews.subtitle"
          subtitleFallback="Trải nghiệm thực tế từ cộng đồng"
          adminEditable={adminEditable}
        />
      </div>

      <div className="mx-auto mt-8 max-w-5xl">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,240px)_1fr] lg:gap-10">
          <aside className="flex flex-col items-center rounded-2xl border border-border/60 bg-surface/40 px-6 py-8 text-center lg:sticky lg:top-24 lg:items-start lg:self-start lg:py-10 lg:text-left">
            <p className="text-5xl font-black leading-none tabular-nums text-brand-dark">
              {rating.toFixed(1)}
            </p>
            <StarRating
              rating={rating}
              size={16}
              className="mt-3 justify-center lg:justify-start"
            />
            <div className="mt-4 h-1.5 w-full max-w-[180px] overflow-hidden rounded-full bg-border/50">
              <div
                className="h-full rounded-full bg-brand transition-all"
                style={{ width: `${ratingPct}%` }}
              />
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Dựa trên{" "}
              <span className="font-semibold text-brand-dark">{detail.reviews.totalReviews}</span>{" "}
              đánh giá
            </p>
            <div className="mt-5 hidden text-xs leading-relaxed text-muted-foreground lg:block">
              <InlineText
                path="_section.reviews.asideNote"
                fallback="Phản hồi từ khách hàng đã trải nghiệm và mua xe tại VinFast Ngọc Anh Cà Mau."
                adminEditable={adminEditable}
                className="text-xs leading-relaxed text-muted-foreground"
                multiline
              />
            </div>
          </aside>

          <EditableReviewCards
            items={detail.reviews.items}
            adminEditable={adminEditable}
            renderStars={(rating) => <StarRating rating={rating} size={12} />}
          />
        </div>
      </div>
    </>
  );
}

/* ─── Shared UI atoms ─── */

function BreadcrumbBar({
  scooterName,
  variantName,
  reduced,
}: {
  scooterName: string;
  variantName: string;
  reduced: boolean;
}) {
  return (
    <motion.div
      className="border-b border-border/40 bg-white"
      initial={reduced ? false : "hidden"}
      animate="visible"
      variants={reduced ? undefined : detailBreadcrumb}
    >
      <div className="container-vf overflow-x-auto py-2.5 sm:py-3 scrollbar-none">
        <Breadcrumb>
          <BreadcrumbList className="flex-nowrap">
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
                <Link
                  href="/xe-may-dien"
                  className="text-xs text-muted-foreground hover:text-brand"
                >
                  Xe máy điện
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="max-w-[120px] truncate text-xs text-muted-foreground sm:max-w-none">
                {scooterName}
              </BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden sm:block" />
            <BreadcrumbItem className="hidden sm:block">
              <BreadcrumbPage className="text-xs font-medium text-foreground">
                {variantName}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </motion.div>
  );
}

function HighlightStat({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ElementType;
  value: string;
  label: string;
}) {
  return (
    <div className="text-center">
      <Icon className="mx-auto size-4 text-brand" strokeWidth={1.5} />
      <p className="mt-1 text-sm font-black text-brand-dark">{value}</p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}

function SpecItem({
  icon: Icon,
  label,
  value,
  light,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  light?: boolean;
}) {
  return (
    <div className="text-center">
      <Icon
        className={`mx-auto size-5 ${light ? "text-white/80" : "text-brand"}`}
        strokeWidth={1.5}
      />
      <p className={`mt-2 text-[10px] ${light ? "text-white/60" : "text-muted-foreground"}`}>
        {label}
      </p>
      <p className={`mt-0.5 text-xs font-bold ${light ? "text-white" : "text-brand-dark"}`}>
        {value}
      </p>
    </div>
  );
}

function SectionHeader({
  title,
  subtitle,
  center,
}: {
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "text-center" : ""}>
      <h2 className={vfSectionHeadingLeft}>{title}</h2>
      {subtitle && (
        <p className={`mt-2 text-sm text-muted-foreground ${center ? "mx-auto max-w-xl" : ""}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

function CostRow({
  label,
  value,
  indent,
  highlight,
}: {
  label: string;
  value: string;
  indent?: boolean;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex flex-col gap-1 text-xs font-semibold sm:flex-row sm:items-center sm:justify-between ${
        indent ? "border-l-2 border-border pl-3" : ""
      } ${highlight ? "text-emerald-600" : "text-slate-600"}`}
    >
      <span className="min-w-0">{label}</span>
      <span className={`shrink-0 ${highlight ? "font-bold" : "font-bold text-slate-800"}`}>
        {value} VNĐ
      </span>
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
