export type CarSegment = "suv" | "suv-nho" | "suv-c" | "suv-d" | "suv-e" | "mpv";

export type DriveType = "fwd" | "rwd" | "awd";

export type RangeBucket = "under400" | "400-600" | "over600";

export type CarColor = {
  name: string;
  hex: string;
};

export type CarModel = {
  id: string;
  name: string;
  subtitle: string;
  image: string;
  price: number;
  seats: number;
  range: number;
  power: number;
  segment: CarSegment;
  drive: DriveType;
  rangeBucket: RangeBucket;
  // Enriched specs
  torque: number; // Nm
  batteryCapacity: number; // kWh
  chargingTime: string; // e.g. "36 phút (10-70%)"
  dimensions: string; // L x W x H mm
  batteryPurchasePrice: number; // VNĐ (additional cost for battery purchase)
  rentBatteryPrice: number; // VNĐ/tháng
  acceleration: string; // e.g. "5.8 giây"
  colors: CarColor[];
  isBestSeller?: boolean;
  isPromo?: boolean;
  isNew?: boolean;
};

export const CAR_IMAGES = {
  hero: "/images/showroom.jpg",
  promoTestDrive: "/images/cars/promo-test-drive.jpg",
  promoFinance: "/images/cars/promo-finance.jpg",
} as const;

