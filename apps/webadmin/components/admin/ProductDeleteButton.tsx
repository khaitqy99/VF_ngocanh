"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/core";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/admin/ToastProvider";
import type { ProductType } from "@/lib/product-api";

type ProductReference = {
  type: string;
  label: string;
  href?: string;
};

export function ProductDeleteButton({
  productId,
  productName,
  productType,
  listHref,
  onDeleted,
  iconOnly = false,
}: {
  productId: string;
  productName: string;
  productType: ProductType;
  listHref: string;
  onDeleted?: () => void;
  iconOnly?: boolean;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [references, setReferences] = useState<ProductReference[]>([]);

  const endpoint =
    productType === "accessory"
      ? `/api/accessories/${encodeURIComponent(productId)}`
      : `/api/vehicles/${encodeURIComponent(productId)}?type=${productType}`;

  const openDialog = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const checkRes = await fetch(endpoint, { credentials: "include" });
      const checkData = await checkRes.json();
      if (!checkRes.ok) throw new Error(checkData.error ?? "Không kiểm tra được liên kết");
      setReferences((checkData.references ?? []) as ProductReference[]);
      setOpen(true);
    } catch (error) {
      toast(error instanceof Error ? error.message : "Không mở được hộp thoại xóa");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      const deleteRes = await fetch(endpoint, {
        method: "DELETE",
        credentials: "include",
      });
      const deleteData = await deleteRes.json();
      if (!deleteRes.ok) throw new Error(deleteData.error ?? "Xóa thất bại");

      toast("Đã xóa sản phẩm");
      setOpen(false);
      if (onDeleted) {
        onDeleted();
      } else {
        router.push(listHref);
      }
      router.refresh();
    } catch (error) {
      toast(error instanceof Error ? error.message : "Xóa thất bại");
    } finally {
      setLoading(false);
    }
  };

  const bullets = [
    productType === "accessory"
      ? "Phụ kiện sẽ bị xóa khỏi database."
      : "Sản phẩm sẽ bị xóa khỏi database cùng toàn bộ ảnh trong thư mục riêng.",
    "Hành động này không thể hoàn tác.",
    ...(references.length > 0
      ? ["Đang được dùng tại:", ...references.map((ref) => ref.label)]
      : []),
  ];

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={loading}
        className="border-red-200 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800"
        title={`Xóa ${productName}`}
        onClick={() => void openDialog()}
      >
        <Trash2 className={iconOnly ? "h-3.5 w-3.5" : "mr-1.5 h-3.5 w-3.5"} />
        {iconOnly ? <span className="sr-only">Xóa</span> : loading && !open ? "Đang tải…" : "Xóa"}
      </Button>

      <ConfirmDialog
        open={open}
        title={`Xóa "${productName}"?`}
        description="Sản phẩm sẽ bị gỡ khỏi website và không thể khôi phục."
        bullets={bullets}
        confirmLabel="Xóa sản phẩm"
        destructive
        loading={loading}
        onClose={() => setOpen(false)}
        onConfirm={() => void confirmDelete()}
      />
    </>
  );
}
