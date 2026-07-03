"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminEdit } from "@/components/admin-edit/AdminEditContext";

export function EditableText({
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
  const edit = useAdminEdit();
  const [focused, setFocused] = useState(false);

  if (!edit?.editMode) {
    return <span className={className}>{value}</span>;
  }

  if (multiline) {
    return (
      <span className="relative block">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          rows={3}
          className={cn(
            className,
            "w-full resize-y rounded-lg border-2 px-2 py-1.5 outline-none transition",
            /text-white/i.test(className ?? "")
              ? "border-white/30 bg-white/10 text-white placeholder:text-white/50 hover:border-white/50"
              : "border-border bg-white text-brand-dark hover:border-brand/40",
            focused
              ? /text-white/i.test(className ?? "")
                ? "border-accent-yellow"
                : "border-brand ring-2 ring-brand/20"
              : null,
          )}
          aria-label={label}
        />
        <EditHint dark={!/text-white/i.test(className ?? "")} />
      </span>
    );
  }

  return (
    <span className="relative inline-block max-w-full">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={cn(
          className,
          "w-full min-w-0 rounded-md border-2 px-2 py-0.5 outline-none transition",
          /text-white/i.test(className ?? "")
            ? "border-white/30 bg-white/10 text-white placeholder:text-white/50 hover:border-white/50"
            : "border-border bg-white text-brand-dark hover:border-brand/40",
          focused
            ? /text-white/i.test(className ?? "")
              ? "border-accent-yellow"
              : "border-brand ring-2 ring-brand/20"
            : null,
        )}
        aria-label={label}
      />
      <EditHint dark={!/text-white/i.test(className ?? "")} />
    </span>
  );
}

export function EditableTextBlock({
  value,
  onChange,
  className,
  label = "Chỉnh sửa",
}: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  label?: string;
}) {
  const edit = useAdminEdit();
  const [focused, setFocused] = useState(false);

  if (!edit?.editMode) {
    return <div className={className}>{value}</div>;
  }

  return (
    <span className="relative block">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        rows={4}
        className={cn(
          className,
          "w-full resize-y rounded-lg border-2 border-border bg-white px-3 py-2 text-inherit outline-none transition",
          focused ? "border-brand ring-2 ring-brand/20" : "hover:border-brand/40",
        )}
        aria-label={label}
      />
      <EditHint dark />
    </span>
  );
}

export function EditablePrice({
  value,
  onChange,
  className,
}: {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}) {
  const edit = useAdminEdit();
  const [focused, setFocused] = useState(false);
  const display = new Intl.NumberFormat("vi-VN").format(value);

  if (!edit?.editMode) {
    return <span className={className}>{display}</span>;
  }

  return (
    <span className="relative inline-block">
      <input
        type="text"
        inputMode="numeric"
        value={display}
        onChange={(e) => {
          const digits = e.target.value.replace(/\D/g, "");
          onChange(digits ? Number(digits) : 0);
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={cn(
          className,
          "rounded-lg border-2 border-border bg-white px-2 py-0.5 font-black tabular-nums outline-none transition",
          focused ? "border-brand ring-2 ring-brand/20" : "hover:border-brand/40",
        )}
        aria-label="Chỉnh giá"
      />
      <EditHint dark />
    </span>
  );
}

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
