import { IMAGES } from "@/lib/images";

export type AccessoryCategory =
  | "noi-that"
  | "ngoai-that"
  | "sac-pin"
  | "an-toan"
  | "qua-tang"
  | "phu-kien-chung";

export type VehicleModel = "all" | "vf3" | "vf5" | "vf6" | "vf7" | "vf8" | "vf9" | "vf-e34";

export type AccessoryProduct = {
  id: string;
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
  hero: IMAGES.showroom,
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
  { value: "vf9", label: "VF 9" },
  { value: "vf-e34", label: "VF e34" },
];

export const ACCESSORIES_PER_PAGE = 12;

export const ACCESSORY_PRICE_MIN = 200_000;
export const ACCESSORY_PRICE_MAX = 15_000_000;

export const ACCESSORIES: AccessoryProduct[] = [
  {
    id: "tham-lot-san-all-in-one",
    name: "Thảm lót sàn All-in-One",
    description: "Thảm lót sàn cao cấp chống nước, bám sát sàn xe, dễ vệ sinh.",
    price: 1_490_000,
    image: IMAGES.accMat,
    category: "noi-that",
    vehicles: ["all"],
    badge: "Bán chạy",
    inStock: true,
  },
  {
    id: "tham-lot-san-vf7",
    name: "Thảm lót sàn VF 7",
    description: "Thiết kế riêng cho VF 7, bám sát từng góc cạp, chống trượt hiệu quả.",
    price: 2_500_000,
    image: "/images/cars/vf7.jpg",
    category: "noi-that",
    vehicles: ["vf7"],
    inStock: true,
  },
  {
    id: "tham-lot-san-vf8",
    name: "Thảm lót sàn VF 8",
    description: "Chất liệu cao cấp, chống thấm nước, bảo vệ sàn xe toàn diện.",
    price: 2_800_000,
    image: "/images/cars/vf8.jpg",
    category: "noi-that",
    vehicles: ["vf8"],
    inStock: true,
  },
  {
    id: "tui-da-vo-lang",
    name: "Túi da bọc vô lăng",
    description: "Da cao cấp, cảm giác cầm nắm êm tay, tăng tính thẩm mỹ nội thất.",
    price: 890_000,
    image: IMAGES.accMat,
    category: "noi-that",
    vehicles: ["all"],
    inStock: true,
  },
  {
    id: "goi-tua-dau",
    name: "Gối tựa đầu cao cấp",
    description: "Thiết kế ergonomic, hỗ trợ cổ và đầu trong các chuyến đi dài.",
    price: 650_000,
    image: IMAGES.accMat,
    category: "noi-that",
    vehicles: ["all"],
    inStock: true,
  },
  {
    id: "bo-bao-ve-cop",
    name: "Bộ bảo vệ cốp",
    description: "Lớp bảo vệ chống trầy xước, chống thấm nước cho khoang hành lý.",
    price: 2_200_000,
    image: "/images/cars/vf9.jpg",
    category: "noi-that",
    vehicles: ["vf8", "vf9", "vf7"],
    inStock: true,
  },
  {
    id: "tam-che-nang-cua-so",
    name: "Tấm che nắng cửa sổ",
    description: "Giảm nhiệt cabin, bảo vệ da ghế và hệ thống nội thất khỏi tia UV.",
    price: 1_800_000,
    image: IMAGES.accUmbrella,
    category: "ngoai-that",
    vehicles: ["all"],
    inStock: true,
  },
  {
    id: "bo-phu-nap-capo",
    name: "Bộ phủ nắp capo",
    description: "Bảo vệ nắp capo khỏi trầy xước, chống tia UV và bụi bẩn.",
    price: 3_200_000,
    image: "/images/cars/vf7.jpg",
    category: "ngoai-that",
    vehicles: ["vf7", "vf8", "vf9"],
    inStock: true,
  },
  {
    id: "bo-bao-ve-thanh-cua",
    name: "Bộ bảo vệ thành cửa",
    description: "Chống va đập khi mở cửa tại hẹp, giữ ngoại thất luôn như mới.",
    price: 1_200_000,
    image: "/images/cars/vf5.jpg",
    category: "ngoai-that",
    vehicles: ["all"],
    inStock: true,
  },
  {
    id: "bo-sac-treo-tuong",
    name: "Bộ sạc treo tường 7,4kW",
    description: "Sạc AC tại nhà, công suất 7,4kW, lắp đặt chuyên nghiệp tại showroom.",
    price: 11_900_000,
    image: IMAGES.accCharger,
    category: "sac-pin",
    vehicles: ["all"],
    badge: "Phổ biến",
    inStock: true,
  },
  {
    id: "bo-sac-di-dong",
    name: "Bộ sạc di động",
    description: "Sạc tiện lợi khi di chuyển, tương thích đa dòng xe điện VinFast.",
    price: 5_800_000,
    image: IMAGES.portableCharger,
    category: "sac-pin",
    vehicles: ["all"],
    inStock: true,
  },
  {
    id: "cap-sac-mo-rong",
    name: "Cáp sạc mở rộng 5m",
    description: "Tăng tầm với cáp sạc chính hãng, an toàn và bền bỉ theo thời gian.",
    price: 2_400_000,
    image: IMAGES.portableCharger,
    category: "sac-pin",
    vehicles: ["all"],
    inStock: true,
  },
  {
    id: "camera-hanh-trinh",
    name: "Camera hành trình chính hãng",
    description: "Ghi hình Full HD, tích hợp cảm biến va chạm và ghi hình đêm rõ nét.",
    price: 4_500_000,
    image: "/images/cars/vf8.jpg",
    category: "an-toan",
    vehicles: ["all"],
    badge: "Mới",
    inStock: true,
  },
  {
    id: "cam-bien-lui",
    name: "Cảm biến lùi nâng cấp",
    description: "Hỗ trợ đỗ xe an toàn, cảnh báo vật cản phía sau chính xác.",
    price: 3_600_000,
    image: "/images/cars/vf6.jpg",
    category: "an-toan",
    vehicles: ["vf3", "vf5", "vf6"],
    inStock: true,
  },
  {
    id: "bo-dinh-vi-gps",
    name: "Bộ định vị GPS thông minh",
    description: "Theo dõi vị trí xe, hỗ trợ tìm xe và cảnh báo an ninh 24/7.",
    price: 2_900_000,
    image: "/images/cars/vf7.jpg",
    category: "an-toan",
    vehicles: ["all"],
    inStock: false,
  },
  {
    id: "mo-hinh-vf3",
    name: "Mô hình xe VinFast VF 3",
    description: "Mô hình thu nhỏ tỉ lệ 1:18, chi tiết tinh xảo — quà tặng ý nghĩa.",
    price: 220_000,
    image: IMAGES.accModel,
    category: "qua-tang",
    vehicles: ["vf3"],
    inStock: true,
  },
  {
    id: "mo-hinh-vf8",
    name: "Mô hình xe VinFast VF 8",
    description: "Mô hình thu nhỏ cao cấp, hoàn thiện sơn bóng, kèm đế trưng bày.",
    price: 350_000,
    image: IMAGES.accModel,
    category: "qua-tang",
    vehicles: ["vf8"],
    inStock: true,
  },
  {
    id: "o-che-nang",
    name: "Ô che nắng VinFast",
    description: "Thiết kế gọn nhẹ, logo VinFast tinh tế, tiện mang theo mọi lúc.",
    price: 400_000,
    image: IMAGES.accUmbrella,
    category: "qua-tang",
    vehicles: ["all"],
    inStock: true,
  },
  {
    id: "bo-qua-tang-vinfest",
    name: "Bộ quà tặng VinFast Premium",
    description: "Gồm túi vải, bình giữ nhiệt và sổ tay da — quà tặng khách hàng VIP.",
    price: 780_000,
    image: IMAGES.accUmbrella,
    category: "qua-tang",
    vehicles: ["all"],
    inStock: true,
  },
  {
    id: "bo-ve-sinh-xe",
    name: "Bộ vệ sinh xe điện",
    description: "Chất tẩy rửa chuyên dụng an toàn cho xe điện, khăn microfiber cao cấp.",
    price: 590_000,
    image: IMAGES.community,
    category: "phu-kien-chung",
    vehicles: ["all"],
    inStock: true,
  },
  {
    id: "bo-cong-cu-khan-cap",
    name: "Bộ công cụ khẩn cấp",
    description: "Đèn pin, áo phản quang, dây kéo và bơm lốt — an tâm trên mọi hành trình.",
    price: 1_100_000,
    image: IMAGES.chargingStations,
    category: "phu-kien-chung",
    vehicles: ["all"],
    inStock: true,
  },
  {
    id: "nap-sac-bao-ve",
    name: "Nắp bảo vệ cổng sạc",
    description: "Chống bụi và nước cho cổng sạc, giữ hệ thống sạc luôn ổn định.",
    price: 320_000,
    image: IMAGES.portableCharger,
    category: "phu-kien-chung",
    vehicles: ["all"],
    inStock: true,
  },
  {
    id: "tham-lot-san-vf3",
    name: "Thảm lót sàn VF 3",
    description: "Thiết kế riêng cho VF 3, nhẹ, dễ tháo lắp và vệ sinh.",
    price: 1_290_000,
    image: "/images/cars/vf3.jpg",
    category: "noi-that",
    vehicles: ["vf3"],
    inStock: true,
  },
  {
    id: "tham-lot-san-vf5",
    name: "Thảm lót sàn VF 5",
    description: "Thảm cao su TPE chính hãng, chống trượt và chống mùi hiệu quả.",
    price: 1_590_000,
    image: "/images/cars/vf5.jpg",
    category: "noi-that",
    vehicles: ["vf5"],
    inStock: true,
  },
];

