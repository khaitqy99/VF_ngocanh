"use client";

import Link from "next/link";
import { useState } from "react";

import { formatPrice, type ScooterModel } from "@/lib/scooters";

export function ScooterCatalogCard({
  scooter,
  className,
  onBookDrive,
  onEstimatePrice,
}: {
  scooter: ScooterModel;
  className?: string;
  onBookDrive: () => void;
  onEstimatePrice: () => void;
}) {
  const [activeColor, setActiveColor] = useState(scooter.colors[0]);
  const trunkLabel = scooter.trunk > 0 ? `${scooter.trunk}L cốp` : "Móc treo";

  return (
    <article
      className={`catalog-card group flex h-full flex-col border border-slate-200 bg-white ${className ?? ""}`}
    >
      <div className="relative">
        <Link href={`/xe-may-dien/${scooter.id}`} prefetch className="block">
          <div className="flex aspect-[4/3] w-full items-center justify-center overflow-hidden bg-slate-100">
            <img
              src={scooter.image}
              alt={scooter.name}
              className="h-full w-full object-contain p-3 transition duration-500 ease-out group-hover:scale-105 sm:p-4"
              loading="lazy"
              decoding="async"
            />
          </div>
        </Link>
        {(scooter.isBestSeller || scooter.isNew || scooter.isPromo) && (
          <div className="pointer-events-none absolute left-2 top-2 z-10 flex flex-col gap-1">
            {scooter.isBestSeller && (
              <span className="rounded bg-brand px-1.5 py-0.5 text-[9px] font-extrabold text-white uppercase">
                Bán chạy
              </span>
            )}
            {scooter.isNew && (
              <span className="rounded bg-emerald-500 px-1.5 py-0.5 text-[9px] font-extrabold text-white uppercase">
                Mới
              </span>
            )}
            {scooter.isPromo && (
              <span className="rounded bg-red-600 px-1.5 py-0.5 text-[9px] font-extrabold text-white uppercase">
                Trả góp 0%
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-3 sm:gap-3 sm:p-4">
        <div className="min-w-0">
          <h3 className="truncate whitespace-nowrap text-sm font-black leading-snug text-brand-dark sm:text-base">
            <Link href={`/xe-may-dien/${scooter.id}`} prefetch>
              {scooter.name}
            </Link>
          </h3>
        </div>

        <div className="flex min-h-5 flex-wrap items-center gap-1.5">
          {scooter.colors.map((c) => (
            <button
              key={c.name}
              type="button"
              onClick={() => setActiveColor(c)}
              className={`size-4 rounded-full border ${
                activeColor.name === c.name ? "border-brand border-2" : "border-slate-300"
              }`}
              style={{ backgroundColor: c.hex }}
              title={c.name}
            />
          ))}
        </div>

        <p className="text-[11px] font-semibold text-slate-600">
          Pin {scooter.batteryType} · {scooter.range} km · {scooter.topSpeed} km/h · {trunkLabel}
        </p>

        <div className="mt-auto space-y-2 border-t border-slate-100 pt-2.5">
          <div>
            <p className="text-[10px] font-semibold text-slate-500 sm:text-[11px]">
              Giá niêm yết (Xe chưa pin)
            </p>
            <p className="text-base font-black tabular-nums text-brand-dark sm:text-lg">
              {formatPrice(scooter.price)}{" "}
              <span className="text-[11px] font-bold text-slate-500">đ</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onEstimatePrice}
              className="rounded border border-slate-200 py-2.5 text-[10px] font-extrabold text-slate-600 sm:text-[11px]"
            >
              LĂN BÁNH
            </button>
            <button
              type="button"
              onClick={onBookDrive}
              className="rounded bg-brand py-2.5 text-[10px] font-extrabold text-white sm:text-[11px]"
            >
              ĐẶT MUA
            </button>
          </div>

          <Link
            href={`/xe-may-dien/${scooter.id}`}
            prefetch
            className="block rounded border border-brand/30 py-2.5 text-center text-[11px] font-bold leading-snug text-brand sm:text-xs"
          >
            Xem trọn bộ thông số
          </Link>
        </div>
      </div>
    </article>
  );
}
