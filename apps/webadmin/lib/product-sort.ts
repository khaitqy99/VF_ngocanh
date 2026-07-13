import { createAdminClient } from "@vinfast3s/supabase/admin";
import type { ProductType } from "@/lib/product-api";

export async function updateProductSortOrder(
  kind: ProductType,
  orderedIds: string[],
): Promise<void> {
  const admin = createAdminClient();
  const uniqueIds = [...new Set(orderedIds.filter(Boolean))];
  if (!uniqueIds.length) {
    throw new Error("Danh sách sắp xếp trống");
  }

  if (kind === "accessory") {
    const updates = uniqueIds.map((id, index) =>
      admin.from("accessories").update({ sort_order: index }).eq("id", id),
    );
    const results = await Promise.all(updates);
    const failed = results.find((result) => result.error);
    if (failed?.error) throw new Error(failed.error.message);
    return;
  }

  const vehicleType = kind === "car" ? "car" : "scooter";
  const updates = uniqueIds.map((id, index) =>
    admin.from("vehicles").update({ sort_order: index }).eq("id", id).eq("type", vehicleType),
  );
  const results = await Promise.all(updates);
  const failed = results.find((result) => result.error);
  if (failed?.error) throw new Error(failed.error.message);
}
