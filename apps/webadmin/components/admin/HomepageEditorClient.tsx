"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, ExternalLink, GripVertical, Plus, Trash2 } from "lucide-react";
import { Button, Input, Textarea } from "@/components/ui/core";
import { PageHeader } from "@/components/admin/PageHeader";
import { EditField, EditSection } from "@/components/admin/pdp/EditSection";
import { useToast } from "@/components/admin/ToastProvider";
import type {
  HomeBannerInput,
  HomeSectionsContent,
} from "@/lib/cms/home-content";

type VehicleOption = { id: string; name: string; status: string };

type HomeEditorState = {
  sections: HomeSectionsContent;
  featuredCarIds: string[];
  featuredScooterIds: string[];
  banners: HomeBannerInput[];
  status: "draft" | "published";
  cars: VehicleOption[];
  scooters: VehicleOption[];
};

function ImagePathField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
}) {
  return (
    <EditField label={label} hint={hint ?? "Đường dẫn ảnh, ví dụ /images/vinfast/..."}>
      <Input value={value} onChange={(event) => onChange(event.target.value)} />
    </EditField>
  );
}

function FeaturedVehiclePicker({
  label,
  ids,
  options,
  onChange,
}: {
  label: string;
  ids: string[];
  options: VehicleOption[];
  onChange: (ids: string[]) => void;
}) {
  const add = () => onChange([...ids, options[0]?.id ?? ""]);
  const remove = (index: number) => onChange(ids.filter((_, i) => i !== index));
  const update = (index: number, id: string) =>
    onChange(ids.map((current, i) => (i === index ? id : current)));

  return (
    <EditField
      label={label}
      hint="Thứ tự trong danh sách = thứ tự hiển thị trên trang chủ"
    >
      <div className="space-y-2">
        {ids.map((id, index) => (
          <div key={`${id}-${index}`} className="flex items-center gap-2">
            <GripVertical className="h-4 w-4 shrink-0 text-zinc-300" />
            <select
              value={id}
              onChange={(event) => update(index, event.target.value)}
              className="h-9 flex-1 rounded-md border border-zinc-200 bg-white px-3 text-sm"
            >
              {options.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                  {option.status !== "published" ? ` (${option.status})` : ""}
                </option>
              ))}
            </select>
            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
              <Trash2 className="h-4 w-4 text-zinc-400" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={add}>
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Thêm xe
        </Button>
      </div>
    </EditField>
  );
}

export function HomepageEditorClient() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [state, setState] = useState<HomeEditorState | null>(null);

  useEffect(() => {
    fetch("/api/cms/home", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setState({
          sections: data.sections,
          featuredCarIds: data.featuredCarIds,
          featuredScooterIds: data.featuredScooterIds,
          banners: data.banners,
          status: data.status ?? "published",
          cars: data.cars ?? [],
          scooters: data.scooters ?? [],
        });
      })
      .catch((error) => toast(error instanceof Error ? error.message : "Không tải được dữ liệu"))
      .finally(() => setLoading(false));
  }, [toast]);

  const updateSections = (updater: (sections: HomeSectionsContent) => HomeSectionsContent) => {
    setState((current) =>
      current ? { ...current, sections: updater(current.sections) } : current,
    );
  };

  const save = async () => {
    if (!state) return;
    setSaving(true);
    try {
      const response = await fetch("/api/cms/home", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sections: state.sections,
          featuredCarIds: state.featuredCarIds,
          featuredScooterIds: state.featuredScooterIds,
          banners: state.banners,
          status: state.status,
        }),
      });
      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "Lưu thất bại");
      }
      toast("Đã lưu nội dung trang chủ");
    } catch (error) {
      toast(error instanceof Error ? error.message : "Lưu thất bại");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="py-12 text-center text-sm text-zinc-500">Đang tải nội dung trang chủ…</p>;
  }

  if (!state) {
    return <p className="py-12 text-center text-sm text-zinc-500">Không tải được dữ liệu.</p>;
  }

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-zinc-500">
        <span className="font-medium text-zinc-900">Trang chủ</span>
      </div>

      <PageHeader
        title="Nội dung trang chủ"
        description="Chỉnh banner, xe nổi bật, phụ kiện, pin & sạc, bảo hành, thương hiệu, FAQ và các khối nội dung khác."
        action={
          <div className="flex items-center gap-2">
            <a
              href={`${siteUrl}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center justify-center rounded-md border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-900 transition hover:bg-zinc-100"
            >
              <ExternalLink className="mr-1.5 h-4 w-4" />
              Xem trang chủ
            </a>
            <Button onClick={save} disabled={saving}>
              {saving ? "Đang lưu…" : "Lưu thay đổi"}
            </Button>
          </div>
        }
      />

      <div className="rounded-xl border border-zinc-200 bg-white">
        <EditSection id="banners" title="Banner hero" subtitle="Carousel ảnh đầu trang chủ">
          <div className="space-y-6">
            {state.banners.map((banner, index) => (
              <div key={banner.id ?? `banner-${index}`} className="rounded-lg border border-zinc-200 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-zinc-900">Banner {index + 1}</p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setState((current) =>
                        current
                          ? {
                              ...current,
                              banners: current.banners.filter((_, i) => i !== index),
                            }
                          : current,
                      )
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <ImagePathField
                    label="Ảnh desktop"
                    value={banner.desktop}
                    onChange={(desktop) =>
                      setState((current) =>
                        current
                          ? {
                              ...current,
                              banners: current.banners.map((item, i) =>
                                i === index ? { ...item, desktop } : item,
                              ),
                            }
                          : current,
                      )
                    }
                  />
                  <ImagePathField
                    label="Ảnh mobile"
                    value={banner.mobile}
                    onChange={(mobile) =>
                      setState((current) =>
                        current
                          ? {
                              ...current,
                              banners: current.banners.map((item, i) =>
                                i === index ? { ...item, mobile } : item,
                              ),
                            }
                          : current,
                      )
                    }
                  />
                  <div className="md:col-span-2">
                    <EditField label="Mô tả ảnh (alt)">
                      <Input
                        value={banner.alt}
                        onChange={(event) =>
                          setState((current) =>
                            current
                              ? {
                                  ...current,
                                  banners: current.banners.map((item, i) =>
                                    i === index ? { ...item, alt: event.target.value } : item,
                                  ),
                                }
                              : current,
                          )
                        }
                      />
                    </EditField>
                  </div>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setState((current) =>
                  current
                    ? {
                        ...current,
                        banners: [
                          ...current.banners,
                          { desktop: "", mobile: "", alt: "", sortOrder: current.banners.length },
                        ],
                      }
                    : current,
                )
              }
            >
              <Plus className="mr-1.5 h-4 w-4" />
              Thêm banner
            </Button>
          </div>
        </EditSection>

        <EditSection id="featured" title="Xe nổi bật" subtitle="Carousel ô tô và xe máy điện" alt>
          <div className="grid gap-6 lg:grid-cols-2">
            <FeaturedVehiclePicker
              label="Ô tô nổi bật"
              ids={state.featuredCarIds}
              options={state.cars}
              onChange={(featuredCarIds) => setState((current) => (current ? { ...current, featuredCarIds } : current))}
            />
            <FeaturedVehiclePicker
              label="Xe máy điện nổi bật"
              ids={state.featuredScooterIds}
              options={state.scooters}
              onChange={(featuredScooterIds) =>
                setState((current) => (current ? { ...current, featuredScooterIds } : current))
              }
            />
          </div>
          <p className="mt-4 text-xs text-zinc-500">
            Chi tiết từng xe (ảnh, giá, mô tả) vẫn chỉnh tại{" "}
            <Link href="/admin/cars" className="text-red-600 hover:underline">
              Ô tô
            </Link>{" "}
            và{" "}
            <Link href="/admin/scooters" className="text-red-600 hover:underline">
              Xe máy
            </Link>
            .
          </p>
        </EditSection>

        <EditSection id="accessories" title="Phụ kiện" subtitle="Tiêu đề khối phụ kiện (sản phẩm lấy từ catalog)">
          <div className="grid gap-4 md:grid-cols-3">
            <EditField label="Eyebrow">
              <Input
                value={state.sections.accessories.eyebrow}
                onChange={(event) =>
                  updateSections((sections) => ({
                    ...sections,
                    accessories: { ...sections.accessories, eyebrow: event.target.value },
                  }))
                }
              />
            </EditField>
            <EditField label="Tiêu đề">
              <Input
                value={state.sections.accessories.title}
                onChange={(event) =>
                  updateSections((sections) => ({
                    ...sections,
                    accessories: { ...sections.accessories, title: event.target.value },
                  }))
                }
              />
            </EditField>
            <EditField label="Link xem tất cả">
              <Input
                value={state.sections.accessories.viewAllHref}
                onChange={(event) =>
                  updateSections((sections) => ({
                    ...sections,
                    accessories: { ...sections.accessories, viewAllHref: event.target.value },
                  }))
                }
              />
            </EditField>
          </div>
        </EditSection>

        <EditSection id="news" title="Tin tức" subtitle="Hiển thị 3 bài mới nhất hoặc bài đã ghim trên trang chủ">
          <div className="grid gap-4 md:grid-cols-3">
            <EditField label="Eyebrow">
              <Input
                value={state.sections.news.eyebrow}
                onChange={(event) =>
                  updateSections((sections) => ({
                    ...sections,
                    news: { ...sections.news, eyebrow: event.target.value },
                  }))
                }
              />
            </EditField>
            <EditField label="Tiêu đề">
              <Input
                value={state.sections.news.title}
                onChange={(event) =>
                  updateSections((sections) => ({
                    ...sections,
                    news: { ...sections.news, title: event.target.value },
                  }))
                }
              />
            </EditField>
            <EditField label="Link xem tất cả">
              <Input
                value={state.sections.news.viewAllHref}
                onChange={(event) =>
                  updateSections((sections) => ({
                    ...sections,
                    news: { ...sections.news, viewAllHref: event.target.value },
                  }))
                }
              />
            </EditField>
          </div>
          <p className="mt-3 text-xs text-zinc-500">
            Để chọn bài hiển thị, ghim bài nổi bật trong{" "}
            <Link href="/admin/posts" className="text-red-600 hover:underline">
              Tin tức
            </Link>
            .
          </p>
        </EditSection>

        <EditSection id="charging" title="Pin & trạm sạc" subtitle="3 thẻ giới thiệu hệ sinh thái sạc">
          <div className="mb-4 grid gap-4 md:grid-cols-2">
            <EditField label="Eyebrow">
              <Input
                value={state.sections.charging.eyebrow}
                onChange={(event) =>
                  updateSections((sections) => ({
                    ...sections,
                    charging: { ...sections.charging, eyebrow: event.target.value },
                  }))
                }
              />
            </EditField>
            <EditField label="Tiêu đề">
              <Input
                value={state.sections.charging.title}
                onChange={(event) =>
                  updateSections((sections) => ({
                    ...sections,
                    charging: { ...sections.charging, title: event.target.value },
                  }))
                }
              />
            </EditField>
          </div>
          <div className="space-y-4">
            {state.sections.charging.tiles.map((tile, index) => (
              <div key={index} className="rounded-lg border border-zinc-200 p-4">
                <p className="mb-3 text-sm font-semibold">Thẻ {index + 1}</p>
                <div className="grid gap-4 md:grid-cols-2">
                  <ImagePathField
                    label="Ảnh"
                    value={tile.img}
                    onChange={(img) =>
                      updateSections((sections) => ({
                        ...sections,
                        charging: {
                          ...sections.charging,
                          tiles: sections.charging.tiles.map((item, i) =>
                            i === index ? { ...item, img } : item,
                          ),
                        },
                      }))
                    }
                  />
                  <EditField label="Tiêu đề">
                    <Input
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
                  </EditField>
                  <EditField label="Link">
                    <Input
                      value={tile.href}
                      onChange={(event) =>
                        updateSections((sections) => ({
                          ...sections,
                          charging: {
                            ...sections.charging,
                            tiles: sections.charging.tiles.map((item, i) =>
                              i === index ? { ...item, href: event.target.value } : item,
                            ),
                          },
                        }))
                      }
                    />
                  </EditField>
                  <EditField label="Giao diện">
                    <select
                      value={tile.theme}
                      onChange={(event) =>
                        updateSections((sections) => ({
                          ...sections,
                          charging: {
                            ...sections.charging,
                            tiles: sections.charging.tiles.map((item, i) =>
                              i === index
                                ? { ...item, theme: event.target.value as "dark" | "light" }
                                : item,
                            ),
                          },
                        }))
                      }
                      className="h-9 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm"
                    >
                      <option value="dark">Tối</option>
                      <option value="light">Sáng</option>
                    </select>
                  </EditField>
                  <div className="md:col-span-2">
                    <EditField label="Mô tả">
                      <Textarea
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
                        rows={3}
                      />
                    </EditField>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </EditSection>

        <EditSection id="warranty" title="Bảo hành & dịch vụ" subtitle="Khối giới thiệu dịch vụ hậu mãi">
          <div className="grid gap-4 md:grid-cols-2">
            <EditField label="Tiêu đề">
              <Input
                value={state.sections.warranty.title}
                onChange={(event) =>
                  updateSections((sections) => ({
                    ...sections,
                    warranty: { ...sections.warranty, title: event.target.value },
                  }))
                }
              />
            </EditField>
            <ImagePathField
              label="Ảnh"
              value={state.sections.warranty.image}
              onChange={(image) =>
                updateSections((sections) => ({
                  ...sections,
                  warranty: { ...sections.warranty, image },
                }))
              }
            />
            <div className="md:col-span-2">
              <EditField label="Mô tả">
                <Textarea
                  value={state.sections.warranty.subtitle}
                  onChange={(event) =>
                    updateSections((sections) => ({
                      ...sections,
                      warranty: { ...sections.warranty, subtitle: event.target.value },
                    }))
                  }
                  rows={3}
                />
              </EditField>
            </div>
            {state.sections.warranty.specs.map((spec, index) => (
              <div key={index} className="grid gap-2 md:col-span-2 md:grid-cols-2">
                <EditField label={`Thông số ${index + 1} — giá trị`}>
                  <Input
                    value={spec.value}
                    onChange={(event) =>
                      updateSections((sections) => ({
                        ...sections,
                        warranty: {
                          ...sections.warranty,
                          specs: sections.warranty.specs.map((item, i) =>
                            i === index ? { ...item, value: event.target.value } : item,
                          ),
                        },
                      }))
                    }
                  />
                </EditField>
                <EditField label={`Thông số ${index + 1} — nhãn`}>
                  <Input
                    value={spec.label}
                    onChange={(event) =>
                      updateSections((sections) => ({
                        ...sections,
                        warranty: {
                          ...sections.warranty,
                          specs: sections.warranty.specs.map((item, i) =>
                            i === index ? { ...item, label: event.target.value } : item,
                          ),
                        },
                      }))
                    }
                  />
                </EditField>
              </div>
            ))}
            <EditField label="CTA chính — nhãn">
              <Input
                value={state.sections.warranty.primaryCta.label}
                onChange={(event) =>
                  updateSections((sections) => ({
                    ...sections,
                    warranty: {
                      ...sections.warranty,
                      primaryCta: { ...sections.warranty.primaryCta, label: event.target.value },
                    },
                  }))
                }
              />
            </EditField>
            <EditField label="CTA chính — link">
              <Input
                value={state.sections.warranty.primaryCta.href}
                onChange={(event) =>
                  updateSections((sections) => ({
                    ...sections,
                    warranty: {
                      ...sections.warranty,
                      primaryCta: { ...sections.warranty.primaryCta, href: event.target.value },
                    },
                  }))
                }
              />
            </EditField>
            <EditField label="CTA phụ — nhãn">
              <Input
                value={state.sections.warranty.secondaryCta.label}
                onChange={(event) =>
                  updateSections((sections) => ({
                    ...sections,
                    warranty: {
                      ...sections.warranty,
                      secondaryCta: { ...sections.warranty.secondaryCta, label: event.target.value },
                    },
                  }))
                }
              />
            </EditField>
            <EditField label="CTA phụ — link">
              <Input
                value={state.sections.warranty.secondaryCta.href}
                onChange={(event) =>
                  updateSections((sections) => ({
                    ...sections,
                    warranty: {
                      ...sections.warranty,
                      secondaryCta: { ...sections.warranty.secondaryCta, href: event.target.value },
                    },
                  }))
                }
              />
            </EditField>
          </div>
        </EditSection>

        <EditSection id="brand" title="Câu chuyện thương hiệu" subtitle="Khối VinFast — Vì một Việt Nam mạnh mẽ" alt>
          <div className="grid gap-4 md:grid-cols-2">
            <EditField label="Tiêu đề">
              <Input
                value={state.sections.brandStory.title}
                onChange={(event) =>
                  updateSections((sections) => ({
                    ...sections,
                    brandStory: { ...sections.brandStory, title: event.target.value },
                  }))
                }
              />
            </EditField>
            <EditField label="Phụ đề">
              <Input
                value={state.sections.brandStory.subtitle}
                onChange={(event) =>
                  updateSections((sections) => ({
                    ...sections,
                    brandStory: { ...sections.brandStory, subtitle: event.target.value },
                  }))
                }
              />
            </EditField>
            <ImagePathField
              label="Ảnh nền"
              value={state.sections.brandStory.image}
              onChange={(image) =>
                updateSections((sections) => ({
                  ...sections,
                  brandStory: { ...sections.brandStory, image },
                }))
              }
            />
            {state.sections.brandStory.points.map((point, index) => (
              <EditField key={index} label={`Điểm nổi bật ${index + 1}`}>
                <Input
                  value={point}
                  onChange={(event) =>
                    updateSections((sections) => ({
                      ...sections,
                      brandStory: {
                        ...sections.brandStory,
                        points: sections.brandStory.points.map((item, i) =>
                          i === index ? event.target.value : item,
                        ),
                      },
                    }))
                  }
                />
              </EditField>
            ))}
            <EditField label="Nút CTA — nhãn">
              <Input
                value={state.sections.brandStory.ctaLabel}
                onChange={(event) =>
                  updateSections((sections) => ({
                    ...sections,
                    brandStory: { ...sections.brandStory, ctaLabel: event.target.value },
                  }))
                }
              />
            </EditField>
            <EditField label="Nút CTA — link">
              <Input
                value={state.sections.brandStory.ctaHref}
                onChange={(event) =>
                  updateSections((sections) => ({
                    ...sections,
                    brandStory: { ...sections.brandStory, ctaHref: event.target.value },
                  }))
                }
              />
            </EditField>
          </div>
        </EditSection>

        <EditSection id="showroom" title="Showroom & cộng đồng" subtitle="2 thẻ liên kết cuối trang" alt>
          <div className="space-y-4">
            {state.sections.showroomCommunity.cards.map((card, index) => (
              <div key={index} className="rounded-lg border border-zinc-200 p-4">
                <p className="mb-3 text-sm font-semibold">Thẻ {index + 1}</p>
                <div className="grid gap-4 md:grid-cols-2">
                  <ImagePathField
                    label="Ảnh"
                    value={card.img}
                    onChange={(img) =>
                      updateSections((sections) => ({
                        ...sections,
                        showroomCommunity: {
                          ...sections.showroomCommunity,
                          cards: sections.showroomCommunity.cards.map((item, i) =>
                            i === index ? { ...item, img } : item,
                          ),
                        },
                      }))
                    }
                  />
                  <EditField label="Tiêu đề">
                    <Input
                      value={card.title}
                      onChange={(event) =>
                        updateSections((sections) => ({
                          ...sections,
                          showroomCommunity: {
                            ...sections.showroomCommunity,
                            cards: sections.showroomCommunity.cards.map((item, i) =>
                              i === index ? { ...item, title: event.target.value } : item,
                            ),
                          },
                        }))
                      }
                    />
                  </EditField>
                  <EditField label="Nút CTA">
                    <Input
                      value={card.cta}
                      onChange={(event) =>
                        updateSections((sections) => ({
                          ...sections,
                          showroomCommunity: {
                            ...sections.showroomCommunity,
                            cards: sections.showroomCommunity.cards.map((item, i) =>
                              i === index ? { ...item, cta: event.target.value } : item,
                            ),
                          },
                        }))
                      }
                    />
                  </EditField>
                  <EditField label="Link">
                    <Input
                      value={card.href}
                      onChange={(event) =>
                        updateSections((sections) => ({
                          ...sections,
                          showroomCommunity: {
                            ...sections.showroomCommunity,
                            cards: sections.showroomCommunity.cards.map((item, i) =>
                              i === index ? { ...item, href: event.target.value } : item,
                            ),
                          },
                        }))
                      }
                    />
                  </EditField>
                </div>
              </div>
            ))}
          </div>
        </EditSection>

        <EditSection id="newsletter" title="Đăng ký nhận tin" subtitle="Form email cuối trang">
          <div className="grid gap-4 md:grid-cols-2">
            <EditField label="Tiêu đề">
              <Input
                value={state.sections.newsletter.title}
                onChange={(event) =>
                  updateSections((sections) => ({
                    ...sections,
                    newsletter: { ...sections.newsletter, title: event.target.value },
                  }))
                }
              />
            </EditField>
            <ImagePathField
              label="Ảnh nền"
              value={state.sections.newsletter.backgroundImage}
              onChange={(backgroundImage) =>
                updateSections((sections) => ({
                  ...sections,
                  newsletter: { ...sections.newsletter, backgroundImage },
                }))
              }
            />
            <div className="md:col-span-2">
              <EditField label="Mô tả">
                <Textarea
                  value={state.sections.newsletter.subtitle}
                  onChange={(event) =>
                    updateSections((sections) => ({
                      ...sections,
                      newsletter: { ...sections.newsletter, subtitle: event.target.value },
                    }))
                  }
                  rows={2}
                />
              </EditField>
            </div>
            <EditField label="Placeholder email">
              <Input
                value={state.sections.newsletter.placeholder}
                onChange={(event) =>
                  updateSections((sections) => ({
                    ...sections,
                    newsletter: { ...sections.newsletter, placeholder: event.target.value },
                  }))
                }
              />
            </EditField>
            <EditField label="Nút gửi">
              <Input
                value={state.sections.newsletter.buttonLabel}
                onChange={(event) =>
                  updateSections((sections) => ({
                    ...sections,
                    newsletter: { ...sections.newsletter, buttonLabel: event.target.value },
                  }))
                }
              />
            </EditField>
            <div className="md:col-span-2">
              <EditField label="Ghi chú pháp lý">
                <Textarea
                  value={state.sections.newsletter.disclaimer}
                  onChange={(event) =>
                    updateSections((sections) => ({
                      ...sections,
                      newsletter: { ...sections.newsletter, disclaimer: event.target.value },
                    }))
                  }
                  rows={2}
                />
              </EditField>
            </div>
          </div>
        </EditSection>

        <EditSection id="faq" title="Hỏi đáp (FAQ)" subtitle="Câu hỏi thường gặp về showroom Cà Mau">
          <div className="mb-4 grid gap-4 md:grid-cols-2">
            <EditField label="Eyebrow">
              <Input
                value={state.sections.faq.eyebrow}
                onChange={(event) =>
                  updateSections((sections) => ({
                    ...sections,
                    faq: { ...sections.faq, eyebrow: event.target.value },
                  }))
                }
              />
            </EditField>
            <EditField label="Tiêu đề">
              <Input
                value={state.sections.faq.title}
                onChange={(event) =>
                  updateSections((sections) => ({
                    ...sections,
                    faq: { ...sections.faq, title: event.target.value },
                  }))
                }
              />
            </EditField>
            <div className="md:col-span-2">
              <EditField label="Mô tả">
                <Textarea
                  value={state.sections.faq.description}
                  onChange={(event) =>
                    updateSections((sections) => ({
                      ...sections,
                      faq: { ...sections.faq, description: event.target.value },
                    }))
                  }
                  rows={2}
                />
              </EditField>
            </div>
          </div>
          <div className="space-y-4">
            {state.sections.faq.items.map((item, index) => (
              <div key={index} className="rounded-lg border border-zinc-200 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold">Câu hỏi {index + 1}</p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      updateSections((sections) => ({
                        ...sections,
                        faq: {
                          ...sections.faq,
                          items: sections.faq.items.filter((_, i) => i !== index),
                        },
                      }))
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-3">
                  <EditField label="Câu hỏi">
                    <Input
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
                  </EditField>
                  <EditField label="Trả lời">
                    <Textarea
                      value={item.answer}
                      onChange={(event) =>
                        updateSections((sections) => ({
                          ...sections,
                          faq: {
                            ...sections.faq,
                            items: sections.faq.items.map((faqItem, i) =>
                              i === index ? { ...faqItem, answer: event.target.value } : faqItem,
                            ),
                          },
                        }))
                      }
                      rows={3}
                    />
                  </EditField>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                updateSections((sections) => ({
                  ...sections,
                  faq: {
                    ...sections.faq,
                    items: [...sections.faq.items, { question: "", answer: "" }],
                  },
                }))
              }
            >
              <Plus className="mr-1.5 h-4 w-4" />
              Thêm câu hỏi
            </Button>
          </div>
        </EditSection>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-6 py-4">
        <p className="text-sm text-zinc-500">
          SEO trang chủ chỉnh tại{" "}
          <Link href="/admin/seo/pages/home" className="text-red-600 hover:underline">
            SEO → Trang chủ
          </Link>
          . Vị trí showroom chỉnh tại{" "}
          <Link href="/admin/seo/global" className="text-red-600 hover:underline">
            SEO toàn site
          </Link>
          .
        </p>
        <Button onClick={save} disabled={saving}>
          {saving ? "Đang lưu…" : "Lưu thay đổi"}
        </Button>
      </div>
    </div>
  );
}
