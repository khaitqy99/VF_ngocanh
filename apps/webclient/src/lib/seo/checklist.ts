import type { SeoRecord } from "./types";
import type { SeoAutoFill } from "./resolve";
import { resolveSeoContent } from "./resolve";

export type SeoCheckStatus = "pass" | "warn" | "fail";

export type SeoCheckItem = {
  id: string;
  label: string;
  status: SeoCheckStatus;
  detail?: string;
};

export type SeoChecklistResult = {
  score: number;
  items: SeoCheckItem[];
  optimized: boolean;
};

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function titleLengthStatus(len: number): SeoCheckStatus {
  if (len === 0) return "fail";
  if (len < 30 || len > 60) return "warn";
  return "pass";
}

function descriptionLengthStatus(len: number): SeoCheckStatus {
  if (len === 0) return "fail";
  if (len < 120 || len > 160) return "warn";
  return "pass";
}

/** Build an on-page SEO checklist for admin preview (meta lengths, keyword, OG, robots). */
export function buildSeoChecklist(
  seo: SeoRecord | null | undefined,
  defaults: SeoAutoFill,
): SeoChecklistResult {
  const resolved = resolveSeoContent(seo, defaults);
  const title = resolved.title.trim();
  const description = resolved.description.trim();
  const keyword = seo?.focusKeyword?.trim().toLowerCase() ?? "";
  const hasCustomTitle = Boolean(seo?.metaTitle?.trim());
  const hasCustomDescription = Boolean(seo?.metaDescription?.trim());
  const hasOgImage = Boolean(resolved.ogImage?.trim());
  const hasCanonical = Boolean(seo?.canonical?.trim() || defaults.path);
  const noindex = resolved.noindex;

  const items: SeoCheckItem[] = [
    {
      id: "meta-title",
      label: "Meta title",
      status: titleLengthStatus(title.length),
      detail: hasCustomTitle
        ? `${title.length} ký tự (khuyến nghị 30–60)`
        : `Đang dùng mặc định · ${title.length} ký tự`,
    },
    {
      id: "meta-description",
      label: "Meta description",
      status: descriptionLengthStatus(description.length),
      detail: hasCustomDescription
        ? `${description.length} ký tự (khuyến nghị 120–160)`
        : `Đang dùng mặc định · ${description.length} ký tự`,
    },
    {
      id: "focus-keyword-title",
      label: "Focus keyword trong title",
      status: !keyword ? "warn" : title.toLowerCase().includes(keyword) ? "pass" : "fail",
      detail: keyword
        ? title.toLowerCase().includes(keyword)
          ? "Title chứa focus keyword"
          : "Title chưa chứa focus keyword"
        : "Chưa nhập focus keyword",
    },
    {
      id: "focus-keyword-description",
      label: "Focus keyword trong mô tả",
      status: !keyword ? "warn" : description.toLowerCase().includes(keyword) ? "pass" : "warn",
      detail: keyword
        ? description.toLowerCase().includes(keyword)
          ? "Mô tả chứa focus keyword"
          : "Mô tả chưa chứa focus keyword"
        : "Chưa nhập focus keyword",
    },
    {
      id: "og-image",
      label: "OG image",
      status: hasOgImage ? "pass" : "fail",
      detail: hasOgImage ? "Đã có ảnh chia sẻ (khuyến nghị 1200×630)" : "Thiếu ảnh Open Graph",
    },
    {
      id: "canonical",
      label: "Canonical URL",
      status: hasCanonical ? "pass" : "warn",
      detail: seo?.canonical?.trim()
        ? "Đã ghi đè canonical"
        : defaults.path
          ? `Mặc định: ${defaults.path}`
          : "Chưa có canonical",
    },
    {
      id: "indexability",
      label: "Indexability",
      status: noindex ? "warn" : "pass",
      detail: noindex ? "Trang đang noindex" : "Cho phép Google index",
    },
  ];

  let score = 0;
  for (const item of items) {
    if (item.status === "pass") score += 100 / items.length;
    else if (item.status === "warn") score += 50 / items.length;
  }

  const optimized =
    hasCustomTitle &&
    hasCustomDescription &&
    hasOgImage &&
    titleLengthStatus(title.length) !== "fail" &&
    descriptionLengthStatus(description.length) !== "fail" &&
    !noindex;

  return { score: clampScore(score), items, optimized };
}
