import { SCOOTERS, TYPE_OPTIONS, type ScooterModel, formatPrice } from "./scooters";

export type ScooterVariant = {
  id: string;
  name: string;
  price: number;
};

export type ScooterColor = {
  id: string;
  name: string;
  hex: string;
};

export type ScooterQuickSpecs = {
  range: number;
  topSpeed: number;
  motorPower: number;
  trunk: number;
  chargingTime: string;
  weight: number;
};

export type FeatureCard = {
  title: string;
  desc: string;
  image: string;
};

export type TechFeature = {
  icon: "voice" | "fota" | "app" | "gps" | "screen" | "battery" | "drive";
  title: string;
  desc: string;
};

export type PerformanceSection = {
  title: string;
  subtitle: string;
  image: string;
  features: { title: string; desc: string }[];
  driveModes: { name: string; desc: string }[];
};

export type SafetySection = {
  title: string;
  subtitle: string;
  image: string;
  features: { title: string; desc: string }[];
  highlights: string[];
};

export type SpecGroup = {
  category: string;
  items: { label: string; value: string }[];
};

export type AccessoryItem = {
  name: string;
  price: number;
  image: string;
};

export type ReviewItem = {
  name: string;
  rating: number;
  date: string;
  content: string;
  variant?: string;
};

export type ReviewsSection = {
  averageRating: number;
  totalReviews: number;
  items: ReviewItem[];
};

export type ScooterDetail = Omit<ScooterModel, "colors"> & {
  tagline: string;
  badges: string[];
  slogan: string;
  gallery: string[];
  variants: ScooterVariant[];
  colors: ScooterColor[];
  quickSpecs: ScooterQuickSpecs;
  overview: {
    title: string;
    subtitle: string;
    bullets: string[];
    image: string;
  };
  exterior: FeatureCard[];
  design: FeatureCard[];
  technology: TechFeature[];
  performance: PerformanceSection;
  safety: SafetySection;
  specGroups: SpecGroup[];
  accessories: AccessoryItem[];
  reviews: ReviewsSection;
};

function typeLabel(type: ScooterModel["type"]) {
  return TYPE_OPTIONS.find((t) => t.value === type)?.label ?? type;
}

function buildPerformance(scooter: ScooterModel): PerformanceSection {
  return {
    title: "HIỆU SUẤT VƯỢT TRỘI",
    subtitle: `${scooter.name} mang đến trải nghiệm lái mạnh mẽ, êm ái và tiết kiệm năng lượng`,
    image: scooter.image,
    features: [
      {
        title: `Động cơ ${scooter.motorPower}W`,
        desc: `Motor điện công suất ${scooter.motorPower}W, ${scooter.acceleration}, tốc độ tối đa ${scooter.topSpeed} km/h.`,
      },
      {
        title: `Quãng đường ${scooter.range} km`,
        desc: `Pin ${scooter.batteryType} cho phép di chuyển tới ${scooter.range} km trên một lần sạc đầy.`,
      },
      {
        title: "Sạc tiện lợi",
        desc: `Thời gian sạc: ${scooter.chargingTime}. Hỗ trợ sạc tại nhà và trạm sạc VinFast.`,
      },
      {
        title: "Phanh tái tạo năng lượng",
        desc: "Hệ thống phanh tái sinh thông minh, kéo dài quãng đường và tuổi thọ pin.",
      },
    ],
    driveModes: [
      { name: "Eco", desc: "Tiết kiệm pin tối đa, phù hợp di chuyển đô thị hàng ngày" },
      { name: "Sport", desc: "Tăng tốc nhanh, phản hồi ga nhạy, trải nghiệm lái thể thao" },
    ],
  };
}