export const CARS: CarModel[] = [
  {
    id: "vf9",
    name: "VF 9",
    subtitle: "SUV điện cao cấp hạng E",
    image: "/images/cars/vf9.jpg",
    price: 1_169_000_000,
    seats: 7,
    range: 423,
    power: 402,
    segment: "suv-e",
    drive: "awd",
    rangeBucket: "400-600",
    torque: 620,
    batteryCapacity: 123,
    chargingTime: "35 phút (10-70%)",
    dimensions: "5.118 x 2.254 x 1.696 mm",
    batteryPurchasePrice: 218_000_000,
    rentBatteryPrice: 3_200_000,
    acceleration: "7.5 giây (0-100 km/h)",
    colors: [
      { name: "Trắng Brahminy", hex: "#FFFFFF" },
      { name: "Đen Jet Black", hex: "#111827" },
      { name: "Xanh Deep Ocean", hex: "#0b1f5b" },
      { name: "Bạc Desat Silver", hex: "#D1D5DB" },
      { name: "Cam Sunset Orange", hex: "#D97706" },
    ],
    isBestSeller: true,
  },
  {
    id: "vf8",
    name: "VF 8",
    subtitle: "SUV điện thông minh hạng D",
    image: "/images/cars/vf8.jpg",
    price: 899_000_000,
    seats: 5,
    range: 471,
    power: 402,
    segment: "suv-d",
    drive: "awd",
    rangeBucket: "400-600",
    torque: 620,
    batteryCapacity: 88.3,
    chargingTime: "31 phút (10-70%)",
    dimensions: "4.750 x 1.934 x 1.667 mm",
    batteryPurchasePrice: 159_000_000,
    rentBatteryPrice: 2_900_000,
    acceleration: "5.5 giây (0-100 km/h)",
    colors: [
      { name: "Trắng Brahminy", hex: "#FFFFFF" },
      { name: "Đen Jet Black", hex: "#111827" },
      { name: "Xanh Deep Ocean", hex: "#0b1f5b" },
      { name: "Bạc Desat Silver", hex: "#D1D5DB" },
      { name: "Đỏ Crimson Red", hex: "#B91C1C" },
    ],
    isBestSeller: true,
  },
  {
    id: "vf7",
    name: "VF 7",
    subtitle: "SUV cỡ C thời thượng và thể thao",
    image: "/images/cars/vf7.jpg",
    price: 799_000_000,
    seats: 5,
    range: 496,
    power: 349,
    segment: "suv-c",
    drive: "fwd",
    rangeBucket: "400-600",
    torque: 500,
    batteryCapacity: 75.3,
    chargingTime: "26 phút (10-70%)",
    dimensions: "4.545 x 1.890 x 1.635 mm",
    batteryPurchasePrice: 149_000_000,
    rentBatteryPrice: 2_900_000,
    acceleration: "5.8 giây (0-100 km/h)",
    colors: [
      { name: "Trắng Brahminy", hex: "#FFFFFF" },
      { name: "Đen Jet Black", hex: "#111827" },
      { name: "Xanh Deep Ocean", hex: "#0b1f5b" },
      { name: "Bạc Desat Silver", hex: "#D1D5DB" },
      { name: "Đỏ Crimson Red", hex: "#B91C1C" },
    ],
    isNew: true,
  },
  {
    id: "vf6",
    name: "VF 6",
    subtitle: "SUV điện đô thị lý tưởng hạng B",
    image: "/images/cars/vf6.jpg",
    price: 689_000_000,
    seats: 5,
    range: 399,
    power: 201,
    segment: "suv-c",
    drive: "fwd",
    rangeBucket: "under400",
    torque: 250,
    batteryCapacity: 59.6,
    chargingTime: "30 phút (10-70%)",
    dimensions: "4.238 x 1.820 x 1.594 mm",
    batteryPurchasePrice: 90_000_000,
    rentBatteryPrice: 1_800_000,
    acceleration: "8.5 giây (0-100 km/h)",
    colors: [
      { name: "Trắng Brahminy", hex: "#FFFFFF" },
      { name: "Đen Jet Black", hex: "#111827" },
      { name: "Bạc Desat Silver", hex: "#D1D5DB" },
      { name: "Xanh Deep Ocean", hex: "#0b1f5b" },
      { name: "Cam Sunset Orange", hex: "#D97706" },
    ],
    isPromo: true,
  },
  {
    id: "vf5",
    name: "VF 5",
    subtitle: "SUV điện đô thị nhỏ gọn",
    image: "/images/cars/vf5.jpg",
    price: 499_000_000,
    seats: 5,
    range: 326,
    power: 134,
    segment: "suv-nho",
    drive: "fwd",
    rangeBucket: "under400",
    torque: 135,
    batteryCapacity: 37.23,
    chargingTime: "30 phút (10-70%)",
    dimensions: "3.965 x 1.720 x 1.580 mm",
    batteryPurchasePrice: 80_000_000,
    rentBatteryPrice: 1_600_000,
    acceleration: "10.9 giây (0-100 km/h)",
    colors: [
      { name: "Trắng Brahminy", hex: "#FFFFFF" },
      { name: "Đen Jet Black", hex: "#111827" },
      { name: "Xanh dương", hex: "#2563EB" },
      { name: "Vàng cát", hex: "#D97706" },
      { name: "Đỏ tươi", hex: "#DC2626" },
    ],
    isBestSeller: true,
  },
  {
    id: "vf-e34",
    name: "VF e34",
    subtitle: "Crossover điện thông minh tiên phong",
    image: "/images/cars/vf-e34.jpg",
    price: 590_000_000,
    seats: 5,
    range: 285,
    power: 147,
    segment: "suv",
    drive: "fwd",
    rangeBucket: "under400",
    torque: 242,
    batteryCapacity: 42,
    chargingTime: "27 phút (10-70%)",
    dimensions: "4.300 x 1.768 x 1.613 mm",
    batteryPurchasePrice: 70_000_000,
    rentBatteryPrice: 1_450_000,
    acceleration: "9.0 giây (0-100 km/h)",
    colors: [
      { name: "Trắng Brahminy", hex: "#FFFFFF" },
      { name: "Đen Jet Black", hex: "#111827" },
      { name: "Bạc Desat Silver", hex: "#D1D5DB" },
      { name: "Xanh dương", hex: "#2563EB" },
    ],
  },
  {
    id: "vf3",
    name: "VF 3",
    subtitle: "Mini SUV điện độc đáo và cá tính",
    image: "/images/cars/vf3.jpg",
    price: 269_000_000,
    seats: 4,
    range: 170,
    power: 43,
    segment: "suv-nho",
    drive: "fwd",
    rangeBucket: "under400",
    torque: 110,
    batteryCapacity: 18.64,
    chargingTime: "36 phút (10-70%)",
    dimensions: "3.190 x 1.679 x 1.622 mm",
    batteryPurchasePrice: 50_000_000,
    rentBatteryPrice: 900_000,
    acceleration: "19.3 giây (0-100 km/h)",
    colors: [
      { name: "Vàng cá tính", hex: "#FBBF24" },
      { name: "Xanh lá sáng", hex: "#34D399" },
      { name: "Hồng mộng mơ", hex: "#F472B6" },
      { name: "Xanh biển nhạt", hex: "#22D3EE" },
      { name: "Trắng Brahminy", hex: "#FFFFFF" },
    ],
    isNew: true,
    isBestSeller: true,
  },
  {
    id: "vf-mpv7",
    name: "VF MPV 7",
    subtitle: "MPV điện đa dụng rộng rãi gia đình",
    image: "/images/cars/vf-mpv7.jpg",
    price: 819_000_000,
    seats: 7,
    range: 450,
    power: 201,
    segment: "mpv",
    drive: "fwd",
    rangeBucket: "400-600",
    torque: 310,
    batteryCapacity: 75.3,
    chargingTime: "28 phút (10-70%)",
    dimensions: "4.620 x 1.860 x 1.720 mm",
    batteryPurchasePrice: 120_000_000,
    rentBatteryPrice: 2_500_000,
    acceleration: "8.0 giây (0-100 km/h)",
    colors: [
      { name: "Trắng Brahminy", hex: "#FFFFFF" },
      { name: "Đen Jet Black", hex: "#111827" },
      { name: "Bạc Desat Silver", hex: "#D1D5DB" },
      { name: "Xanh dương", hex: "#2563EB" },
    ],
    isNew: true,
  },
  {
    id: "limo-green",
    name: "Limo Green",
    subtitle: "Xe van điện thương mại tối ưu chi phí",
    image: "/images/cars/limo-green.jpg",
    price: 285_000_000,
    seats: 2,
    range: 150,
    power: 60,
    segment: "suv",
    drive: "fwd",
    rangeBucket: "under400",
    torque: 150,
    batteryCapacity: 35.8,
    chargingTime: "45 phút (10-70%)",
    dimensions: "4.450 x 1.750 x 1.850 mm",
    batteryPurchasePrice: 60_000_000,
    rentBatteryPrice: 1_200_000,
    acceleration: "14.5 giây (0-100 km/h)",
    colors: [
      { name: "Trắng công sở", hex: "#FFFFFF" },
      { name: "Bạc công nghiệp", hex: "#D1D5DB" },
      { name: "Xanh lá thương mại", hex: "#059669" },
    ],
  },
  {
    id: "minio-green",
    name: "Minio Green",
    subtitle: "MiniCar điện đô thị thời thượng",
    image: "/images/cars/minio-green.jpg",
    price: 302_000_000,
    seats: 4,
    range: 210,
    power: 50,
    segment: "suv-nho",
    drive: "fwd",
    rangeBucket: "under400",
    torque: 110,
    batteryCapacity: 22,
    chargingTime: "40 phút (10-70%)",
    dimensions: "3.520 x 1.610 x 1.510 mm",
    batteryPurchasePrice: 45_000_000,
    rentBatteryPrice: 850_000,
    acceleration: "15.0 giây (0-100 km/h)",
    colors: [
      { name: "Trắng Brahminy", hex: "#FFFFFF" },
      { name: "Vàng cá tính", hex: "#FBBF24" },
      { name: "Hồng mộng mơ", hex: "#F472B6" },
      { name: "Xanh lá sáng", hex: "#34D399" },
    ],
  },
];

