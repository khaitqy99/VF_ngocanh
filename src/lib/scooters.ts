export type ScooterType = "xe-dap-dien" | "xe-co-ban" | "xe-the-thao" | "xe-ga" | "xe-ga-cao-cap";

export type RangeBucket = "under50" | "50-80" | "over80";

export type SpeedBucket = "under50" | "50-70" | "over70";

export type ScooterColor = {
  name: string;
  hex: string;
};

export type ScooterModel = {
  id: string;
  name: string;
  subtitle: string;
  image: string;
  price: number;
  range: number; // km per charge
  topSpeed: number; // km/h
  trunk: number; // liters
  type: ScooterType;
  rangeBucket: RangeBucket;
  speedBucket: SpeedBucket;
  // Enriched specs
  motorPower: number; // W (e.g. 1500W, 3000W)
  batteryType: "LFP" | "Lithium-ion" | "Ắc quy";
  chargingTime: string; // e.g. "4 giờ (0-100%)"
  dimensions: string; // L x W x H mm
  weight: number; // kg
  batteryPurchasePrice: number; // cost to buy battery
  rentBatteryPrice: number; // cost per month
  acceleration: string; // e.g. "Evo Neo: 0-50 km/h trong 6.0s"
  colors: ScooterColor[];
  isBestSeller?: boolean;
  isPromo?: boolean;
  isNew?: boolean;
};

export const SCOOTER_IMAGES = {
  hero: "/images/charging-scooter.jpg",
  promoTestDrive: "/images/charging-scooter.jpg",
  promoFinance: "/images/portable-charger.jpg",
} as const;

