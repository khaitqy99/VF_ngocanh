"use client";

import { useState } from "react";
import { ChevronDown, Plus, Trash2 } from "lucide-react";

import type { HomeEditorData } from "@/lib/cms/home-editor";
import type { HomeSectionsContent } from "@/lib/cms/home-content";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium text-zinc-700">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-md border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand/30";

function Section({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-lg border border-zinc-200">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between px-3 py-2.5 text-left text-sm font-semibold text-zinc-900"
      >
        {title}
        <ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open ? <div className="space-y-3 border-t border-zinc-100 px-3 py-3">{children}</div> : null}
    </div>
  );
}

export function HomeEditPanel({
  draft,
  onChange,
}: {
  draft: HomeEditorData;
  onChange: (next: HomeEditorData) => void;
}) {
  const updateSections = (updater: (sections: HomeSectionsContent) => HomeSectionsContent) => {
    onChange({ ...draft, sections: updater(draft.sections) });
  };

  return (
    <div className="space-y-3">
      <Section title="Banner hero" defaultOpen>
        {draft.banners.map((banner, index) => (
          <div key={banner.id ?? index} className="space-y-2 rounded-md bg-zinc-50 p-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-zinc-600">Banner {index + 1}</p>
              <button
                type="button"
                onClick={() =>
                  onChange({
                    ...draft,
                    banners: draft.banners.filter((_, i) => i !== index),
                  })
                }
                className="text-zinc-400 hover:text-red-600"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
            <Field label="Ảnh desktop">
              <input
                className={inputClass}
                value={banner.desktop}
                onChange={(event) =>
                  onChange({
                    ...draft,
                    banners: draft.banners.map((item, i) =>
                      i === index ? { ...item, desktop: event.target.value } : item,
                    ),
                  })
                }
              />
            </Field>
            <Field label="Ảnh mobile">
              <input
                className={inputClass}
                value={banner.mobile}
                onChange={(event) =>
                  onChange({
                    ...draft,
                    banners: draft.banners.map((item, i) =>
                      i === index ? { ...item, mobile: event.target.value } : item,
                    ),
                  })
                }
              />
            </Field>
            <Field label="Alt">
              <input
                className={inputClass}
                value={banner.alt}
                onChange={(event) =>
                  onChange({
                    ...draft,
                    banners: draft.banners.map((item, i) =>
                      i === index ? { ...item, alt: event.target.value } : item,
                    ),
                  })
                }
              />
            </Field>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            onChange({
              ...draft,
              banners: [
                ...draft.banners,
                { desktop: "", mobile: "", alt: "", sortOrder: draft.banners.length },
              ],
            })
          }
          className="inline-flex items-center gap-1 text-xs font-medium text-brand"
        >
          <Plus className="h-3.5 w-3.5" />
          Thêm banner
        </button>
      </Section>

      <Section title="Xe nổi bật">
        <Field label="Ô tô (theo thứ tự)">
          <select
            multiple
            className={`${inputClass} min-h-[88px]`}
            value={draft.featuredCarIds}
            onChange={(event) =>
              onChange({
                ...draft,
                featuredCarIds: Array.from(event.target.selectedOptions, (option) => option.value),
              })
            }
          >
            {draft.cars.map((car) => (
              <option key={car.id} value={car.id}>
                {car.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Xe máy (theo thứ tự)">
          <select
            multiple
            className={`${inputClass} min-h-[88px]`}
            value={draft.featuredScooterIds}
            onChange={(event) =>
              onChange({
                ...draft,
                featuredScooterIds: Array.from(
                  event.target.selectedOptions,
                  (option) => option.value,
                ),
              })
            }
          >
            {draft.scooters.map((scooter) => (
              <option key={scooter.id} value={scooter.id}>
                {scooter.name}
              </option>
            ))}
          </select>
        </Field>
        <p className="text-[11px] text-zinc-500">Giữ Ctrl (Windows) để chọn nhiều xe.</p>
      </Section>

      <Section title="Phụ kiện">
        <Field label="Eyebrow">
          <input
            className={inputClass}
            value={draft.sections.accessories.eyebrow}
            onChange={(event) =>
              updateSections((sections) => ({
                ...sections,
                accessories: { ...sections.accessories, eyebrow: event.target.value },
              }))
            }
          />
        </Field>
        <Field label="Tiêu đề">
          <input
            className={inputClass}
            value={draft.sections.accessories.title}
            onChange={(event) =>
              updateSections((sections) => ({
                ...sections,
                accessories: { ...sections.accessories, title: event.target.value },
              }))
            }
          />
        </Field>
      </Section>

      <Section title="Pin & trạm sạc">
        <Field label="Tiêu đề khối">
          <input
            className={inputClass}
            value={draft.sections.charging.title}
            onChange={(event) =>
              updateSections((sections) => ({
                ...sections,
                charging: { ...sections.charging, title: event.target.value },
              }))
            }
          />
        </Field>
        {draft.sections.charging.tiles.map((tile, index) => (
          <div key={index} className="space-y-2 rounded-md bg-zinc-50 p-3">
            <p className="text-xs font-semibold text-zinc-600">Thẻ {index + 1}</p>
            <Field label="Tiêu đề">
              <input
                className={inputClass}
                value={tile.title}
                onChange={(event) =>
                  updateSections((sections) => ({
                    ...sections,
                    charging: {
                      ...sections.charging,
                      tiles: sections.charging.tiles.map((item, i) =>
                        i === index ? { ...item, title: event.target.value } : item,
                      ),
                    },
                  }))
                }
              />
            </Field>
            <Field label="Mô tả">
              <textarea
                className={inputClass}
                rows={2}
                value={tile.desc}
                onChange={(event) =>
                  updateSections((sections) => ({
                    ...sections,
                    charging: {
                      ...sections.charging,
                      tiles: sections.charging.tiles.map((item, i) =>
                        i === index ? { ...item, desc: event.target.value } : item,
                      ),
                    },
                  }))
                }
              />
            </Field>
          </div>
        ))}
      </Section>

      <Section title="Bảo hành & dịch vụ">
        <Field label="Tiêu đề">
          <input
            className={inputClass}
            value={draft.sections.warranty.title}
            onChange={(event) =>
              updateSections((sections) => ({
                ...sections,
                warranty: { ...sections.warranty, title: event.target.value },
              }))
            }
          />
        </Field>
        <Field label="Mô tả">
          <textarea
            className={inputClass}
            rows={3}
            value={draft.sections.warranty.subtitle}
            onChange={(event) =>
              updateSections((sections) => ({
                ...sections,
                warranty: { ...sections.warranty, subtitle: event.target.value },
              }))
            }
          />
        </Field>
        <Field label="Alt ảnh">
          <input
            className={inputClass}
            value={draft.sections.warranty.imageAlt}
            onChange={(event) =>
              updateSections((sections) => ({
                ...sections,
                warranty: { ...sections.warranty, imageAlt: event.target.value },
              }))
            }
          />
        </Field>
      </Section>

      <Section title="Thương hiệu">
        <Field label="Tiêu đề">
          <input
            className={inputClass}
            value={draft.sections.brandStory.title}
            onChange={(event) =>
              updateSections((sections) => ({
                ...sections,
                brandStory: { ...sections.brandStory, title: event.target.value },
              }))
            }
          />
        </Field>
        <Field label="Phụ đề">
          <input
            className={inputClass}
            value={draft.sections.brandStory.subtitle}
            onChange={(event) =>
              updateSections((sections) => ({
                ...sections,
                brandStory: { ...sections.brandStory, subtitle: event.target.value },
              }))
            }
          />
        </Field>
        <Field label="Alt ảnh nền">
          <input
            className={inputClass}
            value={draft.sections.brandStory.imageAlt}
            onChange={(event) =>
              updateSections((sections) => ({
                ...sections,
                brandStory: { ...sections.brandStory, imageAlt: event.target.value },
              }))
            }
          />
        </Field>
      </Section>

      <Section title="Newsletter">
        <Field label="Tiêu đề">
          <input
            className={inputClass}
            value={draft.sections.newsletter.title}
            onChange={(event) =>
              updateSections((sections) => ({
                ...sections,
                newsletter: { ...sections.newsletter, title: event.target.value },
              }))
            }
          />
        </Field>
        <Field label="Mô tả">
          <textarea
            className={inputClass}
            rows={2}
            value={draft.sections.newsletter.subtitle}
            onChange={(event) =>
              updateSections((sections) => ({
                ...sections,
                newsletter: { ...sections.newsletter, subtitle: event.target.value },
              }))
            }
          />
        </Field>
      </Section>

      <Section title="FAQ">
        <Field label="Tiêu đề">
          <input
            className={inputClass}
            value={draft.sections.faq.title}
            onChange={(event) =>
              updateSections((sections) => ({
                ...sections,
                faq: { ...sections.faq, title: event.target.value },
              }))
            }
          />
        </Field>
        {draft.sections.faq.items.slice(0, 3).map((item, index) => (
          <div key={index} className="space-y-2 rounded-md bg-zinc-50 p-3">
            <Field label={`Câu hỏi ${index + 1}`}>
              <input
                className={inputClass}
                value={item.question}
                onChange={(event) =>
                  updateSections((sections) => ({
                    ...sections,
                    faq: {
                      ...sections.faq,
                      items: sections.faq.items.map((faqItem, i) =>
                        i === index ? { ...faqItem, question: event.target.value } : faqItem,
                      ),
                    },
                  }))
                }
              />
            </Field>
          </div>
        ))}
        <p className="text-[11px] text-zinc-500">
          Hiển thị 3 câu đầu — mở form đầy đủ nếu cần chỉnh tất cả FAQ.
        </p>
      </Section>
    </div>
  );
}
