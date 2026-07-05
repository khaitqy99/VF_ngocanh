"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast, Toaster } from "sonner";
import { ArrowLeft, Check, Phone, Plus, Save, Shield, Undo2, Wrench } from "lucide-react";

import Header from "@/components/site/Header";
import FloatingButtons from "@/components/site/FloatingButtons";
import { AccessoryProductCard } from "@/components/accessories/AccessoryProductCard";
import { CatalogGrid, CatalogGridItem, FadeIn } from "@/components/motion";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  CATEGORY_OPTIONS,
  formatPrice,
  getCategoryLabel,
  getRelatedAccessories,
  getVehicleLabels,
  type AccessoryProduct,
} from "@/lib/accessories";
import { HOTLINE_TEL } from "@/lib/contact";
import { pdpCtaPrimary, pdpCtaSecondary } from "@/components/shared/PageCtaSection";
import { vfDisplayHero, vfHeroEyebrow, vfHeroTitle } from "@/lib/typography";

const HIGHLIGHTS = [
  { icon: Shield, text: "100% chính hãng VinFast" },
  { icon: Wrench, text: "Hỗ trợ lắp đặt tại showroom" },
  { icon: Check, text: "Bảo hành theo chính sách hãng" },
] as const;

type Props = { product: AccessoryProduct; embedded?: boolean; adminEdit?: boolean };

