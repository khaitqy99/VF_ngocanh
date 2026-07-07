"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, GripVertical, Plus, Trash2 } from "lucide-react";

import { adminFormInput, adminFormLabel } from "@/components/admin-edit/admin-form-styles";
import { cn } from "@/lib/utils";
import { useHomeAdminEdit } from "@/components/admin-edit/home/HomeAdminEditContext";
import type {
  HomeFeaturedPriceOverride,
  HomeFeaturedPrices,
  HomeFeaturedSlideOverride,
  HomeFeaturedSlideOverrides,
} from "@/lib/cms/home-content";
import { formatPrice } from "@/lib/cars";
import {
  VINFAST_FEATURED_CARS,
  VINFAST_FEATURED_SCOOTERS,
  type VinFastHomeSlide,
  type VinFastHomeSpec,
} from "@/lib/vinfast-home";

function moveArrayItem<T>(items: T[], from: number, to: number): T[] {
  if (from < 0 || from >= items.length || to < 0 || to >= items.length || from === to) {
    return items;
  }
  const next = [...items];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved!);
  return next;
}

function formatPriceInput(value?: number) {
  if (value == null || Number.isNaN(value)) return "";
  return new Intl.NumberFormat("vi-VN").format(value);
}

function parsePriceInput(raw: string): number | undefined {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return undefined;
  return Number(digits);
}

function isPriceSpec(spec: VinFastHomeSpec) {
  return Boolean(spec.highlight) || /giá/i.test(spec.label) || /vnđ/i.test(spec.value);
}

function getDefaultSlide(
  id: string,
  kind: "car" | "scooter",
  options: { id: string; name: string; price: number }[],
): VinFastHomeSlide {
  const defaults = kind === "car" ? VINFAST_FEATURED_CARS : VINFAST_FEATURED_SCOOTERS;
  const found = defaults.find((slide) => slide.href?.endsWith(`/${id}`));
  if (found) return found;

  const vehicle = options.find((option) => option.id === id);
  const prefix = kind === "car" ? "/oto" : "/xe-may-dien";
  return {
    title: vehicle?.name ?? id,
    subtitle: "",
    image: "",
    imageAlt: vehicle?.name ?? id,
    imageClass: "h-full w-full object-contain object-left",
    specs: [
      {
        value: `${formatPrice(vehicle?.price ?? 0)} VNĐ`,
        label: "Giá bán từ",
        highlight: true,
      },
    ],
    primaryCta: kind === "car" ? "ĐẶT CỌC" : "ĐẶT MUA",
    secondaryCta: "KHÁM PHÁ NGAY",
    href: `${prefix}/${id}`,
  };
}

function mergeDisplaySpecs(
  baseline: VinFastHomeSpec[],
  override?: HomeFeaturedSlideOverride,
): VinFastHomeSpec[] {
  if (!override?.specs?.length) return baseline;
  return baseline.map((spec, index) => {
    const patch = override.specs?.[index];
    if (!patch) return spec;
    return {
      ...spec,
      value: patch.value?.trim() ? patch.value : spec.value,
      label: patch.label?.trim() ? patch.label : spec.label,
      highlight: patch.highlight ?? spec.highlight,
      seats: patch.seats ?? spec.seats,
      listPrice: patch.listPrice?.trim() ? patch.listPrice : spec.listPrice,
    };
  });
}

function FeaturedField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-0.5 block text-[9px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </span>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`${adminFormInput} py-1 text-xs`}
      />
    </label>
  );
}

