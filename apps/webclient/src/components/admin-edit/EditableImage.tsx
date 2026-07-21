"use client";

import { FolderOpen, ImageIcon, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminEdit } from "@/components/admin-edit/AdminEditContext";
import { getImageAtPath } from "@/components/admin-edit/vehicle-edit-paths";

const actionBtnClass =
  "flex items-center gap-1 rounded-lg bg-white px-2.5 py-1.5 text-[11px] font-bold text-brand-dark shadow-lg ring-1 ring-black/10 transition hover:bg-brand/5";

function ImageActionButtons({
  path,
  kind = "image",
  className,
  stopPropagation,
  vertical = false,
}: {
  path: string;
  kind?: "image" | "svg";
  className?: string;
  stopPropagation?: boolean;
  vertical?: boolean;
}) {
  const edit = useAdminEdit();
  if (!edit?.editMode) return null;

  return (
    <div className={cn("flex gap-1.5", vertical ? "flex-col" : "flex-row flex-wrap", className)}>
      <button
        type="button"
        onClick={(e) => {
          if (stopPropagation) e.stopPropagation();
          edit.requestMedia(path, kind);
        }}
        className={actionBtnClass}
        aria-label="Chọn từ thư viện"
      >
        <FolderOpen className="size-3.5" />
        Thư viện
      </button>
      <button
        type="button"
        onClick={(e) => {
          if (stopPropagation) e.stopPropagation();
          edit.requestUpload(path, kind);
        }}
        className={actionBtnClass}
        aria-label="Upload ảnh từ máy"
      >
        <Upload className="size-3.5" />
        Upload
      </button>
    </div>
  );
}

/** Nút đổi ảnh luôn nổi trên caption/gradient — dùng trong grid có chữ phủ ảnh */
export function ImagePickerFab({
  path,
  className,
  stopPropagation,
  kind = "image",
}: {
  path: string;
  className?: string;
  stopPropagation?: boolean;
  kind?: "image" | "svg";
}) {
  return (
    <ImageActionButtons
      path={path}
      kind={kind}
      className={cn("absolute top-3 left-3 z-[5]", className)}
      stopPropagation={stopPropagation}
      vertical
    />
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
  mediaKind = "image",
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
  mediaKind?: "image" | "svg";
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
        <ImagePickerFab path={path} kind={mediaKind} stopPropagation={stopPropagation} />
      </>
    );
  }

  const isAbsolute = Boolean(className?.includes("absolute"));

  return (
    <div
      className={cn("group relative block overflow-hidden", !isAbsolute && "relative", className)}
    >
      <img
        src={display}
        alt={alt ?? ""}
        className={cn("h-full w-full object-cover", imgClassName)}
      />
      <div className="absolute inset-0 flex items-center justify-center bg-brand-dark/50 opacity-0 transition group-hover:opacity-100">
        <div className="flex flex-col items-center gap-2">
          <ImageIcon className="size-5 text-white/90" />
          <ImageActionButtons path={path} kind={mediaKind} stopPropagation={stopPropagation} />
        </div>
      </div>
    </div>
  );
}
