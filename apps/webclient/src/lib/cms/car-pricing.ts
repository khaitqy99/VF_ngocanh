import type { Json } from "@vinfast3s/supabase";

export const CMS_CAR_PRICING_TAG = "cms-car-pricing";

export type ProvincePlateFee = {
  id: string;
  name: string;
  plateFee: number;
};

export type CarPricingSettings = {
  /** Danh sách khu vực đăng ký + phí biển số */
  provinces: ProvincePlateFee[];
  /** Phí bảo trì đường bộ 12 tháng (VNĐ) */
  roadMaintenanceFee: number;
  /** Phí đăng kiểm (VNĐ) */
  inspectionFee: number;
  /** Bảo hiểm TNDS bắt buộc (VNĐ) */
  civilInsurance: number;
  /** Tỉ lệ bảo hiểm vật chất theo giá xe (vd 0.011 = 1.1%) */
  physicalInsuranceRate: number;
};

const DEFAULT_PROVINCES: ProvincePlateFee[] = [
  { id: "camau", name: "Cà Mau (Phí biển ~1 triệu)", plateFee: 1_000_000 },
  { id: "hanoi", name: "Hà Nội (Phí biển 20 triệu)", plateFee: 20_000_000 },
  { id: "hcm", name: "TP. Hồ Chí Minh (Phí biển 20 triệu)", plateFee: 20_000_000 },
  { id: "other", name: "Tỉnh/Thành phố khác (Phí biển 1 triệu)", plateFee: 1_000_000 },
];

export function defaultCarPricingSettings(): CarPricingSettings {
  return {
    provinces: DEFAULT_PROVINCES.map((p) => ({ ...p })),
    roadMaintenanceFee: 1_560_000,
    inspectionFee: 340_000,
    civilInsurance: 480_000,
    physicalInsuranceRate: 0.011,
  };
}

function toFiniteNumber(value: unknown, fallback: number): number {
  if (typeof value === "number" && Number.isFinite(value) && value >= 0) return value;
  if (typeof value === "string") {
    const parsed = Number(value.replace(/[^\d.]/g, ""));
    if (Number.isFinite(parsed) && parsed >= 0) return parsed;
  }
  return fallback;
}

function parseProvince(value: unknown): ProvincePlateFee | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const row = value as Record<string, unknown>;
  const id = typeof row.id === "string" ? row.id.trim() : "";
  const name = typeof row.name === "string" ? row.name.trim() : "";
  if (!id || !name) return null;
  return { id, name, plateFee: toFiniteNumber(row.plateFee, 0) };
}

function parseProvinces(value: unknown, fallback: ProvincePlateFee[]): ProvincePlateFee[] {
  if (!Array.isArray(value)) return fallback;
  const parsed = value.map(parseProvince).filter((p): p is ProvincePlateFee => p !== null);
  return parsed.length > 0 ? parsed : fallback;
}

export function parseCarPricingSettings(
  value: Json | null | undefined,
): Partial<CarPricingSettings> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const row = value as Record<string, unknown>;
  const partial: Partial<CarPricingSettings> = {};

  if (row.provinces !== undefined) {
    partial.provinces = parseProvinces(row.provinces, DEFAULT_PROVINCES);
  }
  if (row.roadMaintenanceFee !== undefined) {
    partial.roadMaintenanceFee = toFiniteNumber(row.roadMaintenanceFee, 1_560_000);
  }
  if (row.inspectionFee !== undefined) {
    partial.inspectionFee = toFiniteNumber(row.inspectionFee, 340_000);
  }
  if (row.civilInsurance !== undefined) {
    partial.civilInsurance = toFiniteNumber(row.civilInsurance, 480_000);
  }
  if (row.physicalInsuranceRate !== undefined) {
    const rate = toFiniteNumber(row.physicalInsuranceRate, 0.011);
    // Cho phép nhập dạng phần trăm (1.1) hoặc phân số (0.011)
    partial.physicalInsuranceRate = rate > 1 ? rate / 100 : rate;
  }

  return partial;
}

export function mergeCarPricingSettings(
  input?: Partial<CarPricingSettings> | null,
): CarPricingSettings {
  const defaults = defaultCarPricingSettings();
  if (!input) return defaults;

  return {
    provinces:
      input.provinces && input.provinces.length > 0
        ? parseProvinces(input.provinces, defaults.provinces)
        : defaults.provinces,
    roadMaintenanceFee: toFiniteNumber(input.roadMaintenanceFee, defaults.roadMaintenanceFee),
    inspectionFee: toFiniteNumber(input.inspectionFee, defaults.inspectionFee),
    civilInsurance: toFiniteNumber(input.civilInsurance, defaults.civilInsurance),
    physicalInsuranceRate: toFiniteNumber(
      input.physicalInsuranceRate,
      defaults.physicalInsuranceRate,
    ),
  };
}
