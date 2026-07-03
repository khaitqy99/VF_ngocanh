import { type ReactNode } from "react";
import { Button } from "@/components/ui/core";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">{title}</h1>
        {description && <p className="mt-1 text-sm text-zinc-500">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function SaveButton({ onClick, label = "Lưu thay đổi" }: { onClick?: () => void; label?: string }) {
  return (
    <Button onClick={onClick}>{label}</Button>
  );
}

export function ImageUploadZone({
  label,
  hint = "SVG, PNG, JPG (tối đa 5MB)",
}: {
  label?: string;
  hint?: string;
}) {
  return (
    <div className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50 p-8 transition-colors hover:bg-zinc-100">
      <p className="text-sm font-medium text-zinc-900">{label ?? "Kéo thả hoặc click để tải ảnh"}</p>
      <p className="mt-1 text-xs text-zinc-500">{hint}</p>
    </div>
  );
}

export function PriceInput({
  defaultValue,
  label,
}: {
  defaultValue?: string | number;
  label: string;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-zinc-900">{label}</label>
      <input
        type="text"
        defaultValue={defaultValue}
        className="flex h-9 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 font-mono text-sm tabular-nums shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-600"
      />
    </div>
  );
}
