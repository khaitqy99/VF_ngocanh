"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

export function FilterGroup({
  title,
  children,
  defaultOpen = true,
  className,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className={cn(
        "mt-4 border-t border-slate-100 pt-4 first:mt-0 first:border-t-0 first:pt-0",
        className,
      )}
    >
      <CollapsibleTrigger className="flex w-full items-center justify-between gap-2 rounded-md text-left transition-colors hover:text-brand-dark">
        <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase">
          {title}
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-slate-400 transition-transform duration-200",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2.5">
        <div className="space-y-2">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export function FilterCheck({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer select-none items-center gap-2.5 py-0.5 text-xs font-semibold text-slate-600 hover:text-slate-800"
    >
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={onChange}
        className="size-4 border-slate-300 text-brand"
      />
      <span>{label}</span>
    </label>
  );
}
