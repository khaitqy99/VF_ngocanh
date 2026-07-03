"use client";

import { formatPrice } from "@/lib/cars";
import { InlineText, InlineMoney } from "@/components/admin-edit/EditablePath";
import { useAdminEdit } from "@/components/admin-edit/AdminEditContext";

export function EditableBatteryPanel({
  rentPrice,
  purchasePrice,
  batteryMode,
  onModeChange,
  adminEditable,
}: {
  rentPrice: number;
  purchasePrice: number;
  batteryMode: "rent" | "purchase";
  onModeChange: (mode: "rent" | "purchase") => void;
  adminEditable?: boolean;
}) {
  const edit = useAdminEdit();
  const active = adminEditable && edit?.editMode;

  return (
    <div>
      <p className="mb-2.5 text-[11px] font-semibold text-brand-dark sm:mb-3 sm:text-[10px] sm:font-bold sm:uppercase sm:tracking-wider">
        <InlineText
          path="_section.battery.title"
          fallback="Hình thức pin"
          adminEditable={adminEditable}
          className="text-[11px] font-semibold text-brand-dark sm:text-[10px] sm:font-bold sm:uppercase sm:tracking-wider"
        />
      </p>
      <div className="flex flex-col gap-2 sm:grid sm:grid-cols-2">
        <button
          type="button"
          onClick={() => onModeChange("rent")}
          className={`rounded-xl border-2 px-3 py-2.5 text-left transition sm:py-3 ${
            batteryMode === "rent"
              ? "border-brand bg-brand/5"
              : "border-border hover:border-brand/40"
          }`}
        >
          <p className="text-xs font-bold text-brand-dark">
            <InlineText
              path="_battery.rent.label"
              fallback="Thuê pin"
              adminEditable={adminEditable}
              className="text-xs font-bold text-brand-dark"
            />
          </p>
          <p className="mt-0.5 text-[11px] tabular-nums text-muted-foreground sm:text-[10px]">
            {active && edit ? (
              <>
                <InlineMoney
                  path="rentBatteryPrice"
                  fallback={rentPrice}
                  adminEditable={adminEditable}
                  className="text-[11px] font-semibold tabular-nums text-muted-foreground sm:text-[10px]"
                />{" "}
                đ/tháng
              </>
            ) : (
              <>{formatPrice(rentPrice)} đ/tháng</>
            )}
          </p>
        </button>
        <button
          type="button"
          onClick={() => onModeChange("purchase")}
          className={`rounded-xl border-2 px-3 py-2.5 text-left transition sm:py-3 ${
            batteryMode === "purchase"
              ? "border-brand bg-brand/5"
              : "border-border hover:border-brand/40"
          }`}
        >
          <p className="text-xs font-bold text-brand-dark">
            <InlineText
              path="_battery.purchase.label"
              fallback="Mua pin"
              adminEditable={adminEditable}
              className="text-xs font-bold text-brand-dark"
            />
          </p>
          <p className="mt-0.5 text-[11px] tabular-nums text-muted-foreground sm:text-[10px]">
            +
            {active && edit ? (
              <InlineMoney
                path="batteryPurchasePrice"
                fallback={purchasePrice}
                adminEditable={adminEditable}
                className="text-[11px] font-semibold tabular-nums text-muted-foreground sm:text-[10px]"
              />
            ) : (
              formatPrice(purchasePrice)
            )}{" "}
            đ
          </p>
        </button>
      </div>
    </div>
  );
}