function FeaturedSortableList({
  kind,
  selected,
  options,
  prices,
  slideOverrides,
  onChange,
  onPriceChange,
  onSlideChange,
}: {
  kind: "car" | "scooter";
  selected: string[];
  options: { id: string; name: string; price: number }[];
  prices: HomeFeaturedPrices;
  slideOverrides: HomeFeaturedSlideOverrides;
  onChange: (ids: string[]) => void;
  onPriceChange: (id: string, patch: Partial<HomeFeaturedPriceOverride>) => void;
  onSlideChange: (id: string, patch: Partial<HomeFeaturedSlideOverride>) => void;
}) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());
  const prevLengthRef = useRef(selected.length);

  useEffect(() => {
    if (selected.length > prevLengthRef.current) {
      const lastIndex = selected.length - 1;
      const lastId = selected[lastIndex];
      if (lastId) {
        setExpandedKeys((prev) => new Set(prev).add(`${lastId}-${lastIndex}`));
      }
    }
    prevLengthRef.current = selected.length;
  }, [selected]);

  const toggleExpanded = (key: string) => {
    setExpandedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const nameById = new Map(options.map((option) => [option.id, option.name]));

  const removeAt = (index: number) => {
    onChange(selected.filter((_, itemIndex) => itemIndex !== index));
  };

  const replaceAt = (index: number, nextId: string) => {
    if (!nextId || (selected.includes(nextId) && selected[index] !== nextId)) return;
    onChange(selected.map((id, itemIndex) => (itemIndex === index ? nextId : id)));
  };

  const handleDrop = (targetIndex: number) => {
    if (dragIndex === null || dragIndex === targetIndex) {
      setDragIndex(null);
      setOverIndex(null);
      return;
    }
    onChange(moveArrayItem(selected, dragIndex, targetIndex));
    setDragIndex(null);
    setOverIndex(null);
  };

  const updateSpec = (
    id: string,
    baseline: VinFastHomeSlide,
    slideOverride: HomeFeaturedSlideOverride | undefined,
    specIndex: number,
    field: "value" | "label",
    value: string,
  ) => {
    const current = mergeDisplaySpecs(baseline.specs, slideOverride);
    const nextSpecs = current.map((spec, index) =>
      index === specIndex ? { ...spec, [field]: value } : spec,
    );
    onSlideChange(id, {
      title: slideOverride?.title,
      subtitle: slideOverride?.subtitle,
      specs: nextSpecs,
    });
  };

  return (
    <div className="mt-2">
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <label className={adminFormLabel}>Danh sách trên carousel — kéo thả để sắp xếp</label>
        <button
          type="button"
          onClick={() => onChange([])}
          className="text-[10px] font-semibold text-red-600 hover:underline"
        >
          Xóa tất cả
        </button>
      </div>
      <div className="space-y-2">
        {selected.map((id, index) => {
          const itemKey = `${id}-${index}`;
          const isExpanded = expandedKeys.has(itemKey);
          const slideOverride = slideOverrides[id];
          const baseline = getDefaultSlide(id, kind, options);
          const displayTitle = slideOverride?.title?.trim() ? slideOverride.title : baseline.title;
          const displaySubtitle =
            slideOverride?.subtitle !== undefined
              ? slideOverride.subtitle
              : (baseline.subtitle ?? "");
          const displaySpecs = mergeDisplaySpecs(baseline.specs, slideOverride);
          const priceSpecIndex = displaySpecs.findIndex(isPriceSpec);

          return (
            <div
              key={itemKey}
              onDragOver={(event) => {
                event.preventDefault();
                setOverIndex(index);
              }}
              onDragLeave={() => {
                if (overIndex === index) setOverIndex(null);
              }}
              onDrop={(event) => {
                event.preventDefault();
                handleDrop(index);
              }}
              className={`rounded-lg border bg-white transition ${
                dragIndex === index
                  ? "border-brand bg-brand/5 opacity-60"
                  : overIndex === index
                    ? "border-brand ring-2 ring-brand/20"
                    : "border-slate-200"
              }`}
            >
              <div className="flex items-center gap-1.5 p-2">
                <button
                  type="button"
                  draggable
                  aria-label="Kéo để sắp xếp"
                  onDragStart={() => setDragIndex(index)}
                  onDragEnd={() => {
                    setDragIndex(null);
                    setOverIndex(null);
                  }}
                  className="cursor-grab touch-none rounded p-1 text-slate-400 hover:text-brand active:cursor-grabbing"
                >
                  <GripVertical className="size-4" />
                </button>
                <span className="w-5 shrink-0 text-center text-[10px] font-bold text-slate-400">
                  {index + 1}
                </span>
                <select
                  value={id}
                  onChange={(event) => replaceAt(index, event.target.value)}
                  className={`${adminFormInput} min-w-0 flex-1 py-1 text-xs font-semibold`}
                >
                  {!nameById.has(id) ? (
                    <option value={id}>{id} (không còn trong danh mục)</option>
                  ) : null}
                  {options.map((option) => (
                    <option
                      key={option.id}
                      value={option.id}
                      disabled={selected.includes(option.id) && option.id !== id}
                    >
                      {option.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => toggleExpanded(itemKey)}
                  aria-expanded={isExpanded}
                  aria-label={isExpanded ? "Thu gọn form sửa" : "Mở form sửa nội dung carousel"}
                  className="rounded p-1 text-slate-500 transition hover:bg-slate-100 hover:text-brand"
                >
                  <ChevronDown
                    className={cn(
                      "size-4 transition-transform duration-200",
                      isExpanded && "rotate-180",
                    )}
                  />
                </button>
                <button
                  type="button"
                  onClick={() => removeAt(index)}
                  className="rounded p-1 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                  aria-label="Xóa khỏi carousel"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>

              {isExpanded ? (
                <div className="space-y-2 border-t border-slate-100 px-2 pb-2 pt-2">
                  <div className="space-y-2 rounded-md border border-slate-100 bg-slate-50/80 p-2">
                    <p className="text-[9px] font-bold uppercase tracking-wide text-slate-500">
                      Nội dung hiển thị trên carousel
                    </p>
                    <FeaturedField
                      label="Tên xe"
                      value={displayTitle}
                      onChange={(title) =>
                        onSlideChange(id, {
                          ...slideOverride,
                          title,
                          specs: displaySpecs,
                        })
                      }
                    />
                    <FeaturedField
                      label="Dòng phụ"
                      value={displaySubtitle}
                      onChange={(subtitle) =>
                        onSlideChange(id, {
                          ...slideOverride,
                          title: displayTitle,
                          subtitle,
                          specs: displaySpecs,
                        })
                      }
                    />

                    {displaySpecs.map((spec, specIndex) => {
                      if (specIndex === priceSpecIndex) return null;
                      const specLabel = spec.seats ? "Số chỗ" : `Thông số ${specIndex + 1}`;
                      return (
                        <div key={`${id}-spec-${specIndex}`} className="grid gap-2 sm:grid-cols-2">
                          <FeaturedField
                            label={`${specLabel} — giá trị`}
                            value={spec.value}
                            onChange={(value) =>
                              updateSpec(id, baseline, slideOverride, specIndex, "value", value)
                            }
                          />
                          <FeaturedField
                            label={`${specLabel} — nhãn`}
                            value={spec.label}
                            onChange={(value) =>
                              updateSpec(id, baseline, slideOverride, specIndex, "label", value)
                            }
                          />
                        </div>
                      );
                    })}

                    {priceSpecIndex >= 0 ? (
                      <div className="space-y-2 border-t border-slate-200 pt-2">
                        <div className="grid gap-2 sm:grid-cols-2">
                          <FeaturedField
                            label="Giá bán từ — giá trị"
                            value={displaySpecs[priceSpecIndex]?.value ?? ""}
                            onChange={(value) =>
                              updateSpec(
                                id,
                                baseline,
                                slideOverride,
                                priceSpecIndex,
                                "value",
                                value,
                              )
                            }
                          />
                          <FeaturedField
                            label="Giá bán từ — nhãn"
                            value={displaySpecs[priceSpecIndex]?.label ?? "Giá bán từ"}
                            onChange={(value) =>
                              updateSpec(
                                id,
                                baseline,
                                slideOverride,
                                priceSpecIndex,
                                "label",
                                value,
                              )
                            }
                          />
                        </div>
                        <label className="block min-w-0">
                          <span className="mb-0.5 block text-[9px] font-semibold uppercase tracking-wide text-slate-500">
                            Giá cũ gạch ngang (tuỳ chọn)
                          </span>
                          <input
                            type="text"
                            inputMode="numeric"
                            value={formatPriceInput(prices[id]?.listPrice)}
                            placeholder="VD: 819.000.000"
                            onChange={(event) =>
                              onPriceChange(id, { listPrice: parsePriceInput(event.target.value) })
                            }
                            className={`${adminFormInput} py-1 text-xs tabular-nums`}
                          />
                        </label>
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : (
                <p className="border-t border-slate-100 px-2 pb-2 pt-1.5 text-[10px] text-slate-400">
                  Bấm <span className="font-semibold text-slate-500">mũi tên</span> để sửa tên &
                  thông số hiển thị
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FeaturedAddBar({
  options,
  selected,
  onAdd,
  kindLabel,
}: {
  options: { id: string; name: string; price: number }[];
  selected: string[];
  onAdd: (id: string) => void;
  kindLabel: string;
}) {
  const available = options.filter((option) => !selected.includes(option.id));
  const [pickId, setPickId] = useState(available[0]?.id ?? "");
  const effectivePickId = available.some((option) => option.id === pickId)
    ? pickId
    : (available[0]?.id ?? "");

  return (
    <div className="mt-3 rounded-lg border border-dashed border-brand/30 bg-white/80 p-2.5">
      <label className={adminFormLabel}>Thêm {kindLabel} vào carousel</label>
      <div className="mt-1.5 flex items-center gap-2">
        <select
          value={effectivePickId}
          onChange={(event) => setPickId(event.target.value)}
          disabled={available.length === 0}
          className={`${adminFormInput} min-w-0 flex-1 py-1.5 text-xs disabled:cursor-not-allowed disabled:opacity-50`}
        >
          {available.length === 0 ? (
            <option value="">Đã thêm hết xe trong danh mục</option>
          ) : (
            available.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))
          )}
        </select>
        <button
          type="button"
          onClick={() => effectivePickId && onAdd(effectivePickId)}
          disabled={!effectivePickId}
          className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-brand px-3 py-1.5 text-[11px] font-bold text-white transition hover:bg-[#0046cc] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Plus className="size-3.5" />
          Thêm
        </button>
      </div>
      {available.length === 0 && options.length > 0 ? (
        <p className="mt-1.5 text-[10px] text-slate-500">
          Xóa một xe khỏi danh sách bên dưới để chọn xe khác.
        </p>
      ) : null}
      {options.length === 0 ? (
        <p className="mt-1.5 text-[10px] text-amber-700">
          Chưa có xe trong danh mục. Thêm xe tại Admin → {kindLabel} trước.
        </p>
      ) : null}
    </div>
  );
}

export function HomeFeaturedPicker({ kind }: { kind: "car" | "scooter" }) {
  const edit = useHomeAdminEdit();
  if (!edit?.editMode) return null;

  const kindLabel = kind === "car" ? "Ô tô" : "Xe máy";
  const options = kind === "car" ? edit.draft.cars : edit.draft.scooters;
  const selected = kind === "car" ? edit.draft.featuredCarIds : edit.draft.featuredScooterIds;
  const prices = kind === "car" ? edit.draft.featuredCarPrices : edit.draft.featuredScooterPrices;
  const slideOverrides =
    kind === "car"
      ? edit.draft.featuredCarSlideOverrides
      : edit.draft.featuredScooterSlideOverrides;
  const setSelected = kind === "car" ? edit.setFeaturedCarIds : edit.setFeaturedScooterIds;
  const onPriceChange =
    kind === "car" ? edit.updateFeaturedCarPrice : edit.updateFeaturedScooterPrice;
  const onSlideChange =
    kind === "car" ? edit.updateFeaturedCarSlide : edit.updateFeaturedScooterSlide;

  const addSelected = (id: string) => {
    if (!id || selected.includes(id)) return;
    setSelected([...selected, id]);
  };

  return (
    <div className="mb-4 rounded-xl border border-brand/25 bg-brand/5 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[11px] font-semibold text-brand-dark">
          {kind === "car" ? "Ô tô nổi bật" : "Xe máy nổi bật"}
          <span className="ml-2 font-normal text-slate-500">
            — chọn xe, kéo thả sắp xếp, bấm mũi tên để sửa nội dung
          </span>
        </p>
        <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-bold text-brand">
          {selected.length} xe
        </span>
      </div>

      <FeaturedAddBar
        options={options}
        selected={selected}
        onAdd={addSelected}
        kindLabel={kindLabel}
      />

      {selected.length > 0 ? (
        <FeaturedSortableList
          kind={kind}
          selected={selected}
          options={options}
          prices={prices}
          slideOverrides={slideOverrides}
          onChange={setSelected}
          onPriceChange={onPriceChange}
          onSlideChange={onSlideChange}
        />
      ) : (
        <p className="mt-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-500">
          Chưa có xe nào trên carousel. Chọn xe ở ô phía trên và bấm <strong>Thêm</strong>.
        </p>
      )}
    </div>
  );
}