export const SCOOTERS: ScooterModel[] = [
  {
    id: "motio",
    name: "VinFast Ludo",
    subtitle: "Xe máy điện học sinh nhỏ gọn cá tính",
    image: "/images/evo-scooter.png",
    price: 12_900_000,
    range: 75,
    topSpeed: 35,
    trunk: 0,
    type: "xe-dap-dien",
    rangeBucket: "50-80",
    speedBucket: "under50",
    motorPower: 500,
    batteryType: "Lithium-ion",
    chargingTime: "4.8 giờ (0-100%)",
    dimensions: "1.700 x 715 x 1.070 mm",
    weight: 68,
    batteryPurchasePrice: 8_600_000,
    rentBatteryPrice: 150_000,
    acceleration: "0-30 km/h trong 4.5 giây",
    colors: [
      { name: "Đỏ cá tính", hex: "#EF4444" },
      { name: "Xanh dương", hex: "#3B82F6" },
      { name: "Xám sành điệu", hex: "#6B7280" },
      { name: "Trắng", hex: "#FFFFFF" },
    ],
    isPromo: true,
  },
  {
    id: "evo-lite-neo",
    name: "Evo200 Lite",
    subtitle: "Xe điện học sinh không cần bằng lái",
    image: "/images/evo-scooter.png",
    price: 19_400_000,
    range: 205,
    topSpeed: 49,
    trunk: 22,
    type: "xe-co-ban",
    rangeBucket: "over80",
    speedBucket: "under50",
    motorPower: 1500,
    batteryType: "LFP",
    chargingTime: "10 giờ (sạc thường 400W) / 4 giờ (sạc nhanh 1000W)",
    dimensions: "1.804 x 680 x 1.127 mm",
    weight: 97,
    batteryPurchasePrice: 19_900_000,
    rentBatteryPrice: 250_000,
    acceleration: "0-45 km/h trong 8.2 giây",
    colors: [
      { name: "Cam Sunset", hex: "#EA580C" },
      { name: "Đỏ tươi", hex: "#DC2626" },
      { name: "Vàng cát", hex: "#EAB308" },
      { name: "Xanh dương", hex: "#1D4ED8" },
      { name: "Trắng ngọc trai", hex: "#F3F4F6" },
    ],
    isBestSeller: true,
    isNew: true,
  },
  {
    id: "evo-neo",
    name: "Evo200",
    subtitle: "Mẫu xe quốc dân vận hành đột phá",
    image: "/images/evo-scooter.png",
    price: 19_400_000,
    range: 203,
    topSpeed: 70,
    trunk: 22,
    type: "xe-co-ban",
    rangeBucket: "over80",
    speedBucket: "over70",
    motorPower: 1500,
    batteryType: "LFP",
    chargingTime: "10 giờ (0-100%)",
    dimensions: "1.804 x 680 x 1.127 mm",
    weight: 97,
    batteryPurchasePrice: 19_900_000,
    rentBatteryPrice: 250_000,
    acceleration: "0-50 km/h trong 6.0 giây",
    colors: [
      { name: "Xanh dương", hex: "#1D4ED8" },
      { name: "Đỏ tươi", hex: "#DC2626" },
      { name: "Vàng cát", hex: "#EAB308" },
      { name: "Trắng ngọc trai", hex: "#F3F4F6" },
      { name: "Đen nhám", hex: "#1F2937" },
    ],
    isBestSeller: true,
  },
  {
    id: "feliz-s",
    name: "Feliz S",
    subtitle: "Kiểu dáng thanh lịch châu Âu hiện đại",
    image: "/images/charging-scooter.jpg",
    price: 27_000_000,
    range: 198,
    topSpeed: 78,
    trunk: 25,
    type: "xe-ga",
    rangeBucket: "over80",
    speedBucket: "over70",
    motorPower: 1800,
    batteryType: "LFP",
    chargingTime: "6 giờ (0-100%)",
    dimensions: "1.912 x 693 x 1.128 mm",
    weight: 110,
    batteryPurchasePrice: 19_900_000,
    rentBatteryPrice: 350_000,
    acceleration: "0-50 km/h trong 5.8 giây",
    colors: [
      { name: "Xanh lục", hex: "#065F46" },
      { name: "Xanh dương", hex: "#1D4ED8" },
      { name: "Đen bóng", hex: "#111827" },
      { name: "Đỏ rượu", hex: "#991B1B" },
      { name: "Trắng thanh lịch", hex: "#FFFFFF" },
    ],
    isBestSeller: true,
  },
  {
    id: "klara-s2",
    name: "Klara S (2024)",
    subtitle: "Dòng xe ga mang tính biểu tượng Ý",
    image: "/images/herio-green.jpg",
    price: 35_000_000,
    range: 194,
    topSpeed: 78,
    trunk: 23,
    type: "xe-ga",
    rangeBucket: "over80",
    speedBucket: "over70",
    motorPower: 1800,
    batteryType: "LFP",
    chargingTime: "6 giờ (0-100%)",
    dimensions: "1.895 x 678 x 1.130 mm",
    weight: 108,
    batteryPurchasePrice: 19_900_000,
    rentBatteryPrice: 350_000,
    acceleration: "0-50 km/h trong 5.9 giây",
    colors: [
      { name: "Xanh rêu nhám", hex: "#14532D" },
      { name: "Đen nhám", hex: "#1F2937" },
      { name: "Đỏ mận", hex: "#7F1D1D" },
      { name: "Trắng ngọc trai", hex: "#F3F4F6" },
    ],
    isNew: true,
  },
  {
    id: "vento-s",
    name: "Vento S",
    subtitle: "Bứt phá giới hạn tốc độ và đẳng cấp",
    image: "/images/herio-green.jpg",
    price: 50_000_000,
    range: 160,
    topSpeed: 89,
    trunk: 25,
    type: "xe-ga-cao-cap",
    rangeBucket: "over80",
    speedBucket: "over70",
    motorPower: 3000,
    batteryType: "LFP",
    chargingTime: "6 giờ (0-100%)",
    dimensions: "1.863 x 691 x 1.100 mm",
    weight: 112,
    batteryPurchasePrice: 19_900_000,
    rentBatteryPrice: 350_000,
    acceleration: "0-50 km/h trong 4.5 giây",
    colors: [
      { name: "Vàng chanh", hex: "#EAB308" },
      { name: "Đỏ tươi", hex: "#DC2626" },
      { name: "Xanh ngọc", hex: "#0D9488" },
      { name: "Trắng", hex: "#FFFFFF" },
      { name: "Đen nhám", hex: "#1F2937" },
    ],
  },
  {
    id: "theon-s",
    name: "Theon S",
    subtitle: "Siêu phẩm xe máy điện mạnh mẽ nhất",
    image: "/images/herio-green.jpg",
    price: 63_900_000,
    range: 150,
    topSpeed: 99,
    trunk: 24,
    type: "xe-ga-cao-cap",
    rangeBucket: "over80",
    speedBucket: "over70",
    motorPower: 7100,
    batteryType: "LFP",
    chargingTime: "6 giờ (0-100%)",
    dimensions: "2.006 x 800 x 1.255 mm",
    weight: 145,
    batteryPurchasePrice: 19_900_000,
    rentBatteryPrice: 390_000,
    acceleration: "0-50 km/h trong 3.9 giây",
    colors: [
      { name: "Đen bóng", hex: "#111827" },
      { name: "Đỏ rượu", hex: "#7F1D1D" },
      { name: "Xám nhám", hex: "#4B5563" },
      { name: "Trắng thanh lịch", hex: "#FFFFFF" },
    ],
    isBestSeller: true,
  },
];

export const SCOOTERS_PER_PAGE = 6;

export const TYPE_OPTIONS: { value: ScooterType | "all"; label: string }[] = [
  { value: "all", label: "Tất cả" },
  { value: "xe-dap-dien", label: "Xe đạp điện" },
  { value: "xe-co-ban", label: "Xe phổ thông" },
  { value: "xe-the-thao", label: "Xe thể thao" },
  { value: "xe-ga", label: "Xe ga cao cấp" },
  { value: "xe-ga-cao-cap", label: "Siêu xe ga flagship" },
];

export const RANGE_OPTIONS: { value: RangeBucket; label: string }[] = [
  { value: "under50", label: "Dưới 50 km" },
  { value: "50-80", label: "50 – 80 km" },
  { value: "over80", label: "Trên 80 km / sạc đầy" },
];

export const SPEED_OPTIONS: { value: SpeedBucket; label: string }[] = [
  { value: "under50", label: "Dưới 50 km/h (An toàn học sinh)" },
  { value: "50-70", label: "50 – 70 km/h (Đô thị)" },
  { value: "over70", label: "Trên 70 km/h (Mạnh mẽ)" },
];

export const PRICE_MIN = 10_000_000;
export const PRICE_MAX = 70_000_000;

export { formatPrice } from "./cars";
