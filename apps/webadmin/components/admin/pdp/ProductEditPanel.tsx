"use client";

import { EditSectionNav, type EditNavItem } from "@/components/admin/pdp/EditSectionNav";
import { Button } from "@/components/ui/core";

export function ProductEditPanel({
  navItems,
  onSave,
  children,
}: {
  navItems: EditNavItem[];
  onSave: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <EditSectionNav items={navItems} variant="panel" />
      <div className="flex-1 overflow-y-auto px-4 py-4">{children}</div>
      <div className="shrink-0 border-t border-zinc-200 bg-white p-4">
        <Button className="w-full" onClick={onSave}>
          Lưu thay đổi
        </Button>
      </div>
    </div>
  );
}
