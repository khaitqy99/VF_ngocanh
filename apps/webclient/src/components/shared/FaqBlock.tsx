"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FadeIn } from "@/components/motion";

import { SectionHeader } from "./SectionHeader";

export type FaqItem = {
  question: string;
  answer: string;
};

export function FaqBlock({
  items,
  eyebrow = "Hỏi đáp",
  title = "Câu hỏi thường gặp",
  description,
  headingId = "faq-heading",
  className = "section-y bg-surface-muted",
}: {
  items: FaqItem[];
  eyebrow?: string;
  title?: string;
  description?: string;
  headingId?: string;
  className?: string;
}) {
  return (
    <section className={className} aria-labelledby={headingId}>
      <div className="container-vf">
        <SectionHeader
          align="centered"
          eyebrow={eyebrow}
          title={title}
          description={description}
          id={headingId}
        />

        <FadeIn>
          <Accordion
            type="single"
            collapsible
            className="mx-auto max-w-3xl rounded-2xl border border-slate-200/80 bg-white px-5 shadow-soft"
          >
            {items.map((item, index) => (
              <AccordionItem key={item.question} value={`faq-${index}`}>
                <AccordionTrigger className="text-left text-sm font-semibold text-brand-dark hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </FadeIn>
      </div>
    </section>
  );
}
