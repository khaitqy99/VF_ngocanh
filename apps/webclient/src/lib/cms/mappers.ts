import type { Json, Tables } from "@vinfast3s/supabase";
import { applyPatches, type PatchValue } from "@/components/admin-edit/vehicle-edit-paths";
import type { CarDetail } from "@/lib/car-details";
import { CARS, type CarModel } from "@/lib/cars";
import type { ScooterDetail } from "@/lib/scooter-details";
import { SCOOTERS, type ScooterModel } from "@/lib/scooters";
import type { AccessoryProduct } from "@/lib/accessories";
import type { HeroBannerSlide } from "@/lib/images";
import type { VinFastHeroBanner, VinFastHomeSlide } from "@/lib/vinfast-home";
import { formatPrice } from "@/lib/cars";
import { resolveProductSlug } from "@/lib/seo/slugs";
import {
  parseDbColors,
  resolveVehicleGallery,
} from "./vehicle-images";

type VehicleRow = Tables<"vehicles">;
type AccessoryRow = Tables<"accessories">;
type BannerRow = Tables<"banners">;

function asObject(value: Json | null | undefined): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function getAdminPatchMap(content: Json): Record<string, PatchValue> | null {
  const obj = asObject(content);
  const patches = asObject(obj?.admin_patches as Json);
  if (!patches) return null;
  const { _updatedAt: _, ...rest } = patches;
  return rest as Record<string, PatchValue>;
}

function applyAdminPatches<T extends Record<string, unknown>>(base: T, content: Json): T {
  const rest = getAdminPatchMap(content);
  if (!rest || Object.keys(rest).length === 0) return base;
  return applyPatches(base, rest);
}

function toNumberFromQuickSpec(value: unknown, fallback: number): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value.replace(/\./g, "").replace(/[^\d.-]/g, ""));
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function toStringFromQuickSpec(value: unknown, fallback: string): string {
  if (typeof value === "string" && value.trim() !== "") return value;
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return fallback;
}

function applyCarQuickSpecPatch(detail: CarDetail, content: Json): CarDetail {
  const patches = getAdminPatchMap(content);
  if (!patches) return detail;

  const range = patches["_quickSpec.range.value"];
  const power = patches["_quickSpec.power.value"];
  const torque = patches["_quickSpec.torque.value"];
  const acceleration = patches["_quickSpec.acceleration.value"];
  const topSpeed = patches["_quickSpec.topSpeed.value"];
  const fastCharge = patches["_quickSpec.fastCharge.value"];

  if (
    range === undefined &&
    power === undefined &&
    torque === undefined &&
    acceleration === undefined &&
    topSpeed === undefined &&
    fastCharge === undefined
  ) {
    return detail;
  }

  return {
    ...detail,
    quickSpecs: {
      ...detail.quickSpecs,
      range: toNumberFromQuickSpec(range, detail.quickSpecs.range),
      power: toNumberFromQuickSpec(power, detail.quickSpecs.power),
      torque: toNumberFromQuickSpec(torque, detail.quickSpecs.torque),
      acceleration: toStringFromQuickSpec(acceleration, detail.quickSpecs.acceleration),
      topSpeed: toNumberFromQuickSpec(topSpeed, detail.quickSpecs.topSpeed),
      fastCharge: toStringFromQuickSpec(fastCharge, detail.quickSpecs.fastCharge),
    },
  };
}

