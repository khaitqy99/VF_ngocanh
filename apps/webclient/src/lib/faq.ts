import {
  SCHEMA_BUSINESS_NAME,
  SHOWROOM_ADDRESS,
  SHOWROOM_OPENING,
  SHOWROOM_PHONE,
} from "@/lib/dealership";

export type FaqItem = {
  question: string;
  answer: string;
};

export const DEALERSHIP_FAQ: FaqItem[] = [
  {
    question: "Đại lý VinFast ở Cà Mau ở đâu?",
    answer: `${SCHEMA_BUSINESS_NAME} tại ${SHOWROOM_ADDRESS}. Anh/chị có thể ghé trực tiếp showroom hoặc gọi hotline ${SHOWROOM_PHONE} để được hướng dẫn.`,
  },
  {
    question: "Showroom VinFast Ngọc Anh Cà Mau mở cửa giờ nào?",
    answer: `Showroom mở cửa hàng ngày từ ${SHOWROOM_OPENING.opens} đến ${SHOWROOM_OPENING.closes}, kể cả cuối tuần và ngày lễ.`,
  },
  {
    question: "VinFast Ngọc Anh Cà Mau có bán những dòng xe nào?",
    answer:
      "Chúng tôi phân phối đầy đủ ô tô điện VinFast (VF 3, VF 5, VF 6, VF 7, VF 8, VF 9…), xe máy điện (Klara, Evo, Feliz, Vento…) và phụ kiện chính hãng.",
  },
  {
    question: "Có hỗ trợ trả góp khi mua xe VinFast tại Cà Mau không?",
    answer:
      "Có. Đội ngũ tư vấn tài chính hỗ trợ trả góp qua ngân hàng đối tác với thủ tục nhanh, phù hợp ô tô điện và xe máy điện VinFast.",
  },
  {
    question: "Có dịch vụ bảo dưỡng, sửa chữa VinFast tại Cà Mau không?",
    answer:
      "Có xưởng dịch vụ hậu mãi chính hãng tại Cà Mau — bảo dưỡng định kỳ, sửa chữa, thay phụ tùng và cứu hộ xe điện theo tiêu chuẩn VinFast.",
  },
  {
    question: "Hotline tư vấn mua xe VinFast Ngọc Anh Cà Mau là số nào?",
    answer: `Hotline tư vấn bán hàng: ${SHOWROOM_PHONE}. Hotline cứu hộ dịch vụ: 0707 54 6666.`,
  },
];
