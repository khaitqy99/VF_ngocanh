export type EnergySolution = {
  id: string;
  title: string;
  subtitle: string;
  capacity: string;
  desc: string;
  features: string[];
  idealFor: string;
};

export type EnergyApplication = {
  title: string;
  desc: string;
  benefits: string[];
};

export const ENERGY_STATS = [
  { value: "10+ năm", label: "Tuổi thọ pin LFP chuẩn công nghiệp" },
  { value: "99.9%", label: "Độ tin cậy hệ thống vận hành" },
  { value: "24/7", label: "Giám sát & hỗ trợ kỹ thuật" },
] as const;

export const ENERGY_SOLUTIONS: EnergySolution[] = [
  {
    id: "residential",
    title: "Hộ gia đình",
    subtitle: "Giải pháp lưu trữ tại nhà",
    capacity: "5 – 20 kWh",
    desc: "Hệ thống pin lưu trữ năng lượng VinFast dành cho hộ gia đình, tích hợp với điện mặt trời và trạm sạc xe điện tại nhà.",
    features: [
      "Dự phòng điện khi mất điện lưới",
      "Tối ưu hóa chi phí điện theo khung giờ",
      "Tích hợp trạm sạc xe điện tại nhà",
      "Quản lý qua ứng dụng VinFast",
    ],
    idealFor: "Biệt thự, nhà phố, hộ gia đình có nhu cầu sạc xe điện",
  },
  {
    id: "commercial",
    title: "Thương mại",
    subtitle: "Văn phòng & trung tâm thương mại",
    capacity: "50 – 500 kWh",
    desc: "Giải pháp lưu trữ năng lượng quy mô trung bình cho tòa nhà văn phòng, trung tâm thương mại và khu dịch vụ.",
    features: [
      "Cắt giảm công suất đỉnh (peak shaving)",
      "Giảm chi phí điện năng hàng tháng",
      "Hỗ trợ trạm sạc công cộng",
      "Báo cáo năng lượng theo thời gian thực",
    ],
    idealFor: "Tòa nhà văn phòng, TTTM, khách sạn, bệnh viện",
  },
  {
    id: "industrial",
    title: "Công nghiệp",
    subtitle: "Nhà máy & khu công nghiệp",
    capacity: "500 kWh – 10+ MWh",
    desc: "Hệ thống lưu trữ năng lượng công suất lớn cho nhà máy sản xuất, khu công nghiệp và trung tâm dữ liệu.",
    features: [
      "Ổn định nguồn điện sản xuất",
      "Tích hợp năng lượng tái tạo quy mô lớn",
      "Hỗ trợ lưới điện thông minh",
      "Giám sát từ xa qua nền tảng V-Green",
    ],
    idealFor: "Nhà máy, khu công nghiệp, trung tâm logistics",
  },
];

export const ENERGY_BENEFITS = [
  {
    title: "Tiết kiệm chi phí",
    desc: "Tối ưu hóa việc sử dụng điện theo khung giờ, giảm hóa đơn tiền điện hàng tháng đáng kể.",
  },
  {
    title: "Năng lượng sạch",
    desc: "Kết hợp với điện mặt trời, giảm phát thải carbon và góp phần bảo vệ môi trường.",
  },
  {
    title: "Dự phòng điện",
    desc: "Đảm bảo nguồn điện liên tục khi mất điện lưới, bảo vệ thiết bị và hoạt động kinh doanh.",
  },
  {
    title: "An toàn & bền vững",
    desc: "Công nghệ pin LFP an toàn, tuổi thọ cao, ít suy giảm dung lượng theo thời gian.",
  },
  {
    title: "Tích hợp hệ sinh thái",
    desc: "Kết nối liền mạch với xe điện VinFast, trạm sạc V-Green và hệ thống quản lý năng lượng.",
  },
  {
    title: "Quản lý thông minh",
    desc: "Giám sát, điều khiển và phân tích năng lượng qua ứng dụng và nền tảng đám mây.",
  },
] as const;

export const ENERGY_APPLICATIONS: EnergyApplication[] = [
  {
    title: "Tích hợp điện mặt trời",
    desc: "Lưu trữ năng lượng mặt trời ban ngày để sử dụng vào buổi tối hoặc khi trời âm u, tối đa hóa hiệu quả đầu tư.",
    benefits: ["Tự cung tự cấp điện", "Giảm phụ thuộc lưới điện", "ROI nhanh hơn"],
  },
  {
    title: "Sạc xe điện tại nhà",
    desc: "Kết hợp pin lưu trữ với trạm sạc tại nhà, sạc xe bằng năng lượng sạch với chi phí thấp nhất.",
    benefits: ["Sạc ngoài giờ cao điểm", "Năng lượng xanh 100%", "Tiện lợi mọi lúc"],
  },
  {
    title: "Trạm sạc công cộng",
    desc: "Bổ sung pin lưu trữ cho trạm sạc V-Green, giảm tải lưới điện và đảm bảo công suất sạc ổn định.",
    benefits: ["Sạc nhanh ổn định", "Giảm chi phí vận hành", "Mở rộng linh hoạt"],
  },
  {
    title: "Dự phòng cho doanh nghiệp",
    desc: "Đảm bảo hoạt động liên tục cho server, máy móc sản xuất và hệ thống an ninh khi mất điện.",
    benefits: ["Không gián đoạn sản xuất", "Bảo vệ thiết bị", "Tuân thủ SLA"],
  },
];

