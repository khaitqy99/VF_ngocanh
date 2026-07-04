"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DEALERSHIP_FAQ } from "@/lib/faq";

export default function FaqSection() {
  return (
    <section className="section-y bg-slate-50" aria-labelledby="faq-heading">
      <div className="container-vf">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-brand">Hỏi đáp</p>
          <h2
            id="faq-heading"
            className="mt-2 text-2xl font-black tracking-tight text-brand-dark sm:text-3xl"
          >
            Câu hỏi thường gặp về VinFast Cà Mau
          </h2>
          <p className="mt-3 text-sm font-medium text-slate-500">
            Thông tin nhanh về showroom, sản phẩm, trả góp và dịch vụ hậu mãi tại Cà Mau.
          </p>
        </div>

        <Accordion
          type="single"
          collapsible
          className="mx-auto mt-10 max-w-3xl rounded-2xl border border-slate-200 bg-white px-5 shadow-soft"
        >
          {DEALERSHIP_FAQ.map((item, index) => (
            <AccordionItem key={item.question} value={`faq-${index}`}>
              <AccordionTrigger className="text-left text-sm font-bold text-brand-dark hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-slate-600">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