function applyScooterQuickSpecPatch(detail: ScooterDetail, content: Json): ScooterDetail {
  const patches = getAdminPatchMap(content);
  if (!patches) return detail;

  const range = patches["_quickSpec.range.value"];
  const topSpeed = patches["_quickSpec.topSpeed.value"];
  const motorPower = patches["_quickSpec.motorPower.value"];
  const trunk = patches["_quickSpec.trunk.value"];
  const chargingTime = patches["_quickSpec.chargingTime.value"];
  const weight = patches["_quickSpec.weight.value"];

  if (
    range === undefined &&
    topSpeed === undefined &&
    motorPower === undefined &&
    trunk === undefined &&
    chargingTime === undefined &&
    weight === undefined
  ) {
    return detail;
  }

  return {
    ...detail,
    quickSpecs: {
      ...detail.quickSpecs,
      range: toNumberFromQuickSpec(range, detail.quickSpecs.range),
      topSpeed: toNumberFromQuickSpec(topSpeed, detail.quickSpecs.topSpeed),
      motorPower: toNumberFromQuickSpec(motorPower, detail.quickSpecs.motorPower),
      trunk: toNumberFromQuickSpec(trunk, detail.quickSpecs.trunk),
      chargingTime: toStringFromQuickSpec(chargingTime, detail.quickSpecs.chargingTime),
      weight: toNumberFromQuickSpec(weight, detail.quickSpecs.weight),
    },
  };
}

export function applyVehicleContentPatches<T extends Record<string, unknown>>(base: T, content: Json): T {
  return applyAdminPatches(base, content);
}

/** Chỉ patch các field catalog — tránh patch PDP (overview.*, gallery.*, …) làm hỏng bộ lọc danh sách. */
const CAR_CATALOG_PATCH_KEYS = new Set([
  "name",
  "subtitle",
  "tagline",
  "slogan",
  "image",
  "price",
  "segment",
  "drive",
  "rangeBucket",
  "seats",
  "range",
  "power",
  "torque",
  "acceleration",
  "batteryCapacity",
  "chargingTime",
  "dimensions",
  "batteryPurchasePrice",
  "rentBatteryPrice",
  "isNew",
  "isBestSeller",
  "isPromo",
  "badges",
]);

const SCOOTER_CATALOG_PATCH_KEYS = new Set([
  "name",
  "subtitle",
  "tagline",
  "slogan",
  "image",
  "price",
  "type",
  "rangeBucket",
  "speedBucket",
  "range",
  "topSpeed",
  "motorPower",
  "trunk",
  "weight",
  "acceleration",
  "batteryCapacity",
  "chargingTime",
  "dimensions",
  "batteryPurchasePrice",
  "rentBatteryPrice",
  "isNew",
  "isBestSeller",
  "isPromo",
  "badges",
]);

function pickCatalogPatches(
  content: Json,
  allowed: Set<string>,
): Record<string, PatchValue> | null {
  const rest = getAdminPatchMap(content);
  if (!rest) return null;
  const catalogOnly: Record<string, PatchValue> = {};
  for (const [key, value] of Object.entries(rest)) {
    if (allowed.has(key)) catalogOnly[key] = value;
  }
  return Object.keys(catalogOnly).length > 0 ? catalogOnly : null;
}

function applyCatalogPatches<T extends { name: string; subtitle?: string; image: string; price: number }>(
  item: T,
  content: Json,
  allowed: Set<string>,
): T {
  const catalogOnly = pickCatalogPatches(content, allowed);
  if (!catalogOnly) return item;
  return applyPatches(item, catalogOnly);
}

function ensureCarCatalogFields(car: CarModel, fallback?: CarModel): CarModel {
  if (!fallback) return car;
  const price =
    Number.isFinite(car.price) && car.price > 0 ? car.price : fallback.price;
  return {
    ...fallback,
    ...car,
    segment: car.segment ?? fallback.segment,
    drive: car.drive ?? fallback.drive,
    rangeBucket: car.rangeBucket ?? fallback.rangeBucket,
    seats: car.seats ?? fallback.seats,
    range: car.range ?? fallback.range,
    power: car.power ?? fallback.power,
    torque: car.torque ?? fallback.torque,
    price,
  };
}