function buildSafety(scooter: ScooterModel): SafetySection {
  return {
    title: "AN TOÀN & BỀN BỈ",
    subtitle: `${scooter.name} đạt chuẩn an toàn với hệ thống bảo vệ toàn diện cho người lái`,
    image: scooter.image,
    features: [
      {
        title: "Phanh ABS/đĩa",
        desc: "Hệ thống phanh đĩa cao cấp, an toàn trên mọi điều kiện đường.",
      },
      {
        title: "Đèn full LED",
        desc: "Chiếu sáng mạnh, tăng tầm nhìn ban đêm và được nhận diện rõ ràng.",
      },
      {
        title: "Chống nước IP67",
        desc: "Khung xe và pin đạt chuẩn chống nước, tự tin di chuyển khi trời mưa.",
      },
      {
        title: "Khóa thông minh",
        desc: "Khóa từ xa, chống trộm qua định vị GPS trên app VinFast Scooter.",
      },
      {
        title: "Cảnh báo va chạm",
        desc: "Còi và đèn cảnh báo hỗ trợ an toàn khi di chuyển trong giao thông.",
      },
      {
        title: "Khung thép cứng",
        desc: "Khung xe vững chắc, hấp thụ va chạm hiệu quả, bảo vệ người lái.",
      },
    ],
    highlights: ["IP67 chống nước", "Phanh ABS", "GPS chống trộm"],
  };
}

function buildSpecGroups(scooter: ScooterModel): SpecGroup[] {
  return [
    {
      category: "Kích thước & Trọng lượng",
      items: [
        { label: "Dài x Rộng x Cao (mm)", value: scooter.dimensions },
        { label: "Trọng lượng xe", value: `${scooter.weight} kg` },
        {
          label: "Dung tích cốp",
          value: scooter.trunk > 0 ? `${scooter.trunk} lít` : "Móc treo đồ",
        },
        { label: "Phân loại", value: typeLabel(scooter.type) },
      ],
    },
    {
      category: "Động cơ & Vận hành",
      items: [
        { label: "Công suất motor", value: `${scooter.motorPower} W` },
        { label: "Tốc độ tối đa", value: `${scooter.topSpeed} km/h` },
        { label: "Tăng tốc", value: scooter.acceleration },
        { label: "Quãng đường (1 lần sạc)", value: `${scooter.range} km` },
      ],
    },
    {
      category: "Pin & Sạc",
      items: [
        { label: "Loại pin", value: scooter.batteryType },
        { label: "Thời gian sạc", value: scooter.chargingTime },
        { label: "Giá mua pin", value: `${formatPrice(scooter.batteryPurchasePrice)} VNĐ` },
        { label: "Giá thuê pin", value: `${formatPrice(scooter.rentBatteryPrice)} VNĐ/tháng` },
      ],
    },
    {
      category: "Giá bán",
      items: [
        { label: "Giá xe (chưa pin)", value: `${formatPrice(scooter.price)} VNĐ` },
        {
          label: "Giá mua kèm pin",
          value: `${formatPrice(scooter.price + scooter.batteryPurchasePrice)} VNĐ`,
        },
      ],
    },
  ];
}

function buildAccessories(scooter: ScooterModel): AccessoryItem[] {
  return [
    { name: "Mũ bảo hiểm VinFast", price: 450_000, image: scooter.image },
    { name: "Áo mưa cao cấp", price: 350_000, image: scooter.image },
    { name: "Túi treo cốp", price: 280_000, image: scooter.image },
    { name: "Khung giữ điện thoại", price: 180_000, image: scooter.image },
    { name: "Bộ sạc di động", price: 890_000, image: scooter.image },
    { name: "Thảm lót chân", price: 220_000, image: scooter.image },
  ];
}

function buildReviews(scooter: ScooterModel): ReviewsSection {
  return {
    averageRating: 4.7,
    totalReviews: 86,
    items: [
      {
        name: "Nguyễn Minh Tuấn",
        rating: 5,
        date: "12/03/2026",
        variant: scooter.name,
        content: `${scooter.name} chạy rất êm, tiết kiệm điện. Pin đủ dùng cả ngày đi làm. Đội ngũ VF Ngọc Anh tư vấn nhiệt tình.`,
      },
      {
        name: "Trần Thị Hoa",
        rating: 5,
        date: "28/02/2026",
        variant: scooter.name,
        content:
          "Thiết kế đẹp, app kết nối tiện lợi. Sạc tại nhà qua đêm là đủ dùng. Rất hài lòng với quyết định chuyển sang xe điện.",
      },
      {
        name: "Lê Văn Phúc",
        rating: 4,
        date: "15/02/2026",
        variant: scooter.name,
        content:
          "Xe mạnh, tăng tốc nhanh. Giá hợp lý so với xe xăng cùng phân khúc. Chỉ mong thêm cốp rộng hơn một chút.",
      },
    ],
  };
}

