"use client";

import { Save, Undo2 } from "lucide-react";

import { useHomeAdminEdit } from "@/components/admin-edit/home/HomeAdminEditContext";

export function HomeAdminEditToolbar() {
  const edit = useHomeAdminEdit();
  if (!edit?.editMode) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[250] flex justify-center p-3 sm:p-4">
      <div className="pointer-events-auto flex w-full max-w-3xl flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white/95 px-3 py-2.5 shadow-xl backdrop-blur sm:px-4">
        <p className="hidden min-w-0 flex-1 text-xs text-slate-500 sm:block">
          {edit.hasUnsavedChanges
            ? "Có thay đổi chưa lưu — chỉnh trực tiếp trên từng khối"
            : "Chỉnh trực tiếp nội dung trên trang chủ"}
        </p>
        <label className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600">
          <span className="hidden sm:inline">Trạng thái</span>
          <select
            value={edit.draft.status}
            onChange={(event) =>
              edit.setStatus(event.target.value === "draft" ? "draft" : "published")
            }
            className="rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs font-bold text-brand-dark"
          >
            <option value="published">Xuất bản</option>
            <option value="draft">Bản nháp</option>
          </select>
        </label>
        <button
          type="button"
          onClick={edit.reset}
          disabled={!edit.hasUnsavedChanges}
          className="inline-flex items-center justify-center gap-1.5 rounded-md border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 disabled:opacity-40"
        >
          <Undo2 className="h-3.5 w-3.5" />
          Hoàn tác
        </button>
        <button
          type="button"
          onClick={edit.save}
          disabled={!edit.hasUnsavedChanges}
          className="inline-flex items-center justify-center gap-1.5 rounded-md bg-brand px-4 py-2 text-xs font-bold text-white hover:bg-[#0046cc] disabled:opacity-40"
        >
          <Save className="h-3.5 w-3.5" />
          Lưu thay đổi
        </button>
      </div>
    </div>
  );
}
