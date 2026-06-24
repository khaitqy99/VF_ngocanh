"use client";

import Link from "next/link";
import { useMemo } from "react";
import { toast, Toaster } from "sonner";
import { ArrowLeft, Check, Phone, Plus, Shield, Wrench } from "lucide-react";

import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
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
  formatPrice,
  getCategoryLabel,
  getRelatedAccessories,
  getVehicleLabels,
  type AccessoryProduct,
} from "@/lib/accessories";
import { HOTLINE_TEL } from "@/lib/contact";

const HIGHLIGHTS = [
  { icon: Shield, text: "100% chính hãng VinFast" },
  { icon: Wrench, text: "Hỗ trợ lắp đặt tại showroom" },
  { icon: Check, text: "Bảo hành theo chính sách hãng" },
] as const;

type Props = { product: AccessoryProduct };

export default function AccessoryDetailPage({ product }: Props) {
  const related = useMemo(() => getRelatedAccessories(product.id), [product.id]);

  const addToCart = () => {
    if (!product.inStock) return;

    try {
      const saved = localStorage.getItem("vf_accessory_cart");
      const cart: AccessoryProduct[] = saved ? JSON.parse(saved) : [];
      const exists = cart.some((item) => item.id === product.id);

      if (exists) {
        toast.info(`Sản phẩm ${product.name} đã có trong giỏ tư vấn`);
        return;
      }

      localStorage.setItem("vf_accessory_cart", JSON.stringify([...cart, product]));
      toast.success(`Đã thêm ${product.name} vào giỏ tư vấn`);
    } catch {
      toast.error("Không thể thêm vào giỏ tư vấn. Vui lòng thử lại.");
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-slate-800">
      <Toaster position="top-center" richColors />
      <Header />

      <main>
        <div className="border-b border-slate-200 bg-white">
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
                    {product.name}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        <section className="section-y bg-white">
          <div className="container-vf">
            <Link
              href="/phu-kien"
              className="mb-6 inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand"
            >
              <ArrowLeft className="size-4" />
              Quay lại danh mục
            </Link>

            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
              <FadeIn
                direction="left"
                className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="aspect-square w-full object-cover"
                />
                {(product.badge || !product.inStock) && (
                  <div className="absolute left-3 top-3 flex flex-col gap-1">
                    {product.badge && (
                      <span className="rounded bg-brand px-2 py-0.5 text-[10px] font-extrabold uppercase text-white">
                        {product.badge}
                      </span>
                    )}
                    {!product.inStock && (
                      <span className="rounded bg-slate-400 px-2 py-0.5 text-[10px] font-extrabold uppercase text-white">
                        Hết hàng
                      </span>
                    )}
                  </div>
                )}
              </FadeIn>

              <FadeIn direction="right" delay={0.1} className="flex flex-col">
                <p className="text-[11px] font-bold uppercase tracking-wide text-brand">
                  {getCategoryLabel(product.category)}
                </p>
                <h1 className="mt-2 text-2xl font-black leading-tight text-brand-dark sm:text-3xl">
                  {product.name}
                </h1>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">{product.description}</p>

                <dl className="mt-6 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="font-semibold text-slate-500">Dòng xe tương thích</dt>
                    <dd className="text-right font-bold text-slate-800">
                      {getVehicleLabels(product.vehicles)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="font-semibold text-slate-500">Tình trạng</dt>
                    <dd
                      className={`font-bold ${product.inStock ? "text-emerald-600" : "text-slate-400"}`}
                    >
                      {product.inStock ? "Còn hàng" : "Hết hàng"}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4 border-t border-slate-200 pt-3">
                    <dt className="font-semibold text-slate-500">Giá bán ưu đãi</dt>
                    <dd className="text-right text-xl font-black tabular-nums text-brand-dark">
                      {formatPrice(product.price)}{" "}
                      <span className="text-sm font-bold text-slate-500">đ</span>
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
                  <a
                    href={HOTLINE_TEL}
                    className="flex items-center justify-center gap-2 rounded-lg bg-brand py-3.5 text-[11px] font-extrabold tracking-wide text-white hover:bg-[#0046cc]"
                  >
                    <Phone className="size-4" />
                    GỌI TƯ VẤN NGAY
                  </a>
                  <button
                    type="button"
                    onClick={addToCart}
                    disabled={!product.inStock}
                    className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 py-3.5 text-[11px] font-extrabold text-slate-700 disabled:cursor-not-allowed disabled:border-slate-100 disabled:text-slate-300 enabled:hover:border-brand enabled:hover:text-brand"
                  >
                    <Plus className="size-4" />
                    THÊM GIỎ TƯ VẤN
                  </button>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {related.length > 0 && (
          <section className="border-t border-slate-100 bg-white pb-12 sm:pb-16">
            <div className="container-vf">
              <FadeIn>
                <h2 className="text-lg font-black text-brand-dark sm:text-xl">
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

      <Footer />
      <FloatingButtons />
    </div>
  );
}
