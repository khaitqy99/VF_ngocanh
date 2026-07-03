"use client";

import type { ElementType } from "react";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminEdit } from "@/components/admin-edit/AdminEditContext";
import { InlineText } from "@/components/admin-edit/EditablePath";
import { EditableListControls } from "@/components/admin-edit/EditableListControls";
import { EditableImage } from "@/components/admin-edit/EditableImage";
import { DEFAULT_COLOR } from "@/components/admin-edit/list-defaults";
import { getImageAtPath, resolveField } from "@/components/admin-edit/vehicle-edit-paths";

export type ColorItem = {
  id: string;
  name: string;
  hex: string;
  image?: string;
};

export function EditableColorPicker({
  colors,
  adminEditable,
  selectedColor,
  onSelectColor,
  selectedColorName,
  fallbackImage,
  withImage = true,
}: {
  colors: ColorItem[];
  adminEditable?: boolean;
  selectedColor: string;
  onSelectColor: (id: string) => void;
  selectedColorName?: string;
  fallbackImage?: string;
  withImage?: boolean;
}) {
  const edit = useAdminEdit();
  const active = adminEditable && edit?.editMode;

  if (!active || !edit) {
    return (
      <>
        <div className="flex flex-wrap gap-2.5 sm:gap-3">
          {colors.map((c) => (
            <button
              key={c.id}
              type="button"
              title={c.name}
              onClick={() => onSelectColor(c.id)}
              className={`size-8 rounded-full border-2 transition sm:size-9 ${
                selectedColor === c.id
                  ? "border-brand ring-2 ring-brand/30 ring-offset-2"
                  : "border-border hover:border-brand/50"
              }`}
              style={{ backgroundColor: c.hex }}
              aria-label={c.name}
            />
          ))}
        </div>
        {selectedColorName ? (
          <p className="mt-2 text-xs font-medium text-muted-foreground">{selectedColorName}</p>
        ) : null}
      </>
    );
  }

  return (
    <>
      <div className="space-y-2">
        {colors.map((c, i) => {
          const hex = resolveField(edit.values, edit.patches, `colors.${i}.hex`, c.hex);
          return (
            <div
              key={`${c.id}-${i}`}
              className="relative flex flex-wrap items-center gap-2 rounded-xl border border-dashed border-brand/30 bg-brand/5 p-2.5 pr-10"
            >
              <EditableListControls
                path="colors"
                index={i}
                minItems={1}
                adminEditable
                label="màu"
                onAdd={() => undefined}
              />
              <button
                type="button"
                title="Chọn xem preview"
                onClick={() => onSelectColor(c.id)}
                className={cn(
                  "size-9 shrink-0 rounded-full border-2 transition",
                  selectedColor === c.id
                    ? "border-brand ring-2 ring-brand/30 ring-offset-1"
                    : "border-border hover:border-brand/50",
                )}
                style={{ backgroundColor: hex }}
                aria-label={c.name}
              />
              <label className="flex items-center gap-1">
                <span className="sr-only">Mã màu</span>
                <input
                  type="color"
                  value={hex.startsWith("#") ? hex : `#${hex.replace("#", "")}`}
                  onChange={(e) => edit.updateField(`colors.${i}.hex`, e.target.value)}
                  className="size-8 cursor-pointer rounded border border-border/60 bg-white p-0.5"
                />
              </label>
              <InlineText
                path={`colors.${i}.name`}
                fallback={c.name}
                adminEditable={adminEditable}
                className="min-w-[5rem] flex-1 text-xs font-medium text-brand-dark"
                label="Tên màu"
              />
              {withImage && fallbackImage ? (
                <EditableImage
                  path={`colors.${i}.image`}
                  src={c.image ?? fallbackImage}
                  adminEditable={adminEditable}
                  className="size-10 shrink-0 overflow-hidden rounded-lg ring-1 ring-border/50"
                  imgClassName="size-10 object-cover"
                />
              ) : null}
            </div>
          );
        })}
      </div>
      <EditableListControls
        path="colors"
        adminEditable
        label="màu sắc"
        onAdd={() => edit.addListItem("colors", DEFAULT_COLOR(fallbackImage))}
      />
      {selectedColorName ? (
        <p className="mt-2 text-xs font-medium text-muted-foreground">
          Đang xem: {selectedColorName}
        </p>
      ) : null}
    </>
  );
}

export function EditableSvgIcon({
  path,
  iconSvg,
  fallbackIcon: FallbackIcon,
  adminEditable,
}: {
  path: string;
  iconSvg?: string;
  fallbackIcon: ElementType;
  adminEditable?: boolean;
}) {
  const edit = useAdminEdit();
  const src = getImageAtPath(edit?.values, path, iconSvg ?? "");
  const active = adminEditable && edit?.editMode;

  const inner = src ? (
    <img src={src} alt="" className="size-6 object-contain brightness-0 invert" />
  ) : (
    <FallbackIcon className="size-6" strokeWidth={1.5} />
  );

  const boxClass =
    "relative flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-[#0046cc] text-white shadow-lg shadow-brand/20";

  if (!active || !edit) {
    return <div className={boxClass}>{inner}</div>;
  }

  return (
    <button
      type="button"
      onClick={() => edit.requestMedia(path, "svg")}
      className={cn(boxClass, "group cursor-pointer")}
      aria-label="Đổi icon SVG"
    >
      {inner}
      <span className="absolute inset-0 flex items-center justify-center rounded-2xl bg-brand-dark/60 opacity-0 transition group-hover:opacity-100">
        <span className="flex items-center gap-1 rounded-md bg-white px-1.5 py-0.5 text-[9px] font-bold text-brand-dark">
          <ImageIcon className="size-3" />
          SVG
        </span>
      </span>
    </button>
  );
}