export const CARS_PER_PAGE = 6;

export const SEGMENT_OPTIONS: { value: CarSegment | "all"; label: string }[] = [
  { value: "all", label: "Tất cả" },
  { value: "suv", label: "SUV" },
  { value: "suv-nho", label: "SUV nhỏ" },
  { value: "suv-c", label: "SUV cỡ C" },
  { value: "suv-d", label: "SUV cỡ D" },
  { value: "suv-e", label: "SUV cỡ E" },
  { value: "mpv", label: "MPV" },
];

export const SEAT_OPTIONS = [2, 4, 5, 7] as const;

export const RANGE_OPTIONS: { value: RangeBucket; label: string }[] = [
  { value: "under400", label: "Dưới 400 km" },
  { value: "400-600", label: "400 – 600 km" },
  { value: "over600", label: "Trên 600 km" },
];

export const DRIVE_OPTIONS: { value: DriveType; label: string }[] = [
  { value: "fwd", label: "FWD (Cầu trước)" },
  { value: "rwd", label: "RWD (Cầu sau)" },
  { value: "awd", label: "AWD (2 cầu)" },
];

export const PRICE_MIN = 200_000_000;
export const PRICE_MAX = 1_500_000_000;

export function formatPrice(value: number) {
  return value.toLocaleString("vi-VN");
}
