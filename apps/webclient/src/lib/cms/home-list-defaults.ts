import type { FaqItem } from "@/lib/faq";
import {
  SHOWROOM_ADDRESS,
  SHOWROOM_EMAIL,
  SHOWROOM_MAP_EMBED,
  SHOWROOM_MAP_URL,
  SHOWROOM_OPENING,
  SHOWROOM_PHONE,
} from "@/lib/dealership";
import { IMAGES } from "@/lib/images";

import type {
  HomeChargingTile,
  HomeLinkCard,
  HomeShowroomLocation,
  HomeSpecItem,
} from "./home-content";

export const DEFAULT_CHARGING_TILE: HomeChargingTile = {
  img: IMAGES.portableCharger,
  title: "Tiêu đề mới",
  desc: "Mô tả ngắn về pin & trạm sạc.",
  href: "/pin-va-tram-sac",
  theme: "dark",
};

export const DEFAULT_SHOWROOM_CARD: HomeLinkCard = {
  img: IMAGES.showroom,
  title: "Tiêu đề thẻ",
  cta: "Tìm hiểu thêm",
  href: "/",
  external: false,
};

export const DEFAULT_FAQ_ITEM: FaqItem = {
  question: "Câu hỏi mới",
  answer: "Nhập câu trả lời tại đây.",
};

export const DEFAULT_WARRANTY_SPEC: HomeSpecItem = {
  value: "—",
  label: "Nhãn thông số",
};

export const DEFAULT_BRAND_POINT = "Điểm nổi bật mới";

export function defaultHomeShowroomLocation(): HomeShowroomLocation {
  return {
    eyebrow: "Liên hệ & địa chỉ",
    title: "Ghé thăm showroom tại Cà Mau",
    description: "Đại lý VinFast 3S Cà Mau — tư vấn ô tô và xe máy điện chính hãng.",
    address: SHOWROOM_ADDRESS,
    phone: SHOWROOM_PHONE,
    email: SHOWROOM_EMAIL,
    openingOpens: SHOWROOM_OPENING.opens,
    openingCloses: SHOWROOM_OPENING.closes,
    mapUrl: SHOWROOM_MAP_URL,
    mapEmbed: SHOWROOM_MAP_EMBED,
  };
}
