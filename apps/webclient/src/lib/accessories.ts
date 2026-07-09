import { IMAGES } from "@/lib/images";
import {
  VINFAST_ACCESSORIES,
  VINFAST_ACCESSORY_PRICE_MAX,
  VINFAST_ACCESSORY_PRICE_MIN,
} from "./vinfast-accessories";

export type AccessoryCategory =
  "noi-that" | "ngoai-that" | "sac-pin" | "an-toan" | "qua-tang" | "phu-kien-chung";

export type VehicleModel =
  | "all"
  | "vf3"
  | "vf5"
  | "vf6"
  | "vf7"
  | "vf8"
  | "vf8-all-new"
  | "vf9"
  | "vf-mpv7"
  | "ec-van"
  | "herio-green"
  | "nerio-green"
  | "limo-green"
  | "minio-green";

export type AccessoryProduct = {
  id: string;
  slug?: string;
  shopPid?: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: AccessoryCategory;
  vehicles: VehicleModel[];
  badge?: string;
  inStock: boolean;
};

export const ACCESSORY_IMAGES = {
  hero: "/images/banners/accessories/phu-kien-banner-desktop.webp",
  promoInstall: IMAGES.community,
  promoWarranty: IMAGES.portableCharger,
} as const;

export const CATEGORY_OPTIONS: { value: AccessoryCategory; label: string }[] = [
  { value: "noi-that", label: "Nội thất" },
  { value: "ngoai-that", label: "Ngoại thất & bảo vệ" },
  { value: "sac-pin", label: "Sạc & pin" },
  { value: "an-toan", label: "An toàn & công nghệ" },
  { value: "qua-tang", label: "Quà tặng & lưu niệm" },
  { value: "phu-kien-chung", label: "Phụ kiện chung" },
];

export const VEHICLE_OPTIONS: { value: VehicleModel; label: string }[] = [
  { value: "all", label: "Tất cả dòng xe" },
  { value: "vf3", label: "VF 3" },
  { value: "vf5", label: "VF 5" },
  { value: "vf6", label: "VF 6" },
  { value: "vf7", label: "VF 7" },
  { value: "vf8", label: "VF 8" },
  { value: "vf8-all-new", label: "VF 8 All New" },
  { value: "vf9", label: "VF 9" },
  { value: "vf-mpv7", label: "VF MPV 7" },
  { value: "ec-van", label: "EC VAN" },
  { value: "herio-green", label: "Herio Green" },
  { value: "nerio-green", label: "Nerio Green" },
  { value: "limo-green", label: "Limo Green" },
  { value: "minio-green", label: "Minio Green" },
];

export const ACCESSORIES_PER_PAGE = 12;

export const ACCESSORIES: AccessoryProduct[] = VINFAST_ACCESSORIES as unknown as AccessoryProduct[];

export const ACCESSORY_PRICE_MIN = VINFAST_ACCESSORY_PRICE_MIN;
export const ACCESSORY_PRICE_MAX = VINFAST_ACCESSORY_PRICE_MAX;

export function getAccessoryByShopPid(pid: string) {
  return ACCESSORIES.find((item) => item.shopPid === pid);
}

export function getAccessory(id: string) {
  return ACCESSORIES.find((item) => item.id === id);
}

function accessoryRankForCar(carId: VehicleModel, product: AccessoryProduct) {
  const n = product.name.toLowerCase();
  const forCar = product.vehicles.includes(carId);
  if (forCar && /thảm.*sàn|thảm cốp|lót sàn/.test(n)) return 0;
  if (forCar && /film cách nhiệt|che nắng/.test(n)) return 1;
  if (forCar && /camera/.test(n)) return 2;
  if (forCar && /sạc/.test(n)) return 3;
  if (forCar) return 4;
  if (product.vehicles.includes("all") && /sạc treo tường|sạc tại nhà/.test(n)) return 5;
  return 10;
}

export function getCarDetailAccessories(carId: string) {
  const vehicle = carId as VehicleModel;
  return [...ACCESSORIES]
    .filter((p) => p.vehicles.includes(vehicle) || p.vehicles.includes("all"))
    .sort((a, b) => accessoryRankForCar(vehicle, a) - accessoryRankForCar(vehicle, b))
    .slice(0, 4);
}

export function getScooterDetailAccessories() {
  return ACCESSORIES.filter(
    (p) => p.category === "sac-pin" || p.category === "phu-kien-chung",
  ).slice(0, 4);
}

export function getRelatedAccessories(id: string, limit = 4) {
  const current = getAccessory(id);
  if (!current) return [];

  const sameCategory = ACCESSORIES.filter(
    (item) => item.id !== id && item.category === current.category,
  );
  const fallback = ACCESSORIES.filter((item) => item.id !== id);

  return [...sameCategory, ...fallback.filter((item) => !sameCategory.includes(item))].slice(
    0,
    limit,
  );
}

export function getCategoryLabel(category: AccessoryCategory) {
  return CATEGORY_OPTIONS.find((c) => c.value === category)?.label ?? category;
}

/** Thư mục ảnh phụ kiện trong media library theo dòng xe (không phải product id). */
export function resolveAccessoryMediaSlug(vehicles: string[]): string {
  return vehicles.length > 0 ? vehicles[0]! : "chung";
}

export function getVehicleLabels(vehicles: VehicleModel[]) {
  if (vehicles.includes("all")) return "Tất cả dòng xe";
  return vehicles.map((v) => VEHICLE_OPTIONS.find((o) => o.value === v)?.label ?? v).join(", ");
}

export { formatPrice } from "@/lib/cars";
