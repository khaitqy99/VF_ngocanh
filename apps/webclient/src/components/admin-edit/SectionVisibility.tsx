"use client";

import { createContext, useContext, type ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";

import { PdpSection, type PdpSectionVariant } from "@/components/shared/PdpSectionShell";

type SectionVisibilityValue = {
  hidden: string[];
  editMode: boolean;
  labels: Record<string, string>;
  toggle?: (id: string) => void;
};

const SectionVisibilityContext = createContext<SectionVisibilityValue>({
  hidden: [],
  editMode: false,
  labels: {},
});

export function SectionVisibilityProvider({
  hidden,
  editMode,
  labels,
  toggle,
  children,
}: SectionVisibilityValue & { children: ReactNode }) {
  return (
    <SectionVisibilityContext.Provider value={{ hidden, editMode, labels, toggle }}>
      {children}
    </SectionVisibilityContext.Provider>
  );
}

export function useSectionVisibility() {
  return useContext(SectionVisibilityContext);
}

/** Đọc danh sách id mục nội dung đang bị ẩn từ dữ liệu sản phẩm (áp dụng cho cả web công khai). */
export function readHiddenSections(detail: unknown): string[] {
  const raw = (detail as { _hiddenSections?: unknown } | null | undefined)?._hiddenSections;
  return Array.isArray(raw) ? raw.filter((x): x is string => typeof x === "string") : [];
}

/** Lọc bỏ các mục nav bị ẩn (dùng cho web công khai). */
export function filterVisibleNavItems<T extends { id: string }>(items: T[], hidden: string[]): T[] {
  if (!hidden.length) return items;
  return items.filter((item) => !hidden.includes(item.id));
}

/**
 * Bọc một section của trang chi tiết sản phẩm.
 * - Web công khai: ẩn hẳn section nếu bị đánh dấu ẩn.
 * - Chế độ admin: vẫn hiển thị section nhưng làm mờ và thêm nút bật/tắt hiển thị.
 */
export function EditableSectionWrap({
  id,
  variant = "default",
  children,
}: {
  id: string;
  variant?: PdpSectionVariant;
  children: ReactNode;
}) {
  const { hidden, editMode, labels, toggle } = useSectionVisibility();
  const isHidden = hidden.includes(id);

  if (!editMode) {
    if (isHidden) return null;
    return (
      <PdpSection id={id} variant={variant}>
        {children}
      </PdpSection>
    );
  }

  const label = labels[id] ?? "mục này";

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-40 flex justify-end p-3 sm:p-4">
        <button
          type="button"
          onClick={() => toggle?.(id)}
          className={`pointer-events-auto inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold shadow-lg ring-1 backdrop-blur transition ${
            isHidden
              ? "bg-emerald-600 text-white ring-emerald-700 hover:bg-emerald-700"
              : "bg-white/90 text-red-600 ring-red-200 hover:bg-red-50"
          }`}
        >
          {isHidden ? (
            <>
              <Eye className="size-3.5" /> Hiện lại “{label}”
            </>
          ) : (
            <>
              <EyeOff className="size-3.5" /> Ẩn “{label}”
            </>
          )}
        </button>
      </div>

      {isHidden ? (
        <div className="pointer-events-none absolute left-1/2 top-3 z-40 -translate-x-1/2 rounded-full bg-amber-500 px-3 py-1 text-[11px] font-bold text-white shadow-lg">
          Đang ẩn khỏi website
        </div>
      ) : null}

      <div
        className={isHidden ? "opacity-40 grayscale transition" : "transition"}
        aria-hidden={isHidden}
      >
        <PdpSection id={id} variant={variant}>
          {children}
        </PdpSection>
      </div>
    </div>
  );
}
