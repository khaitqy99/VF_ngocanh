import type { Json } from "@vinfast3s/supabase";
import {
  DEALERSHIP_NAME,
  SHOWROOM_ADDRESS,
  SHOWROOM_EMAIL,
  SHOWROOM_PHONE,
} from "@/lib/dealership";

export const CMS_LEGAL_TAG = "cms-legal";

export type LegalPageSlug = "privacy" | "terms";

export type LegalSectionContent = {
  heading: string;
  /** HTML đơn giản: <p>, <ul><li>… */
  bodyHtml: string;
};

export type LegalPageContent = {
  title: string;
  breadcrumbLabel: string;
  updatedAt: string;
  introHtml: string;
  sections: LegalSectionContent[];
};

export const LEGAL_PAGE_META: Record<
  LegalPageSlug,
  { label: string; path: string; cmsTitle: string }
> = {
  privacy: {
    label: "Chính sách bảo mật",
    path: "/chinh-sach-bao-mat",
    cmsTitle: "Chính sách bảo mật",
  },
  terms: {
    label: "Điều khoản sử dụng",
    path: "/dieu-khoan-su-dung",
    cmsTitle: "Điều khoản sử dụng",
  },
};

export const LEGAL_PAGE_SLUGS: LegalPageSlug[] = ["privacy", "terms"];

export function isLegalPageSlug(value: string): value is LegalPageSlug {
  return LEGAL_PAGE_SLUGS.includes(value as LegalPageSlug);
}

const DEFAULT_PRIVACY: LegalPageContent = {
  title: "Chính sách bảo mật thông tin",
  breadcrumbLabel: "Chính sách bảo mật",
  updatedAt: "01/07/2026",
  introHtml: `<p>${DEALERSHIP_NAME} (&quot;chúng tôi&quot;) cam kết tôn trọng và bảo vệ thông tin cá nhân của khách hàng khi truy cập website vinfast3scamau.com hoặc sử dụng các dịch vụ tư vấn, đặt lịch lái thử, bảo dưỡng tại showroom. Chính sách này giải thích thông tin nào được thu thập, mục đích sử dụng và cách chúng tôi bảo vệ dữ liệu của bạn.</p>`,
  sections: [
    {
      heading: "Thông tin chúng tôi thu thập",
      bodyHtml: `<p>Chúng tôi chỉ thu thập thông tin do bạn chủ động cung cấp qua các biểu mẫu:</p><ul class="list-disc space-y-1 pl-5"><li>Họ và tên, số điện thoại, địa chỉ email.</li><li>Dòng xe hoặc dịch vụ bạn quan tâm (lái thử, báo giá, bảo dưỡng...).</li><li>Nội dung tin nhắn hoặc yêu cầu tư vấn bạn gửi cho chúng tôi.</li></ul><p>Ngoài ra, website sử dụng Google Analytics để thu thập dữ liệu thống kê ẩn danh (trang được xem, thời gian truy cập, loại thiết bị) nhằm cải thiện trải nghiệm người dùng. Khi bạn gửi form tư vấn, chúng tôi có thể gửi sự kiện chuyển đổi (email/số điện thoại đã được băm) tới Meta qua Conversions API để đo lường quảng cáo.</p>`,
    },
    {
      heading: "Mục đích sử dụng thông tin",
      bodyHtml: `<ul class="list-disc space-y-1 pl-5"><li>Liên hệ tư vấn sản phẩm, báo giá và chương trình ưu đãi theo yêu cầu.</li><li>Sắp xếp lịch lái thử, lịch bảo dưỡng — sửa chữa tại showroom.</li><li>Chăm sóc khách hàng sau bán hàng và hỗ trợ bảo hành.</li><li>Cải thiện chất lượng nội dung và dịch vụ trên website.</li></ul>`,
    },
    {
      heading: "Chia sẻ thông tin",
      bodyHtml: `<p>Chúng tôi không bán, trao đổi hay chuyển giao thông tin cá nhân của bạn cho bên thứ ba vì mục đích thương mại. Thông tin chỉ được chia sẻ với VinFast (nhà sản xuất) khi cần thiết để hoàn tất đơn đặt cọc, kích hoạt bảo hành chính hãng, hoặc khi có yêu cầu hợp pháp từ cơ quan nhà nước có thẩm quyền.</p>`,
    },
    {
      heading: "Lưu trữ và bảo mật",
      bodyHtml: `<p>Dữ liệu được lưu trữ trên hạ tầng máy chủ có mã hóa và kiểm soát truy cập nghiêm ngặt. Chỉ nhân sự được phân quyền của ${DEALERSHIP_NAME} mới có thể truy cập thông tin khách hàng phục vụ công việc tư vấn và chăm sóc khách hàng.</p>`,
    },
    {
      heading: "Quyền của khách hàng",
      bodyHtml: `<p>Bạn có quyền yêu cầu xem, chỉnh sửa hoặc xóa thông tin cá nhân của mình bất kỳ lúc nào bằng cách liên hệ hotline ${SHOWROOM_PHONE} hoặc email ${SHOWROOM_EMAIL}. Chúng tôi sẽ phản hồi yêu cầu trong vòng 7 ngày làm việc.</p>`,
    },
    {
      heading: "Cookie và công nghệ theo dõi",
      bodyHtml: `<p>Website sử dụng cookie kỹ thuật cần thiết cho hoạt động của trang và cookie thống kê của Google Analytics. Bạn có thể tắt cookie trong cài đặt trình duyệt, tuy nhiên một số tính năng của website có thể không hoạt động đầy đủ.</p>`,
    },
    {
      heading: "Thông tin liên hệ",
      bodyHtml: `<p>Mọi thắc mắc về chính sách bảo mật, vui lòng liên hệ:</p><ul class="list-disc space-y-1 pl-5"><li>${DEALERSHIP_NAME}</li><li>Địa chỉ: ${SHOWROOM_ADDRESS}</li><li>Hotline: ${SHOWROOM_PHONE}</li><li>Email: ${SHOWROOM_EMAIL}</li></ul>`,
    },
  ],
};

