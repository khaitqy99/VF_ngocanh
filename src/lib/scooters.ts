// Auto-synced from VinFast — scripts/sync-vinfast-catalog.mjs
// Source: https://vinfastauto.com/vn_vi
// Last synced: 2026-06-26T11:30:11.844Z

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
  range: number;
  topSpeed: number;
  trunk: number;
  type: ScooterType;
  rangeBucket: RangeBucket;
  speedBucket: SpeedBucket;
  motorPower: number;
  batteryType: "LFP" | "Lithium-ion" | "Ắc quy";
  chargingTime: string;
  dimensions: string;
  weight: number;
  batteryPurchasePrice: number;
  rentBatteryPrice: number;
  acceleration: string;
  colors: ScooterColor[];
  isBestSeller?: boolean;
  isPromo?: boolean;
  isNew?: boolean;
};

export const SCOOTER_IMAGES = {
  hero: "/images/charging-scooter.jpg",
  promoTestDrive: "/images/banners/02-xmd-uu-dai-16-1-desktop.jpg",
  promoFinance: "/images/portable-charger.jpg",
} as const;

export const SCOOTERS: ScooterModel[] = [
  {
    id: "flazz-max",
    name: "FLAZZ MAX",
    subtitle:
      "Flazz Max sở hữu công suất tối đa 1500W, pin LFP 1.5kWh, thiết kế thể thao năng động.",
    image: "/images/vinfast/scooters/flazz-max.webp",
    price: 14_990_000,
    range: 87,
    topSpeed: 49,
    trunk: 0,
    type: "xe-co-ban",
    rangeBucket: "over80",
    speedBucket: "under50",
    motorPower: 1500,
    batteryType: "LFP",
    chargingTime: "Khoảng 8h",
    dimensions: "1.720 x 680 x 1.080 mm",
    weight: 88,
    batteryPurchasePrice: 12_500_000,
    rentBatteryPrice: 150_000,
    acceleration: "0-45 km/h trong 7.5 giây",
    colors: [
      {
        name: "Trắng",
        hex: "#FFFFFF",
      },
      {
        name: "Đen",
        hex: "#111827",
      },
    ],
  },
  {
    id: "amio-s",
    name: "AMIO S",
    subtitle: "Xe máy điện đô thị gọn nhẹ, tốc độ tối đa 25 km/h.",
    image: "/images/vinfast/scooters/amio-s.webp",
    price: 13_900_000,
    range: 65,
    topSpeed: 25,
    trunk: 0,
    type: "xe-dap-dien",
    rangeBucket: "50-80",
    speedBucket: "under50",
    motorPower: 800,
    batteryType: "Lithium-ion",
    chargingTime: "4 giờ (0-100%)",
    dimensions: "1.650 x 650 x 1.050 mm",
    weight: 65,
    batteryPurchasePrice: 8_000_000,
    rentBatteryPrice: 120_000,
    acceleration: "0-25 km/h trong 5 giây",
    colors: [
      {
        name: "Trắng",
        hex: "#FFFFFF",
      },
      {
        name: "Xanh",
        hex: "#2563EB",
      },
    ],
  },
  {
    id: "evo-lite",
    name: "EVO Lite",
    subtitle: "Xe máy điện phân khúc cao cấp với quãng đường lên tới 165 km.",
    image: "/images/vinfast/scooters/evo-lite.png",
    price: 17_000_000,
    range: 165,
    topSpeed: 49,
    trunk: 0,
    type: "xe-co-ban",
    rangeBucket: "over80",
    speedBucket: "under50",
    motorPower: 2300,
    batteryType: "LFP",
    chargingTime: "6 giờ (0-100%)",
    dimensions: "1.804 x 680 x 1.127 mm",
    weight: 97,
    batteryPurchasePrice: 19_900_000,
    rentBatteryPrice: 250_000,
    acceleration: "0-49 km/h trong 8 giây",
    colors: [
      {
        name: "Đỏ",
        hex: "#DC2626",
      },
      {
        name: "Trắng",
        hex: "#FFFFFF",
      },
    ],
    isBestSeller: true,
  },
  {
    id: "amio",
    name: "Amio",
    subtitle: "Xe máy điện đô thị với tốc độ tối đa 30 km/h.",
    image: "/images/vinfast/scooters/amio.webp",
    price: 13_900_000,
    range: 65,
    topSpeed: 30,
    trunk: 0,
    type: "xe-co-ban",
    rangeBucket: "50-80",
    speedBucket: "under50",
    motorPower: 800,
    batteryType: "Lithium-ion",
    chargingTime: "4 giờ (0-100%)",
    dimensions: "1.650 x 650 x 1.050 mm",
    weight: 68,
    batteryPurchasePrice: 8_600_000,
    rentBatteryPrice: 150_000,
    acceleration: "0-30 km/h trong 5 giây",
    colors: [
      {
        name: "Trắng",
        hex: "#FFFFFF",
      },
      {
        name: "Xanh",
        hex: "#2563EB",
      },
    ],
  },
  {
    id: "viper",
    name: "Viper",
    subtitle: "Xe máy điện hiệu suất cao, tốc độ tối đa 70 km/h, quãng đường ~156 km/lần sạc.",
    image: "/images/vinfast/scooters/viper.webp",
    price: 39_900_000,
    range: 156,
    topSpeed: 70,
    trunk: 0,
    type: "xe-ga-cao-cap",
    rangeBucket: "over80",
    speedBucket: "50-70",
    motorPower: 3000,
    batteryType: "LFP",
    chargingTime: "6 giờ (0-100%)",
    dimensions: "1.900 x 700 x 1.150 mm",
    weight: 120,
    batteryPurchasePrice: 19_900_000,
    rentBatteryPrice: 350_000,
    acceleration: "0-50 km/h trong 4.5 giây",
    colors: [
      {
        name: "Đen",
        hex: "#111827",
      },
      {
        name: "Đỏ",
        hex: "#DC2626",
      },
    ],
  },
  {
    id: "feliz-ii",
    name: "Feliz II",
    subtitle: "Xe máy điện phong cách với quãng đường ~156 km.",
    image: "/images/vinfast/scooters/feliz-ii.webp",
    price: 24_900_000,
    range: 156,
    topSpeed: 70,
    trunk: 0,
    type: "xe-ga",
    rangeBucket: "over80",
    speedBucket: "50-70",
    motorPower: 3000,
    batteryType: "LFP",
    chargingTime: "6 giờ (0-100%)",
    dimensions: "1.912 x 693 x 1.128 mm",
    weight: 110,
    batteryPurchasePrice: 19_900_000,
    rentBatteryPrice: 350_000,
    acceleration: "0-50 km/h trong 5.8 giây",
    colors: [
      {
        name: "Xanh lục",
        hex: "#065F46",
      },
      {
        name: "Trắng",
        hex: "#FFFFFF",
      },
    ],
    isBestSeller: true,
  },
  {
    id: "evo",
    name: "EVO",
    subtitle: "Xe máy điện đa dụng với quãng đường ~165 km (2 pin).",
    image: "/images/vinfast/scooters/evo.webp",
    price: 19_990_000,
    range: 165,
    topSpeed: 70,
    trunk: 12,
    type: "xe-co-ban",
    rangeBucket: "over80",
    speedBucket: "50-70",
    motorPower: 1500,
    batteryType: "LFP",
    chargingTime: "6 giờ (0-100%)",
    dimensions: "1.804 x 680 x 1.127 mm",
    weight: 100,
    batteryPurchasePrice: 19_900_000,
    rentBatteryPrice: 250_000,
    acceleration: "0-50 km/h trong 6 giây",
    colors: [
      {
        name: "Xanh dương",
        hex: "#1D4ED8",
      },
      {
        name: "Đỏ",
        hex: "#DC2626",
      },
    ],
    isBestSeller: true,
  },
  {
    id: "zgoo",
    name: "zgoo",
    subtitle:
      "Xe máy điện VinFast ZGoo - Lựa chọn lý tưởng cho học sinh, không yêu cầu bằng lái. Xe sở hữu thiết kế hiện đại, động cơ ",
    image: "/images/vinfast/scooters/zgoo.webp",
    price: 15_900_000,
    range: 70,
    topSpeed: 39,
    trunk: 14,
    type: "xe-co-ban",
    rangeBucket: "50-80",
    speedBucket: "under50",
    motorPower: 1500,
    batteryType: "LFP",
    chargingTime: "5 giờ (0-100%)",
    dimensions: "1.700 x 680 x 1.100 mm",
    weight: 90,
    batteryPurchasePrice: 15_000_000,
    rentBatteryPrice: 200_000,
    acceleration: "0-39 km/h trong 7 giây",
    colors: [
      {
        name: "Trắng",
        hex: "#FFFFFF",
      },
      {
        name: "Xanh",
        hex: "#34D399",
      },
    ],
  },
  {
    id: "flazz",
    name: "Flazz",
    subtitle:
      "Xe máy điện VinFast Flazz - Lựa chọn lý tưởng cho học sinh, không yêu cầu bằng lái. Xe sở hữu thiết kế cá tính, mạnh mẽ,",
    image: "/images/vinfast/scooters/flazz.webp",
    price: 16_900_000,
    range: 135,
    topSpeed: 39,
    trunk: 14,
    type: "xe-co-ban",
    rangeBucket: "over80",
    speedBucket: "under50",
    motorPower: 1500,
    batteryType: "LFP",
    chargingTime: "5 giờ (0-100%)",
    dimensions: "1.720 x 680 x 1.080 mm",
    weight: 92,
    batteryPurchasePrice: 16_000_000,
    rentBatteryPrice: 200_000,
    acceleration: "0-39 km/h trong 7 giây",
    colors: [
      {
        name: "Trắng",
        hex: "#FFFFFF",
      },
      {
        name: "Đen",
        hex: "#111827",
      },
    ],
  },
  {
    id: "vero-x",
    name: "Vero X",
    subtitle:
      "Xe máy điện VinFast Vero X: Lái êm ái, kiểu dáng thời thượng. Cốp 35L và sàn rộng rãi, tối ưu công năng, tối đa nhu cầu.",
    image: "/images/vinfast/scooters/vero-x.webp",
    price: 34_900_000,
    range: 262,
    topSpeed: 70,
    trunk: 35,
    type: "xe-ga-cao-cap",
    rangeBucket: "over80",
    speedBucket: "50-70",
    motorPower: 1500,
    batteryType: "LFP",
    chargingTime: "6 giờ (0-100%)",
    dimensions: "1.950 x 720 x 1.180 mm",
    weight: 125,
    batteryPurchasePrice: 22_000_000,
    rentBatteryPrice: 390_000,
    acceleration: "0-50 km/h trong 4.2 giây",
    colors: [
      {
        name: "Đen",
        hex: "#111827",
      },
      {
        name: "Trắng",
        hex: "#FFFFFF",
      },
    ],
    isBestSeller: true,
  },
  {
    id: "feliz-2025",
    name: "Feliz 2025",
    subtitle:
      "Xe máy điện Feliz 2025 thiết kế thanh lịch, nâng cấp 2 pin LFP linh hoạt, cho quãng đường lên đến ~262km/lần sạc (*)Tích",
    image: "/images/vinfast/scooters/feliz-2025.webp",
    price: 27_900_000,
    range: 262,
    topSpeed: 70,
    trunk: 34,
    type: "xe-ga",
    rangeBucket: "over80",
    speedBucket: "50-70",
    motorPower: 1500,
    batteryType: "LFP",
    chargingTime: "6 giờ (0-100%)",
    dimensions: "1.912 x 693 x 1.128 mm",
    weight: 112,
    batteryPurchasePrice: 19_900_000,
    rentBatteryPrice: 350_000,
    acceleration: "0-50 km/h trong 5.5 giây",
    colors: [
      {
        name: "Xanh lục",
        hex: "#065F46",
      },
      {
        name: "Đỏ",
        hex: "#991B1B",
      },
    ],
    isNew: true,
  },
  {
    id: "evo-grand",
    name: "Evo Grand",
    subtitle:
      "Xe máy điện Evo Grand linh hoạt nâng cấp Pin LFP, khả năng di chuyển ấn tượng với quãng đường lên tới 262km, tốc độ 70km",
    image: "/images/vinfast/scooters/evo-grand.webp",
    price: 23_900_000,
    range: 262,
    topSpeed: 70,
    trunk: 35,
    type: "xe-ga",
    rangeBucket: "over80",
    speedBucket: "50-70",
    motorPower: 1500,
    batteryType: "LFP",
    chargingTime: "6 giờ (0-100%)",
    dimensions: "1.920 x 700 x 1.140 mm",
    weight: 115,
    batteryPurchasePrice: 19_900_000,
    rentBatteryPrice: 350_000,
    acceleration: "0-50 km/h trong 5.8 giây",
    colors: [
      {
        name: "Trắng",
        hex: "#FFFFFF",
      },
      {
        name: "Đen",
        hex: "#111827",
      },
    ],
  },
  {
    id: "evo-grand-lite",
    name: "Evo Grand Lite",
    subtitle: "Xe ga điện tiết kiệm, quãng đường lên tới 198 km (2 pin).",
    image: "/images/vinfast/scooters/evo-grand-lite.webp",
    price: 19_900_000,
    range: 198,
    topSpeed: 48,
    trunk: 35,
    type: "xe-ga",
    rangeBucket: "over80",
    speedBucket: "under50",
    motorPower: 1500,
    batteryType: "LFP",
    chargingTime: "6 giờ (0-100%)",
    dimensions: "1.920 x 700 x 1.140 mm",
    weight: 110,
    batteryPurchasePrice: 18_000_000,
    rentBatteryPrice: 300_000,
    acceleration: "0-48 km/h trong 7 giây",
    colors: [
      {
        name: "Trắng",
        hex: "#FFFFFF",
      },
      {
        name: "Xanh",
        hex: "#2563EB",
      },
    ],
  },
  {
    id: "drgnfly",
    name: "DrgnFly",
    subtitle: "Xe đạp điện VF DrgnFly",
    image: "/images/vinfast/scooters/drgnfly.png",
    price: 18_690_000,
    range: 110,
    topSpeed: 49,
    trunk: 0,
    type: "xe-dap-dien",
    rangeBucket: "over80",
    speedBucket: "under50",
    motorPower: 250,
    batteryType: "Lithium-ion",
    chargingTime: "5 giờ (0-100%)",
    dimensions: "1.750 x 600 x 1.100 mm",
    weight: 28,
    batteryPurchasePrice: 10_000_000,
    rentBatteryPrice: 0,
    acceleration: "Hỗ trợ pedal-assist",
    colors: [
      {
        name: "Đen",
        hex: "#111827",
      },
      {
        name: "Xám",
        hex: "#6B7280",
      },
    ],
    isNew: true,
  },
  {
    id: "evo-lite-neo",
    name: "EVO Lite Neo",
    subtitle:
      "Evo Lite Neo - Xe máy điện cho học sinh (không yêu cầu bằng lái). Hệ thống phanh an toàn, vận hành êm ái, thiết kế trẻ t",
    image: "/images/vinfast/scooters/evo-lite-neo.png",
    price: 14_400_000,
    range: 78,
    topSpeed: 49,
    trunk: 17,
    type: "xe-co-ban",
    rangeBucket: "50-80",
    speedBucket: "under50",
    motorPower: 1500,
    batteryType: "LFP",
    chargingTime: "4 giờ (0-100%)",
    dimensions: "1.750 x 680 x 1.100 mm",
    weight: 105,
    batteryPurchasePrice: 12_000_000,
    rentBatteryPrice: 150_000,
    acceleration: "0-45 km/h trong 8 giây",
    colors: [
      {
        name: "Cam Sunset",
        hex: "#EA580C",
      },
      {
        name: "Xanh dương",
        hex: "#1D4ED8",
      },
      {
        name: "Trắng",
        hex: "#FFFFFF",
      },
    ],
    isNew: true,
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
