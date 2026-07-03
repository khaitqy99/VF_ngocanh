"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Save, Undo2 } from "lucide-react";
import { toast } from "sonner";

import {
  getAccessoryCatalogPatches,
  textToVehicles,
  vehiclesToText,
} from "@/components/admin-edit/catalog-edit";
import {
  adminFormImageBtn,
  adminFormInput,
  adminFormLabel,
  adminFormSelect,
  adminFormTextarea,
} from "@/components/admin-edit/admin-form-styles";
import { accessoryDetailPath } from "@/lib/seo/slugs";
import {
  CATEGORY_OPTIONS,
  formatPrice,
  getCategoryLabel,
  getVehicleLabels,
  type AccessoryProduct,
} from "@/lib/accessories";
import { vfCatalogCardTitle } from "@/lib/typography";

export function AccessoryProductCard({
  product,
  className,
  adminEdit = false,
}: {
  product: AccessoryProduct;
  className?: string;
  adminEdit?: boolean;
}) {
  const [draft, setDraft] = useState(product);

  const hasUnsavedChanges = useMemo(
    () => Object.keys(getAccessoryCatalogPatches(product, draft)).length > 0,
    [product, draft],
  );

  useEffect(() => {
    setDraft(product);
  }, [product]);

  useEffect(() => {
    if (!adminEdit) return;
    const onMessage = (event: MessageEvent) => {
      if (
        event.data?.type !== "vf-admin-image-selected" ||
        event.data?.productId !== product.id ||
        event.data?.path !== "image"
      ) {
        return;
      }
      setDraft((prev) => ({ ...prev, image: String(event.data.imagePath ?? prev.image) }));
      toast.success(`Đã cập nhật ảnh ${product.name}`);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [adminEdit, product.id, product.name]);

  const requestImage = () => {
    if (typeof window === "undefined" || window.parent === window) {
      toast.message("Mở từ trang admin để dùng thư viện media");
      return;
    }
    window.parent.postMessage(
      {
        type: "vf-admin-pick-image",
        path: "image",
        productId: product.id,
        category: "accessories",
        slug: product.id,
      },
      "*",
    );
  };

  const saveToAdmin = () => {
    const patches = getAccessoryCatalogPatches(product, draft);
    if (Object.keys(patches).length === 0) {
      toast.message("Không có thay đổi để lưu");
      return;
    }
    if (typeof window !== "undefined" && window.parent !== window) {
      window.parent.postMessage(
        {
          type: "vf-admin-saved",
          productType: "accessory",
          productId: product.id,
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
          hasUnsavedChanges ? "border-amber-400 ring-2 ring-amber-200" : "border-brand/30 ring-1 ring-brand/10"
        } ${className ?? ""}`}
      >
        <div className="relative overflow-hidden">
          <img
            src={draft.image}
            alt={draft.name}
            className="aspect-square w-full bg-[#f7f9f9] object-contain p-3"
          />
          <button type="button" onClick={requestImage} className={adminFormImageBtn}>
            Đổi ảnh
          </button>
          {(draft.badge || !draft.inStock) && (
            <div className="absolute left-2 top-2 z-10 flex flex-col gap-1">
              {draft.badge ? (
                <span className="rounded bg-brand px-1.5 py-0.5 text-[9px] font-extrabold uppercase text-white">
                  {draft.badge}
                </span>
              ) : null}
              {!draft.inStock ? (
                <span className="rounded bg-slate-400 px-1.5 py-0.5 text-[9px] font-extrabold uppercase text-white">
                  Hết hàng
                </span>
              ) : null}
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2 p-3 sm:gap-2.5 sm:p-4">
          <select
            value={draft.category}
            onChange={(e) =>
              setDraft((prev) => ({
                ...prev,
                category: e.target.value as AccessoryProduct["category"],
              }))
            }
            className={adminFormSelect}
          >
            {CATEGORY_OPTIONS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>

          <div>
            <label className={adminFormLabel}>Tên sản phẩm</label>
            <input
              value={draft.name}
              onChange={(e) => setDraft((prev) => ({ ...prev, name: e.target.value }))}
              className={`mt-1 ${adminFormInput} ${vfCatalogCardTitle}`}
            />
          </div>

          <div>
            <label className={adminFormLabel}>Mô tả ngắn</label>
            <textarea
              value={draft.description}
              onChange={(e) => setDraft((prev) => ({ ...prev, description: e.target.value }))}
              rows={3}
              className={`mt-1 ${adminFormTextarea} text-[11px]`}
            />
          </div>

          <div>
            <label className={adminFormLabel}>Badge</label>
            <input
              value={draft.badge ?? ""}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, badge: e.target.value || undefined }))
              }
              placeholder="Ví dụ: Bán chạy"
              className={`mt-1 ${adminFormInput} text-xs`}
            />
          </div>

          <div>
            <label className={adminFormLabel}>Dòng xe (vf8, all, …)</label>
            <input
              value={vehiclesToText(draft.vehicles)}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, vehicles: textToVehicles(e.target.value) }))
              }
              className={`mt-1 ${adminFormInput} text-xs`}
            />
          </div>

          <div>
            <label className={adminFormLabel}>Giá bán ưu đãi (đ)</label>
            <input
              value={new Intl.NumberFormat("vi-VN").format(draft.price)}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, "");
                setDraft((prev) => ({ ...prev, price: digits ? Number(digits) : 0 }));
              }}
              className={`mt-1 ${adminFormInput} font-black tabular-nums`}
            />
          </div>

          <label className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-600">
            <input
              type="checkbox"
              checked={draft.inStock}
              onChange={(e) => setDraft((prev) => ({ ...prev, inStock: e.target.checked }))}
              className="rounded border-slate-300"
            />
            Còn hàng
          </label>

          <div className="mt-auto grid grid-cols-2 gap-2 border-t border-slate-100 pt-2.5">
            <button
              type="button"
              onClick={() => setDraft(product)}
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
            href={`${accessoryDetailPath(product)}/preview?admin=1`}
            target="_blank"
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
      className={`catalog-card group flex h-full flex-col border border-slate-200 bg-white ${className ?? ""}`}
    >
      <Link href={accessoryDetailPath(product)} className="relative block overflow-hidden">
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
              <span className="rounded bg-brand px-1.5 py-0.5 text-[9px] font-extrabold uppercase text-white">
                {product.badge}
              </span>
            )}
            {!product.inStock && (
              <span className="rounded bg-slate-400 px-1.5 py-0.5 text-[9px] font-extrabold uppercase text-white">
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
          <h3 className={`mt-0.5 line-clamp-2 min-h-[2.5rem] ${vfCatalogCardTitle}`}>
            <Link href={accessoryDetailPath(product)} className="hover:text-brand">
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
            href={accessoryDetailPath(product)}
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
