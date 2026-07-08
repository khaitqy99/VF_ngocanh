"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, ExternalLink, Plus, Trash2 } from "lucide-react";
import { Button, Input, Textarea } from "@/components/ui/core";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/complex";
import { PageHeader } from "@/components/admin/PageHeader";
import { EditField, EditSection } from "@/components/admin/pdp/EditSection";
import { useToast } from "@/components/admin/ToastProvider";
import type {
  AboutPageContent,
  AfterSalesPageContent,
  ChargingPageContent,
  CmsBannerInput,
  CmsFaqItem,
  CmsStatItem,
  EnergyPageContent,
  StaticPageSlug,
} from "@/lib/cms/static-pages";

type EditorState = {
  slug: StaticPageSlug;
  label: string;
  path: string;
  bannerPlacement: string | null;
  content: AboutPageContent | AfterSalesPageContent | ChargingPageContent | EnergyPageContent;
  banners: CmsBannerInput[];
  status: "draft" | "published";
};

function ImagePathField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <EditField label={label} hint="Đường dẫn ảnh, ví dụ /images/vinfast/...">
      <Input value={value} onChange={(event) => onChange(event.target.value)} />
    </EditField>
  );
}

function FaqEditor({
  items,
  onChange,
}: {
  items: CmsFaqItem[];
  onChange: (items: CmsFaqItem[]) => void;
}) {
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="rounded-lg border border-zinc-200 p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-zinc-900">Câu hỏi {index + 1}</p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onChange(items.filter((_, i) => i !== index))}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-3">
            <EditField label="Câu hỏi">
              <Input
                value={item.q}
                onChange={(event) =>
                  onChange(items.map((row, i) => (i === index ? { ...row, q: event.target.value } : row)))
                }
              />
            </EditField>
            <EditField label="Trả lời">
              <Textarea
                rows={3}
                value={item.a}
                onChange={(event) =>
                  onChange(items.map((row, i) => (i === index ? { ...row, a: event.target.value } : row)))
                }
              />
            </EditField>
          </div>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onChange([...items, { q: "", a: "" }])}
      >
        <Plus className="mr-1.5 h-3.5 w-3.5" />
        Thêm câu hỏi
      </Button>
    </div>
  );
}

function StatsEditor({
  items,
  onChange,
}: {
  items: CmsStatItem[];
  onChange: (items: CmsStatItem[]) => void;
}) {
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="grid gap-3 rounded-lg border border-zinc-200 p-4 md:grid-cols-2">
          <EditField label="Giá trị">
            <Input
              value={item.value}
              onChange={(event) =>
                onChange(items.map((row, i) => (i === index ? { ...row, value: event.target.value } : row)))
              }
            />
          </EditField>
          <EditField label="Nhãn">
            <Input
              value={item.label}
              onChange={(event) =>
                onChange(items.map((row, i) => (i === index ? { ...row, label: event.target.value } : row)))
              }
            />
          </EditField>
        </div>
      ))}
    </div>
  );
}

