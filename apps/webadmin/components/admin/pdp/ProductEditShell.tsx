"use client";

import Link from "next/link";
import { ChevronRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/core";
import { EditSectionNav, type EditNavItem } from "@/components/admin/pdp/EditSectionNav";

export function ProductEditShell({
  listHref,
  listLabel,
  productName,
  publicHref,
  navItems,
  onSave,
  children,
}: {
  listHref: string;
  listLabel: string;
  productName: string;
  publicHref?: string;
  navItems: EditNavItem[];
  onSave: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="pb-24">
      <EditSectionNav items={navItems} />

      <div className="space-y-6">
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <Link href={listHref} className="hover:text-zinc-900">
            {listLabel}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-zinc-900">{productName}</span>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Chỉnh sửa sản phẩm</h1>
            <p className="mt-1 text-sm text-zinc-500">
              Form theo cấu trúc trang chi tiết trên website — cuộn theo từng mục bên trên.
            </p>
          </div>
          {publicHref ? (
            <Link
              href={publicHref}
              target="_blank"
              className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-4 text-sm font-medium hover:bg-zinc-50"
            >
              Xem trên website
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          ) : null}
        </div>

        {children}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-zinc-200 bg-white/95 px-4 py-3 backdrop-blur md:left-64">
        <div className="mx-auto flex max-w-5xl justify-end gap-3">
          <Button variant="outline" onClick={() => history.back()}>
            Hủy
          </Button>
          <Button onClick={onSave}>Lưu thay đổi</Button>
        </div>
      </div>
    </div>
  );
}
