"use client";

import { Plus, Trash2 } from "lucide-react";
import { useAdminEdit } from "@/components/admin-edit/AdminEditContext";

export function EditableListControls({
  path,
  onAdd,
  adminEditable,
  label = "mục",
  minItems = 0,
  index,
}: {
  path: string;
  onAdd: () => void;
  adminEditable?: boolean;
  label?: string;
  minItems?: number;
  index?: number;
}) {
  const edit = useAdminEdit();
  const active = adminEditable && edit?.editMode;

  if (!active || !edit) return null;

  if (index !== undefined) {
    return (
      <button
        type="button"
        onClick={() => edit.removeListItem(path, index, minItems)}
        className="absolute top-2 right-2 z-20 flex size-8 items-center justify-center rounded-full bg-red-600 text-white shadow-lg hover:bg-red-700"
        aria-label={`Xóa ${label}`}
      >
        <Trash2 className="size-3.5" />
      </button>
    );
  }

  return (
    <div className="mt-4 flex justify-center">
      <button
        type="button"
        onClick={onAdd}
        className="inline-flex items-center gap-1.5 rounded-full border-2 border-dashed border-brand/40 bg-brand/5 px-4 py-2 text-xs font-bold text-brand hover:border-brand hover:bg-brand/10"
      >
        <Plus className="size-3.5" />
        Thêm {label}
      </button>
    </div>
  );
}