function normalizeVehicles(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getAccessoryPatches(
  base: AccessoryProduct,
  draft: AccessoryProduct,
): Record<string, unknown> {
  const patches: Record<string, unknown> = {};

  if (draft.name !== base.name) patches.name = draft.name;
  if (draft.description !== base.description) patches.description = draft.description;
  if (draft.price !== base.price) patches.price = draft.price;
  if (draft.image !== base.image) patches.image = draft.image;
  if (draft.category !== base.category) patches.category = draft.category;
  if (draft.inStock !== base.inStock) patches.inStock = draft.inStock;
  if ((draft.badge ?? "") !== (base.badge ?? "")) patches.badge = draft.badge ?? "";

  const baseVehicles = JSON.stringify(base.vehicles ?? []);
  const draftVehicles = JSON.stringify(draft.vehicles ?? []);
  if (baseVehicles !== draftVehicles) patches.vehicles = draft.vehicles;

  return patches;
}

export default function AccessoryDetailPage({
  product,
  embedded = false,
  adminEdit = false,
}: Props) {
  const [draft, setDraft] = useState<AccessoryProduct>(product);
  const related = useMemo(() => getRelatedAccessories(draft.id), [draft.id]);
  const vehiclesText = draft.vehicles.join(", ");
  const hasUnsavedChanges = useMemo(
    () => Object.keys(getAccessoryPatches(product, draft)).length > 0,
    [product, draft],
  );

  useEffect(() => {
    setDraft(product);
  }, [product]);

  useEffect(() => {
    if (!adminEdit) return;
    const onMessage = (event: MessageEvent) => {
      if (event.data?.type !== "vf-admin-image-selected" || event.data?.path !== "image") return;
      setDraft((prev) => ({ ...prev, image: String(event.data.imagePath ?? prev.image) }));
      toast.success("Đã cập nhật ảnh phụ kiện");
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [adminEdit]);

  useEffect(() => {
    if (!adminEdit) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!hasUnsavedChanges) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [adminEdit, hasUnsavedChanges]);

  const requestImage = () => {
    if (typeof window === "undefined" || window.parent === window) {
      toast.message("Mở từ trang admin để dùng thư viện media");
      return;
    }
    window.parent.postMessage(
      {
        type: "vf-admin-pick-image",
        path: "image",
        kind: "image",
        category: "accessories",
        slug: draft.id,
      },
      "*",
    );
  };

  const saveToAdmin = () => {
    const patches = getAccessoryPatches(product, draft);
    if (Object.keys(patches).length === 0) {
      toast.message("Không có thay đổi để lưu");
      return;
    }
    if (typeof window !== "undefined" && window.parent !== window) {
      window.parent.postMessage(
        {
          type: "vf-admin-saved",
          productType: "accessory",
          productId: draft.id,
          patches,
        },
        "*",
      );
      toast.success("Đã gửi thay đổi sang admin để lưu");
      return;
    }
    toast.message("Chỉ lưu được khi mở từ admin");
  };

  const addToCart = () => {
    if (adminEdit || !draft.inStock) return;

    try {
      const saved = localStorage.getItem("vf_accessory_cart");
      const cart: AccessoryProduct[] = saved ? JSON.parse(saved) : [];
      const exists = cart.some((item) => item.id === draft.id);

      if (exists) {
        toast.info(`Sản phẩm ${draft.name} đã có trong giỏ tư vấn`);
        return;
      }

      localStorage.setItem("vf_accessory_cart", JSON.stringify([...cart, draft]));
      toast.success(`Đã thêm ${draft.name} vào giỏ tư vấn`);
    } catch {
      toast.error("Không thể thêm vào giỏ tư vấn. Vui lòng thử lại.");
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <Toaster position="top-center" richColors />
      {!embedded && <Header />}

      <main>
        {embedded ? (
          <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-xs font-medium text-amber-900">
            {adminEdit
              ? "Chế độ sửa trực tiếp phụ kiện — chỉnh trên trang rồi bấm Lưu"
              : "Chế độ xem trước — giao diện giống trang chi tiết trên website"}
          </div>
        ) : null}

        {adminEdit ? (
          <div className="sticky top-0 z-30 border-b border-brand/30 bg-brand-dark px-4 py-2.5 text-white shadow-lg">
            <div className="container-vf flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold">Sửa phụ kiện trực tiếp trên preview</span>
              <div className="flex items-center gap-2">
                {hasUnsavedChanges ? (
                  <span className="rounded bg-accent-yellow/20 px-2 py-0.5 text-[10px] font-bold text-accent-yellow">
                    Chưa lưu
                  </span>
                ) : null}
                <button
                  type="button"
                  onClick={() => setDraft(product)}
                  disabled={!hasUnsavedChanges}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/25 px-3 py-1.5 text-xs font-bold hover:bg-white/10"
                >
                  <Undo2 className="size-3.5" />
                  Hoàn tác
                </button>
                <button
                  type="button"
                  onClick={saveToAdmin}
                  disabled={!hasUnsavedChanges}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-accent-yellow px-3 py-1.5 text-xs font-bold text-brand-dark hover:bg-yellow-300"
                >
                  <Save className="size-3.5" />
                  Lưu
                </button>
              </div>
            </div>
          </div>
        ) : null}

        <div className="border-b border-border/60 bg-background">
          <div className="container-vf py-3.5">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/" className="text-xs font-bold text-slate-500 hover:text-brand">
                      Trang chủ
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link
                      href="/phu-kien"
                      className="text-xs font-bold text-slate-500 hover:text-brand"
                    >
                      Phụ kiện
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="line-clamp-1 text-xs font-extrabold text-brand-dark">
                    {draft.name}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        <section className="section-y bg-surface-muted">
          <div className="container-vf">
            <Link
              href="/phu-kien"
              className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-white px-4 py-2 text-xs font-semibold text-slate-500 transition hover:border-brand/30 hover:text-brand"
            >
              <ArrowLeft className="size-4" />
              Quay lại danh mục
            </Link>

            <div className="page-showcase-shell rounded-[1.75rem] p-5 sm:p-8 lg:p-10">
              <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
                <FadeIn
                  direction="left"
                  className="relative overflow-hidden rounded-[1.25rem] border border-slate-200/80 bg-white"
                >
                  <img
                    src={draft.image}
                    alt={draft.name}
                    className="aspect-square w-full object-cover"
                  />
                  {adminEdit ? (
                    <button
                      type="button"
                      onClick={requestImage}
                      className="absolute right-3 top-3 rounded bg-brand px-2 py-1 text-[10px] font-bold text-white hover:bg-[#0046cc]"
                    >
                      Đổi ảnh
                    </button>
                  ) : null}
                  {(draft.badge || !draft.inStock) && (
                    <div className="absolute left-3 top-3 flex flex-col gap-1">
                      {draft.badge && (
                        <span className="rounded bg-brand px-2 py-0.5 text-[10px] font-extrabold uppercase text-white">
                          {draft.badge}
                        </span>
                      )}
                      {!draft.inStock && (
                        <span className="rounded bg-slate-400 px-2 py-0.5 text-[10px] font-extrabold uppercase text-white">
                          Hết hàng
                        </span>
                      )}
                    </div>
                  )}
                </FadeIn>

                <FadeIn direction="right" delay={0.1} className="flex flex-col">
                  {adminEdit ? (
                    <>
                      <select
                        value={draft.category}
                        onChange={(e) =>
                          setDraft((prev) => ({
                            ...prev,
                            category: e.target.value as AccessoryProduct["category"],
                          }))
                        }
                        className="w-fit rounded-md border border-slate-300 bg-white px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-brand"
                      >
                        {CATEGORY_OPTIONS.map((item) => (
                          <option key={item.value} value={item.value}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                      <input
                        value={draft.name}
                        onChange={(e) => setDraft((prev) => ({ ...prev, name: e.target.value }))}
                        className={`mt-2 rounded-lg border border-slate-300 px-3 py-2 ${vfHeroTitle}`}
                      />
                    </>
                  ) : (
                    <>
                      <p className={vfHeroEyebrow}>{getCategoryLabel(draft.category)}</p>
                      <h1 className={`mt-3 ${vfDisplayHero} text-brand-dark`}>{draft.name}</h1>
                      <span
                        aria-hidden
                        className="mt-4 block h-1 w-12 rounded-full bg-accent-yellow shadow-[0_0_20px_rgba(255,213,0,0.35)]"
                      />
                    </>
                  )}

                  {adminEdit ? (
                    <textarea
                      value={draft.description}
                      onChange={(e) =>
                        setDraft((prev) => ({ ...prev, description: e.target.value }))
                      }
                      rows={4}
                      className="mt-4 rounded-lg border border-slate-300 px-3 py-2 text-sm leading-relaxed text-slate-700"
                    />
                  ) : (
                    <p className="mt-4 text-sm leading-relaxed text-slate-600">
                      {draft.description}
                    </p>
                  )}

                  {adminEdit ? (
                    <div className="mt-3">
                      <label className="text-[11px] font-semibold text-slate-500">Badge</label>
                      <input
                        value={draft.badge ?? ""}
                        onChange={(e) =>
                          setDraft((prev) => ({ ...prev, badge: e.target.value || undefined }))
                        }
                        placeholder="Ví dụ: Bán chạy"
                        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                      />
                    </div>
                  ) : null}

                  <dl className="page-section-card mt-6 space-y-3 p-4 text-sm">
                    <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
                      <dt className="font-semibold text-slate-500">Dòng xe tương thích</dt>
                      <dd className="text-right font-bold text-slate-800">
                        {adminEdit ? (
                          <input
                            value={vehiclesText}
                            onChange={(e) =>
                              setDraft((prev) => ({
                                ...prev,
                                vehicles: normalizeVehicles(
                                  e.target.value,
                                ) as AccessoryProduct["vehicles"],
                              }))
                            }
                            className="w-56 rounded-md border border-slate-300 px-2 py-1 text-right text-sm font-bold"
                            placeholder="vf8, vf9, all"
                          />
                        ) : (
                          getVehicleLabels(draft.vehicles)
                        )}
                      </dd>
                    </div>
                    <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
                      <dt className="font-semibold text-slate-500">Tình trạng</dt>
                      <dd
                        className={`font-bold ${draft.inStock ? "text-emerald-600" : "text-slate-400"}`}
                      >
                        {adminEdit ? (
                          <select
                            value={draft.inStock ? "in" : "out"}
                            onChange={(e) =>
                              setDraft((prev) => ({ ...prev, inStock: e.target.value === "in" }))
                            }
                            className="rounded-md border border-slate-300 px-2 py-1 text-sm text-slate-800"
                          >
                            <option value="in">Còn hàng</option>
                            <option value="out">Hết hàng</option>
                          </select>
                        ) : draft.inStock ? (
                          "Còn hàng"
                        ) : (
                          "Hết hàng"
                        )}
                      </dd>
                    </div>
                    <div className="flex flex-col gap-1 border-t border-slate-200 pt-3 sm:flex-row sm:justify-between sm:gap-4">
                      <dt className="font-semibold text-slate-500">Giá bán ưu đãi</dt>
                      <dd className="text-right text-xl font-black tabular-nums text-brand-dark">
                        {adminEdit ? (
                          <input
                            value={new Intl.NumberFormat("vi-VN").format(draft.price)}
                            onChange={(e) => {
                              const digits = e.target.value.replace(/\D/g, "");
                              setDraft((prev) => ({ ...prev, price: digits ? Number(digits) : 0 }));
                            }}
                            className="w-52 rounded-md border border-slate-300 px-2 py-1 text-right text-xl font-black"
                          />
                        ) : (
                          <>
                            {formatPrice(draft.price)}{" "}
                            <span className="text-sm font-bold text-slate-500">đ</span>
                          </>
                        )}
                      </dd>
                    </div>
                  </dl>

                  <ul className="mt-6 space-y-2.5">
                    {HIGHLIGHTS.map(({ icon: Icon, text }) => (
                      <li key={text} className="flex items-center gap-2.5 text-sm text-slate-600">
                        <Icon className="size-4 shrink-0 text-brand" />
                        {text}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <a href={HOTLINE_TEL} className={pdpCtaPrimary}>
                      <Phone className="size-4" />
                      GỌI TƯ VẤN NGAY
                    </a>
                    <button
                      type="button"
                      onClick={addToCart}
                      disabled={adminEdit || !draft.inStock}
                      className={`${pdpCtaSecondary} disabled:cursor-not-allowed disabled:border-slate-100 disabled:text-slate-300 enabled:hover:border-brand enabled:hover:text-brand`}
                    >
                      <Plus className="size-4" />
                      THÊM GIỎ TƯ VẤN
                    </button>
                  </div>
                </FadeIn>
              </div>
            </div>
          </div>
        </section>

        {related.length > 0 && (
          <section className="border-t border-slate-100 bg-white pb-12 sm:pb-16 section-y">
            <div className="container-vf">
              <FadeIn>
                <span aria-hidden className="block h-1 w-10 rounded-full bg-accent-yellow" />
                <h2 className="mt-4 text-lg font-black text-brand-dark sm:text-xl">
                  Phụ kiện liên quan
                </h2>
              </FadeIn>
              <CatalogGrid className="mt-6 grid grid-cols-2 items-stretch gap-3 sm:gap-6 lg:grid-cols-4">
                {related.map((item, index) => (
                  <CatalogGridItem key={item.id} index={index}>
                    <AccessoryProductCard product={item} />
                  </CatalogGridItem>
                ))}
              </CatalogGrid>
            </div>
          </section>
        )}
      </main>

      {!embedded && <FloatingButtons />}
    </div>
  );
}
