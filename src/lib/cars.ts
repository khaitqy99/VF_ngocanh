// Auto-synced from VinFast — scripts/sync-vinfast-catalog.mjs
// Source: https://vinfastauto.com/vn_vi
// Last synced: 2026-06-26T11:30:11.826Z

export type CarSegment = "suv" | "suv-nho" | "suv-c" | "suv-d" | "suv-e" | "mpv";

export type DriveType = "fwd" | "rwd" | "awd";

export type RangeBucket = "under400" | "400-600" | "over600";

export type CarColor = {
  name: string;
  hex: string;
  image?: string;
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
  torque: number;
  batteryCapacity: number;
  chargingTime: string;
  dimensions: string;
  batteryPurchasePrice: number;
  rentBatteryPrice: number;
  acceleration: string;
  colors: CarColor[];
  isBestSeller?: boolean;
  isPromo?: boolean;
  isNew?: boolean;
};

export const CAR_IMAGES = {
  hero: "/images/showroom.jpg",
  promoTestDrive: "/images/banners/04-vinfascination-vinpearl-desktop.jpg",
  promoFinance: "/images/cars/promo-finance.jpg",
} as const;

export const CARS: CarModel[] = [
  {
    id: "vf8-all-new",
    name: "VF 8 All New",
    subtitle: "SUV điện D-SUV thế hệ mới",
    image: "/images/vinfast/cars/vf8-all-new.png",
    price: 999_000_000,
    seats: 5,
    range: 490,
    power: 228,
    segment: "suv-d",
    drive: "awd",
    rangeBucket: "400-600",
    torque: 330,
    batteryCapacity: 60.13,
    chargingTime: "Dưới 30 phút (10%-70%)",
    dimensions: "4701 x 1872 x 1670",
    batteryPurchasePrice: 159_000_000,
    rentBatteryPrice: 2_900_000,
    acceleration: "5.5 giây (0-100 km/h)",
    colors: [
      {
        name: "Trắng Brahminy",
        hex: "#FFFFFF",
      },
      {
        name: "Đen Jet Black",
        hex: "#111827",
        image: "https://vinfastauto.com/themes/porto/img/vf8-new-product/color/car/VF8PH-21.png",
      },
      {
        name: "Xanh Deep Ocean",
        hex: "#0b1f5b",
      },
      {
        name: "Bạc Desat Silver",
        hex: "#D1D5DB",
      },
    ],
    isNew: true,
  },
  {
    id: "vf-mpv7",
    name: "VF MPV 7",
    subtitle: "MPV điện đa dụng rộng rãi gia đình",
    image: "/images/vinfast/cars/vf-mpv7.webp",
    price: 819_000_000,
    seats: 7,
    range: 450,
    power: 201,
    segment: "mpv",
    drive: "fwd",
    rangeBucket: "400-600",
    torque: 280,
    batteryCapacity: 60.13,
    chargingTime: "30 phút (10%-70%)",
    dimensions: "4740 x 1872 x 1734",
    batteryPurchasePrice: 120_000_000,
    rentBatteryPrice: 2_500_000,
    acceleration: "8.0 giây (0-100 km/h)",
    colors: [
      {
        name: "Trắng Brahminy",
        hex: "#FFFFFF",
      },
      {
        name: "Đen Jet Black",
        hex: "#111827",
      },
      {
        name: "Bạc Desat Silver",
        hex: "#D1D5DB",
      },
      {
        name: "Xanh dương",
        hex: "#2563EB",
      },
    ],
    isNew: true,
  },
  {
    id: "ec-van",
    name: "EC VAN",
    subtitle: "Xe van điện thương mại giao hàng",
    image: "/images/vinfast/cars/ec-van.webp",
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
    dimensions: "3.767 x 1.680 x 1.790 ",
    batteryPurchasePrice: 55_000_000,
    rentBatteryPrice: 1_100_000,
    acceleration: "14.0 giây (0-100 km/h)",
    colors: [
      {
        name: "Trắng công sở",
        hex: "#FFFFFF",
      },
      {
        name: "Bạc công nghiệp",
        hex: "#D1D5DB",
      },
    ],
  },
  {
    id: "minio-green",
    name: "Minio Green",
    subtitle: "MiniCar điện đô thị thời thượng",
    image: "/images/vinfast/cars/minio-green.webp",
    price: 269_000_000,
    seats: 4,
    range: 170,
    power: 40,
    segment: "suv-nho",
    drive: "rwd",
    rangeBucket: "under400",
    torque: 65,
    batteryCapacity: 18.3,
    chargingTime: "40 phút (10-70%)",
    dimensions: "3.520 x 1.610 x 1.510 mm",
    batteryPurchasePrice: 45_000_000,
    rentBatteryPrice: 850_000,
    acceleration: "15.0 giây (0-100 km/h)",
    colors: [
      {
        name: "Trắng Brahminy",
        hex: "#FFFFFF",
      },
      {
        name: "Vàng cá tính",
        hex: "#FBBF24",
      },
      {
        name: "Hồng mộng mơ",
        hex: "#F472B6",
      },
      {
        name: "Xanh lá sáng",
        hex: "#34D399",
      },
    ],
  },
  {
    id: "herio-green",
    name: "Herio Green",
    subtitle: "SUV điện A-SUV tiết kiệm và linh hoạt",
    image: "/images/vinfast/cars/herio-green.png",
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
      {
        name: "Trắng Brahminy",
        hex: "#FFFFFF",
      },
      {
        name: "Đen Jet Black",
        hex: "#111827",
      },
      {
        name: "Xanh dương",
        hex: "#2563EB",
      },
    ],
    isNew: true,
  },
  {
    id: "nerio-green",
    name: "Nerio Green",
    subtitle: "SUV điện B-SUV công nghệ và tiện nghi",
    image: "/images/vinfast/cars/nerio-green.webp",
    price: 668_000_000,
    seats: 5,
    range: 319,
    power: 201,
    segment: "suv-c",
    drive: "fwd",
    rangeBucket: "under400",
    torque: 250,
    batteryCapacity: 59.6,
    chargingTime: "30 phút (10-70%)",
    dimensions: "4300 x 1768 x 1615 ",
    batteryPurchasePrice: 90_000_000,
    rentBatteryPrice: 1_800_000,
    acceleration: "8.5 giây (0-100 km/h)",
    colors: [
      {
        name: "Trắng Brahminy",
        hex: "#FFFFFF",
      },
      {
        name: "Đen Jet Black",
        hex: "#111827",
      },
      {
        name: "Bạc Desat Silver",
        hex: "#D1D5DB",
      },
    ],
    isNew: true,
  },
  {
    id: "limo-green",
    name: "Limo Green",
    subtitle: "MPV điện dịch vụ đa dụng 7 chỗ",
    image: "/images/vinfast/cars/limo-green.png",
    price: 749_000_000,
    seats: 7,
    range: 450,
    power: 201,
    segment: "mpv",
    drive: "fwd",
    rangeBucket: "400-600",
    torque: 310,
    batteryCapacity: 75.3,
    chargingTime: "30 phút (10%-70%)",
    dimensions: "2840 mm cơ sở",
    batteryPurchasePrice: 120_000_000,
    rentBatteryPrice: 2_500_000,
    acceleration: "8.5 giây (0-100 km/h)",
    colors: [
      {
        name: "Trắng công sở",
        hex: "#FFFFFF",
      },
      {
        name: "Bạc công nghiệp",
        hex: "#D1D5DB",
      },
      {
        name: "Xanh lá thương mại",
        hex: "#059669",
      },
    ],
  },
  {
    id: "vf3",
    name: "VF 3",
    subtitle: "Mini SUV điện độc đáo và cá tính",
    image: "/images/vinfast/cars/vf3.webp",
    price: 302_000_000,
    seats: 4,
    range: 210,
    power: 40,
    segment: "suv-nho",
    drive: "rwd",
    rangeBucket: "under400",
    torque: 110,
    batteryCapacity: 18.64,
    chargingTime: "36 phút (10% - 70%)",
    dimensions: "3.190 x 1.679 x 1.622 mm",
    batteryPurchasePrice: 50_000_000,
    rentBatteryPrice: 900_000,
    acceleration: "19.3 giây (0-100 km/h)",
    colors: [
      {
        name: "Summer Yellow",
        hex: "#FBBF24",
        image: "/images/vinfast/colors/vf3/summer-yellow.png",
      },
      {
        name: "Infinity Blanc",
        hex: "#FFFFFF",
        image: "/images/vinfast/colors/vf3/infinity-blanc.png",
      },
      {
        name: "Zenith Grey",
        hex: "#6B7280",
        image: "/images/vinfast/colors/vf3/zenith-grey.png",
      },
      {
        name: "Urban Mint",
        hex: "#34D399",
        image: "/images/vinfast/colors/vf3/urban-mint.png",
      },
      {
        name: "Solar Ruby",
        hex: "#DC2626",
        image: "/images/vinfast/colors/vf3/solar-ruby.png",
      },
    ],
    isBestSeller: true,
    isNew: true,
  },
  {
    id: "vf5",
    name: "VF 5",
    subtitle: "SUV điện đô thị nhỏ gọn",
    image: "/images/vinfast/cars/vf5.webp",
    price: 529_000_000,
    seats: 5,
    range: 326,
    power: 134,
    segment: "suv-nho",
    drive: "fwd",
    rangeBucket: "under400",
    torque: 135,
    batteryCapacity: 37.23,
    chargingTime: "30 phút (10-70%)",
    dimensions: "3.967 x 1.723 x 1.579 ",
    batteryPurchasePrice: 80_000_000,
    rentBatteryPrice: 1_600_000,
    acceleration: "10.9 giây (0-100 km/h)",
    colors: [
      {
        name: "Summer Yellow",
        hex: "#FBBF24",
        image: "/images/vinfast/colors/vf5/summer-yellow.webp",
      },
      {
        name: "Jet Black",
        hex: "#111827",
        image: "/images/vinfast/colors/vf5/jet-black.webp",
      },
      {
        name: "Infinity Blanc",
        hex: "#FFFFFF",
        image: "/images/vinfast/colors/vf5/infinity-blanc.webp",
      },
      {
        name: "Zenith Grey",
        hex: "#6B7280",
        image: "/images/vinfast/colors/vf5/zenith-grey.webp",
      },
      {
        name: "Solar Ruby",
        hex: "#DC2626",
        image: "/images/vinfast/colors/vf5/solar-ruby.webp",
      },
    ],
    isBestSeller: true,
  },
  {
    id: "vf6",
    name: "VF 6",
    subtitle: "SUV điện đô thị lý tưởng hạng B",
    image: "/images/vinfast/cars/vf6.webp",
    price: 689_000_000,
    seats: 5,
    range: 480,
    power: 201,
    segment: "suv-c",
    drive: "fwd",
    rangeBucket: "400-600",
    torque: 310,
    batteryCapacity: 59.6,
    chargingTime: "25 phút (10%-70%)",
    dimensions: "4.238 x 1.820 x 1.594 mm",
    batteryPurchasePrice: 90_000_000,
    rentBatteryPrice: 1_800_000,
    acceleration: "8.5 giây (0-100 km/h)",
    colors: [
      {
        name: "Trắng Brahminy",
        hex: "#FFFFFF",
      },
      {
        name: "Đen Jet Black",
        hex: "#111827",
      },
      {
        name: "Bạc Desat Silver",
        hex: "#D1D5DB",
      },
      {
        name: "Xanh Deep Ocean",
        hex: "#0b1f5b",
      },
      {
        name: "Cam Sunset Orange",
        hex: "#D97706",
      },
    ],
    isPromo: true,
  },
  {
    id: "vf7",
    name: "VF 7",
    subtitle: "SUV cỡ C thời thượng và thể thao",
    image: "/images/vinfast/cars/vf7.webp",
    price: 799_000_000,
    seats: 5,
    range: 496,
    power: 349,
    segment: "suv-c",
    drive: "fwd",
    rangeBucket: "400-600",
    torque: 500,
    batteryCapacity: 59.6,
    chargingTime: "26 phút (10-70%)",
    dimensions: " ",
    batteryPurchasePrice: 149_000_000,
    rentBatteryPrice: 2_900_000,
    acceleration: "5.8 giây (0-100 km/h)",
    colors: [
      {
        name: "Jet Black",
        hex: "#111827",
        image: "/images/vinfast/colors/vf7/jet-black.webp",
      },
      {
        name: "Infinity Blanc",
        hex: "#FFFFFF",
        image: "/images/vinfast/colors/vf7/infinity-blanc.webp",
      },
      {
        name: "Zenith Grey",
        hex: "#6B7280",
        image: "/images/vinfast/colors/vf7/zenith-grey.webp",
      },
      {
        name: "Urban Mint",
        hex: "#34D399",
        image: "/images/vinfast/colors/vf7/urban-mint.webp",
      },
      {
        name: "Solar Ruby",
        hex: "#DC2626",
        image: "/images/vinfast/colors/vf7/solar-ruby.webp",
      },
      {
        name: "Dragon Forged",
        hex: "#7F1D1D",
      },
    ],
    isNew: true,
  },
  {
    id: "vf8",
    name: "VF 8",
    subtitle: "SUV điện thông minh hạng D",
    image: "/images/vinfast/cars/vf8.webp",
    price: 999_000_000,
    seats: 5,
    range: 562,
    power: 402,
    segment: "suv-d",
    drive: "awd",
    rangeBucket: "400-600",
    torque: 620,
    batteryCapacity: 88.3,
    chargingTime: "31 phút (10%-70%)",
    dimensions: "4.750 x 1.934 x 1.667 mm",
    batteryPurchasePrice: 159_000_000,
    rentBatteryPrice: 2_900_000,
    acceleration: "5.5 giây (0-100 km/h)",
    colors: [
      {
        name: "Jet Black",
        hex: "#111827",
        image: "/images/vinfast/colors/vf8/jet-black.webp",
      },
      {
        name: "Infinity Blanc",
        hex: "#FFFFFF",
        image: "/images/vinfast/colors/vf8/infinity-blanc.webp",
      },
      {
        name: "Zenith Grey",
        hex: "#6B7280",
        image: "/images/vinfast/colors/vf8/zenith-grey.webp",
      },
      {
        name: "Urban Mint",
        hex: "#34D399",
        image: "/images/vinfast/colors/vf8/urban-mint.webp",
      },
      {
        name: "Ivy Green",
        hex: "#065F46",
      },
      {
        name: "Desat Silver",
        hex: "#D1D5DB",
        image: "/images/vinfast/colors/vf8/desat-silver.webp",
      },
      {
        name: "Crimson Red",
        hex: "#B91C1C",
        image: "/images/vinfast/colors/vf8/crimson-red.webp",
      },
    ],
    isBestSeller: true,
  },
  {
    id: "vf9",
    name: "VF 9",
    subtitle: "SUV điện cao cấp hạng E",
    image: "/images/vinfast/cars/vf9.webp",
    price: 1_499_000_000,
    seats: 7,
    range: 626,
    power: 402,
    segment: "suv-e",
    drive: "awd",
    rangeBucket: "over600",
    torque: 620,
    batteryCapacity: 123,
    chargingTime: "35 phút (10%-70%)",
    dimensions: "5.119 x 2.254 x 1.697 mm",
    batteryPurchasePrice: 218_000_000,
    rentBatteryPrice: 3_200_000,
    acceleration: "7.5 giây (0-100 km/h)",
    colors: [
      {
        name: "Jet Black",
        hex: "#111827",
        image: "/images/vinfast/colors/vf9/jet-black.webp",
      },
      {
        name: "Infinity Blanc",
        hex: "#FFFFFF",
        image: "/images/vinfast/colors/vf9/infinity-blanc.webp",
      },
      {
        name: "Zenith Grey",
        hex: "#6B7280",
        image: "/images/vinfast/colors/vf9/zenith-grey.webp",
      },
      {
        name: "Urban Mint",
        hex: "#34D399",
        image: "/images/vinfast/colors/vf9/urban-mint.webp",
      },
      {
        name: "Ivy Green",
        hex: "#065F46",
        image: "/images/vinfast/colors/vf9/ivy-green.webp",
      },
      {
        name: "Desat Silver",
        hex: "#D1D5DB",
        image: "/images/vinfast/colors/vf9/desat-silver.webp",
      },
      {
        name: "Crimson Red",
        hex: "#B91C1C",
        image: "/images/vinfast/colors/vf9/crimson-red.webp",
      },
    ],
    isBestSeller: true,
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
export const PRICE_MAX = 1_700_000_000;

export function formatPrice(value: number) {
  return value.toLocaleString("vi-VN");
}
