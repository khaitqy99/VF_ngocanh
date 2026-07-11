import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/LegalPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbSchema } from "@/lib/seo/local-business";
import { PRODUCTION_SITE_URL } from "@/lib/seo/types";
import {
  DEALERSHIP_NAME,
  SHOWROOM_ADDRESS,
  SHOWROOM_EMAIL,
  SHOWROOM_PHONE,
} from "@/lib/dealership";

export const revalidate = 86400;

const PAGE_PATH = "/chinh-sach-bao-mat";
const PAGE_TITLE = "Chính sách bảo mật";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description:
    "Chính sách bảo mật thông tin khách hàng của VinFast Ngọc Anh Cà Mau — cách chúng tôi thu thập, sử dụng và bảo vệ dữ liệu cá nhân khi bạn sử dụng website vinfast3scamau.com.",
  alternates: { canonical: PAGE_PATH },
  openGraph: {
    title: PAGE_TITLE,
    description:
      "Cách VinFast Ngọc Anh Cà Mau thu thập, sử dụng và bảo vệ thông tin cá nhân của khách hàng.",
    url: `${PRODUCTION_SITE_URL}${PAGE_PATH}`,
    type: "website",
    locale: "vi_VN",
  },
};

export default function ChinhSachBaoMatPage() {
  const breadcrumb = buildBreadcrumbSchema([
    { name: "Trang chủ", path: "/" },
    { name: PAGE_TITLE, path: PAGE_PATH },
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} />
      <LegalPage
        title="Chính sách bảo mật thông tin"
        breadcrumbLabel={PAGE_TITLE}
        updatedAt="01/07/2026"
        intro={
          <p>
            {DEALERSHIP_NAME} (&quot;chúng tôi&quot;) cam kết tôn trọng và bảo vệ thông tin cá nhân
            của khách hàng khi truy cập website vinfast3scamau.com hoặc sử dụng các dịch vụ tư vấn,
            đặt lịch lái thử, bảo dưỡng tại showroom. Chính sách này giải thích thông tin nào được
            thu thập, mục đích sử dụng và cách chúng tôi bảo vệ dữ liệu của bạn.
          </p>
        }
        sections={[
          {
            heading: "Thông tin chúng tôi thu thập",
            body: (
              <>
                <p>Chúng tôi chỉ thu thập thông tin do bạn chủ động cung cấp qua các biểu mẫu:</p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>Họ và tên, số điện thoại, địa chỉ email.</li>
                  <li>Dòng xe hoặc dịch vụ bạn quan tâm (lái thử, báo giá, bảo dưỡng...).</li>
                  <li>Nội dung tin nhắn hoặc yêu cầu tư vấn bạn gửi cho chúng tôi.</li>
                </ul>
                <p>
                  Ngoài ra, website sử dụng Google Analytics để thu thập dữ liệu thống kê ẩn danh
                  (trang được xem, thời gian truy cập, loại thiết bị) nhằm cải thiện trải nghiệm
                  người dùng.
                </p>
              </>
            ),
          },
          {
            heading: "Mục đích sử dụng thông tin",
            body: (
              <ul className="list-disc space-y-1 pl-5">
                <li>Liên hệ tư vấn sản phẩm, báo giá và chương trình ưu đãi theo yêu cầu.</li>
                <li>Sắp xếp lịch lái thử, lịch bảo dưỡng — sửa chữa tại showroom.</li>
                <li>Chăm sóc khách hàng sau bán hàng và hỗ trợ bảo hành.</li>
                <li>Cải thiện chất lượng nội dung và dịch vụ trên website.</li>
              </ul>
            ),
          },
          {
            heading: "Chia sẻ thông tin",
            body: (
              <p>
                Chúng tôi không bán, trao đổi hay chuyển giao thông tin cá nhân của bạn cho bên thứ
                ba vì mục đích thương mại. Thông tin chỉ được chia sẻ với VinFast (nhà sản xuất) khi
                cần thiết để hoàn tất đơn đặt cọc, kích hoạt bảo hành chính hãng, hoặc khi có yêu
                cầu hợp pháp từ cơ quan nhà nước có thẩm quyền.
              </p>
            ),
          },
          {
            heading: "Lưu trữ và bảo mật",
            body: (
              <p>
                Dữ liệu được lưu trữ trên hạ tầng máy chủ có mã hóa và kiểm soát truy cập nghiêm
                ngặt. Chỉ nhân sự được phân quyền của {DEALERSHIP_NAME} mới có thể truy cập thông
                tin khách hàng phục vụ công việc tư vấn và chăm sóc khách hàng.
              </p>
            ),
          },
          {
            heading: "Quyền của khách hàng",
            body: (
              <p>
                Bạn có quyền yêu cầu xem, chỉnh sửa hoặc xóa thông tin cá nhân của mình bất kỳ lúc
                nào bằng cách liên hệ hotline {SHOWROOM_PHONE} hoặc email {SHOWROOM_EMAIL}. Chúng
                tôi sẽ phản hồi yêu cầu trong vòng 7 ngày làm việc.
              </p>
            ),
          },
          {
            heading: "Cookie và công nghệ theo dõi",
            body: (
              <p>
                Website sử dụng cookie kỹ thuật cần thiết cho hoạt động của trang và cookie thống kê
                của Google Analytics. Bạn có thể tắt cookie trong cài đặt trình duyệt, tuy nhiên một
                số tính năng của website có thể không hoạt động đầy đủ.
              </p>
            ),
          },
          {
            heading: "Thông tin liên hệ",
            body: (
              <>
                <p>Mọi thắc mắc về chính sách bảo mật, vui lòng liên hệ:</p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>{DEALERSHIP_NAME}</li>
                  <li>Địa chỉ: {SHOWROOM_ADDRESS}</li>
                  <li>Hotline: {SHOWROOM_PHONE}</li>
                  <li>Email: {SHOWROOM_EMAIL}</li>
                </ul>
              </>
            ),
          },
        ]}
      />
    </>
  );
}
