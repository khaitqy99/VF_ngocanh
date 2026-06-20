export type ScooterType = "xe-dap-dien" | "xe-co-ban" | "xe-the-thao" | "xe-ga" | "xe-ga-cao-cap";

export type RangeBucket = "under50" | "50-80" | "over80";

export type SpeedBucket = "under50" | "50-70" | "over70";

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
};

export const SCOOTER_IMAGES = {
  hero: "/images/charging-scooter.jpg",
  promoTestDrive: "/images/charging-scooter.jpg",
  promoFinance: "/images/portable-charger.jpg",
} as const;

export const SCOOTERS: ScooterModel[] = [
  {
    id: "motio",
    name: "Motio",
    subtitle: "Xe đạp điện thông minh",
    image: "/images/evo-scooter.png",
    price: 12_000_000,
    range: 80,
    topSpeed: 25,
    trunk: 0,
    type: "xe-dap-dien",
    rangeBucket: "over80",
    speedBucket: "under50",
  },
  {
    id: "evo-lite-neo",
    name: "Evo Lite Neo",
    subtitle: "Xe điện đô thị nhỏ gọn",
    image: "/images/evo-scooter.png",
    price: 14_400_000,
    range: 65,
    topSpeed: 49,
    trunk: 18,
    type: "xe-co-ban",
    rangeBucket: "50-80",
    speedBucket: "under50",
  },
  {
    id: "evo-neo",
    name: "Evo Neo",
    subtitle: "Xe điện thông minh đa dụng",
    image: "/images/evo-scooter.png",
    price: 17_800_000,
    range: 70,
    topSpeed: 55,
    trunk: 20,
    type: "xe-co-ban",
    rangeBucket: "50-80",
    speedBucket: "50-70",
  },
  {
    id: "evo-200-lite",
    name: "Evo 200 Lite",
    subtitle: "Xe thể thao điện nhẹ",
    image: "/images/evo-scooter.png",
    price: 22_000_000,
    range: 45,
    topSpeed: 70,
    trunk: 22,
    type: "xe-the-thao",
    rangeBucket: "under50",
    speedBucket: "over70",
  },
  {
    id: "evo-200",
    name: "Evo 200",
    subtitle: "Xe thể thao điện mạnh mẽ",
    image: "/images/evo-scooter.png",
    price: 22_000_000,
    range: 50,
    topSpeed: 70,
    trunk: 22,
    type: "xe-the-thao",
    rangeBucket: "50-80",
    speedBucket: "over70",
  },
  {
    id: "feliz-neo",
    name: "Feliz Neo",
    subtitle: "Xe ga điện thời trang",
    image: "/images/charging-scooter.jpg",
    price: 22_400_000,
    range: 80,
    topSpeed: 50,
    trunk: 25,
    type: "xe-ga",
    rangeBucket: "over80",
    speedBucket: "50-70",
  },
  {
    id: "feliz-s",
    name: "Feliz S",
    subtitle: "Xe ga điện cao cấp",
    image: "/images/charging-scooter.jpg",
    price: 29_700_000,
    range: 90,
    topSpeed: 55,
    trunk: 28,
    type: "xe-ga",
    rangeBucket: "over80",
    speedBucket: "50-70",
  },
  {
    id: "klara-neo",
    name: "Klara Neo",
    subtitle: "Xe ga điện thông minh",
    image: "/images/herio-green.jpg",
    price: 28_800_000,
    range: 85,
    topSpeed: 50,
    trunk: 26,
    type: "xe-ga",
    rangeBucket: "over80",
    speedBucket: "50-70",
  },
  {
    id: "klara-s2",
    name: "Klara S2",
    subtitle: "Xe ga điện sang trọng",
    image: "/images/herio-green.jpg",
    price: 36_500_000,
    range: 95,
    topSpeed: 55,
    trunk: 30,
    type: "xe-ga",
    rangeBucket: "over80",
    speedBucket: "50-70",
  },
  {
    id: "vento-neo",
    name: "Vento Neo",
    subtitle: "Xe ga điện hiện đại",
    image: "/images/charging-scooter.jpg",
    price: 32_000_000,
    range: 100,
    topSpeed: 60,
    trunk: 32,
    type: "xe-ga",
    rangeBucket: "over80",
    speedBucket: "50-70",
  },
  {
    id: "vento-s",
    name: "Vento S",
    subtitle: "Xe ga điện cao cấp",
    image: "/images/herio-green.jpg",
    price: 49_200_000,
    range: 120,
    topSpeed: 65,
    trunk: 35,
    type: "xe-ga-cao-cap",
    rangeBucket: "over80",
    speedBucket: "50-70",
  },
  {
    id: "theon-s",
    name: "Theon S",
    subtitle: "Xe ga điện hàng đầu",
    image: "/images/herio-green.jpg",
    price: 56_900_000,
    range: 130,
    topSpeed: 70,
    trunk: 38,
    type: "xe-ga-cao-cap",
    rangeBucket: "over80",
    speedBucket: "over70",
  },
];

export const SCOOTERS_PER_PAGE = 6;

export const TYPE_OPTIONS: { value: ScooterType | "all"; label: string }[] = [
  { value: "all", label: "Tất cả" },
  { value: "xe-dap-dien", label: "Xe đạp điện" },
  { value: "xe-co-ban", label: "Xe cơ bản" },
  { value: "xe-the-thao", label: "Xe thể thao" },
  { value: "xe-ga", label: "Xe ga" },
  { value: "xe-ga-cao-cap", label: "Xe ga cao cấp" },
];

export const RANGE_OPTIONS: { value: RangeBucket; label: string }[] = [
  { value: "under50", label: "Dưới 50 km" },
  { value: "50-80", label: "50 – 80 km" },
  { value: "over80", label: "Trên 80 km" },
];

export const SPEED_OPTIONS: { value: SpeedBucket; label: string }[] = [
  { value: "under50", label: "Dưới 50 km/h" },
  { value: "50-70", label: "50 – 70 km/h" },
  { value: "over70", label: "Trên 70 km/h" },
];

export const PRICE_MIN = 10_000_000;
export const PRICE_MAX = 60_000_000;

export { formatPrice } from "./cars";
