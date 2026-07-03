import type { CarModel } from "@/lib/cars";
import type { ScooterModel } from "@/lib/scooters";
import type { AccessoryProduct } from "@/lib/accessories";

export function getCarCatalogPatches(base: CarModel, draft: CarModel): Record<string, unknown> {
  const patches: Record<string, unknown> = {};
  if (draft.name !== base.name) patches.name = draft.name;
  if (draft.subtitle !== base.subtitle) patches.subtitle = draft.subtitle;
  if (draft.price !== base.price) patches.price = draft.price;
  if (draft.image !== base.image) patches.image = draft.image;
  if (Boolean(draft.isNew) !== Boolean(base.isNew)) patches.isNew = Boolean(draft.isNew);
  if (Boolean(draft.isBestSeller) !== Boolean(base.isBestSeller)) {
    patches.isBestSeller = Boolean(draft.isBestSeller);
  }
  if (Boolean(draft.isPromo) !== Boolean(base.isPromo)) patches.isPromo = Boolean(draft.isPromo);
  return patches;
}

export function getScooterCatalogPatches(
  base: ScooterModel,
  draft: ScooterModel,
): Record<string, unknown> {
  const patches: Record<string, unknown> = {};
  if (draft.name !== base.name) patches.name = draft.name;
  if (draft.subtitle !== base.subtitle) patches.subtitle = draft.subtitle;
  if (draft.price !== base.price) patches.price = draft.price;
  if (draft.image !== base.image) patches.image = draft.image;
  if (Boolean(draft.isNew) !== Boolean(base.isNew)) patches.isNew = Boolean(draft.isNew);
  if (Boolean(draft.isBestSeller) !== Boolean(base.isBestSeller)) {
    patches.isBestSeller = Boolean(draft.isBestSeller);
  }
  if (Boolean(draft.isPromo) !== Boolean(base.isPromo)) patches.isPromo = Boolean(draft.isPromo);
  return patches;
}

function normalizeVehicles(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function getAccessoryCatalogPatches(
  base: AccessoryProduct,
  draft: AccessoryProduct,
): Record<string, unknown> {
  const patches: Record<string, unknown> = {};

  if (draft.name !== base.name) patches.name = draft.name;
  if (draft.description !== base.description) patches.description = draft.description;
  if (draft.price !== base.price) patches.price = draft.price;
  if (draft.image !== base.image) patches.image = draft.image;
  if (draft.category !== base.category) patches.category = draft.category;
  if (draft.inStock !== base.inStock) patches.inStock = draft.inStock;
  if ((draft.badge ?? "") !== (base.badge ?? "")) patches.badge = draft.badge ?? "";

  const baseVehicles = JSON.stringify(base.vehicles ?? []);
  const draftVehicles = JSON.stringify(draft.vehicles ?? []);
  if (baseVehicles !== draftVehicles) patches.vehicles = draft.vehicles;

  return patches;
}

export function vehiclesToText(vehicles: AccessoryProduct["vehicles"]): string {
  return vehicles.join(", ");
}

export function textToVehicles(value: string): AccessoryProduct["vehicles"] {
  return normalizeVehicles(value) as AccessoryProduct["vehicles"];
}