const DEFAULT_TERMS: LegalPageContent = {
  title: "Điều khoản sử dụng website",
  breadcrumbLabel: "Điều khoản sử dụng",
  updatedAt: "01/07/2026",
  introHtml: `<p>Khi truy cập và sử dụng website vinfast3scamau.com do ${DEALERSHIP_NAME} vận hành, bạn đồng ý tuân thủ các điều khoản dưới đây. Vui lòng đọc kỹ trước khi sử dụng.</p>`,
  sections: [
    {
      heading: "Phạm vi website",
      bodyHtml: `<p>Website cung cấp thông tin về các dòng ô tô điện, xe máy điện, phụ kiện VinFast và dịch vụ hậu mãi do ${DEALERSHIP_NAME} — đại lý ủy quyền chính thức của VinFast tại Cà Mau — phân phối. Website không phải là kênh bán hàng trực tuyến; mọi giao dịch mua bán được thực hiện trực tiếp tại showroom hoặc qua kênh chính thức của VinFast.</p>`,
    },
    {
      heading: "Giá bán và thông số tham khảo",
      bodyHtml: `<p>Giá bán, thông số kỹ thuật, chương trình ưu đãi hiển thị trên website chỉ mang tính tham khảo và có thể thay đổi theo chính sách của VinFast từng thời điểm mà không cần báo trước. Giá chính thức được xác nhận tại thời điểm ký hợp đồng mua bán. Vui lòng liên hệ hotline ${SHOWROOM_PHONE} để nhận báo giá mới nhất.</p>`,
    },
    {
      heading: "Sở hữu trí tuệ",
      bodyHtml: `<p>Thương hiệu VinFast, logo, hình ảnh sản phẩm thuộc quyền sở hữu của Công ty VinFast. Nội dung biên tập, hình ảnh showroom trên website thuộc về ${DEALERSHIP_NAME}. Nghiêm cấm sao chép, phân phối lại nội dung cho mục đích thương mại khi chưa có sự đồng ý bằng văn bản.</p>`,
    },
    {
      heading: "Trách nhiệm của người dùng",
      bodyHtml: `<ul class="list-disc space-y-1 pl-5"><li>Cung cấp thông tin chính xác khi gửi biểu mẫu tư vấn, đặt lịch.</li><li>Không sử dụng website vào mục đích vi phạm pháp luật Việt Nam.</li><li>Không can thiệp, phá hoại hoặc thu thập dữ liệu trái phép từ hệ thống website.</li></ul>`,
    },
    {
      heading: "Giới hạn trách nhiệm",
      bodyHtml: `<p>Chúng tôi nỗ lực đảm bảo thông tin trên website chính xác và cập nhật, tuy nhiên không chịu trách nhiệm với các thiệt hại phát sinh từ việc sử dụng thông tin tham khảo trên website thay cho tư vấn trực tiếp. Các liên kết đến website bên thứ ba (vinfastauto.com, shop.vinfastauto.com...) tuân theo điều khoản riêng của các website đó.</p>`,
    },
    {
      heading: "Thay đổi điều khoản",
      bodyHtml: `<p>${DEALERSHIP_NAME} có quyền cập nhật điều khoản sử dụng bất kỳ lúc nào. Phiên bản mới nhất luôn được đăng tải tại trang này kèm ngày cập nhật. Việc tiếp tục sử dụng website sau khi điều khoản thay đổi đồng nghĩa với việc bạn chấp nhận điều khoản mới.</p>`,
    },
    {
      heading: "Liên hệ",
      bodyHtml: `<ul class="list-disc space-y-1 pl-5"><li>${DEALERSHIP_NAME}</li><li>Địa chỉ: ${SHOWROOM_ADDRESS}</li><li>Hotline: ${SHOWROOM_PHONE}</li><li>Email: ${SHOWROOM_EMAIL}</li></ul>`,
    },
  ],
};

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function defaultLegalPageContent(slug: LegalPageSlug): LegalPageContent {
  return clone(slug === "privacy" ? DEFAULT_PRIVACY : DEFAULT_TERMS);
}

