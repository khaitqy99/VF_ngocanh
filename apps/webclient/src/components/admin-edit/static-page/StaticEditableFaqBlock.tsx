"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { FadeIn } from "@/components/motion";
import { useStaticPageAdminEdit } from "@/components/admin-edit/static-page/StaticPageAdminEditContext";
import { StaticEditableText } from "@/components/admin-edit/static-page/StaticEditableText";

export function StaticEditableFaqBlock({
  items,
  eyebrow = "Hỏi đáp",
  title = "Câu hỏi thường gặp",
  className = "section-y bg-surface-muted",
}: {
  items: { q: string; a: string }[];
  eyebrow?: string;
  title?: string;
  className?: string;
}) {
  const edit = useStaticPageAdminEdit();

  return (
    <section className={className} aria-labelledby="static-faq-heading">
      <div className="container-vf">
        <SectionHeader align="centered" eyebrow={eyebrow} title={title} id="static-faq-heading" />

        <FadeIn>
          <Accordion
            type="single"
            collapsible
            className="mx-auto max-w-3xl rounded-2xl border border-slate-200/80 bg-white px-5 shadow-soft"
          >
            {items.map((item, index) => (
              <AccordionItem key={index} value={`faq-${index}`}>
                <AccordionTrigger className="text-left text-sm font-bold text-brand-dark hover:no-underline">
                  <StaticEditableText
                    value={item.q}
                    onChange={(value) => edit?.updateField(`faq.${index}.q`, value)}
                  />
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-slate-500">
                  <StaticEditableText
                    value={item.a}
                    onChange={(value) => edit?.updateField(`faq.${index}.a`, value)}
                    multiline
                  />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </FadeIn>
      </div>
    </section>
  );
}
