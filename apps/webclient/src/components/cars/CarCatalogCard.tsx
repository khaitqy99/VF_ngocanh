"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Save, Undo2 } from "lucide-react";
import { toast } from "sonner";

import { getCarCatalogPatches } from "@/components/admin-edit/catalog-edit";
import {
  adminFormImageBtn,
  adminFormInput,
  adminFormLabel,
} from "@/components/admin-edit/admin-form-styles";
import { formatPrice, type CarModel } from "@/lib/cars";
import { carDetailPath } from "@/lib/seo/slugs";
import { vfCatalogCardTitle } from "@/lib/typography";

export function CarCatalogCard({
  car,
  className,
  adminEdit = false,
  onBookDrive,
  onEstimatePrice,
}: {
  car: CarModel;
  className?: string;
  adminEdit?: boolean;
  onBookDrive: () => void;
  onEstimatePrice: () => void;
}) {
  const [draft, setDraft] = useState(car);

  const hasUnsavedChanges = useMemo(
    () => Object.keys(getCarCatalogPatches(car, draft)).length > 0,
    [car, draft],
  );

  useEffect(() => {
    setDraft(car);
  }, [car]);

  useEffect(() => {
    if (!adminEdit) return;
    const onMessage = (event: MessageEvent) => {
      if (
        event.data?.type !== "vf-admin-image-selected" ||
        event.data?.productId !== car.id ||
        event.data?.path !== "image"
      ) {
        return;
      }
      setDraft((prev) => ({ ...prev, image: String(event.data.imagePath ?? prev.image) }));
      toast.success(`Đã cập nhật ảnh ${car.name}`);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [adminEdit, car.id, car.name]);

  const requestImage = () => {
    if (typeof window === "undefined" || window.parent === window) {
      toast.message("Mở từ trang admin để dùng thư viện media");
      return;
    }
    window.parent.postMessage(
      {
        type: "vf-admin-pick-image",
        path: "image",
        productId: car.id,
        category: "cars",
        slug: car.id,
      },
      "*",
    );
  };

  const saveToAdmin = () => {
    const patches = getCarCatalogPatches(car, draft);
    if (Object.keys(patches).length === 0) {
      toast.message("Không có thay đổi để lưu");
      return;
    }
    if (typeof window !== "undefined" && window.parent !== window) {
      window.parent.postMessage(
        {
          type: "vf-admin-saved",
          productType: "car",
          productId: car.id,
          patches,
        },
        "*",
      );
      toast.success("Đã gửi thay đổi thẻ catalog sang admin");
      return;
    }
    toast.message("Chỉ lưu được khi mở từ admin");
  };

  if (adminEdit) {
    return (
      <article
        className={`catalog-card flex h-full flex-col border bg-white ${
          hasUnsavedChanges
            ? "border-amber-400 ring-2 ring-amber-200"
            : "border-brand/30 ring-1 ring-brand/10"
        } ${className ?? ""}`}
      >
        <div className="relative">
          <div className="flex aspect-[4/3] w-full items-center justify-center overflow-hidden bg-slate-100">
            <img
              src={draft.image}
              alt={draft.name}
              className="h-full w-full object-contain p-3 sm:p-4"
            />
          </div>
          <button type="button" onClick={requestImage} className={adminFormImageBtn}>
            Đổi ảnh
          </button>
          <div className="absolute left-2 top-2 z-10 flex flex-col gap-1">
            {draft.isBestSeller ? (
              <span className="rounded bg-brand px-1.5 py-0.5 text-[9px] font-extrabold uppercase text-white">
                Bán chạy
              </span>
            ) : null}
            {draft.isNew ? (
              <span className="rounded bg-emerald-500 px-1.5 py-0.5 text-[9px] font-extrabold uppercase text-white">
                Mới
              </span>
            ) : null}
            {draft.isPromo ? (
              <span className="rounded bg-red-600 px-1.5 py-0.5 text-[9px] font-extrabold uppercase text-white">
                Ưu đãi
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2.5 p-3 sm:gap-3 sm:p-4">
          <div>
            <label className={adminFormLabel}>Tên xe</label>
            <input
              value={draft.name}
              onChange={(e) => setDraft((prev) => ({ ...prev, name: e.target.value }))}
              className={`mt-1 ${adminFormInput} ${vfCatalogCardTitle}`}
            />
          </div>

          <div>
            <label className={adminFormLabel}>Giá niêm yết (đ)</label>
            <input
              value={new Intl.NumberFormat("vi-VN").format(draft.price)}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, "");
                setDraft((prev) => ({ ...prev, price: digits ? Number(digits) : 0 }));
              }}
              className={`mt-1 ${adminFormInput} font-black tabular-nums`}
            />
          </div>

          <div className="flex flex-wrap gap-3 text-[11px] font-semibold text-slate-600">
            <label className="inline-flex items-center gap-1.5">
              <input
                type="checkbox"
                checked={Boolean(draft.isNew)}
                onChange={(e) => setDraft((prev) => ({ ...prev, isNew: e.target.checked }))}
                className="rounded border-slate-300"
              />
              Mới
            </label>
            <label className="inline-flex items-center gap-1.5">
              <input
                type="checkbox"
                checked={Boolean(draft.isBestSeller)}
                onChange={(e) => setDraft((prev) => ({ ...prev, isBestSeller: e.target.checked }))}
                className="rounded border-slate-300"
              />
              Bán chạy
            </label>
            <label className="inline-flex items-center gap-1.5">
              <input
                type="checkbox"
                checked={Boolean(draft.isPromo)}
                onChange={(e) => setDraft((prev) => ({ ...prev, isPromo: e.target.checked }))}
                className="rounded border-slate-300"
              />
              Ưu đãi
            </label>
          </div>

          <div className="mt-auto grid grid-cols-2 gap-2 border-t border-slate-100 pt-2.5">
            <button
              type="button"
              onClick={() => setDraft(car)}
              disabled={!hasUnsavedChanges}
              className="inline-flex items-center justify-center gap-1 rounded border border-slate-200 py-2 text-[10px] font-bold text-slate-600 disabled:opacity-40"
            >
              <Undo2 className="size-3" />
              Hoàn tác
            </button>
            <button
              type="button"
              onClick={saveToAdmin}
              disabled={!hasUnsavedChanges}
              className="inline-flex items-center justify-center gap-1 rounded bg-brand py-2 text-[10px] font-bold text-white disabled:opacity-40"
            >
              <Save className="size-3" />
              Lưu thẻ
            </button>
          </div>

          <Link
            href={`${carDetailPath(car)}/preview`}
            className="block text-center text-[10px] font-bold text-brand hover:underline"
          >
            Sửa trang chi tiết →
          </Link>
        </div>
      </article>
    );
  }

  return (
    <article
      className={`catalog-card group flex h-full flex-col overflow-hidden ${className ?? ""}`}
    >
      <div className="relative">
        <Link href={carDetailPath(car)} prefetch className="block">
          <div className="flex aspect-[4/3] w-full items-center justify-center overflow-hidden bg-slate-100">
            <img
              src={car.image}
              alt={car.name}
              className="h-full w-full object-contain p-3 transition duration-500 ease-out group-hover:scale-105 sm:p-4"
              loading="lazy"
              decoding="async"
            />
          </div>
        </Link>
        {(car.isBestSeller || car.isNew || car.isPromo) && (
          <div className="pointer-events-none absolute left-2 top-2 z-10 flex flex-col gap-1">
            {car.isBestSeller && (
              <span className="rounded bg-brand px-1.5 py-0.5 text-[9px] font-extrabold uppercase text-white">
                Bán chạy
              </span>
            )}
            {car.isNew && (
              <span className="rounded bg-emerald-500 px-1.5 py-0.5 text-[9px] font-extrabold uppercase text-white">
                Mới
              </span>
            )}
            {car.isPromo && (
              <span className="rounded bg-red-600 px-1.5 py-0.5 text-[9px] font-extrabold uppercase text-white">
                Ưu đãi
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-3 sm:gap-3 sm:p-4">
        <div className="min-w-0">
          <h3 className={`truncate whitespace-nowrap ${vfCatalogCardTitle}`}>
            <Link href={carDetailPath(car)} prefetch>
              {car.name}
            </Link>
          </h3>
        </div>

        <div className="mt-auto space-y-2 border-t border-slate-100 pt-2.5">
          <div>
            <p className="text-[10px] font-semibold text-slate-500 sm:text-[11px]">
              Giá niêm yết (đã bao gồm pin)
            </p>
            <p className="text-base font-black tabular-nums text-brand-dark sm:text-lg">
              {formatPrice(car.price)}{" "}
              <span className="text-[11px] font-bold text-slate-500">đ</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onEstimatePrice}
              className="rounded-full border border-slate-200 py-2.5 text-[10px] font-semibold text-slate-600 transition hover:border-brand/30 hover:text-brand sm:text-[11px]"
            >
              LĂN BÁNH
            </button>
            <button
              type="button"
              onClick={onBookDrive}
              className="home-cta-primary rounded-full py-2.5 text-[10px] font-semibold text-white sm:text-[11px]"
            >
              LÁI THỬ
            </button>
          </div>

          <Link
            href={carDetailPath(car)}
            prefetch
            className="block rounded-full border border-brand/25 py-2.5 text-center text-[11px] font-semibold leading-snug text-brand transition hover:border-brand hover:bg-brand/5 sm:text-xs"
          >
            Xem trọn bộ thông số
          </Link>
        </div>
      </div>
    </article>
  );
}
