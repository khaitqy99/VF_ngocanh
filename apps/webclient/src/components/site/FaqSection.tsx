"use client";

import { DEALERSHIP_FAQ } from "@/lib/faq";

import { FaqBlock } from "@/components/shared/FaqBlock";

export default function FaqSection() {
  return (
    <FaqBlock
      items={DEALERSHIP_FAQ.map(({ question, answer }) => ({ question, answer }))}
      eyebrow="Hỏi đáp"
      title="Câu hỏi thường gặp về VinFast Cà Mau"
      description="Thông tin nhanh về showroom, sản phẩm, trả góp và dịch vụ hậu mãi tại Cà Mau."
    />
  );
}
