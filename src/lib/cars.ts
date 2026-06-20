export type CarSegment = "suv" | "suv-nho" | "suv-c" | "suv-d" | "suv-e" | "mpv";

export type DriveType = "fwd" | "rwd" | "awd";

export type RangeBucket = "under400" | "400-600" | "over600";

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
    subtitle: "SUV điện cao cấp",
    image: "/images/cars/vf9.jpg",
    price: 1_169_000_000,
    seats: 7,
    range: 423,
    power: 402,
    segment: "suv-e",
    drive: "awd",
    rangeBucket: "400-600",
  },
  {
    id: "vf8",
    name: "VF 8",
    subtitle: "SUV điện thông minh",
    image: "/images/cars/vf8.jpg",
    price: 899_000_000,
    seats: 5,
    range: 471,
    power: 402,
    segment: "suv-d",
    drive: "awd",
    rangeBucket: "400-600",
  },
  {
    id: "vf7",
    name: "VF 7",
    subtitle: "SUV cỡ C thời thượng",
    image: "/images/cars/vf7.jpg",
    price: 799_000_000,
    seats: 5,
    range: 496,
    power: 349,
    segment: "suv-c",
    drive: "fwd",
    rangeBucket: "400-600",
  },
  {
    id: "vf6",
    name: "VF 6",
    subtitle: "SUV điện đô thị",
    image: "/images/cars/vf6.jpg",
    price: 689_000_000,
    seats: 5,
    range: 399,
    power: 201,
    segment: "suv-c",
    drive: "fwd",
    rangeBucket: "under400",
  },
  {
    id: "vf5",
    name: "VF 5",
    subtitle: "SUV điện nhỏ gọn",
    image: "/images/cars/vf5.jpg",
    price: 499_000_000,
    seats: 5,
    range: 326,
    power: 134,
    segment: "suv-nho",
    drive: "fwd",
    rangeBucket: "under400",
  },
  {
    id: "vf-e34",
    name: "VF e34",
    subtitle: "Crossover điện",
    image: "/images/cars/vf-e34.jpg",
    price: 590_000_000,
    seats: 5,
    range: 285,
    power: 147,
    segment: "suv",
    drive: "fwd",
    rangeBucket: "under400",
  },
  {
    id: "vf3",
    name: "VF 3",
    subtitle: "Mini SUV điện",
    image: "/images/cars/vf3.jpg",
    price: 269_000_000,
    seats: 4,
    range: 170,
    power: 43,
    segment: "suv-nho",
    drive: "fwd",
    rangeBucket: "under400",
  },
  {
    id: "vf-mpv7",
    name: "VF MPV 7",
    subtitle: "MPV điện đa dụng",
    image: "/images/cars/vf-mpv7.jpg",
    price: 819_000_000,
    seats: 7,
    range: 450,
    power: 201,
    segment: "mpv",
    drive: "fwd",
    rangeBucket: "400-600",
  },
  {
    id: "limo-green",
    name: "Limo Green",
    subtitle: "Xe van điện thương mại",
    image: "/images/cars/limo-green.jpg",
    price: 285_000_000,
    seats: 2,
    range: 150,
    power: 60,
    segment: "suv",
    drive: "fwd",
    rangeBucket: "under400",
  },
  {
    id: "minio-green",
    name: "Minio Green",
    subtitle: "MiniCar điện đô thị",
    image: "/images/cars/minio-green.jpg",
    price: 302_000_000,
    seats: 4,
    range: 210,
    power: 50,
    segment: "suv-nho",
    drive: "fwd",
    rangeBucket: "under400",
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

export const SEAT_OPTIONS = [4, 5, 7] as const;

export const RANGE_OPTIONS: { value: RangeBucket; label: string }[] = [
  { value: "under400", label: "Dưới 400 km" },
  { value: "400-600", label: "400 – 600 km" },
  { value: "over600", label: "Trên 600 km" },
];

export const DRIVE_OPTIONS: { value: DriveType; label: string }[] = [
  { value: "fwd", label: "FWD" },
  { value: "rwd", label: "RWD" },
  { value: "awd", label: "AWD" },
];

export const PRICE_MIN = 200_000_000;
export const PRICE_MAX = 1_500_000_000;

export function formatPrice(value: number) {
  return value.toLocaleString("vi-VN");
}
