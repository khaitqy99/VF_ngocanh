import { IMAGES } from "@/lib/images";
import { HOTLINE } from "@/lib/contact";
import type { AboutPageContent, AfterSalesPageContent } from "@/lib/cms/static-pages";

export const DEFAULT_ABOUT_CONTENT: AboutPageContent = {
  hero: {
    eyebrow: "ĐẠI LÝ ỦY QUYỀN CHÍNH THỨC VINFAST",
    title: "SHOWROOM VINFAST NGỌC ANH CÀ MAU",
    subtitle: "CÀ MAU — ĐỒNG HÀNH CÙNG TƯƠNG LAI XANH",
    description:
      "Tọa lạc tại Cà Mau, VinFast Ngọc Anh Cà Mau tự hào là đại lý ủy quyền 3S chính thức của VinFast Việt Nam. Chúng tôi cam kết mang tới cho khách hàng miền Tây những chiếc ô tô điện, xe máy điện thông minh đỉnh cao đi kèm dịch vụ bảo dưỡng, phụ tùng chính hãng vượt trội.",
    image: IMAGES.aboutShowroomBanner,
    imageAlt: "Showroom VinFast Ngọc Anh Cà Mau",
    imagePosition: "center",
  },
  stats: [
    { value: "5+", label: "Năm kinh nghiệm đồng hành cùng VinFast" },
    { value: "10.000+", label: "Khách hàng tin tưởng lựa chọn sản phẩm" },
    { value: "15.000+", label: "Xe điện thông minh đã bàn giao toàn quốc" },
  ],
  milestones: [
    {
      year: "2019",
      title: "Đặt Nền Móng Khởi Đầu",
      desc: "Thành lập VinFast Ngọc Anh Cà Mau, chính thức bắt tay cùng VinFast trên hành trình khai phá thị trường xe điện Việt Nam đầy tiềm năng.",
      image: IMAGES.aboutShowroomBanner,
    },
    {
      year: "2020",
      title: "Đạt chuẩn Đại Lý Ủy Quyền 3S",
      desc: "Chính thức được VinFast công nhận là đại lý ủy quyền 3S tiêu chuẩn toàn cầu, bao gồm Bán hàng, Dịch vụ và Phụ tùng chính hãng.",
      image: IMAGES.community,
    },
    {
      year: "2021",
      title: "Mở Rộng Hệ Thống Trạm Sạc",
      desc: "Phối hợp cùng hãng đầu tư mở rộng hạ tầng mạng lưới trạm sạc công suất cao quanh khu vực, tăng khả năng tiếp cận cho khách hàng.",
      image: IMAGES.chargingStations,
    },
    {
      year: "2022 - 2023",
      title: "Tăng Trưởng Bứt Phá Doanh Số",
      desc: "Nằm trong TOP các đại lý có doanh số bàn giao xe điện (VF e34, VF 8, VF 9) dẫn đầu miền Bắc, được khách hàng tin yêu tuyệt đối.",
      image: IMAGES.vfMpv7,
    },
    {
      year: "2024 - Nay",
      title: "Vững Bước Kỷ Nguyên Di Chuyển Xanh",
      desc: "Hoàn thiện hệ sinh thái xanh toàn diện gồm xe ô tô điện, xe máy điện, bộ sạc treo tường thông minh tại nhà và giải pháp lưu trữ ESS.",
      image: IMAGES.newsletterBg,
    },
  ],
  whyChoose: [
    {
      title: "Đại lý ủy quyền 3S chính thức của VinFast",
      desc: "Đảm bảo phân phối xe ô tô điện, xe máy điện, phụ tùng và tháp pin lưu trữ ESS chính hãng 100%, bảo hành chuẩn mực toàn cầu.",
    },
    {
      title: "Đội ngũ cố vấn và kỹ thuật viên cao cấp",
      desc: "Nhân viên được đào tạo khắt khe theo giáo trình chuẩn hóa từ chuyên gia công nghệ quốc tế của VinFast, am hiểu kỹ thuật chuyên sâu.",
    },
    {
      title: "Dịch vụ hậu mãi 3S khép kín hoàn hảo",
      desc: "Hệ thống xưởng dịch vụ quy mô lớn, đầu tư cầu nâng và thiết bị chẩn đoán điện tử thế hệ mới, hỗ trợ bảo dưỡng sạc pin khẩn cấp 24/7.",
    },
    {
      title: "Hạ tầng Showroom & Công nghệ hiện đại",
      desc: "Không gian trưng bày đạt chuẩn nhận diện 3S mới của VinFast, nâng cao trải nghiệm mua sắm số hóa trực quan cho khách hàng.",
    },
    {
      title: "Chăm sóc khách hàng trọn vòng đời xe",
      desc: "Cam kết đồng hành trọn vẹn từ khâu lái thử, hỗ trợ thủ tục trả góp 0%, làm hồ sơ đăng ký ra biển đến bảo dưỡng định kỳ lâu dài.",
    },
  ],
  mission: {
    title: "SỨ MỆNH CỐT LÕI",
    content:
      "Xây dựng chiếc cầu nối vững chắc đưa các giải pháp di chuyển xanh, xe điện thông minh thân thiện môi trường của VinFast tới tay mỗi người dân Việt Nam, kiến tạo lối sống văn minh, bền vững.",
  },
  vision: {
    title: "TẦM NHÌN CHIẾN LƯỢC",
    content:
      "Trở thành biểu tượng showroom 3S dẫn đầu cả nước về quy mô doanh số lẫn chỉ số hài lòng của khách hàng (CSI), là địa chỉ tin cậy hàng đầu khi nhắc đến thương hiệu xe điện VinFast.",
  },
  whyChooseImage: IMAGES.aboutShowroomBanner,
  whyChooseImageAlt: "Showroom VinFast Ngọc Anh Cà Mau — không gian trưng bày và tư vấn",
};