function ensureScooterCatalogFields(scooter: ScooterModel, fallback?: ScooterModel): ScooterModel {
  if (!fallback) return scooter;
  const price =
    Number.isFinite(scooter.price) && scooter.price > 0 ? scooter.price : fallback.price;
  return {
    ...fallback,
    ...scooter,
    type: scooter.type ?? fallback.type,
    rangeBucket: scooter.rangeBucket ?? fallback.rangeBucket,
    speedBucket: scooter.speedBucket ?? fallback.speedBucket,
    range: scooter.range ?? fallback.range,
    topSpeed: scooter.topSpeed ?? fallback.topSpeed,
    motorPower: scooter.motorPower ?? fallback.motorPower,
    price,
  };
}

export function mapVehicleToCar(row: VehicleRow): CarModel {
  const content = asObject(row.content);
  const fallback = CARS.find((c) => c.id === row.id);
  const catalog = (content?.catalog ?? {}) as Partial<CarModel>;
  const base = {
    ...(fallback ?? {}),
    ...catalog,
    id: row.id,
    name: row.name,
    subtitle: row.tagline ?? catalog.subtitle ?? fallback?.subtitle ?? "",
    image: row.hero_image_url ?? catalog.image ?? fallback?.image ?? "",
    price: Number(row.starting_price ?? catalog.price ?? fallback?.price ?? 0),
  } as CarModel;
  const patched = applyCatalogPatches(base, row.content, CAR_CATALOG_PATCH_KEYS);
  return ensureCarCatalogFields(
    {
      ...patched,
      id: row.id,
      slug: resolveProductSlug({ id: row.id, slug: row.slug }, "car"),
      name: row.name,
      subtitle: row.tagline ?? patched.subtitle ?? fallback?.subtitle ?? "",
      image: row.hero_image_url ?? patched.image ?? fallback?.image ?? "",
      price: Number(row.starting_price ?? patched.price ?? fallback?.price ?? 0),
    },
    fallback,
  ) as CarModel;
}

export function mapVehicleToScooter(row: VehicleRow): ScooterModel {
  const content = asObject(row.content);
  const fallback = SCOOTERS.find((s) => s.id === row.id);
  const catalog = (content?.catalog ?? {}) as Partial<ScooterModel>;
  const base = {
    ...(fallback ?? {}),
    ...catalog,
    id: row.id,
    name: row.name,
    subtitle: row.tagline ?? catalog.subtitle ?? fallback?.subtitle ?? "",
    image: row.hero_image_url ?? catalog.image ?? fallback?.image ?? "",
    price: Number(row.starting_price ?? catalog.price ?? fallback?.price ?? 0),
  } as ScooterModel;
  const patched = applyCatalogPatches(base, row.content, SCOOTER_CATALOG_PATCH_KEYS);
  return ensureScooterCatalogFields(
    {
      ...patched,
      id: row.id,
      slug: resolveProductSlug({ id: row.id, slug: row.slug }, "scooter"),
      name: row.name,
      subtitle: row.tagline ?? patched.subtitle ?? fallback?.subtitle ?? "",
      image: row.hero_image_url ?? patched.image ?? fallback?.image ?? "",
      price: Number(row.starting_price ?? patched.price ?? fallback?.price ?? 0),
    },
    fallback,
  ) as ScooterModel;
}

