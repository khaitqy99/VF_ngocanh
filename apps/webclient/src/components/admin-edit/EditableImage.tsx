"use client";

import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminEdit } from "@/components/admin-edit/AdminEditContext";
import { getImageAtPath } from "@/components/admin-edit/vehicle-edit-paths";

const pickerFabClass =
  "absolute top-3 left-3 z-[5] flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-brand-dark shadow-lg ring-1 ring-black/10 transition hover:bg-brand/5";

/** Nút đổi ảnh luôn nổi trên caption/gradient — dùng trong grid có chữ phủ ảnh */
export function ImagePickerFab({
  path,
  className,
  stopPropagation,
}: {
  path: string;
  className?: string;
  stopPropagation?: boolean;
}) {
  const edit = useAdminEdit();
  if (!edit?.editMode) return null;

  return (
    <button
      type="button"
      onClick={(e) => {
        if (stopPropagation) e.stopPropagation();
        edit.requestImage(path);
      }}
      className={cn(pickerFabClass, className)}
      aria-label="Đổi ảnh"
    >
      <ImageIcon className="size-3.5" />
      Đổi ảnh
    </button>
  );
}

export function EditableImage({
  path,
  src,
  alt,
  className,
  adminEditable,
  imgClassName,
  stopPropagation,
  pickOnFab,
}: {
  path: string;
  src: string;
  alt?: string;
  className?: string;
  imgClassName?: string;
  adminEditable?: boolean;
  stopPropagation?: boolean;
  /** Dùng nút nổi thay vì click cả ảnh — tránh bị lớp chữ che */
  pickOnFab?: boolean;
}) {
  const edit = useAdminEdit();
  const display = getImageAtPath(edit?.values, path, src);
  const active = adminEditable && edit?.editMode;

  if (!active || !edit) {
    return <img src={display} alt={alt ?? ""} className={cn(className, imgClassName)} />;
  }

  const useFab = Boolean(pickOnFab);

  if (useFab) {
    return (
      <>
        <img src={display} alt={alt ?? ""} className={cn(className, imgClassName)} />
        <ImagePickerFab path={path} stopPropagation={stopPropagation} />
      </>
    );
  }

  const isAbsolute = Boolean(className?.includes("absolute"));

  return (
    <button
      type="button"
      onClick={(e) => {
        if (stopPropagation) e.stopPropagation();
        edit.requestImage(path);
      }}
      className={cn("group block overflow-hidden text-left", !isAbsolute && "relative", className)}
      aria-label="Đổi ảnh"
    >
      <img
        src={display}
        alt={alt ?? ""}
        className={cn("h-full w-full object-cover", imgClassName)}
      />
      <span className="absolute inset-0 flex items-center justify-center bg-brand-dark/50 opacity-0 transition group-hover:opacity-100">
        <span className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-brand-dark shadow">
          <ImageIcon className="size-3.5" />
          Đổi ảnh
        </span>
      </span>
    </button>
  );
}
