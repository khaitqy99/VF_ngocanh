import type { Json, Tables } from "@vinfast3s/supabase";
import { applyPatches, type PatchValue } from "../../components/admin-edit/vehicle-edit-paths";
import type { CarDetail } from "@/lib/car-details";
import { CARS, type CarModel } from "@/lib/cars";
import type { ScooterDetail } from "@/lib/scooter-details";
import { SCOOTERS, type ScooterModel } from "@/lib/scooters";
import type { AccessoryProduct } from "@/lib/accessories";
import type { HeroBannerSlide } from "@/lib/images";
import type { HomeFeaturedPrices, HomeFeaturedSlideOverrides } from "./home-content";
import type { VinFastHeroBanner, VinFastHomeSlide, VinFastHomeSpec } from "@/lib/vinfast-home";
import { formatPrice } from "@/lib/cars";
import {
  carDetailPath,
  resolveProductSlug,
  resolveVehicleIdFromHrefSegment,
  scooterDetailPath,
  vehicleDetailPathFromId,
} from "@/lib/seo/slugs";
import { localizeVinfastHotlink, parseDbColors, resolveVehicleGallery } from "./vehicle-images";

type VehicleRow = Tables<"vehicles">;
type AccessoryRow = Tables<"accessories">;
type BannerRow = Tables<"banners">;

function localizeCarDetailImages(detail: CarDetail): CarDetail {
  const fix = (url?: string) => localizeVinfastHotlink(url, detail.id) ?? url ?? "";
  return {
    ...detail,
    overview: { ...detail.overview, image: fix(detail.overview.image) },
    exterior: detail.exterior.map((item) => ({ ...item, image: fix(item.image) })),
    interior: detail.interior.map((item) => ({ ...item, image: fix(item.image) })),
    performance: { ...detail.performance, image: fix(detail.performance.image) },
    safety: detail.safety ? { ...detail.safety, image: fix(detail.safety.image) } : detail.safety,
    colors: detail.colors.map((color) => ({ ...color, image: fix(color.image) })),
  };
}

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

export function applyVehicleContentPatches<T extends Record<string, unknown>>(
  base: T,
  content: Json,
): T {
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

function applyCatalogPatches<
  T extends { name: string; subtitle?: string; image: string; price: number },
>(item: T, content: Json, allowed: Set<string>): T {
  const catalogOnly = pickCatalogPatches(content, allowed);
  if (!catalogOnly) return item;
  return applyPatches(item, catalogOnly);
}

function ensureCarCatalogFields(car: CarModel, fallback?: CarModel): CarModel {
  if (!fallback) {
    return { ...car, colors: car.colors ?? [] };
  }
  const price = Number.isFinite(car.price) && car.price > 0 ? car.price : fallback.price;
  return {
    ...fallback,
    ...car,
    colors: car.colors ?? fallback.colors,
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
    },
    fallback,
  ) as ScooterModel;
}