export const DEFAULT_AFTER_SALES_CONTENT: AfterSalesPageContent = {
  hero: {
    title: "Chăm sóc xe toàn diện",
    titleAccent: "an tâm bứt phá",
    subtitle:
      "Trung tâm dịch vụ ủy quyền chính thức VinFast tại VinFast Ngọc Anh Cà Mau — máy móc hiện đại, linh kiện chính hãng 100%, bảo hành dài hạn và cứu hộ pin lưu động 24/7.",
    highlights: [
      { value: "63+", label: "Tỉnh thành phủ sóng dịch vụ" },
      { value: "10 năm", label: "Bảo hành ô tô điện" },
      { value: "24/7", label: "Cứu hộ & hỗ trợ khẩn cấp" },
    ],
  },
  services: [
    {
      title: "Bảo dưỡng định kỳ",
      desc: "Quy trình chăm sóc, bảo dưỡng định kỳ khép kín theo tiêu chuẩn hãng, đảm bảo xế yêu luôn vận hành êm ái, kéo dài tuổi thọ hệ thống pin Lithium.",
      items: [
        "Kiểm tra sức khỏe tổng thể pin LFP",
        "Vệ sinh, bảo dưỡng hệ thống phanh tái sinh",
        "Kiểm tra chất lỏng làm mát & bôi trơn pin",
        "Quét lỗi phần mềm bằng máy chuyên dụng",
      ],
    },
    {
      title: "Sửa chữa chính hãng",
      desc: "Xưởng dịch vụ quy mô lớn được trang bị cầu nâng hiện đại, máy cân chỉnh thước lái laser và các thiết bị chẩn đoán điện tử thế hệ mới nhất.",
      items: [
        "Chẩn đoán và xử lý lỗi hệ thống điện tử",
        "Sửa chữa, đồng sơn công nghệ cao sấy hồng ngoại",
        "Cân chỉnh thước lái, hệ thống treo & khung gầm",
        "Sửa chữa, phục hồi hệ thống pin truyền động",
      ],
    },
    {
      title: "Bảo hành xe mới",
      desc: "Chính sách bảo hành dài hạn nhất thị trường Việt Nam dành cho cả xe ô tô và xe máy điện, giúp quý khách hoàn toàn an tâm trên mọi cung đường.",
      items: [
        "Bảo hành ô tô lên tới 10 năm/200.000 km",
        "Bảo hành xe máy điện lên tới 5 năm",
        "Hệ thống cập nhật thông tin bảo hành trực tuyến",
        "Cam kết bảo hành phụ tùng thay thế chính hãng",
      ],
    },
    {
      title: "Cứu hộ 24/7 khẩn cấp",
      desc: "Tổng đài cứu hộ túc trực ngày đêm, sẵn sàng điều động xe kéo sạc pin lưu động hoặc hỗ trợ kỹ thuật tại chỗ bất cứ khi nào quý khách cần.",
      items: [
        "Hotline cứu hộ khẩn cấp 24/7/365",
        "Kéo xe về xưởng dịch vụ gần nhất an toàn",
        "Dịch vụ sạc pin lưu động Mobile Charging",
        "Cung cấp xe thay thế tạm thời cho khách hàng VIP",
      ],
    },
    {
      title: "Phụ tùng chính hãng",
      desc: "Cam kết cung cấp 100% phụ tùng, linh kiện chính hãng VinFast sản xuất dưới sự giám sát nghiêm ngặt của đội ngũ chuyên gia quốc tế.",
      items: [
        "Linh kiện đồng bộ chuẩn kích thước 3D",
        "Chính sách bảo hành riêng cho phụ tùng thay thế",
        "Kho linh kiện dồi dào, sẵn sàng cung ứng ngay",
        "Giá bán niêm yết công khai, minh bạch toàn hệ thống",
      ],
    },
    {
      title: "Cập nhật phần mềm FOTA",
      desc: "Công nghệ cập nhật phần mềm không dây từ xa FOTA liên tục tối ưu hóa thuật toán quản lý pin BMS, hệ thống ADAS và sửa lỗi vận hành.",
      items: [
        "Tự động tải bản cập nhật qua SIM 4G",
        "Nâng cấp tính năng tự lái ADAS liên tục",
        "Tối ưu hóa tầm vận hành, tiết kiệm năng lượng",
        "Hỗ trợ cài đặt trực tiếp tại xưởng dịch vụ",
      ],
    },
  ],
  warranty: [
    {
      title: "Ô tô điện VinFast",
      highlight: "Bảo hành đỉnh cấp 10 năm",
      items: [
        "Bảo hành xe: 10 năm hoặc 200.000 km tùy điều kiện nào đến trước.",
        "Bảo hành pin Lithium: 8 - 10 năm không giới hạn số km (tùy theo model).",
        "Hỗ trợ sạc pin lưu động Mobile Charging tại chỗ 24/7 cực nhanh.",
        "Chính sách cam kết mua lại xe điện đã qua sử dụng sau 5 năm.",
      ],
    },
    {
      title: "Xe máy điện VinFast",
      highlight: "Bảo hành tới 5 năm",
      items: [
        "Bảo hành xe: 3 - 5 năm hoặc 30.000 - 50.000 km tùy dòng xe máy.",
        "Bảo hành pin LFP: 3 năm, hỗ trợ đổi trả nếu dung lượng pin hao hụt dưới 70%.",
        "Bảo dưỡng định kỳ miễn phí công tại toàn bộ xưởng dịch vụ đại lý.",
        "Cứu hộ khẩn cấp xe máy điện trên mọi cung đường nội đô.",
      ],
    },
    {
      title: "Gói thuê pin ưu đãi",
      highlight: "An tâm trọn vòng đời",
      items: [
        "VinFast chịu hoàn toàn rủi ro về chất lượng pin trong suốt quá trình thuê.",
        "Thay thế/Sửa chữa pin hoàn toàn miễn phí khi dung lượng tối đa dưới 70%.",
        "Chi phí thuê pin cực rẻ, tiết kiệm chi phí vận hành hơn so với xe xăng.",
        "Hỗ trợ đổi pin nhanh chóng tại hệ thống xưởng ủy quyền.",
      ],
    },
  ],
  faq: [
    {
      q: "Làm sao để đặt lịch bảo dưỡng trực tuyến nhanh nhất tại VinFast Ngọc Anh Cà Mau?",
      a: `Quý khách có thể sử dụng biểu mẫu Đăng ký đặt hẹn dịch vụ ở ngay phía dưới trang web này, gọi trực tiếp tới Hotline chăm sóc khách hàng ${HOTLINE}, hoặc đặt qua ứng dụng di động VinFast Club. Sau khi gửi thông tin, cố vấn dịch vụ sẽ gọi điện xác nhận lịch hẹn trong 10 phút.`,
    },
    {
      q: "Chi phí bảo dưỡng định kỳ của ô tô điện VinFast khoảng bao nhiêu?",
      a: "Do động cơ điện có cấu tạo tối giản hơn rất nhiều so với xe xăng (không có bugi, lọc dầu, xích cam...), chi phí bảo dưỡng định kỳ của ô tô điện VinFast cực kỳ tiết kiệm, thường chỉ bằng khoảng 30% - 40% so với xe xăng cùng phân khúc. Mức phí bảo dưỡng trung bình ở cấp nhỏ (12.000 km) dao động từ 1 - 2 triệu VNĐ.",
    },
    {
      q: "Hệ thống cứu hộ pin lưu động Mobile Charging hoạt động ra sao?",
      a: `Khi xe của quý khách cạn kiệt pin giữa đường hoặc gặp sự cố nguồn điện, chỉ cần gọi Hotline cứu hộ ${HOTLINE}. Đội cứu hộ Mobile Charging chuyên dụng của chúng tôi sẽ di chuyển tới hiện trường và cung cấp dịch vụ sạc pin nhanh khẩn cấp (cho phép xe chạy tiếp khoảng 30 - 50 km) với mức chi phí vô cùng hỗ trợ.`,
    },
    {
      q: "Sửa chữa xe tại gara ngoài có làm mất hiệu lực bảo hành chính hãng không?",
      a: "Có rủi ro lớn. Theo chính sách của hãng, nếu quý khách thực hiện sửa chữa các bộ phận liên quan đến hệ thống pin, phần mềm, hoặc động cơ tại các cơ sở không được VinFast ủy quyền và gây ra hư hỏng, VinFast có quyền từ chối bảo hành đối với các bộ phận đó. Quý khách nên mang xe đến xưởng 3S của VinFast Ngọc Anh Cà Mau để đảm bảo tối đa quyền lợi.",
    },
    {
      q: "Làm thế nào để tôi kiểm tra thời hạn bảo hành còn lại của xe?",
      a: "Thời hạn bảo hành và lịch sử bảo dưỡng của xe được số hóa và đồng bộ trực tiếp lên hệ thống máy chủ của VinFast. Quý khách có thể tự tra cứu trên ứng dụng VinFast hoặc cung cấp số khung xe (VIN) cho cố vấn dịch vụ tại xưởng của VinFast Ngọc Anh Cà Mau để được hỗ trợ kiểm tra trực tuyến trong 2 phút.",
    },
  ],
};
