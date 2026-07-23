"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronRight, Eye, Save, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { useToast } from "@/components/admin/ToastProvider";
import { RichTextEditor, type RichTextEditorHandle } from "@/components/admin/RichTextEditor";
import { GlobalMediaPicker, NewsCoverImageField } from "@/components/admin/NewsMediaFields";
import { RelatedProductsPicker } from "@/components/admin/RelatedProductsPicker";
import { SeoForm } from "@/components/admin/seo/SeoForm";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Textarea } from "@/components/ui/core";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/complex";
import { slugify } from "@webclient/lib/seo/slugs";
import { renderArticleHtml } from "@webclient/lib/cms/news-sanitize";
import {
  NEWS_CATEGORIES,
  type NewsArticle,
  type NewsBodyFormat,
  type NewsRelatedProduct,
  type PublishStatus,
} from "@webclient/lib/cms/news-types";
import { getPublishStatusLabel } from "@webclient/lib/cms/news-publish";
import type { SeoRecord } from "@/lib/seo";
import type { SeoAutoFill } from "@/lib/seo/resolve";

type ProductOption = { id: string; name: string };
type AdminUserOption = { id: string; email: string; fullName: string | null };

const EMPTY_FORM = {
  title: "",
  slug: "",
  excerpt: "",
  body: "",
  bodyFormat: "html" as NewsBodyFormat,
  category: "general",
  coverImageUrl: "",
  coverImageAlt: "",
  status: "draft" as PublishStatus,
  publishedAt: "",
  isFeatured: false,
  seo: {} as SeoRecord,
  relatedProducts: [] as NewsRelatedProduct[],
  authorId: "",
  authorName: "",
};

function NewsPreviewPanel({
  form,
}: {
  form: typeof EMPTY_FORM;
}) {
  const html = useMemo(
    () => renderArticleHtml({ body: form.body, bodyFormat: form.bodyFormat }),
    [form.body, form.bodyFormat],
  );

  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-zinc-200 bg-white p-6 md:p-8">
      <p className="text-sm font-medium text-red-600">
        {NEWS_CATEGORIES.find((cat) => cat.value === form.category)?.label ?? "Tin chung"}
      </p>
      <h1 className="mt-2 text-3xl font-bold text-zinc-900">{form.title || "Tiêu đề bài viết"}</h1>
      {form.excerpt ? <p className="mt-4 text-lg text-zinc-600">{form.excerpt}</p> : null}
      {form.coverImageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={form.coverImageUrl}
          alt={form.coverImageAlt || form.title}
          className="mt-8 aspect-[16/9] w-full rounded-3xl object-cover"
        />
      ) : null}
      <div
        className="mt-8 space-y-4 text-base leading-8 text-zinc-700 [&_a]:text-red-600 [&_h2]:text-2xl [&_h2]:font-semibold [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6"
        dangerouslySetInnerHTML={{ __html: html || "<p>Nội dung bài viết...</p>" }}
      />
    </div>
  );
}