export const ENERGY_SPECS = [
  { label: "Công nghệ pin", value: "LFP (Lithium Iron Phosphate)" },
  { label: "Hiệu suất chuyển đổi", value: "≥ 95%" },
  { label: "Chu kỳ sạc/xả", value: "≥ 6.000 chu kỳ @ 80% DOD" },
  { label: "Tuổi thọ thiết kế", value: "10 – 15 năm" },
  { label: "Nhiệt độ vận hành", value: "-10°C đến +50°C" },
  { label: "Bảo vệ", value: "IP54 – IP65 (tùy model)" },
  { label: "Giám sát", value: "BMS thông minh + IoT cloud" },
  { label: "Bảo hành", value: "Theo chính sách VinFast" },
] as const;

export const INSTALLATION_STEPS = [
  {
    step: "01",
    title: "Tư vấn & khảo sát",
    desc: "Phân tích nhu cầu năng lượng, khảo sát hiện trường và đề xuất giải pháp phù hợp.",
  },
  {
    step: "02",
    title: "Thiết kế hệ thống",
    desc: "Lập phương án kỹ thuật chi tiết, mô phỏng hiệu quả và báo giá minh bạch.",
  },
  {
    step: "03",
    title: "Lắp đặt & vận hành",
    desc: "Thi công theo tiêu chuẩn VinFast, nghiệm thu và đưa hệ thống vào vận hành.",
  },
  {
    step: "04",
    title: "Bảo trì & hỗ trợ",
    desc: "Giám sát từ xa, bảo dưỡng định kỳ và hỗ trợ kỹ thuật 24/7.",
  },
] as const;

export const ENERGY_FAQS = [
  {
    q: "Hệ thống lưu trữ năng lượng VinFast là gì?",
    a: "Đây là giải pháp pin lưu trữ năng lượng sử dụng công nghệ LFP an toàn, cho phép tích lũy điện từ lưới hoặc năng lượng mặt trời để sử dụng khi cần — giảm chi phí, dự phòng điện và tích hợp với hệ sinh thái xe điện VinFast.",
  },
  {
    q: "Tôi cần dung lượng pin bao nhiêu cho gia đình?",
    a: "Thông thường, hộ gia đình cần từ 5–20 kWh tùy mức tiêu thụ và nhu cầu dự phòng. Nếu có trạm sạc xe điện tại nhà, nên cộng thêm 10–15 kWh. VF Ngọc Anh sẽ khảo sát và tư vấn cấu hình phù hợp nhất.",
  },
  {
    q: "Có thể kết hợp với điện mặt trời không?",
    a: "Có. Hệ thống lưu trữ năng lượng VinFast được thiết kế tích hợp liền mạch với tấm pin mặt trời, inverter và trạm sạc xe điện, tạo thành giải pháp năng lượng tự chủ hoàn chỉnh.",
  },
  {
    q: "Pin LFP có an toàn không?",
    a: "Pin LFP (Lithium Iron Phosphate) là công nghệ pin an toàn nhất hiện nay, ít nguy cơ cháy nổ, ổn định nhiệt độ cao và tuổi thọ dài. VinFast sử dụng cùng công nghệ pin cho dòng xe điện của mình.",
  },
  {
    q: "Thời gian lắp đặt mất bao lâu?",
    a: "Hệ thống gia đình thường hoàn thành trong 1–3 ngày. Hệ thống thương mại/công nghiệp từ 1–4 tuần tùy quy mô và điều kiện thi công.",
  },
  {
    q: "Chi phí đầu tư và thời gian hoàn vốn?",
    a: "Chi phí phụ thuộc vào công suất, cấu hình và nhu cầu cụ thể. Thời gian hoàn vốn thường từ 5–8 năm với hộ gia đình và 3–6 năm với doanh nghiệp (khi kết hợp điện mặt trời). Liên hệ VF Ngọc Anh để nhận báo giá chi tiết.",
  },
  {
    q: "VF Ngọc Anh có hỗ trợ bảo hành và bảo trì không?",
    a: "Có. Chúng tôi cung cấp gói bảo hành chính hãng VinFast, giám sát từ xa, bảo dưỡng định kỳ và hỗ trợ kỹ thuật 24/7 trong suốt vòng đời hệ thống.",
  },
] as const;
