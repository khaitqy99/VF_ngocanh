"use client";

import { Eye, Pencil, RotateCcw, Save } from "lucide-react";
import { useAdminEdit } from "@/components/admin-edit/AdminEditContext";

export function AdminEditToolbar() {
  const edit = useAdminEdit();
  if (!edit) return null;

  return (
    <div className="sticky top-0 z-[70] border-b border-brand/30 bg-brand-dark px-4 py-2.5 text-white shadow-lg">
      <div className="container-vf flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm">
          <Pencil className="size-4 text-accent-yellow" />
          <span className="font-semibold">Sửa trực tiếp trên trang</span>
          {edit.hasUnsavedChanges ? (
            <span className="rounded bg-accent-yellow/20 px-2 py-0.5 text-[10px] font-bold text-accent-yellow">
              Chưa lưu
            </span>
          ) : null}
          <span className="hidden text-white/60 sm:inline">
            — click vào từng ô nội dung để chỉnh
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => edit.setEditMode(!edit.editMode)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/25 px-3 py-1.5 text-xs font-bold hover:bg-white/10"
          >
            {edit.editMode ? <Eye className="size-3.5" /> : <Pencil className="size-3.5" />}
            {edit.editMode ? "Xem thật" : "Bật sửa"}
          </button>
          <button
            type="button"
            onClick={edit.reset}
            disabled={!edit.hasUnsavedChanges}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/25 px-3 py-1.5 text-xs font-bold hover:bg-white/10"
          >
            <RotateCcw className="size-3.5" />
            Hoàn tác
          </button>
          <button
            type="button"
            onClick={edit.save}
            disabled={!edit.hasUnsavedChanges}
            className="inline-flex items-center gap-1.5 rounded-lg bg-accent-yellow px-3 py-1.5 text-xs font-bold text-brand-dark hover:bg-yellow-300"
          >
            <Save className="size-3.5" />
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}