function vehicleIdFromSlideHref(href?: string): string | undefined {
  if (!href) return undefined;
  const match = href.match(/^\/(oto|xe-may-dien)\/([^/?#]+)/);
  return match?.[2];
}

/** Đồng bộ tên/giá/ảnh carousel trang chủ từ catalog CMS (sau khi admin đổi tên). */
export function hydrateFeaturedVehicleSlides(
  slides: VinFastHomeSlide[],
  vehicles: { id: string; name: string; subtitle: string; image: string; price: number }[],
): VinFastHomeSlide[] {
  return slides.map((slide) => {
    const id = vehicleIdFromSlideHref(slide.href);
    const vehicle = id ? vehicles.find((v) => v.id === id) : undefined;
    if (!vehicle) return slide;

    const specs = slide.specs.map((spec) =>
      spec.highlight
        ? { ...spec, value: `${formatPrice(vehicle.price)} VNĐ` }
        : spec,
    );

    return {
      ...slide,
      title: vehicle.name,
      subtitle: vehicle.subtitle || slide.subtitle,
      image: vehicle.image || slide.image,
      imageAlt: vehicle.name,
      specs,
    };
  });
}

export function mapVehicleToCarDetail(row: VehicleRow): CarDetail | undefined {
  const content = asObject(row.content);
  const detail = content?.detail as CarDetail | undefined;
  if (!detail) return undefined;

  const heroImage = row.hero_image_url ?? detail.image ?? "";
  const gallery = resolveVehicleGallery(row.gallery, detail.gallery, heroImage);
  const dbColors = parseDbColors(row.colors);
  const colors = dbColors.length ? dbColors : detail.colors;

  const merged = applyAdminPatches(
    {
      ...detail,
      id: row.id,
      name: row.name,
      image: heroImage,
      gallery,
      colors,
      price: Number(row.starting_price ?? detail.price ?? 0),
      tagline: row.tagline ?? detail.tagline,
      slogan: row.slogan ?? detail.slogan,
    },
    row.content,
  );
  return applyCarQuickSpecPatch(merged, row.content);
}

export function mapVehicleToScooterDetail(row: VehicleRow): ScooterDetail | undefined {
  const content = asObject(row.content);
  const detail = content?.detail as ScooterDetail | undefined;
  if (!detail) return undefined;

  const heroImage = row.hero_image_url ?? detail.image ?? "";
  const gallery = resolveVehicleGallery(row.gallery, detail.gallery, heroImage);
  const dbColors = parseDbColors(row.colors);
  const colors = dbColors.length ? dbColors : detail.colors;

  const merged = applyAdminPatches(
    {
      ...detail,
      id: row.id,
      name: row.name,
      image: heroImage,
      gallery,
      colors,
      price: Number(row.starting_price ?? detail.price ?? 0),
      tagline: row.tagline ?? detail.tagline,
      slogan: row.slogan ?? detail.slogan,
    },
    row.content,
  );
  return applyScooterQuickSpecPatch(merged, row.content);
}

export function mapAccessoryRow(row: AccessoryRow): AccessoryProduct {
  const content = row.content as AccessoryProduct | null;
  const slug = resolveProductSlug(
    { id: row.id, slug: row.slug },
    "accessory",
    row.name,
  );
  if (content && typeof content === "object") {
    return {
      ...content,
      id: row.id,
      slug,
      name: row.name,
      description: row.description ?? content.description,
      price: Number(row.price ?? content.price ?? 0),
      image: row.image_url ?? content.image ?? "",
      category: (row.category ?? content.category) as AccessoryProduct["category"],
      inStock: row.in_stock ?? content.inStock ?? true,
    };
  }
  return {
    id: row.id,
    slug,
    name: row.name,
    description: row.description ?? "",
    price: Number(row.price ?? 0),
    image: row.image_url ?? "",
    category: (row.category ?? "phu-kien-chung") as AccessoryProduct["category"],
    vehicles: [],
    inStock: row.in_stock,
  };
}

export function mapBannerRow(row: BannerRow): HeroBannerSlide {
  return {
    desktop: row.desktop_image_url ?? "",
    mobile: row.mobile_image_url ?? row.desktop_image_url ?? "",
    alt: row.alt_text ?? row.title,
  };
}

export function mapHomeHeroBanner(row: BannerRow): VinFastHeroBanner {
  return {
    image: row.desktop_image_url ?? "",
    alt: row.alt_text ?? row.title,
    href: row.href ?? "#",
  };
}

export function parseHomeCms(content: Json) {
  const obj = asObject(content);
  return {
    featuredCars: (obj?.featuredCars ?? []) as VinFastHomeSlide[],
    featuredScooters: (obj?.featuredScooters ?? []) as VinFastHomeSlide[],
    heroBanners: (obj?.heroBanners ?? []) as VinFastHeroBanner[],
    heroBannersAll: (obj?.heroBannersAll ?? []) as HeroBannerSlide[],
  };
}
