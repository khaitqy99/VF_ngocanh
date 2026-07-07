import { IMAGES } from "@/lib/images";
import { HOTLINE } from "@/lib/contact";

export type ChargingProductCategory = "tram-sac" | "sac-tai-nha" | "sac-di-dong" | "phu-kien-sac";

export type ChargingProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: ChargingProductCategory;
  specs: string[];
  badge?: string;
};

export const CHARGING_IMAGES = {
  hero: IMAGES.chargingStations,
  stations: IMAGES.chargingStations,
  scooter: IMAGES.chargingScooter,
  portable: IMAGES.portableCharger,
  home: IMAGES.accCharger,
  promoInstall: IMAGES.showroom,
  promoApp: IMAGES.community,
} as const;

export const NETWORK_STATS = [
  { value: "150.000+", label: "Cổng sạc trên toàn quốc" },
  { value: "63", label: "Tỉnh thành phủ sóng" },
  { value: "2.500+", label: "Trạm sạc công cộng" },
  { value: "24/7", label: "Hỗ trợ kỹ thuật" },
] as const;

export const STATION_TYPES = [
  {
    id: "dc-fast",
    title: "Trạm sạc nhanh DC",
    power: "60 – 250 kW",
    time: "10–30 phút",
    desc: "Sạc siêu nhanh tại trạm công cộng VinFast, phù hợp cho hành trình đường dài và nhu cầu sạc gấp.",
    features: [
      "Sạc 10–70% trong 24 phút",
      "Tương thích mọi dòng ô tô VinFast",
      "Thanh toán qua app VinFast",
    ],
    image: CHARGING_IMAGES.stations,
  },
  {
    id: "ac-public",
    title: "Trạm sạc AC công cộng",
    power: "7 – 22 kW",
    time: "4–8 giờ",
    desc: "Đặt tại trung tâm thương mại, bãi đỗ xe và khu đô thị — tiện lợi sạc trong lúc sinh hoạt.",
    features: [
      "Lắp đặt rộng khắp đô thị",
      "Giá sạc ưu đãi cho khách hàng VinFast",
      "Đặt lịch sạc qua app",
    ],
    image: CHARGING_IMAGES.home,
  },
  {
    id: "home",
    title: "Bộ sạc tại nhà",
    power: "7,4 kW",
    time: "6–10 giờ",
    desc: "Giải pháp sạc tiện lợi tại nhà riêng, căn hộ chung cư hoặc văn phòng — an toàn, bền bỉ.",
    features: [
      "Lắp đặt chuyên nghiệp tại showroom",
      "Bảo hành chính hãng 2 năm",
      "Tích hợp quản lý qua app",
    ],
    image: CHARGING_IMAGES.portable,
  },
] as const;

export const BATTERY_HIGHLIGHTS = [
  {
    title: "Pin LFP an toàn",
    desc: "Công nghệ Lithium Iron Phosphate ổn định nhiệt, giảm thiểu rủi ro cháy nổ so với pin NMC truyền thống.",
  },
  {
    title: "Tuổi thọ cao",
    desc: "Pin VinFast được thiết kế cho hơn 3.000 chu kỳ sạc, bảo hành lên tới 8 năm hoặc 160.000 km.",
  },
  {
    title: "Quãng đường dài",
    desc: "Dung lượng pin tối ưu trên từng dòng xe — từ 210 km (VF 3) đến hơn 550 km (VF 9) trên một lần sạc.",
  },
  {
    title: "Phanh tái sinh thông minh",
    desc: "Hệ thống phanh tái sinh 3 mức thu hồi năng lượng, kéo dài quãng đường và tối ưu tuổi thọ pin.",
  },
] as const;

export const CATEGORY_OPTIONS: { value: ChargingProductCategory; label: string }[] = [
  { value: "tram-sac", label: "Trạm sạc & dịch vụ" },
  { value: "sac-tai-nha", label: "Sạc tại nhà" },
  { value: "sac-di-dong", label: "Sạc di động" },
  { value: "phu-kien-sac", label: "Phụ kiện sạc" },
];

