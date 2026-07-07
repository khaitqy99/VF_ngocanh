import type { CarDetail } from "./car-details";

/** Ảnh PDP VF 8 All New — host local, tránh hotlink VinFast (403). */
const VF8N = "/images/vinfast/gallery/vf8-all-new";

/** Nội dung PDP VF 8 — chỉnh tay, ưu tiên hơn auto-generate trong vinfast-detail-overrides.ts */
export const VF8_DETAIL_PATCHES: Partial<Record<string, Partial<CarDetail>>> = {
  "vf8-all-new": {
    tagline: "VF 8 Thế Hệ Mới",
    badges: ["Quãng đường 480–500 km (NEDC)", "Công suất 170 kW / 330 Nm"],
    slogan:
      "Khi phong cách trở thành dấu ấn — SUV điện cỡ D thế hệ mới với thiết kế tinh tế, công nghệ thông minh và trải nghiệm lái hiện đại.",
    variants: [
      {
        id: "vf-8-all-new",
        name: "VF 8 All New",
        price: 999_000_000,
      },
    ],
    overview: {
      title: "Khi phong cách trở thành dấu ấn",
      subtitle:
        "VF 8 thế hệ mới định hình phong cách di chuyển xanh hiện đại, nâng chuẩn công nghệ Việt với diện mạo đặc trưng và trải nghiệm tiện nghi toàn diện.",
      bullets: [
        "Công suất 170 kW — mô-men xoắn 330 Nm",
        "Quãng đường 480–500 km (NEDC) mỗi lần sạc đầy",
        "Pin 60,13 kWh — sạc nhanh dưới 30 phút (10%–70%)",
        "Màn hình giải trí 12,9 inch — mâm 19 inch",
      ],
      image: `${VF8N}/PDP-vf8-img-top.webp`,
    },
    exterior: [
      {
        title: "Dải đèn LED chữ V đặc trưng",
        desc: "Ngoại thất VF 8 All New gây ấn tượng với diện mạo xe điện thế hệ mới, dải đèn cánh chim kéo dài tạo chiều sâu và nhận diện thương hiệu mạnh mẽ.",
        image: `${VF8N}/VF8-exterior-product-CE18.webp`,
      },
      {
        title: "Thiết kế khí động học cân bằng",
        desc: "Triết lý “Cân bằng động” với các khối cong mềm mại và đường nét sắc sảo, tối ưu lực cản không khí và hiệu quả vận hành.",
        image: `${VF8N}/VF8-exterior-product-CE1V.webp`,
      },
      {
        title: "Mâm hợp kim 19 inch thể thao",
        desc: "La-zăng 19 inch tạo điểm nhấn thể thao, kết hợp hài hòa với tổng thể SUV cỡ D hiện đại.",
        image: `${VF8N}/VF8-exterior-product-CE17.webp`,
      },
      {
        title: "Cảm biến và camera hỗ trợ quan sát",
        desc: "Hệ thống cảm biến tiên tiến hỗ trợ quan sát và đỗ xe an toàn trong không gian hẹp hay khu vực đông đúc.",
        image: `${VF8N}/VF8-exterior-product-CE22.webp`,
      },
    ],
    interior: [
      {
        title: "Nội thất khoáng đạt — nâng tầm tiện nghi",
        desc: "Ghế ngồi thiết kế ergonomic giúp giảm mỏi, hỗ trợ tuần hoàn tốt hơn trên mọi hành trình dài.",
        image: `${VF8N}/interior-img1.webp`,
      },
      {
        title: "Màn hình giải trí 12,9 inch",
        desc: "Màn hình cảm ứng trung tâm kích thước lớn, giao diện trực quan điều khiển giải trí, điều hòa và tiện ích thông minh.",
        image: `${VF8N}/interior-img2.webp`,
      },
      {
        title: "Không gian cabin rộng rãi 5 chỗ",
        desc: "Thiết kế nội thất tối ưu không gian, vật liệu cao cấp và ánh sáng tự nhiên cho trải nghiệm thoải mái.",
        image: `${VF8N}/interior-img3.webp`,
      },
      {
        title: "Tiện nghi hàng ghế sau",
        desc: "Hàng ghế sau rộng rãi, cốp xe linh hoạt đáp ứng nhu cầu gia đình và du lịch cuối tuần.",
        image: `${VF8N}/interior-img4.webp`,
      },
    ],
    technology: [
      {
        icon: "voice",
        title: "Trợ lý ảo ViVi",
        desc: "Điều khiển bằng giọng nói tiếng Việt tự nhiên — điều hòa, giải trí, dẫn đường và nhiều tiện ích khác.",
      },
      {
        icon: "adas",
        title: "Hệ thống ADAS",
        desc: "Hỗ trợ lái nâng cao với cảnh báo va chạm, giữ làn, camera 360° và các tính năng an toàn chủ động.",
      },
      {
        icon: "app",
        title: "Ứng dụng VinFast",
        desc: "Theo dõi trạng thái xe, điều khiển từ xa, đặt lịch bảo dưỡng và tìm trạm sạc gần nhất.",
      },
      {
        icon: "fota",
        title: "Cập nhật FOTA",
        desc: "Nâng cấp phần mềm từ xa, luôn cập nhật tính năng và trải nghiệm mới nhất.",
      },
    ],
    technologySubtitle:
      "VF 8 All New tích hợp hệ sinh thái thông minh VinFast — kết nối, an toàn và tiện nghi trên mọi hành trình.",
    performance: {
      title: "HIỆU SUẤT VƯỢT TRỘI",
      subtitle: "Vận hành mạnh mẽ 228 hp — quãng đường 480–500 km (NEDC)",
      image: `${VF8N}/vf8-lux.webp`,
      features: [
        {
          title: "Động cơ điện 170 kW",
          desc: "Công suất 228 hp và mô-men xoắn 330 Nm, tăng tốc mượt mà và vận hành êm ái trong đô thị lẫn cao tốc.",
        },
        {
          title: "Quãng đường 480–500 km",
          desc: "Pin LFP 60,13 kWh cho phép di chuyển xa trên một lần sạc đầy theo chuẩn NEDC.",
        },
        {
          title: "Sạc nhanh tiện lợi",
          desc: "Sạc DC nhanh dưới 30 phút (10%–70%), sẵn sàng cho hành trình tiếp theo.",
        },
        {
          title: "Dẫn động AWD",
          desc: "Hai cầu toàn thời gian mang lại độ bám đường tốt và cảm giác lái tự tin.",
        },
      ],
      driveModes: [
        { name: "Eco", desc: "Tiết kiệm năng lượng tối đa, phù hợp di chuyển đô thị" },
        { name: "Normal", desc: "Cân bằng giữa hiệu suất và tiết kiệm pin" },
        { name: "Sport", desc: "Phản hồi ga nhanh, trải nghiệm lái thể thao" },
      ],
    },
    safety: {
      title: "AN TOÀN VƯỢT TRỘI",
      subtitle: "Hệ thống an toàn chủ động và thụ động bảo vệ toàn diện cho mọi hành khách",
      image: `${VF8N}/VF8-exterior-product-CE11.webp`,
      features: [
        {
          title: "Camera 360°",
          desc: "Quan sát toàn cảnh xung quanh xe, hỗ trợ đỗ xe và di chuyển trong không gian chật.",
        },
        {
          title: "Cảnh báo va chạm",
          desc: "Phát hiện và cảnh báo nguy cơ va chạm phía trước, hỗ trợ phanh khẩn cấp.",
        },
        {
          title: "Hỗ trợ giữ làn",
          desc: "Cảnh báo lệch làn và hỗ trợ giữ làn đường khi di chuyển trên cao tốc.",
        },
        {
          title: "Khung xe vững chắc",
          desc: "Kết cấu thân vỏ chịu lực tốt, túi khí đa điểm bảo vệ hành khách toàn diện.",
        },
      ],
      highlights: ["ADAS", "Camera 360°", "ISO 26262"],
    },
    charging: {
      title: "Giải pháp Pin và Trạm sạc",
      desc: "VinFast cung cấp đa dạng giải pháp sạc cho VF 8 All New — sạc nhanh tại trạm V-Green, sạc tại nhà hoặc bộ sạc di động tiện lợi.",
      image: "/images/vinfast/charging/pin-oto.webp",
    },
    quickSpecs: {
      range: 490,
      power: 228,
      torque: 330,
      acceleration: "5.5 giây (0–100 km/h)",
      topSpeed: 200,
      fastCharge: "Dưới 30 phút (10%–70%)",
    },
    colors: [
      {
        id: "color-0",
        name: "Solar Ruby",
        hex: "#DC2626",
        image: `${VF8N}/product-CE1M.webp`,
      },
      {
        id: "color-1",
        name: "Infinity Blanc",
        hex: "#FFFFFF",
        image: `${VF8N}/product-CE18.webp`,
      },
      {
        id: "color-2",
        name: "Jet Black",
        hex: "#111827",
        image: `${VF8N}/product-CE11.webp`,
      },
      {
        id: "color-3",
        name: "Starburst Blue",
        hex: "#2563EB",
        image: `${VF8N}/product-CE17.webp`,
      },
      {
        id: "color-4",
        name: "Mysterioso Purple",
        hex: "#7C3AED",
        image: `${VF8N}/product-CE1V.webp`,
      },
      {
        id: "color-5",
        name: "Vitality Orange",
        hex: "#EA580C",
        image: `${VF8N}/product-1V18.webp`,
      },
    ],
  },
  vf8: {
    tagline: "Sự lựa chọn xứng tầm",
    badges: ["Quãng đường lên tới 471 km", "Công suất 402 hp / 620 Nm"],
    slogan:
      "SUV điện cỡ D với thiết kế cân bằng động, hệ thống ADAS nâng cao và hiệu suất vận hành mạnh mẽ — lựa chọn hàng đầu phân khúc.",
    variants: [
      {
        id: "vf-8-eco",
        name: "VF 8 Eco",
        price: 1_019_000_000,
      },
      {
        id: "vf-8-eco-nang-cap",
        name: "VF 8 Eco - Nâng cấp",
        price: 999_000_000,
      },
      {
        id: "vf-8-plus",
        name: "VF 8 Plus",
        price: 1_199_000_000,
      },
    ],
    overview: {
      title: "SUV điện thông minh hạng D",
      subtitle:
        "VF 8 sở hữu thiết kế hiện đại theo triết lý cân bằng động, công nghệ ADAS tiên tiến và không gian nội thất tiện nghi cao cấp.",
      bullets: [
        "Quãng đường lên tới 471 km mỗi lần sạc đầy",
        "Công suất 402 hp — mô-men xoắn 620 Nm",
        "Tăng tốc 0–100 km/h chỉ 5,5 giây",
        "11 túi khí — ADAS cấp 2",
      ],
      image: "/images/vinfast/gallery/vf8/PDP-vf8-img-top.webp",
    },
    exterior: [
      {
        title: "Thiết kế khí động học",
        desc: "Giảm lực cản không khí, tăng hiệu quả vận hành và mang lại vẻ ngoài hiện đại, mạnh mẽ.",
        image: "/images/vinfast/gallery/vf8/VF8-exterior-product-CE1V.webp",
      },
      {
        title: "Gương chiếu hậu thông minh",
        desc: "Tự động lưu vị trí, tích hợp đèn báo rẽ và cảnh báo điểm mù tăng cường an toàn.",
        image: "/images/vinfast/gallery/vf8/VF8-exterior-product-CE1W.webp",
      },
      {
        title: "Cửa sổ trời toàn cảnh",
        desc: "Trần kính panorama tích hợp rèm điện, điều khiển đóng mở bằng giọng nói.",
        image: "/images/vinfast/gallery/vf8/VF8-exterior-product-CE11.webp",
      },
      {
        title: "Camera và cảm biến 360°",
        desc: "Quan sát toàn cảnh, hỗ trợ đỗ xe và di chuyển an toàn trong không gian hẹp.",
        image: "/images/vinfast/gallery/vf8/VF8-exterior-product-CE22.webp",
      },
    ],
    interior: [
      {
        title: "Ghế da vegan cao cấp",
        desc: "Ghế trước tích hợp sưởi và thông gió, đảm bảo thoải mái suốt mọi mùa.",
        image: "/images/vinfast/gallery/vf8/reserves-VF8-interior-img2.webp",
      },
      {
        title: "Màn hình giải trí thông minh",
        desc: "Màn hình cảm ứng lớn, kết nối VinFast App và trợ lý ảo ViVi 2.0.",
        image: "/images/vinfast/gallery/vf8/reserves-VF8-interior-img1.webp",
      },
      {
        title: "Cửa sổ trời panorama",
        desc: "Không gian cabin sáng, thoáng với trần kính toàn cảnh điều khiển điện.",
        image: "/images/vinfast/gallery/vf8/reserves-VF8-panorama.webp",
      },
      {
        title: "Không gian 5 chỗ rộng rãi",
        desc: "Thiết kế nội thất tối ưu, cốp xe linh hoạt cho gia đình và hành trình dài.",
        image: "/images/vinfast/gallery/vf8/reserves-VF8-interior-img5.webp",
      },
    ],
    technology: [
      {
        icon: "voice",
        title: "Trợ lý ảo ViVi 2.0",
        desc: "AI tạo sinh, điều khiển xe bằng giọng nói tiếng Việt tự nhiên và thông minh hơn.",
      },
      {
        icon: "adas",
        title: "ADAS cấp 2",
        desc: "Hệ thống trợ lái nâng cao với công nghệ và trang thiết bị hiện đại nhất.",
      },
      {
        icon: "screen",
        title: "Màn hình kép thông minh",
        desc: "Màn hình giải trí và cụm đồng hồ kỹ thuật số hiển thị sắc nét, trực quan.",
      },
      {
        icon: "fota",
        title: "Cập nhật FOTA",
        desc: "Nâng cấp phần mềm từ xa, luôn cập nhật tính năng mới.",
      },
    ],
    technologySubtitle:
      "VF 8 mang đến thế giới công nghệ thông minh — từ trợ lý ảo AI đến hệ sinh thái kết nối toàn diện.",
    performance: {
      title: "HIỆU SUẤT VƯỢT TRỘI",
      subtitle: "Quãng đường lên tới 471 km — tăng tốc 0–100 km/h chỉ 5,5 giây",
      image: "/images/vinfast/gallery/vf8/PDP-vf8-img-top.webp",
      features: [
        {
          title: "Công suất 402 hp",
          desc: "Động cơ điện mạnh mẽ với mô-men xoắn 620 Nm, dẫn động AWD hai cầu toàn thời gian.",
        },
        {
          title: "Quãng đường 471 km",
          desc: "Pin 88,3 kWh LFP cho hành trình dài trên một lần sạc đầy.",
        },
        {
          title: "Sạc nhanh 31 phút",
          desc: "Sạc DC từ 10% đến 70% chỉ khoảng 31 phút tại trạm V-Green.",
        },
        {
          title: "3 chế độ lái",
          desc: "Eco, Normal và Sport tùy chỉnh theo phong cách lái của bạn.",
        },
      ],
      driveModes: [
        { name: "Eco", desc: "Tiết kiệm năng lượng tối đa" },
        { name: "Normal", desc: "Cân bằng hiệu suất và tiết kiệm" },
        { name: "Sport", desc: "Tăng tốc mạnh mẽ, phản hồi nhanh" },
      ],
    },
    safety: {
      title: "AN TOÀN VƯỢT TRỘI",
      subtitle: "11 túi khí và hệ thống ADAS bảo vệ toàn diện",
      image: "/images/vinfast/gallery/vf8/VF8-exterior-product-CE18.webp",
      features: [
        {
          title: "11 túi khí",
          desc: "Hệ thống túi khí bao phủ toàn bộ khoang cabin, bảo vệ hành khách đa hướng.",
        },
        {
          title: "ADAS cấp 2",
          desc: "Hỗ trợ lái nâng cao với cảnh báo va chạm, giữ làn và kiểm soát tốc độ thích ứng.",
        },
        {
          title: "Camera 360°",
          desc: "Quan sát toàn cảnh khi di chuyển chậm hoặc đỗ xe.",
        },
        {
          title: "Phanh khẩn cấp tự động",
          desc: "Hỗ trợ phanh khi phát hiện vật cản phía trước.",
        },
      ],
      highlights: ["11 túi khí", "ADAS cấp 2", "ASEAN NCAP"],
    },
    charging: {
      title: "Giải pháp Pin và Trạm sạc",
      desc: "Sạc nhanh tại trạm V-Green, sạc tại nhà qua bộ sạc AC hoặc giải pháp di động — đáp ứng mọi nhu cầu sử dụng VF 8.",
      image: "/images/vinfast/gallery/vf8/VF8-exterior-product-CE1V.webp",
    },
    quickSpecs: {
      range: 471,
      power: 402,
      torque: 620,
      acceleration: "5.5 giây (0–100 km/h)",
      topSpeed: 200,
      fastCharge: "31 phút (10%–70%)",
    },
    colors: [
      {
        id: "color-0",
        name: "Jet Black",
        hex: "#111827",
        image: "/images/vinfast/colors/vf8/jet-black.webp",
      },
      {
        id: "color-1",
        name: "Infinity Blanc",
        hex: "#FFFFFF",
        image: "/images/vinfast/colors/vf8/infinity-blanc.webp",
      },
      {
        id: "color-2",
        name: "Zenith Grey",
        hex: "#6B7280",
        image: "/images/vinfast/colors/vf8/zenith-grey.webp",
      },
      {
        id: "color-3",
        name: "Urban Mint",
        hex: "#34D399",
        image: "/images/vinfast/colors/vf8/urban-mint.webp",
      },
      {
        id: "color-4",
        name: "Ivy Green",
        hex: "#065F46",
      },
      {
        id: "color-5",
        name: "Desat Silver",
        hex: "#D1D5DB",
        image: "/images/vinfast/colors/vf8/desat-silver.webp",
      },
      {
        id: "color-6",
        name: "Crimson Red",
        hex: "#B91C1C",
        image: "/images/vinfast/colors/vf8/crimson-red.webp",
      },
    ],
  },
};
