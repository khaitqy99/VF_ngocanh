import type { NewsArticle } from "@/lib/cms/news-types";

const baseFields = {
  bodyFormat: "plain" as const,
  isFeatured: false,
  seo: {},
  relatedProducts: [],
  authorId: null,
  authorName: "VinFast Ngọc Anh Cà Mau",
};

export const MOCK_NEWS: NewsArticle[] = [
  {
    id: "mock-news-1",
    slug: "uu-dai-vf3-thang-7",
    title: "Ưu đãi VF 3 tháng 7 — Giảm đến 50 triệu tại Cà Mau",
    excerpt:
      "VinFast Ngọc Anh Cà Mau triển khai chương trình ưu đãi đặc biệt cho VF 3 — hỗ trợ trả góp lãi suất thấp và quà tặng phụ kiện.",
    body: `VinFast Ngọc Anh Cà Mau chính thức mở chương trình ưu đãi VF 3 dành cho khách hàng tại Cà Mau và các tỉnh lân cận trong tháng 7.

Khách hàng đặt cọc VF 3 tại showroom sẽ nhận hỗ trợ tài chính lãi suất ưu đãi, miễn phí lăn bánh theo chính sách VinFast và gói phụ kiện chào xe trị giá hấp dẫn.

Đội ngũ tư vấn bán hàng sẵn sàng hỗ trợ lái thử miễn phí và dự toán chi phí lăn bánh chi tiết theo từng tỉnh thành đăng ký biển số.

Liên hệ hotline 0707 53 6666 hoặc ghé showroom Số 111 Lý Thường Kiệt, Cà Mau để nhận báo giá mới nhất.`,
    category: "promotion",
    coverImageUrl: "/images/cars/oto-hero.webp",
    status: "published",
    publishedAt: "2026-07-01T08:00:00.000Z",
    createdAt: "2026-07-01T08:00:00.000Z",
    updatedAt: "2026-07-01T08:00:00.000Z",
    ...baseFields,
    isFeatured: true,
    relatedProducts: [{ type: "car", id: "vf3" }],
  },
  {
    id: "mock-news-2",
    slug: "lai-thu-vf8-all-new",
    title: "Trải nghiệm VF 8 ALL NEW — Lái thử miễn phí tại showroom",
    excerpt:
      "Cơ hội trải nghiệm SUV điện cỡ E mới nhất của VinFast cùng đội ngũ tư vấn chuyên nghiệp tại Cà Mau.",
    body: `VF 8 ALL NEW mang đến thiết kế mới, công nghệ ADAS nâng cấp và trải nghiệm lái êm ái hơn.

VinFast Ngọc Anh Cà Mau mở đăng ký lái thử miễn phí từ thứ 2 đến Chủ nhật, khung giờ linh hoạt theo lịch hẹn của khách hàng.

Sau buổi lái thử, khách hàng được tư vấn phương án trả góp và dự toán chi phí sở hữu xe điện toàn diện.`,
    category: "event",
    coverImageUrl: "/images/vinfast/gallery/vf8-all-new/vf8-all-new-hero.webp",
    status: "published",
    publishedAt: "2026-06-20T08:00:00.000Z",
    createdAt: "2026-06-20T08:00:00.000Z",
    updatedAt: "2026-06-20T08:00:00.000Z",
    ...baseFields,
    relatedProducts: [{ type: "car", id: "vf8-all-new" }],
  },
  {
    id: "mock-news-3",
    slug: "dich-vu-hau-mai-24-7",
    title: "Dịch vụ hậu mãi 24/7 — Cứu hộ xe điện VinFast tại Cà Mau",
    excerpt:
      "Hotline cứu hộ 0707 54 6666 hỗ trợ khách hàng VinFast trên địa bàn Cà Mau và vùng lân cận.",
    body: `Xưởng dịch vụ VinFast Ngọc Anh Cà Mau vận hành theo tiêu chuẩn 3S với đội ngũ kỹ thuật viên được đào tạo chính hãng.

Khách hàng có thể đặt lịch bảo dưỡng định kỳ, sửa chữa và nhận tư vấn chính sách bảo hành pin, xe điện trọn đời theo quy định VinFast.

Dịch vụ cứu hộ 24/7 sẵn sàng hỗ trợ khi xe gặp sự cố trên đường.`,
    category: "after-sales",
    coverImageUrl: "/images/after-sales/hero.webp",
    status: "published",
    publishedAt: "2026-06-10T08:00:00.000Z",
    createdAt: "2026-06-10T08:00:00.000Z",
    updatedAt: "2026-06-10T08:00:00.000Z",
    ...baseFields,
  },
];
