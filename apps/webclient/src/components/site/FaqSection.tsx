"use client";

import type { HomeSectionsContent } from "@/lib/cms/home-content";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FadeIn } from "@/components/motion";
import {
  useHomeAdminEdit,
  homeEditSectionClass,
} from "@/components/admin-edit/home/HomeAdminEditContext";
import { HomeEditableSectionHeader } from "@/components/admin-edit/home/HomeEditableSectionHeader";
import { HomeEditableText } from "@/components/admin-edit/home/HomeEditableText";
import {
  HomeEditListControls,
  HomeEditSectionListBar,
  moveListItem,
} from "@/components/admin-edit/home/HomeEditListControls";
import { DEFAULT_FAQ_ITEM } from "@/lib/cms/home-list-defaults";

export default function FaqSection({ section }: { section?: HomeSectionsContent["faq"] }) {
  const edit = useHomeAdminEdit();
  const items = section?.items ?? [];
  if (!items.length) return null;

  return (
    <section
      className={`section-y bg-surface-muted ${edit?.editMode ? homeEditSectionClass() : ""}`}
    >
      <div className="container-vf">
        <HomeEditableSectionHeader
          align="centered"
          eyebrow={section?.eyebrow ?? "Hỏi đáp"}
          title={section?.title ?? ""}
          description={section?.description ?? ""}
          id="faq-heading"
          onEyebrowChange={
            edit?.editMode && section
              ? (eyebrow) =>
                  edit.updateSections((sections) => ({
                    ...sections,
                    faq: { ...sections.faq, eyebrow },
                  }))
              : undefined
          }
          onTitleChange={
            edit?.editMode && section
              ? (title) =>
                  edit.updateSections((sections) => ({
                    ...sections,
                    faq: { ...sections.faq, title },
                  }))
              : undefined
          }
          onDescriptionChange={
            edit?.editMode && section
              ? (description) =>
                  edit.updateSections((sections) => ({
                    ...sections,
                    faq: { ...sections.faq, description },
                  }))
              : undefined
          }
        />

        {edit?.editMode ? (
          <HomeEditSectionListBar
            addLabel="Thêm câu hỏi"
            onAdd={() =>
              edit.updateSections((sections) => ({
                ...sections,
                faq: {
                  ...sections.faq,
                  items: [...sections.faq.items, { ...DEFAULT_FAQ_ITEM }],
                },
              }))
            }
          />
        ) : null}

        <FadeIn>
          <Accordion
            type="single"
            collapsible
            className="mx-auto max-w-3xl rounded-2xl border border-slate-200/80 bg-white px-5 shadow-soft"
          >
            {items.map((item, index) => (
              <AccordionItem key={`faq-${index}`} value={`faq-${index}`}>
                <AccordionTrigger className="text-left text-sm font-semibold text-brand-dark hover:no-underline">
                  {edit?.editMode ? (
                    <HomeEditableText
                      value={item.question}
                      onChange={(question) =>
                        edit.updateSections((sections) => ({
                          ...sections,
                          faq: {
                            ...sections.faq,
                            items: sections.faq.items.map((faqItem, faqIndex) =>
                              faqIndex === index ? { ...faqItem, question } : faqItem,
                            ),
                          },
                        }))
                      }
                      className="text-sm font-semibold text-brand-dark"
                      label="Câu hỏi"
                    />
                  ) : (
                    item.question
                  )}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {edit?.editMode ? (
                    <>
                      <HomeEditableText
                        value={item.answer}
                        onChange={(answer) =>
                          edit.updateSections((sections) => ({
                            ...sections,
                            faq: {
                              ...sections.faq,
                              items: sections.faq.items.map((faqItem, faqIndex) =>
                                faqIndex === index ? { ...faqItem, answer } : faqItem,
                              ),
                            },
                          }))
                        }
                        multiline
                        className="text-sm leading-relaxed text-muted-foreground"
                        label="Trả lời"
                      />
                      <HomeEditListControls
                        onMoveUp={() =>
                          edit.updateSections((sections) => ({
                            ...sections,
                            faq: {
                              ...sections.faq,
                              items: moveListItem(sections.faq.items, index, index - 1),
                            },
                          }))
                        }
                        onMoveDown={() =>
                          edit.updateSections((sections) => ({
                            ...sections,
                            faq: {
                              ...sections.faq,
                              items: moveListItem(sections.faq.items, index, index + 1),
                            },
                          }))
                        }
                        onRemove={() =>
                          edit.updateSections((sections) => ({
                            ...sections,
                            faq: {
                              ...sections.faq,
                              items: sections.faq.items.filter((_, faqIndex) => faqIndex !== index),
                            },
                          }))
                        }
                        canMoveUp={index > 0}
                        canMoveDown={index < items.length - 1}
                        canRemove={items.length > 1}
                      />
                    </>
                  ) : (
                    item.answer
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </FadeIn>
      </div>
    </section>
  );
}