export const CHARGING_PRODUCTS: ChargingProduct[] = [
  {
    id: "bo-sac-treo-tuong",
    name: "Bộ sạc treo tường 7,4kW",
    description: "Sạc AC tại nhà, công suất 7,4kW — lắp đặt chuyên nghiệp, an toàn và tiết kiệm.",
    price: 11_900_000,
    image: IMAGES.accCharger,
    category: "sac-tai-nha",
    specs: ["Công suất 7,4 kW", "Sạc đầy VF 8 trong ~8 giờ", "Bảo hành 2 năm"],
    badge: "Phổ biến",
  },
  {
    id: "bo-sac-di-dong",
    name: "Bộ sạc di động",
    description: "Nhỏ gọn, mang theo mọi hành trình — sạc tại nhà, văn phòng hoặc điểm công cộng.",
    price: 5_800_000,
    image: IMAGES.portableCharger,
    category: "sac-di-dong",
    specs: ["Tương thích đa dòng xe", "Cáp 5m tiêu chuẩn", "Chống quá nhiệt, quá dòng"],
  },
  {
    id: "cap-sac-mo-rong",
    name: "Cáp sạc mở rộng 5m",
    description: "Tăng tầm với cáp sạc chính hãng VinFast — an toàn, bền bỉ theo thời gian.",
    price: 2_400_000,
    image: IMAGES.portableCharger,
    category: "phu-kien-sac",
    specs: ["Chiều dài 5m", "Chuẩn Type 2", "Chống nước IP54"],
  },
  {
    id: "goi-lap-dat-sac-nha",
    name: "Gói lắp đặt sạc tại nhà",
    description:
      "Khảo sát, lắp đặt và bàn giao bộ sạc treo tường — trọn gói tại showroom VinFast Ngọc Anh Cà Mau.",
    price: 3_500_000,
    image: IMAGES.showroom,
    category: "sac-tai-nha",
    specs: ["Khảo sát miễn phí", "Lắp đặt trong 1 ngày", "Hỗ trợ hồ sơ điện lực"],
    badge: "Trọn gói",
  },
  {
    id: "the-sac-vinfast",
    name: "Thẻ sạc VinFast",
    description:
      "Thanh toán nhanh tại mạng lưới trạm sạc VinFast trên toàn quốc — không cần tiền mặt.",
    price: 500_000,
    image: IMAGES.chargingStations,
    category: "tram-sac",
    specs: ["Nạp tiền qua app", "Ưu đãi gói sạc tháng", "Dùng tại 2.500+ trạm"],
  },
  {
    id: "goi-sac-thang",
    name: "Gói sạc tháng ưu đãi",
    description:
      "Gói sạc không giới hạn tại trạm VinFast — tiết kiệm chi phí cho khách hàng thân thiết.",
    price: 990_000,
    image: IMAGES.chargingScooter,
    category: "tram-sac",
    specs: ["Sạc không giới hạn AC", "Giảm 30% phí sạc DC", "Áp dụng 12 tháng"],
    badge: "Tiết kiệm",
  },
];

export const CHARGING_STEPS = [
  {
    step: "01",
    title: "Tìm trạm sạc",
    desc: "Mở app VinFast, chọn mục Trạm sạc để xem bản đồ, trạng thái cổng sạc và giá sạc theo thời gian thực.",
  },
  {
    step: "02",
    title: "Đặt lịch & đến trạm",
    desc: "Đặt lịch sạc trước để đảm bảo cổng trống. Dẫn đường tích hợp giúp bạn đến trạm nhanh nhất.",
  },
  {
    step: "03",
    title: "Cắm sạc & thanh toán",
    desc: "Quét QR hoặc dùng thẻ sạc VinFast. Thanh toán tự động qua ví app — không cần tiền mặt.",
  },
  {
    step: "04",
    title: "Theo dõi tiến trình",
    desc: "Nhận thông báo khi sạc đầy. Theo dõi % pin, thời gian còn lại và lịch sử sạc ngay trên điện thoại.",
  },
] as const;

export const WHY_CHARGING = [
  {
    title: "Mạng lưới rộng khắp",
    desc: "Hơn 150.000 cổng sạc phủ sóng 63 tỉnh thành — luôn có trạm sạc gần bạn trên mọi hành trình.",
  },
  {
    title: "Công nghệ tiên tiến",
    desc: "Trạm sạc DC siêu nhanh, quản lý thông minh và cập nhật phần mềm từ xa — trải nghiệm sạc hiện đại.",
  },
  {
    title: "Giá ưu đãi",
    desc: "Khách hàng VinFast được hưởng giá sạc ưu đãi, gói sạc tháng và chương trình tích điểm hấp dẫn.",
  },
  {
    title: "Hỗ trợ 24/7",
    desc: `Hotline cứu hộ ${HOTLINE} và đội ngũ kỹ thuật sẵn sàng hỗ trợ mọi vấn đề về pin và trạm sạc.`,
  },
] as const;

export const CHARGING_FAQ = [
  {
    q: "Pin xe điện VinFast bảo hành bao lâu?",
    a: "Pin xe điện VinFast được bảo hành lên tới 8 năm hoặc 160.000 km (tùy điều kiện áp dụng theo từng dòng xe). Pin LFP có tuổi thọ cao, hỗ trợ hơn 3.000 chu kỳ sạc.",
  },
  {
    q: "Sạc đầy một lần mất bao lâu?",
    a: "Tùy loại sạc: sạc DC nhanh 10–70% trong khoảng 24–30 phút; sạc AC tại nhà (7,4kW) mất 6–10 giờ; sạc AC công cộng (22kW) mất 4–6 giờ.",
  },
  {
    q: "Có thể sạc xe VinFast tại trạm của hãng khác không?",
    a: "Xe VinFast sử dụng cổng sạc chuẩn quốc tế (Type 2 / CCS2). Bạn có thể sạc tại các trạm tương thích, tuy nhiên mạng lưới VinFast mang lại trải nghiệm và giá ưu đãi tốt nhất.",
  },
  {
    q: "Làm sao tìm trạm sạc gần nhất?",
    a: "Tải app VinFast, vào mục Trạm sạc để xem bản đồ realtime. App hiển thị trạng thái cổng (trống/đang sạc), công suất, giá và hỗ trợ dẫn đường.",
  },
  {
    q: "VinFast Ngọc Anh Cà Mau có hỗ trợ lắp bộ sạc tại nhà không?",
    a: `Có. Showroom VinFast Ngọc Anh Cà Mau cung cấp gói khảo sát, lắp đặt và bàn giao bộ sạc treo tường 7,4kW chính hãng. Liên hệ hotline ${HOTLINE} để đặt lịch.`,
  },
  {
    q: "Sạc pin thường xuyên có làm hỏng pin không?",
    a: "Pin LFP của VinFast được thiết kế cho sạc thường xuyên. Nên sạc khi pin còn 20–30% và tránh để pin xuống dưới 10% thường xuyên để tối ưu tuổi thọ.",
  },
] as const;

export function formatPrice(value: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}