function BannerEditor({
  banners,
  onChange,
}: {
  banners: CmsBannerInput[];
  onChange: (banners: CmsBannerInput[]) => void;
}) {
  return (
    <div className="space-y-4">
      {banners.map((banner, index) => (
        <div key={banner.id ?? `banner-${index}`} className="rounded-lg border border-zinc-200 p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-zinc-900">Banner {index + 1}</p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onChange(banners.filter((_, i) => i !== index))}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <ImagePathField
              label="Ảnh desktop"
              value={banner.desktop}
              onChange={(desktop) =>
                onChange(banners.map((item, i) => (i === index ? { ...item, desktop } : item)))
              }
            />
            <ImagePathField
              label="Ảnh mobile"
              value={banner.mobile}
              onChange={(mobile) =>
                onChange(banners.map((item, i) => (i === index ? { ...item, mobile } : item)))
              }
            />
            <div className="md:col-span-2">
              <EditField label="Alt text">
                <Input
                  value={banner.alt}
                  onChange={(event) =>
                    onChange(
                      banners.map((item, i) => (i === index ? { ...item, alt: event.target.value } : item)),
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
        size="sm"
        onClick={() => onChange([...banners, { desktop: "", mobile: "", alt: "" }])}
      >
        <Plus className="mr-1.5 h-3.5 w-3.5" />
        Thêm banner
      </Button>
    </div>
  );
}

export function StaticPageEditorClient({ slug }: { slug: StaticPageSlug }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [state, setState] = useState<EditorState | null>(null);

  useEffect(() => {
    fetch(`/api/cms/pages/${encodeURIComponent(slug)}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setState({
          slug: data.slug,
          label: data.label,
          path: data.path,
          bannerPlacement: data.bannerPlacement ?? null,
          content: data.content,
          banners: data.banners ?? [],
          status: data.status ?? "published",
        });
      })
      .catch((error) => toast(error instanceof Error ? error.message : "Không tải được dữ liệu"))
      .finally(() => setLoading(false));
  }, [slug, toast]);

  const updateContent = (key: string, value: unknown) => {
    setState((current) =>
      current
        ? { ...current, content: { ...current.content, [key]: value } as EditorState["content"] }
        : current,
    );
  };

  const save = async () => {
    if (!state) return;
    setSaving(true);
    try {
      const response = await fetch(`/api/cms/pages/${encodeURIComponent(slug)}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: state.content,
          banners: state.bannerPlacement ? state.banners : undefined,
          status: state.status,
        }),
      });
      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "Lưu thất bại");
      }
      toast(`Đã lưu nội dung ${state.label}`);
    } catch (error) {
      toast(error instanceof Error ? error.message : "Lưu thất bại");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="py-12 text-center text-sm text-zinc-500">Đang tải nội dung…</p>;
  }

  if (!state) {
    return <p className="py-12 text-center text-sm text-zinc-500">Không tải được dữ liệu.</p>;
  }

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const about = state.content as AboutPageContent;
  const afterSales = state.content as AfterSalesPageContent;
  const charging = state.content as ChargingPageContent;
  const energy = state.content as EnergyPageContent;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-zinc-500">
        <Link href="/admin/pages" className="hover:text-zinc-900">
          Nội dung trang
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-zinc-900">{state.label}</span>
      </div>

      <PageHeader
        title={state.label}
        description={`Chỉnh sửa nội dung trang ${state.path}`}
        action={
          <div className="flex items-center gap-2">
            <a
              href={`${siteUrl}${state.path}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center justify-center rounded-md border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-900 transition hover:bg-zinc-100"
            >
              <ExternalLink className="mr-1.5 h-4 w-4" />
              Xem trang public
            </a>
            <Button onClick={save} disabled={saving}>
              {saving ? "Đang lưu…" : "Lưu thay đổi"}
            </Button>
          </div>
        }
      />

      <Tabs defaultValue="content" className="space-y-4">
        <TabsList>
          <TabsTrigger value="content">Nội dung</TabsTrigger>
          {state.bannerPlacement ? <TabsTrigger value="banners">Banner</TabsTrigger> : null}
          {"faq" in state.content ? <TabsTrigger value="faq">FAQ</TabsTrigger> : null}
          <TabsTrigger value="publish">Xuất bản</TabsTrigger>
        </TabsList>

        <TabsContent value="content">
          <div className="rounded-xl border border-zinc-200 bg-white">
            {slug === "about" ? (
              <>
                <EditSection id="hero" title="Hero" subtitle="Tiêu đề và mô tả đầu trang">
                  <div className="grid gap-4 md:grid-cols-2">
                    <EditField label="Eyebrow">
                      <Input
                        value={about.hero?.eyebrow ?? ""}
                        onChange={(event) =>
                          updateContent("hero", { ...about.hero, eyebrow: event.target.value })
                        }
                      />
                    </EditField>
                    <ImagePathField
                      label="Ảnh hero"
                      value={about.hero?.image ?? ""}
                      onChange={(image) => updateContent("hero", { ...about.hero, image })}
                    />
                    <div className="md:col-span-2">
                      <EditField label="Tiêu đề">
                        <Input
                          value={about.hero?.title ?? ""}
                          onChange={(event) =>
                            updateContent("hero", { ...about.hero, title: event.target.value })
                          }
                        />
                      </EditField>
                    </div>
                    <div className="md:col-span-2">
                      <EditField label="Dòng nhấn">
                        <Input
                          value={about.hero?.subtitle ?? ""}
                          onChange={(event) =>
                            updateContent("hero", { ...about.hero, subtitle: event.target.value })
                          }
                        />
                      </EditField>
                    </div>
                  </div>
                </EditSection>

                <EditSection id="stats" title="Thống kê" subtitle="3 số liệu nổi bật trên hero">
                  <StatsEditor
                    items={about.stats ?? []}
                    onChange={(stats) => updateContent("stats", stats)}
                  />
                </EditSection>

                <EditSection id="mission" title="Sứ mệnh & Tầm nhìn">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-3">
                      <EditField label="Tiêu đề sứ mệnh">
                        <Input
                          value={about.mission?.title ?? ""}
                          onChange={(event) =>
                            updateContent("mission", { ...about.mission, title: event.target.value })
                          }
                        />
                      </EditField>
                      <EditField label="Nội dung sứ mệnh">
                        <Textarea
                          rows={4}
                          value={about.mission?.content ?? ""}
                          onChange={(event) =>
                            updateContent("mission", { ...about.mission, content: event.target.value })
                          }
                        />
                      </EditField>
                    </div>
                    <div className="space-y-3">
                      <EditField label="Tiêu đề tầm nhìn">
                        <Input
                          value={about.vision?.title ?? ""}
                          onChange={(event) =>
                            updateContent("vision", { ...about.vision, title: event.target.value })
                          }
                        />
                      </EditField>
                      <EditField label="Nội dung tầm nhìn">
                        <Textarea
                          rows={4}
                          value={about.vision?.content ?? ""}
                          onChange={(event) =>
                            updateContent("vision", { ...about.vision, content: event.target.value })
                          }
                        />
                      </EditField>
                    </div>
                  </div>
                </EditSection>

                <EditSection id="timeline" title="Timeline" subtitle="Các mốc phát triển">
                  <div className="space-y-4">
                    {(about.milestones ?? []).map((item, index) => (
                      <div key={index} className="rounded-lg border border-zinc-200 p-4">
                        <div className="grid gap-3 md:grid-cols-2">
                          <EditField label="Năm">
                            <Input
                              value={item.year}
                              onChange={(event) =>
                                updateContent(
                                  "milestones",
                                  (about.milestones ?? []).map((row, i) =>
                                    i === index ? { ...row, year: event.target.value } : row,
                                  ),
                                )
                              }
                            />
                          </EditField>
                          <ImagePathField
                            label="Ảnh"
                            value={item.image}
                            onChange={(image) =>
                              updateContent(
                                "milestones",
                                (about.milestones ?? []).map((row, i) =>
                                  i === index ? { ...row, image } : row,
                                ),
                              )
                            }
                          />
                          <div className="md:col-span-2">
                            <EditField label="Tiêu đề">
                              <Input
                                value={item.title}
                                onChange={(event) =>
                                  updateContent(
                                    "milestones",
                                    (about.milestones ?? []).map((row, i) =>
                                      i === index ? { ...row, title: event.target.value } : row,
                                    ),
                                  )
                                }
                              />
                            </EditField>
                          </div>
                          <div className="md:col-span-2">
                            <EditField label="Mô tả">
                              <Textarea
                                rows={2}
                                value={item.desc}
                                onChange={(event) =>
                                  updateContent(
                                    "milestones",
                                    (about.milestones ?? []).map((row, i) =>
                                      i === index ? { ...row, desc: event.target.value } : row,
                                    ),
                                  )
                                }
                              />
                            </EditField>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </EditSection>

                <EditSection id="why" title="Vì sao chọn chúng tôi">
                  <div className="space-y-4">
                    {(about.whyChoose ?? []).map((item, index) => (
                      <div key={index} className="rounded-lg border border-zinc-200 p-4">
                        <EditField label="Tiêu đề">
                          <Input
                            value={item.title}
                            onChange={(event) =>
                              updateContent(
                                "whyChoose",
                                (about.whyChoose ?? []).map((row, i) =>
                                  i === index ? { ...row, title: event.target.value } : row,
                                ),
                              )
                            }
                          />
                        </EditField>
                        <EditField label="Mô tả">
                          <Textarea
                            rows={2}
                            value={item.desc}
                            onChange={(event) =>
                              updateContent(
                                "whyChoose",
                                (about.whyChoose ?? []).map((row, i) =>
                                  i === index ? { ...row, desc: event.target.value } : row,
                                ),
                              )
                            }
                          />
                        </EditField>
                      </div>
                    ))}
                  </div>
                </EditSection>
              </>
            ) : null}

            {slug === "after-sales" ? (
              <>
                <EditSection id="services" title="Dịch vụ" subtitle="6 dịch vụ hậu mãi chính">
                  <div className="space-y-4">
                    {(afterSales.services ?? []).map((service, index) => (
                      <div key={index} className="rounded-lg border border-zinc-200 p-4">
                        <EditField label="Tiêu đề">
                          <Input
                            value={service.title}
                            onChange={(event) =>
                              updateContent(
                                "services",
                                (afterSales.services ?? []).map((row, i) =>
                                  i === index ? { ...row, title: event.target.value } : row,
                                ),
                              )
                            }
                          />
                        </EditField>
                        <EditField label="Mô tả">
                          <Textarea
                            rows={2}
                            value={service.desc}
                            onChange={(event) =>
                              updateContent(
                                "services",
                                (afterSales.services ?? []).map((row, i) =>
                                  i === index ? { ...row, desc: event.target.value } : row,
                                ),
                              )
                            }
                          />
                        </EditField>
                        <EditField label="Điểm nổi bật (mỗi dòng một mục)">
                          <Textarea
                            rows={4}
                            value={service.items.join("\n")}
                            onChange={(event) =>
                              updateContent(
                                "services",
                                (afterSales.services ?? []).map((row, i) =>
                                  i === index
                                    ? {
                                        ...row,
                                        items: event.target.value
                                          .split("\n")
                                          .map((line) => line.trim())
                                          .filter(Boolean),
                                      }
                                    : row,
                                ),
                              )
                            }
                          />
                        </EditField>
                      </div>
                    ))}
                  </div>
                </EditSection>

                <EditSection id="warranty" title="Bảo hành">
                  <div className="space-y-4">
                    {(afterSales.warranty ?? []).map((policy, index) => (
                      <div key={index} className="rounded-lg border border-zinc-200 p-4">
                        <div className="grid gap-3 md:grid-cols-2">
                          <EditField label="Tiêu đề">
                            <Input
                              value={policy.title}
                              onChange={(event) =>
                                updateContent(
                                  "warranty",
                                  (afterSales.warranty ?? []).map((row, i) =>
                                    i === index ? { ...row, title: event.target.value } : row,
                                  ),
                                )
                              }
                            />
                          </EditField>
                          <EditField label="Nhấn mạnh">
                            <Input
                              value={policy.highlight}
                              onChange={(event) =>
                                updateContent(
                                  "warranty",
                                  (afterSales.warranty ?? []).map((row, i) =>
                                    i === index ? { ...row, highlight: event.target.value } : row,
                                  ),
                                )
                              }
                            />
                          </EditField>
                        </div>
                        <EditField label="Chi tiết (mỗi dòng một mục)">
                          <Textarea
                            rows={4}
                            value={policy.items.join("\n")}
                            onChange={(event) =>
                              updateContent(
                                "warranty",
                                (afterSales.warranty ?? []).map((row, i) =>
                                  i === index
                                    ? {
                                        ...row,
                                        items: event.target.value
                                          .split("\n")
                                          .map((line) => line.trim())
                                          .filter(Boolean),
                                      }
                                    : row,
                                ),
                              )
                            }
                          />
                        </EditField>
                      </div>
                    ))}
                  </div>
                </EditSection>
              </>
            ) : null}

            {slug === "charging" ? (
              <>
                <EditSection id="stats" title="Thống kê mạng lưới">
                  <StatsEditor
                    items={charging.stats ?? []}
                    onChange={(stats) => updateContent("stats", stats)}
                  />
                </EditSection>

                <EditSection id="products" title="Sản phẩm sạc">
                  <div className="space-y-4">
                    {(charging.products ?? []).map((product, index) => (
                      <div key={product.id} className="rounded-lg border border-zinc-200 p-4">
                        <p className="mb-3 text-sm font-semibold text-zinc-900">{product.name}</p>
                        <div className="grid gap-3 md:grid-cols-2">
                          <EditField label="Tên">
                            <Input
                              value={product.name}
                              onChange={(event) =>
                                updateContent(
                                  "products",
                                  (charging.products ?? []).map((row, i) =>
                                    i === index ? { ...row, name: event.target.value } : row,
                                  ),
                                )
                              }
                            />
                          </EditField>
                          <EditField label="Giá (VNĐ)">
                            <Input
                              type="number"
                              value={product.price}
                              onChange={(event) =>
                                updateContent(
                                  "products",
                                  (charging.products ?? []).map((row, i) =>
                                    i === index
                                      ? { ...row, price: Number(event.target.value) || 0 }
                                      : row,
                                  ),
                                )
                              }
                            />
                          </EditField>
                          <div className="md:col-span-2">
                            <EditField label="Mô tả">
                              <Textarea
                                rows={2}
                                value={product.description}
                                onChange={(event) =>
                                  updateContent(
                                    "products",
                                    (charging.products ?? []).map((row, i) =>
                                      i === index ? { ...row, description: event.target.value } : row,
                                    ),
                                  )
                                }
                              />
                            </EditField>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </EditSection>
              </>
            ) : null}

            {slug === "energy" ? (
              <>
                <EditSection id="hero" title="Hero">
                  <div className="grid gap-4 md:grid-cols-2">
                    <EditField label="Eyebrow">
                      <Input
                        value={energy.hero?.eyebrow ?? ""}
                        onChange={(event) =>
                          updateContent("hero", { ...energy.hero, eyebrow: event.target.value })
                        }
                      />
                    </EditField>
                    <ImagePathField
                      label="Ảnh hero"
                      value={energy.hero?.image ?? ""}
                      onChange={(image) => updateContent("hero", { ...energy.hero, image })}
                    />
                    <div className="md:col-span-2">
                      <EditField label="Tiêu đề">
                        <Input
                          value={energy.hero?.title ?? ""}
                          onChange={(event) =>
                            updateContent("hero", { ...energy.hero, title: event.target.value })
                          }
                        />
                      </EditField>
                    </div>
                    <div className="md:col-span-2">
                      <EditField label="Mô tả">
                        <Textarea
                          rows={3}
                          value={energy.hero?.subtitle ?? ""}
                          onChange={(event) =>
                            updateContent("hero", { ...energy.hero, subtitle: event.target.value })
                          }
                        />
                      </EditField>
                    </div>
                  </div>
                </EditSection>

                <EditSection id="stats" title="Thống kê">
                  <StatsEditor
                    items={energy.stats ?? []}
                    onChange={(stats) => updateContent("stats", stats)}
                  />
                </EditSection>

                <EditSection id="solutions" title="Giải pháp">
                  <div className="space-y-4">
                    {(energy.solutions ?? []).map((solution, index) => (
                      <div key={solution.id} className="rounded-lg border border-zinc-200 p-4">
                        <EditField label="Tiêu đề">
                          <Input
                            value={solution.title}
                            onChange={(event) =>
                              updateContent(
                                "solutions",
                                (energy.solutions ?? []).map((row, i) =>
                                  i === index ? { ...row, title: event.target.value } : row,
                                ),
                              )
                            }
                          />
                        </EditField>
                        <EditField label="Mô tả">
                          <Textarea
                            rows={2}
                            value={solution.desc}
                            onChange={(event) =>
                              updateContent(
                                "solutions",
                                (energy.solutions ?? []).map((row, i) =>
                                  i === index ? { ...row, desc: event.target.value } : row,
                                ),
                              )
                            }
                          />
                        </EditField>
                      </div>
                    ))}
                  </div>
                </EditSection>
              </>
            ) : null}
          </div>
        </TabsContent>

        {state.bannerPlacement ? (
          <TabsContent value="banners">
            <div className="rounded-xl border border-zinc-200 bg-white">
              <EditSection id="banners" title="Banner hero" subtitle="Carousel đầu trang">
                <BannerEditor
                  banners={state.banners}
                  onChange={(banners) => setState((current) => (current ? { ...current, banners } : current))}
                />
              </EditSection>
            </div>
          </TabsContent>
        ) : null}

        {"faq" in state.content ? (
          <TabsContent value="faq">
            <div className="rounded-xl border border-zinc-200 bg-white">
              <EditSection id="faq" title="Câu hỏi thường gặp">
                <FaqEditor
                  items={(state.content as { faq?: CmsFaqItem[] }).faq ?? []}
                  onChange={(faq) => updateContent("faq", faq)}
                />
              </EditSection>
            </div>
          </TabsContent>
        ) : null}

        <TabsContent value="publish">
          <div className="rounded-xl border border-zinc-200 bg-white p-6">
            <EditField label="Trạng thái" hint="Chỉ trang Published mới hiển thị nội dung CMS trên website">
              <select
                value={state.status}
                onChange={(event) =>
                  setState((current) =>
                    current
                      ? { ...current, status: event.target.value as "draft" | "published" }
                      : current,
                  )
                }
                className="h-9 w-full max-w-xs rounded-md border border-zinc-200 bg-white px-3 text-sm"
              >
                <option value="draft">Nháp</option>
                <option value="published">Đã xuất bản</option>
              </select>
            </EditField>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