function buildDefaultDetail(scooter: ScooterModel): ScooterDetail {
  return {
    ...scooter,
    tagline: scooter.name.toUpperCase(),
    badges: ["Bảo hành chính hãng", "Pin LFP an toàn"],
    slogan: scooter.subtitle,
    gallery: Array(6).fill(scooter.image) as string[],
    variants: [{ id: "standard", name: scooter.name, price: scooter.price }],
    colors: scooter.colors.map((c, i) => ({ id: `color-${i}`, name: c.name, hex: c.hex })),
    quickSpecs: {
      range: scooter.range,
      topSpeed: scooter.topSpeed,
      motorPower: scooter.motorPower,
      trunk: scooter.trunk,
      chargingTime: scooter.chargingTime,
      weight: scooter.weight,
    },
    overview: {
      title: `Triết lý thiết kế ${scooter.name}`,
      subtitle: "Sự kết hợp hoàn hảo giữa thẩm mỹ, công nghệ và tiết kiệm",
      bullets: [
        "Thiết kế hiện đại, trẻ trung phù hợp đô thị",
        "Động cơ điện mạnh mẽ, vận hành êm ái không tiếng ồn",
        "Kết nối thông minh qua app VinFast Scooter",
        `Pin ${scooter.batteryType} an toàn, quãng đường ${scooter.range} km`,
      ],
      image: "/images/charging-scooter.jpg",
    },
    exterior: [
      {
        title: "Đầu xe",
        desc: "Đèn LED full hiện đại, thiết kế đặc trưng VinFast.",
        image: scooter.image,
      },
      { title: "Thân xe", desc: "Đường nét thanh lịch, màu sắc đa dạng.", image: scooter.image },
      { title: "Đuôi xe", desc: "Đèn hậu LED sắc nét, tăng độ nhận diện.", image: scooter.image },
      { title: "Bánh xe", desc: "Lốp chống trượt, vành hợp kim bền bỉ.", image: scooter.image },
    ],
    design: [
      {
        title: "Yên xe",
        desc: "Yên xe êm ái, thiết kế ergonomic cho hành trình dài.",
        image: scooter.image,
      },
      {
        title: "Cốp xe",
        desc:
          scooter.trunk > 0
            ? `Cốp ${scooter.trunk}L rộng rãi, đựng mũ bảo hiểm.`
            : "Móc treo tiện lợi cho túi xách.",
        image: scooter.image,
      },
      {
        title: "Bảng điện tử",
        desc: "Màn hình TFT hiển thị tốc độ, pin, chế độ lái.",
        image: scooter.image,
      },
      {
        title: "Tay ga",
        desc: "Tay ga điện tử mượt mà, phanh tái sinh tích hợp.",
        image: scooter.image,
      },
    ],
    technology: [
      {
        icon: "app",
        title: "App VinFast Scooter",
        desc: "Theo dõi pin, định vị GPS chống trộm, khóa xe từ xa",
      },
      {
        icon: "fota",
        title: "Cập nhật FOTA",
        desc: "Nâng cấp phần mềm từ xa, luôn cập nhật tính năng mới",
      },
      {
        icon: "gps",
        title: "Định vị GPS",
        desc: "Theo dõi vị trí xe realtime, cảnh báo rung động bất thường",
      },
      {
        icon: "battery",
        title: "Giám sát pin",
        desc: "Theo dõi trạng thái pin, lịch sử sạc và tuổi thọ pin",
      },
      {
        icon: "drive",
        title: "Chế độ lái",
        desc: "Eco tiết kiệm, Sport mạnh mẽ — tùy chỉnh theo sở thích",
      },
      {
        icon: "screen",
        title: "Màn hình TFT",
        desc: "Hiển thị thông số rõ ràng, hỗ trợ kết nối smartphone",
      },
    ],
    performance: buildPerformance(scooter),
    safety: buildSafety(scooter),
    specGroups: buildSpecGroups(scooter),
    accessories: buildAccessories(scooter),
    reviews: buildReviews(scooter),
  };
}

export function getScooterById(id: string): ScooterModel | undefined {
  return SCOOTERS.find((s) => s.id === id);
}

export function getScooterDetail(id: string): ScooterDetail | undefined {
  const scooter = getScooterById(id);
  if (!scooter) return undefined;
  return buildDefaultDetail(scooter);
}

export function getRelatedScooters(id: string, limit = 4) {
  return SCOOTERS.filter((s) => s.id !== id).slice(0, limit);
}

export { formatPrice };