function parseSection(value: unknown): LegalSectionContent | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const row = value as Record<string, unknown>;
  const heading = typeof row.heading === "string" ? row.heading.trim() : "";
  const bodyHtml =
    typeof row.bodyHtml === "string" ? row.bodyHtml : typeof row.body === "string" ? row.body : "";
  if (!heading) return null;
  return { heading, bodyHtml };
}

export function parseLegalPageContent(value: Json | null | undefined): Partial<LegalPageContent> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const row = value as Record<string, unknown>;
  const partial: Partial<LegalPageContent> = {};

  if (typeof row.title === "string") partial.title = row.title.trim();
  if (typeof row.breadcrumbLabel === "string") partial.breadcrumbLabel = row.breadcrumbLabel.trim();
  if (typeof row.updatedAt === "string") partial.updatedAt = row.updatedAt.trim();
  if (typeof row.introHtml === "string") partial.introHtml = row.introHtml;
  if (typeof row.intro === "string") partial.introHtml = row.intro;
  if (Array.isArray(row.sections)) {
    const sections = row.sections
      .map(parseSection)
      .filter((section): section is LegalSectionContent => section !== null);
    if (sections.length) partial.sections = sections;
  }

  return partial;
}

export function mergeLegalPageContent(
  slug: LegalPageSlug,
  input?: Partial<LegalPageContent> | null,
): LegalPageContent {
  const defaults = defaultLegalPageContent(slug);
  if (!input) return defaults;
  return {
    title: input.title?.trim() || defaults.title,
    breadcrumbLabel: input.breadcrumbLabel?.trim() || defaults.breadcrumbLabel,
    updatedAt: input.updatedAt?.trim() || defaults.updatedAt,
    introHtml: input.introHtml ?? defaults.introHtml,
    sections:
      input.sections && input.sections.length > 0
        ? input.sections.map((section) => ({
            heading: section.heading.trim() || "Mục",
            bodyHtml: section.bodyHtml ?? "",
          }))
        : defaults.sections,
  };
}
