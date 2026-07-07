"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";

import { cn } from "@/lib/utils";
import { useHomeAdminEdit } from "@/components/admin-edit/home/HomeAdminEditContext";

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

export function HomeEditableText({
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
  const edit = useHomeAdminEdit();
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
