"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";

import { cn } from "@/lib/utils";
import { useStaticPageAdminEdit } from "@/components/admin-edit/static-page/StaticPageAdminEditContext";

function EditHint({ dark }: { dark?: boolean }) {
  return (
    <span
      className={cn(
        "pointer-events-none absolute -top-2 right-0 flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide",
        dark ? "bg-brand text-white" : "bg-accent-yellow text-brand-dark",
      )}
    >
      <Pencil className="size-2.5" />
      Sửa
    </span>
  );
}

function isLightText(className?: string) {
  return /text-white/i.test(className ?? "");
}

export function StaticEditableText({
  value,
  onChange,
  className,
  multiline,
  label = "Chỉnh sửa",
}: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  multiline?: boolean;
  label?: string;
}) {
  const edit = useStaticPageAdminEdit();
  const [focused, setFocused] = useState(false);
  const light = isLightText(className);

  if (!edit?.editMode) {
    return <span className={className}>{value}</span>;
  }

  if (multiline) {
    return (
      <span className="relative block w-full">
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          rows={3}
          className={cn(
            className,
            "w-full resize-y rounded-lg border-2 px-2 py-1.5 outline-none transition",
            light
              ? "border-white/30 bg-white/10 text-white placeholder:text-white/50 hover:border-white/50"
              : "border-border bg-white text-brand-dark hover:border-brand/40",
            focused ? (light ? "border-accent-yellow" : "border-brand ring-2 ring-brand/20") : null,
          )}
          aria-label={label}
        />
        <EditHint dark={!light} />
      </span>
    );
  }

  return (
    <span className="relative inline-block w-full max-w-full">
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={cn(
          className,
          "w-full min-w-0 rounded-md border-2 px-2 py-0.5 outline-none transition",
          light
            ? "border-white/30 bg-white/10 text-white placeholder:text-white/50 hover:border-white/50"
            : "border-border bg-white text-brand-dark hover:border-brand/40",
          focused ? (light ? "border-accent-yellow" : "border-brand ring-2 ring-brand/20") : null,
        )}
        aria-label={label}
      />
      <EditHint dark={!light} />
    </span>
  );
}

export function StaticEditImageButton({ imagePath }: { imagePath: string }) {
  const edit = useStaticPageAdminEdit();
  if (!edit?.editMode) return null;

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        edit.requestImage(imagePath);
      }}
      className="absolute right-2 top-2 z-10 rounded-md bg-brand px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow"
    >
      Đổi ảnh
    </button>
  );
}

export function StaticEditHeroBannerControls({
  imagePath,
  imageAlt,
  imageAltPath,
  imagePosition = "center",
  imagePositionPath,
}: {
  imagePath: string;
  imageAlt: string;
  imageAltPath: string;
  imagePosition?: "top" | "center" | "bottom";
  imagePositionPath: string;
}) {
  const edit = useStaticPageAdminEdit();
  if (!edit?.editMode) return null;

  return (
    <div className="w-[220px] rounded-xl border border-white/30 bg-white/85 p-2.5 text-brand-dark shadow-lg backdrop-blur">
      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          edit.requestImage(imagePath);
        }}
        className="mb-2 w-full rounded-md bg-brand px-2 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white"
      >
        Đổi ảnh banner
      </button>
      <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-slate-600">
        Alt ảnh banner
      </label>
      <input
        type="text"
        value={imageAlt}
        onChange={(event) => edit.updateField(imageAltPath, event.target.value)}
        className="mb-2 w-full rounded-md border border-border bg-white px-2 py-1.5 text-xs outline-none transition hover:border-brand/40 focus:border-brand"
      />
      <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-slate-600">
        Vị trí ảnh
      </label>
      <select
        value={imagePosition}
        onChange={(event) => edit.updateField(imagePositionPath, event.target.value)}
        className="w-full rounded-md border border-border bg-white px-2 py-1.5 text-xs outline-none transition hover:border-brand/40 focus:border-brand"
      >
        <option value="top">Canh trên</option>
        <option value="center">Canh giữa</option>
        <option value="bottom">Canh dưới</option>
      </select>
    </div>
  );
}
