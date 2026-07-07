"use client";

import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";

export function HomeEditSectionListBar({
  onAdd,
  addLabel,
}: {
  onAdd: () => void;
  addLabel: string;
}) {
  return (
    <div className="mb-3 flex justify-end">
      <button
        type="button"
        onClick={onAdd}
        className="inline-flex items-center gap-1 rounded-lg border border-brand/30 bg-brand/5 px-2.5 py-1.5 text-[10px] font-bold text-brand transition hover:bg-brand/10"
      >
        <Plus className="size-3" />
        {addLabel}
      </button>
    </div>
  );
}

export function HomeEditListControls({
  onRemove,
  onMoveUp,
  onMoveDown,
  canRemove = true,
  canMoveUp = true,
  canMoveDown = true,
  removeLabel = "Xóa",
}: {
  onRemove?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canRemove?: boolean;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  removeLabel?: string;
}) {
  return (
    <div className="mt-2 flex flex-wrap items-center gap-1">
      {onMoveUp ? (
        <button
          type="button"
          onClick={onMoveUp}
          disabled={!canMoveUp}
          className="inline-flex items-center gap-0.5 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[9px] font-semibold text-slate-600 disabled:opacity-30"
          title="Lên trên"
        >
          <ChevronUp className="size-3" />
        </button>
      ) : null}
      {onMoveDown ? (
        <button
          type="button"
          onClick={onMoveDown}
          disabled={!canMoveDown}
          className="inline-flex items-center gap-0.5 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[9px] font-semibold text-slate-600 disabled:opacity-30"
          title="Xuống dưới"
        >
          <ChevronDown className="size-3" />
        </button>
      ) : null}
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          disabled={!canRemove}
          className="inline-flex items-center gap-0.5 rounded border border-red-200 bg-red-50 px-1.5 py-0.5 text-[9px] font-semibold text-red-600 disabled:opacity-30"
        >
          <Trash2 className="size-3" />
          {removeLabel}
        </button>
      ) : null}
    </div>
  );
}

export function moveListItem<T>(items: T[], from: number, to: number): T[] {
  if (from < 0 || from >= items.length || to < 0 || to >= items.length || from === to) {
    return items;
  }
  const next = [...items];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved!);
  return next;
}
