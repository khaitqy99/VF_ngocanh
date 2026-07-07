"use client";

import { useState } from "react";
import { GripVertical, Plus, Trash2 } from "lucide-react";

import { adminFormInput, adminFormLabel } from "@/components/admin-edit/admin-form-styles";
import { useHomeAdminEdit } from "@/components/admin-edit/home/HomeAdminEditContext";
import { moveListItem } from "@/components/admin-edit/home/HomeEditListControls";
import { formatPrice } from "@/lib/cars";

export function HomeAccessoryPicker() {
  const edit = useHomeAdminEdit();
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const [pickId, setPickId] = useState("");

  if (!edit?.editMode) return null;

  const options = edit.draft.accessoriesCatalog;
  const selected = edit.draft.featuredAccessoryIds;

  const nameById = new Map(options.map((option) => [option.id, option.name]));
  const priceById = new Map(options.map((option) => [option.id, option.price]));

  const available = options.filter((option) => !selected.includes(option.id));
  const effectivePickId = available.some((option) => option.id === pickId)
    ? pickId
    : (available[0]?.id ?? "");

  const addSelected = (id: string) => {
    if (!id || selected.includes(id)) return;
    edit.setFeaturedAccessoryIds([...selected, id]);
  };

  const removeAt = (index: number) => {
    edit.setFeaturedAccessoryIds(selected.filter((_, itemIndex) => itemIndex !== index));
  };

  const finishDrag = (toIndex: number) => {
    if (dragIndex == null || dragIndex === toIndex) {
      setDragIndex(null);
      setOverIndex(null);
      return;
    }
    edit.setFeaturedAccessoryIds(moveListItem(selected, dragIndex, toIndex));
    setDragIndex(null);
    setOverIndex(null);
  };

  return (
    <div className="mb-4 rounded-xl border border-brand/25 bg-brand/5 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[11px] font-semibold text-brand-dark">
          Phụ kiện hiển thị
          <span className="ml-2 font-normal text-slate-500">
            — chọn tối đa 8 sản phẩm, kéo thả sắp xếp
          </span>
        </p>
        <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-bold text-brand">
          {selected.length} / 8
        </span>
      </div>

      <div className="mt-3 rounded-lg border border-dashed border-brand/30 bg-white/80 p-2.5">
        <label className={adminFormLabel}>Thêm phụ kiện</label>
        <div className="mt-1.5 flex items-center gap-2">
          <select
            value={effectivePickId}
            onChange={(event) => setPickId(event.target.value)}
            disabled={available.length === 0 || selected.length >= 8}
            className={`${adminFormInput} min-w-0 flex-1 py-1.5 text-xs disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {available.length === 0 ? (
              <option value="">Đã chọn hết hoặc đủ 8 sản phẩm</option>
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
            onClick={() => effectivePickId && addSelected(effectivePickId)}
            disabled={!effectivePickId || selected.length >= 8}
            className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-brand px-3 py-1.5 text-[11px] font-bold text-white transition hover:bg-[#0046cc] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus className="size-3.5" />
            Thêm
          </button>
        </div>
      </div>

      {selected.length > 0 ? (
        <ul className="mt-3 space-y-1.5">
          {selected.map((id, index) => (
            <li
              key={id}
              draggable
              onDragStart={() => setDragIndex(index)}
              onDragOver={(event) => {
                event.preventDefault();
                setOverIndex(index);
              }}
              onDragEnd={() => finishDrag(overIndex ?? index)}
              onDrop={(event) => {
                event.preventDefault();
                finishDrag(index);
              }}
              className={`flex items-center gap-2 rounded-lg border bg-white px-2 py-1.5 ${
                dragIndex === index
                  ? "border-brand opacity-60"
                  : overIndex === index
                    ? "border-brand ring-1 ring-brand/30"
                    : "border-slate-200"
              }`}
            >
              <GripVertical className="size-3.5 shrink-0 cursor-grab text-slate-400" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-brand-dark">
                  {nameById.get(id) ?? id}
                </p>
                <p className="text-[10px] text-slate-500">
                  {formatPrice(priceById.get(id) ?? 0)} VNĐ
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeAt(index)}
                className="rounded p-1 text-red-500 hover:bg-red-50"
                aria-label="Xóa"
              >
                <Trash2 className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-500">
          Chưa chọn phụ kiện nào. Mặc định sẽ lấy 8 sản phẩm đầu danh mục.
        </p>
      )}
    </div>
  );
}
