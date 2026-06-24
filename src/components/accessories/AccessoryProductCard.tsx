"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import {
  formatPrice,
  getCategoryLabel,
  getVehicleLabels,
  type AccessoryProduct,
} from "@/lib/accessories";

export function AccessoryProductCard({
  product,
  className,
}: {
  product: AccessoryProduct;
  className?: string;
}) {
  return (
    <article
      className={`catalog-card group flex h-full flex-col border border-slate-200 bg-white ${className ?? ""}`}
    >
      <Link href={`/phu-kien/${product.id}`} className="relative block overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="aspect-square w-full bg-[#f7f9f9] object-contain p-3 transition duration-500 ease-out group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
        {(product.badge || !product.inStock) && (
          <div className="pointer-events-none absolute left-2 top-2 z-10 flex flex-col gap-1">
            {product.badge && (
              <span className="rounded bg-brand px-1.5 py-0.5 text-[9px] font-extrabold text-white uppercase">
                {product.badge}
              </span>
            )}
            {!product.inStock && (
              <span className="rounded bg-slate-400 px-1.5 py-0.5 text-[9px] font-extrabold text-white uppercase">
                Hết hàng
              </span>
            )}
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-3 sm:gap-2.5 sm:p-4">
        <div className="min-w-0">
          <p className="text-[10px] font-bold tracking-wide text-brand uppercase">
            {getCategoryLabel(product.category)}
          </p>
          <h3 className="mt-0.5 line-clamp-2 min-h-[2.5rem] text-sm font-black leading-snug text-brand-dark">
            <Link href={`/phu-kien/${product.id}`} className="hover:text-brand">
              {product.name}
            </Link>
          </h3>
          <p className="mt-1 line-clamp-2 min-h-10 text-[11px] leading-5 text-slate-500">
            {product.description}
          </p>
        </div>

        <p className="line-clamp-1 min-h-4 text-[10px] font-semibold text-slate-500">
          Dòng xe: {getVehicleLabels(product.vehicles)}
        </p>

        <div className="mt-auto space-y-2 border-t border-slate-100 pt-2.5">
          <div>
            <p className="text-[10px] font-semibold text-slate-500">Giá bán ưu đãi</p>
            <p className="text-base font-black tabular-nums text-brand-dark sm:text-lg">
              {formatPrice(product.price)}{" "}
              <span className="text-[11px] font-bold text-slate-500">đ</span>
            </p>
          </div>

          <Link
            href={`/phu-kien/${product.id}`}
            className="flex w-full items-center justify-center gap-1.5 rounded border border-slate-200 py-2.5 text-[10px] font-extrabold text-slate-600 transition hover:border-brand hover:text-brand sm:text-[11px]"
          >
            XEM CHI TIẾT
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
