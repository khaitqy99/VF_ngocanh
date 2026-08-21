import type { Json } from "@vinfast3s/supabase";

export const CMS_SCOOTER_PRICING_TAG = "cms-scooter-pricing";

export type ScooterProvinceFee = {
  id: string;
  name: string;
  /** Lệ phí trước bạ theo giá xe (vd 0.05 = 5%) */
  registrationTaxRate: number;
  plateFeeUnder15m: number;
  plateFeeUnder40m: number;
  plateFeeAbove40m: number;
};

export type ScooterPricingSettings = {
  provinces: ScooterProvinceFee[];
  inspectionFee: number;
  civilInsurance: number;
};

const DEFAULT_PROVINCES: ScooterProvinceFee[] = [
  {
    id: "camau",
    name: "Cà Mau & tỉnh khác",
    registrationTaxRate: 0.02,
    plateFeeUnder15m: 150_000,
    plateFeeUnder40m: 400_000,
    plateFeeAbove40m: 800_000,
  },
  {
    id: "hanoi",
    name: "Hà Nội (Lệ phí biển 2 - 4 triệu)",
    registrationTaxRate: 0.05,
    plateFeeUnder15m: 1_000_000,
    plateFeeUnder40m: 2_000_000,
    plateFeeAbove40m: 4_000_000,
  },
  {
    id: "hcm",
    name: "TP. Hồ Chí Minh (Lệ phí biển 2 - 4 triệu)",
    registrationTaxRate: 0.05,
    plateFeeUnder15m: 1_000_000,
    plateFeeUnder40m: 2_000_000,
    plateFeeAbove40m: 4_000_000,
  },
  {
    id: "other",
    name: "Tỉnh/Thành phố khác (Lệ phí biển 100K - 800K)",
    registrationTaxRate: 0.02,
    plateFeeUnder15m: 150_000,
    plateFeeUnder40m: 400_000,
    plateFeeAbove40m: 800_000,
  },
];

export function defaultScooterPricingSettings(): ScooterPricingSettings {
  return {
    provinces: DEFAULT_PROVINCES.map((p) => ({ ...p })),
    inspectionFee: 100_000,
    civilInsurance: 66_000,
  };
}

export function scooterPlateFee(province: ScooterProvinceFee, basePrice: number): number {
  if (basePrice < 15_000_000) return province.plateFeeUnder15m;
  if (basePrice <= 40_000_000) return province.plateFeeUnder40m;
  return province.plateFeeAbove40m;
}

function toFiniteNumber(value: unknown, fallback: number): number {
  if (typeof value === "number" && Number.isFinite(value) && value >= 0) return value;
  if (typeof value === "string") {
    const parsed = Number(value.replace(/[^\d.]/g, ""));
    if (Number.isFinite(parsed) && parsed >= 0) return parsed;
  }
  return fallback;
}

function parseRate(value: unknown, fallback: number): number {
  const rate = toFiniteNumber(value, fallback);
  return rate > 1 ? rate / 100 : rate;
}

function parseProvince(value: unknown): ScooterProvinceFee | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const row = value as Record<string, unknown>;
  const id = typeof row.id === "string" ? row.id.trim() : "";
  const name = typeof row.name === "string" ? row.name.trim() : "";
  if (!id || !name) return null;
  return {
    id,
    name,
    registrationTaxRate: parseRate(row.registrationTaxRate, 0.02),
    plateFeeUnder15m: toFiniteNumber(row.plateFeeUnder15m, 150_000),
    plateFeeUnder40m: toFiniteNumber(row.plateFeeUnder40m, 400_000),
    plateFeeAbove40m: toFiniteNumber(row.plateFeeAbove40m, 800_000),
  };
}

function parseProvinces(value: unknown, fallback: ScooterProvinceFee[]): ScooterProvinceFee[] {
  if (!Array.isArray(value)) return fallback;
  const parsed = value.map(parseProvince).filter((p): p is ScooterProvinceFee => p !== null);
  return parsed.length > 0 ? parsed : fallback;
}

export function parseScooterPricingSettings(
  value: Json | null | undefined,
): Partial<ScooterPricingSettings> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const row = value as Record<string, unknown>;
  const partial: Partial<ScooterPricingSettings> = {};

  if (row.provinces !== undefined) {
    partial.provinces = parseProvinces(row.provinces, DEFAULT_PROVINCES);
  }
  if (row.inspectionFee !== undefined) {
    partial.inspectionFee = toFiniteNumber(row.inspectionFee, 100_000);
  }
  if (row.civilInsurance !== undefined) {
    partial.civilInsurance = toFiniteNumber(row.civilInsurance, 66_000);
  }

  return partial;
}

export function mergeScooterPricingSettings(
  input?: Partial<ScooterPricingSettings> | null,
): ScooterPricingSettings {
  const defaults = defaultScooterPricingSettings();
  if (!input) return defaults;

  return {
    provinces:
      input.provinces && input.provinces.length > 0
        ? parseProvinces(input.provinces, defaults.provinces)
        : defaults.provinces,
    inspectionFee: toFiniteNumber(input.inspectionFee, defaults.inspectionFee),
    civilInsurance: toFiniteNumber(input.civilInsurance, defaults.civilInsurance),
  };
}
