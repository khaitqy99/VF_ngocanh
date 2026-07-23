import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/LegalPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPageSeo, getSiteSeo } from "@/lib/cms/seo";
import { buildBreadcrumbSchema, buildWebPageSchema } from "@/lib/seo/local-business";
import { buildStaticPageMetadata } from "@/lib/seo/page-metadata";
import { getStaticPageSeoDefinition, resolveStaticPageSeo } from "@/lib/seo";
import {
  DEALERSHIP_NAME,
  SHOWROOM_ADDRESS,
  SHOWROOM_EMAIL,
  SHOWROOM_PHONE,
} from "@/lib/dealership";

export const revalidate = 86400;

const PAGE_PATH = "/dieu-khoan-su-dung";
const PAGE_TITLE = "Điều khoản sử dụng";
const PAGE_SLUG = "terms";

export async function generateMetadata(): Promise<Metadata> {
  return buildStaticPageMetadata(PAGE_SLUG);
}

export default async function DieuKhoanSuDungPage() {
  const definition = getStaticPageSeoDefinition(PAGE_SLUG)!;
  const [site, seo] = await Promise.all([getSiteSeo(), getPageSeo(PAGE_SLUG)]);
  const resolved = resolveStaticPageSeo(definition, seo, site);
  const breadcrumb = buildBreadcrumbSchema([
    { name: "Trang chủ", path: "/" },
    { name: PAGE_TITLE, path: PAGE_PATH },
  ]);
  const webpage = buildWebPageSchema({
    name: resolved.title,
    description: resolved.description,
    path: PAGE_PATH,
    schemaType: seo?.schemaType ?? "WebPage",
  });

  return (
    <>
      <JsonLd data={breadcrumb} />
      <JsonLd data={webpage} />
      <LegalPage
        title="Điều khoản sử dụng website"
        breadcrumbLabel={PAGE_TITLE}
        updatedAt="01/07/2026"
        intro={
          <p>
            Khi truy cập và sử dụng website vinfast3scamau.com do {DEALERSHIP_NAME} vận hành, bạn
            đồng ý tuân thủ các điều khoản dưới đây. Vui lòng đọc kỹ trước khi sử dụng.
          </p>
        }
        sections={[
          {
            heading: "Phạm vi website",
            body: (
              <p>
                Website cung cấp thông tin về các dòng ô tô điện, xe máy điện, phụ kiện VinFast và
                dịch vụ hậu mãi do {DEALERSHIP_NAME} — đại lý ủy quyền chính thức của VinFast tại Cà
                Mau — phân phối. Website không phải là kênh bán hàng trực tuyến; mọi giao dịch mua
                bán được thực hiện trực tiếp tại showroom hoặc qua kênh chính thức của VinFast.
              </p>
            ),
          },
          {
            heading: "Giá bán và thông số tham khảo",
            body: (
              <p>
                Giá bán, thông số kỹ thuật, chương trình ưu đãi hiển thị trên website chỉ mang tính
                tham khảo và có thể thay đổi theo chính sách của VinFast từng thời điểm mà không cần
                báo trước. Giá chính thức được xác nhận tại thời điểm ký hợp đồng mua bán. Vui lòng
                liên hệ hotline {SHOWROOM_PHONE} để nhận báo giá mới nhất.
              </p>
            ),
          },
          {
            heading: "Sở hữu trí tuệ",
            body: (
              <p>
                Thương hiệu VinFast, logo, hình ảnh sản phẩm thuộc quyền sở hữu của Công ty VinFast.
                Nội dung biên tập, hình ảnh showroom trên website thuộc về {DEALERSHIP_NAME}. Nghiêm
                cấm sao chép, phân phối lại nội dung cho mục đích thương mại khi chưa có sự đồng ý
                bằng văn bản.
              </p>
            ),
          },
          {
            heading: "Trách nhiệm của người dùng",
            body: (
              <ul className="list-disc space-y-1 pl-5">
                <li>Cung cấp thông tin chính xác khi gửi biểu mẫu tư vấn, đặt lịch.</li>
                <li>Không sử dụng website vào mục đích vi phạm pháp luật Việt Nam.</li>
                <li>
                  Không can thiệp, phá hoại hoặc thu thập dữ liệu trái phép từ hệ thống website.
                </li>
              </ul>
            ),
          },
          {
            heading: "Giới hạn trách nhiệm",
            body: (
              <p>
                Chúng tôi nỗ lực đảm bảo thông tin trên website chính xác và cập nhật, tuy nhiên
                không chịu trách nhiệm với các thiệt hại phát sinh từ việc sử dụng thông tin tham
                khảo trên website thay cho tư vấn trực tiếp. Các liên kết đến website bên thứ ba
                (vinfastauto.com, shop.vinfastauto.com...) tuân theo điều khoản riêng của các
                website đó.
              </p>
            ),
          },
          {
            heading: "Thay đổi điều khoản",
            body: (
              <p>
                {DEALERSHIP_NAME} có quyền cập nhật điều khoản sử dụng bất kỳ lúc nào. Phiên bản mới
                nhất luôn được đăng tải tại trang này kèm ngày cập nhật. Việc tiếp tục sử dụng
                website sau khi điều khoản thay đổi đồng nghĩa với việc bạn chấp nhận điều khoản
                mới.
              </p>
            ),
          },
          {
            heading: "Liên hệ",
            body: (
              <ul className="list-disc space-y-1 pl-5">
                <li>{DEALERSHIP_NAME}</li>
                <li>Địa chỉ: {SHOWROOM_ADDRESS}</li>
                <li>Hotline: {SHOWROOM_PHONE}</li>
                <li>Email: {SHOWROOM_EMAIL}</li>
              </ul>
            ),
          },
        ]}
      />
    </>
  );
}