export function getAccessory(id: string) {
  return ACCESSORIES.find((item) => item.id === id);
}

export function getCarDetailAccessories(carId: string) {
  const floorMatByCar: Record<string, string> = {
    vf3: "tham-lot-san-vf3",
    vf5: "tham-lot-san-vf5",
    vf7: "tham-lot-san-vf7",
    vf8: "tham-lot-san-vf8",
  };

  const ids = [
    floorMatByCar[carId] ?? "tham-lot-san-all-in-one",
    "bo-phu-nap-capo",
    "camera-hanh-trinh",
    "bo-sac-di-dong",
  ];

  return ids
    .map((id) => getAccessory(id))
    .filter((product): product is AccessoryProduct => Boolean(product));
}

export function getScooterDetailAccessories() {
  const ids = ["bo-sac-di-dong", "cap-sac-mo-rong", "o-che-nang", "bo-ve-sinh-xe"];

  return ids
    .map((id) => getAccessory(id))
    .filter((product): product is AccessoryProduct => Boolean(product));
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

export function getVehicleLabels(vehicles: VehicleModel[]) {
  if (vehicles.includes("all")) return "Tất cả dòng xe";
  return vehicles.map((v) => VEHICLE_OPTIONS.find((o) => o.value === v)?.label ?? v).join(", ");
}

export { formatPrice } from "@/lib/cars";
