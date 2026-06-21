import { CARS, type CarModel, formatPrice } from "./cars";

export type CarVariant = {
  id: string;
  name: string;
  price: number;
};

export type CarColor = {
  id: string;
  name: string;
  hex: string;
};

export type CarQuickSpecs = {
  range: number;
  power: number;
  torque: number;
  acceleration: string;
  topSpeed: number;
  fastCharge: string;
};

export type FeatureCard = {
  title: string;
  desc: string;
  image: string;
};

export type TechFeature = {
  icon: "voice" | "fota" | "app" | "adas" | "screen" | "keyless" | "nav" | "drive" | "battery";
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

export type CarDetail = Omit<CarModel, "colors"> & {
  tagline: string;
  badges: string[];
  slogan: string;
  gallery: string[];
  variants: CarVariant[];
  colors: CarColor[];
  quickSpecs: CarQuickSpecs;
  overview: {
    title: string;
    subtitle: string;
    bullets: string[];
    image: string;
  };
  exterior: FeatureCard[];
  interior: FeatureCard[];
  technology: TechFeature[];
  performance: PerformanceSection;
  safety: SafetySection;
  specGroups: SpecGroup[];
  accessories: AccessoryItem[];
  reviews: ReviewsSection;
};

const DEFAULT_COLORS: CarColor[] = [
  { id: "white", name: "Trắng", hex: "#f5f5f5" },
  { id: "black", name: "Đen", hex: "#1a1a1a" },
  { id: "grey", name: "Xám", hex: "#8b939e" },
  { id: "red", name: "Đỏ", hex: "#c41e3a" },
  { id: "blue", name: "Xanh", hex: "#0057ff" },
  { id: "green", name: "Xanh lá", hex: "#2d6a4f" },
];

function buildPerformance(car: CarModel): PerformanceSection {
  return {
    title: "HIỆU SUẤT VƯỢT TRỘI",
    subtitle: `${car.name} mang đến trải nghiệm lái mạnh mẽ, êm ái và tiết kiệm năng lượng`,
    image: car.image,
    features: [
      {
        title: "Động cơ điện mạnh mẽ",
        desc: `Công suất ${car.power} Hp, tăng tốc nhanh và vận hành êm ái trên mọi cung đường.`,
      },
      {
        title: "Quãng đường dài",
        desc: `Pin LFP cho phép di chuyển tới ${car.range} km (WLTP) trên một lần sạc đầy.`,
      },
      {
        title: "Sạc nhanh tiện lợi",
        desc: "Hỗ trợ sạc nhanh DC, sạc 10–70% chỉ trong khoảng 24–25 phút.",
      },
      {
        title: "Phanh tái tạo năng lượng",
        desc: "Hệ thống phanh tái sinh thông minh, tối ưu hiệu suất và kéo dài tuổi thọ pin.",
      },
    ],
    driveModes: [
      { name: "Eco", desc: "Tiết kiệm năng lượng tối đa, phù hợp di chuyển đô thị" },
      { name: "Normal", desc: "Cân bằng giữa hiệu suất và tiết kiệm năng lượng" },
      { name: "Sport", desc: "Tăng tốc nhanh, phản hồi ga nhạy, trải nghiệm lái thể thao" },
    ],
  };
}

function buildSafety(car: CarModel): SafetySection {
  return {
    title: "AN TOÀN VƯỢT TRỘI",
    subtitle: `${car.name} đạt chuẩn an toàn quốc tế với hệ thống bảo vệ toàn diện`,
    image: car.image,
    features: [
      { title: "Khung xe vững chắc", desc: "Khung thép cường lực cao, hấp thụ va chạm hiệu quả." },
      { title: "Túi khí đa điểm", desc: "Hệ thống túi khí bảo vệ hành khách trên toàn xe." },
      { title: "Cảnh báo va chạm", desc: "Phát hiện và cảnh báo nguy cơ va chạm phía trước." },
      { title: "Giữ làn đường", desc: "Hỗ trợ giữ làn và cảnh báo lệch làn tự động." },
      { title: "Camera 360°", desc: "Quan sát toàn cảnh xung quanh xe khi di chuyển chậm." },
      { title: "Phanh tự động khẩn cấp", desc: "Hỗ trợ phanh khẩn cấp khi phát hiện vật cản." },
    ],
    highlights: ["ASEAN NCAP 5 sao", "ADAS cấp 2", "ISO 26262"],
  };
}

function buildSpecGroups(car: CarModel): SpecGroup[] {
  const driveLabel =
    car.drive === "awd" ? "AWD (2 cầu)" : car.drive === "rwd" ? "RWD (Cầu sau)" : "FWD (Cầu trước)";

  return [
    {
      category: "Kích thước",
      items: [
        { label: "Dài x Rộng x Cao (mm)", value: car.dimensions },
        { label: "Khoảng sáng gầm (mm)", value: car.seats >= 7 ? "190" : "180" },
        { label: "Dung tích cốp (lít)", value: car.seats >= 7 ? "450" : "376" },
        { label: "Số chỗ ngồi", value: `${car.seats} chỗ` },
      ],
    },
    {
      category: "Động cơ & Vận hành",
      items: [
        { label: "Công suất tối đa", value: `${car.power} Hp` },
        { label: "Mô-men xoắn cực đại", value: `${car.torque} Nm` },
        { label: "Dẫn động", value: driveLabel },
        { label: "Tăng tốc 0–100 km/h", value: car.acceleration },
        {
          label: "Tốc độ tối đa",
          value: car.power > 300 ? "200 km/h" : car.power > 200 ? "180 km/h" : "160 km/h",
        },
      ],
    },
    {
      category: "Pin & Sạc",
      items: [
        { label: "Loại pin", value: "LFP (Lithium Iron Phosphate)" },
        { label: "Dung lượng pin", value: `${car.batteryCapacity} kWh` },
        { label: "Quãng đường (WLTP)", value: `${car.range} km` },
        { label: "Sạc nhanh DC", value: car.chargingTime },
        { label: "Giá mua pin", value: `${formatPrice(car.batteryPurchasePrice)} VNĐ` },
        { label: "Giá thuê pin", value: `${formatPrice(car.rentBatteryPrice)} VNĐ/tháng` },
      ],
    },
    {
      category: "Nội thất",
      items: [
        { label: "Số chỗ ngồi", value: `${car.seats} chỗ` },
        { label: "Chất liệu ghế", value: "Da cao cấp" },
        { label: "Màn hình giải trí", value: "12.9 inch" },
        { label: "Điều hòa", value: "Tự động 2 vùng" },
        { label: "Âm thanh", value: "8 loa" },
      ],
    },
  ];
}

function buildAccessories(car: CarModel): AccessoryItem[] {
  return [
    { name: "Thảm lót sàn cao cấp", price: 2_500_000, image: car.image },
    { name: "Bộ phủ nắp capo", price: 3_200_000, image: car.image },
    { name: "Camera hành trình", price: 4_500_000, image: car.image },
    { name: "Bộ sạc di động", price: 5_800_000, image: car.image },
    { name: "Tấm che nắng cửa sổ", price: 1_800_000, image: car.image },
    { name: "Bộ bảo vệ cốp", price: 2_200_000, image: car.image },
  ];
}

function buildReviews(car: CarModel): ReviewsSection {
  return {
    averageRating: 4.8,
    totalReviews: 128,
    items: [
      {
        name: "Nguyễn Văn A",
        rating: 5,
        date: "15/03/2026",
        variant: car.name,
        content: `Xe ${car.name} rất đẹp, nội thất sang trọng. Vận hành êm, tiết kiệm điện. Đội ngũ VF Ngọc Anh tư vấn nhiệt tình, giao xe đúng hẹn.`,
      },
      {
        name: "Trần Thị B",
        rating: 5,
        date: "02/03/2026",
        variant: car.name,
        content:
          "Lái thử rất thích, tăng tốc nhanh mà vẫn êm. Hệ thống ADAS hỗ trợ lái rất tiện trong giao thông đô thị.",
      },
      {
        name: "Lê Minh C",
        rating: 4,
        date: "20/02/2026",
        variant: car.name,
        content:
          "Thiết kế ngoại thất ấn tượng, công nghệ hiện đại. Giá hợp lý so với các dòng xe điện cùng phân khúc.",
      },
    ],
  };
}

const DETAIL_OVERRIDES: Partial<Record<string, Partial<CarDetail>>> = {
  vf7: {
    tagline: "VF 7 PLUS",
    badges: ["TOP 1 Xe yêu thích phân khúc C", "ASEAN NCAP 5 SAO"],
    slogan: "Bứt phá giới hạn, kiến tạo tương lai",
    gallery: Array(6).fill("/images/cars/vf7.jpg") as string[],
    variants: [
      { id: "eco", name: "VF 7 Eco", price: 850_000_000 },
      { id: "plus", name: "VF 7 Plus", price: 999_000_000 },
      { id: "plus-panorama", name: "VF 7 Plus Trần kính", price: 1_024_000_000 },
    ],
    quickSpecs: {
      range: 431,
      power: 260,
      torque: 500,
      acceleration: "5.8s",
      topSpeed: 175,
      fastCharge: "10–70% trong 24 phút",
    },
    overview: {
      title: "Triết lý thiết kế VF 7",
      subtitle: "Sự kết hợp hoàn hảo giữa thẩm mỹ và công năng",
      bullets: [
        "Thiết kế ngoại thất mạnh mẽ, khí động học tối ưu",
        "Nội thất rộng rãi với không gian cabin cao cấp",
        "Công nghệ ADAS tiên tiến hỗ trợ lái toàn diện",
        "Hệ thống pin LFP an toàn, quãng đường dài",
      ],
      image: "/images/cars/oto-hero.jpg",
    },
    exterior: [
      {
        title: "Đầu xe",
        desc: "Đèn LED matrix thiết kế chữ V đặc trưng VinFast, tạo dấu ấn mạnh mẽ.",
        image: "/images/cars/vf7.jpg",
      },
      {
        title: "Thân xe",
        desc: "Đường nét góc cạnh, trần kính toàn cảnh mang đến cảm giác thể thao.",
        image: "/images/cars/vf7.jpg",
      },
      {
        title: "Đuôi xe",
        desc: "Đèn hậu LED dải liền mạch, cốp điện thông minh tiện lợi.",
        image: "/images/cars/vf7.jpg",
      },
      {
        title: "Mâm xe",
        desc: "Mâm hợp kim 20 inch thiết kế đa chấu, tăng vẻ ngoài thể thao.",
        image: "/images/cars/vf7.jpg",
      },
    ],
    interior: [
      {
        title: "Buồng lái",
        desc: "Màn hình cảm ứng 12.9 inch, vô lăng đa chức năng cao cấp.",
        image: "/images/cars/vf7.jpg",
      },
      {
        title: "Ghế trước",
        desc: "Ghế da cao cấp, chỉnh điện 8 hướng, sưởi và thông gió.",
        image: "/images/cars/vf7.jpg",
      },
      {
        title: "Ghế sau",
        desc: "Không gian rộng rãi, trần kính toàn cảnh thoáng đãng cho hành khách.",
        image: "/images/cars/vf7.jpg",
      },
      {
        title: "Cốp xe",
        desc: "Dung tích cốp 376 lít, mở rộng lên 1.170 lít khi gập ghế.",
        image: "/images/cars/vf7.jpg",
      },
    ],
    technology: [
      {
        icon: "voice",
        title: "Trợ lý ảo",
        desc: "Điều khiển bằng giọng nói tiếng Việt thông minh",
      },
      {
        icon: "fota",
        title: "Cập nhật FOTA",
        desc: "Nâng cấp phần mềm từ xa, luôn cập nhật tính năng mới",
      },
      {
        icon: "app",
        title: "Kết nối App",
        desc: "Điều khiển xe, theo dõi pin và đặt lịch bảo dưỡng qua app",
      },
      {
        icon: "nav",
        title: "Dẫn đường thông minh",
        desc: "Bản đồ tích hợp, tìm trạm sạc và cập nhật giao thông realtime",
      },
      {
        icon: "drive",
        title: "Chế độ lái",
        desc: "Eco, Normal, Sport — tùy chỉnh trải nghiệm lái theo sở thích",
      },
      {
        icon: "battery",
        title: "Giám sát pin",
        desc: "Theo dõi trạng thái pin, lịch sử sạc và tối ưu tuổi thọ pin",
      },
    ],
    performance: {
      title: "HIỆU SUẤT VƯỢT TRỘI",
      subtitle:
        "VF 7 Plus sở hữu động cơ điện mạnh mẽ, mang đến trải nghiệm lái thể thao và tiết kiệm",
      image: "/images/cars/vf7.jpg",
      features: [
        {
          title: "Động cơ điện 260 kW",
          desc: "Công suất cực đại 260 kW, mô-men xoắn 500 Nm, tăng tốc 0–100 km/h chỉ 5.8 giây.",
        },
        {
          title: "Quãng đường 431 km",
          desc: "Pin LFP dung lượng 87.7 kWh, quãng đường WLTP lên tới 431 km trên một lần sạc.",
        },
        {
          title: "Sạc nhanh 24 phút",
          desc: "Sạc DC nhanh 10–70% chỉ trong 24 phút tại trạm sạc VinFast.",
        },
        {
          title: "Phanh tái tạo năng lượng",
          desc: "Hệ thống phanh tái sinh 3 mức, tối ưu hiệu suất và kéo dài tuổi thọ pin.",
        },
      ],
      driveModes: [
        { name: "Eco", desc: "Tiết kiệm năng lượng tối đa, phù hợp di chuyển đô thị hàng ngày" },
        { name: "Normal", desc: "Cân bằng giữa hiệu suất và tiết kiệm, phù hợp đa dạng địa hình" },
        { name: "Sport", desc: "Tăng tốc nhanh, phản hồi ga nhạy, trải nghiệm lái thể thao" },
      ],
    },
    safety: {
      title: "AN TOÀN VƯỢT TRỘI",
      subtitle: "VF 7 đạt chuẩn ASEAN NCAP 5 sao với hệ thống bảo vệ toàn diện cho mọi hành trình",
      image: "/images/cars/vf7.jpg",
      features: [
        {
          title: "Khung xe vững chắc",
          desc: "Khung thép cường lực cao, hấp thụ va chạm hiệu quả, bảo vệ cabin.",
        },
        { title: "11 túi khí", desc: "Hệ thống túi khí bao phủ toàn bộ khoang hành khách." },
        {
          title: "Cảnh báo va chạm",
          desc: "FCW phát hiện và cảnh báo nguy cơ va chạm phía trước.",
        },
        { title: "Giữ làn tự động", desc: "LKA hỗ trợ giữ làn và cảnh báo lệch làn đường." },
        {
          title: "Camera 360°",
          desc: "Quan sát toàn cảnh xung quanh xe khi di chuyển chậm hoặc đỗ xe.",
        },
        {
          title: "Phanh tự động AEB",
          desc: "Hỗ trợ phanh khẩn cấp tự động khi phát hiện vật cản.",
        },
      ],
      highlights: ["ASEAN NCAP 5 sao", "ADAS cấp 2", "ISO 26262"],
    },
    specGroups: [
      {
        category: "Kích thước",
        items: [
          { label: "Dài x Rộng x Cao (mm)", value: "4.545 x 1.890 x 1.635" },
          { label: "Chiều dài cơ sở (mm)", value: "2.840" },
          { label: "Khoảng sáng gầm (mm)", value: "180" },
          { label: "Dung tích cốp (lít)", value: "376 / 1.170 (gập ghế)" },
          { label: "Bán kính quay vòng (m)", value: "5.8" },
        ],
      },
      {
        category: "Động cơ & Vận hành",
        items: [
          { label: "Công suất tối đa", value: "260 kW (349 Hp)" },
          { label: "Mô-men xoắn cực đại", value: "500 Nm" },
          { label: "Dẫn động", value: "FWD (Cầu trước)" },
          { label: "Tăng tốc 0–100 km/h", value: "5.8 giây" },
          { label: "Tốc độ tối đa", value: "175 km/h" },
        ],
      },
      {
        category: "Pin & Sạc",
        items: [
          { label: "Loại pin", value: "LFP (Lithium Iron Phosphate)" },
          { label: "Dung lượng pin", value: "87.7 kWh" },
          { label: "Quãng đường (WLTP)", value: "431 km" },
          { label: "Sạc nhanh DC", value: "10–70% trong 24 phút (150 kW)" },
          { label: "Sạc AC", value: "0–100% trong 8 giờ (11 kW)" },
        ],
      },
      {
        category: "Nội thất & Tiện nghi",
        items: [
          { label: "Số chỗ ngồi", value: "5 chỗ" },
          { label: "Chất liệu ghế", value: "Da cao cấp, chỉnh điện 8 hướng" },
          { label: "Màn hình giải trí", value: "12.9 inch cảm ứng" },
          { label: "Điều hòa", value: "Tự động 2 vùng độc lập" },
          { label: "Âm thanh", value: "Hệ thống 8 loa cao cấp" },
          { label: "Trần kính", value: "Trần kính toàn cảnh (bản Plus Trần kính)" },
        ],
      },
      {
        category: "An toàn & ADAS",
        items: [
          { label: "Chứng nhận", value: "ASEAN NCAP 5 sao" },
          { label: "Túi khí", value: "11 túi khí" },
          { label: "ADAS", value: "Cấp 2 — 20+ tính năng" },
          { label: "Camera", value: "360° toàn cảnh" },
          { label: "Phanh", value: "ABS, EBD, BA, AEB" },
        ],
      },
    ],
    accessories: [
      { name: "Thảm lót sàn VF 7", price: 2_500_000, image: "/images/cars/vf7.jpg" },
      { name: "Bộ phủ nắp capo", price: 3_200_000, image: "/images/cars/vf7.jpg" },
      { name: "Camera hành trình", price: 4_500_000, image: "/images/cars/vf7.jpg" },
      { name: "Bộ sạc di động", price: 5_800_000, image: "/images/cars/vf7.jpg" },
      { name: "Tấm che nắng cửa sổ", price: 1_800_000, image: "/images/cars/vf7.jpg" },
      { name: "Bộ bảo vệ cốp", price: 2_200_000, image: "/images/cars/vf7.jpg" },
    ],
    reviews: {
      averageRating: 4.9,
      totalReviews: 256,
      items: [
        {
          name: "Nguyễn Hoàng Minh",
          rating: 5,
          date: "18/03/2026",
          variant: "VF 7 Plus",
          content:
            "VF 7 Plus thực sự ấn tượng! Thiết kế đẹp, nội thất sang trọng. Tăng tốc rất nhanh mà vẫn êm ái. Đội ngũ VF Ngọc Anh tư vấn rất nhiệt tình.",
        },
        {
          name: "Trần Thị Lan",
          rating: 5,
          date: "05/03/2026",
          variant: "VF 7 Plus Trần kính",
          content:
            "Trần kính toàn cảnh rất đẹp, không gian xe rộng rãi. Hệ thống ADAS hỗ trợ lái rất tiện trong giao thông Hà Nội. Rất hài lòng!",
        },
        {
          name: "Lê Văn Đức",
          rating: 5,
          date: "22/02/2026",
          variant: "VF 7 Eco",
          content:
            "Chọn VF 7 Eco vì giá hợp lý, quãng đường đủ dùng. Sạc tại trạm VinFast rất nhanh. Xe đẹp, công nghệ hiện đại.",
        },
        {
          name: "Phạm Thu Hà",
          rating: 4,
          date: "10/02/2026",
          variant: "VF 7 Plus",
          content:
            "Xe rất đẹp và tiện nghi. Chỉ mong thêm một số phụ kiện chính hãng. Nhìn chung rất hài lòng với quyết định mua VF 7.",
        },
      ],
    },
  },
};

function buildDefaultDetail(car: CarModel): CarDetail {
  const baseName = car.name.toUpperCase();
  return {
    ...car,
    tagline: baseName,
    badges: ["Bảo hành chính hãng", "ASEAN NCAP 5 SAO"],
    slogan: car.subtitle,
    gallery: Array(6).fill(car.image) as string[],
    variants: [{ id: "standard", name: car.name, price: car.price }],
    colors:
      car.colors.length > 0
        ? car.colors.map((c, i) => ({ id: `color-${i}`, name: c.name, hex: c.hex }))
        : DEFAULT_COLORS,
    quickSpecs: {
      range: car.range,
      power: car.power,
      torque: car.torque,
      acceleration: car.acceleration.replace(/\s*\(.*\)/, ""),
      topSpeed: car.power > 300 ? 200 : car.power > 200 ? 180 : 160,
      fastCharge: car.chargingTime,
    },
    overview: {
      title: `Triết lý thiết kế ${car.name}`,
      subtitle: "Sự kết hợp hoàn hảo giữa thẩm mỹ và công năng",
      bullets: [
        "Thiết kế ngoại thất hiện đại, khí động học tối ưu",
        "Nội thất rộng rãi với không gian cabin tiện nghi",
        "Công nghệ thông minh hỗ trợ lái tiên tiến",
        "Hệ thống pin an toàn, quãng đường dài",
      ],
      image: "/images/cars/oto-hero.jpg",
    },
    exterior: [
      { title: "Đầu xe", desc: "Đèn LED thiết kế đặc trưng VinFast.", image: car.image },
      { title: "Thân xe", desc: "Đường nét thanh lịch, thể thao.", image: car.image },
      { title: "Đuôi xe", desc: "Đèn hậu LED hiện đại.", image: car.image },
      { title: "Mâm xe", desc: "Mâm hợp kim thiết kế đa chấu.", image: car.image },
    ],
    interior: [
      { title: "Buồng lái", desc: "Màn hình cảm ứng thông minh.", image: car.image },
      { title: "Ghế trước", desc: "Ghế da cao cấp, chỉnh điện.", image: car.image },
      { title: "Ghế sau", desc: "Không gian rộng rãi, thoải mái.", image: car.image },
      { title: "Cốp xe", desc: "Dung tích cốp lớn, tiện lợi.", image: car.image },
    ],
    technology: [
      { icon: "voice", title: "Trợ lý ảo", desc: "Điều khiển bằng giọng nói tiếng Việt" },
      { icon: "fota", title: "Cập nhật FOTA", desc: "Nâng cấp phần mềm từ xa" },
      { icon: "app", title: "Kết nối App", desc: "Điều khiển xe qua ứng dụng di động" },
      { icon: "nav", title: "Dẫn đường thông minh", desc: "Bản đồ tích hợp, tìm trạm sạc" },
      { icon: "drive", title: "Chế độ lái", desc: "Eco, Normal, Sport tùy chỉnh" },
      { icon: "battery", title: "Giám sát pin", desc: "Theo dõi trạng thái và lịch sử sạc" },
    ],
    performance: buildPerformance(car),
    safety: buildSafety(car),
    specGroups: buildSpecGroups(car),
    accessories: buildAccessories(car),
    reviews: buildReviews(car),
  };
}

export function getCarById(id: string): CarModel | undefined {
  return CARS.find((c) => c.id === id);
}

export function getCarDetail(id: string): CarDetail | undefined {
  const car = getCarById(id);
  if (!car) return undefined;
  const override = DETAIL_OVERRIDES[id];
  if (!override) return buildDefaultDetail(car);
  return { ...buildDefaultDetail(car), ...override };
}

export function getRelatedCars(id: string, limit = 4): CarModel[] {
  return CARS.filter((c) => c.id !== id).slice(0, limit);
}

export { formatPrice };