function vehicleHrefSegment(href?: string): string | undefined {
  if (!href) return undefined;
  const match = href.match(/^\/(oto|xe-may-dien)\/([^/?#]+)/);
  return match?.[2];
}

function vehicleIdFromSlideHref(
  href: string | undefined,
  vehicleType: "car" | "scooter",
): string | undefined {
  const segment = vehicleHrefSegment(href);
  if (!segment) return undefined;
  return resolveVehicleIdFromHrefSegment(segment, vehicleType);
}

function findVehicleBySlideHref<T extends { id: string; slug?: string }>(
  href: string | undefined,
  vehicles: T[],
  vehicleType: "car" | "scooter",
): T | undefined {
  const segment = vehicleHrefSegment(href);
  if (!segment) return undefined;

  const resolvedId = resolveVehicleIdFromHrefSegment(segment, vehicleType);
  return (
    vehicles.find((vehicle) => vehicle.id === resolvedId) ??
    vehicles.find((vehicle) => resolveProductSlug(vehicle, vehicleType) === segment)
  );
}

/** Đồng bộ tên/giá/ảnh carousel trang chủ từ catalog CMS (sau khi admin đổi tên). */
export function hydrateFeaturedVehicleSlides(
  slides: VinFastHomeSlide[],
  vehicles: {
    id: string;
    slug?: string;
    name: string;
    subtitle: string;
    image: string;
    price: number;
  }[],
  vehicleType: "car" | "scooter",
): VinFastHomeSlide[] {
  return slides.map((slide) => {
    const vehicle = findVehicleBySlideHref(slide.href, vehicles, vehicleType);
    if (!vehicle) return slide;

    const specs = slide.specs.map((spec) =>
      spec.highlight ? { ...spec, value: `${formatPrice(vehicle.price)} VNĐ` } : spec,
    );

    const href = vehicleType === "car" ? carDetailPath(vehicle) : scooterDetailPath(vehicle);

    return {
      ...slide,
      title: vehicle.name,
      subtitle: vehicle.subtitle || slide.subtitle,
      image: vehicle.image || slide.image,
      imageAlt: vehicle.name,
      specs,
      href,
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
  return localizeCarDetailImages(applyCarQuickSpecPatch(merged, row.content));
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
  const slug = resolveProductSlug({ id: row.id, slug: row.slug }, "accessory", row.name);
  if (content && typeof content === "object") {
    return {
      ...content,
      id: row.id,
      slug,
      name: content.name ?? row.name,
      description: content.description ?? row.description ?? "",
      price: Number(content.price ?? row.price ?? 0),
      image: content.image ?? row.image_url ?? "",
      category: (content.category ??
        row.category ??
        "phu-kien-chung") as AccessoryProduct["category"],
      vehicles: content.vehicles ?? [],
      inStock: content.inStock ?? row.in_stock ?? true,
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

function isPriceSpecLabel(label: string, value: string) {
  return /giá/i.test(label) || /vnđ/i.test(value);
}

function parseFeaturedPrices(value: unknown): HomeFeaturedPrices {
  const obj = asObject(value as Json | null | undefined);
  if (!obj) return {};

  const result: HomeFeaturedPrices = {};
  for (const [id, entry] of Object.entries(obj)) {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) continue;
    const row = entry as Record<string, unknown>;
    const listPrice = typeof row.listPrice === "number" ? row.listPrice : undefined;
    if (listPrice !== undefined) {
      result[id] = { listPrice };
    }
  }
  return result;
}

/** Áp giá cũ (gạch ngang) lên slide — giá ưu đãi luôn lấy từ catalog Ô tô */
export function applyFeaturedPriceOverrides(
  slides: VinFastHomeSlide[],
  ids: string[],
  overrides: HomeFeaturedPrices,
  vehicleType: "car" | "scooter",
): VinFastHomeSlide[] {
  if (!Object.keys(overrides).length) return slides;

  return slides.map((slide, index) => {
    const id = ids[index] ?? vehicleIdFromSlideHref(slide.href, vehicleType);
    if (!id) return slide;
    const listPrice = overrides[id]?.listPrice;
    if (listPrice == null) return slide;

    let updatedPrice = false;
    const specs = slide.specs.map((spec) => {
      if (!spec.highlight && !isPriceSpecLabel(spec.label, spec.value)) return spec;
      updatedPrice = true;
      const baseValue = spec.value.replace(/\s*\*+$/, "").trim();
      return {
        ...spec,
        label: spec.label || "Giá bán từ",
        highlight: true,
        value: `${baseValue}*`,
        listPrice: `${formatPrice(listPrice)} VNĐ`,
      };
    });

    if (!updatedPrice) return slide;

    return { ...slide, specs };
  });
}

export function applyFeaturedSlideOverrides(
  slides: VinFastHomeSlide[],
  ids: string[],
  overrides: HomeFeaturedSlideOverrides,
  vehicleType: "car" | "scooter",
): VinFastHomeSlide[] {
  if (!Object.keys(overrides).length) return slides;

  return slides.map((slide, index) => {
    const id = ids[index] ?? vehicleIdFromSlideHref(slide.href, vehicleType);
    if (!id) return slide;
    const patch = overrides[id];
    if (!patch) return slide;

    const nextSpecs =
      patch.specs?.length && patch.specs.some((spec) => spec.value?.trim() || spec.label?.trim())
        ? slide.specs.map((spec, specIndex) => {
            const override = patch.specs?.[specIndex];
            if (!override) return spec;
            return {
              ...spec,
              value: override.value?.trim() ? override.value : spec.value,
              label: override.label?.trim() ? override.label : spec.label,
              highlight:
                typeof override.highlight === "boolean" ? override.highlight : spec.highlight,
              seats: typeof override.seats === "boolean" ? override.seats : spec.seats,
              listPrice: override.listPrice?.trim() ? override.listPrice : spec.listPrice,
            };
          })
        : slide.specs;

    return {
      ...slide,
      title: patch.title?.trim() ? patch.title : slide.title,
      subtitle:
        patch.subtitle !== undefined && patch.subtitle.trim() !== ""
          ? patch.subtitle
          : slide.subtitle,
      specs: nextSpecs,
    };
  });
}

export function parseHomeCms(content: Json) {
  const obj = asObject(content);
  const slideOverrides = (raw: unknown): HomeFeaturedSlideOverrides => {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
    const entries = Object.entries(raw as Record<string, unknown>).filter(
      ([key]) => typeof key === "string",
    );
    const result: HomeFeaturedSlideOverrides = {};
    for (const [id, value] of entries) {
      const patch = asObject(value as Json);
      if (!patch) continue;
      const specsRaw = patch.specs;
      let specs: VinFastHomeSpec[] | undefined;
      if (Array.isArray(specsRaw)) {
        specs = [];
        for (const item of specsRaw) {
          const row = asObject(item as Json);
          if (!row) continue;
          specs.push({
            value: typeof row.value === "string" ? row.value : "",
            label: typeof row.label === "string" ? row.label : "",
            highlight: typeof row.highlight === "boolean" ? row.highlight : undefined,
            seats: typeof row.seats === "boolean" ? row.seats : undefined,
            listPrice: typeof row.listPrice === "string" ? row.listPrice : undefined,
          });
        }
        if (!specs.length) specs = undefined;
      }

      result[id] = {
        title: typeof patch.title === "string" ? patch.title : undefined,
        subtitle: typeof patch.subtitle === "string" ? patch.subtitle : undefined,
        specs: specs?.length ? specs : undefined,
      };
    }
    return result;
  };

  return {
    featuredCars: (obj?.featuredCars ?? []) as VinFastHomeSlide[],
    featuredScooters: (obj?.featuredScooters ?? []) as VinFastHomeSlide[],
    featuredCarIds: Array.isArray(obj?.featuredCarIds)
      ? (obj.featuredCarIds as string[]).filter((id) => typeof id === "string")
      : [],
    featuredScooterIds: Array.isArray(obj?.featuredScooterIds)
      ? (obj.featuredScooterIds as string[]).filter((id) => typeof id === "string")
      : [],
    featuredAccessoryIds: Array.isArray(obj?.featuredAccessoryIds)
      ? (obj.featuredAccessoryIds as string[]).filter((id) => typeof id === "string")
      : [],
    featuredCarPrices: parseFeaturedPrices(obj?.featuredCarPrices),
    featuredScooterPrices: parseFeaturedPrices(obj?.featuredScooterPrices),
    featuredCarSlideOverrides: slideOverrides(obj?.featuredCarSlideOverrides),
    featuredScooterSlideOverrides: slideOverrides(obj?.featuredScooterSlideOverrides),
    heroBanners: (obj?.heroBanners ?? []) as VinFastHeroBanner[],
    heroBannersAll: (obj?.heroBannersAll ?? []) as HeroBannerSlide[],
    sections: obj?.sections ?? null,
  };
}

export function buildFeaturedSlidesFromIds(
  ids: string[],
  defaults: VinFastHomeSlide[],
  vehicles: { id: string; name: string; subtitle: string; image: string; price: number }[],
  vehicleType: "car" | "scooter",
): VinFastHomeSlide[] {
  if (!ids.length) return [];

  const defaultById = new Map(
    defaults
      .map((slide) => {
        const vehicle = findVehicleBySlideHref(slide.href, vehicles, vehicleType);
        return vehicle ? ([vehicle.id, slide] as const) : null;
      })
      .filter((entry): entry is [string, VinFastHomeSlide] => entry !== null),
  );

  const slides = ids
    .map((id) => {
      const fallback = defaultById.get(id);
      if (fallback) return fallback;

      const vehicle = vehicles.find((v) => v.id === id);
      if (!vehicle) return null;

      return {
        title: vehicle.name,
        subtitle: vehicle.subtitle,
        image: vehicle.image,
        imageAlt: vehicle.name,
        imageClass: "h-full w-full object-contain object-left",
        specs: [
          {
            value: `${formatPrice(vehicle.price)} VNĐ`,
            label: "Giá bán từ",
            highlight: true,
          },
        ],
        primaryCta: vehicleType === "car" ? "ĐẶT CỌC" : "ĐẶT MUA",
        secondaryCta: "KHÁM PHÁ NGAY",
        href: vehicleDetailPathFromId(vehicle.id, vehicleType),
      } satisfies VinFastHomeSlide;
    })
    .filter((slide): slide is VinFastHomeSlide => slide !== null);

  return hydrateFeaturedVehicleSlides(slides, vehicles, vehicleType);
}
