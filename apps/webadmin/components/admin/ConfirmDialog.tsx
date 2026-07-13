"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/core";

export function ConfirmDialog({
  open,
  title,
  description,
  bullets,
  confirmLabel = "Xác nhận",
  cancelLabel = "Hủy",
  destructive = false,
  loading = false,
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  description?: string;
  bullets?: string[];
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Đóng"
        onClick={loading ? undefined : onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
      >
        <h3 id="confirm-dialog-title" className="text-lg font-semibold text-zinc-900">
          {title}
        </h3>
        {description ? <p className="mt-2 text-sm text-zinc-600">{description}</p> : null}
        {bullets && bullets.length > 0 ? (
          <ul className="mt-3 space-y-1.5 text-sm text-zinc-600">
            {bullets.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-zinc-400">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : null}
        <div className="mt-6 flex justify-end gap-2">
          <Button type="button" variant="outline" disabled={loading} onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button
            type="button"
            disabled={loading}
            className={destructive ? "bg-red-600 hover:bg-red-700" : undefined}
            onClick={onConfirm}
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {loading ? "Đang xử lý…" : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
