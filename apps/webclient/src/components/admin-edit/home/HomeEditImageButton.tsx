"use client";

import { adminFormImageBtn } from "@/components/admin-edit/admin-form-styles";
import { useHomeAdminEdit } from "@/components/admin-edit/home/HomeAdminEditContext";

export function HomeEditImageButton({ imagePath }: { imagePath: string }) {
  const edit = useHomeAdminEdit();
  if (!edit?.editMode) return null;

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        edit.requestImage(imagePath);
      }}
      className={adminFormImageBtn}
    >
      Đổi ảnh
    </button>
  );
}
