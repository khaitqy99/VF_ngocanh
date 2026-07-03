import {
  applyPatches,
  type PatchValue,
  setAtPath,
} from "@/components/admin-edit/vehicle-edit-paths";

export type { PatchValue };

export type VehicleEditDraft = {
  name?: string;
  tagline?: string;
  slogan?: string;
  badges?: string;
  price?: number;
  variantId?: string;
  overviewTitle?: string;
  overviewSubtitle?: string;
  patches?: Record<string, PatchValue>;
  path?: string;
  value?: PatchValue;
};

export type VehicleEditable = {
  id: string;
  name: string;
  tagline: string;
  slogan: string;
  badges: string[];
  price: number;
  variants: { id: string; price: number; name?: string }[];
  overview: { title: string; subtitle: string; bullets: string[]; image: string };
};

export function mergeVehicleDraft<T extends VehicleEditable>(
  detail: T,
  draft: VehicleEditDraft,
): T {
  const badges =
    draft.badges !== undefined
      ? draft.badges
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : detail.badges;

  const priceTargetId = draft.variantId ?? detail.variants[0]?.id;
  const variants = detail.variants.map((v) => {
    let next = { ...v };
    if (draft.price !== undefined && v.id === priceTargetId) {
      next = { ...next, price: draft.price };
    }
    return next;
  });
  const price = draft.price ?? detail.price;

  let result = {
    ...detail,
    name: draft.name ?? detail.name,
    tagline: draft.tagline ?? detail.tagline,
    slogan: draft.slogan ?? detail.slogan,
    badges,
    price,
    variants,
    overview: {
      ...detail.overview,
      title: draft.overviewTitle ?? detail.overview.title,
      subtitle: draft.overviewSubtitle ?? detail.overview.subtitle,
    },
  } as T;

  if (draft.overviewTitle !== undefined) {
    result = setAtPath(result, "overview.title", draft.overviewTitle);
  }
  if (draft.overviewSubtitle !== undefined) {
    result = setAtPath(result, "overview.subtitle", draft.overviewSubtitle);
  }

  if (draft.patches && Object.keys(draft.patches).length > 0) {
    result = applyPatches(result, draft.patches);
  }

  return result;
}

/** Gom toàn bộ thay đổi draft (giá, tên, …) thành patch paths để lưu lên server. */
export function buildSavePatches(
  detail: VehicleEditable,
  draft: VehicleEditDraft,
): Record<string, PatchValue> {
  const patches: Record<string, PatchValue> = { ...(draft.patches ?? {}) };

  if (draft.name !== undefined) patches.name = draft.name;
  if (draft.tagline !== undefined) patches.tagline = draft.tagline;
  if (draft.slogan !== undefined) patches.slogan = draft.slogan;
  if (draft.badges !== undefined) {
    patches.badges = draft.badges
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  if (draft.overviewTitle !== undefined) patches["overview.title"] = draft.overviewTitle;
  if (draft.overviewSubtitle !== undefined) patches["overview.subtitle"] = draft.overviewSubtitle;

  if (draft.price !== undefined) {
    patches.price = draft.price;
    const variantId = draft.variantId ?? detail.variants[0]?.id;
    const variantIndex = detail.variants.findIndex((v) => v.id === variantId);
    if (variantIndex >= 0) {
      patches[`variants.${variantIndex}.price`] = draft.price;
    }
  }

  return patches;
}