export function NewsEditorClient({ articleId }: { articleId?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const isNew = !articleId;
  const initialTab = searchParams.get("tab") === "seo" ? "seo" : "content";
  const [form, setForm] = useState(EMPTY_FORM);
  const [slugTouched, setSlugTouched] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [bodyImagePickerOpen, setBodyImagePickerOpen] = useState(false);
  const [cars, setCars] = useState<ProductOption[]>([]);
  const [scooters, setScooters] = useState<ProductOption[]>([]);
  const [accessories, setAccessories] = useState<ProductOption[]>([]);
  const [users, setUsers] = useState<AdminUserOption[]>([]);
  const editorRef = useRef<RichTextEditorHandle>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/news/catalog", { credentials: "include" }).then((r) => r.json()),
      fetch("/api/users", { credentials: "include" }).then((r) => r.json()),
    ])
      .then(([catalogData, usersData]) => {
        setCars(catalogData.cars ?? []);
        setScooters(catalogData.scooters ?? []);
        setAccessories(catalogData.accessories ?? []);
        setUsers(
          (usersData.users ?? []).map((user: AdminUserOption) => ({
            id: user.id,
            email: user.email,
            fullName: user.fullName,
          })),
        );
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!articleId) return;
    fetch(`/api/news/${articleId}`, { credentials: "include" })
      .then((r) => {
        if (!r.ok) throw new Error("load failed");
        return r.json();
      })
      .then((data: { article: NewsArticle }) => {
        const article = data.article;
        setForm({
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt ?? "",
          body: article.body ?? "",
          bodyFormat: article.bodyFormat,
          category: article.category ?? "general",
          coverImageUrl: article.coverImageUrl ?? "",
          coverImageAlt: article.coverImageAlt ?? "",
          status: article.status,
          publishedAt: article.publishedAt?.slice(0, 16) ?? "",
          isFeatured: article.isFeatured,
          seo: article.seo ?? {},
          relatedProducts: article.relatedProducts ?? [],
          authorId: article.authorId ?? "",
          authorName: article.authorName ?? "",
        });
        setSlugTouched(true);
      })
      .catch(() => toast("Không tải được bài viết"))
      .finally(() => setLoading(false));
  }, [articleId, toast]);

  const seoDefaults: SeoAutoFill = useMemo(
    () => ({
      title: form.title,
      description: form.excerpt || form.title,
      image: form.coverImageUrl || "/images/showroom.webp",
      path: `/tin-tuc/${form.slug || slugify(form.title || "bai-viet")}`,
    }),
    [form.title, form.excerpt, form.coverImageUrl, form.slug],
  );

  const updateField = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "title" && !slugTouched) {
        next.slug = slugify(String(value));
      }
      return next;
    });
  };

  const save = async (statusOverride?: PublishStatus) => {
    if (!form.title.trim()) {
      toast("Vui lòng nhập tiêu đề");
      return;
    }

    const nextStatus = statusOverride ?? form.status;
    if (nextStatus === "scheduled" && !form.publishedAt) {
      toast("Vui lòng chọn thời gian lên lịch đăng");
      return;
    }

    if (nextStatus === "published") {
      const missingTitle = !form.seo.metaTitle?.trim();
      const missingDesc = !form.seo.metaDescription?.trim();
      const missingOg = !form.seo.ogImage?.trim() && !form.coverImageUrl.trim();
      if (missingTitle || missingDesc || missingOg) {
        const lines = [
          "SEO bài viết chưa đầy đủ:",
          missingTitle ? "• Thiếu meta title" : null,
          missingDesc ? "• Thiếu meta description" : null,
          missingOg ? "• Thiếu OG image / ảnh bìa" : null,
          "",
          "Vẫn xuất bản?",
        ].filter((line): line is string => line !== null);
        if (!window.confirm(lines.join("\n"))) return;
      }
    }

    setSaving(true);
    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim() || slugify(form.title),
      excerpt: form.excerpt.trim() || null,
      body: form.body.trim() || null,
      bodyFormat: form.bodyFormat,
      category: form.category,
      coverImageUrl: form.coverImageUrl.trim() || null,
      coverImageAlt: form.coverImageAlt.trim() || null,
      status: nextStatus,
      publishedAt: form.publishedAt ? new Date(form.publishedAt).toISOString() : null,
      isFeatured: form.isFeatured,
      seo: form.seo,
      relatedProducts: form.relatedProducts,
      authorId: form.authorId || null,
      authorName: form.authorName || null,
    };

    try {
      const response = await fetch(isNew ? "/api/news" : `/api/news/${articleId}`, {
        method: isNew ? "POST" : "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Lưu thất bại");

      toast(
        nextStatus === "published"
          ? "Đã xuất bản bài viết"
          : nextStatus === "scheduled"
            ? "Đã lên lịch bài viết"
            : "Đã lưu bài viết",
      );
      if (data.revalidated === false) {
        toast(
          "Đã lưu nhưng chưa làm mới cache website — kiểm tra NEXT_PUBLIC_SITE_URL và REVALIDATION_SECRET",
          "error",
        );
      }
      if (isNew && data.article?.id) {
        router.replace(`/admin/posts/${data.article.id}`);
      } else if (data.article) {
        setForm((prev) => ({
          ...prev,
          slug: data.article.slug,
          status: data.article.status,
        }));
      }
    } catch (error) {
      toast(error instanceof Error ? error.message : "Lưu thất bại");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!articleId || !confirm("Xóa bài viết này?")) return;
    const response = await fetch(`/api/news/${articleId}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!response.ok) {
      toast("Xóa thất bại");
      return;
    }
    toast("Đã xóa bài viết");
    router.push("/admin/posts");
  };

  if (loading) {
    return <p className="text-sm text-zinc-500">Đang tải bài viết...</p>;
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-2 text-sm text-zinc-500">
        <Link href="/admin/posts" className="hover:text-zinc-900">
          Tin tức
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-zinc-900">{isNew ? "Bài mới" : "Chỉnh sửa"}</span>
      </div>

      <PageHeader
        title={isNew ? "Viết bài mới" : "Chỉnh sửa bài viết"}
        description="Nội dung hiển thị tại /tin-tuc/[slug]"
        action={
          <div className="flex flex-wrap gap-2">
            {!isNew ? (
              <Button type="button" variant="outline" onClick={handleDelete}>
                <Trash2 className="mr-1.5 h-4 w-4" />
                Xóa
              </Button>
            ) : null}
            <Button type="button" variant="outline" disabled={saving} onClick={() => save("draft")}>
              Lưu nháp
            </Button>
            <Button type="button" variant="outline" disabled={saving} onClick={() => save("scheduled")}>
              Lên lịch
            </Button>
            <Button type="button" disabled={saving} onClick={() => save("published")}>
              <Save className="mr-1.5 h-4 w-4" />
              Xuất bản
            </Button>
          </div>
        }
      />

      <Tabs defaultValue={initialTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="content">Nội dung</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="preview">
            <Eye className="mr-1.5 h-4 w-4" />
            Xem trước
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <Card>
              <CardHeader>
                <CardTitle>Nội dung</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tiêu đề</label>
                  <Input
                    value={form.title}
                    onChange={(e) => updateField("title", e.target.value)}
                    placeholder="Tiêu đề bài viết"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Slug URL</label>
                  <Input
                    value={form.slug}
                    onChange={(e) => {
                      setSlugTouched(true);
                      updateField("slug", e.target.value);
                    }}
                    placeholder="uu-dai-vf3-thang-7"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Mô tả ngắn</label>
                  <Textarea
                    value={form.excerpt}
                    onChange={(e) => updateField("excerpt", e.target.value)}
                    rows={3}
                    placeholder="Tóm tắt hiển thị trên danh sách tin tức"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Ảnh bìa</label>
                  <NewsCoverImageField
                    value={form.coverImageUrl}
                    onChange={(value) => updateField("coverImageUrl", value)}
                    altValue={form.coverImageAlt}
                    onAltChange={(alt) => updateField("coverImageAlt", alt)}
                    articleSlug={form.slug.trim() || undefined}
                  />
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-600">Alt ảnh bìa (SEO)</label>
                    <Input
                      value={form.coverImageAlt}
                      onChange={(e) => updateField("coverImageAlt", e.target.value)}
                      placeholder={form.title || "Mô tả ngắn ảnh bìa"}
                    />
                    <p className="text-[11px] text-zinc-500">
                      Để trống → dùng tiêu đề bài viết. Nên mô tả nội dung ảnh, không nhồi từ khóa.
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nội dung bài viết</label>
                  <RichTextEditor
                    ref={editorRef}
                    value={form.body}
                    onChange={(html) => {
                      updateField("body", html);
                      updateField("bodyFormat", "html");
                    }}
                    onPickImage={() => setBodyImagePickerOpen(true)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sản phẩm liên quan</label>
                  <RelatedProductsPicker
                    value={form.relatedProducts}
                    onChange={(value) => updateField("relatedProducts", value)}
                    cars={cars}
                    scooters={scooters}
                    accessories={accessories}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="h-fit">
              <CardHeader>
                <CardTitle>Xuất bản</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Danh mục</label>
                  <select
                    value={form.category}
                    onChange={(e) => updateField("category", e.target.value)}
                    className="h-9 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm"
                  >
                    {NEWS_CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Trạng thái</label>
                  <select
                    value={form.status}
                    onChange={(e) => updateField("status", e.target.value as PublishStatus)}
                    className="h-9 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm"
                  >
                    <option value="draft">Nháp</option>
                    <option value="published">Đã đăng</option>
                    <option value="scheduled">Lên lịch</option>
                    <option value="archived">Lưu trữ</option>
                  </select>
                  <p className="text-xs text-zinc-500">{getPublishStatusLabel(form.status)}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Ngày đăng / lên lịch</label>
                  <Input
                    type="datetime-local"
                    value={form.publishedAt}
                    onChange={(e) => updateField("publishedAt", e.target.value)}
                  />
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) => updateField("isFeatured", e.target.checked)}
                  />
                  Ghim bài nổi bật trên trang tin tức
                </label>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tác giả</label>
                  <select
                    value={form.authorId}
                    onChange={(e) => {
                      const user = users.find((item) => item.id === e.target.value);
                      updateField("authorId", e.target.value);
                      updateField("authorName", user?.fullName || "Admin");
                    }}
                    className="h-9 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm"
                  >
                    <option value="">Chưa chọn</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.fullName || user.email}
                      </option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="seo">
          <SeoForm
            value={form.seo}
            defaults={seoDefaults}
            slug={form.slug}
            onChange={(seo) => updateField("seo", seo)}
            onSave={() => save()}
            saving={saving}
          />
        </TabsContent>

        <TabsContent value="preview">
          <NewsPreviewPanel form={form} />
        </TabsContent>
      </Tabs>

      <GlobalMediaPicker
        open={bodyImagePickerOpen}
        onClose={() => setBodyImagePickerOpen(false)}
        onSelect={(path) => editorRef.current?.insertImageAtCursor(path)}
        title="Chèn ảnh vào nội dung"
        defaultCategory="news"
        defaultFolderSlug={form.slug.trim() || "chung"}
      />
    </div>
  );
}
